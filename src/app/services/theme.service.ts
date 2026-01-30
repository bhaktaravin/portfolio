import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'portfolio-theme';

  // Signal for reactive theme management
  private _theme = signal<Theme>('auto');
  private _isDarkMode = signal<boolean>(false);

  // Public readonly signals
  readonly theme = this._theme.asReadonly();
  readonly isDarkMode = this._isDarkMode.asReadonly();

  constructor() {
    // Load saved theme or default to 'auto'
    const savedTheme = this.loadThemeFromStorage();
    this._theme.set(savedTheme);

    // Set up effect to update DOM and localStorage when theme changes
    effect(() => {
      const currentTheme = this._theme();
      this.updateDOMTheme(currentTheme);
      this.saveThemeToStorage(currentTheme);
    });

    // Listen for system theme changes when in auto mode
    this.setupSystemThemeListener();

    // Initialize theme
    this.updateDarkModeState();
  }

  setTheme(theme: Theme): void {
    // Add smooth transition overlay
    this.createTransitionOverlay();
    
    this._theme.set(theme);
    this.updateDarkModeState();
  }

  toggleTheme(): void {
    const current = this._theme();
    if (current === 'light') {
      this.setTheme('dark');
    } else if (current === 'dark') {
      this.setTheme('auto');
    } else {
      this.setTheme('light');
    }
  }

  private updateDarkModeState(): void {
    const theme = this._theme();
    let isDark = false;

    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'auto') {
      isDark = this.getSystemPreference();
    }

    this._isDarkMode.set(isDark);
  }

  private updateDOMTheme(theme: Theme): void {
    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    root.classList.remove('light-theme', 'dark-theme');
    body.classList.remove('light-theme', 'dark-theme');

    // Determine effective theme
    let effectiveTheme: 'light' | 'dark';
    if (theme === 'auto') {
      effectiveTheme = this.getSystemPreference() ? 'dark' : 'light';
    } else {
      effectiveTheme = theme;
    }

    // Apply theme classes
    const themeClass = `${effectiveTheme}-theme`;
    root.classList.add(themeClass);
    body.classList.add(themeClass);

    // Set data attribute for CSS custom properties
    root.setAttribute('data-theme', effectiveTheme);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(effectiveTheme);
  }

  private updateMetaThemeColor(theme: 'light' | 'dark'): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = theme === 'dark' ? '#1a1a1a' : '#ffffff';

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }

  private getSystemPreference(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', () => {
      if (this._theme() === 'auto') {
        this.updateDarkModeState();
        this.updateDOMTheme('auto');
      }
    });
  }

  private loadThemeFromStorage(): Theme {
    try {
      const saved = localStorage.getItem(this.THEME_KEY);
      if (saved && ['light', 'dark', 'auto'].includes(saved)) {
        return saved as Theme;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    return 'auto';
  }

  private saveThemeToStorage(theme: Theme): void {
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  // Utility methods for components
  getThemeIcon(): string {
    const theme = this._theme();
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'auto': return '🌓';
      default: return '🌓';
    }
  }

  getThemeLabel(): string {
    const theme = this._theme();
    switch (theme) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'auto': return 'Auto Mode';
      default: return 'Auto Mode';
    }
  }

  // Animation utilities
  enableTransitions(): void {
    document.documentElement.style.setProperty('--theme-transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
  }

  disableTransitions(): void {
    document.documentElement.style.setProperty('--theme-transition', 'none');
  }

  private createTransitionOverlay(): void {
    // Check if overlay already exists
    if (document.querySelector('.theme-transition-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--color-background);
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(overlay);
    
    // Trigger animation
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      
      setTimeout(() => {
        overlay.style.opacity = '0';
        
        setTimeout(() => {
          overlay.remove();
        }, 300);
      }, 150);
    });
  }

  // Get suggested theme based on time of day
  getSuggestedThemeByTime(): 'light' | 'dark' {
    const hour = new Date().getHours();
    // Dark mode between 7 PM and 6 AM
    if (hour >= 19 || hour < 6) {
      return 'dark';
    }
    return 'light';
  }

  // Check if should enable reduced motion
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}

