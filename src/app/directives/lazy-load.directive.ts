import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit {
  @Input() appLazyLoad: string = '';

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Add loading class for fade-in effect
    this.renderer.addClass(this.el.nativeElement, 'lazy-loading');
    
    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage();
            observer.unobserve(this.el.nativeElement);
          }
        });
      },
      {
        rootMargin: '50px' // Start loading 50px before image enters viewport
      }
    );

    observer.observe(this.el.nativeElement);
  }

  private loadImage() {
    const img = this.el.nativeElement;
    
    // Set the actual src
    if (this.appLazyLoad) {
      img.src = this.appLazyLoad;
    }

    // Add loaded class when image loads
    img.onload = () => {
      this.renderer.removeClass(img, 'lazy-loading');
      this.renderer.addClass(img, 'lazy-loaded');
    };

    // Handle errors
    img.onerror = () => {
      this.renderer.removeClass(img, 'lazy-loading');
      this.renderer.addClass(img, 'lazy-error');
    };
  }
}
