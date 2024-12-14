document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgotPasswordForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      errorMessage.classList.add('hidden');
      successMessage.classList.add('hidden');
  
      const email = document.getElementById('email').value.trim();
  
      if (!email) {
        errorMessage.textContent = 'Please enter your email address.';
        errorMessage.classList.remove('hidden');
        return;
      }
  
      try {
        const res = await fetch('/api/users/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          successMessage.textContent = 'Password reset link has been sent to your email.';
          successMessage.classList.remove('hidden');
        } else {
          errorMessage.textContent = data.error || 'Failed to send reset link.';
          errorMessage.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Error during password reset:', error.message);
        errorMessage.textContent = 'An unexpected error occurred. Please try again.';
        errorMessage.classList.remove('hidden');
      }
    });
  });
  