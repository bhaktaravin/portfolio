import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQ_ITEMS } from '../data/portfolio.data';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css'],
})
export class FaqComponent {
  readonly faqItems = FAQ_ITEMS;
  readonly openIndex = signal<number | null>(null);

  toggle(event: Event, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.openIndex.set(this.openIndex() === index ? null : index);
  }

  isOpen(index: number): boolean {
    return this.openIndex() === index;
  }
}
