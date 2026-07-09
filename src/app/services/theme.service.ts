import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'portfolio-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isLight = signal(false);

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersLight = stored === 'light';
    this.apply(prefersLight);
  }

  toggle(): void {
    this.apply(!this.isLight());
  }

  private apply(light: boolean): void {
    this.isLight.set(light);
    document.body.classList.toggle('light-mode', light);
    localStorage.setItem(STORAGE_KEY, light ? 'light' : 'dark');
  }
}
