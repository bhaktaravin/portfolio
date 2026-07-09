import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CERTIFICATIONS } from '../data/portfolio.data';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certifications.html',
  styleUrls: ['./certifications.css'],
})
export class CertificationsComponent {
  readonly certifications = CERTIFICATIONS;
}
