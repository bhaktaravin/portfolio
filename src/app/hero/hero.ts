import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class HeroComponent {
  fullName = 'Ravin Bhakta';
  jobTitle = 'Full-Stack Engineer';
  tagline = 'Building Enterprise APIs & Scalable Cloud Solutions';
  description = 'Full-Stack Engineer with 5+ years of experience building enterprise APIs, internal tools, and scalable cloud solutions. Specialized in Angular, React, Java Spring, Python/Django, and AWS.';
  location = 'Fremont, CA';

  stats = [
    { value: '5+', label: 'Years Experience' },
    { value: '10+', label: 'Projects Completed' },
    { value: '3', label: 'Companies Worked' },
    { value: '15+', label: 'Technologies' }
  ];

  socialLinks = [
    {
      platform: 'GitHub',
      url: 'https://github.com/bhaktaravin',
      icon: '🐙',
      ariaLabel: 'Visit my GitHub profile'
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/ravin-rohitbhai-bhakta',
      icon: '🔗',
      ariaLabel: 'Connect with me on LinkedIn'
    },
    {
      platform: 'Email',
      url: 'mailto:ravin.bhakta@gmail.com',
      icon: '✉️',
      ariaLabel: 'Send me an email'
    }
  ];

  techStack = [
    'Angular',
    'React',
    'Java Spring',
    'Python/Django',
    'AWS',
    'TypeScript'
  ];

  // Get initials for avatar
  get initials(): string {
    return this.fullName.split(' ').map(name => name.charAt(0)).join('');
  }

  // Scroll to section
  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Download resume
  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/resume.pdf';
    link.download = 'Ravin_Bhakta_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // View projects
  viewProjects() {
    this.scrollTo('projects');
  }

  // Contact me
  contactMe() {
    this.scrollTo('contact');
  }
}
