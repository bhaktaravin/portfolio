import { Component, inject } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PROFILE } from '../data/portfolio.data';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
})
export class BookingComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly profile = PROFILE;
  readonly calEmbedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `${PROFILE.calLink}?embed=true&theme=dark&layout=month_view`,
  );
}
