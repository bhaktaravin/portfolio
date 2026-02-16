import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService, AnalyticsEvent } from '../services/analytics.service';

interface AnalyticsStat {
  label: string;
  value: string;
  icon: string;
  change?: string;
}

interface PageViewStat {
  page: string;
  views: number;
  percentage: number;
}

interface EventCategory {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css'],
})
export class AnalyticsDashboardComponent implements OnInit {
  private readonly analytics = inject(AnalyticsService);

  stats = signal<AnalyticsStat[]>([]);
  pageViews = signal<PageViewStat[]>([]);
  eventCategories = signal<EventCategory[]>([]);
  recentEvents = signal<AnalyticsEvent[]>([]);
  sessionDuration = signal('0m 0s');
  browserInfo = signal('');
  viewportSize = signal('');
  isLiveMode = signal(true);

  readonly categoryColors: Record<string, string> = {
    'Navigation': '#3b82f6',
    'User Interaction': '#10b981',
    'User Engagement': '#f59e0b',
    'File Download': '#8b5cf6',
    'Form': '#ec4899',
    'Performance': '#06b6d4',
    'Error': '#ef4444',
  };

  ngOnInit(): void {
    this.loadAnalytics();
    // Refresh every 5 seconds in live mode
    setInterval(() => {
      if (this.isLiveMode()) {
        this.loadAnalytics();
      }
    }, 5000);
  }

  loadAnalytics(): void {
    const data = this.analytics.exportAnalyticsData();
    const events: AnalyticsEvent[] = data.events || [];
    const session = data.session;

    // Session info
    if (session) {
      const duration = Date.now() - new Date(session.startTime).getTime();
      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      this.sessionDuration.set(`${minutes}m ${seconds}s`);
      this.browserInfo.set(this.parseBrowser(session.userAgent));
      this.viewportSize.set(`${session.viewport.width} × ${session.viewport.height}`);
    }

    // Stats
    const pageViewEvents = events.filter(e => e.name === 'page_view');
    const clickEvents = events.filter(e => e.name === 'click');
    const uniquePages = new Set(pageViewEvents.map(e => e.label)).size;

    this.stats.set([
      { label: 'Total Events', value: String(events.length), icon: '📊', change: `+${events.length}` },
      { label: 'Page Views', value: String(pageViewEvents.length), icon: '👁️' },
      { label: 'Interactions', value: String(clickEvents.length), icon: '👆' },
      { label: 'Pages Visited', value: String(uniquePages), icon: '📄' },
      { label: 'Session Duration', value: this.sessionDuration(), icon: '⏱️' },
      { label: 'Viewport', value: this.viewportSize(), icon: '🖥️' },
    ]);

    // Page views breakdown
    const pageCounts: Record<string, number> = {};
    pageViewEvents.forEach(e => {
      const page = e.label || 'unknown';
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });
    const totalPageViews = pageViewEvents.length || 1;
    this.pageViews.set(
      Object.entries(pageCounts)
        .map(([page, views]) => ({
          page,
          views,
          percentage: Math.round((views / totalPageViews) * 100),
        }))
        .sort((a, b) => b.views - a.views),
    );

    // Event categories
    const catCounts: Record<string, number> = {};
    events.forEach(e => {
      catCounts[e.category] = (catCounts[e.category] || 0) + 1;
    });
    const totalEvents = events.length || 1;
    this.eventCategories.set(
      Object.entries(catCounts)
        .map(([category, count]) => ({
          category,
          count,
          percentage: Math.round((count / totalEvents) * 100),
          color: this.categoryColors[category] || '#6b7280',
        }))
        .sort((a, b) => b.count - a.count),
    );

    // Recent events (last 20)
    this.recentEvents.set(events.slice(-20).reverse());
  }

  toggleLiveMode(): void {
    this.isLiveMode.update(v => !v);
  }

  clearAnalytics(): void {
    this.analytics.clearData();
    this.loadAnalytics();
  }

  getEventIcon(name: string): string {
    const icons: Record<string, string> = {
      'page_view': '👁️',
      'click': '👆',
      'scroll': '📜',
      'download': '📥',
      'form_submit': '📝',
      'error': '❌',
      'performance': '⚡',
    };
    return icons[name] || '📊';
  }

  formatEventTime(event: AnalyticsEvent): string {
    const ts = event.customParameters?.['timestamp'];
    if (ts) {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    return '--:--';
  }

  private parseBrowser(ua: string): string {
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edg')) return 'Edge';
    return 'Other';
  }
}
