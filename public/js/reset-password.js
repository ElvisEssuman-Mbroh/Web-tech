document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resetPasswordForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      errorMessage.classList.add('hidden');
      successMessage.classList.add('hidden');
  
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
  
      if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        errorMessage.classList.remove('hidden');
        return;
      }
  
      try {
        const res = await fetch('/api/users/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, token }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          successMessage.textContent = 'Password has been reset successfully. Redirecting to login page...';
          successMessage.classList.remove('hidden');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 3000);
        } else {
          errorMessage.textContent = data.error;
          errorMessage.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Error during password reset:', error.message);
        errorMessage.textContent = 'An unexpected error occurred. Please try again.';
        errorMessage.classList.remove('hidden');
      }
    });
  });
  