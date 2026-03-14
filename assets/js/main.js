/* ==========================================================================
   ALPHA JUNIOR SCHOOL - MAIN JAVASCRIPT v2.0
   Developer: devstudio.co.zw
   Features: Mobile Nav, Scroll Animations, Tab Interface, Expandable Cards,
             Timeline Active State, Floating Label Polyfill, Form Handler
   ========================================================================== */

(function () {
    'use strict';

    /* ---------------------------------------------------------------
       1. MOBILE NAVIGATION TOGGLE
       --------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            // Toggle icon between bars and X
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-times', isOpen);
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });
    }

    /* ---------------------------------------------------------------
       2. STICKY HEADER SHADOW ON SCROLL
       --------------------------------------------------------------- */
    const mainHeader = document.getElementById('main-header');
    if (mainHeader) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 20) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    /* ---------------------------------------------------------------
       3. SCROLL ANIMATION (Intersection Observer)
       --------------------------------------------------------------- */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: 0.12,   // Trigger when 12% of the element is visible
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ---------------------------------------------------------------
       4. TABBED INTERFACE (Programs Page)
       --------------------------------------------------------------- */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabButtons.length > 0) {
        tabButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const targetId = 'tab-' + this.dataset.tab;

                // Deactivate all buttons and panels
                tabButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                tabPanels.forEach(p => p.classList.remove('active'));

                // Activate clicked button and matching panel
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    // Re-trigger scroll animations inside the newly revealed tab
                    targetPanel.querySelectorAll('.animate-on-scroll').forEach(el => {
                        el.classList.add('is-visible');
                    });
                }
            });
        });
    }

    /* ---------------------------------------------------------------
       5. EXPANDABLE PROGRAM CARDS
       --------------------------------------------------------------- */
    const expandButtons = document.querySelectorAll('.expand-btn');

    if (expandButtons.length > 0) {
        expandButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const card = this.closest('.glass-program-card');
                const details = card ? card.querySelector('.card-details') : null;
                if (!details) return;

                const isOpen = details.classList.toggle('open');
                this.classList.toggle('open', isOpen);
                this.setAttribute('aria-expanded', isOpen);
                this.innerHTML = isOpen
                    ? '<i class="fas fa-chevron-up"></i> Hide Details'
                    : '<i class="fas fa-chevron-down"></i> See Details';
            });
        });
    }

    /* ---------------------------------------------------------------
       6. PHILOSOPHY TIMELINE – Active State on Scroll
       --------------------------------------------------------------- */
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Remove active from all first
                    timelineItems.forEach(item => item.classList.remove('active'));
                    // Set the currently visible one as active
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });

        timelineItems.forEach(item => timelineObserver.observe(item));
    }

    /* ---------------------------------------------------------------
       7. CONTACT FORM HANDLER (Client-side validation + Visual feedback)
       --------------------------------------------------------------- */
    const contactForm = document.getElementById('ajs-contact-form');
    const formResponse = document.getElementById('form-response');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && formResponse) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Client-side validation
            const parentName = document.getElementById('parent_name');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            let isValid = true;

            [parentName, phone, email, message].forEach(field => {
                if (field && field.required && !field.value.trim()) {
                    field.style.borderColor = 'var(--primary-red)';
                    isValid = false;
                } else if (field) {
                    field.style.borderColor = '';
                }
            });

            // Basic email format validation
            if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.style.borderColor = 'var(--primary-red)';
                isValid = false;
            }

            if (!isValid) {
                showResponse('error', '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields correctly.');
                return;
            }

            // Simulate sending (loading state)
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
            }

            // Simulate a 1.5s delay before showing success
            setTimeout(function () {
                showResponse('success', '<i class="fas fa-check-circle"></i> Thank you! Your inquiry has been received. We will contact you within 24 hours.');
                contactForm.reset();
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Inquiry Now';
                    submitBtn.disabled = false;
                }
            }, 1500);

            // NOTE: For a live server, replace the setTimeout above with a fetch() call to contact/mail.php
        });
    }

    /**
     * Helper: Show a form response message with styling
     * @param {string} type - 'success' or 'error'
     * @param {string} message - HTML message to display
     */
    function showResponse(type, message) {
        if (!formResponse) return;
        formResponse.innerHTML = message;
        formResponse.style.display = 'block';
        formResponse.style.padding = '14px 16px';
        formResponse.style.borderRadius = 'var(--radius-sm)';
        formResponse.style.fontWeight = '600';
        formResponse.style.fontSize = '0.9rem';

        if (type === 'success') {
            formResponse.style.background = '#ECFDF5';
            formResponse.style.color = '#065F46';
            formResponse.style.border = '1px solid #A7F3D0';
        } else {
            formResponse.style.background = '#FEF2F2';
            formResponse.style.color = '#991B1B';
            formResponse.style.border = '1px solid #FECACA';
        }

        // Scroll it into view
        formResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* ---------------------------------------------------------------
       8. SMOOTH SCROLL FOR ANCHOR LINKS
       --------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
