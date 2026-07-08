// Ensure the script runs after the HTML is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select the login form element and attach a submit event listener
    const loginForm = document.querySelector('form');
    loginForm.addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Extract and trim the values from the email and password input fields
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Perform basic validation to ensure neither field is empty
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Additional email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Provide success feedback to the user
        alert(`Login successful!\nEmail: ${email}`);
        // Optionally reset the form
        loginForm.reset();
    });

    // Select the "Forgot Password" link and add a click event listener
    const forgotPasswordLink = document.querySelector('.forgot-password a');
    forgotPasswordLink.addEventListener('click', function(event) {
        // Prevent default link behavior
        event.preventDefault();

        // Extract and trim the email value
        const email = document.getElementById('email').value.trim();

        // Validate that email field is not empty
        if (!email) {
            alert('Please enter your email address to recover your password.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Provide feedback for password recovery
        alert(`Password recovery email sent to: ${email}`);
    });
});
