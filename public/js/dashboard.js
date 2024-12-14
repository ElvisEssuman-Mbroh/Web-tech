// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    return token;
}

// Toggle user dropdown
document.getElementById('userMenu').addEventListener('click', () => {
    document.getElementById('userDropdown').classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#userMenu')) {
        document.getElementById('userDropdown').classList.add('hidden');
    }
});

// Fetch user data
async function fetchUserData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('http://localhost:5001/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        displayUserInfo(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Display user info and stats
function displayUserInfo(user) {
    // Update username
    const userNameElement = document.getElementById('userName');
    if (userNameElement) userNameElement.textContent = user.name;

    // Update stats
    if (user.rsvpedEvents) {
        document.getElementById('upcomingEventsCount').textContent = user.rsvpedEvents.length || 0;
    }
}

// Fetch upcoming events
async function fetchUpcomingEvents() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/events/my-events', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch upcoming events');
        }

        const events = await response.json();
        displayUpcomingEvents(events);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        document.getElementById('upcomingEventsList').innerHTML = `
            <div class="text-center text-gray-500 py-4">
                Failed to load upcoming events
            </div>
        `;
    }
}

// Display upcoming events
function displayUpcomingEvents(events) {
    const container = document.getElementById('upcomingEventsList');
    if (!Array.isArray(events) || !events.length) {
        container.innerHTML = `
            <div class="text-center text-gray-500 py-4">
                No upcoming events found
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => `
        <div class="py-4">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="text-lg font-medium text-gray-900">${event.name}</h4>
                    <p class="text-sm text-gray-600">${new Date(event.date).toLocaleDateString()} at ${event.time}</p>
                    <p class="mt-1 text-sm text-gray-600">${event.location}</p>
                </div>
                <button onclick="cancelRSVP('${event._id}')"
                    class="text-red-600 hover:text-red-700 text-sm font-medium">
                    Cancel
                </button>
            </div>
        </div>
    `).join('');
}

// Fetch recommended events
async function fetchRecommendedEvents() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/events/for-you', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommended events');
        }

        const events = await response.json();
        displayRecommendedEvents(events);
    } catch (error) {
        console.error('Error fetching recommended events:', error);
        document.getElementById('recommendedEventsList').innerHTML = `
            <div class="text-center text-gray-500 py-4">
                Failed to load recommended events
            </div>
        `;
    }
}

// Display recommended events
function displayRecommendedEvents(events) {
    const container = document.getElementById('recommendedEventsList');
    if (!Array.isArray(events) || !events.length) {
        container.innerHTML = `
            <div class="text-center text-gray-500 py-4">
                No recommended events found
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => `
        <div class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <h4 class="text-lg font-medium text-gray-900">${event.name}</h4>
            <p class="mt-1 text-sm text-gray-600">${event.description}</p>
            <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-gray-600">${new Date(event.date).toLocaleDateString()}</span>
                <button onclick="bookEvent('${event._id}')"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm">
                    Book Now
                </button>
            </div>
        </div>
    `).join('');
}

// Cancel RSVP
async function cancelRSVP(eventId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/events/remove-rsvp/${eventId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to cancel RSVP');
        }

        alert('RSVP cancelled successfully');
        fetchUpcomingEvents();
        fetchUserData(); // Update stats
    } catch (error) {
        console.error('Error cancelling RSVP:', error);
        alert('Failed to cancel RSVP');
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();
    fetchUpcomingEvents();
    fetchRecommendedEvents();
});

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

async function fetchDashboardStats() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('/api/events/dashboard-stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }

        const stats = await response.json();
        
        // Update the dashboard UI
        document.getElementById('upcomingEventsCount').textContent = stats.upcomingEvents;
        document.getElementById('eventsAttendedCount').textContent = stats.eventsAttended;
        document.getElementById('matchPercentage').textContent = `${stats.matchPercentage}%`;

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Show error message on dashboard
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="text-red-500 text-center p-4">
                    Failed to load dashboard statistics. Please try again later.
                </div>
            `;
        }
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', fetchDashboardStats);
  