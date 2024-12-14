document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!name || !email || !password) {
        errorMessage.textContent = 'All fields are required';
        errorMessage.classList.remove('hidden');
        errorMessage.classList.add('bg-red-50', 'text-red-500');
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.classList.remove('hidden');
        errorMessage.classList.add('bg-red-50', 'text-red-500');
        return;
    }

    // Get selected interests
    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
        .map(checkbox => checkbox.value);

    const userData = {
        name,
        email,
        password,
        interests
    };

    console.log('Attempting to register with data:', { ...userData, password: '***' });

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        // Show success message
        errorMessage.textContent = 'Registration successful! Redirecting to login...';
        errorMessage.classList.remove('hidden', 'bg-red-50', 'text-red-500');
        errorMessage.classList.add('bg-green-50', 'text-green-500');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        console.error('Registration error details:', error);
        errorMessage.textContent = error.message === 'Failed to fetch' 
            ? 'Connection error. Please try again.' 
            : error.message;
        errorMessage.classList.remove('hidden');
        errorMessage.classList.add('bg-red-50', 'text-red-500');
    }
});

// Add password strength indicator
const passwordInput = document.getElementById('password');
passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    updatePasswordStrengthIndicator(strength);
});

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
}

function updatePasswordStrengthIndicator(strength) {
    const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'][strength];
    const strengthClass = [
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-lime-500',
        'bg-green-500'
    ][strength];

    // Update the password input's border color
    passwordInput.className = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-${strengthClass.split('-')[1]}-500`;
}
  