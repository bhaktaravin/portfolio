import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  trigger,
  state,
  style,
  transition,
  animate,
  stagger,
  query,
} from "@angular/animations";

export interface TimelineItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  achievements: string[];
  technologies: string[];
  type: "work" | "education" | "project" | "certification";
  icon?: string;
  companyLogo?: string;
  color?: string;
  isCurrentRole?: boolean;
  highlights?: {
    metric: string;
    value: string;
    description: string;
  }[];
}

@Component({
  selector: "app-interactive-timeline",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline-container" [@timelineAnimation]>
      <div class="timeline-header">
        <h2 class="timeline-title">Professional Journey</h2>
        <div class="timeline-filters">
          <button
            *ngFor="let filter of filters"
            class="filter-btn"
            [class.active]="activeFilter === filter.value"
            (click)="setFilter(filter.value)"
          >
            <span class="filter-icon">{{ filter.icon }}</span>
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div class="timeline-wrapper">
        <div class="timeline-line"></div>
        <div class="timeline-items">
          <div
            *ngFor="
              let item of filteredItems;
              let i = index;
              trackBy: trackByFn
            "
            class="timeline-item"
            [class.active]="selectedItem?.id === item.id"
            [class.work]="item.type === 'work'"
            [class.education]="item.type === 'education'"
            [class.project]="item.type === 'project'"
            [class.certification]="item.type === 'certification'"
            [class.current]="item.isCurrentRole"
            [@itemAnimation]="'visible'"
            (click)="selectItem(item)"
            (keydown)="onKeydown($event, item)"
            tabindex="0"
            [attr.aria-label]="getAriaLabel(item)"
          >
            <div
              class="timeline-marker"
              [style.background-color]="item.color || getTypeColor(item.type)"
            >
              <span class="marker-icon">{{
                item.icon || getTypeIcon(item.type)
              }}</span>
              <div class="marker-pulse" *ngIf="item.isCurrentRole"></div>
            </div>

            <div class="timeline-content">
              <div
                class="timeline-card"
                [class.expanded]="selectedItem?.id === item.id"
              >
                <div class="card-header">
                  <div class="title-section">
                    <h3 class="item-title">{{ item.title }}</h3>
                    <div class="item-company">
                      <div class="company-logo-wrapper">
                        <img
                          *ngIf="item.companyLogo"
                          [src]="item.companyLogo"
                          [alt]="item.company + ' logo'"
                          class="company-logo"
                          (error)="onImageError($event)"
                        />
                        <div class="company-initials" [style.background-color]="item.color || '#0066CC'">
                          {{ getCompanyInitials(item.company) }}
                        </div>
                      </div>
                      <span class="company-name">{{ item.company }}</span>
                      <span class="item-location" *ngIf="item.location"
                        >📍 {{ item.location }}</span
                      >
                    </div>
                  </div>
                  <div class="item-period">
                    <span
                      class="period-badge"
                      [class.current]="item.isCurrentRole"
                    >
                      {{ item.period }}
                      <span *ngIf="item.isCurrentRole" class="current-indicator"
                        >• Current</span
                      >
                    </span>
                    <div class="duration">{{ calculateDuration(item) }}</div>
                  </div>
                </div>

                <p class="item-description">{{ item.description }}</p>

                <!-- Expanded Content -->
                <div
                  class="expanded-content"
                  *ngIf="selectedItem?.id === item.id"
                  [@expandContent]
                >
                  <div
                    class="achievements-section"
                    *ngIf="item.achievements.length > 0"
                  >
                    <h4>Key Achievements</h4>
                    <ul class="achievements-list">
                      <li
                        *ngFor="let achievement of item.achievements"
                        [@achievementSlide]
                      >
                        <span class="achievement-bullet">✨</span>
                        {{ achievement }}
                      </li>
                    </ul>
                  </div>

                  <div
                    class="highlights-section"
                    *ngIf="item.highlights && item.highlights.length > 0"
                  >
                    <h4>Impact Metrics</h4>
                    <div class="highlights-grid">
                      <div
                        *ngFor="let highlight of item.highlights"
                        class="highlight-card"
                        [@highlightScale]
                      >
                        <div class="highlight-value">{{ highlight.value }}</div>
                        <div class="highlight-metric">
                          {{ highlight.metric }}
                        </div>
                        <div class="highlight-description">
                          {{ highlight.description }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="technologies-section"
                    *ngIf="item.technologies.length > 0"
                  >
                    <h4>Technologies Used</h4>
                    <div class="tech-tags">
                      <span
                        *ngFor="let tech of item.technologies"
                        class="tech-tag"
                        [@techSlide]
                      >
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="card-actions">
                  <button
                    class="expand-btn"
                    (click)="toggleItem(item, $event)"
                    [attr.aria-label]="
                      selectedItem?.id === item.id
                        ? 'Collapse details'
                        : 'Expand details'
                    "
                  >
                    <span
                      class="expand-icon"
                      [class.expanded]="selectedItem?.id === item.id"
                    >
                      {{ selectedItem?.id === item.id ? "−" : "+" }}
                    </span>
                    {{
                      selectedItem?.id === item.id
                        ? "Less Details"
                        : "More Details"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="timeline-summary" *ngIf="timelineStats">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ timelineStats.totalExperience }}</div>
            <div class="stat-label">Years Experience</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ timelineStats.companiesWorked }}</div>
            <div class="stat-label">Companies</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ timelineStats.projectsCompleted }}</div>
            <div class="stat-label">Projects</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ timelineStats.technologiesUsed }}</div>
            <div class="stat-label">Technologies</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./interactive-timeline.css"],
  animations: [
    trigger("timelineAnimation", [
      transition(":enter", [
        query(
          ".timeline-item",
          [
            style({ opacity: 0, transform: "translateX(-50px)" }),
            stagger(200, [
              animate(
                "500ms ease-out",
                style({ opacity: 1, transform: "translateX(0)" }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
    trigger("itemAnimation", [
      state("visible", style({ opacity: 1, transform: "scale(1)" })),
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0.8)" }),
        animate("300ms ease-out"),
      ]),
    ]),
    trigger("expandContent", [
      transition(":enter", [
        style({ height: "0", opacity: 0, overflow: "hidden" }),
        animate("400ms ease-out", style({ height: "*", opacity: 1 })),
      ]),
      transition(":leave", [
        animate("300ms ease-in", style({ height: "0", opacity: 0 })),
      ]),
    ]),
    trigger("achievementSlide", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(-20px)" }),
        animate(
          "300ms 100ms ease-out",
          style({ opacity: 1, transform: "translateX(0)" }),
        ),
      ]),
    ]),
    trigger("highlightScale", [
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0.9)" }),
        animate(
          "400ms 200ms ease-out",
          style({ opacity: 1, transform: "scale(1)" }),
        ),
      ]),
    ]),
    trigger("techSlide", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(10px)" }),
        animate(
          "250ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" }),
        ),
      ]),
    ]),
  ],
})
export class InteractiveTimelineComponent implements OnInit {
  @Input() items: TimelineItem[] = [];
  @Input() showFilters = true;
  @Input() showStats = true;

  selectedItem: TimelineItem | null = null;
  activeFilter = "all";
  filteredItems: TimelineItem[] = [];
  timelineStats: any = null;

  filters = [
    { value: "all", label: "All", icon: "📋" },
    { value: "work", label: "Work", icon: "💼" },
    { value: "education", label: "Education", icon: "🎓" },
    { value: "project", label: "Projects", icon: "🚀" },
    { value: "certification", label: "Certifications", icon: "🏆" },
  ];

  ngOnInit() {
    this.sortItems();
    this.filterItems();
    this.calculateStats();
  }

  private sortItems() {
    this.items.sort((a, b) => {
      const dateA = a.endDate || new Date();
      const dateB = b.endDate || new Date();
      return dateB.getTime() - dateA.getTime();
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.filterItems();
    this.selectedItem = null; // Close any expanded items
  }

  private filterItems() {
    if (this.activeFilter === "all") {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(
        (item) => item.type === this.activeFilter,
      );
    }
  }

  selectItem(item: TimelineItem) {
    this.selectedItem = this.selectedItem?.id === item.id ? null : item;
  }

  toggleItem(item: TimelineItem, event: Event) {
    event.stopPropagation();
    this.selectItem(item);
  }

  onKeydown(event: KeyboardEvent, item: TimelineItem) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.selectItem(item);
    }
  }

  trackByFn(index: number, item: TimelineItem): string {
    return item.id;
  }

  getAriaLabel(item: TimelineItem): string {
    return `${item.title} at ${item.company}, ${item.period}. Click to ${
      this.selectedItem?.id === item.id ? "collapse" : "expand"
    } details.`;
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      work: "💼",
      education: "🎓",
      project: "🚀",
      certification: "🏆",
    };
    return icons[type] || "📌";
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      work: "#3B82F6",
      education: "#10B981",
      project: "#8B5CF6",
      certification: "#F59E0B",
    };
    return colors[type] || "#6B7280";
  }

  calculateDuration(item: TimelineItem): string {
    const start = item.startDate;
    const end = item.endDate || new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;

    if (diffYears > 0) {
      if (remainingMonths > 0) {
        return `${diffYears}y ${remainingMonths}m`;
      }
      return `${diffYears} year${diffYears > 1 ? "s" : ""}`;
    } else if (diffMonths > 0) {
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
    } else {
      return "< 1 month";
    }
  }

  private calculateStats() {
    if (!this.showStats || this.items.length === 0) return;

    const workItems = this.items.filter((item) => item.type === "work");
    const companies = new Set(workItems.map((item) => item.company)).size;
    const projects = this.items.filter(
      (item) => item.type === "project",
    ).length;
    const allTechnologies = new Set();

    this.items.forEach((item) => {
      item.technologies.forEach((tech) => allTechnologies.add(tech));
    });

    // Calculate total experience from work items
    let totalMonths = 0;
    workItems.forEach((item) => {
      const start = item.startDate;
      const end = item.endDate || new Date();
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
      totalMonths += months;
    });

    const totalYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    const experienceString =
      remainingMonths > 0
        ? `${totalYears}.${Math.floor((remainingMonths / 12) * 10)}`
        : totalYears.toString();

    this.timelineStats = {
      totalExperience: experienceString,
      companiesWorked: companies,
      projectsCompleted: projects,
      technologiesUsed: allTechnologies.size,
    };
  }

  getCompanyInitials(company: string): string {
    return company
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}
