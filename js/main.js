// QuasarApp Group - Main JavaScript
// Additional functionality and animations

document.addEventListener('DOMContentLoaded', function() {
    // Accessibility: Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe stat items and cards
    document.querySelectorAll('.stat-item, .project-card').forEach(el => {
        observer.observe(el);
    });

    // Add fade-in animation class
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }

        .stat-item {
            animation-delay: calc(var(--item-index) * 0.15s);
            --item-index: 0;
        }
    `;
    document.head.appendChild(style);

    // Add tilt effect to project cards (disabled if reduced motion is preferred)
    if (!prefersReducedMotion) {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.setProperty('--item-index', index);
            
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // Floating particles effect (disabled if reduced motion is preferred).
    // The rAF loop starts only after the page has fully loaded, so it does
    // not compete with first paint / LCP for the main thread (issue #78).
    if (!prefersReducedMotion) {
        if (document.readyState === 'complete') {
            createParticles();
        } else {
            window.addEventListener('load', createParticles, { once: true });
        }
    }
});

// Create floating particle effects
function createParticles() {
    const particleCount = 20;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(0, 188, 212, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.appendChild(particle);

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 3 + 2;
        const speed = Math.random() * 0.5 + 0.1;
        const duration = Math.random() * 20 + 20;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        return {
            element: particle,
            x: x,
            y: y,
            speed: speed,
            size: size,
            offset: Math.random() * duration,
            duration: duration
        };
    }

    function animateParticles() {
        particles.forEach(p => {
            const time = Date.now() * 0.001 + p.offset;
            p.y = Math.sin(time * p.speed) * 50 + p.y;
            p.element.style.transform = `translateY(${p.y}px)`;
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}


/* ============================================
   ECLIPTICA PAGE FUNCTIONALITY
   ============================================ */

/**
 * Ecliptica Video Handler
 * Handles viewport-triggered video playback with IntersectionObserver
 * and prefers-reduced-motion fallback
 */
(function() {
    'use strict';
    
    const videoContainer = document.getElementById('ecliptica-video-container');
    const video = document.getElementById('ecliptica-video');
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (!videoContainer || !video) return;
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Static fallback: show placeholder, hide video
        video.style.display = 'none';
        if (videoPlaceholder) {
            videoPlaceholder.style.display = 'block';
        }
        console.log('Ecliptica video: reduced motion mode enabled');
        return;
    }
    
    // Set up IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '100px',
        threshold: 0.25
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Play video when in viewport
                if (video.paused || video.ended) {
                    video.play().catch(err => {
                        console.warn('Video autoplay blocked:', err);
                    });
                }
                videoContainer.classList.add('is-playing');
                observer.disconnect(); // Only play once
            }
        });
    }, observerOptions);
    
    // Observe the video container
    observer.observe(videoContainer);
    
    // Handle browser back button
    window.addEventListener('popstate', () => {
        if (videoContainer.classList.contains('is-playing')) {
            video.pause();
            video.currentTime = 0;
            videoContainer.classList.remove('is-playing');
        }
    });
})();

/**
 * Mechanics Tabs Handler
 * Tabbed interface for the core mechanics showcase
 */
(function() {
    'use strict';
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length === 0) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Update URL hash (optional, for browser history)
            history.pushState({ tab: targetTab }, '', '#' + targetTab);
        });
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.tab) {
            const targetTab = event.state.tab;
            const targetBtn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
            if (targetBtn) {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                targetBtn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            }
        }
    });
})();

/**
 * Lightbox Handler
 * For the media gallery
 */
(function() {
    'use strict';
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    
    if (!lightbox || !lightboxImg) return;
    
    // Open lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const fullImageSrc = item.dataset.src || item.querySelector('img').src;
            lightboxImg.src = fullImageSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
})();

/**
 * Feedback Form Handler
 * Basic form submission with loading state
 */
(function() {
    'use strict';
    
    const feedbackForm = document.getElementById('feedback-form');
    
    if (!feedbackForm) return;
    
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Set loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Collect form data
        const formData = new FormData(feedbackForm);
        
        // Note: For production, this would submit to a backend endpoint
        // For now, show a success message
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            feedbackForm.reset();
            alert('Thank you for your feedback! We will review it soon.');
        }, 1500);
    });
})();
