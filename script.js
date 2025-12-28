// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
const animatedName = document.querySelector('.name-text');
const contactForm = document.getElementById('contact-form');
const navItems = document.querySelectorAll('.nav-links a');
const techLogos = document.querySelectorAll('.tech-logo');
const projectCards = document.querySelectorAll('.project-card');
const scrollTopBtn = document.querySelector('.scroll-top');
const loadingSpinner = document.querySelector('.loading-spinner');

// Initialize function
function init() {
    // Check if page is still loading
    if (document.readyState === 'loading') {
        loadingSpinner.style.display = 'flex';
    } else {
        loadingSpinner.style.display = 'none';
    }
    
    // Initialize all components
    createNameAnimation();
    setupMobileMenu();
    setupFormValidation();
    setupScrollAnimations();
    setupHoverEffects();
    setupScrollToTop();
}

// Toggle Mobile Menu
function setupMobileMenu() {
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking on a nav link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Update active class
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Animated Name Effect
function createNameAnimation() {
    if (!animatedName) return;
    
    const colors = [
        'linear-gradient(135deg, #4F46E5, #7C3AED)',
        'linear-gradient(135deg, #7C3AED, #EC4899)',
        'linear-gradient(135deg, #EC4899, #4F46E5)',
        'linear-gradient(135deg, #4F46E5, #10B981)'
    ];
    
    let currentColor = 0;
    
    // Initial animation
    animatedName.style.transition = 'all 0.8s ease';
    
    // Cycle through colors
    setInterval(() => {
        currentColor = (currentColor + 1) % colors.length;
        animatedName.style.background = colors[currentColor];
        animatedName.style.webkitBackgroundClip = 'text';
        animatedName.style.backgroundClip = 'text';
        
        // Add subtle scale effect
        animatedName.style.transform = 'scale(1.05)';
        setTimeout(() => {
            animatedName.style.transform = 'scale(1)';
        }, 400);
    }, 3000);
}

// Form submission with validation
function setupFormValidation() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value.trim();
        const email = contactForm.querySelector('input[type="email"]').value.trim();
        const subject = contactForm.querySelector('input[placeholder="Subject"]').value.trim();
        const message = contactForm.querySelector('textarea').value.trim();
        
        // Validation
        if (!validateForm(name, email, subject, message)) {
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call with timeout
        try {
            await simulateApiCall(name, email, subject, message);
            showNotification(`Thank you ${name}! Your message has been sent successfully.`, 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Form validation helper
function validateForm(name, email, subject, message) {
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return false;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (name.length < 2) {
        showNotification('Name must be at least 2 characters', 'error');
        return false;
    }
    
    if (message.length < 10) {
        showNotification('Message must be at least 10 characters', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Simulate API call
function simulateApiCall(name, email, subject, message) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submission:', { name, email, subject, message });
            resolve();
        }, 1500);
    });
}

// Notification system
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    // Close button style
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: 10px;
        font-size: 0.9rem;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Scroll animations
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-content, .contact-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', handleScroll);
}

// Scroll handler
function handleScroll() {
    // Update active nav link
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Show/hide scroll to top button
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
}

// Setup hover effects
function setupHoverEffects() {
    // Tech logo hover effects
    techLogos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            const icon = logo.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        logo.addEventListener('mouseleave', () => {
            const icon = logo.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Project card hover enhancements
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const techTags = card.querySelectorAll('.project-tech span');
            techTags.forEach((tag, index) => {
                tag.style.transitionDelay = `${index * 100}ms`;
                tag.style.transform = 'translateY(-5px)';
            });
        });
        
        card.addEventListener('mouseleave', () => {
            const techTags = card.querySelectorAll('.project-tech span');
            techTags.forEach(tag => {
                tag.style.transform = 'translateY(0)';
            });
        });
    });
}

// Scroll to top functionality
function setupScrollToTop() {
    if (!scrollTopBtn) return;
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Floating logos animation
function animateFloatingLogos() {
    const logos = document.querySelectorAll('.logo-item');
    
    logos.forEach(logo => {
        // Random movement
        const randomX = Math.random() * 40 - 20;
        const randomY = Math.random() * 40 - 20;
        const randomRotate = Math.random() * 20 - 10;
        
        logo.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .loading-spinner {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
    }
    
    .spinner {
        width: 60px;
        height: 60px;
        border: 4px solid var(--light);
        border-top: 4px solid var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Window load event
window.addEventListener('load', () => {
    loadingSpinner.style.display = 'none';
    init();
});

// Start floating logo animation
setInterval(animateFloatingLogos, 3000);

// Add click effect to skill logos
techLogos.forEach(logo => {
    logo.addEventListener('click', () => {
        const techName = logo.querySelector('span').textContent;
        showNotification(`Selected technology: ${techName}`, 'info');
    });
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page is visible again
        createNameAnimation();
    }
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80';
        this.alt = 'Default profile image';
    });
});
// Bubble Animation for Hero Image
function setupBubbleAnimation() {
    const bubblesContainer = document.getElementById('bubbles-container');
    const heroImage = document.querySelector('.hero-image');
    const profileImage = document.querySelector('.profile-image');
    
    if (!bubblesContainer || !heroImage || !profileImage) return;
    
    let bubbles = [];
    let isHovering = false;
    let bubbleInterval;
    
    // Create a bubble
    function createBubble(x, y) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Random size between 10px and 40px
        const size = Math.random() * 30 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Random gradient colors
        const colors = [
            'rgba(79, 70, 229, 0.3)',  // Primary
            'rgba(124, 58, 237, 0.3)', // Secondary
            'rgba(236, 72, 153, 0.3)', // Accent
            'rgba(16, 185, 129, 0.3)', // Success
            'rgba(245, 158, 11, 0.3)'  // Yellow
        ];
        
        const color1 = colors[Math.floor(Math.random() * colors.length)];
        const color2 = colors[Math.floor(Math.random() * colors.length)];
        
        bubble.style.background = `radial-gradient(circle at 30% 30%, 
            ${color1}, 
            ${color2},
            transparent 70%)`;
        
        // Random blur
        bubble.style.filter = `blur(${Math.random() * 3 + 1}px)`;
        
        // Set position
        bubble.style.left = `${x - size/2}px`;
        bubble.style.top = `${y - size/2}px`;
        
        // Random animation
        const duration = Math.random() * 2 + 1; // 1-3 seconds
        const delay = Math.random() * 0.5;
        
        // Apply animation
        bubble.style.animation = `
            bubbleFloat ${duration}s ease-out ${delay}s forwards,
            bubbleFade ${duration}s ease-out ${delay}s forwards
        `;
        
        bubblesContainer.appendChild(bubble);
        bubbles.push(bubble);
        
        // Remove bubble after animation completes
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
                bubbles = bubbles.filter(b => b !== bubble);
            }
        }, (duration + delay) * 1000);
    }
    
    // Create multiple bubbles around a point
    function createBubbleCluster(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            // Random offset from the cursor
            const offsetX = Math.random() * 100 - 50;
            const offsetY = Math.random() * 100 - 50;
            
            // Create bubble at offset position
            setTimeout(() => {
                createBubble(x + offsetX, y + offsetY);
            }, i * 50); // Stagger the creation
        }
    }
    
    // Mouse move event for bubble creation
    heroImage.addEventListener('mousemove', (e) => {
        const rect = bubblesContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Only create bubbles if within image bounds
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            // Create bubble cluster occasionally
            if (Math.random() > 0.7) {
                createBubbleCluster(x, y, Math.floor(Math.random() * 3) + 1);
            }
        }
    });
    
    // Mouse enter event - start continuous bubble creation
    heroImage.addEventListener('mouseenter', () => {
        isHovering = true;
        
        // Start continuous bubble creation
        bubbleInterval = setInterval(() => {
            if (!isHovering) return;
            
            // Create random bubbles around the image
            const rect = bubblesContainer.getBoundingClientRect();
            
            // Random position within image
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            
            createBubble(x, y);
            
            // Occasionally create clusters
            if (Math.random() > 0.8) {
                createBubbleCluster(x, y, Math.floor(Math.random() * 4) + 2);
            }
        }, 300);
    });
    
    // Mouse leave event - stop bubble creation
    heroImage.addEventListener('mouseleave', () => {
        isHovering = false;
        clearInterval(bubbleInterval);
        
        // Create exit bubble effect
        const rect = bubblesContainer.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;
                createBubble(x, y);
            }, i * 100);
        }
    });
    
    // Add CSS for bubble animations
    const bubbleStyles = document.createElement('style');
    bubbleStyles.textContent = `
        @keyframes bubbleFloat {
            0% {
                transform: translate(0, 0) scale(0.5);
            }
            25% {
                transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1);
            }
            50% {
                transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(1.2);
            }
            75% {
                transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1);
            }
            100% {
                transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) scale(0.5);
            }
        }
        
        @keyframes bubbleFade {
            0% {
                opacity: 0;
            }
            20% {
                opacity: 0.7;
            }
            80% {
                opacity: 0.4;
            }
            100% {
                opacity: 0;
            }
        }
        
        .bubble {
            pointer-events: none;
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, 
                rgba(79, 70, 229, 0.3),
                rgba(124, 58, 237, 0.2),
                rgba(236, 72, 153, 0.1)
            );
            filter: blur(2px);
            opacity: 0;
            z-index: 3;
            pointer-events: none;
        }
    `;
    document.head.appendChild(bubbleStyles);
}

// Initialize bubble animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupBubbleAnimation();
}); 

// Contact Form Animation
function setupContactAnimations() {
    const contactCards = document.querySelectorAll('.contact-card');
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    const socialLinks = document.querySelectorAll('.social-link');
    const sendButton = document.querySelector('.contact-form button[type="submit"]');
    
    // Add hover animations to contact cards
    contactCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = `translateY(-8px) rotate(${Math.random() * 2 - 1}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
    
    // Add focus animations to form inputs
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            const container = input.closest('.input-container');
            if (container) {
                container.style.transform = 'translateY(-2px)';
                container.style.boxShadow = 'var(--shadow)';
            }
        });
        
        input.addEventListener('blur', () => {
            const container = input.closest('.input-container');
            if (container) {
                container.style.transform = 'translateY(0)';
                container.style.boxShadow = 'none';
            }
        });
    });
    
    // Social link hover animations
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const icon = link.querySelector('.social-icon');
            if (icon) {
                icon.style.transform = 'rotate(15deg) scale(1.1)';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            const icon = link.querySelector('.social-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });
    
    // Form submission animation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const loader = submitBtn.querySelector('.send-loader');
            
            // Show loading state
            submitBtn.disabled = true;
            loader.style.display = 'inline-block';
            
            // Simulate API call
            setTimeout(() => {
                // Success animation
                submitBtn.style.animation = 'successPulse 0.6s ease';
                submitBtn.style.background = 'linear-gradient(135deg, #10B981, #34D399)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.animation = '';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                        loader.style.display = 'none';
                        contactForm.reset();
                    }, 3000);
                }, 600);
            }, 2000);
        });
    }
    
    // Initialize AOS animations if library is loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
}

// Tooltip functionality
function setupTooltips() {
    const socialLinks = document.querySelectorAll('[data-tooltip]');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            // Tooltip is handled by CSS
        });
        
        // Add click animation
        link.addEventListener('click', (e) => {
            const icon = link.querySelector('.social-icon');
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = 'rotate(0deg) scale(1)';
                }, 300);
            }
        });
    });
}

// Initialize contact animations when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setupContactAnimations();
    setupTooltips();
});