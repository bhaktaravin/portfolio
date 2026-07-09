import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PROFILE, ABOUT_STATS, SERVICES, TECH_STACK,
} from '../data/portfolio.data';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class AboutComponent {
  readonly fullName = PROFILE.fullName;
  readonly jobTitle = PROFILE.jobTitle;
  readonly sectionSubtitle = PROFILE.aboutSubtitle;
  readonly aboutDescription = PROFILE.aboutDescription;
  readonly services = SERVICES;
  readonly stats = ABOUT_STATS;
  readonly location = PROFILE.location;
  readonly techStack = TECH_STACK;

  get initials(): string {
    return this.fullName.split(' ').map((n) => n.charAt(0)).join('');
  }

  downloadResume(format: string): void {
    const link = document.createElement('a');
    if (format === 'pdf') {
      link.href = PROFILE.resumeLink;
      link.download = 'Ravin_Bhakta_Resume.pdf';
    } else if (format === 'docx') {
      link.href = 'assets/resume.docx';
      link.download = 'Ravin_Bhakta_Resume.docx';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
