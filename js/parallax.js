// QuasarApp Group - Parallax Effects
// Smooth parallax animations for cards and sections

class ParallaxManager {
    constructor() {
        this.cards = [];
        this.isAnimating = false;
    }

    init() {
        // Note: about-text intentionally excluded from parallax to prevent text spilling
        // Only target parallax-text elements that are NOT about-text (i.e., project cards)
        this.cards = document.querySelectorAll('.parallax-card, .about-section, .parallax-text:not(.about-text)');
        
        if (this.cards.length > 0) {
            this.bindEvents();
        }
    }

    bindEvents() {
        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    this.update();
                    ticking = false;
                }.bind(this));
                ticking = true;
            }
        }.bind(this));
    }

    update() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        this.cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardTop = rect.top;
            const cardHeight = rect.height;
            
            // Start effect when card is in viewport
            if (cardTop < windowHeight * 0.75) {
                const yPos = -scrollY * 0.15;
                card.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // Optional: Add mousemove parallax for hero section
    addMouseParallax() {
        this.hero = document.querySelector('.hero-section');
        if (!this.hero) return;

        let ticking = false;

        this.hero.addEventListener('mousemove', function(e) {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    this.updateMouseParallax(e);
                    ticking = false;
                }.bind(this));
                ticking = true;
            }
        }.bind(this));
    }

    updateMouseParallax(e) {
        const rect = this.hero.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (mouseY - centerY) / 100;
        const rotateY = (mouseX - centerX) / 100;
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            heroContent.style.transition = 'transform 0.1s ease-out';
        }
    }
}

// Initialize parallax when DOM is ready
<<<<<<< HEAD
const ParallaxHandler = new ParallaxManager();
window.ParallaxManager = ParallaxHandler;
=======
const parallax = new ParallaxHandler();
window.ParallaxHandler = ParallaxHandler; // Expose class globally for i18n.js compatibility
>>>>>>> main
document.addEventListener('DOMContentLoaded', function() {
    parallax.init();
    parallax.addMouseParallax();
});