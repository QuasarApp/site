// QuasarApp Group - Main JavaScript
// Additional functionality and animations

document.addEventListener('DOMContentLoaded', function() {
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
            animation-delay: calc(var(--item-index) * 0.1s);
            --item-index: 0;
        }
    `;
    document.head.appendChild(style);

    // Add tilt effect to project cards
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

    // Floating particles effect
    createParticles();
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

// Console branding
console.log('%c QuasarApp Group ', 'background: #00bcd4; color: white; font-size: 20px; padding: 10px;');
console.log('%c Building the Future of Software ', 'color: #00bcd4; font-size: 14px;');