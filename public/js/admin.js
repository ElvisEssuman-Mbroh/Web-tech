const loginForm = document.getElementById('adminLoginForm');
const loginSection = document.getElementById('loginSection');
const adminDashboard = document.getElementById('adminDashboard');
const eventForm = document.getElementById('eventForm');
const eventList = document.getElementById('eventList');
let token = localStorage.getItem('token');

// Check admin authentication
function checkAdminAuth() {
    token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
        loginSection.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
        return false;
    }
    
    loginSection.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    fetchEvents(); // Fetch events when admin is authenticated
    return true;
}

// Handle admin login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const errorMessage = document.querySelector('#loginSection .error-message') || 
        document.createElement('div');
    
    errorMessage.className = 'error-message text-red-500 mt-4 text-center';
    if (!document.querySelector('#loginSection .error-message')) {
        loginForm.appendChild(errorMessage);
    }

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store the token and role
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', 'admin');
        token = data.token;

        // Hide login form and show dashboard
        loginSection.classList.add('hidden');
        adminDashboard.classList.remove('hidden');

        // Fetch events after successful login
        await fetchEvents();

    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message;
    }
});

// Add this function to calculate dashboard stats
function updateDashboardStats(events) {
    const now = new Date();
    const activeEvents = events.filter(event => new Date(event.date) >= now);
    
    const totalBookings = events.reduce((sum, event) => 
        sum + (event.capacity - event.availableSeats), 0);
    
    const totalAvailableSeats = events.reduce((sum, event) => 
        sum + event.availableSeats, 0);

    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('activeEvents').textContent = activeEvents.length;
    document.getElementById('totalAvailableSeats').textContent = totalAvailableSeats;
}

// Update the fetchEvents function
async function fetchEvents() {
    if (!token) return;
    
    try {
        const response = await fetch('/api/events', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch events');
        }

        const events = await response.json();
        console.log('Fetched events:', events);
        updateEventList(events);
        updateDashboardStats(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        eventList.innerHTML = `
            <div class="text-center text-red-500">
                Failed to load events. ${error.message}
            </div>
        `;
    }
}

// Create/Update Event
eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const eventId = document.getElementById('eventId').value;
    
    // Add all form fields to FormData
    formData.append('name', document.getElementById('name').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('date', document.getElementById('date').value);
    formData.append('time', document.getElementById('time').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('capacity', document.getElementById('capacity').value);
    
    // Add image if selected
    const imageInput = document.getElementById('image');
    if (imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }

    try {
        const response = await fetch(
            eventId 
                ? `/api/events/${eventId}`
                : '/api/events',
            {
                method: eventId ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData // Send as FormData instead of JSON
            }
        );

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to save event');
        }

        alert(eventId ? 'Event updated successfully!' : 'Event created successfully!');
        eventForm.reset();
        document.getElementById('eventId').value = '';
        await fetchEvents();
    } catch (error) {
        console.error('Error saving event:', error);
        alert(error.message);
    }
});

// Edit Event
async function editEvent(id) {
    try {
        const response = await fetch(`/api/events/${id}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch event details');
        }

        const event = await response.json();
        
        document.getElementById('eventId').value = event._id;
        document.getElementById('name').value = event.name;
        document.getElementById('description').value = event.description;
        document.getElementById('date').value = new Date(event.date).toISOString().split('T')[0];
        document.getElementById('time').value = event.time;
        document.getElementById('location').value = event.location;
        document.getElementById('capacity').value = event.capacity;
    } catch (error) {
        console.error('Error editing event:', error);
        alert('Failed to load event details');
    }
}

// Delete Event
async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        const response = await fetch(`/api/events/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete event');
        }

        alert('Event deleted successfully!');
        await fetchEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
    }
}

// Update the event list display to show images
function updateEventList(events) {
    eventList.innerHTML = events.map(event => `
        <div class="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 mb-4">
            <div class="flex justify-between items-start">
                <div class="flex-grow">
                    ${event.imageUrl ? `
                        <img src="http://localhost:5001${event.imageUrl}" 
                            alt="${event.name}" 
                            class="w-full h-48 object-cover rounded-lg mb-4"
                        />
                    ` : `
                        <div class="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                            <span class="text-gray-400">No image available</span>
                        </div>
                    `}
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${event.name}</h3>
                    <p class="text-gray-600 mb-4">${event.description}</p>
                    <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                            <span class="font-medium">Date:</span> ${new Date(event.date).toLocaleDateString()}
                        </div>
                        <div>
                            <span class="font-medium">Time:</span> ${event.time}
                        </div>
                        <div>
                            <span class="font-medium">Location:</span> ${event.location}
                        </div>
                        <div>
                            <span class="font-medium">Total Capacity:</span> ${event.capacity}
                        </div>
                    </div>
                    
                    <!-- Event Statistics -->
                    <div class="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                        <h4 class="font-medium text-gray-700 mb-2">Event Statistics</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-600">Available Seats</p>
                                <p class="text-2xl font-bold ${event.availableSeats > 0 ? 'text-green-600' : 'text-red-600'}">
                                    ${event.availableSeats}
                                </p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Booked Seats</p>
                                <p class="text-2xl font-bold text-blue-600">
                                    ${event.capacity - event.availableSeats}
                                </p>
                            </div>
                        </div>
                        <!-- Capacity Progress Bar -->
                        <div class="mt-2">
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="bg-blue-600 h-2.5 rounded-full" 
                                    style="width: ${((event.capacity - event.availableSeats) / event.capacity) * 100}%">
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 mt-1">
                                ${Math.round(((event.capacity - event.availableSeats) / event.capacity) * 100)}% Booked
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-2 ml-4">
                    <button onclick="editEvent('${event._id}')" 
                        class="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200">
                        Edit
                    </button>
                    <button onclick="deleteEvent('${event._id}')" 
                        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize the page
window.addEventListener('load', checkAdminAuth);

// Add logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
});
