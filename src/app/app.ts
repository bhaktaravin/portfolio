import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LinkedInService } from './services/linkedin.service';
import { CommonModule } from '@angular/common';

interface Stat {
  value: string;
  label: string;
}

interface SkillCategory {
  name: string;
  skills: string[];
}

interface WorkExperience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
}

interface Certification {
  title: string;
  issuer: string;
  date?: string;
}

interface Testimonial {
  name: string;
  position: string;
  company: string;
  content: string;
  linkedinUrl?: string;
  profileImage?: string;
  date?: string;
  relationship?: string;
  isLinkedInRecommendation?: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Portfolio');

  // Dark mode functionality
  isDarkMode = signal(false);

  // LinkedIn authentication status
  isLinkedInAuthenticated = signal(false);

  constructor(private linkedInService: LinkedInService) {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    }

    // Check for LinkedIn auth code in URL
    this.handleLinkedInCallback();
  }

  ngOnInit() {
    // Component initialization
    this.checkLinkedInAuth();
  }

  private handleLinkedInCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      console.log('LinkedIn auth code received:', code);
      this.linkedInService.exchangeCodeForToken(code).subscribe(
        response => {
          if (response) {
            console.log('LinkedIn authentication successful:', response);
            this.isLinkedInAuthenticated.set(true);
            // Remove code from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Try to load LinkedIn data
            this.loadLinkedInData();
          }
        },
        error => {
          console.error('LinkedIn authentication failed:', error);
        }
      );
    }
  }

  private checkLinkedInAuth(): void {
    if (this.linkedInService.isAuthenticated()) {
      console.log('User is already authenticated with LinkedIn');
      this.isLinkedInAuthenticated.set(true);
      this.loadLinkedInData();
    } else {
      console.log('User is not authenticated with LinkedIn');
    }
  }

  private loadLinkedInData(): void {
    console.log('Loading LinkedIn data...');

    // Get user profile
    this.linkedInService.getUserProfile().subscribe(
      profile => {
        console.log('LinkedIn Profile loaded:', profile);
      },
      error => {
        console.error('Error loading LinkedIn profile:', error);
      }
    );

    // Note: LinkedIn API doesn't provide recommendations endpoint
    this.linkedInService.getRecommendations().subscribe(
      recommendations => {
        console.log('LinkedIn Recommendations (will be empty):', recommendations);
      }
    );
  }

  // LinkedIn authentication methods
  authenticateWithLinkedIn(): void {
    console.log('Starting LinkedIn authentication...');
    this.linkedInService.authenticate();
  }

  logoutFromLinkedIn(): void {
    console.log('Logging out from LinkedIn...');
    this.linkedInService.logout();
    this.isLinkedInAuthenticated.set(false);
  }

  toggleDarkMode() {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  // Personal Information
  fullName = 'Ravin Bhakta';
  jobTitle = 'Mid-Level Software Engineer | Full-Stack Developer | JavaScript, TypeScript, Node.js, React | Building Scalable Web Apps | AWS | Agile';
  heroDescription = 'Skilled Software Engineer with robust experience in Rust and Java development, API integration, and agile methodologies. Demonstrates proven expertise in building and maintaining scalable enterprise solutions, optimizing system performance, and collaborating with cross-functional teams.';
  aboutDescription = 'Skilled Software Engineer with robust experience in Rust and Java development, API integration, and agile methodologies. Demonstrates proven expertise in building and maintaining scalable enterprise solutions, optimizing system performance, and collaborating with cross-functional teams. Bringing strong debugging, SQL, and full-stack development proficiency to deliver efficient, modern applications.';
  email = 'ravin.bhakta@gmail.com';
  phone = '5107557264';
  location = 'Fremont, CA';
  resumeLink = '/assets/Ravin_Bhakta_Resume.pdf'; // Updated to use your PDF resume
  currentYear = new Date().getFullYear();

  // Resume download functionality
  downloadResume(): void {
    console.log('Downloading resume...');

    try {
      const link = document.createElement('a');
      link.href = this.resumeLink;
      link.download = 'Ravin_Bhakta_Resume.pdf'; // Updated to download as PDF
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success feedback
      this.showDownloadFeedback('Resume downloaded successfully!');
    } catch (error) {
      console.error('Error downloading resume:', error);
      this.showDownloadFeedback('Error downloading resume. Please try again.');
    }
  }

  // Alternative resume view functionality
  viewResume(): void {
    console.log('Opening resume in new tab...');
    window.open(this.resumeLink, '_blank');
  }

  // Show download feedback
  private showDownloadFeedback(message: string): void {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-blue);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      font-weight: 500;
      transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  get initials(): string {
    return this.fullName.split(' ').map(name => name.charAt(0)).join('');
  }

  // Statistics
  stats: Stat[] = [
    { value: '5+', label: 'Years Experience' },
    { value: '10+', label: 'Projects Completed' },
    { value: '3', label: 'Companies Worked' },
    { value: '15+', label: 'Technologies' }
  ];

  // Skills Categories
  skillCategories: SkillCategory[] = [
    {
      name: 'Programming Languages',
      skills: ['Java', 'Rust', 'TypeScript', 'JavaScript', 'C#', 'Oracle PL/SQL', 'PowerShell ISE']
    },
    {
      name: 'Frontend Development',
      skills: ['ReactJS', 'AngularJS', 'Bootstrap', 'Kendo UI', 'HTML5', 'CSS3']
    },
    {
      name: 'Backend & Databases',
      skills: ['Node.js', 'Express', 'Mongoose', 'MongoDB', 'Supabase', 'Firebase', 'Oracle SQL Server']
    },
    {
      name: 'Cloud & DevOps',
      skills: ['AWS', 'Docker', 'GCP', 'Version Control (SVN/Git)', 'Agile/Scrum']
    }
  ];

  // Work Experience
  workExperience: WorkExperience[] = [
    {
      title: 'Operations Associate Applications Developer',
      company: 'Blue Shield of California',
      period: 'July 2021 - June 2025',
      description: 'Leveraged VBA, PowerShell, and version control tools (SVN/Git) to support software development and maintenance in an enterprise environment. Applied debugging and integration techniques for APIs, services, and RESTful architectures to resolve complex business challenges and optimize system performance.'
    },
    {
      title: 'Software Developer',
      company: 'Entappia',
      period: 'August 2019 - June 2021',
      description: 'Developed RESTful APIs, increasing integration capabilities and enhanced system interconnectivity. Integrated SAP Open Connectors with cloud databases such as Firebase and Amazon DynamoDB to enhance system performance and scalability. Revamped legacy codebases by updating and modularizing, aligning them with modern standards, reducing costs, and enhancing functionality.'
    },
    {
      title: 'Quality Assurance Intern',
      company: 'Los Angeles Housing Authority',
      period: 'August 2018 - April 2019',
      description: 'Increased processing speed by transitioning from XML to C# storage system. Implemented a more user-friendly website by making it look more modern using C# and Bootstrap along with KendoUI. Redesigned future applicant/current tenant housing authority portal using ASP.NET MVC with Entity, Kendo UI, and SQL Server.'
    }
  ];

  // Featured Projects
  projects: Project[] = [
    {
      title: 'MangaViewer',
      description: 'Modern manga reading application built with Angular and TypeScript, featuring responsive design, chapter navigation, and optimized image loading for seamless reading experience.',
      technologies: ['Angular', 'TypeScript', 'CSS3', 'HTML5', 'Responsive Design'],
      githubUrl: 'https://github.com/ravinbhakta/mangaviewer',
      liveUrl: 'https://mangaviewer-rust-angular.vercel.app/home'
    },
    {
      title: 'Ruby on Rails Blog',
      description: 'Full-featured blog application built with Ruby on Rails, featuring user authentication, post management, commenting system, and responsive design. Demonstrates MVC architecture and RESTful routing.',
      technologies: ['Ruby', 'Ruby on Rails', 'HTML5', 'CSS3', 'SQLite', 'Bootstrap'],
      githubUrl: 'https://github.com/bhaktaravin/ruby_on_rails_blog',
      liveUrl: ''
    },
    {
      title: 'Flutter Personal Finance Tracker',
      description: 'Cross-platform mobile application for personal finance management built with Flutter. Features expense tracking, budget planning, financial analytics, and intuitive mobile-first design.',
      technologies: ['Flutter', 'Dart', 'SQLite', 'Material Design', 'Charts'],
      githubUrl: 'https://github.com/bhaktaravin/flutter_personal_finance_tracker',
      liveUrl: ''
    },
    {
      title: 'Flutter Hinge Detector',
      description: 'Innovative Flutter application that detects device hinge positioning for foldable devices. Demonstrates advanced mobile hardware integration, sensor management, and adaptive UI design for dual-screen experiences.',
      technologies: ['Flutter', 'Dart', 'Sensor APIs', 'Foldable UI', 'Hardware Integration'],
      githubUrl: 'https://github.com/bhaktaravin/flutter_hinge_detector',
      liveUrl: ''
    }
  ];

  // Social Links
  socialLinks: SocialLink[] = [
    { platform: 'GitHub', url: 'https://github.com/bhaktaravin', icon: '🐙' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ravin-rohitbhai-bhakta', icon: '💼' },
    { platform: 'Email', url: 'mailto:ravin.bhakta@gmail.com', icon: '📧' },
    { platform: 'Phone', url: 'tel:5107557264', icon: '📱' }
  ];

  // Education
  education: Education[] = [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'California State University, Los Angeles',
      period: 'August 2015 - April 2019',
      location: 'Los Angeles, CA'
    }
  ];

  // Certifications
  certifications: Certification[] = [
    {
      title: 'Supervised Machine Learning: Regression and Classification',
      issuer: 'Stanford Online'
    }
  ];

  // Sample testimonials for testing
  testimonials: Testimonial[] = [
    {
      name: 'Test User 1',
      position: 'Senior Engineering Manager',
      company: 'Tech Solutions Inc.',
      content: 'This is a sample testimonial for testing LinkedIn authentication functionality.',
      linkedinUrl: 'https://linkedin.com/in/example1',
      relationship: 'worked directly with Ravin',
      date: '2024',
      isLinkedInRecommendation: true
    },
    {
      name: 'Test User 2',
      position: 'Technical Lead',
      company: 'Digital Innovations Co.',
      content: 'Another sample testimonial to test the LinkedIn integration and authentication system.',
      linkedinUrl: 'https://linkedin.com/in/example2',
      relationship: 'managed Ravin directly',
      date: '2023',
      isLinkedInRecommendation: true
    }
  ];

  // Contact form submission
  onSubmitContact(): void {
    alert('Thank you for your message! I will get back to you soon.');
  }
}
