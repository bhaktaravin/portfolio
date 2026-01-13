import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from "@angular/animations";
import { interval, Subscription } from "rxjs";

interface SkillDemo {
  id: string;
  name: string;
  category: string;
  level: number; // 0-100
  description: string;
  icon: string;
  color: string;
  interactive?: boolean;
  demoType: "progress" | "typing" | "counter" | "chart" | "code";
  demoData?: any;
}

interface TypingDemo {
  text: string;
  speed: number;
}

interface CounterDemo {
  start: number;
  end: number;
  duration: number;
  suffix?: string;
}

interface CodeDemo {
  language: string;
  code: string;
  highlightLines?: number[];
}

@Component({
  selector: "app-skill-demo",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skill-demo-container">
      <div class="demo-header">
        <h2 class="demo-title">Interactive Skills Showcase</h2>
        <p class="demo-subtitle">
          Experience my technical skills through interactive demonstrations
        </p>

        <div class="demo-filters">
          <button
            *ngFor="let category of categories"
            class="filter-btn"
            [class.active]="activeCategory === category"
            (click)="setCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div class="skills-grid">
        <div
          *ngFor="let skill of filteredSkills; trackBy: trackBySkill"
          class="skill-card"
          [class.active]="activeSkill === skill.id"
          [@cardAnimation]="'visible'"
          (click)="selectSkill(skill)"
          (keydown)="onKeydown($event, skill)"
          tabindex="0"
          [attr.aria-label]="'Demonstrate ' + skill.name + ' skill'"
        >
          <div class="skill-header">
            <div class="skill-icon" [style.background-color]="skill.color">
              <span [innerHTML]="skill.icon"></span>
            </div>
            <div class="skill-info">
              <h3 class="skill-name">{{ skill.name }}</h3>
              <p class="skill-category">{{ skill.category }}</p>
            </div>
          </div>

          <div class="skill-description">
            {{ skill.description }}
          </div>

          <div class="skill-level-container">
            <div class="level-label">
              <span>Proficiency</span>
              <span class="level-percentage">{{ skill.level }}%</span>
            </div>
            <div class="skill-level-bar">
              <div
                class="skill-level-fill"
                [style.width.%]="animatedLevels[skill.id] || 0"
                [style.background-color]="skill.color"
                [@levelAnimation]
              ></div>
            </div>
          </div>

          <!-- Demo Area -->
          <div class="demo-area" *ngIf="activeSkill === skill.id" [@expandDemo]>
            <!-- Progress Demo -->
            <div *ngIf="skill.demoType === 'progress'" class="demo-content">
              <div class="progress-demo">
                <h4>Live Progress Simulation</h4>
                <div class="progress-items">
                  <div *ngFor="let item of progressItems" class="progress-item">
                    <span class="progress-label">{{ item.label }}</span>
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        [style.width.%]="item.progress"
                        [style.background-color]="skill.color"
                      ></div>
                    </div>
                    <span class="progress-value">{{ item.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Typing Demo -->
            <div *ngIf="skill.demoType === 'typing'" class="demo-content">
              <div class="typing-demo">
                <h4>Live Coding Simulation</h4>
                <div class="terminal">
                  <div class="terminal-header">
                    <div class="terminal-controls">
                      <span class="terminal-dot red"></span>
                      <span class="terminal-dot yellow"></span>
                      <span class="terminal-dot green"></span>
                    </div>
                    <div class="terminal-title">{{ skill.name }} Demo</div>
                  </div>
                  <div class="terminal-content">
                    <div class="typed-text">
                      {{ typedText }}
                      <span class="cursor" [@cursorBlink]>|</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Counter Demo -->
            <div *ngIf="skill.demoType === 'counter'" class="demo-content">
              <div class="counter-demo">
                <h4>Performance Metrics</h4>
                <div class="counters-grid">
                  <div
                    *ngFor="let counter of counterItems"
                    class="counter-item"
                  >
                    <div class="counter-value" [style.color]="skill.color">
                      {{ counter.currentValue }}{{ counter.suffix }}
                    </div>
                    <div class="counter-label">{{ counter.label }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chart Demo -->
            <div *ngIf="skill.demoType === 'chart'" class="demo-content">
              <div class="chart-demo">
                <h4>Skill Proficiency Over Time</h4>
                <div class="chart-container">
                  <svg class="skill-chart" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient
                        id="skillGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          [attr.stop-color]="skill.color"
                          stop-opacity="0.3"
                        />
                        <stop
                          offset="100%"
                          [attr.stop-color]="skill.color"
                          stop-opacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      [attr.d]="chartPath"
                      fill="url(#skillGradient)"
                      [attr.stroke]="skill.color"
                      stroke-width="3"
                      [@drawChart]
                    />
                    <circle
                      *ngFor="let point of chartPoints; let i = index"
                      [attr.cx]="point.x"
                      [attr.cy]="point.y"
                      r="4"
                      [attr.fill]="skill.color"
                      [@pointAnimation]="i"
                    />
                  </svg>
                  <div class="chart-labels">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Advanced</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Code Demo -->
            <div *ngIf="skill.demoType === 'code'" class="demo-content">
              <div class="code-demo">
                <h4>Code Sample</h4>
                <div class="code-editor">
                  <div class="code-header">
                    <div class="code-tabs">
                      <span class="code-tab active">{{
                        skill.demoData?.language
                      }}</span>
                    </div>
                  </div>
                  <div class="code-content">
                    <pre><code [innerHTML]="highlightedCode"></code></pre>
                  </div>
                </div>
              </div>
            </div>

            <div class="demo-actions">
              <button class="demo-btn restart" (click)="restartDemo(skill)">
                🔄 Restart Demo
              </button>
              <button class="demo-btn close" (click)="closeDemo()">
                ✕ Close
              </button>
            </div>
          </div>

          <div class="skill-actions" *ngIf="activeSkill !== skill.id">
            <button
              class="demo-trigger-btn"
              (click)="selectSkill(skill); $event.stopPropagation()"
              [disabled]="!skill.interactive"
            >
              {{ skill.interactive ? "▶️ Demo" : "📊 Static" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./skill-demo.css"],
  animations: [
    trigger("cardAnimation", [
      state("visible", style({ opacity: 1, transform: "scale(1)" })),
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0.9)" }),
        animate("400ms ease-out"),
      ]),
    ]),
    trigger("levelAnimation", [
      transition(":enter", [
        style({ width: 0 }),
        animate("1000ms ease-out", style({ width: "*" })),
      ]),
    ]),
    trigger("expandDemo", [
      transition(":enter", [
        style({ height: 0, opacity: 0, overflow: "hidden" }),
        animate("500ms ease-out", style({ height: "*", opacity: 1 })),
      ]),
      transition(":leave", [
        animate("300ms ease-in", style({ height: 0, opacity: 0 })),
      ]),
    ]),
    trigger("cursorBlink", [
      transition("* => *", [
        animate(
          "1s infinite",
          keyframes([
            style({ opacity: 1, offset: 0 }),
            style({ opacity: 1, offset: 0.5 }),
            style({ opacity: 0, offset: 0.51 }),
            style({ opacity: 0, offset: 1 }),
          ]),
        ),
      ]),
    ]),
    trigger("drawChart", [
      transition(":enter", [
        style({ "stroke-dasharray": "1000", "stroke-dashoffset": "1000" }),
        animate("2000ms ease-out", style({ "stroke-dashoffset": "0" })),
      ]),
    ]),
    trigger("pointAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0)" }),
        animate(
          "300ms {{ delay }}ms ease-out",
          style({ opacity: 1, transform: "scale(1)" }),
        ),
      ]),
    ]),
  ],
})
export class SkillDemoComponent implements OnInit, OnDestroy {
  @Input() skills: SkillDemo[] = [];
  @Input() autoplay = false;

  activeSkill: string | null = null;
  activeCategory = "All";
  filteredSkills: SkillDemo[] = [];
  categories: string[] = [];
  animatedLevels: { [key: string]: number } = {};

  // Demo state
  typedText = "";
  progressItems: any[] = [];
  counterItems: any[] = [];
  chartPoints: any[] = [];
  chartPath = "";
  highlightedCode = "";

  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.initializeDefaultSkills();
    this.setupCategories();
    this.filterSkills();
    this.animateSkillLevels();

    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private initializeDefaultSkills() {
    if (this.skills.length === 0) {
      this.skills = [
        {
          id: "angular",
          name: "Angular",
          category: "Frontend",
          level: 90,
          description: "Advanced Angular development with modern practices",
          icon: "🅰️",
          color: "#DD0031",
          interactive: true,
          demoType: "typing",
          demoData: {
            text: `// Angular Component Example
@Component({
  selector: 'app-example',
  template: \`
    <div class="component">
      <h1>{{ title }}</h1>
      <button (click)="handleClick()">
        Click me!
      </button>
    </div>
  \`
})
export class ExampleComponent {
  title = 'Hello Angular!';

  handleClick() {
    console.log('Button clicked!');
  }
}`,
            speed: 50,
          },
        },
        {
          id: "typescript",
          name: "TypeScript",
          category: "Languages",
          level: 85,
          description: "Strong typing and modern JavaScript features",
          icon: "🔷",
          color: "#3178C6",
          interactive: true,
          demoType: "code",
          demoData: {
            language: "TypeScript",
            code: `interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

class UserService {
  private users: User[] = [];

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: Date.now(),
      ...userData
    } as User;

    this.users.push(newUser);
    return newUser;
  }
}`,
          },
        },
        {
          id: "react",
          name: "React",
          category: "Frontend",
          level: 80,
          description: "Modern React with hooks and context",
          icon: "⚛️",
          color: "#61DAFB",
          interactive: true,
          demoType: "counter",
          demoData: {
            counters: [
              { label: "Components Built", start: 0, end: 150, suffix: "+" },
              { label: "Projects Completed", start: 0, end: 25, suffix: "" },
              { label: "Lines of Code", start: 0, end: 50, suffix: "K+" },
            ],
          },
        },
        {
          id: "nodejs",
          name: "Node.js",
          category: "Backend",
          level: 75,
          description: "Server-side JavaScript and API development",
          icon: "💚",
          color: "#8CC84B",
          interactive: true,
          demoType: "progress",
          demoData: {
            items: [
              { label: "Express.js", progress: 85 },
              { label: "API Design", progress: 90 },
              { label: "Database Integration", progress: 80 },
              { label: "Authentication", progress: 75 },
            ],
          },
        },
        {
          id: "python",
          name: "Python",
          category: "Languages",
          level: 70,
          description: "Data processing and automation scripts",
          icon: "🐍",
          color: "#306998",
          interactive: true,
          demoType: "chart",
        },
        {
          id: "sql",
          name: "SQL",
          category: "Database",
          level: 88,
          description: "Complex queries and database optimization",
          icon: "🗄️",
          color: "#336791",
          interactive: false,
          demoType: "progress",
        },
      ];
    }
  }

  private setupCategories() {
    this.categories = [
      "All",
      ...new Set(this.skills.map((skill) => skill.category)),
    ];
  }

  private filterSkills() {
    this.filteredSkills =
      this.activeCategory === "All"
        ? this.skills
        : this.skills.filter((skill) => skill.category === this.activeCategory);
  }

  private animateSkillLevels() {
    this.skills.forEach((skill) => {
      this.animateLevel(skill.id, skill.level);
    });
  }

  private animateLevel(skillId: string, targetLevel: number) {
    let currentLevel = 0;
    const increment = targetLevel / 50;

    const subscription = interval(30).subscribe(() => {
      currentLevel = Math.min(currentLevel + increment, targetLevel);
      this.animatedLevels[skillId] = Math.round(currentLevel);

      if (currentLevel >= targetLevel) {
        subscription.unsubscribe();
      }
    });

    this.subscriptions.push(subscription);
  }

  setCategory(category: string) {
    this.activeCategory = category;
    this.filterSkills();
    this.activeSkill = null;
  }

  selectSkill(skill: SkillDemo) {
    if (!skill.interactive) return;

    this.activeSkill = this.activeSkill === skill.id ? null : skill.id;

    if (this.activeSkill === skill.id) {
      this.startDemo(skill);
    }
  }

  closeDemo() {
    this.activeSkill = null;
    this.resetDemoState();
  }

  onKeydown(event: KeyboardEvent, skill: SkillDemo) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.selectSkill(skill);
    }
  }

  trackBySkill(index: number, skill: SkillDemo): string {
    return skill.id;
  }

  private startDemo(skill: SkillDemo) {
    this.resetDemoState();

    switch (skill.demoType) {
      case "typing":
        this.startTypingDemo(skill);
        break;
      case "progress":
        this.startProgressDemo(skill);
        break;
      case "counter":
        this.startCounterDemo(skill);
        break;
      case "chart":
        this.startChartDemo(skill);
        break;
      case "code":
        this.startCodeDemo(skill);
        break;
    }
  }

  private startTypingDemo(skill: SkillDemo) {
    const text = skill.demoData?.text || 'console.log("Hello, World!");';
    const speed = skill.demoData?.speed || 100;
    let index = 0;

    const subscription = interval(speed).subscribe(() => {
      if (index < text.length) {
        this.typedText += text[index];
        index++;
      } else {
        subscription.unsubscribe();
      }
    });

    this.subscriptions.push(subscription);
  }

  private startProgressDemo(skill: SkillDemo) {
    const items = skill.demoData?.items || [
      { label: "Core Knowledge", progress: 0 },
      { label: "Practical Experience", progress: 0 },
      { label: "Advanced Features", progress: 0 },
    ];

    this.progressItems = items.map((item: any) => ({ ...item, progress: 0 }));

    setTimeout(() => {
      this.progressItems.forEach((item, index) => {
        setTimeout(() => {
          this.animateProgress(index, items[index].progress || skill.level);
        }, index * 500);
      });
    }, 500);
  }

  private animateProgress(index: number, targetProgress: number) {
    let currentProgress = 0;
    const increment = targetProgress / 30;

    const subscription = interval(50).subscribe(() => {
      currentProgress = Math.min(currentProgress + increment, targetProgress);
      this.progressItems[index].progress = Math.round(currentProgress);

      if (currentProgress >= targetProgress) {
        subscription.unsubscribe();
      }
    });

    this.subscriptions.push(subscription);
  }

  private startCounterDemo(skill: SkillDemo) {
    const counters = skill.demoData?.counters || [
      { label: "Experience Level", start: 0, end: skill.level, suffix: "%" },
    ];

    this.counterItems = counters.map((counter: any) => ({
      ...counter,
      currentValue: counter.start,
    }));

    this.counterItems.forEach((counter, index) => {
      setTimeout(() => {
        this.animateCounter(index, counter.end);
      }, index * 200);
    });
  }

  private animateCounter(index: number, targetValue: number) {
    const counter = this.counterItems[index];
    const increment = (targetValue - counter.start) / 50;
    let currentValue = counter.start;

    const subscription = interval(40).subscribe(() => {
      currentValue = Math.min(currentValue + increment, targetValue);
      this.counterItems[index].currentValue = Math.round(currentValue);

      if (currentValue >= targetValue) {
        subscription.unsubscribe();
      }
    });

    this.subscriptions.push(subscription);
  }

  private startChartDemo(skill: SkillDemo) {
    // Generate skill progression data
    const dataPoints = [
      { x: 50, y: 180 }, // Beginner
      { x: 150, y: 140 }, // Learning
      { x: 250, y: 100 }, // Intermediate
      { x: 350, y: 60 }, // Current level
    ];

    this.chartPoints = dataPoints;
    this.chartPath = this.generateSVGPath(dataPoints);
  }

  private generateSVGPath(points: any[]): string {
    if (points.length === 0) return "";

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    return path;
  }

  private startCodeDemo(skill: SkillDemo) {
    this.highlightedCode = this.highlightCode(
      skill.demoData?.code || "// Example code",
      skill.demoData?.language || "javascript",
    );
  }

  private highlightCode(code: string, language: string): string {
    // Basic syntax highlighting (you could integrate with Prism.js or similar)
    return code
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      .replace(
        /\b(class|interface|function|const|let|var|if|else|for|while|return|import|export|from|async|await)\b/g,
        '<span class="keyword">$&</span>',
      )
      .replace(
        /\b(string|number|boolean|void|any|Promise)\b/g,
        '<span class="type">$&</span>',
      )
      .replace(/'([^']*)'|"([^"]*)"/g, '<span class="string">$&</span>');
  }

  private resetDemoState() {
    this.typedText = "";
    this.progressItems = [];
    this.counterItems = [];
    this.chartPoints = [];
    this.chartPath = "";
    this.highlightedCode = "";

    // Unsubscribe from all active subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  restartDemo(skill: SkillDemo) {
    this.startDemo(skill);
  }

  private startAutoplay() {
    let currentIndex = 0;
    const interactiveSkills = this.skills.filter((skill) => skill.interactive);

    const subscription = interval(8000).subscribe(() => {
      if (interactiveSkills.length > 0) {
        this.selectSkill(interactiveSkills[currentIndex]);
        currentIndex = (currentIndex + 1) % interactiveSkills.length;
      }
    });

    this.subscriptions.push(subscription);
  }
}
