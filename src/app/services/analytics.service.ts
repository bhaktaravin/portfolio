import { Injectable, signal } from '@angular/core';

export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

export interface PageView {
  page: string;
  title: string;
  referrer?: string;
  timestamp: Date;
}

export interface UserSession {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  events: number;
  userAgent: string;
  viewport: { width: number; height: number };
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly SESSION_KEY = 'portfolio-session';
  private readonly EVENTS_KEY = 'portfolio-events';

  // Signals for reactive analytics
  private _isEnabled = signal<boolean>(true);
  private _currentSession = signal<UserSession | null>(null);
  private _totalEvents = signal<number>(0);

  // Public readonly signals
  readonly isEnabled = this._isEnabled.asReadonly();
  readonly currentSession = this._currentSession.asReadonly();
  readonly totalEvents = this._totalEvents.asReadonly();

  // Event queue for batch processing
  private eventQueue: AnalyticsEvent[] = [];
  private batchTimeout: any;
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_TIMEOUT = 5000; // 5 seconds

  constructor() {
    this.initializeSession();
    this.setupPageVisibilityListener();
    this.setupBeforeUnloadListener();

    // Initialize Google Analytics if available
    this.initializeGoogleAnalytics();
  }

  // Session Management
  private initializeSession(): void {
    let session = this.loadSessionFromStorage();

    if (!session || this.isSessionExpired(session)) {
      session = this.createNewSession();
    } else {
      session.lastActivity = new Date();
    }

    this._currentSession.set(session);
    this.saveSessionToStorage(session);
  }

  private createNewSession(): UserSession {
    return {
      sessionId: this.generateSessionId(),
      startTime: new Date(),
      lastActivity: new Date(),
      pageViews: 0,
      events: 0,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private isSessionExpired(session: UserSession): boolean {
    const now = new Date();
    const lastActivity = new Date(session.lastActivity);
    const thirtyMinutes = 30 * 60 * 1000;

    return (now.getTime() - lastActivity.getTime()) > thirtyMinutes;
  }

  // Event Tracking
  trackEvent(event: Omit<AnalyticsEvent, 'customParameters'> & { customParameters?: Record<string, any> }): void {
    if (!this._isEnabled()) return;

    const fullEvent: AnalyticsEvent = {
      ...event,
      customParameters: {
        ...event.customParameters,
        timestamp: new Date().toISOString(),
        sessionId: this._currentSession()?.sessionId,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        userAgent: navigator.userAgent
      }
    };

    // Add to queue
    this.eventQueue.push(fullEvent);

    // Update session
    this.updateSessionActivity();

    // Update total events count
    this._totalEvents.set(this._totalEvents() + 1);

    // Send to Google Analytics if available
    this.sendToGoogleAnalytics(fullEvent);

    // Process queue if batch size reached
    if (this.eventQueue.length >= this.BATCH_SIZE) {
      this.processBatch();
    } else {
      this.scheduleBatch();
    }

    // Console log in development
    if (this.isDevelopment()) {
      console.log('📊 Analytics Event:', fullEvent);
    }
  }

  // Page View Tracking
  trackPageView(page: string, title: string): void {
    if (!this._isEnabled()) return;

    const pageView: PageView = {
      page,
      title,
      referrer: document.referrer,
      timestamp: new Date()
    };

    // Update session
    const session = this._currentSession();
    if (session) {
      session.pageViews++;
      session.lastActivity = new Date();
      this._currentSession.set(session);
      this.saveSessionToStorage(session);
    }

    // Track as event
    this.trackEvent({
      name: 'page_view',
      category: 'Navigation',
      action: 'view',
      label: page,
      customParameters: pageView
    });

    // Send to Google Analytics
    this.sendPageViewToGoogleAnalytics(pageView);
  }

  // User Interaction Tracking
  trackClick(element: string, location?: string): void {
    this.trackEvent({
      name: 'click',
      category: 'User Interaction',
      action: 'click',
      label: element,
      customParameters: { location }
    });
  }

  trackScroll(percentage: number): void {
    // Only track scroll milestones
    if (percentage >= 25 && percentage % 25 === 0) {
      this.trackEvent({
        name: 'scroll',
        category: 'User Engagement',
        action: 'scroll',
        label: `${percentage}%`,
        value: percentage
      });
    }
  }

  trackDownload(fileName: string, fileType: string): void {
    this.trackEvent({
      name: 'download',
      category: 'File Download',
      action: 'download',
      label: fileName,
      customParameters: { fileType }
    });
  }

  trackFormSubmission(formName: string, success: boolean): void {
    this.trackEvent({
      name: 'form_submit',
      category: 'Form',
      action: success ? 'submit_success' : 'submit_error',
      label: formName,
      customParameters: { success }
    });
  }

  trackError(error: string, context?: string): void {
    this.trackEvent({
      name: 'error',
      category: 'Error',
      action: 'error_occurred',
      label: error,
      customParameters: { context, stack: new Error().stack }
    });
  }

  trackPerformance(metric: string, value: number, unit: string): void {
    this.trackEvent({
      name: 'performance',
      category: 'Performance',
      action: 'metric',
      label: metric,
      value: value,
      customParameters: { unit }
    });
  }

  // Google Analytics Integration
  private initializeGoogleAnalytics(): void {
    // Check if Google Analytics is loaded
    if (typeof gtag !== 'undefined') {
      console.log('📈 Google Analytics initialized');
      return;
    }

    // Load Google Analytics if GA_MEASUREMENT_ID is available
    const measurementId = this.getGoogleAnalyticsMeasurementId();
    if (measurementId && this.isProduction()) {
      this.loadGoogleAnalytics(measurementId);
    }
  }

  private getGoogleAnalyticsMeasurementId(): string | null {
    // In a real app, this would come from environment variables
    return null; // Replace with actual measurement ID
  }

  private loadGoogleAnalytics(measurementId: string): void {
    // Create script tag
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };

    (window as any).gtag('js', new Date());
    (window as any).gtag('config', measurementId);
  }

  private sendToGoogleAnalytics(event: AnalyticsEvent): void {
    if (typeof gtag === 'undefined') return;

    gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      custom_parameters: event.customParameters
    });
  }

  private sendPageViewToGoogleAnalytics(pageView: PageView): void {
    if (typeof gtag === 'undefined') return;

    gtag('config', this.getGoogleAnalyticsMeasurementId() || '', {
      page_title: pageView.title,
      page_location: window.location.href
    });
  }

  // Batch Processing
  private scheduleBatch(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this.processBatch();
    }, this.BATCH_TIMEOUT);
  }

  private processBatch(): void {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    // Clear timeout
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    // Store events locally for debugging/analytics
    this.storeEventsLocally(events);

    // Send to custom analytics endpoint if needed
    this.sendToCustomEndpoint(events);
  }

  private storeEventsLocally(events: AnalyticsEvent[]): void {
    try {
      const stored = JSON.parse(localStorage.getItem(this.EVENTS_KEY) || '[]');
      const updated = [...stored, ...events];

      // Keep only last 100 events to prevent storage bloat
      const limited = updated.slice(-100);

      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(limited));
    } catch (error) {
      console.warn('Failed to store analytics events locally:', error);
    }
  }

  private sendToCustomEndpoint(events: AnalyticsEvent[]): void {
    // Implement custom analytics endpoint if needed
    // This could be your own backend or a third-party service
    if (this.isDevelopment()) {
      console.log('📊 Batch processed:', events);
    }
  }

  // Lifecycle Management
  private updateSessionActivity(): void {
    const session = this._currentSession();
    if (session) {
      session.lastActivity = new Date();
      session.events++;
      this._currentSession.set(session);
      this.saveSessionToStorage(session);
    }
  }

  private setupPageVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.processBatch(); // Process events when page becomes hidden
      }
    });
  }

  private setupBeforeUnloadListener(): void {
    window.addEventListener('beforeunload', () => {
      this.processBatch(); // Process remaining events before page unload
    });
  }

  // Storage Management
  private loadSessionFromStorage(): UserSession | null {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        // Convert date strings back to Date objects
        session.startTime = new Date(session.startTime);
        session.lastActivity = new Date(session.lastActivity);
        return session;
      }
    } catch (error) {
      console.warn('Failed to load session from localStorage:', error);
    }
    return null;
  }

  private saveSessionToStorage(session: UserSession): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.warn('Failed to save session to localStorage:', error);
    }
  }

  // Utility Methods
  private isDevelopment(): boolean {
    return !this.isProduction();
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost' &&
           window.location.hostname !== '127.0.0.1';
  }

  // Public API
  enable(): void {
    this._isEnabled.set(true);
  }

  disable(): void {
    this._isEnabled.set(false);
  }

  clearData(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.EVENTS_KEY);
      this.eventQueue = [];
      this._totalEvents.set(0);
      this.initializeSession();
    } catch (error) {
      console.warn('Failed to clear analytics data:', error);
    }
  }

  getStoredEvents(): AnalyticsEvent[] {
    try {
      return JSON.parse(localStorage.getItem(this.EVENTS_KEY) || '[]');
    } catch (error) {
      console.warn('Failed to get stored events:', error);
      return [];
    }
  }

  exportAnalyticsData(): any {
    return {
      session: this._currentSession(),
      events: this.getStoredEvents(),
      totalEvents: this._totalEvents(),
      isEnabled: this._isEnabled()
    };
  }
}

// Global gtag interface for TypeScript
declare global {
  function gtag(...args: any[]): void;
}
