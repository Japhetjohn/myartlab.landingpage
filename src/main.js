// ==========================================
// MAIN.JS - MyArteLab Landing Page
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const CONFIG = {
        imageTransitionInterval: 5000,
        parallaxIntensity: 0.02,
        observerThreshold: 0.15,
        images: [
            '/theregisti-ziSzilQLSOM-unsplash.jpg',
            '/nubelson-fernandes-ZdOsQiwp0Ss-unsplash.jpg',
            '/videodeck-co-GRUhkcD9k8o-unsplash.jpg',
            '/andres-mfWsMDdN-Ro-unsplash.jpg'
        ]
    };

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    let state = {
        currentImageIndex: 0,
        isAnimating: false,
        mouseX: 0,
        mouseY: 0,
        prefersReducedMotion: false
    };

    // ==========================================
    // DOM ELEMENT REFERENCES
    // ==========================================
    const elements = {
        navbar: null,
        navToggle: null,
        navMenu: null,
        heroImages: null,
        animatedImagesContainer: null,
        revealElements: null
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        // Check for reduced motion preference
        state.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Cache DOM elements
        cacheElements();

        // Initialize features
        initNavigation();
        initHeroAnimation();
        initParallax();
        initScrollReveal();
        initSmoothScroll();

        // Preload images
        preloadImages();
    }

    // ==========================================
    // CACHE DOM ELEMENTS
    // ==========================================
    function cacheElements() {
        elements.navbar = document.querySelector('.navbar');
        elements.navToggle = document.querySelector('.nav-toggle');
        elements.navMenu = document.querySelector('.nav-menu');
        elements.heroImages = document.querySelectorAll('.hero-image');
        elements.animatedImagesContainer = document.getElementById('animatedImages');
        elements.revealElements = document.querySelectorAll('.reveal-element');
    }

    // ==========================================
    // NAVIGATION
    // ==========================================
    function initNavigation() {
        // Mobile menu toggle
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Navbar scroll effect
        window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    }

    function toggleMobileMenu() {
        elements.navMenu.classList.toggle('active');
        elements.navToggle.classList.toggle('active');
        
        const isExpanded = elements.navMenu.classList.contains('active');
        elements.navToggle.setAttribute('aria-expanded', isExpanded);
    }

    function closeMobileMenu() {
        elements.navMenu.classList.remove('active');
        elements.navToggle.classList.remove('active');
        elements.navToggle.setAttribute('aria-expanded', 'false');
    }

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    }

    // ==========================================
    // HERO IMAGE ANIMATION ENGINE
    // ==========================================
    function initHeroAnimation() {
        if (state.prefersReducedMotion || !elements.heroImages.length) return;

        // Start automatic image rotation
        setInterval(rotateHeroImages, CONFIG.imageTransitionInterval);
    }

    function rotateHeroImages() {
        if (state.isAnimating) return;
        state.isAnimating = true;

        const currentImage = elements.heroImages[state.currentImageIndex];
        state.currentImageIndex = (state.currentImageIndex + 1) % elements.heroImages.length;
        const nextImage = elements.heroImages[state.currentImageIndex];

        // Crossfade transition
        currentImage.classList.remove('active');
        nextImage.classList.add('active');

        setTimeout(() => {
            state.isAnimating = false;
        }, 1500);
    }

    // ==========================================
    // PARALLAX EFFECT
    // ==========================================
    function initParallax() {
        if (state.prefersReducedMotion) return;

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    function handleMouseMove(e) {
        state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        requestAnimationFrame(updateParallax);
    }

    function updateParallax() {
        if (!elements.animatedImagesContainer) return;

        const translateX = state.mouseX * CONFIG.parallaxIntensity * 100;
        const translateY = state.mouseY * CONFIG.parallaxIntensity * 100;

        elements.animatedImagesContainer.style.transform = 
            `translate(${translateX}px, ${translateY}px)`;
    }

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: reveal all elements immediately
            elements.revealElements.forEach(el => el.classList.add('revealed'));
            return;
        }

        const observerOptions = {
            threshold: CONFIG.observerThreshold,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animations
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.revealElements.forEach(el => observer.observe(el));
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's just "#" or external link
                if (href === '#' || href.includes('http')) return;
                
                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                closeMobileMenu();
            });
        });
    }

    // ==========================================
    // IMAGE PRELOADING
    // ==========================================
    function preloadImages() {
        CONFIG.images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // ==========================================
    // PERFORMANCE OPTIMIZATION
    // ==========================================
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

    // ==========================================
    // START APPLICATION
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();