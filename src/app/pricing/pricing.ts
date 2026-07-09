import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRICING_TIERS, SERVICES, PROFILE } from '../data/portfolio.data';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.html',
  styleUrls: ['./pricing.css'],
})
export class PricingComponent {
  readonly tiers = PRICING_TIERS;
  readonly services = SERVICES;
  readonly profile = PROFILE;

  scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToBook(): void {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  }
}
