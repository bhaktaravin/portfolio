import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

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
    problem: string;
    solution: string;
    process: string[];
    outcome: string;
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
    icon: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="106.25" cy="20.48" r="8.32" fill="#306998"/></svg>`,
    color: "#306998",
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
  imports: [CommonModule, FormsModule],
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
  // Filter and search properties
  searchQuery = "";
  selectedCategory = "all";
  selectedTechnology = "all";
  selectedDifficulty = "all";
  sortBy = "featured";
  viewMode: "grid" | "list" = "grid";
  showFilters = false;

  // Modal properties
  selectedProject: Project | null = null;
  showProjectModal = false;
  activeModalTab = "overview";

  // Animation properties
  hoveredCard: string | null = null;

  projects: Project[] = [
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
        problem:
          "Traditional manga readers suffer from poor mobile experience and slow loading times, leading to frustrated users.",
        solution:
          "Built a modern Progressive Web App with optimized image handling and responsive design.",
        process: [
          "Research existing solutions and identify pain points",
          "Design responsive layouts with mobile-first approach",
          "Implement advanced image optimization techniques",
          "Add Progressive Web App capabilities",
          "Conduct user testing and performance optimization",
        ],
        outcome:
          "Created a fast, mobile-friendly manga reader that significantly improved user experience and engagement.",
      },
    },
    {
      id: "finance-tracker",
      title: "Flutter Personal Finance Tracker",
      description:
        "Cross-platform mobile app for comprehensive personal finance management.",
      detailedDescription:
        "A full-featured personal finance tracking application built with Flutter, offering expense tracking, budget planning, financial analytics, and intelligent insights to help users manage their money better.",
      technologies: ["Flutter", "Dart", "SQLite", "Material Design", "Charts"],
      category: "Mobile Application",
      difficulty: "Advanced",
      featured: true,
      completionDate: "2023-10",
      teamSize: 1,
      myRole: "Mobile Developer",
      githubUrl:
        "https://github.com/bhaktaravin/flutter_personal_finance_tracker",
      demoType: "video",
      image: "assets/nothumbnail.jpg",
      tags: ["Cross-platform", "Finance", "Analytics"],
      challenges: [
        "Managing complex financial data relationships",
        "Creating intuitive data visualization",
        "Ensuring data security and privacy",
      ],
      solutions: [
        "Designed normalized database schema with SQLite",
        "Built interactive charts with customizable time ranges",
        "Implemented local encryption for sensitive data",
      ],
      results: [
        "Comprehensive finance tracking in one app",
        "Visual insights into spending patterns",
        "Improved financial awareness for users",
      ],
      metrics: [
        {
          label: "Data Points",
          value: "500K+",
          improvement: "Transactions tracked",
        },
        {
          label: "User Retention",
          value: "75%",
          improvement: "Monthly active users",
        },
        {
          label: "Financial Insights",
          value: "12",
          improvement: "Automated reports",
        },
      ],
      caseStudy: {
        problem:
          "Most finance apps are either too simple or overly complex, lacking the right balance of features and usability.",
        solution:
          "Developed a comprehensive yet intuitive finance tracker with smart categorization and visual analytics.",
        process: [
          "Research user needs and existing app limitations",
          "Design user-friendly interface with Material Design",
          "Implement secure local data storage",
          "Build comprehensive reporting and analytics",
          "Add smart categorization and budgeting features",
        ],
        outcome:
          "Delivered a feature-rich finance app that simplifies money management while providing deep insights.",
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
      tags: ["Game", "API Integration", "Animations"],
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
    },
  ];

  // Computed properties
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

    // Search filter
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

    // Category filter
    if (this.selectedCategory !== "all") {
      filtered = filtered.filter(
        (project) => project.category === this.selectedCategory,
      );
    }

    // Technology filter
    if (this.selectedTechnology !== "all") {
      filtered = filtered.filter((project) =>
        project.technologies.includes(this.selectedTechnology),
      );
    }

    // Difficulty filter
    if (this.selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (project) => project.difficulty === this.selectedDifficulty,
      );
    }

    // Sort projects
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

  // Keyboard navigation for accessibility
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
