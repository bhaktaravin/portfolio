import { Component } from '@angular/core';

import { CERTIFICATIONS } from '../data/portfolio.data';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [],
  templateUrl: './certifications.html',
  styleUrls: ['./certifications.css'],
})
export class CertificationsComponent {
  readonly certifications = CERTIFICATIONS;
}
