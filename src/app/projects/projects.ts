import { Component, OnInit } from "@angular/core";

import { CommonModule } from "@angular/common";

import { FormsModule } from "@angular/forms";

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

import { CardTiltDirective } from "../shared/directives/card-tilt.directive";
import { ArchitectureDiagramComponent } from "../shared/components/architecture-diagram/architecture-diagram.component";

interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  technologies: string[];
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image?: string;
  images?: string[];
  liveUrl?: string;
  githubUrl?: string;
  codepenUrl?: string;
  stackblitzUrl?: string;
  demoType?: "live" | "video" | "interactive";
  featured?: boolean;
  completionDate?: string;
  teamSize?: number;
  myRole?: string;
  challenges?: string[];
  solutions?: string[];
  results?: string[];
  metrics?: {
    label: string;
    value: string;
    improvement?: string;
  }[];
  caseStudy?: {
    overview: string;
    problem: string;
    solution: string;
    process: string[];
    outcome: string;
    challenges: string[];
    lessons: string[];
  };
  tags?: string[];
}

interface TechStack {
  name: string;
  icon: string;
  color: string;
}

// SVG icon mapping for common techs with colors
const techStackData: Record<string, TechStack> = {
  Angular: {
    name: "Angular",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M128 0L256 48L232 208L128 256L24 208L0 48L128 0Z" fill="#DD0031"/><path d="M128 0V256L232 208L256 48L128 0Z" fill="#C3002F"/></svg>`,
    color: "#DD0031",
  },
  React: {
    name: "React",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="128" cy="128" r="28" fill="#61DAFB"/></svg>`,
    color: "#61DAFB",
  },
  TypeScript: {
    name: "TypeScript",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="60" fill="#3178C6"/></svg>`,
    color: "#3178C6",
  },
  JavaScript: {
    name: "JavaScript",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="60" fill="#F7DF1E"/></svg>`,
    color: "#F7DF1E",
  },
  Vue: {
    name: "Vue.js",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M204.8 0h40L128 220.8L11.2 0h40L128 177.6L204.8 0z" fill="#41B883"/></svg>`,
    color: "#4FC08D",
  },
  Flutter: {
    name: "Flutter",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M157.65 0L0 157.65h45.1L157.65 45.1V0z" fill="#40D0FD"/></svg>`,
    color: "#02569B",
  },
  Python: {
    name: "Python",
    icon: `<svg viewBox="0 0 256 256" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path fill="#3776AB" d="M126.9 0c-65.3 0-61.2 28.3-61.2 28.3l.1 29.3h62.3v8.8H41.1S0 63.6 0 128c0 64.4 36 62.1 36 62.1h21.5v-30.3s-1.2-36.1 35.5-36.1h61.1s34.4.6 34.4-33.2V33.2S194.6 0 126.9 0z"/>
      <path fill="#FFD43B" d="M129.1 256c65.3 0 61.2-28.3 61.2-28.3l-.1-29.3h-62.3v-8.8h87s41.1 2.8 41.1-61.6c0-64.4-36-62.1-36-62.1h-21.5v30.3s1.2 36.1-35.5 36.1H101.9s-34.4-.6-34.4 33.2v57.3S61.4 256 129.1 256z"/>
    </svg>`,
    color: "#3776AB",
  },

  Flask: {
    name: "Flask",
    icon: `<svg viewBox="0 0 256 256" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path fill="#000000" d="M96 0h64v32l-16 32v64l48 80v48H64v-48l48-80V64L96 32V0z"/>
    </svg>`,
    color: "#000000",
  },

  FastAPI: {
    name: "FastAPI",
    icon: `<svg viewBox="0 0 256 256" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="128" cy="128" r="128" fill="#009688"/>
      <path fill="#ffffff" d="M80 80h96v24h-36v72h-24v-72H80z"/>
    </svg>`,
    color: "#009688",
  },

  SQLite: {
    name: "SQLite",
    icon: `<svg viewBox="0 0 256 256" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="128" cy="40" rx="96" ry="32" fill="#0C4B6E"/>
      <path fill="#0C4B6E" d="M32 40v136c0 17.7 43 32 96 32s96-14.3 96-32V40"/>
      <ellipse cx="128" cy="176" rx="96" ry="32" fill="#1E88C9"/>
    </svg>`,
    color: "#1E88C9",
  },

  SQLAlchemy: {
    name: "SQLAlchemy",
    icon: `<svg viewBox="0 0 256 256" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" rx="40" fill="#B30000"/>
      <path fill="#ffffff" d="M72 72h32l80 112h-32zM112 72h32l40 56h-32z"/>
    </svg>`,
    color: "#B30000",
  },

  Pandas: {
    name: "Pandas",
    icon: `<svg viewBox="0 0 256 256" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="24" width="24" height="208" fill="#150458"/>
      <rect x="96" y="24" width="24" height="208" fill="#150458"/>
      <rect x="152" y="24" width="24" height="208" fill="#150458"/>
    </svg>`,
    color: "#150458",
  },

  Node: {
    name: "Node.js",
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="128" cy="128" r="60" fill="#8CC84B"/></svg>`,
    color: "#8CC84B",
  },
};

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardTiltDirective,
    ArchitectureDiagramComponent,
  ],
  templateUrl: "./projects.html",
  styleUrls: ["./projects.css"],
  animations: [
    trigger("slideIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate(
          "300ms ease-in",
          style({ opacity: 1, transform: "translateY(0)" }),
        ),
      ]),
    ]),
    trigger("cardHover", [
      state("default", style({ transform: "scale(1)" })),
      state("hovered", style({ transform: "scale(1.02)" })),
      transition("default <=> hovered", animate("200ms ease-in-out")),
    ]),
  ],
})
export class ProjectsComponent implements OnInit {
  searchQuery = "";
  selectedCategory = "all";
  selectedTechnology = "all";
  selectedDifficulty = "all";
  sortBy = "featured";
  viewMode: "grid" | "list" = "grid";
  showFilters = false;

  selectedProject: Project | null = null;
  showProjectModal = false;
  activeModalTab = "overview";
  activeCaseStudySection = "overview";

  hoveredCard: string | null = null;

  projects: Project[] = [
    // Angular MangaViewer
    {
      id: "mangaviewer",
      title: "MangaViewer",
      description:
        "Modern manga reading application with optimized performance and responsive design.",
      detailedDescription:
        "A comprehensive manga reading platform built with Angular and TypeScript, featuring advanced image optimization, chapter management, and seamless user experience across all devices.",
      technologies: ["Angular", "TypeScript", "CSS3", "HTML5", "PWA"],
      category: "Web Application",
      difficulty: "Intermediate",
      featured: true,
      completionDate: "2023-12",
      teamSize: 1,
      myRole: "Full Stack Developer",
      githubUrl: "https://github.com/ravinbhakta/mangaviewer",
      liveUrl: "https://mangaviewer-rust-angular.vercel.app/home",
      demoType: "live",
      image: "assets/mangaviewer.png",
      images: ["assets/mangaviewer.png", "assets/mangaviewer-mobile.png"],
      tags: ["Responsive", "PWA", "Performance"],
      challenges: [
        "Optimizing large image loading for manga pages",
        "Creating smooth reading experience across devices",
        "Implementing efficient chapter navigation",
      ],
      solutions: [
        "Implemented lazy loading and image preloading strategies",
        "Built responsive design with touch gestures for mobile",
        "Created efficient caching mechanism for chapter data",
      ],
      results: [
        "50% faster page load times",
        "Smooth reading experience on all devices",
        "Zero layout shift during navigation",
      ],
      metrics: [
        { label: "Page Load Time", value: "1.2s", improvement: "50% faster" },
        {
          label: "Mobile Performance",
          value: "95/100",
          improvement: "Lighthouse score",
        },
        {
          label: "User Engagement",
          value: "+40%",
          improvement: "Average session time",
        },
      ],
      caseStudy: {
        overview: 'A comprehensive manga reading platform built with Angular that delivers a fast, immersive reading experience across all devices. The project focused on solving critical performance bottlenecks with large image-heavy content while maintaining a smooth, app-like user experience.',
        problem: 'Existing manga readers suffered from slow page loads, poor mobile experience, and excessive data consumption. Users were frustrated with layout shifts, unresponsive controls, and the inability to read offline. The challenge was to create a reading experience that felt as natural as reading a physical book.',
        solution: 'Built a Progressive Web App with Angular featuring intelligent image preloading, responsive design with touch gestures, and an efficient caching mechanism. Implemented lazy loading strategies that prioritize visible content while pre-fetching upcoming pages in the background.',
        process: [
          'Researched competitor platforms and identified key UX pain points',
          'Designed a component architecture optimized for performance',
          'Implemented lazy loading with Intersection Observer API',
          'Built custom touch gesture handlers for natural page navigation',
          'Created an offline-first caching strategy using Service Workers',
          'Optimized images with responsive srcsets and WebP format',
          'Conducted performance audits and achieved 95/100 Lighthouse score',
        ],
        outcome: 'Delivered a production-ready manga reader with 50% faster page loads, zero layout shift, and seamless offline reading. The responsive design provides an identical experience across desktop and mobile devices.',
        challenges: [
          'Large image files causing bandwidth issues on mobile networks',
          'Creating smooth swipe-to-navigate without jank',
          'Managing memory efficiently with hundreds of images loaded',
          'Implementing accurate reading progress tracking across sessions',
        ],
        lessons: [
          'Intersection Observer API is critical for performance-sensitive apps',
          'Service Workers require careful cache invalidation strategies',
          'Touch gesture detection needs debouncing to prevent false triggers',
          'Progressive enhancement ensures functionality across browsers',
        ],
      },
    },
    // Python Job Recommender
    {
      id: "smart-job-recommender",
      title: "Python Job Recommender",
      description:
        "Automated job scraper and recommender system built with Python and FastAPI.",
      detailedDescription:
        "A backend-focused project that scrapes job listings, analyzes user preferences, and recommends suitable jobs. Built with Python, Flask, SQLite, SQLAlchemy, and FastAPI, featuring RESTful endpoints and automated recommendation logic.",
      technologies: [
        "Python",
        "Flask",
        "SQLite",
        "SQLAlchemy",
        "FastAPI",
        "Pandas",
      ],
      category: "Web Application",
      difficulty: "Intermediate",
      featured: true,
      completionDate: "2026-01",
      teamSize: 1,
      myRole: "Full Stack / Backend Developer",
      githubUrl: "https://github.com/yourusername/python-job-recommender",
      demoType: "live",
      image: "assets/python-job-recommender.png",
      tags: ["Python", "Automation", "Job Recommendations"],
      challenges: [
        "Efficiently scraping large volumes of job data",
        "Designing a recommendation engine based on user preferences",
        "Integrating Flask APIs with FastAPI endpoints for better scalability",
      ],
      solutions: [
        "Implemented asynchronous scraping using `aiohttp`",
        "Built a recommendation algorithm using Pandas and user profiling",
        "Structured backend using Flask for core logic and FastAPI for API endpoints",
      ],
      results: [
        "Automated job recommendations for users based on skills and experience",
        "Reduced manual job searching effort",
        "Modular and scalable backend architecture",
      ],
      metrics: [
        {
          label: "Jobs Scraped",
          value: "50K+",
          improvement: "Automated daily scraping",
        },
        {
          label: "Recommendation Accuracy",
          value: "85%",
          improvement: "Based on user feedback",
        },
        {
          label: "API Response Time",
          value: "200ms",
          improvement: "Optimized FastAPI endpoints",
        },
      ],
      caseStudy: {
        overview: 'An automated job scraping and recommendation engine that collects 50,000+ job listings daily and matches them to user profiles using intelligent filtering and preference analysis. Built with Python, Flask, and FastAPI for high-performance data processing.',
        problem: 'Job seekers spend hours daily browsing multiple platforms to find relevant positions. Manual searching is inefficient, and most job platforms use generic matching that misses nuanced preferences like remote work, specific tech stacks, or company culture fit.',
        solution: 'Designed a two-tier architecture: Flask handles core business logic and data management, while FastAPI powers the high-performance API endpoints. Implemented an async scraping pipeline with aiohttp and built a recommendation algorithm using user profiling with Pandas.',
        process: [
          'Analyzed job platform APIs and identified scraping strategies',
          'Designed database schema with SQLAlchemy for efficient querying',
          'Built asynchronous scraping pipeline with rate limiting',
          'Implemented user preference profiling and matching algorithm',
          'Created RESTful API endpoints with FastAPI for sub-200ms responses',
          'Added automated daily cron jobs for continuous data collection',
          'Built A/B testing framework to improve recommendation accuracy',
        ],
        outcome: 'Achieved 85% recommendation accuracy based on user feedback, processing 50K+ jobs daily with 200ms API response times. The modular architecture allows easy scaling and integration with new job platforms.',
        challenges: [
          'Handling rate limits and anti-scraping measures from job platforms',
          'Normalizing job data from different sources into a unified schema',
          'Balancing recommendation precision vs. recall for diverse users',
          'Maintaining data freshness with expired and updated listings',
        ],
        lessons: [
          'Async I/O dramatically improves scraping throughput',
          'User feedback loops are essential for recommendation quality',
          'SQLAlchemy migrations need careful planning for schema evolution',
          'Separating Flask (admin) and FastAPI (API) improved maintainability',
        ],
      },
    },
    {
      id: "pokemon-quiz",
      title: "Pokemon Palace Quest",
      description:
        "Interactive quiz game for guessing Generation 1 Pokemon using the Pokemon API.",
      detailedDescription:
        "A fun and engaging web application that challenges users to guess original 151 Pokemon through various game modes, built with modern React and enhanced with beautiful animations and responsive design.",
      technologies: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "Shadcn/ui",
      ],
      category: "Web Game",
      difficulty: "Beginner",
      featured: false,
      completionDate: "2023-11",
      teamSize: 1,
      myRole: "Frontend Developer",
      githubUrl: "https://github.com/bhaktaravin/poke-pal-quiz",
      liveUrl: "https://poke-pal-quiz.vercel.app/",
      demoType: "interactive",
      stackblitzUrl: "https://stackblitz.com/github/bhaktaravin/poke-pal-quiz",
      image: "assets/poke-pal-quiz.png",
      tags: [
        "Game",
        "API Integration",
        "Animations",
        "Responsive Design",
        "User Interface",
        "User Experience",
        "Firebase Firestore",
        "Firebase Authentication",
      ],
      challenges: [
        "Creating engaging game mechanics",
        "Managing API data efficiently",
        "Building responsive game interface",
      ],
      solutions: [
        "Implemented multiple quiz modes for variety",
        "Used efficient caching for Pokemon data",
        "Created adaptive UI for different screen sizes",
      ],
      results: [
        "Engaging gameplay with multiple modes",
        "Fast loading with optimized API calls",
        "Smooth experience across all devices",
      ],
      metrics: [
        { label: "Game Sessions", value: "1000+", improvement: "Daily plays" },
        {
          label: "Completion Rate",
          value: "68%",
          improvement: "Users finish quiz",
        },
        { label: "Load Time", value: "0.8s", improvement: "Initial game load" },
      ],
      caseStudy: {
        overview: 'An engaging web-based quiz game challenging players to identify all 151 original Pokemon through multiple game modes. Built with React and TypeScript, featuring smooth animations, persistent leaderboards with Firebase, and responsive design for mobile gaming.',
        problem: 'Pokemon fan communities lacked a modern, polished quiz experience. Existing trivia apps were outdated, slow, and didn\'t leverage modern web capabilities like real-time leaderboards, adaptive difficulty, or mobile-optimized gameplay.',
        solution: 'Created a React application with Vite for blazing-fast builds and Tailwind CSS for responsive styling. Integrated PokeAPI for accurate Pokemon data, implemented Firebase for real-time leaderboards and authentication, and designed multiple game modes to keep players engaged.',
        process: [
          'Designed game mechanics and user flow wireframes',
          'Set up React + Vite + TypeScript project with Tailwind',
          'Built efficient PokeAPI data layer with caching',
          'Implemented multiple quiz modes (timed, endless, difficulty-based)',
          'Added Firebase Authentication and Firestore leaderboards',
          'Created smooth CSS animations and transitions',
          'Optimized for mobile with touch-friendly controls',
          'Deployed to Vercel with CI/CD pipeline',
        ],
        outcome: 'Launched to strong engagement with 1000+ daily game sessions, 68% quiz completion rate, and an active player community. The 0.8s initial load time ensures players start gaming immediately.',
        challenges: [
          'Managing API rate limits for PokeAPI with 151 Pokemon',
          'Creating engaging game mechanics that encourage replay',
          'Real-time leaderboard updates without Firebase costs spiraling',
          'Ensuring responsive game UI works well on small screens',
        ],
        lessons: [
          'Vite dramatically speeds up the development experience',
          'Firebase Firestore rules need careful security planning',
          'Gamification elements (streaks, scores) greatly improve retention',
          'Tailwind CSS utility classes speed up responsive design iteration',
        ],
      },
    },
  ];

  categories: string[] = [];
  technologies: string[] = [];
  difficulties: string[] = [];
  filteredProjects: Project[] = [];

  ngOnInit() {
    this.initializeFilterOptions();
    this.filterProjects();
  }

  private initializeFilterOptions() {
    this.categories = ["all", ...new Set(this.projects.map((p) => p.category))];
    this.technologies = [
      "all",
      ...new Set(this.projects.flatMap((p) => p.technologies)),
    ];
    this.difficulties = [
      "all",
      ...new Set(this.projects.map((p) => p.difficulty)),
    ];
  }

  filterProjects() {
    let filtered = this.projects;

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(query),
          ) ||
          (project.tags &&
            project.tags.some((tag) => tag.toLowerCase().includes(query))),
      );
    }

    if (this.selectedCategory !== "all") {
      filtered = filtered.filter(
        (project) => project.category === this.selectedCategory,
      );
    }

    if (this.selectedTechnology !== "all") {
      filtered = filtered.filter((project) =>
        project.technologies.includes(this.selectedTechnology),
      );
    }

    if (this.selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (project) => project.difficulty === this.selectedDifficulty,
      );
    }

    filtered = this.sortProjects(filtered);
    this.filteredProjects = filtered;
  }

  private sortProjects(projects: Project[]): Project[] {
    return projects.sort((a, b) => {
      switch (this.sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (
            new Date(b.completionDate || "").getTime() -
            new Date(a.completionDate || "").getTime()
          );
        case "newest":
          return (
            new Date(b.completionDate || "").getTime() -
            new Date(a.completionDate || "").getTime()
          );
        case "oldest":
          return (
            new Date(a.completionDate || "").getTime() -
            new Date(b.completionDate || "").getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }

  getTechStackInfo(tech: string): TechStack {
    return (
      techStackData[tech] || {
        name: tech,
        icon: `<span class="tech-fallback">${tech.charAt(0)}</span>`,
        color: "#6B7280",
      }
    );
  }

  onCardHover(projectId: string) {
    this.hoveredCard = projectId;
  }

  onCardLeave() {
    this.hoveredCard = null;
  }

  openProjectDetails(project: Project) {
    this.selectedProject = project;
    this.showProjectModal = true;
    this.activeModalTab = "overview";
    document.body.style.overflow = "hidden";
  }

  closeProjectModal() {
    this.showProjectModal = false;
    this.selectedProject = null;
    document.body.style.overflow = "auto";
  }

  setActiveTab(tab: string) {
    this.activeModalTab = tab;
    if (tab === 'casestudy') {
      this.activeCaseStudySection = 'overview';
    }
  }

  setCaseStudySection(section: string) {
    this.activeCaseStudySection = section;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  clearFilters() {
    this.searchQuery = "";
    this.selectedCategory = "all";
    this.selectedTechnology = "all";
    this.selectedDifficulty = "all";
    this.sortBy = "featured";
    this.filterProjects();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = "assets/placeholder.svg";
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case "Beginner":
        return "#10B981";
      case "Intermediate":
        return "#F59E0B";
      case "Advanced":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case "Web Application":
        return "🌐";
      case "Mobile Application":
        return "📱";
      case "Web Game":
        return "🎮";
      case "Desktop Application":
        return "🖥️";
      default:
        return "📦";
    }
  }

  launchDemo(project: Project) {
    if (project.liveUrl) {
      window.open(project.liveUrl, "_blank");
    } else if (project.stackblitzUrl) {
      window.open(project.stackblitzUrl, "_blank");
    }
  }

  onKeydown(event: KeyboardEvent, project: Project) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.openProjectDetails(project);
    }
  }

  trackByProject(index: number, item: Project): string {
    return item.id;
  }

  openGitHub(url: string) {
    window.open(url, "_blank");
  }
}
