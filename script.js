document.addEventListener('DOMContentLoaded', () => {
    // 1. Google Anti-Gravity Effect Implementation
    const antiGravityElements = document.querySelectorAll('.anti-gravity, .anti-gravity-reverse, .anti-gravity-hover');
    
    // Store original transforms if they exist
    antiGravityElements.forEach(el => {
        el.dataset.originalTransform = el.style.transform || '';
    });

    // Track mouse coordinates
    let mouseX = 0;
    let mouseY = 0;
    
    // Target interpolation for smooth movement
    let currentX = 0;
    let currentY = 0;
    
    // Update mouse position
    window.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to center of screen, scaled down for subtle effect
        mouseX = (e.clientX - window.innerWidth / 2) / 25;
        mouseY = (e.clientY - window.innerHeight / 2) / 25;
    });
    
    // Animation loop for smooth easing using lerp (Linear Interpolation)
    function animate() {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;
        
        antiGravityElements.forEach(el => {
            // Hover-only elements get skipped in the constant float, they rely on CSS
            if (el.classList.contains('anti-gravity-hover')) return;

            const speed = parseFloat(el.getAttribute('data-speed')) || 0.05;
            const isReverse = el.classList.contains('anti-gravity-reverse') ? -1 : 1;
            
            const moveX = currentX * speed * 100 * isReverse;
            const moveY = currentY * speed * 100 * isReverse;
            
            // Combine with standard floating idle motion to make it look alive even when mouse is still
            const time = Date.now() * 0.001;
            const idleY = Math.sin(time + speed * 100) * 3;
            
            el.style.transform = `translate(${moveX}px, ${moveY + idleY}px)`;
        });
        
        requestAnimationFrame(animate);
    }
    
    // Start animation loop
    animate();

    // 2. Continuous slow floating for hero badge specifically
    const badge = document.querySelector('.badge-float');
    let time = 0;
    
    function floatIdle() {
        time += 0.03;
        if(badge) {
            const y = Math.sin(time) * 4;
            // Use translateY instead of margin to prevent layout recalculations
            badge.style.transform = `translateY(${y}px)`;
        }
        requestAnimationFrame(floatIdle);
    }
    floatIdle();

    // 3. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Offset for fixed/sticky things if ever added, or just some breathing room
                const offset = 40;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Reveal elements on scroll
    const revealElements = document.querySelectorAll('.feature-card, .step, .testi-card');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        el.style.opacity = 0;
        // Setting inline transform to translateY(30px) so the observer can animate it to 0
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        revealObserver.observe(el);
    });
});
