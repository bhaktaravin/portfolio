import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1 class="error-title">Page Not Found</h1>
        <p class="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="error-actions">
          <button class="btn btn-primary" (click)="goHome()">
            <span class="btn-icon">🏠</span>
            <span class="btn-text">Back to Home</span>
          </button>
          <button class="btn btn-outline" (click)="goBack()">
            <span class="btn-icon">⬅️</span>
            <span class="btn-text">Go Back</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-background);
      padding: 2rem;
    }

    .not-found-content {
      max-width: 600px;
      text-align: center;
      animation: fadeInUp 0.6s ease-out;
    }

    .error-code {
      font-size: 8rem;
      font-weight: 900;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 1rem;
    }

    .error-title {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: 1rem;
    }

    .error-message {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
      margin-bottom: 2rem;
      line-height: var(--line-height-relaxed);
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      border-radius: var(--border-radius-lg);
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
      font-size: var(--font-size-base);
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .btn-outline {
      background: transparent;
      color: var(--color-primary-600);
      border: 2px solid var(--color-primary-600);
    }

    .btn-outline:hover {
      background: var(--color-primary-50);
      color: var(--color-primary-700);
    }

    [data-theme="dark"] .btn-outline:hover {
      background: rgba(59, 130, 246, 0.1);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .error-code {
        font-size: 5rem;
      }

      .error-title {
        font-size: var(--font-size-3xl);
      }

      .error-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .error-code {
        font-size: 4rem;
      }

      .not-found-container {
        padding: 1rem;
      }
    }
  `]
})
export class NotFoundComponent {
  goHome(): void {
    window.location.href = '/';
  }

  goBack(): void {
    window.history.back();
  }
}
