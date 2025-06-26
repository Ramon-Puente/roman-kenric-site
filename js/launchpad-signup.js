// Newsletter Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeAnimations();
    initializeFormEnhancements();
    initializeAccessibility();
    initializeInteractiveEffects();
});

// Animation functionality
function initializeAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-delay-1, .fade-in-delay-2');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Form enhancements
function initializeFormEnhancements() {
    // Wait for MailerLite form to load
    const checkForForm = setInterval(() => {
        const mlForm = document.querySelector('.ml-embedded form');
        if (mlForm) {
            clearInterval(checkForForm);
            enhanceMailerLiteForm(mlForm);
        }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
        clearInterval(checkForForm);
    }, 10000);
}

function enhanceMailerLiteForm(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');

    if (emailInput) {
        // Add floating label effect
        emailInput.placeholder = 'Enter your email address';
        
        // Add focus and blur effects
        emailInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        emailInput.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Add input validation feedback
        emailInput.addEventListener('input', function() {
            validateEmail(this);
        });
    }

    if (submitButton) {
        // Add loading state functionality
        submitButton.addEventListener('click', function(e) {
            if (emailInput && !validateEmail(emailInput)) {
                e.preventDefault();
                showFormFeedback('Please enter a valid email address', 'error');
                return;
            }
            
            addLoadingState(this);
        });

        // Enhance button text
        if (submitButton.textContent.trim() === 'Subscribe' || submitButton.value === 'Subscribe') {
            submitButton.textContent = 'Join the Community';
            submitButton.value = 'Join the Community';
        }
    }

    // Listen for form submission success
    form.addEventListener('submit', function() {
        setTimeout(() => {
            checkForSuccessMessage();
        }, 1000);
    });
}

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);
    
    if (input.value && !isValid) {
        input.style.borderColor = 'var(--color-error)';
        return false;
    } else {
        input.style.borderColor = '';
        return true;
    }
}

function addLoadingState(button) {
    const originalText = button.textContent || button.value;
    button.classList.add('loading');
    button.disabled = true;
    button.textContent = 'Joining...';
    button.value = 'Joining...';

    // Remove loading state after 5 seconds if no success message
    setTimeout(() => {
        if (button.classList.contains('loading')) {
            button.classList.remove('loading');
            button.disabled = false;
            button.textContent = originalText;
            button.value = originalText;
        }
    }, 5000);
}

function checkForSuccessMessage() {
    const successElements = document.querySelectorAll('.ml-form-successBody, .ml-form-success');
    if (successElements.length > 0) {
        showFormFeedback('Welcome to the community! Check your email for confirmation.', 'success');
        trackConversion();
    }
}

function showFormFeedback(message, type) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        margin-top: var(--space-16);
        padding: var(--space-12) var(--space-16);
        border-radius: var(--radius-base);
        font-size: var(--font-size-sm);
        text-align: center;
        animation: fadeInUp 0.3s ease-out;
        background: ${type === 'success' ? 'rgba(var(--color-success-rgb), 0.1)' : 'rgba(var(--color-error-rgb), 0.1)'};
        color: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
        border: 1px solid ${type === 'success' ? 'rgba(var(--color-success-rgb), 0.3)' : 'rgba(var(--color-error-rgb), 0.3)'};
    `;

    // Insert feedback
    const formContainer = document.querySelector('.form-container');
    formContainer.appendChild(feedback);

    // Remove feedback after 5 seconds
    setTimeout(() => {
        if (feedback.parentElement) {
            feedback.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => feedback.remove(), 300);
        }
    }, 5000);
}

// Accessibility enhancements
function initializeAccessibility() {
    // Add skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
        this.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
        this.classList.add('sr-only');
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.id = 'main-content';
        heroSection.setAttribute('tabindex', '-1');
    }

    // Enhance keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Interactive effects
function initializeInteractiveEffects() {
    // Add parallax effect to background elements
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.decoration-circle');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.hero-content, .cta-section');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click ripple effect
    document.addEventListener('click', function(e) {
        const button = e.target.closest('button, .btn');
        if (button && !button.querySelector('.ripple')) {
            createRipple(e, button);
        }
    });
}

function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
    `;
    
    ripple.className = 'ripple';
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Analytics and tracking
function trackConversion() {
    // Track successful newsletter signup
    if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
            event_category: 'engagement',
            event_label: 'landing_page'
        });
    }
    
    // Track with MailerLite if available
    if (typeof ml !== 'undefined') {
        ml('track', 'Newsletter Signup');
    }
    
    console.log('Newsletter signup tracked');
}

// CSS animations for JavaScript-created elements
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    .animate-in {
        animation-play-state: running;
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
    
    .loading {
        position: relative;
        pointer-events: none;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        margin: auto;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;

document.head.appendChild(style);

// Performance optimization
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
        }
    }
});

observer.observe({ entryTypes: ['navigation'] });