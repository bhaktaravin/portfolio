import { Directive, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appCardTilt]',
  standalone: true
})
export class CardTiltDirective implements OnInit, OnDestroy {
  private element: HTMLElement;
  private isHovering = false;

  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    // Add transition style
    this.element.style.transition = 'transform 0.3s ease-out';
    this.element.style.transformStyle = 'preserve-3d';
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovering = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovering = false;
    // Reset to original position
    this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isHovering) return;

    const rect = this.element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    this.element.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale(1.02)
    `;
  }

  ngOnDestroy() {
    // Clean up
    this.element.style.transform = '';
  }
}
