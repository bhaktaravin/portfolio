import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { Subscription } from 'rxjs';
import {
  GitHubService,
  GitHubStats,
  GitHubRepository,
  GitHubCommit,
  GitHubLanguageStats,
} from '../../../services/github.service';

@Component({
  selector: 'app-github-integration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="github-dashboard" [@fadeInUp]>
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-info">
            <div class="github-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <div class="header-text">
              <h2>Live GitHub Activity</h2>
              <p>Real-time development activity and contributions</p>
            </div>
          </div>
          <div class="header-actions">
            <button
              class="refresh-btn"
              (click)="refreshData()"
              [disabled]="stats.isLoading"
              [title]="'Last updated: ' + (stats.lastUpdated | date:'short')"
            >
              <span class="refresh-icon" [class.spinning]="stats.isLoading">🔄</span>
              Refresh
            </button>
            <a
              [href]="githubService.getProfileUrl()"
              target="_blank"
              rel="noopener noreferrer"
              class="profile-btn"
            >
              View Profile
            </a>
          </div>
        </div>
      </div>

      <div class="dashboard-content" *ngIf="!stats.isLoading && !stats.error">
        <!-- Stats Overview -->
        <div class="stats-overview">
          <div class="stat-card" [@slideInUp]>
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.user?.public_repos || 0 }}</div>
              <div class="stat-label">Public Repos</div>
            </div>
          </div>
          <div class="stat-card" [@slideInUp]>
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalStars }}</div>
              <div class="stat-label">Total Stars</div>
            </div>
          </div>
          <div class="stat-card" [@slideInUp]>
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.contributions?.currentStreak || 0 }}</div>
              <div class="stat-label">Current Streak</div>
            </div>
          </div>
          <div class="stat-card" [@slideInUp]>
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.user?.followers || 0 }}</div>
              <div class="stat-label">Followers</div>
            </div>
          </div>
        </div>

        <!-- Main Dashboard Grid -->
        <div class="dashboard-grid">
          <!-- Recent Repositories -->
          <div class="dashboard-section repositories-section" [@slideInLeft]>
            <div class="section-header">
              <h3>Recent Repositories</h3>
              <span class="section-count">{{ stats.repositories.length }}</span>
            </div>
            <div class="repositories-list">
              <div
                *ngFor="let repo of stats.repositories.slice(0, 6); trackBy: trackByRepo"
                class="repository-item"
                [@repositoryAnimation]
              >
                <div class="repo-header">
                  <a
                    [href]="repo.html_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="repo-name"
                  >
                    {{ repo.name }}
                  </a>
                  <div class="repo-stats">
                    <span class="repo-stat" *ngIf="repo.stargazers_count > 0">
                      ⭐ {{ repo.stargazers_count }}
                    </span>
                    <span class="repo-stat" *ngIf="repo.forks_count > 0">
                      🍴 {{ repo.forks_count }}
                    </span>
                  </div>
                </div>
                <p class="repo-description" *ngIf="repo.description">
                  {{ repo.description }}
                </p>
                <div class="repo-footer">
                  <span class="repo-language" *ngIf="repo.language">
                    <span class="language-dot" [style.background-color]="getLanguageColor(repo.language)"></span>
                    {{ repo.language }}
                  </span>
                  <span class="repo-updated">
                    Updated {{ getTimeAgo(repo.updated_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Commits -->
          <div class="dashboard-section commits-section" [@slideInRight]>
            <div class="section-header">
              <h3>Recent Commits</h3>
              <span class="section-count">{{ stats.recentCommits.length }}</span>
            </div>
            <div class="commits-list">
              <div
                *ngFor="let commit of stats.recentCommits.slice(0, 8); trackBy: trackByCommit"
                class="commit-item"
                [@commitAnimation]
              >
                <div class="commit-message">
                  <a
                    [href]="commit.html_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="commit-link"
                  >
                    {{ truncateCommitMessage(commit.commit.message) }}
                  </a>
                </div>
                <div class="commit-meta">
                  <span class="commit-repo" *ngIf="commit.repository">
                    {{ commit.repository.name }}
                  </span>
                  <span class="commit-date">
                    {{ getTimeAgo(commit.commit.author.date) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Language Stats -->
          <div class="dashboard-section languages-section" [@slideInUp]>
            <div class="section-header">
              <h3>Top Languages</h3>
              <span class="section-count">{{ getTopLanguages().length }}</span>
            </div>
            <div class="languages-chart">
              <div
                *ngFor="let lang of getTopLanguages(); trackBy: trackByLanguage"
                class="language-bar"
                [@languageAnimation]
              >
                <div class="language-info">
                  <span class="language-name">
                    <span class="language-dot" [style.background-color]="getLanguageColor(lang.name)"></span>
                    {{ lang.name }}
                  </span>
                  <span class="language-count">{{ lang.count }} repos</span>
                </div>
                <div class="language-progress">
                  <div
                    class="language-progress-bar"
                    [style.width.%]="lang.percentage"
                    [style.background-color]="getLanguageColor(lang.name)"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contribution Activity -->
          <div class="dashboard-section activity-section" [@slideInUp]>
            <div class="section-header">
              <h3>Contribution Activity</h3>
              <span class="activity-summary">{{ stats.contributions?.totalCommits || 0 }} total commits</span>
            </div>
            <div class="contribution-grid" *ngIf="stats.contributions">
              <div class="contribution-stats">
                <div class="contribution-stat">
                  <span class="stat-value">{{ stats.contributions.currentStreak }}</span>
                  <span class="stat-label">Current Streak</span>
                </div>
                <div class="contribution-stat">
                  <span class="stat-value">{{ stats.contributions.longestStreak }}</span>
                  <span class="stat-label">Longest Streak</span>
                </div>
                <div class="contribution-stat">
                  <span class="stat-value">{{ getThisWeekContributions() }}</span>
                  <span class="stat-label">This Week</span>
                </div>
              </div>
              <div class="contribution-calendar">
                <div class="calendar-header">
                  <span class="calendar-title">Last 12 weeks</span>
                  <div class="calendar-legend">
                    <span>Less</span>
                    <div class="legend-levels">
                      <div class="legend-level level-0"></div>
                      <div class="legend-level level-1"></div>
                      <div class="legend-level level-2"></div>
                      <div class="legend-level level-3"></div>
                      <div class="legend-level level-4"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
                <div class="calendar-grid">
                  <div
                    *ngFor="let day of getRecentContributions(); trackBy: trackByContribution"
                    class="contribution-day"
                    [class]="'level-' + day.level"
                    [title]="day.count + ' contributions on ' + (day.date | date:'mediumDate')"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="stats.isLoading" [@fadeIn]>
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading GitHub activity...</div>
      </div>

      <!-- Error State -->
      <div class="error-state" *ngIf="stats.error" [@fadeIn]>
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ stats.error }}</div>
        <button class="error-retry" (click)="refreshData()">
          Try Again
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./github-integration.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('repositoryAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('commitAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('languageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleX(0)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scaleX(1)' }))
      ])
    ])
  ]
})
export class GitHubIntegrationComponent implements OnInit, OnDestroy {
  stats: GitHubStats = {
    user: null,
    repositories: [],
    recentCommits: [],
    languageStats: {},
    events: [],
    contributions: null,
    isLoading: true,
    lastUpdated: null,
    error: null
  };

  private subscription?: Subscription;

  constructor(public githubService: GitHubService) {}

  ngOnInit() {
    this.subscription = this.githubService.stats$.subscribe(stats => {
      this.stats = stats;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  refreshData() {
    this.githubService.forceRefresh();
  }

  get totalStars(): number {
    return this.stats.repositories.reduce((total, repo) => total + repo.stargazers_count, 0);
  }

  getTopLanguages() {
    const languages = Object.entries(this.stats.languageStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const totalRepos = languages.reduce((sum, lang) => sum + lang.count, 0);

    return languages.map(lang => ({
      ...lang,
      percentage: (lang.count / totalRepos) * 100
    }));
  }

  getLanguageColor(language: string): string {
    const colors: { [key: string]: string } = {
      'TypeScript': '#3178c6',
      'JavaScript': '#f7df1e',
      'Python': '#3776ab',
      'Java': '#ed8b00',
      'C#': '#239120',
      'C++': '#00599c',
      'CSS': '#1572b6',
      'HTML': '#e34f26',
      'Dart': '#0175c2',
      'Go': '#00add8',
      'Rust': '#000000',
      'PHP': '#777bb4',
      'Ruby': '#cc342d',
      'Swift': '#fa7343',
      'Kotlin': '#0095d5',
      'Shell': '#89e051',
      'Vue': '#4fc08d',
      'React': '#61dafb'
    };
    return colors[language] || '#6b7280';
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2419200) return `${Math.floor(diffInSeconds / 604800)}w ago`;
    return `${Math.floor(diffInSeconds / 2419200)}mo ago`;
  }

  truncateCommitMessage(message: string): string {
    const firstLine = message.split('\n')[0];
    return firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine;
  }

  getRecentContributions() {
    if (!this.stats.contributions) return [];

    // Get last 84 days (12 weeks)
    return this.stats.contributions.contributionDays.slice(-84);
  }

  getThisWeekContributions(): number {
    if (!this.stats.contributions) return 0;

    const lastWeek = this.stats.contributions.contributionDays.slice(-7);
    return lastWeek.reduce((sum, day) => sum + day.count, 0);
  }

  // Track by functions for performance
  trackByRepo(index: number, repo: GitHubRepository): number {
    return repo.id;
  }

  trackByCommit(index: number, commit: GitHubCommit): string {
    return commit.sha;
  }

  trackByLanguage(index: number, lang: any): string {
    return lang.name;
  }

  trackByContribution(index: number, day: any): string {
    return day.date;
  }
}
