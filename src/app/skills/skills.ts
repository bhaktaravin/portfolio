import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SkillDemoComponent } from "../shared/components/skill-demo/skill-demo";

@Component({
  selector: "app-skills",
  standalone: true,
  imports: [CommonModule, SkillDemoComponent],
  template: `
    <section class="skills-section">
      <div class="section-header">
        <h2 class="section-title">Technical Skills</h2>
        <p class="section-subtitle">
          Interactive demonstrations of my technical expertise and proficiency
          levels
        </p>
      </div>

      <app-skill-demo [skills]="skillsData" [autoplay]="false">
      </app-skill-demo>

      <!-- Skills Overview Grid -->
      <div class="skills-overview">
        <div class="overview-header">
          <h3>Skills Overview</h3>
          <p>A comprehensive breakdown of my technical competencies</p>
        </div>

        <div class="skills-categories">
          <div
            *ngFor="let category of skillCategories"
            class="category-card"
            [ngClass]="getCategoryClass(category.name)"
          >
            <div class="category-header">
              <span class="category-icon">{{ category.icon }}</span>
              <h4 class="category-name">{{ category.name }}</h4>
              <span class="skill-count"
                >{{ category.skills.length }} skills</span
              >
            </div>

            <div class="category-skills">
              <div
                *ngFor="let skill of category.skills"
                class="skill-badge"
                [title]="skill.description"
              >
                <span
                  class="skill-icon"
                  [innerHTML]="getSkillIcon(skill.name)"
                ></span>
                <span class="skill-name">{{ skill.name }}</span>
                <div class="skill-level">
                  <div
                    class="skill-level-bar"
                    [style.width.%]="skill.level"
                    [style.background-color]="getSkillColor(skill.level)"
                  ></div>
                </div>
              </div>
            </div>

            <div class="category-stats">
              <div class="stat-item">
                <span class="stat-value"
                  >{{ getAverageLevel(category.skills) }}%</span
                >
                <span class="stat-label">Avg. Proficiency</span>
              </div>
              <div class="stat-item">
                <span class="stat-value"
                  >{{ getExperienceYears(category.name) }}+</span
                >
                <span class="stat-label">Years Exp.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning & Growth Section -->
      <div class="learning-section">
        <div class="learning-header">
          <h3>Continuous Learning</h3>
          <p>Technologies I'm currently exploring and mastering</p>
        </div>

        <div class="learning-grid">
          <div *ngFor="let learning of currentlyLearning" class="learning-card">
            <div class="learning-icon">{{ learning.icon }}</div>
            <h4>{{ learning.name }}</h4>
            <p>{{ learning.description }}</p>
            <div class="learning-progress">
              <div class="progress-label">
                <span>Progress</span>
                <span>{{ learning.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  [style.width.%]="learning.progress"
                ></div>
              </div>
            </div>
            <div class="learning-timeline">
              <span class="timeline-label">Started:</span>
              <span class="timeline-date">{{ learning.startDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ["./skills.css"],
})
export class SkillsComponent {
  skillsData = [
    {
      id: "angular",
      name: "Angular",
      category: "Frontend Frameworks",
      level: 90,
      description:
        "Advanced Angular development with modern practices, reactive programming, and performance optimization",
      icon: "🅰️",
      color: "#DD0031",
      interactive: true,
      demoType: "typing" as const,
      demoData: {
        text: `// Angular Component with Reactive Forms
@Component({
  selector: 'app-user-profile',
  template: \`
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput placeholder="Name" formControlName="name">
        <mat-error *ngIf="name?.invalid && name?.touched">
          Name is required
        </mat-error>
      </mat-form-field>

      <mat-form-field>
        <input matInput type="email" placeholder="Email"
               formControlName="email">
        <mat-error *ngIf="email?.invalid && email?.touched">
          Valid email required
        </mat-error>
      </mat-form-field>

      <button mat-raised-button type="submit"
              [disabled]="profileForm.invalid">
        Save Profile
      </button>
    </form>
  \`
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get name() { return this.profileForm.get('name'); }
  get email() { return this.profileForm.get('email'); }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Form submitted:', this.profileForm.value);
    }
  }
}`,
        speed: 40,
      },
    },
    {
      id: "typescript",
      name: "TypeScript",
      category: "Programming Languages",
      level: 88,
      description:
        "Strong typing, advanced features, and modern JavaScript development",
      icon: "🔷",
      color: "#3178C6",
      interactive: true,
      demoType: "code" as const,
      demoData: {
        language: "TypeScript",
        code: `// Advanced TypeScript with Generics and Decorators
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  @cache(300) // Cache for 5 minutes
  @retry(3)   // Retry up to 3 times
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);

    if (!response.ok) {
      throw new ApiError(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await this.get<User[]>('/users');
    return response.data;
  }
}

// Custom decorator implementation
function cache(seconds: number) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const cache = new Map();

    descriptor.value = function (...args: any[]) {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        const { result, timestamp } = cache.get(key);
        if (Date.now() - timestamp < seconds * 1000) {
          return result;
        }
      }

      const result = method.apply(this, args);
      cache.set(key, { result, timestamp: Date.now() });
      return result;
    };
  };
}`,
      },
    },
    {
      id: "react",
      name: "React",
      category: "Frontend Frameworks",
      level: 82,
      description: "Modern React with hooks, context, and state management",
      icon: "⚛️",
      color: "#61DAFB",
      interactive: true,
      demoType: "counter" as const,
      demoData: {
        counters: [
          { label: "Components Built", start: 0, end: 180, suffix: "+" },
          { label: "Projects Completed", start: 0, end: 15, suffix: "" },
          { label: "Lines of Code", start: 0, end: 75, suffix: "K+" },
        ],
      },
    },
    {
      id: "nodejs",
      name: "Node.js",
      category: "Backend Technologies",
      level: 85,
      description: "Server-side JavaScript, APIs, and microservices",
      icon: "💚",
      color: "#8CC84B",
      interactive: true,
      demoType: "progress" as const,
      demoData: {
        items: [
          { label: "Express.js Framework", progress: 90 },
          { label: "RESTful API Design", progress: 88 },
          { label: "Database Integration", progress: 85 },
          { label: "Authentication & Security", progress: 82 },
          { label: "Testing & Deployment", progress: 78 },
        ],
      },
    },
    {
      id: "python",
      name: "Python",
      category: "Programming Languages",
      level: 75,
      description: "Data processing, automation, and backend development",
      icon: "🐍",
      color: "#306998",
      interactive: true,
      demoType: "chart" as const,
    },
    {
      id: "sql",
      name: "SQL",
      category: "Database Technologies",
      level: 92,
      description: "Complex queries, optimization, and database design",
      icon: "🗄️",
      color: "#336791",
      interactive: true,
      demoType: "typing" as const,
      demoData: {
        text: `-- Complex SQL Query with CTEs and Window Functions
WITH user_activity AS (
  SELECT
    u.id,
    u.name,
    u.email,
    COUNT(a.id) as activity_count,
    AVG(a.duration) as avg_duration,
    ROW_NUMBER() OVER (ORDER BY COUNT(a.id) DESC) as activity_rank
  FROM users u
  LEFT JOIN activities a ON u.id = a.user_id
  WHERE a.created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY u.id, u.name, u.email
),
top_performers AS (
  SELECT *
  FROM user_activity
  WHERE activity_rank <= 10
)
SELECT
  tp.name,
  tp.email,
  tp.activity_count,
  ROUND(tp.avg_duration, 2) as avg_session_duration,
  tp.activity_rank,
  CASE
    WHEN tp.activity_count >= 50 THEN 'Highly Active'
    WHEN tp.activity_count >= 20 THEN 'Active'
    ELSE 'Moderate'
  END as user_segment
FROM top_performers tp
ORDER BY tp.activity_rank;`,
        speed: 35,
      },
    },
    {
      id: "csharp",
      name: "C#",
      category: "Programming Languages",
      level: 78,
      description: ".NET development and enterprise applications",
      icon: "🔷",
      color: "#239120",
      interactive: false,
      demoType: "progress" as const,
    },
    {
      id: "flutter",
      name: "Flutter",
      category: "Mobile Development",
      level: 70,
      description: "Cross-platform mobile app development",
      icon: "📱",
      color: "#02569B",
      interactive: true,
      demoType: "counter" as const,
      demoData: {
        counters: [
          { label: "Mobile Apps Built", start: 0, end: 8, suffix: "" },
          { label: "Platforms Supported", start: 0, end: 3, suffix: "" },
          { label: "User Downloads", start: 0, end: 2.5, suffix: "K+" },
        ],
      },
    },
  ];

  skillCategories = [
    {
      name: "Programming Languages",
      icon: "💻",
      skills: [
        {
          name: "TypeScript",
          level: 88,
          description: "Advanced type-safe JavaScript",
        },
        {
          name: "JavaScript",
          level: 85,
          description: "Modern ES6+ development",
        },
        {
          name: "Python",
          level: 75,
          description: "Backend and data processing",
        },
        { name: "C#", level: 78, description: ".NET enterprise development" },
        { name: "Java", level: 72, description: "Object-oriented programming" },
        { name: "Dart", level: 70, description: "Flutter mobile development" },
      ],
    },
    {
      name: "Frontend Frameworks",
      icon: "🎨",
      skills: [
        {
          name: "Angular",
          level: 90,
          description: "Enterprise web applications",
        },
        {
          name: "React",
          level: 82,
          description: "Component-based UI development",
        },
        {
          name: "Vue.js",
          level: 68,
          description: "Progressive web applications",
        },
        { name: "Flutter", level: 70, description: "Cross-platform mobile UI" },
      ],
    },
    {
      name: "Backend Technologies",
      icon: "⚙️",
      skills: [
        {
          name: "Node.js",
          level: 85,
          description: "Server-side JavaScript runtime",
        },
        {
          name: "Express.js",
          level: 88,
          description: "Web application framework",
        },
        { name: ".NET Core", level: 75, description: "Cross-platform backend" },
        {
          name: "RESTful APIs",
          level: 90,
          description: "API design and development",
        },
      ],
    },
    {
      name: "Database Technologies",
      icon: "🗃️",
      skills: [
        { name: "SQL", level: 92, description: "Advanced query optimization" },
        {
          name: "Oracle",
          level: 85,
          description: "Enterprise database management",
        },
        {
          name: "PostgreSQL",
          level: 78,
          description: "Advanced relational database",
        },
        { name: "MongoDB", level: 72, description: "NoSQL document database" },
        {
          name: "Firebase",
          level: 75,
          description: "Real-time database platform",
        },
      ],
    },
    {
      name: "Cloud & DevOps",
      icon: "☁️",
      skills: [
        {
          name: "AWS",
          level: 70,
          description: "Cloud infrastructure services",
        },
        { name: "Azure", level: 65, description: "Microsoft cloud platform" },
        {
          name: "Docker",
          level: 75,
          description: "Containerization technology",
        },
        {
          name: "Git",
          level: 88,
          description: "Version control and collaboration",
        },
        {
          name: "CI/CD",
          level: 72,
          description: "Automated deployment pipelines",
        },
      ],
    },
    {
      name: "Tools & Frameworks",
      icon: "🔧",
      skills: [
        { name: "VS Code", level: 92, description: "Development environment" },
        { name: "Webpack", level: 75, description: "Module bundling" },
        {
          name: "Jest",
          level: 78,
          description: "JavaScript testing framework",
        },
        {
          name: "Postman",
          level: 85,
          description: "API development and testing",
        },
        { name: "Figma", level: 70, description: "Design and prototyping" },
      ],
    },
  ];

  currentlyLearning = [
    {
      name: "GraphQL",
      icon: "🔗",
      description: "Query language for APIs with efficient data fetching",
      progress: 65,
      startDate: "Jan 2024",
    },
    {
      name: "Rust",
      icon: "🦀",
      description: "Systems programming language with memory safety",
      progress: 35,
      startDate: "Mar 2024",
    },
    {
      name: "Kubernetes",
      icon: "⚓",
      description: "Container orchestration and microservices deployment",
      progress: 45,
      startDate: "Feb 2024",
    },
    {
      name: "Machine Learning",
      icon: "🤖",
      description: "AI/ML concepts with TensorFlow and scikit-learn",
      progress: 25,
      startDate: "Apr 2024",
    },
  ];

  getSkillIcon(skill: string): string {
    const iconMap: { [key: string]: string } = {
      TypeScript: "🔷",
      JavaScript: "🟨",
      Python: "🐍",
      "C#": "🔷",
      Java: "☕",
      Dart: "🎯",
      Angular: "🅰️",
      React: "⚛️",
      "Vue.js": "💚",
      Flutter: "📱",
      "Node.js": "💚",
      "Express.js": "🚀",
      ".NET Core": "🔷",
      "RESTful APIs": "🌐",
      SQL: "🗄️",
      Oracle: "🔴",
      PostgreSQL: "🐘",
      MongoDB: "🍃",
      Firebase: "🔥",
      AWS: "☁️",
      Azure: "☁️",
      Docker: "🐳",
      Git: "📚",
      "CI/CD": "🔄",
      "VS Code": "💙",
      Webpack: "📦",
      Jest: "🃏",
      Postman: "📮",
      Figma: "🎨",
    };

    return iconMap[skill] || "⚡";
  }

  getSkillColor(level: number): string {
    if (level >= 90) return "#10B981"; // Emerald
    if (level >= 80) return "#3B82F6"; // Blue
    if (level >= 70) return "#F59E0B"; // Amber
    if (level >= 60) return "#EF4444"; // Red
    return "#6B7280"; // Gray
  }

  getAverageLevel(skills: any[]): number {
    const total = skills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(total / skills.length);
  }

  getExperienceYears(category: string): number {
    const experienceMap: { [key: string]: number } = {
      "Programming Languages": 5,
      "Frontend Frameworks": 4,
      "Backend Technologies": 3,
      "Database Technologies": 4,
      "Cloud & DevOps": 2,
      "Tools & Frameworks": 5,
    };

    return experienceMap[category] || 2;
  }

  getCategoryClass(categoryName: string): string {
    return (
      "category-" +
      categoryName.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")
    );
  }
}
