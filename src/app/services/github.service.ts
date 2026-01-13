import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError, of } from "rxjs";
import { catchError, map, tap, switchMap } from "rxjs/operators";

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  company: string;
  location: string;
  email: string;
  blog: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  clone_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  visibility: string;
  archived: boolean;
  fork: boolean;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
  repository?: {
    name: string;
    html_url: string;
  };
}

export interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  payload: any;
  created_at: string;
}

export interface GitHubLanguageStats {
  [language: string]: number;
}

export interface GitHubContributions {
  totalCommits: number;
  currentStreak: number;
  longestStreak: number;
  contributionDays: {
    date: string;
    count: number;
    level: number;
  }[];
}

export interface GitHubStats {
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  recentCommits: GitHubCommit[];
  languageStats: GitHubLanguageStats;
  events: GitHubEvent[];
  contributions: GitHubContributions | null;
  isLoading: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

@Injectable({
  providedIn: "root",
})
export class GitHubService {
  private readonly API_BASE = "https://api.github.com";
  private readonly GITHUB_USERNAME = "bhaktaravin"; // Replace with your GitHub username
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

  private statsSubject = new BehaviorSubject<GitHubStats>({
    user: null,
    repositories: [],
    recentCommits: [],
    languageStats: {},
    events: [],
    contributions: null,
    isLoading: false,
    lastUpdated: null,
    error: null,
  });

  public stats$ = this.statsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private getHeaders(): HttpHeaders {
    // For public repositories, no token is required
    // If you want to increase rate limits, add a GitHub token:
    // const token = environment.githubToken;
    // return new HttpHeaders(token ? { 'Authorization': `token ${token}` } : {});
    return new HttpHeaders();
  }

  private loadInitialData(): void {
    const cachedData = this.getCachedData();
    if (cachedData && this.isCacheValid(cachedData.lastUpdated)) {
      this.statsSubject.next(cachedData);
      return;
    }

    this.refreshData();
  }

  public refreshData(): void {
    this.updateStats({ isLoading: true, error: null });

    // Load all data concurrently
    const user$ = this.fetchUser();
    const repos$ = this.fetchRepositories();
    const events$ = this.fetchRecentEvents();

    // Combine all requests
    user$
      .pipe(
        switchMap((user) => {
          return repos$.pipe(
            switchMap((repositories) => {
              const recentCommits$ = this.fetchRecentCommits(
                repositories.slice(0, 5),
              );
              const languageStats$ = this.calculateLanguageStats(repositories);

              return recentCommits$.pipe(
                map((recentCommits) => ({
                  user,
                  repositories,
                  recentCommits,
                  languageStats: languageStats$,
                  events: [] as GitHubEvent[],
                })),
              );
            }),
          );
        }),
        catchError((error) => {
          console.error("GitHub API Error:", error);
          this.updateStats({
            isLoading: false,
            error: "Failed to load GitHub data. Please try again later.",
          });
          return throwError(error);
        }),
      )
      .subscribe((data) => {
        // Fetch events separately as they're less critical
        events$.subscribe(
          (events) => {
            const finalStats: GitHubStats = {
              ...data,
              events,
              contributions: this.generateMockContributions(), // GitHub API doesn't provide this without GraphQL
              isLoading: false,
              lastUpdated: new Date(),
              error: null,
            };

            this.updateStats(finalStats);
            this.cacheData(finalStats);
          },
          () => {
            // Events failed, but continue with other data
            const finalStats: GitHubStats = {
              ...data,
              events: [],
              contributions: this.generateMockContributions(),
              isLoading: false,
              lastUpdated: new Date(),
              error: null,
            };

            this.updateStats(finalStats);
            this.cacheData(finalStats);
          },
        );
      });
  }

  private fetchUser(): Observable<GitHubUser> {
    return this.http.get<GitHubUser>(
      `${this.API_BASE}/users/${this.GITHUB_USERNAME}`,
      { headers: this.getHeaders() },
    );
  }

  private fetchRepositories(): Observable<GitHubRepository[]> {
    return this.http
      .get<
        GitHubRepository[]
      >(`${this.API_BASE}/users/${this.GITHUB_USERNAME}/repos?sort=updated&per_page=20`, { headers: this.getHeaders() })
      .pipe(
        map((repos) =>
          repos
            .filter((repo) => !repo.fork && !repo.archived) // Filter out forks and archived repos
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
            ),
        ),
      );
  }

  private fetchRecentCommits(
    repositories: GitHubRepository[],
  ): Observable<GitHubCommit[]> {
    if (repositories.length === 0) {
      return of([]);
    }

    const commitRequests = repositories.slice(0, 5).map((repo) =>
      this.http
        .get<
          GitHubCommit[]
        >(`${this.API_BASE}/repos/${repo.full_name}/commits?author=${this.GITHUB_USERNAME}&per_page=3`, { headers: this.getHeaders() })
        .pipe(
          map((commits) =>
            commits.map((commit) => ({
              ...commit,
              repository: {
                name: repo.name,
                html_url: repo.html_url,
              },
            })),
          ),
          catchError(() => of([])), // If repo commits fail, return empty array
        ),
    );

    if (commitRequests.length === 0) {
      return of([]);
    }

    return commitRequests
      .reduce((combined, current) =>
        combined.pipe(
          switchMap((existingCommits) =>
            current.pipe(
              map((newCommits) => [...existingCommits, ...newCommits]),
            ),
          ),
        ),
      )
      .pipe(
        map((commits) =>
          commits
            .sort(
              (a, b) =>
                new Date(b.commit.author.date).getTime() -
                new Date(a.commit.author.date).getTime(),
            )
            .slice(0, 10),
        ),
      );
  }

  private fetchRecentEvents(): Observable<GitHubEvent[]> {
    return this.http
      .get<
        GitHubEvent[]
      >(`${this.API_BASE}/users/${this.GITHUB_USERNAME}/events/public?per_page=15`, { headers: this.getHeaders() })
      .pipe(
        catchError(() => of([])),
        map((events) =>
          events.filter((event) =>
            [
              "PushEvent",
              "CreateEvent",
              "PublicEvent",
              "ReleaseEvent",
            ].includes(event.type),
          ),
        ),
      );
  }

  private calculateLanguageStats(
    repositories: GitHubRepository[],
  ): GitHubLanguageStats {
    const languageStats: GitHubLanguageStats = {};

    repositories.forEach((repo) => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
    });

    return languageStats;
  }

  private generateMockContributions(): GitHubContributions {
    // Generate mock contribution data since GitHub's contribution graph requires GraphQL API
    const contributions: GitHubContributions = {
      totalCommits: Math.floor(Math.random() * 1000) + 500,
      currentStreak: Math.floor(Math.random() * 30) + 5,
      longestStreak: Math.floor(Math.random() * 100) + 50,
      contributionDays: [],
    };

    // Generate last 365 days of contribution data
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const count = Math.random() > 0.7 ? Math.floor(Math.random() * 8) + 1 : 0;
      const level =
        count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;

      contributions.contributionDays.push({
        date: date.toISOString().split("T")[0],
        count,
        level,
      });
    }

    return contributions;
  }

  private updateStats(partialStats: Partial<GitHubStats>): void {
    const currentStats = this.statsSubject.value;
    this.statsSubject.next({ ...currentStats, ...partialStats });
  }

  private getCachedData(): GitHubStats | null {
    try {
      const cached = localStorage.getItem("github-stats");
      if (cached) {
        const data = JSON.parse(cached);
        data.lastUpdated = new Date(data.lastUpdated);
        return data;
      }
    } catch (error) {
      console.error("Failed to parse cached GitHub data:", error);
    }
    return null;
  }

  private cacheData(stats: GitHubStats): void {
    try {
      localStorage.setItem("github-stats", JSON.stringify(stats));
    } catch (error) {
      console.error("Failed to cache GitHub data:", error);
    }
  }

  private isCacheValid(lastUpdated: Date | null): boolean {
    if (!lastUpdated) return false;
    return Date.now() - lastUpdated.getTime() < this.CACHE_DURATION;
  }

  // Public methods for manual refresh
  public forceRefresh(): void {
    localStorage.removeItem("github-stats");
    this.refreshData();
  }

  public getLastUpdated(): Date | null {
    return this.statsSubject.value.lastUpdated;
  }

  public isLoading(): boolean {
    return this.statsSubject.value.isLoading;
  }

  public hasError(): boolean {
    return !!this.statsSubject.value.error;
  }

  // Utility methods
  public getRepositoryUrl(repoName: string): string {
    return `https://github.com/${this.GITHUB_USERNAME}/${repoName}`;
  }

  public getCommitUrl(repoName: string, sha: string): string {
    return `https://github.com/${this.GITHUB_USERNAME}/${repoName}/commit/${sha}`;
  }

  public getProfileUrl(): string {
    return `https://github.com/${this.GITHUB_USERNAME}`;
  }
}
