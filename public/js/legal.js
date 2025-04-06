document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav');
    
    mobileMenuButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
    });

    // Close mobile menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) {
            navMenu.classList.remove('active');
            mobileMenuButton.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuButton.classList.remove('active');
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initialize GSAP animations
    gsap.registerPlugin(ScrollTrigger);

    // Animate hero elements
    gsap.from('.hero h1', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.3
    });

    gsap.from('.hero p', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.6
    });

    gsap.from('.hero-buttons', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.9
    });

    // Animate documents in hero section
    const docs = gsap.utils.toArray('.document');
    gsap.to(docs, {
        y: -100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            scrub: true
        }
    });

    // Section animations
    gsap.utils.toArray("section").forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Feature card animations
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: "back.out(1.7)"
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                gsap.to(window, { 
                    duration: 1, 
                    scrollTo: {
                        y: targetElement,
                        offsetY: 70 // Account for fixed header height
                    }, 
                    ease: "power2.inOut" 
                });
            }
        });
    });

    // Responsive menu handling
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            mobileMenuButton.classList.remove('active');
        }
    });
});
    });
});