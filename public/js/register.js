document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
        .map(checkbox => checkbox.value);

    // Validate passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.classList.remove('hidden');
        return;
    }

    // Validate password strength
    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long';
        errorMessage.classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
                interests
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Show success message with animation
        errorMessage.textContent = 'Registration successful! Redirecting to login...';
        errorMessage.classList.remove('hidden', 'bg-red-50', 'text-red-500');
        errorMessage.classList.add('bg-green-50', 'text-green-500');

        // Redirect to login after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
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
  