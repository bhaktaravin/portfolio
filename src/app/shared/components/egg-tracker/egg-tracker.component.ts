import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasterEggsService } from '../../../services/easter-eggs.service';

@Component({
  selector: 'app-egg-tracker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Floating Egg Counter -->
    <button
      class="egg-fab"
      (click)="easterEggs.toggleTracker()"
      [attr.aria-label]="'Easter eggs found: ' + easterEggs.discoveredCount + ' of ' + easterEggs.totalCount"
    >
      🥚
      <span class="egg-count" *ngIf="easterEggs.discoveredCount > 0">
        {{ easterEggs.discoveredCount }}/{{ easterEggs.totalCount }}
      </span>
    </button>

    <!-- Tracker Panel -->
    <div class="egg-panel" *ngIf="easterEggs.showEggTracker()" (click)="$event.stopPropagation()">
      <div class="panel-header">
        <h3>🥚 Easter Eggs</h3>
        <span class="panel-progress">{{ easterEggs.discoveredCount }}/{{ easterEggs.totalCount }} found</span>
      </div>
      <div class="panel-progress-bar">
        <div class="progress-fill"
          [style.width.%]="(easterEggs.discoveredCount / easterEggs.totalCount) * 100"></div>
      </div>
      <ul class="egg-list">
        <li *ngFor="let egg of easterEggs.eggs" [class.discovered]="easterEggs.isDiscovered(egg.id)">
          <span class="egg-icon">{{ easterEggs.isDiscovered(egg.id) ? '✅' : '🔒' }}</span>
          <div class="egg-info">
            <span class="egg-name">{{ easterEggs.isDiscovered(egg.id) ? egg.name : '???' }}</span>
            <span class="egg-hint">{{ easterEggs.isDiscovered(egg.id) ? egg.hint : 'Keep exploring...' }}</span>
          </div>
        </li>
      </ul>
      <p class="panel-tip" *ngIf="easterEggs.discoveredCount < easterEggs.totalCount">
        💡 Try typing secret words or pressing special key combos!
      </p>
      <p class="panel-tip all-found" *ngIf="easterEggs.discoveredCount === easterEggs.totalCount">
        🎉 You found them all! You're a true explorer!
      </p>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      bottom: 5rem;
      left: 1.5rem;
      z-index: 1000;
    }

    .egg-fab {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid var(--border-color, #e5e7eb);
      background: var(--bg-primary, #fff);
      font-size: 1.3rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .egg-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .egg-count {
      position: absolute;
      top: -6px;
      right: -6px;
      background: var(--color-primary-500, #6366f1);
      color: white;
      font-size: 0.6rem;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }

    .egg-panel {
      position: absolute;
      bottom: 60px;
      left: 0;
      width: 300px;
      background: var(--bg-primary, #fff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      padding: 1.25rem;
      animation: slideUp 0.2s ease;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .panel-header h3 {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary);
    }

    .panel-progress {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 600;
    }

    .panel-progress-bar {
      height: 4px;
      background: var(--hover-color, #f3f4f6);
      border-radius: 4px;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--color-primary-500, #6366f1);
      border-radius: 4px;
      transition: width 0.4s ease;
    }

    .egg-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .egg-list li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      border-radius: 10px;
      background: var(--hover-color, #f3f4f6);
      transition: background 0.2s;
    }

    .egg-list li.discovered {
      background: rgba(16, 185, 129, 0.1);
    }

    .egg-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .egg-info {
      display: flex;
      flex-direction: column;
    }

    .egg-name {
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--text-primary);
    }

    .egg-hint {
      font-size: 0.72rem;
      color: var(--text-secondary);
    }

    .panel-tip {
      margin: 0.75rem 0 0;
      font-size: 0.78rem;
      color: var(--text-secondary);
      text-align: center;
    }

    .panel-tip.all-found {
      color: var(--color-primary-500, #6366f1);
      font-weight: 600;
    }
  `]
})
export class EggTrackerComponent {
  easterEggs = inject(EasterEggsService);
}
