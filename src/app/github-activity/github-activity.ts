import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface GitHubEvent {
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
  payload: {
    commits?: Array<{
      message: string;
    }>;
  };
}

interface ContributionDay {
  date: Date;
  count: number;
  level: number; // 0-4 for intensity
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
  recentEvents: Array<{
    title: string;
    repo: string;
    timeAgo: string;
  }> = [];
  
  stats = {
    totalCommits: 0,
    currentStreak: 0,
    longestStreak: 10,
    thisWeek: 0
  };
  
  contributionGrid: ContributionDay[][] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchGitHubActivity();
    this.generateContributionGrid();
  }

  fetchGitHubActivity() {
    this.http.get<GitHubEvent[]>(`https://api.github.com/users/${this.username}/events/public?per_page=10`)
      .subscribe({
        next: (events) => {
          this.recentEvents = events
            .filter(e => e.type === 'PushEvent')
            .slice(0, 5)
            .map(event => ({
              title: event.payload.commits?.[0]?.message || 'Commit',
              repo: event.repo.name.split('/')[1] || event.repo.name,
              timeAgo: this.getTimeAgo(new Date(event.created_at))
            }));
          
          this.calculateStats(events);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.setMockData();
        }
      });
  }

  setMockData() {
    // Fallback data if API fails
    this.recentEvents = [
      { title: 'add application file', repo: 'futuristic-text-to-image', timeAgo: '6d ago' },
      { title: 'Update README and styles', repo: 'futuristic-text-to-image', timeAgo: '1w ago' }
    ];
    this.stats = {
      totalCommits: 594,
      currentStreak: 0,
      longestStreak: 10,
      thisWeek: 0
    };
  }

  calculateStats(events: GitHubEvent[]) {
    const pushEvents = events.filter(e => e.type === 'PushEvent');
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    this.stats.thisWeek = pushEvents.filter(e => 
      new Date(e.created_at) > oneWeekAgo
    ).length;
    
    // You can fetch more detailed stats from GitHub GraphQL API
    // For now, using estimate
    this.stats.totalCommits = 594;
  }

  generateContributionGrid() {
    // Generate a 12-week contribution grid (7 rows x 12 columns)
    const weeks = 12;
    const daysPerWeek = 7;
    const today = new Date();
    
    this.contributionGrid = [];
    
    for (let week = 0; week < weeks; week++) {
      const weekData: ContributionDay[] = [];
      for (let day = 0; day < daysPerWeek; day++) {
        const daysAgo = (weeks - week - 1) * 7 + (daysPerWeek - day - 1);
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);
        
        // Random contribution count for demo (replace with real data)
        const count = Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0;
        const level = count === 0 ? 0 : Math.min(Math.floor(count / 2) + 1, 4);
        
        weekData.push({ date, count, level });
      }
      this.contributionGrid.push(weekData);
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval}${unit.charAt(0)} ago`;
      }
    }
    
    return 'just now';
  }

  getContributionColor(level: number): string {
    const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
    return colors[level] || colors[0];
  }
}
