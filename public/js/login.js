document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        console.log('Attempting login with:', { email }); // Debug log

        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('Server response:', data); // Debug log

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store the token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role || 'user');
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);

        // Show success message
        errorMessage.textContent = 'Login successful! Redirecting...';
        errorMessage.classList.remove('hidden', 'bg-red-50', 'text-red-500');
        errorMessage.classList.add('bg-green-50', 'text-green-500');

        // Redirect based on role
        setTimeout(() => {
            const redirectPath = data.user.role === 'admin' ? 'admin.html' : 'dashboard.html';
            window.location.href = redirectPath;
        }, 1000);

    } catch (error) {
        console.error('Login error details:', error);
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
        errorMessage.classList.add('bg-red-50', 'text-red-500');
    }
});
