import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-toggle-container">
      <button
        class="theme-toggle-btn"
        [attr.aria-label]="'Switch to ' + getNextThemeLabel()"
        [title]="'Current: ' + themeService.getThemeLabel() + '. Click to switch to ' + getNextThemeLabel()"
        (click)="toggleTheme()"
        type="button"
      >
        <span class="theme-icon" [innerHTML]="themeService.getThemeIcon()"></span>
        <span class="theme-label">{{ themeService.getThemeLabel() }}</span>

        <!-- Animated background -->
        <div class="theme-toggle-bg" [class.dark]="themeService.isDarkMode()"></div>

        <!-- Ripple effect -->
        <div class="ripple" [class.active]="isRippleActive"></div>
      </button>

      <!-- Dropdown for advanced options -->
      <div class="theme-options" [class.show]="showOptions">
        <button
          *ngFor="let option of themeOptions"
          class="theme-option"
          [class.active]="themeService.theme() === option.value"
          (click)="setTheme(option.value)"
          type="button"
        >
          <span class="option-icon" [innerHTML]="option.icon"></span>
          <span class="option-label">{{ option.label }}</span>
          <span class="option-check" *ngIf="themeService.theme() === option.value">✓</span>
        </button>
      </div>

      <!-- Toggle dropdown button -->
      <button
        class="options-toggle"
        [attr.aria-label]="showOptions ? 'Hide theme options' : 'Show theme options'"
        (click)="toggleOptions()"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3 6l5 5 5-5H3z"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .theme-toggle-container {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .theme-toggle-btn {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 2rem;
      color: var(--color-text-primary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      user-select: none;
      min-width: 120px;
      justify-content: center;
    }

    .theme-toggle-btn:hover {
      background: var(--color-surface-secondary);
      border-color: var(--color-border-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .theme-toggle-btn:focus {
      outline: none;
      ring: 2px solid var(--color-primary-500);
      ring-offset: 2px;
    }

    .theme-toggle-btn:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .theme-icon {
      font-size: 1.125rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }

    .theme-toggle-btn:hover .theme-icon {
      transform: rotate(15deg) scale(1.1);
    }

    .theme-label {
      font-weight: 500;
      letter-spacing: 0.025em;
    }

    .theme-toggle-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.1) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: inherit;
    }

    .theme-toggle-bg.dark {
      background: linear-gradient(45deg, transparent 0%, rgba(139, 92, 246, 0.1) 100%);
    }

    .theme-toggle-btn:hover .theme-toggle-bg {
      opacity: 1;
    }

    .ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(59, 130, 246, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.4s ease, height 0.4s ease, opacity 0.4s ease;
      opacity: 0;
      pointer-events: none;
    }

    .ripple.active {
      width: 100px;
      height: 100px;
      opacity: 1;
    }

    .theme-options {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      right: 0;
      background: var(--color-card-bg);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: var(--z-dropdown);
      overflow: hidden;
    }

    .theme-options.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .theme-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: transparent;
      border: none;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .theme-option:hover {
      background: var(--color-surface);
      color: var(--color-text-primary);
    }

    .theme-option.active {
      background: var(--color-primary-50);
      color: var(--color-primary-700);
    }

    [data-theme="dark"] .theme-option.active {
      background: rgba(59, 130, 246, 0.1);
      color: var(--color-primary-300);
    }

    .option-icon {
      font-size: 1rem;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .option-label {
      flex: 1;
      font-weight: 500;
    }

    .option-check {
      color: var(--color-success);
      font-weight: bold;
      font-size: 0.875rem;
    }

    .options-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 50%;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .options-toggle:hover {
      background: var(--color-surface-secondary);
      color: var(--color-text-primary);
      border-color: var(--color-border-hover);
    }

    .options-toggle:focus {
      outline: none;
      ring: 2px solid var(--color-primary-500);
      ring-offset: 1px;
    }

    .options-toggle svg {
      transition: transform 0.2s ease;
    }

    .show + .options-toggle svg {
      transform: rotate(180deg);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .theme-toggle-btn {
        min-width: auto;
        padding: 0.5rem;
      }

      .theme-label {
        display: none;
      }

      .theme-options {
        left: auto;
        right: 0;
        min-width: 160px;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .theme-toggle-btn,
      .theme-icon,
      .theme-toggle-bg,
      .ripple,
      .theme-options,
      .options-toggle svg {
        transition: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .theme-toggle-btn {
        border-width: 2px;
        border-color: var(--color-text-primary);
      }

      .theme-option.active {
        background: var(--color-text-primary);
        color: var(--color-background);
      }
    }
  `]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);

  showOptions = false;
  isRippleActive = false;

  themeOptions = [
    { value: 'light' as const, label: 'Light Mode', icon: '☀️' },
    { value: 'dark' as const, label: 'Dark Mode', icon: '🌙' },
    { value: 'auto' as const, label: 'Auto Mode', icon: '🌓' }
  ];

  toggleTheme(): void {
    this.createRippleEffect();
    this.themeService.toggleTheme();

    // Close options dropdown if open
    this.showOptions = false;
  }

  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.themeService.setTheme(theme);
    this.showOptions = false;
  }

  toggleOptions(): void {
    this.showOptions = !this.showOptions;
  }

  getNextThemeLabel(): string {
    const current = this.themeService.theme();
    switch (current) {
      case 'light': return 'Dark Mode';
      case 'dark': return 'Auto Mode';
      case 'auto': return 'Light Mode';
      default: return 'Light Mode';
    }
  }

  private createRippleEffect(): void {
    this.isRippleActive = true;
    setTimeout(() => {
      this.isRippleActive = false;
    }, 400);
  }

  // Close options when clicking outside
  onDocumentClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const container = target.closest('.theme-toggle-container');

    if (!container && this.showOptions) {
      this.showOptions = false;
    }
  };

  ngOnInit(): void {
    document.addEventListener('click', this.onDocumentClick);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick);
  }
}
