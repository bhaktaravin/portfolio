import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {
  
  celebrate(options?: { duration?: number; particleCount?: number }) {
    const duration = options?.duration || 3000;
    const particleCount = options?.particleCount || 50;
    
    this.createConfetti(particleCount);
    
    // Clean up after duration
    setTimeout(() => {
      this.cleanup();
    }, duration);
  }

  private createConfetti(count: number) {
    const colors = ['#4f8cff', '#6c63ff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6348'];
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-particle';
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        opacity: ${Math.random() * 0.5 + 0.5};
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
        z-index: 10000;
        pointer-events: none;
      `;
      
      document.body.appendChild(confetti);
    }
    
    // Add animation styles if not already present
    if (!document.getElementById('confetti-styles')) {
      const style = document.createElement('style');
      style.id = 'confetti-styles';
      style.textContent = `
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  private cleanup() {
    const particles = document.querySelectorAll('.confetti-particle');
    particles.forEach(particle => particle.remove());
  }
}
