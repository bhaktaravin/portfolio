import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class HeroComponent implements OnInit, OnDestroy {
  fullName = 'Ravin Bhakta';
  jobTitle = 'Full-Stack Engineer';
  tagline = 'Building Enterprise APIs & Scalable Cloud Solutions';
  typedTagline = '';
  description = 'Full-Stack Engineer with 5+ years of experience building enterprise APIs, internal tools, and scalable cloud solutions. Specialized in Angular, React, Java Spring, Python/Django, and AWS.';
  location = 'Fremont, CA';
  
  // Availability status
  availability = {
    status: 'available',
    text: 'Open to Opportunities',
    icon: '🟢'
  };
  
  private typingInterval: any;
  private currentIndex = 0;
  private isDeleting = false;
  
  // Multiple taglines to rotate through
  taglines = [
    'Building Enterprise APIs & Scalable Cloud Solutions',
    'Specialized in Angular, React & Java Spring',
    'Creating Robust Full-Stack Applications',
    'AWS Cloud Architecture Expert'
  ];
  private currentTaglineIndex = 0;

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

  ngOnInit() {
    this.startTypingAnimation();
  }

  ngOnDestroy() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  private startTypingAnimation() {
    const typingSpeed = 100;
    const deletingSpeed = 60;
    const pauseAfterComplete = 2000;
    const pauseAfterDelete = 500;

    // Clear any existing interval to prevent overlap
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    this.typingInterval = setInterval(() => {
      const currentTagline = this.taglines[this.currentTaglineIndex];
      
      if (!this.isDeleting && this.currentIndex < currentTagline.length) {
        // Typing - add one character
        this.typedTagline = currentTagline.substring(0, this.currentIndex + 1);
        this.currentIndex++;
      } else if (!this.isDeleting && this.currentIndex === currentTagline.length) {
        // Finished typing - pause before deleting
        clearInterval(this.typingInterval);
        this.typingInterval = window.setTimeout(() => {
          this.isDeleting = true;
          this.startTypingAnimation();
        }, pauseAfterComplete);
      } else if (this.isDeleting && this.currentIndex > 0) {
        // Deleting - remove one character
        this.currentIndex--;
        this.typedTagline = currentTagline.substring(0, this.currentIndex);
      } else if (this.isDeleting && this.currentIndex === 0) {
        // Finished deleting - move to next tagline
        clearInterval(this.typingInterval);
        this.isDeleting = false;
        this.currentTaglineIndex = (this.currentTaglineIndex + 1) % this.taglines.length;
        this.typingInterval = window.setTimeout(() => {
          this.startTypingAnimation();
        }, pauseAfterDelete);
      }
    }, this.isDeleting ? deletingSpeed : typingSpeed);
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

  // Copy to clipboard
  copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Simple feedback - you can integrate with toast service if available
      const button = event?.target as HTMLElement;
      const originalText = button.textContent;
      button.textContent = '✓ Copied!';
      setTimeout(() => {
        if (button) button.textContent = originalText || label;
      }, 2000);
    });
  }
}
