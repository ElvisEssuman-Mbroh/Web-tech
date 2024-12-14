let currentEvents = [];
const eventsGrid = document.getElementById('eventsGrid');
const modal = document.getElementById('eventModal');
const modalContent = document.getElementById('modalContent');
let selectedEventId = null;
const gridView = document.getElementById('gridView');
const calendarView = document.getElementById('calendarView');
const gridViewBtn = document.getElementById('gridViewBtn');
const calendarViewBtn = document.getElementById('calendarViewBtn');

// Update the filter buttons section
function updateFilterButtons(activeFilter) {
    const buttons = {
        all: document.getElementById('allEventsBtn'),
        recommended: document.getElementById('forYouBtn'),
        my: document.getElementById('myEventsBtn')
    };

    // Define the classes
    const inactiveClasses = 'flex-1 px-6 py-4 text-center font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent transition-all duration-200';
    const activeClasses = 'flex-1 px-6 py-4 text-center font-medium text-blue-600 border-b-2 border-blue-600 transition-all duration-200';

    // Reset all buttons to inactive
    Object.values(buttons).forEach(btn => {
        if (btn) {
            btn.className = inactiveClasses;
        }
    });

    // Set active button
    const buttonKey = activeFilter === 'recommended' ? 'recommended' : 
                     activeFilter === 'my' ? 'my' : 'all';
                     
    if (buttons[buttonKey]) {
        buttons[buttonKey].className = activeClasses;
    }
}

// Show loading state
function showLoading() {
    const skeleton = document.getElementById('loadingSkeleton').content;
    gridView.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        gridView.appendChild(skeleton.cloneNode(true));
    }
}

// Add this function to format events for calendar
function formatEventsForCalendar(events) {
    return events.map(event => {
        // Format the date and time properly
        const eventDate = event.date.split('T')[0]; // Get just the date part
        const eventDateTime = `${eventDate}T${event.time}`; // Combine date and time

        return {
            id: event._id, // Important for event clicking
            title: event.name,
            start: eventDateTime,
            allDay: false,
            extendedProps: {
                description: event.description,
                location: event.location,
                availableSeats: event.availableSeats
            }
        };
    });
}

// Update fetchEvents to handle calendar
async function fetchEvents(filter = 'all') {
    try {
        showLoading();
        
        const token = localStorage.getItem('token');
        const headers = token ? { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {};
        
        let url;
        switch(filter) {
            case 'my':
                url = '/api/events/my-events';
                break;
            case 'recommended':
                url = '/api/events/for-you';
                break;
            default:
                url = '/api/events';
        }
        
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        
        const events = await response.json();
        currentEvents = events;
        
        // Update grid view
        displayEvents(events);
        
        // Update calendar if it exists and is initialized
        if (window.calendar && typeof window.calendar.removeAllEvents === 'function') {
            const calendarEvents = formatEventsForCalendar(events);
            window.calendar.removeAllEvents();
            window.calendar.addEventSource(calendarEvents);
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        showError(error.message);
    }
}

// Display events in grid
function displayEvents(events) {
    if (!events.length) {
        gridView.innerHTML = `
            <div class="col-span-full p-8 text-center">
                <div class="mb-4">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900">No events found</h3>
                <p class="mt-2 text-sm text-gray-500">Check back later for new events.</p>
            </div>
        `;
        return;
    }

    gridView.innerHTML = events.map(event => `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span class="text-white text-xl font-semibold">${event.name}</span>
            </div>

            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-3">${event.name}</h3>
                <p class="text-gray-600 mb-6 line-clamp-2">${event.description}</p>

                <div class="space-y-3 mb-6">
                    <div class="flex items-center text-gray-700">
                        <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-semibold">Date</p>
                            <p class="text-sm text-gray-600">${new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                month: 'short', 
                                day: 'numeric'
                            })}</p>
                        </div>
                    </div>

                    <div class="flex items-center text-gray-700">
                        <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-semibold">Time</p>
                            <p class="text-sm text-gray-600">${event.time}</p>
                        </div>
                    </div>

                    <div class="flex items-center text-gray-700">
                        <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-semibold">Location</p>
                            <p class="text-sm text-gray-600">${event.location}</p>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end mb-4 text-gray-600">
                    <svg class="w-5 h-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span class="text-sm font-medium">${event.availableSeats} seats available</span>
                </div>

                <button onclick="bookEvent('${event._id}')"
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg 
                    transform hover:-translate-y-0.5 transition-all duration-200 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    flex items-center justify-center space-x-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Book Now</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Show event details in modal
function showEventDetails(eventId) {
    const event = currentEvents.find(e => e._id === eventId);
    if (!event) return;

    selectedEventId = eventId;
    
    modalContent.innerHTML = `
        ${event.imageUrl ? `
            <img src="${event.imageUrl}" 
                alt="${event.name}"
                class="w-full h-64 object-cover rounded-lg mb-4"
            />
        ` : ''}
        <h2 class="text-2xl font-bold text-gray-800 mb-4">${event.name}</h2>
        <div class="space-y-4">
            <p class="text-gray-600">${event.description}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                    <p class="font-medium text-gray-800">Date & Time</p>
                    <p class="text-gray-600">${new Date(event.date).toLocaleDateString()}</p>
                    <p class="text-gray-600">${event.time}</p>
                </div>
                <div class="space-y-2">
                    <p class="font-medium text-gray-800">Location</p>
                    <p class="text-gray-600">${event.location}</p>
                </div>
                <div class="space-y-2">
                    <p class="font-medium text-gray-800">Available Seats</p>
                    <p class="text-gray-600">${event.availableSeats || 'Unlimited'}</p>
                </div>
            </div>
            <button onclick="bookEvent('${event._id}')" 
                class="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Book Event
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    modal.classList.add('hidden');
    selectedEventId = null;
}

// Book event
async function bookEvent(eventId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`/api/events/rsvp/${eventId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to book event');
        }

        // Show success message
        alert('Event booked successfully!');
        
        // Refresh events list
        await fetchEvents();
        
        // Close modal if open
        if (modal && !modal.classList.contains('hidden')) {
            closeModal();
        }

    } catch (error) {
        console.error('Booking error:', error);
        alert(error.message || 'Failed to book event');
    }
}

// Initialize buttons
function initializeButtons() {
    const allBtn = document.getElementById('allEventsBtn');
    const forYouBtn = document.getElementById('forYouBtn');
    const myBtn = document.getElementById('myEventsBtn');

    if (allBtn) {
        allBtn.onclick = () => {
            updateFilterButtons('all');
            fetchEvents('all');
        };
    }

    if (forYouBtn) {
        forYouBtn.onclick = () => {
            updateFilterButtons('recommended');
            fetchEvents('recommended');
        };
    }

    if (myBtn) {
        myBtn.onclick = () => {
            updateFilterButtons('my');
            fetchEvents('my');
        };
    }

    // Set initial state
    updateFilterButtons('all');
    fetchEvents('all');

    // View switching buttons
    gridViewBtn.onclick = () => switchView('grid');
    calendarViewBtn.onclick = () => switchView('calendar');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeButtons);

function showError(message) {
    gridView.innerHTML = `
        <div class="col-span-full p-8 text-center">
            <div class="mb-4">
                <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">Error Loading Events</h3>
            <p class="mt-2 text-sm text-gray-500">${message}</p>
            <button onclick="fetchEvents()" 
                class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Retry
            </button>
        </div>
    `;
}

// Add this function to handle view switching
function switchView(view) {
    if (view === 'calendar') {
        gridView.classList.add('hidden');
        calendarView.classList.remove('hidden');
        gridViewBtn.classList.remove('text-blue-600', 'border-blue-600');
        gridViewBtn.classList.add('text-gray-700', 'border-transparent');
        calendarViewBtn.classList.add('text-blue-600', 'border-blue-600');
        calendarViewBtn.classList.remove('text-gray-700', 'border-transparent');
        if (window.calendar) {
            window.calendar.render();
        }
    } else {
        calendarView.classList.add('hidden');
        gridView.classList.remove('hidden');
        calendarViewBtn.classList.remove('text-blue-600', 'border-blue-600');
        calendarViewBtn.classList.add('text-gray-700', 'border-transparent');
        gridViewBtn.classList.add('text-blue-600', 'border-blue-600');
        gridViewBtn.classList.remove('text-gray-700', 'border-transparent');
    }
}
  