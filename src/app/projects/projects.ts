import { Component, computed, signal, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
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
  imports: [CommonModule],
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
      title: "MangaViewer",
      description:
        "Modern manga reading application built with Angular and TypeScript, featuring responsive design, chapter navigation, and optimized image loading for seamless reading experience.",
      technologies: [
        "Angular",
        "TypeScript",
        "CSS3",
        "HTML5",
        "Responsive Design",
      ],
      githubUrl: "https://github.com/ravinbhakta/mangaviewer",
      liveUrl: "https://mangaviewer-rust-angular.vercel.app/home",
      image: "assets/mangaviewer.png",
      featured: true,
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
      title: "Pokemon Palace Quest",
      description:
        "A Fun Quiz web application that allows Users to choose options to guess the Gen 1 aka - The Original 151 pokemon- using the Pokemon Api.",
      technologies: [
        "ReactJS",
        "Vite",
        "Tailwindcss",
        "Typescript",
        "Shadcn/ui",
      ],
      githubUrl: "https://github.com/bhaktaravin/poke-pal-quiz",
      liveUrl: "https://poke-pal-quiz.vercel.app",
      image: "assets/poke-pal-quiz.png",
    },
    {
      title: "YouTube Clone",
      description:
        "A YouTube-inspired video browsing application built with React and Vite. Features a responsive UI mimicking YouTube's layout including a sidebar, video grid, and video player page.",
      technologies: ["React", "Vite", "JavaScript", "CSS3", "HTML5"],
      githubUrl: "https://github.com/bhaktaravin/youtube-clone",
      liveUrl: "",
      image: "assets/nothumbnail.jpg",
    },
    {
      title: "Flight Deals Finder",
      description:
        "Full-stack flight search application with real-time pricing, airport autocomplete, and automated price alerts. Features background job processing for hourly price monitoring, Redis caching for API optimization, and comprehensive search history tracking. Deployed on Railway with PostgreSQL and Redis.",
      technologies: [
        "NestJS",
        "TypeScript",
        "PostgreSQL",
        "Redis",
        "Prisma ORM",
        "Bull Queue",
        "Amadeus API",
        "Railway",
      ],
      githubUrl: "https://github.com/bhaktaravin/flight-deals-api",
      liveUrl: "https://flight-deals-api-production.up.railway.app/",
      image: "assets/flight-aggregator.png",
      featured: true,
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
