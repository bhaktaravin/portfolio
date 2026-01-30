import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      *ngIf="showButton()"
      class="scroll-to-top"
      (click)="scrollToTop()"
      [attr.aria-label]="'Scroll to top'"
      [class.visible]="showButton()"
    >
      <span class="scroll-icon">↑</span>
    </button>
  `,
  styles: [`
    .scroll-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      background: var(--gradient-primary);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(79, 140, 255, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999;
      opacity: 0;
      transform: translateY(100px) scale(0.8);
      pointer-events: none;
    }

    .scroll-to-top.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    .scroll-to-top:hover {
      transform: translateY(-4px) scale(1.1);
      box-shadow: 0 6px 20px rgba(79, 140, 255, 0.6);
    }

    .scroll-to-top:active {
      transform: translateY(-2px) scale(1.05);
    }

    .scroll-icon {
      font-size: 1.5rem;
      color: white;
      font-weight: bold;
      line-height: 1;
    }

    @media (max-width: 768px) {
      .scroll-to-top {
        width: 3rem;
        height: 3rem;
        bottom: 1.5rem;
        right: 1.5rem;
      }

      .scroll-icon {
        font-size: 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .scroll-to-top {
        width: 2.75rem;
        height: 2.75rem;
        bottom: 1rem;
        right: 1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .scroll-to-top {
        transition: none;
      }
    }
  `]
})
export class ScrollToTopComponent {
  showButton = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    this.showButton.set(scrollY > 300);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
