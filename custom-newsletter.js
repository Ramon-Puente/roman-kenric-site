/**
 * Custom Newsletter Form - MailerLite Integration
 * 
 * This script handles form submissions to MailerLite via Cloudflare Worker
 * without using Webflow's form handling.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const submitButton = document.getElementById('custom-submit-button');
    const emailInput = document.getElementById('custom-email-input');
    const successMessage = document.getElementById('custom-success-message');
    const errorMessage = document.getElementById('custom-error-message');
    
    // Verify elements exist to prevent errors
    if (!submitButton || !emailInput || !successMessage || !errorMessage) {
      console.error('Newsletter form elements not found');
      return;
    }
    
    // Add click event listener to the submit button
    submitButton.addEventListener('click', handleFormSubmit);
    
    // Also allow pressing Enter to submit
    emailInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleFormSubmit();
      }
    });
    
    /**
     * Handles the form submission
     */
    function handleFormSubmit() {
      // Hide previous messages
      successMessage.style.display = 'none';
      errorMessage.style.display = 'none';
      
      // Get email value
      const email = emailInput.value.trim();
      
      // Validate email
      if (!email || !email.includes('@')) {
        errorMessage.innerHTML = '<div>Please enter a valid email address</div>';
        errorMessage.style.display = 'block';
        return;
      }
      
      // Show loading state
      submitButton.disabled = true;
      
      // Replace with your Cloudflare Worker URL
      const workerUrl = 'https://mailerlite-subscribe.romankenric.workers.dev';
      
      // Send request to Cloudflare Worker
      fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      })
      .then(response => {
        // Check if the response is OK before trying to parse JSON
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          successMessage.style.display = 'block';
          emailInput.value = '';
        } else {
          throw new Error(data.error || data.message || 'Unknown error occurred');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        errorMessage.innerHTML = '<div>Error: ' + (error.message || 'Failed to subscribe') + '</div>';
        errorMessage.style.display = 'block';
      })
      .finally(() => {
        // Reset button state
        submitButton.disabled = false;
      });
    }
  });