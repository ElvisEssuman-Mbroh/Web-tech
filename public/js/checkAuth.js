// Add this to the top of dashboard.html, admin.html, and other protected pages
function checkAuthAndRedirect() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Redirect admin to admin page if they're on user pages
    if (userRole === 'admin' && !window.location.pathname.includes('admin')) {
        window.location.href = 'admin.html';
        return;
    }

    // Redirect users to dashboard if they're on admin pages
    if (userRole === 'user' && window.location.pathname.includes('admin')) {
        window.location.href = 'dashboard.html';
        return;
    }
}

// Call this function when the page loads
checkAuthAndRedirect(); 