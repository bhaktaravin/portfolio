import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROFILE, STATS, SOCIAL_LINKS, HERO_TECH_STACK,
} from '../data/portfolio.data';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
})
export class HeroComponent {
  readonly fullName = PROFILE.fullName;
  readonly jobTitle = PROFILE.jobTitle;
  readonly tagline = PROFILE.tagline;
  readonly description = PROFILE.heroDescription;
  readonly location = PROFILE.location;
  readonly availability = PROFILE.availability;
  readonly isAvailable = PROFILE.availabilityStatus === 'available';
  readonly stats = STATS;
  readonly socialLinks = SOCIAL_LINKS.filter((s) => s.platform !== 'Phone');
  readonly techStack = HERO_TECH_STACK;

  get initials(): string {
    return this.fullName.split(' ').map((n) => n.charAt(0)).join('');
  }

  scrollTo(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  downloadResume(): void {
    const link = document.createElement('a');
    link.href = PROFILE.resumeLink;
    link.download = 'Ravin_Bhakta_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  viewProjects(): void { this.scrollTo('projects'); }
  contactMe(): void { this.scrollTo('contact'); }
}
