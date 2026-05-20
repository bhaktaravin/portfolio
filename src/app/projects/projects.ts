import { Component, computed, signal, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LazyLoadDirective } from "../directives/lazy-load.directive";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  caseStudy?: {
    problem: string;
    solution: string;
    impact: string;
    highlights: string[];
  };
}

// SVG icon mapping for common techs
const techIcons: Record<string, string> = {
  Angular: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M128 0L256 48L232 208L128 256L24 208L0 48L128 0Z" fill="#DD0031"/><path d="M128 0V256L232 208L256 48L128 0Z" fill="#C3002F"/><path d="M128 32L208 64L192 192L128 224L64 192L48 64L128 32Z" fill="white"/><path d="M128 32V224L192 192L208 64L128 32Z" fill="#B3002D"/><path d="M128 64L160 192H144L136 160H120L112 192H96L128 64ZM128 96L116 144H140L128 96Z" fill="#DD0031"/></svg>`,
  React: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><g><ellipse rx="50" ry="130" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16"/><ellipse rx="130" ry="50" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16"/><ellipse rx="50" ry="130" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16" transform="rotate(60 128 128)"/><ellipse rx="130" ry="50" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16" transform="rotate(60 128 128)"/><ellipse rx="50" ry="130" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16" transform="rotate(120 128 128)"/><ellipse rx="130" ry="50" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16" transform="rotate(120 128 128)"/><circle cx="128" cy="128" r="28" fill="#61DAFB"/></g></svg>`,
  TypeScript: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="60" fill="#3178C6"/><path d="M104 104V120H120V208H136V120H152V104H104Z" fill="white"/><path d="M184 104V208H200V104H184Z" fill="white"/></svg>`,
  JavaScript: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="60" fill="#F7DF1E"/><path d="M104 104V208H120V120H136V208H152V104H104Z" fill="#323330"/><path d="M184 104V208H200V104H184Z" fill="#323330"/></svg>`,
  CSS3: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M128 0L256 48L232 208L128 256L24 208L0 48L128 0Z" fill="#264DE4"/><path d="M128 0V256L232 208L256 48L128 0Z" fill="#2965F1"/><path d="M128 32L208 64L192 192L128 224L64 192L48 64L128 32Z" fill="white"/><path d="M128 32V224L192 192L208 64L128 32Z" fill="#EBEBEB"/></svg>`,
  HTML5: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M128 0L256 48L232 208L128 256L24 208L0 48L128 0Z" fill="#E44D26"/><path d="M128 0V256L232 208L256 48L128 0Z" fill="#F16529"/><path d="M128 32L208 64L192 192L128 224L64 192L48 64L128 32Z" fill="white"/><path d="M128 32V224L192 192L208 64L128 32Z" fill="#EBEBEB"/></svg>`,
};

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [CommonModule, LazyLoadDirective],
  templateUrl: "./projects.html",
  styleUrls: ["./projects.css"],
})
export class ProjectsComponent {
  activeFilter = signal<string>("All");

  allTags = computed(() => {
    const tags = new Set<string>();
    this.projects.forEach((p) => p.technologies.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags)];
  });

  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === "All") return this.projects;
    return this.projects.filter((p) => p.technologies.includes(filter));
  });

  setFilter(tag: string) {
    this.activeFilter.set(tag);
  }

  selectedProject = signal<Project | null>(null);

  openModal(project: Project) {
    this.selectedProject.set(project);
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    this.selectedProject.set(null);
    document.body.style.overflow = "";
  }

  @HostListener("document:keydown.escape")
  onEscape() {
    this.closeModal();
  }
  projects: Project[] = [
    {
      title: "Career Copilot",
      description:
        "AI-powered job application copilot with LLM-driven resume analysis, job-description matching, interview practice, and application pipeline tracking. Built on Replit with a live demo and open source on GitHub.",
      technologies: [
        "React",
        "TypeScript",
        "LLM Integration",
        "AI/ML",
        "Tailwindcss",
        "Replit",
      ],
      liveUrl: "https://job-application-assistant-ravinbhakta.replit.app",
      githubUrl: "https://github.com/bhaktaravin/careercopilot",
      image: "assets/nothumbnail.jpg",
      featured: true,
      caseStudy: {
        problem:
          "Job seekers need fast, actionable feedback on resumes and interviews, but generic advice rarely maps to real roles, ATS expectations, or specific job descriptions.",
        solution:
          "Architected an AI-first career workflow with LLM-backed resume scoring, JD gap analysis, and interview prep—React and TypeScript on Replit for rapid iteration and always-on deployment.",
        impact:
          "Delivers production-grade AI product UX: users get actionable, role-specific feedback in one session instead of generic career advice.",
        highlights: [
          "LLM-powered resume analysis and ATS-style scoring",
          "AI job-description matching with keyword gap insights",
          "Mock interview flows with intelligent, role-aware feedback",
          "Application pipeline dashboard with live Replit deployment",
        ],
      },
    },
    {
      title: "Hetal Ascher Consulting",
      description:
        "Educational consulting site supporting schools, educators, and multilingual learners—workshops, coaching, and consultation booking. Next.js with Neon serverless Postgres, deployed on AWS Amplify.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Neon Postgres",
        "AWS Amplify",
      ],
      liveUrl: "https://main.dbe3ycstvczq3.amplifyapp.com/",
      githubUrl: "https://github.com/bhaktaravin/hetalascherteachingconsultion",
      image: "assets/hetalascher.png",
      featured: true,
    },
    {
      title: "NAGGA — North American Gujarati Golf Association",
      description:
        "Full-stack membership and events platform—registration, member directory, leaderboards, and JWT-authenticated dashboards. Next.js, Prisma, and Neon Postgres on Vercel.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "Neon Postgres",
        "Vercel",
      ],
      liveUrl: "https://nagagolftournamentsite.vercel.app/",
      githubUrl: "https://github.com/bhaktaravin/nagagolftournamentsite",
      image: "assets/nagga.png",
      featured: true,
    },
    {
      title: "MangaViewer",
      description:
        "Modern manga reading app with AI-powered search, chapter navigation, favorites, and progress tracking—Angular and TypeScript with optimized image loading for a seamless reading experience.",
      technologies: [
        "Angular",
        "TypeScript",
        "AI-Powered Search",
        "CSS3",
        "HTML5",
      ],
      githubUrl: "https://github.com/ravinbhakta/mangaviewer",
      liveUrl: "https://mangaviewer-rust-angular.vercel.app/home",
      image: "assets/mangaviewer.png",
      featured: true,
      caseStudy: {
        problem: "Manga readers need fast discovery and smooth reading—generic search and clunky UIs make it hard to find titles and track progress across devices.",
        solution: "Built an Angular app with AI-powered search, lazy-loaded chapters, favorites, and progress tracking—combining intelligent discovery with performance-first image delivery.",
        impact: "Sub-second loads, smooth scrolling, and AI-assisted discovery that helps users find and resume manga faster than traditional catalog browsing.",
        highlights: [
          "AI-powered search for intelligent title discovery",
          "Lazy loading with intersection observer for optimal performance",
          "Favorites and reading progress tracking across sessions",
          "Responsive design with keyboard shortcuts for power users",
        ]
      }
    },
    {
      title: "Flutter Personal Finance Tracker",
      description:
        "Cross-platform mobile application for personal finance management built with Flutter. Features expense tracking, budget planning, financial analytics, and intuitive mobile-first design.",
      technologies: ["Flutter", "Dart", "SQLite", "Material Design", "Charts"],
      githubUrl:
        "https://github.com/bhaktaravin/flutter_personal_finance_tracker",
      liveUrl: "",
      image: "assets/nothumbnail.jpg",
    },
    {
      title: "PokéQuiz — Who's That Pokémon?",
      description:
        "Interactive Gen 1 Pokémon quiz with silhouette guessing, real-time scoring, and API-driven question generation—engaging, mobile-first UX built with React and TypeScript.",
      technologies: [
        "ReactJS",
        "Vite",
        "Tailwindcss",
        "Typescript",
        "Shadcn/ui",
      ],
      githubUrl: "https://github.com/bhaktaravin/poke-pal-quiz",
      liveUrl: "https://www.whosthatpokemon.tv/",
      image: "assets/poke-pal-quiz.png",
      featured: true,
      caseStudy: {
        problem: "Pokemon fans wanted an engaging way to test their knowledge of Gen 1 Pokemon, but existing quizzes were either too simple or had poor UX.",
        solution: "Created an interactive quiz application using React and the Pokemon API, featuring multiple-choice questions, real-time scoring, and beautiful UI with Shadcn components and Tailwind CSS.",
        impact: "Delivered an engaging quiz experience with instant feedback, smooth animations, and mobile-responsive design that works flawlessly across all devices.",
        highlights: [
          "Real-time API integration with Pokemon database",
          "Responsive design with Tailwind CSS",
          "Modern UI components with Shadcn/ui",
          "TypeScript for type safety and better DX"
        ]
      }
    },
    {
      title: "YouTube Clone",
      description:
        "A YouTube-inspired video browsing application built with React and Vite. Features a responsive UI mimicking YouTube's layout including a sidebar, video grid, and video player page.",
      technologies: ["React", "Vite", "JavaScript", "CSS3", "HTML5"],
      githubUrl: "https://github.com/bhaktaravin/youtube-clone",
      liveUrl: "",
      image: "assets/nothumbnail.jpg",
      featured: true,
      caseStudy: {
        problem: "Understanding complex UI patterns and state management in large-scale applications like YouTube requires hands-on practice with real-world layouts.",
        solution: "Recreated YouTube's interface using React and Vite, implementing sidebar navigation, video grid layouts, and video player pages. Focused on component reusability and clean architecture.",
        impact: "Demonstrated proficiency in building complex, production-ready UIs with modern React patterns, component composition, and responsive design principles.",
        highlights: [
          "Component-based architecture for scalability",
          "Responsive grid layout system",
          "Fast development with Vite's HMR",
          "Clean, maintainable code structure"
        ]
      }
    },
    {
      title: "Orbit Shell",
      description:
        "Cross-platform interactive shell in Rust: built-ins (cd, ls, help, …), ANSI terminal styling with NO_COLOR support, and OS-native command execution (cmd on Windows, POSIX sh elsewhere). GitHub Actions CI on Linux, macOS, and Windows.",
      technologies: ["Rust", "CLI"],
      githubUrl: "https://github.com/bhaktaravin/orbit-shell",
      liveUrl: "",
      image: "assets/orbit-shell.png",
      featured: true,
      caseStudy: {
        problem:
          "A portfolio-grade systems project needs clear cross-platform behavior and maintainable delivery—not a one-off script that only runs on one machine.",
        solution:
          "Built orbit-shell in Rust with cfg-gated process spawning, native builtins, styled output that respects NO_COLOR, and a CI matrix running fmt, clippy, build, and test on three operating systems.",
        impact:
          "Shows practical Rust, CLI tooling, and disciplined shipping for developer-facing software.",
        highlights: [
          "Cross-platform execution via cmd vs /bin/sh",
          "Built-in commands and polished terminal UX",
          "CI on Ubuntu, macOS, and Windows",
        ],
      },
    },
  ];

  getTechIcon(tech: string): string | null {
    // Normalize for common variants
    if (tech.toLowerCase() === "typescript") return techIcons["TypeScript"];
    if (tech.toLowerCase() === "javascript") return techIcons["JavaScript"];
    if (tech.toLowerCase() === "reactjs" || tech.toLowerCase() === "react")
      return techIcons["React"];
    if (tech.toLowerCase() === "angularjs" || tech.toLowerCase() === "angular")
      return techIcons["Angular"];
    if (tech.toLowerCase() === "css3" || tech.toLowerCase() === "css")
      return techIcons["CSS3"];
    if (tech.toLowerCase() === "html5" || tech.toLowerCase() === "html")
      return techIcons["HTML5"];
    return techIcons[tech] || null;
  }
  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = "assets/placeholder.svg";
  }
}
