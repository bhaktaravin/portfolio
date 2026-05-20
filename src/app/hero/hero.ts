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
  jobTitle = 'AI-Assisted Full-Stack Engineer';
  tagline = 'Building Intelligent Apps, LLM Workflows & Scalable Cloud Systems';
  description = 'Full-stack engineer with 5+ years shipping enterprise APIs and AI-assisted products—from LLM-powered career tools to scalable React and Angular applications on AWS and cloud-native stacks.';
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
      platform: 'Gumroad',
      url: 'https://ravinspire34.gumroad.com/',
      icon: '🛒',
      ariaLabel: 'Visit my Gumroad store'
    },
    {
      platform: 'Email',
      url: 'mailto:ravin.bhakta@gmail.com',
      icon: '✉️',
      ariaLabel: 'Send me an email'
    }
  ];

  techStack = [
    'LLM Integration',
    'React',
    'Angular',
    'TypeScript',
    'AWS',
    'NestJS'
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
