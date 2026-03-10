/**
 * ALPHA JUNIOR SCHOOL - MAIN INTERACTIVITY SCRIPT
 * Project: Alpha Junior School Website
 * Developer: devstudio.co.zw
 * Logic: Handle mobile navigation, scroll-triggered animations, and contact form AJAX submissions.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOBILE NAVIGATION LOGIC ---
    // Manages the visibility of the nav menu on smaller screens.
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle the visibility class
            navLinks.classList.toggle('active');

            // Switch the FontAwesome icon between hamburger (bars) and close (times)
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- 2. SCROLL ANIMATION SYSTEM (Intersection Observer) ---
    // Triggers CSS animations when elements enter the viewport.
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    // Utility function to reveal elements
    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    // Intersection Observer Settings
    const observerOptions = {
        root: null, // Relative to the viewport
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                displayScrollElement(entry.target);
                // Unobserve to trigger the animation only once per load
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initialize observer for each target element
    scrollElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- 3. AJAX CONTACT FORM SUBMISSION ---
    // Processes the enrollment inquiry form without refreshing the page.
    const contactForm = document.getElementById('ajs-contact-form');
    const formResponse = document.getElementById('form-response');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent standard page reload

            // UI Feedback: Show loading state on the button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Gather all form data
            const formData = new FormData(this);

            // POST request to the PHP backend
            fetch('contact/sendmail.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    formResponse.style.display = 'block';
                    // Display success or error message from PHP
                    if (data.status === 'success') {
                        formResponse.innerHTML = `<div style="color: green; padding: 10px; border: 1px solid green; background: #e0ffe0; border-radius: 5px; margin-top: 15px;">${data.message}</div>`;
                        contactForm.reset(); // Reset form on success
                    } else {
                        formResponse.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red; background: #ffe0e0; border-radius: 5px; margin-top: 15px;">${data.message}</div>`;
                    }
                })
                .catch(error => {
                    // Fallback for network errors
                    console.error('Error:', error);
                    formResponse.style.display = 'block';
                    formResponse.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red; background: #ffe0e0; border-radius: 5px; margin-top: 15px;">An error occurred while sending. Please try again later.</div>`;
                })
                .finally(() => {
                    // Revert button to original state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

});
