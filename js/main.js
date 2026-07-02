// Main JavaScript File for Alma's Fitness

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!mobileMenuToggle || !navMenu) return;

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');

        // Animate hamburger icon
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');

            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');

                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
}

// FAQ Accordion
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Active Navigation Link on Scroll
function setupActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveLink() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');

            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Initial call
}

// Scroll to Top Button
function setupScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #10b981, #14b8a6);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        z-index: 999;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(scrollBtn);

    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-5px) scale(1.1)';
        scrollBtn.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0) scale(1)';
        scrollBtn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
    });
}

// Form Validation Helper
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(phone);
}

// Loading Screen
function setupLoadingScreen() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.cssText = `
        position: fixed;
        inset: 0;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;

    loader.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; font-weight: 600; color: #10b981;">Loading...</p>
        </div>
    `;

    document.body.appendChild(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 500);
    });
}

// Cookie Consent Banner (GDPR Compliance)
function setupCookieConsent() {
    // Check if user has already consented
    if (localStorage.getItem('cookieConsent')) {
        return;
    }

    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(31, 41, 55, 0.95);
        backdrop-filter: blur(10px);
        color: white;
        padding: 1.5rem;
        z-index: 10000;
        animation: slideInFromBottom 0.5s ease;
    `;

    banner.innerHTML = `
        <div class="container" style="display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
                <p style="margin: 0;">
                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                    <a href="#privacy" style="color: #10b981; text-decoration: underline; margin-left: 0.5rem;">Learn more</a>
                </p>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button id="acceptCookies" class="btn btn-primary">
                    Accept
                </button>
                <button id="declineCookies" class="btn btn-secondary" style="background: transparent; border-color: white; color: white;">
                    Decline
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);

    // Accept cookies
    document.getElementById('acceptCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        banner.style.animation = 'slideOutToBottom 0.5s ease';
        setTimeout(() => banner.remove(), 500);
    });

    // Decline cookies
    document.getElementById('declineCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'false');
        banner.style.animation = 'slideOutToBottom 0.5s ease';
        setTimeout(() => banner.remove(), 500);
    });
}

// Add CSS animations for cookie banner
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromBottom {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes slideOutToBottom {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Image Error Handling
function setupImageErrorHandling() {
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%236b7280"%3EImage Not Found%3C/text%3E%3C/svg%3E';
        }
    }, true);
}

// Price Formatter
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Date Formatter
function formatDate(date) {
    return new Intl.DateFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance Observer (for debugging)
function setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.loadTime > 3000) {
                    console.warn(`Slow resource: ${entry.name} (${entry.loadTime}ms)`);
                }
            }
        });

        observer.observe({ entryTypes: ['resource'] });
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize all main functions
function init() {
    addAnimations();
    setupMobileMenu();
    setupFAQ();
    setupActiveNavigation();
    setupScrollToTop();
    // setupLoadingScreen(); // Optional
    setupCookieConsent();
    setupImageErrorHandling();

    // Log initialization
    console.log('%cAlma\'s Fitness Website Loaded Successfully! 💪', 'color: #10b981; font-size: 16px; font-weight: bold;');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export utilities for use in other scripts
window.AlmasUtils = {
    validateEmail,
    validatePhone,
    formatPrice,
    formatDate,
    debounce,
    throttle,
    isInViewport
};
