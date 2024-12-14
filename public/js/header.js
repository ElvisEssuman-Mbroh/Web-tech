// Create and insert the header
document.body.insertAdjacentHTML('afterbegin', `
    <header class="bg-gray-800 text-white">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <!-- Logo/Brand -->
                <a href="index.html" class="flex items-center">
                    <span class="text-xl font-bold">Campus E-vents</span>
                </a>

                <!-- Navigation -->
                <nav class="flex space-x-4">
                    <a href="dashboard.html" class="px-3 py-2 rounded-md hover:bg-gray-700">Dashboard</a>
                    <a href="events.html" class="px-3 py-2 rounded-md hover:bg-gray-700">Events</a>
                    <a href="calendar.html" class="px-3 py-2 rounded-md hover:bg-gray-700">Calendar</a>
                    <button onclick="logout()" 
                        class="px-3 py-2 text-red-300 rounded-md hover:bg-gray-700 hover:text-red-200">
                        Logout
                    </button>
                </nav>
            </div>
        </div>
    </header>
`);

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}
  