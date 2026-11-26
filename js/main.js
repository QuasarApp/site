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
    // The particles are animated purely with CSS keyframes (see
    // `.particle` in css/style.css): the previous per-frame rAF loop mutated
    // 20 element styles on every animation frame, which forced a full style
    // recalculation of the whole page per frame and produced long
    // main-thread tasks (Lighthouse TBT failure, PR #91).
    if (!prefersReducedMotion) {
        createParticles();
    }
});

// Create floating particle effects (CSS-animated: no per-frame JavaScript)
function createParticles() {
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 3 + 2;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        // Random duration + negative delay: every particle floats with its
        // own period and starts mid-cycle (no synchronized start).
        particle.style.animationDuration = (Math.random() * 20 + 20) + 's';
        particle.style.animationDelay = -(Math.random() * 20) + 's';

        document.body.appendChild(particle);
    }
}


/* ============================================
   ECLIPTICA PAGE FUNCTIONALITY
   ============================================ */

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
