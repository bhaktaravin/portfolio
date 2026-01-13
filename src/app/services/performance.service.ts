import { Injectable, signal } from "@angular/core";
import { AnalyticsService } from "./analytics.service";

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  rating: "good" | "needs-improvement" | "poor";
  source:
    | "navigation"
    | "paint"
    | "layout-shift"
    | "first-input"
    | "largest-contentful-paint"
    | "custom";
}

export interface WebVitals {
  cls?: PerformanceMetric;
  fcp?: PerformanceMetric;
  fid?: PerformanceMetric;
  lcp?: PerformanceMetric;
  ttfb?: PerformanceMetric;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
  cached: boolean;
}

export interface NavigationTiming {
  domContentLoaded: number;
  loadComplete: number;
  firstByte: number;
  domInteractive: number;
  redirectTime: number;
  dnsTime: number;
  connectTime: number;
  requestTime: number;
  responseTime: number;
  domProcessingTime: number;
  loadEventTime: number;
}

@Injectable({
  providedIn: "root",
})
export class PerformanceService {
  private readonly METRICS_KEY = "portfolio-performance";
  private readonly MAX_STORED_METRICS = 50;

  // Signals for reactive performance monitoring
  private _metrics = signal<PerformanceMetric[]>([]);
  private _webVitals = signal<WebVitals>({});
  private _navigationTiming = signal<NavigationTiming | null>(null);
  private _resourceTimings = signal<ResourceTiming[]>([]);
  private _isMonitoring = signal(false);

  // Public readonly signals
  readonly metrics = this._metrics.asReadonly();
  readonly webVitals = this._webVitals.asReadonly();
  readonly navigationTiming = this._navigationTiming.asReadonly();
  readonly resourceTimings = this._resourceTimings.asReadonly();
  readonly isMonitoring = this._isMonitoring.asReadonly();

  private observers: PerformanceObserver[] = [];
  private startTime = performance.now();

  constructor(private analytics: AnalyticsService) {
    this.initializeMonitoring();
    this.loadStoredMetrics();
  }

  // Initialize performance monitoring
  initializeMonitoring(): void {
    if (!this.isPerformanceSupported()) {
      console.warn("Performance API not fully supported");
      return;
    }

    this._isMonitoring.set(true);

    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();

    // Monitor resource loading
    this.observeResourceTiming();

    // Capture navigation timing
    this.captureNavigationTiming();

    // Monitor long tasks
    this.observeLongTasks();

    // Monitor memory usage (if available)
    this.monitorMemoryUsage();
  }

  // Observe Largest Contentful Paint (LCP)
  private observeLCP(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (lastEntry) {
          const lcp = this.createMetric(
            "LCP",
            Math.round(lastEntry.startTime),
            "ms",
            "largest-contentful-paint",
          );

          this.updateWebVitals("lcp", lcp);
          this.addMetric(lcp);

          // Send to analytics
          this.analytics.trackPerformance("LCP", lcp.value, "ms");
        }
      });

      observer.observe({ type: "largest-contentful-paint", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("LCP observation failed:", error);
    }
  }

  // Observe First Input Delay (FID)
  private observeFID(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry: any) => {
          const fid = this.createMetric(
            "FID",
            Math.round(entry.processingStart - entry.startTime),
            "ms",
            "first-input",
          );

          this.updateWebVitals("fid", fid);
          this.addMetric(fid);

          // Send to analytics
          this.analytics.trackPerformance("FID", fid.value, "ms");
        });
      });

      observer.observe({ type: "first-input", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("FID observation failed:", error);
    }
  }

  // Observe Cumulative Layout Shift (CLS)
  private observeCLS(): void {
    if (!("PerformanceObserver" in window)) return;

    let clsValue = 0;
    let clsEntries: any[] = [];

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsEntries.push(entry);
            clsValue += entry.value;
          }
        });

        // Update CLS metric
        const cls = this.createMetric(
          "CLS",
          Math.round(clsValue * 1000) / 1000,
          "score",
          "layout-shift",
        );

        this.updateWebVitals("cls", cls);
        this.addMetric(cls);

        // Send to analytics
        this.analytics.trackPerformance("CLS", cls.value, "score");
      });

      observer.observe({ type: "layout-shift", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("CLS observation failed:", error);
    }
  }

  // Observe First Contentful Paint (FCP)
  private observeFCP(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
          if (entry.name === "first-contentful-paint") {
            const fcp = this.createMetric(
              "FCP",
              Math.round(entry.startTime),
              "ms",
              "paint",
            );

            this.updateWebVitals("fcp", fcp);
            this.addMetric(fcp);

            // Send to analytics
            this.analytics.trackPerformance("FCP", fcp.value, "ms");
          }
        });
      });

      observer.observe({ type: "paint", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("FCP observation failed:", error);
    }
  }

  // Observe Time to First Byte (TTFB)
  private observeTTFB(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry: any) => {
          if (entry.entryType === "navigation") {
            const ttfb = this.createMetric(
              "TTFB",
              Math.round(entry.responseStart - entry.requestStart),
              "ms",
              "navigation",
            );

            this.updateWebVitals("ttfb", ttfb);
            this.addMetric(ttfb);

            // Send to analytics
            this.analytics.trackPerformance("TTFB", ttfb.value, "ms");
          }
        });
      });

      observer.observe({ type: "navigation", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("TTFB observation failed:", error);
    }
  }

  // Observe resource timing
  private observeResourceTiming(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[];
        const resources: ResourceTiming[] = [];

        entries.forEach((entry) => {
          const resource: ResourceTiming = {
            name: entry.name,
            duration: Math.round(entry.duration),
            size: entry.transferSize || entry.decodedBodySize || 0,
            type: this.getResourceType(entry.name),
            cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
          };

          resources.push(resource);

          // Track slow resources
          if (resource.duration > 1000) {
            this.analytics.trackPerformance(
              "SlowResource",
              resource.duration,
              "ms",
            );
          }
        });

        this._resourceTimings.update((current) => [...current, ...resources]);
      });

      observer.observe({ type: "resource", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("Resource timing observation failed:", error);
    }
  }

  // Observe long tasks
  private observeLongTasks(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
          const longTask = this.createMetric(
            "LongTask",
            Math.round(entry.duration),
            "ms",
            "custom",
          );

          this.addMetric(longTask);

          // Send to analytics
          this.analytics.trackPerformance("LongTask", longTask.value, "ms");
        });
      });

      observer.observe({ type: "longtask", buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn("Long task observation failed:", error);
    }
  }

  // Capture navigation timing
  private captureNavigationTiming(): void {
    // Wait for page load to complete
    window.addEventListener("load", () => {
      setTimeout(() => {
        const timing = performance.timing;
        const navigation = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;

        if (navigation) {
          const navTiming: NavigationTiming = {
            domContentLoaded: Math.round(
              navigation.domContentLoadedEventEnd -
                navigation.domContentLoadedEventStart,
            ),
            loadComplete: Math.round(
              navigation.loadEventEnd - navigation.loadEventStart,
            ),
            firstByte: Math.round(
              navigation.responseStart - navigation.requestStart,
            ),
            domInteractive: Math.round(
              navigation.domInteractive - navigation.fetchStart,
            ),
            redirectTime: Math.round(
              navigation.redirectEnd - navigation.redirectStart,
            ),
            dnsTime: Math.round(
              navigation.domainLookupEnd - navigation.domainLookupStart,
            ),
            connectTime: Math.round(
              navigation.connectEnd - navigation.connectStart,
            ),
            requestTime: Math.round(
              navigation.responseStart - navigation.requestStart,
            ),
            responseTime: Math.round(
              navigation.responseEnd - navigation.responseStart,
            ),
            domProcessingTime: Math.round(
              navigation.domComplete - navigation.domInteractive,
            ),
            loadEventTime: Math.round(
              navigation.loadEventEnd - navigation.loadEventStart,
            ),
          };

          this._navigationTiming.set(navTiming);

          // Send key metrics to analytics
          this.analytics.trackPerformance(
            "DOMContentLoaded",
            navTiming.domContentLoaded,
            "ms",
          );
          this.analytics.trackPerformance(
            "LoadComplete",
            navTiming.loadComplete,
            "ms",
          );
        }
      }, 0);
    });
  }

  // Monitor memory usage
  private monitorMemoryUsage(): void {
    if ("memory" in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;

        if (memory) {
          const memoryMetric = this.createMetric(
            "MemoryUsage",
            Math.round(memory.usedJSHeapSize / 1024 / 1024),
            "MB",
            "custom",
          );

          this.addMetric(memoryMetric);

          // Track memory usage if it's high
          if (memoryMetric.value > 50) {
            this.analytics.trackPerformance(
              "HighMemoryUsage",
              memoryMetric.value,
              "MB",
            );
          }
        }
      };

      // Check memory usage periodically
      setInterval(checkMemory, 30000); // Every 30 seconds
    }
  }

  // Create a performance metric
  private createMetric(
    name: string,
    value: number,
    unit: string,
    source: PerformanceMetric["source"],
  ): PerformanceMetric {
    return {
      name,
      value,
      unit,
      timestamp: new Date(),
      rating: this.getRating(name, value),
      source,
    };
  }

  // Get performance rating based on Core Web Vitals thresholds
  private getRating(
    metricName: string,
    value: number,
  ): "good" | "needs-improvement" | "poor" {
    switch (metricName) {
      case "LCP":
        return value <= 2500
          ? "good"
          : value <= 4000
            ? "needs-improvement"
            : "poor";
      case "FID":
        return value <= 100
          ? "good"
          : value <= 300
            ? "needs-improvement"
            : "poor";
      case "CLS":
        return value <= 0.1
          ? "good"
          : value <= 0.25
            ? "needs-improvement"
            : "poor";
      case "FCP":
        return value <= 1800
          ? "good"
          : value <= 3000
            ? "needs-improvement"
            : "poor";
      case "TTFB":
        return value <= 800
          ? "good"
          : value <= 1800
            ? "needs-improvement"
            : "poor";
      default:
        return "good";
    }
  }

  // Update Web Vitals
  private updateWebVitals(
    key: keyof WebVitals,
    metric: PerformanceMetric,
  ): void {
    this._webVitals.update((current) => ({
      ...current,
      [key]: metric,
    }));
  }

  // Add metric to collection
  private addMetric(metric: PerformanceMetric): void {
    this._metrics.update((current) => {
      const updated = [...current, metric];
      // Keep only the most recent metrics
      return updated.slice(-this.MAX_STORED_METRICS);
    });

    this.saveMetricsToStorage();
  }

  // Get resource type from URL
  private getResourceType(url: string): string {
    const extension = url.split(".").pop()?.toLowerCase();

    if (!extension) return "other";

    if (["js", "ts"].includes(extension)) return "script";
    if (["css", "scss", "sass"].includes(extension)) return "stylesheet";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension))
      return "image";
    if (["woff", "woff2", "ttf", "eot"].includes(extension)) return "font";
    if (["mp4", "webm", "ogg"].includes(extension)) return "video";
    if (["mp3", "wav", "ogg"].includes(extension)) return "audio";

    return "other";
  }

  // Public API methods
  trackCustomMetric(name: string, value: number, unit: string): void {
    const metric = this.createMetric(name, value, unit, "custom");
    this.addMetric(metric);
    this.analytics.trackPerformance(name, value, unit);
  }

  getMetricsByName(name: string): PerformanceMetric[] {
    return this._metrics().filter((metric) => metric.name === name);
  }

  getMetricsByRating(
    rating: "good" | "needs-improvement" | "poor",
  ): PerformanceMetric[] {
    return this._metrics().filter((metric) => metric.rating === rating);
  }

  getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  getPerformanceScore(): number {
    const vitals = this._webVitals();
    let score = 0;
    let count = 0;

    Object.values(vitals).forEach((metric) => {
      if (metric) {
        count++;
        switch (metric.rating) {
          case "good":
            score += 100;
            break;
          case "needs-improvement":
            score += 50;
            break;
          case "poor":
            score += 0;
            break;
        }
      }
    });

    return count > 0 ? Math.round(score / count) : 0;
  }

  generatePerformanceReport(): any {
    return {
      timestamp: new Date().toISOString(),
      score: this.getPerformanceScore(),
      webVitals: this._webVitals(),
      navigationTiming: this._navigationTiming(),
      resourceTimings: this._resourceTimings(),
      metrics: this._metrics(),
      summary: {
        totalMetrics: this._metrics().length,
        goodMetrics: this.getMetricsByRating("good").length,
        improvementMetrics: this.getMetricsByRating("needs-improvement").length,
        poorMetrics: this.getMetricsByRating("poor").length,
      },
    };
  }

  // Storage methods
  private saveMetricsToStorage(): void {
    try {
      const data = {
        metrics: this._metrics(),
        webVitals: this._webVitals(),
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(this.METRICS_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save performance metrics:", error);
    }
  }

  private loadStoredMetrics(): void {
    try {
      const stored = localStorage.getItem(this.METRICS_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this._metrics.set(data.metrics || []);
        this._webVitals.set(data.webVitals || {});
      }
    } catch (error) {
      console.warn("Failed to load stored performance metrics:", error);
    }
  }

  // Utility methods
  private isPerformanceSupported(): boolean {
    return !!(
      "performance" in window &&
      "getEntriesByType" in performance &&
      "PerformanceObserver" in window
    );
  }

  // Cleanup
  destroy(): void {
    this.observers.forEach((observer) => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn("Error disconnecting performance observer:", error);
      }
    });

    this.observers = [];
    this._isMonitoring.set(false);
  }

  // Get timing since page load
  getTimeSincePageLoad(): number {
    return Math.round(performance.now() - this.startTime);
  }

  // Check if page is slow loading
  isSlowPage(): boolean {
    const lcp = this._webVitals().lcp;
    const fcp = this._webVitals().fcp;

    return !!(lcp && lcp.rating === "poor") || !!(fcp && fcp.rating === "poor");
  }

  // Get recommendations based on performance
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const vitals = this._webVitals();

    if (vitals.lcp && vitals.lcp.rating === "poor") {
      recommendations.push(
        "Optimize Largest Contentful Paint by reducing image sizes and server response times",
      );
    }

    if (vitals.fid && vitals.fid.rating === "poor") {
      recommendations.push(
        "Reduce First Input Delay by minimizing JavaScript execution time",
      );
    }

    if (vitals.cls && vitals.cls.rating === "poor") {
      recommendations.push(
        "Minimize Cumulative Layout Shift by setting image dimensions and avoiding dynamic content",
      );
    }

    if (vitals.fcp && vitals.fcp.rating === "poor") {
      recommendations.push(
        "Improve First Contentful Paint by optimizing critical resources",
      );
    }

    return recommendations;
  }
}
