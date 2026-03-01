document.addEventListener('DOMContentLoaded', function() {
    // Check if we came from a form submission
    const hasFormSubmit = sessionStorage.getItem('formSubmitted');
    
    if (!hasFormSubmit) {
        // Show error state
        document.getElementById('successState').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
        
        // Start countdown
        let countdown = 5;
        const countdownEl = document.getElementById('countdown');
        
        const timer = setInterval(() => {
            countdown--;
            if (countdownEl) {
                countdownEl.textContent = countdown;
            }
            
            if (countdown <= 0) {
                clearInterval(timer);
                window.location.href = 'index.html';
            }
        }, 1000);
    } else {
        // Clear the session storage
        sessionStorage.removeItem('formSubmitted');
    }
});

// Function to go back to form
function goToForm() {
    window.location.href = 'index.html';
}