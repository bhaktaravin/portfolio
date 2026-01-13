import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
  keyframes,
} from "@angular/animations";
import { Subscription } from "rxjs";
import { ToastService, Toast } from "../../../services/toast.service";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" [attr.data-position]="config.position">
      <div
        *ngFor="let toast of toasts; trackBy: trackByToast"
        class="toast"
        [class]="'toast-' + toast.type"
        [attr.data-id]="toast.id"
        [@toastAnimation]
        (click)="onToastClick(toast)"
        (mouseenter)="pauseTimer(toast.id)"
        (mouseleave)="resumeTimer(toast.id)"
        role="alert"
        [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'"
        [attr.aria-label]="getAriaLabel(toast)"
      >
        <!-- Progress bar for timed toasts -->
        <div
          *ngIf="!toast.persistent && toast.duration"
          class="toast-progress"
          [style.animation-duration.ms]="toast.duration"
          [style.animation-play-state]="
            isPaused(toast.id) ? 'paused' : 'running'
          "
        ></div>

        <!-- Toast content -->
        <div class="toast-content">
          <!-- Icon -->
          <div class="toast-icon">
            <span
              *ngIf="toast.type === 'loading'"
              class="loading-spinner"
            ></span>
            <span *ngIf="toast.type !== 'loading'" class="toast-emoji">
              {{ toast.icon }}
            </span>
          </div>

          <!-- Text content -->
          <div class="toast-text">
            <div class="toast-title">{{ toast.title }}</div>
            <div *ngIf="toast.message" class="toast-message">
              {{ toast.message }}
            </div>
          </div>

          <!-- Action button -->
          <button
            *ngIf="toast.action"
            class="toast-action"
            (click)="executeAction(toast, $event)"
            [attr.aria-label]="toast.action.label"
          >
            {{ toast.action.label }}
          </button>

          <!-- Close button -->
          <button
            class="toast-close"
            (click)="dismissToast(toast.id, $event)"
            aria-label="Close notification"
            type="button"
          >
            <span class="close-icon">×</span>
          </button>
        </div>

        <!-- Toast timestamp (for debugging) -->
        <div class="toast-timestamp" *ngIf="showDebugInfo">
          {{ getRelativeTime(toast.timestamp) }}
        </div>
      </div>

      <!-- Toast counter (when many toasts) -->
      <div *ngIf="toasts.length > 3" class="toast-counter" [@fadeInOut]>
        <span class="counter-text"> {{ toasts.length }} notifications </span>
        <button
          class="counter-action"
          (click)="dismissAll()"
          aria-label="Dismiss all notifications"
        >
          Clear All
        </button>
      </div>
    </div>

    <!-- Global toast controls (for debugging) -->
    <div class="toast-debug-controls" *ngIf="showDebugControls">
      <button (click)="testToasts()">Test Toasts</button>
      <button (click)="dismissAll()">Clear All</button>
      <button (click)="toggleDebugInfo()">Debug Info</button>
    </div>
  `,
  styleUrls: ["./toast.component.css"],
  animations: [
    trigger("toastAnimation", [
      transition(":enter", [
        style({
          opacity: 0,
          transform: "translateX(100%) scale(0.8)",
          maxHeight: "0px",
          marginBottom: "0px",
        }),
        animate(
          "400ms cubic-bezier(0.4, 0, 0.2, 1)",
          keyframes([
            style({
              opacity: 0,
              transform: "translateX(100%) scale(0.8)",
              maxHeight: "0px",
              marginBottom: "0px",
              offset: 0,
            }),
            style({
              opacity: 1,
              transform: "translateX(0%) scale(1.05)",
              maxHeight: "200px",
              marginBottom: "12px",
              offset: 0.7,
            }),
            style({
              opacity: 1,
              transform: "translateX(0%) scale(1)",
              maxHeight: "200px",
              marginBottom: "12px",
              offset: 1,
            }),
          ]),
        ),
      ]),
      transition(":leave", [
        animate(
          "300ms cubic-bezier(0.4, 0, 1, 1)",
          keyframes([
            style({
              opacity: 1,
              transform: "translateX(0%) scale(1)",
              maxHeight: "200px",
              marginBottom: "12px",
              offset: 0,
            }),
            style({
              opacity: 1,
              transform: "translateX(50%) scale(0.9)",
              maxHeight: "200px",
              marginBottom: "12px",
              offset: 0.3,
            }),
            style({
              opacity: 0,
              transform: "translateX(100%) scale(0.8)",
              maxHeight: "0px",
              marginBottom: "0px",
              offset: 1,
            }),
          ]),
        ),
      ]),
    ]),
    trigger("fadeInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate(
          "200ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" }),
        ),
      ]),
      transition(":leave", [
        animate(
          "200ms ease-in",
          style({ opacity: 0, transform: "translateY(-10px)" }),
        ),
      ]),
    ]),
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  config = this.toastService.getConfig();
  showDebugInfo = false;
  showDebugControls = true; // Set to true for development

  private subscription?: Subscription;
  private pausedTimers = new Set<string>();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  trackByToast(index: number, toast: Toast): string {
    return toast.id;
  }

  onToastClick(toast: Toast) {
    // If it's a loading toast, don't dismiss on click
    if (toast.type === "loading") return;

    // If there's an action, execute it instead of dismissing
    if (toast.action) {
      this.executeAction(toast);
      return;
    }

    // Otherwise dismiss the toast
    this.dismissToast(toast.id);
  }

  dismissToast(id: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.toastService.dismiss(id);
  }

  dismissAll() {
    this.toastService.dismissAll();
  }

  executeAction(toast: Toast, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (toast.action) {
      toast.action.handler();
      // Optionally dismiss the toast after action execution
      this.dismissToast(toast.id);
    }
  }

  pauseTimer(toastId: string) {
    this.pausedTimers.add(toastId);
  }

  resumeTimer(toastId: string) {
    this.pausedTimers.delete(toastId);
  }

  isPaused(toastId: string): boolean {
    return this.pausedTimers.has(toastId);
  }

  getAriaLabel(toast: Toast): string {
    let label = `${toast.type} notification: ${toast.title}`;
    if (toast.message) {
      label += `. ${toast.message}`;
    }
    if (toast.action) {
      label += `. ${toast.action.label} available.`;
    }
    return label;
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);

    if (diffSec < 10) return "just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    return timestamp.toLocaleTimeString();
  }

  toggleDebugInfo() {
    this.showDebugInfo = !this.showDebugInfo;
  }

  // Development testing methods
  testToasts() {
    this.toastService.success("Success!", "This is a success message");

    setTimeout(() => {
      this.toastService.error("Error occurred", "Something went wrong here");
    }, 500);

    setTimeout(() => {
      this.toastService.warning("Warning", "This is a warning message");
    }, 1000);

    setTimeout(() => {
      this.toastService.info("Information", "Here is some useful information");
    }, 1500);

    setTimeout(() => {
      this.toastService.loading(
        "Processing",
        "Please wait while we process your request",
      );
    }, 2000);

    setTimeout(() => {
      this.toastService.withAction(
        "Action Required",
        "Click the button to perform an action",
        "Do It",
        () => {
          this.toastService.success(
            "Action completed!",
            "The action was performed successfully",
          );
        },
      );
    }, 2500);
  }
}
