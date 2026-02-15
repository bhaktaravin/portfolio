import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";

interface ArchitectureComponent {
  id: string;
  name: string;
  type:
    | "frontend"
    | "backend"
    | "database"
    | "api"
    | "cloud"
    | "cdn"
    | "auth"
    | "storage";
  description: string;
  technologies: string[];
  position: { x: number; y: number };
  metrics?: {
    label: string;
    value: string;
    improvement?: string;
  }[];
}

interface Connection {
  from: string;
  to: string;
  label?: string;
}

@Component({
  selector: "app-architecture-diagram",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="architecture-diagram-container">
      <h3>System Architecture</h3>
      <div class="architecture-diagram" #diagramContainer>
        <!-- Connections (lines between components) -->
        <svg
          class="connections-layer"
          [attr.width]="diagramWidth"
          [attr.height]="diagramHeight"
        >
          <line
            *ngFor="let connection of connections"
            [attr.x1]="getComponentPosition(connection.from)?.x"
            [attr.y1]="getComponentPosition(connection.from)?.y"
            [attr.x2]="getComponentPosition(connection.to)?.x"
            [attr.y2]="getComponentPosition(connection.to)?.y"
            class="connection-line"
          />
        </svg>

        <!-- Components -->
        <div
          *ngFor="let component of components"
          class="architecture-component"
          [style.left.px]="component.position.x"
          [style.top.px]="component.position.y"
          [class.selected]="selectedComponent?.id === component.id"
          (click)="selectComponent(component)"
        >
          <div class="component-icon" [ngClass]="component.type">
            {{ getComponentIcon(component.type) }}
          </div>
          <div class="component-name">{{ component.name }}</div>
        </div>
      </div>

      <!-- Component Details Panel -->
      <div class="component-details" *ngIf="selectedComponent">
        <h4>{{ selectedComponent.name }}</h4>
        <p>{{ selectedComponent.description }}</p>

        <div
          class="technologies"
          *ngIf="selectedComponent.technologies.length > 0"
        >
          <h5>Technologies:</h5>
          <div class="tech-tags">
            <span
              class="tech-tag"
              *ngFor="let tech of selectedComponent.technologies"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <div
          class="metrics"
          *ngIf="
            selectedComponent.metrics && selectedComponent.metrics.length > 0
          "
        >
          <h5>Metrics:</h5>
          <div class="metrics-grid">
            <div
              class="metric"
              *ngFor="let metric of selectedComponent.metrics"
            >
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-label">{{ metric.label }}</div>
              <div class="metric-improvement" *ngIf="metric.improvement">
                {{ metric.improvement }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./architecture-diagram.component.css"],
})
export class ArchitectureDiagramComponent implements OnInit, OnChanges {
  @Input() projectId: string = "";
  @Input() projectName: string = "";

  selectedComponent: ArchitectureComponent | null = null;
  diagramWidth: number = 800;
  diagramHeight: number = 600;

  components: ArchitectureComponent[] = [];
  connections: Connection[] = [];

  ngOnInit() {
    this.initializeArchitecture();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["projectId"] && !changes["projectId"].firstChange) {
      this.initializeArchitecture();
    }
  }

  initializeArchitecture() {
    // Initialize with sample data based on project ID
    switch (this.projectId) {
      case "mangaviewer":
        this.initMangaViewerArchitecture();
        break;
      case "pokemon-quiz":
        this.initPokemonQuizArchitecture();
        break;
      case "smart-job-recommender":
        this.initJobRecommenderArchitecture();
        break;
      default:
        this.initDefaultArchitecture();
    }
  }

  initMangaViewerArchitecture() {
    this.components = [
      {
        id: "client",
        name: "Angular Client",
        type: "frontend",
        description:
          "Progressive Web App built with Angular 16+ featuring lazy loading and responsive design",
        technologies: ["Angular", "TypeScript", "RxJS", "PWA"],
        position: { x: 100, y: 100 },
        metrics: [
          { label: "Bundle Size", value: "2.1MB", improvement: "Optimized" },
          { label: "Lighthouse Score", value: "95/100", improvement: "+25%" },
        ],
      },
      {
        id: "api",
        name: "Manga API",
        type: "api",
        description:
          "RESTful API for manga content management with image optimization",
        technologies: ["Node.js", "Express", "MongoDB"],
        position: { x: 400, y: 100 },
      },
      {
        id: "db",
        name: "Database",
        type: "database",
        description:
          "MongoDB database storing manga metadata and user preferences",
        technologies: ["MongoDB", "Mongoose"],
        position: { x: 400, y: 300 },
      },
      {
        id: "storage",
        name: "Image Storage",
        type: "storage",
        description: "Cloud storage for manga images with CDN distribution",
        technologies: ["AWS S3", "CloudFront"],
        position: { x: 700, y: 100 },
      },
    ];

    this.connections = [
      { from: "client", to: "api", label: "HTTP REST" },
      { from: "api", to: "db", label: "MongoDB" },
      { from: "api", to: "storage", label: "AWS S3" },
    ];
  }

  initPokemonQuizArchitecture() {
    this.components = [
      {
        id: "client",
        name: "React Client",
        type: "frontend",
        description: "Interactive quiz game built with React and TypeScript",
        technologies: ["React", "TypeScript", "Tailwind CSS"],
        position: { x: 100, y: 100 },
      },
      {
        id: "api",
        name: "Pokemon API",
        type: "api",
        description: "Integration with PokeAPI for Pokemon data",
        technologies: ["REST", "Axios"],
        position: { x: 400, y: 100 },
      },
      {
        id: "game-engine",
        name: "Game Engine",
        type: "backend",
        description: "Game logic and state management",
        technologies: ["JavaScript", "State Management"],
        position: { x: 400, y: 300 },
      },
    ];

    this.connections = [
      { from: "client", to: "api" },
      { from: "client", to: "game-engine" },
    ];
  }

  initJobRecommenderArchitecture() {
    this.components = [
      {
        id: "scraper",
        name: "Job Scraper",
        type: "backend",
        description:
          "Automated job listing scraper with asynchronous processing",
        technologies: ["Python", "aiohttp", "BeautifulSoup"],
        position: { x: 100, y: 100 },
      },
      {
        id: "recommender",
        name: "Recommendation Engine",
        type: "backend",
        description: "Algorithm for matching users with jobs based on skills",
        technologies: ["Python", "Pandas", "Scikit-learn"],
        position: { x: 400, y: 100 },
      },
      {
        id: "api",
        name: "Job API",
        type: "api",
        description: "RESTful API endpoints for job data and recommendations",
        technologies: ["Python", "FastAPI"],
        position: { x: 400, y: 300 },
      },
      {
        id: "db",
        name: "Database",
        type: "database",
        description: "SQLite database storing job listings and user profiles",
        technologies: ["SQLite", "SQLAlchemy"],
        position: { x: 700, y: 100 },
      },
    ];

    this.connections = [
      { from: "scraper", to: "db" },
      { from: "recommender", to: "db" },
      { from: "api", to: "recommender" },
      { from: "api", to: "db" },
    ];
  }

  initDefaultArchitecture() {
    this.components = [
      {
        id: "frontend",
        name: "Frontend",
        type: "frontend",
        description: "User interface component",
        technologies: ["Angular", "TypeScript"],
        position: { x: 100, y: 100 },
      },
      {
        id: "backend",
        name: "Backend API",
        type: "api",
        description: "Server-side API",
        technologies: ["Node.js", "Express"],
        position: { x: 400, y: 100 },
      },
      {
        id: "database",
        name: "Database",
        type: "database",
        description: "Data storage",
        technologies: ["MongoDB"],
        position: { x: 400, y: 300 },
      },
    ];

    this.connections = [
      { from: "frontend", to: "backend" },
      { from: "backend", to: "database" },
    ];
  }

  selectComponent(component: ArchitectureComponent) {
    this.selectedComponent = component;
  }

  getComponentPosition(componentId: string) {
    const component = this.components.find((c) => c.id === componentId);
    return component ? component.position : null;
  }

  getComponentIcon(type: string): string {
    const icons: Record<string, string> = {
      frontend: "🌐",
      backend: "⚙️",
      database: "🗄️",
      api: "🔌",
      cloud: "☁️",
      cdn: "📡",
      auth: "🔒",
      storage: "💾",
    };
    return icons[type] || "📦";
  }
}
