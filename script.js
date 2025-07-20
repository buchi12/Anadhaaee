// Temple Website JavaScript
class TempleWebsite {
    constructor() {
        this.activeSection = 'home';
        this.sections = ['home', 'about', 'gallery', 'housing', 'facilities', 'contact', 'donation'];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupScrollTracking();
        this.setupSmoothScrolling();
        this.initializeAnimations();
    }
    
    setupEventListeners() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.scrollToSection(section);
                this.setActiveLink(section);
            });
        });
        
        // Donate button
        const donateButtons = document.querySelectorAll('[data-section="donation"]');
        donateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection('donation');
                this.setActiveLink('donation');
            });
        });
        
        // Other action buttons
        const actionButtons = document.querySelectorAll('[data-section]');
        actionButtons.forEach(button => {
            if (!button.classList.contains('nav-link') && button.getAttribute('data-section') !== 'donation') {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = button.getAttribute('data-section');
                    this.scrollToSection(section);
                    this.setActiveLink(section);
                });
            }
        });
        
        // Gallery hover effects
        this.setupGalleryEffects();
        
        // Facility card hover effects
        this.setupFacilityEffects();
        
        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    setupScrollTracking() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        if (sectionId && this.sections.includes(sectionId)) {
                            this.setActiveLink(sectionId);
                        }
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-80px 0px -80px 0px'
            }
        );
        
        this.sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                observer.observe(section);
            }
        });
    }
    
    setupSmoothScrolling() {
        // Enable smooth scrolling for the entire page
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 64;
            const elementPosition = element.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
    
    setActiveLink(sectionId) {
        if (this.activeSection !== sectionId) {
            // Remove active class from all nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section link
            const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            this.activeSection = sectionId;
            
            // Trigger any section-specific animations
            this.triggerSectionAnimation(sectionId);
        }
    }
    
    setupGalleryEffects() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            // Add staggered animation delay
            item.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover effect enhancement
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-4px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
            
            // Add click handler for potential lightbox functionality
            item.addEventListener('click', () => {
                this.handleGalleryItemClick(item, index);
            });
        });
    }
    
    setupFacilityEffects() {
        const facilityCards = document.querySelectorAll('.facility-card');
        
        facilityCards.forEach((card, index) => {
            // Add entrance animation
            this.observeElement(card, () => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            });
            
            // Initially hide for animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });
    }
    
    initializeAnimations() {
        // Animate elements on scroll
        this.setupScrollAnimations();
        
        // Initialize counter animations
        this.setupCounterAnimations();
        
        // Initialize text animations
        this.setupTextAnimations();
    }
    
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.section-header, .timing-card, .housing-card');
        
        animatedElements.forEach(element => {
            this.observeElement(element, () => {
                element.classList.add('animate-in');
            });
        });
        
        // Add CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
                transition: all 0.6s ease !important;
            }
            .section-header, .timing-card, .housing-card {
                opacity: 0;
                transform: translateY(30px);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupCounterAnimations() {
        // Animate numbers in donation cards
        const donationCards = document.querySelectorAll('.donation-card h3');
        
        donationCards.forEach(card => {
            const finalValue = card.textContent;
            const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
            
            this.observeElement(card, () => {
                this.animateCounter(card, 0, numericValue, 2000, finalValue);
            });
        });
    }
    
    setupTextAnimations() {
        // Add typewriter effect to main title
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) {
            this.observeElement(mainTitle, () => {
                this.typewriterEffect(mainTitle, mainTitle.textContent, 100);
            });
        }
    }
    
    animateCounter(element, start, end, duration, finalText) {
        const startTime = Date.now();
        const isRupee = finalText.includes('₹');
        const prefix = isRupee ? '₹' : '';
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
            
            element.textContent = prefix + current.toLocaleString('en-IN');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = finalText;
            }
        };
        
        updateCounter();
    }
    
    typewriterEffect(element, text, speed) {
        element.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        
        typeWriter();
    }
    
    observeElement(element, callback) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback();
                        observer.unobserve(element);
                    }
                });
            },
            { threshold: 0.2 }
        );
        
        observer.observe(element);
    }
    
    handleGalleryItemClick(item, index) {
        // Simple zoom effect - in a real implementation, you might open a lightbox
        const img = item.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.1)';
            setTimeout(() => {
                img.style.transform = 'scale(1)';
            }, 200);
        }
        
        console.log(`Gallery item ${index + 1} clicked`);
    }
    
    triggerSectionAnimation(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Add section-specific animations
        switch (sectionId) {
            case 'home':
                this.animateHomeSection();
                break;
            case 'gallery':
                this.animateGallerySection();
                break;
            case 'facilities':
                this.animateFacilitiesSection();
                break;
            case 'donation':
                this.animateDonationSection();
                break;
        }
    }
    
    animateHomeSection() {
        const decorativeElements = document.querySelectorAll('.decorative-elements i');
        decorativeElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
            element.classList.add('animate-bounce');
        });
    }
    
    animateGallerySection() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }
    
    animateFacilitiesSection() {
        const facilityCards = document.querySelectorAll('.facility-card');
        facilityCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                }, 300);
            }, index * 150);
        });
    }
    
    animateDonationSection() {
        const donationIcon = document.querySelector('.donation-icon');
        if (donationIcon) {
            donationIcon.style.animation = 'pulse 1s ease-in-out 3';
        }
    }
    
    handleResize() {
        // Handle responsive behavior
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelector('.nav-links');
        
        if (window.innerWidth <= 768) {
            // Mobile behavior
            if (navLinks) {
                navLinks.style.display = 'none';
            }
        } else {
            // Desktop behavior
            if (navLinks) {
                navLinks.style.display = 'flex';
            }
        }
    }
    
    // Utility functions
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // Add mobile menu functionality
    setupMobileMenu() {
        // This would be implemented if you want a hamburger menu
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
            });
        }
    }
    
    // Enhanced scroll effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
    
    // Loading animations
    setupLoadingAnimations() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Fade in main content
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Form handling (if contact forms are added)
    setupFormHandling() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    }
    
    handleFormSubmission(form) {
        // Show loading state
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            this.showNotification('Thank you! Your message has been sent.', 'success');
            
            // Reset form
            form.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#4ade80' : '#3b82f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TempleWebsite();
});

// Add some additional utility functions for enhanced functionality
const TempleUtils = {
    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    },
    
    // Format dates for events
    formatDate(date) {
        return new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date));
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Lazy load images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },
    
    // Add ripple effect to buttons
    addRippleEffect() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.height, rect.width);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// Initialize additional utilities
document.addEventListener('DOMContentLoaded', () => {
    TempleUtils.lazyLoadImages();
    TempleUtils.addRippleEffect();
});