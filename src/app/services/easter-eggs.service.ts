import { Injectable, inject, signal } from '@angular/core';
import { ConfettiService } from './confetti.service';
import { ToastService } from './toast.service';

interface EasterEgg {
  id: string;
  name: string;
  hint: string;
  discovered: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EasterEggsService {
  private confetti = inject(ConfettiService);
  private toast = inject(ToastService);

  // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
  private readonly KONAMI_CODE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  private keySequence: string[] = [];
  private clickCount = 0;
  private clickTimer: ReturnType<typeof setTimeout> | null = null;

  private _retroMode = signal(false);
  private _matrixMode = signal(false);
  private _discoveredEggs = signal<Set<string>>(new Set());
  private _showEggTracker = signal(false);

  readonly retroMode = this._retroMode.asReadonly();
  readonly matrixMode = this._matrixMode.asReadonly();
  readonly showEggTracker = this._showEggTracker.asReadonly();

  private matrixInterval: ReturnType<typeof setInterval> | null = null;

  readonly eggs: EasterEgg[] = [
    { id: 'konami', name: 'Konami Code', hint: '↑↑↓↓←→←→BA', discovered: false },
    { id: 'triple-click', name: 'Triple Click Logo', hint: 'Click the logo 3 times fast', discovered: false },
    { id: 'retro', name: 'Retro Mode', hint: 'Type "retro" on the page', discovered: false },
    { id: 'matrix', name: 'Matrix Rain', hint: 'Type "matrix" on the page', discovered: false },
    { id: 'party', name: 'Party Mode', hint: 'Type "party" on the page', discovered: false },
  ];

  private wordBuffer = '';

  constructor() {
    this.loadDiscovered();
    this.setupListeners();
  }

  private setupListeners(): void {
    if (typeof window === 'undefined') return;

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      this.handleKonamiCode(e.key);
      this.handleWordTrigger(e.key);
    });
  }

  private handleKonamiCode(key: string): void {
    this.keySequence.push(key);

    // Keep only the last N keys
    if (this.keySequence.length > this.KONAMI_CODE.length) {
      this.keySequence.shift();
    }

    // Check match
    if (this.keySequence.length === this.KONAMI_CODE.length &&
        this.keySequence.every((k, i) => k === this.KONAMI_CODE[i])) {
      this.triggerKonami();
      this.keySequence = [];
    }
  }

  private handleWordTrigger(key: string): void {
    if (key.length === 1) {
      this.wordBuffer += key.toLowerCase();

      // Keep buffer short
      if (this.wordBuffer.length > 20) {
        this.wordBuffer = this.wordBuffer.slice(-10);
      }

      if (this.wordBuffer.endsWith('retro')) {
        this.triggerRetroMode();
        this.wordBuffer = '';
      } else if (this.wordBuffer.endsWith('matrix')) {
        this.triggerMatrixRain();
        this.wordBuffer = '';
      } else if (this.wordBuffer.endsWith('party')) {
        this.triggerPartyMode();
        this.wordBuffer = '';
      }
    }
  }

  handleLogoClick(): void {
    this.clickCount++;

    if (this.clickTimer) clearTimeout(this.clickTimer);

    this.clickTimer = setTimeout(() => {
      if (this.clickCount >= 3) {
        this.triggerTripleClick();
      }
      this.clickCount = 0;
    }, 500);
  }

  // === Easter Egg Triggers ===

  private triggerKonami(): void {
    this.discover('konami');
    this.confetti.celebrate({ duration: 5000, particleCount: 100 });

    this.toast.success(
      '🎮 Konami Code Activated!',
      'You found a secret! ↑↑↓↓←→←→BA',
      { duration: 5000 }
    );

    // Apply a brief rainbow effect
    document.documentElement.classList.add('konami-active');
    setTimeout(() => {
      document.documentElement.classList.remove('konami-active');
    }, 5000);
  }

  private triggerTripleClick(): void {
    this.discover('triple-click');
    this.confetti.celebrate({ duration: 3000, particleCount: 60 });

    this.toast.success(
      '🖱️ Secret Click!',
      'You discovered the triple-click easter egg!',
      { duration: 4000 }
    );
  }

  triggerRetroMode(): void {
    this.discover('retro');
    const isActive = this._retroMode();
    this._retroMode.set(!isActive);

    if (!isActive) {
      document.documentElement.classList.add('retro-mode');
      this.toast.success(
        '🕹️ Retro Mode ON!',
        'Welcome to the 90s! Type "retro" again to disable.',
        { duration: 4000 }
      );
    } else {
      document.documentElement.classList.remove('retro-mode');
      this.toast.info(
        '🕹️ Retro Mode OFF',
        'Back to the future!',
        { duration: 3000 }
      );
    }
  }

  triggerMatrixRain(): void {
    this.discover('matrix');
    const isActive = this._matrixMode();

    if (!isActive) {
      this._matrixMode.set(true);
      this.startMatrixRain();
      this.toast.success(
        '💊 The Matrix Has You',
        'Follow the white rabbit... Type "matrix" again to exit.',
        { duration: 4000 }
      );
    } else {
      this._matrixMode.set(false);
      this.stopMatrixRain();
      this.toast.info(
        '💊 Unplugged',
        'You took the blue pill.',
        { duration: 3000 }
      );
    }
  }

  private triggerPartyMode(): void {
    this.discover('party');
    this.confetti.celebrate({ duration: 6000, particleCount: 150 });

    // Pulsing color cycle on body
    document.documentElement.classList.add('party-mode');
    this.toast.success(
      '🎉 Party Mode!',
      'Let\'s goooo! 🥳🎊🎈',
      { duration: 5000 }
    );

    setTimeout(() => {
      document.documentElement.classList.remove('party-mode');
    }, 6000);
  }

  // === Matrix Rain ===

  private startMatrixRain(): void {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9998;
      pointer-events: none;
      opacity: 0.15;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 16);
    const drops: number[] = Array(columns).fill(1);
    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01234567890ABCDEF';

    this.matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = '14px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 16, drops[i] * 16);

        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 50);
  }

  private stopMatrixRain(): void {
    if (this.matrixInterval) {
      clearInterval(this.matrixInterval);
      this.matrixInterval = null;
    }
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) canvas.remove();
  }

  // === Discovery Tracking ===

  private discover(eggId: string): void {
    const current = new Set(this._discoveredEggs());
    if (current.has(eggId)) return;

    current.add(eggId);
    this._discoveredEggs.set(current);
    this.saveDiscovered();
  }

  isDiscovered(eggId: string): boolean {
    return this._discoveredEggs().has(eggId);
  }

  get discoveredCount(): number {
    return this._discoveredEggs().size;
  }

  get totalCount(): number {
    return this.eggs.length;
  }

  toggleTracker(): void {
    this._showEggTracker.set(!this._showEggTracker());
  }

  private loadDiscovered(): void {
    try {
      const stored = localStorage.getItem('easter-eggs-discovered');
      if (stored) {
        this._discoveredEggs.set(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }

  private saveDiscovered(): void {
    try {
      localStorage.setItem(
        'easter-eggs-discovered',
        JSON.stringify([...this._discoveredEggs()])
      );
    } catch {
      // ignore
    }
  }
}
