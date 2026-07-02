// Scroll Reveal Animation
function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    // Initial check
    revealOnScroll();

    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
}

// Smooth Scroll for Navigation Links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Ignore cart link and other special links
            if (href === '#cart' || href === '#') {
                return;
            }

            e.preventDefault();

            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// Navbar Scroll Effect
function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Parallax Effect for Hero Section
function setupParallax() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with reveal class
    document.querySelectorAll('.reveal').forEach(element => {
        observer.observe(element);
    });
}

// Counter Animation for Statistics
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent = Math.floor(current);
    }, 16);
}

// Setup counters if they exist
function setupCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-counter'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// Stagger Animation for Grid Items
function staggerAnimation(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * delay}ms`;
    });
}

// Text Typing Animation
function typeWriter(element, text, speed = 50) {
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    element.textContent = '';
    type();
}

// Progress Bar Animation
function animateProgressBar(element, percentage, duration = 1000) {
    element.style.width = '0%';

    setTimeout(() => {
        element.style.transition = `width ${duration}ms ease`;
        element.style.width = `${percentage}%`;
    }, 100);
}

// Image Lazy Loading
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(image => imageObserver.observe(image));
}

// Add hover tilt effect to cards
function setupTiltEffect() {
    const cards = document.querySelectorAll('.product-card, .service-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Cursor Trail Effect (optional premium effect)
function setupCursorTrail() {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const diffX = mouseX - currentX;
        const diffY = mouseY - currentY;

        currentX += diffX * 0.1;
        currentY += diffY * 0.1;

        // Update custom cursor if it exists
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
            cursor.style.left = currentX + 'px';
            cursor.style.top = currentY + 'px';
        }

        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .product-card, .testimonial-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => observer.observe(element));
}

// Page Load Animation
function pageLoadAnimation() {
    document.body.style.opacity = '0';

    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
}

// Initialize all animations
function initAnimations() {
    setupScrollReveal();
    setupSmoothScroll();
    setupNavbarScroll();
    // setupParallax(); // Optional - can be resource intensive
    setupIntersectionObserver();
    setupCounters();
    setupLazyLoading();
    // setupTiltEffect(); // Optional - premium effect
    animateOnScroll();

    // Stagger animations for grids
    staggerAnimation('.service-card', 100);
    staggerAnimation('.product-card', 50);
}

// Run animations when DOM is ready
document.addEventListener('DOMContentLoaded', initAnimations);

// Re-trigger animations on dynamic content load
function refreshAnimations() {
    animateOnScroll();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        animateCounter,
        typeWriter,
        animateProgressBar,
        refreshAnimations
    };
}
