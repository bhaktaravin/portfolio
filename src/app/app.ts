import { Component, signal, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

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

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected readonly title = signal('Portfolio');
  
  // Dark mode functionality
  isDarkMode = signal(false);
  
  // Mobile navigation
  isMobileMenuOpen = signal(false);
  
  // Contact form state
  contactForm = {
    name: '',
    email: '',
    message: ''
  };
  
  isSubmitting = signal(false);
  formStatus = signal<'idle' | 'success' | 'error'>('idle');
  statusMessage = signal('');
  
  // Animation states
  isTyping = signal(false);
  typedText = signal('');
  scrollProgress = signal(0);
  private intersectionObserver?: IntersectionObserver;
  private typingTimeout?: any;
  
  @ViewChild('heroText', { static: false }) heroTextRef!: ElementRef;
  
  constructor() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    }
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
  
  toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
  
  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  // Button click handler with animation feedback
  onButtonClick(event: Event) {
    const button = event.target as HTMLElement;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
  }
  
  // Personal Information - Update these with your details
  fullName = 'Ravin Bhakta';
  jobTitle = 'Mid-Level Software Engineer | Full-Stack Developer | JavaScript, TypeScript, Node.js, React | Building Scalable Web Apps | AWS | Agile';
  heroDescription = 'Skilled Software Engineer with robust experience in Rust and Java development, API integration, and agile methodologies. Demonstrates proven expertise in building and maintaining scalable enterprise solutions, optimizing system performance, and collaborating with cross-functional teams.';
  aboutDescription = 'Skilled Software Engineer with robust experience in Rust and Java development, API integration, and agile methodologies. Demonstrates proven expertise in building and maintaining scalable enterprise solutions, optimizing system performance, and collaborating with cross-functional teams. Bringing strong debugging, SQL, and full-stack development proficiency to deliver efficient, modern applications.';
  email = 'ravin.bhakta@gmail.com';
  phone = '5107557264';
  location = 'Fremont, CA';
  resumeLink = '#'; // Add your resume link
  currentYear = new Date().getFullYear();
  
  // Get initials for profile image
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
      description: 'A dynamic web application for seamless manga reading with intuitive page navigation. Features smooth page transitions, chapter management, and optimized loading for an enhanced reading experience across devices.',
      technologies: ['Angular', 'TypeScript', 'CSS3', 'HTML5', 'Responsive Design'],
      githubUrl: 'https://github.com/bhaktaravin/page_flow_reader_vite_reactjs',
      liveUrl: 'https://page-flow-reader-vite-reactjs.vercel.app/'
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
    ,
    {
      title: 'Flutter Text to Image Supabase',
      description: 'Flutter app that generates images from text using Supabase as backend. Features text-to-image conversion, Supabase integration, and a modern mobile UI.',
      technologies: ['Flutter', 'Dart', 'Supabase', 'AI', 'Mobile'],
      githubUrl: 'https://github.com/bhaktaravin/flutter_text_to_image_supabase',
      liveUrl: 'https://flutter-text-to-image-supabase-git-web-bhaktaravins-projects.vercel.app/'
    }
  ];
  
  // Social Links
  socialLinks: SocialLink[] = [
    { platform: 'GitHub', url: 'https://github.com/bhaktaravin', icon: '🐙' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ravin-rohitbhai-bhakta', icon: '💼' },
    { platform: 'Email', url: 'mailto:ravin.bhakta@gmail.com', icon: '�' },
    { platform: 'Phone', url: 'tel:5107557264', icon: '�' }
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
      title: 'Introduction to Scrum Master Profession',
      issuer: 'IBM',
      date: 'September 2025'
    },
    {
      title: 'Machine Learning Specialization',
      issuer: 'DeepLearning.AI, Stanford University',
      date: 'September 2025'
    },
    {
      title: 'Unsupervised Learning, Recommenders, Reinforcement Learning',
      issuer: 'Stanford University',
      date: 'September 2025'
    },
    {
      title: 'Advanced Learning Algorithms',
      issuer: 'DeepLearning.AI, Stanford University',
      date: 'August 2025'
    },
    {
      title: 'Introduction to Cybersecurity Careers',
      issuer: 'IBM',
      date: 'August 2025'
    },
    {
      title: 'Supervised Machine Learning: Regression and Classification',
      issuer: 'Stanford Online'
    }
  ];
  
  // Contact form submission with EmailJS
  async onSubmitContact(): Promise<void> {
    if (this.isSubmitting()) return;
    
    // Basic validation
    if (!this.contactForm.name.trim() || !this.contactForm.email.trim() || !this.contactForm.message.trim()) {
      this.formStatus.set('error');
      this.statusMessage.set('Please fill in all fields.');
      this.resetStatusAfterDelay();
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.contactForm.email)) {
      this.formStatus.set('error');
      this.statusMessage.set('Please enter a valid email address.');
      this.resetStatusAfterDelay();
      return;
    }
    
    this.isSubmitting.set(true);
    this.formStatus.set('idle');
    
    try {
      // Replace these with your EmailJS service ID, template ID, and public key
      const result = await emailjs.send(
        'YOUR_SERVICE_ID',    // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID',   // Replace with your EmailJS template ID
        {
          from_name: this.contactForm.name,
          from_email: this.contactForm.email,
          message: this.contactForm.message,
          to_name: 'Ravin Bhakta'
        },
        'YOUR_PUBLIC_KEY'     // Replace with your EmailJS public key
      );
      
      console.log('Email sent successfully:', result);
      this.formStatus.set('success');
      this.statusMessage.set('Thank you! Your message has been sent successfully. I\'ll get back to you soon.');
      
      // Reset form
      this.contactForm = {
        name: '',
        email: '',
        message: ''
      };
      
    } catch (error) {
      console.error('Email sending failed:', error);
      this.formStatus.set('error');
      this.statusMessage.set('Sorry, there was an error sending your message. Please try again or contact me directly.');
    } finally {
      this.isSubmitting.set(false);
      this.resetStatusAfterDelay();
    }
  }
  
  private resetStatusAfterDelay(): void {
    setTimeout(() => {
      this.formStatus.set('idle');
      this.statusMessage.set('');
    }, 5000);
  }
  
  ngOnInit() {
    // Enable smooth scrolling
    this.enableSmoothScrolling();
    // Start typing animation after a short delay
    setTimeout(() => this.startTypingAnimation(), 1000);
    // Add scroll progress tracking
    this.trackScrollProgress();
    // Add keyboard navigation
    this.addKeyboardNavigation();
    // Initialize EmailJS
    this.initializeEmailJS();
  }
  
  private initializeEmailJS() {
    // Replace with your EmailJS public key
    emailjs.init('YOUR_PUBLIC_KEY'); // You'll need to replace this with your actual public key
  }
  
  ngAfterViewInit() {
    // Initialize intersection observer for scroll animations
    this.initializeScrollAnimations();
  }
  
  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    // Reset body overflow
    document.body.style.overflow = 'auto';
  }
  
  private enableSmoothScrolling() {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add click handlers for navigation links
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            console.log(`Scrolling to section: ${targetId}`); // Debug log
            const offsetTop = targetElement.offsetTop - 100; // Increased offset for better visibility
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
            
            // Special handling for contact section - force it to be visible immediately
            if (targetId === 'contact') {
              setTimeout(() => {
                console.log('Forcing contact section to be visible');
                targetElement.classList.add('animate-in');
                // Also ensure the form is visible
                const contactForm = targetElement.querySelector('.contact-form');
                if (contactForm) {
                  contactForm.classList.add('animate-in');
                }
              }, 100);
            }
            
            // Close mobile menu when navigating
            this.closeMobileMenu();
          } else {
            console.log(`Target element not found: ${targetId}`); // Debug log
          }
        }
      }
    });
  }
  
  private startTypingAnimation() {
    const fullText = this.fullName;
    let currentIndex = 0;
    this.isTyping.set(true);
    
    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        this.typedText.set(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        this.typingTimeout = setTimeout(typeNextChar, 100);
      } else {
        this.isTyping.set(false);
      }
    };
    
    typeNextChar();
  }
  
  private initializeScrollAnimations() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Element entering view:', entry.target.id || entry.target.className); // Debug log
          entry.target.classList.add('animate-in');
        }
      });
    }, options);
    
    // Observe all sections and cards with a slight delay to ensure DOM is ready
    setTimeout(() => {
      const elementsToAnimate = document.querySelectorAll(
        '.section, .project-card, .experience-item, .education-item, .certification-card, .skill-category'
      );
      
      console.log('Found elements to animate:', elementsToAnimate.length); // Debug log
      
      elementsToAnimate.forEach((el) => {
        this.intersectionObserver?.observe(el);
      });
      
      // Special handling for contact section to ensure it's always visible when navigated to
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        console.log('Contact section found, observing...'); // Debug log
        this.intersectionObserver?.observe(contactSection);
      }
    }, 100);
  }
  
  private trackScrollProgress() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      this.scrollProgress.set(Math.min(scrollPercent, 100));
    });
  }
  
  private addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen()) {
        this.closeMobileMenu();
      }
    });
  }
  
    // Enhanced button click effect\n  onButtonClick(event: Event) {\n    const button = event.target as HTMLElement;\n    button.classList.add('button-clicked');\n    setTimeout(() => {\n      button.classList.remove('button-clicked');\n    }, 300);\n  }\n  \n  // Test method to scroll to contact (for debugging)\n  scrollToContact() {\n    const contactElement = document.getElementById('contact');\n    if (contactElement) {\n      contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });\n    }\n  }
}
