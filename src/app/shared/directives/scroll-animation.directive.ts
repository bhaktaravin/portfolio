import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[appScrollAnimation]',
  standalone: true
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
  @Input() animationType: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' = 'fade';
  @Input() delay: number = 0;
  
  private observer?: IntersectionObserver;
  private element: HTMLElement;

  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    // Set initial state
    this.element.style.opacity = '0';
    this.element.style.transition = `opacity 0.6s ease-out ${this.delay}ms, transform 0.6s ease-out ${this.delay}ms`;
    
    switch (this.animationType) {
      case 'slide-up':
        this.element.style.transform = 'translateY(30px)';
        break;
      case 'slide-left':
        this.element.style.transform = 'translateX(-30px)';
        break;
      case 'slide-right':
        this.element.style.transform = 'translateX(30px)';
        break;
      case 'fade':
      default:
        this.element.style.transform = 'scale(0.95)';
        break;
    }

    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateIn();
            // Disconnect after animating once
            this.observer?.unobserve(this.element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.observer.observe(this.element);
  }

  private animateIn() {
    this.element.style.opacity = '1';
    this.element.style.transform = 'translateY(0) translateX(0) scale(1)';
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
