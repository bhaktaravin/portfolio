import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PROFILE } from '../data/portfolio.data';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
})
export class BookingComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly theme = inject(ThemeService);

  readonly profile = PROFILE;
  calEmbedUrl: SafeResourceUrl | null = null;

  constructor() {
    effect(() => {
      const themeParam = this.theme.isLight() ? 'light' : 'dark';
      const embedUrl = `${PROFILE.calLink}?embed=true&theme=${themeParam}&layout=month_view`;
      this.calEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    });
  }
}
