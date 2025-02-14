// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// DOM Elements
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const preloader = document.querySelector('.preloader');
const navLinksArray = document.querySelectorAll('.nav-link');

// Hide preloader after page load
window.addEventListener('load', () => {
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    spans[0].classList.toggle('rotate-45');
    spans[1].classList.toggle('opacity-0');
    spans[2].classList.toggle('-rotate-45');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth scroll for navigation links
navLinksArray.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                navLinks.classList.remove('active');
                window.scrollTo({
                    top: targetSection.offsetTop - navbar.offsetHeight,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Active link highlight on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight/3)) {
            current = section.getAttribute('id');
        }
    });

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add your form submission logic here
        const formData = new FormData(contactForm);
        const formObject = Object.fromEntries(formData);
        
        // Example: Show success message
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Intersection Observer for navbar background
const heroSection = document.querySelector('.hero');
const observerOptions = {
    rootMargin: '-50px 0px 0px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}, observerOptions);

if (heroSection) {
    observer.observe(heroSection);
}