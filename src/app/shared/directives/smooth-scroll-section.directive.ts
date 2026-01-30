import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appSmoothScrollSection]',
  standalone: true
})
export class SmoothScrollSectionDirective implements OnInit, OnDestroy {
  @Input() appSmoothScrollSection: string = 'fade-up'; // 'fade-up', 'fade-left', 'fade-right', 'scale'
  @Input() scrollDelay: number = 0;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateSection();
          // Only animate once
          if (this.observer) {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private animateSection(): void {
    const element = this.el.nativeElement;
    
    // Add animation class after delay
    setTimeout(() => {
      element.classList.add('scroll-section-animate');
      
      // Set animation type
      switch (this.appSmoothScrollSection) {
        case 'fade-up':
          element.style.animation = 'fadeUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
          break;
        case 'fade-left':
          element.style.animation = 'fadeLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
          break;
        case 'fade-right':
          element.style.animation = 'fadeRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
          break;
        case 'scale':
          element.style.animation = 'scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
          break;
        default:
          element.style.animation = 'fadeUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
      }
    }, this.scrollDelay);
  }
}
