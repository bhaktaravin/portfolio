import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PROFILE } from '../data/portfolio.data';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
})
export class BookingComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);

  readonly profile = PROFILE;
  calEmbedUrl: SafeResourceUrl | null = null;

  ngOnInit(): void {
    const embedUrl = `${PROFILE.calLink}?embed=true&theme=dark`;
    this.calEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
