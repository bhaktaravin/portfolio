import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface GitHubEvent {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: { commits?: Array<{ message: string }> };
}

interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

interface ContributionDay {
  date: Date;
  count: number;
  level: number;
}

@Component({
  selector: 'app-github-activity',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './github-activity.html',
  styleUrls: ['./github-activity.css']
})
export class GitHubActivityComponent implements OnInit {
  username = 'bhaktaravin';
  loading = true;

  recentEvents: Array<{ title: string; repo: string; timeAgo: string }> = [];
  topRepos: GitHubRepo[] = [];
  contributionGrid: ContributionDay[][] = [];

  stats = { totalRepos: 0, totalStars: 0, currentStreak: 0, thisWeek: 0 };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    forkJoin({
      events: this.http.get<GitHubEvent[]>(
        `https://api.github.com/users/${this.username}/events/public?per_page=100`
      ).pipe(catchError(() => of([]))),
      repos: this.http.get<GitHubRepo[]>(
        `https://api.github.com/users/${this.username}/repos?per_page=100&sort=updated`
      ).pipe(catchError(() => of([])))
    }).subscribe(({ events, repos }) => {
      this.processEvents(events as GitHubEvent[]);
      this.processRepos(repos as GitHubRepo[]);
      this.buildContributionGrid(events as GitHubEvent[]);
      this.loading = false;
    });
  }

  private processEvents(events: GitHubEvent[]) {
    const pushEvents = events.filter(e => e.type === 'PushEvent');

    this.recentEvents = pushEvents.slice(0, 6).map(e => ({
      title: e.payload.commits?.[0]?.message?.split('\n')[0] || 'Commit',
      repo: e.repo.name.split('/')[1],
      timeAgo: this.getTimeAgo(new Date(e.created_at))
    }));

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.stats.thisWeek = pushEvents.filter(
      e => new Date(e.created_at) > oneWeekAgo
    ).length;

    this.stats.currentStreak = this.calcStreak(pushEvents);
  }

  private processRepos(repos: GitHubRepo[]) {
    this.stats.totalRepos = repos.length;
    this.stats.totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
    this.topRepos = repos
      .filter(r => r.description)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || 
                      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 4);
  }

  private buildContributionGrid(events: GitHubEvent[]) {
    const pushDates = new Map<string, number>();
    events.filter(e => e.type === 'PushEvent').forEach(e => {
      const key = new Date(e.created_at).toDateString();
      pushDates.set(key, (pushDates.get(key) || 0) + 1);
    });

    const weeks = 16;
    const today = new Date();
    this.contributionGrid = [];

    for (let w = 0; w < weeks; w++) {
      const week: ContributionDay[] = [];
      for (let d = 0; d < 7; d++) {
        const daysAgo = (weeks - w - 1) * 7 + (6 - d);
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);
        const count = pushDates.get(date.toDateString()) || 0;
        week.push({ date, count, level: count === 0 ? 0 : Math.min(count + 1, 4) });
      }
      this.contributionGrid.push(week);
    }
  }

  private calcStreak(pushEvents: GitHubEvent[]): number {
    const days = new Set(pushEvents.map(e => new Date(e.created_at).toDateString()));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (days.has(d.toDateString())) streak++;
      else if (i > 0) break;
    }
    return streak;
  }

  getContributionColor(level: number): string {
    return ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'][level] || '#161b22';
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    for (const [unit, s] of Object.entries({ y: 31536000, mo: 2592000, w: 604800, d: 86400, h: 3600, m: 60 })) {
      const v = Math.floor(seconds / s);
      if (v >= 1) return `${v}${unit} ago`;
    }
    return 'just now';
  }

  getLangColor(lang: string): string {
    const colors: Record<string, string> = {
      TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
      Dart: '#00B4AB', HTML: '#e34c26', CSS: '#563d7c', Java: '#b07219',
      Ruby: '#701516', Go: '#00ADD8', Rust: '#dea584'
    };
    return colors[lang] || '#8b92a7';
  }
}
