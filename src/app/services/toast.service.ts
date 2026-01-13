import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
  icon?: string;
  timestamp: Date;
}

export interface ToastConfig {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  defaultDuration?: number;
  maxToasts?: number;
  enableAnimations?: boolean;
  enableSound?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private config: ToastConfig = {
    position: 'top-right',
    defaultDuration: 4000,
    maxToasts: 5,
    enableAnimations: true,
    enableSound: false
  };

  private toastCounter = 0;

  constructor() {}

  // Configuration methods
  setConfig(config: Partial<ToastConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): ToastConfig {
    return { ...this.config };
  }

  // Main toast methods
  show(toast: Omit<Toast, 'id' | 'timestamp'>): string {
    const id = this.generateId();
    const newToast: Toast = {
      ...toast,
      id,
      timestamp: new Date(),
      duration: toast.duration ?? this.config.defaultDuration
    };

    this.addToast(newToast);
    this.scheduleRemoval(newToast);
    this.playSound(toast.type);

    return id;
  }

  // Convenience methods for different toast types
  success(title: string, message?: string, options?: Partial<Toast>): string {
    return this.show({
      type: 'success',
      title,
      message,
      icon: '✅',
      ...options
    });
  }

  error(title: string, message?: string, options?: Partial<Toast>): string {
    return this.show({
      type: 'error',
      title,
      message,
      icon: '❌',
      duration: 6000, // Errors stay longer
      ...options
    });
  }

  warning(title: string, message?: string, options?: Partial<Toast>): string {
    return this.show({
      type: 'warning',
      title,
      message,
      icon: '⚠️',
      ...options
    });
  }

  info(title: string, message?: string, options?: Partial<Toast>): string {
    return this.show({
      type: 'info',
      title,
      message,
      icon: 'ℹ️',
      ...options
    });
  }

  loading(title: string, message?: string, options?: Partial<Toast>): string {
    return this.show({
      type: 'loading',
      title,
      message,
      icon: '⏳',
      persistent: true, // Loading toasts don't auto-dismiss
      ...options
    });
  }

  // Advanced convenience methods
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
    }
  ): Promise<T> {
    const loadingId = this.loading(messages.loading, options?.loadingMessage);

    return promise
      .then((result) => {
        this.dismiss(loadingId);
        this.success(messages.success, options?.successMessage);
        return result;
      })
      .catch((error) => {
        this.dismiss(loadingId);
        this.error(messages.error, options?.errorMessage || error.message);
        throw error;
      });
  }

  // Action-based toasts
  withAction(
    title: string,
    message: string,
    actionLabel: string,
    actionHandler: () => void,
    type: Toast['type'] = 'info'
  ): string {
    return this.show({
      type,
      title,
      message,
      action: {
        label: actionLabel,
        handler: actionHandler
      },
      duration: 8000 // Action toasts stay longer
    });
  }

  // Specialized utility toasts
  copied(text: string = 'Content'): string {
    return this.success('Copied!', `${text} copied to clipboard`);
  }

  downloaded(filename: string): string {
    return this.success('Downloaded!', `${filename} has been downloaded`);
  }

  saved(item: string = 'Changes'): string {
    return this.success('Saved!', `${item} saved successfully`);
  }

  themeChanged(theme: string): string {
    const icon = theme === 'dark' ? '🌙' : '☀️';
    return this.success('Theme Updated', `Switched to ${theme} mode`, { icon });
  }

  formSubmitted(formName: string = 'Form'): string {
    return this.success('Submitted!', `${formName} submitted successfully`);
  }

  networkError(): string {
    return this.error(
      'Connection Error',
      'Please check your internet connection and try again',
      {
        action: {
          label: 'Retry',
          handler: () => window.location.reload()
        }
      }
    );
  }

  apiError(message: string = 'An error occurred'): string {
    return this.error('API Error', message);
  }

  // Management methods
  dismiss(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
  }

  dismissAll(): void {
    this.toastsSubject.next([]);
  }

  dismissByType(type: Toast['type']): void {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.type !== type);
    this.toastsSubject.next(filteredToasts);
  }

  update(id: string, updates: Partial<Toast>): void {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.map(toast =>
      toast.id === id ? { ...toast, ...updates } : toast
    );
    this.toastsSubject.next(updatedToasts);
  }

  // Utility methods
  getToastById(id: string): Toast | undefined {
    return this.toastsSubject.value.find(toast => toast.id === id);
  }

  getToastsByType(type: Toast['type']): Toast[] {
    return this.toastsSubject.value.filter(toast => toast.type === type);
  }

  hasToasts(): boolean {
    return this.toastsSubject.value.length > 0;
  }

  getToastCount(): number {
    return this.toastsSubject.value.length;
  }

  // Private methods
  private addToast(toast: Toast): void {
    const currentToasts = this.toastsSubject.value;

    // Remove oldest toasts if we exceed the limit
    const maxToasts = this.config.maxToasts || 5;
    let toasts = currentToasts.length >= maxToasts
      ? currentToasts.slice(-(maxToasts - 1))
      : currentToasts;

    toasts = [...toasts, toast];
    this.toastsSubject.next(toasts);
  }

  private scheduleRemoval(toast: Toast): void {
    if (toast.persistent) return;

    const duration = toast.duration || this.config.defaultDuration || 4000;

    setTimeout(() => {
      this.dismiss(toast.id);
    }, duration);
  }

  private generateId(): string {
    return `toast-${++this.toastCounter}-${Date.now()}`;
  }

  private playSound(type: Toast['type']): void {
    if (!this.config.enableSound) return;

    // Create audio context for different toast types
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different toast types
      const frequencies = {
        success: 800,
        error: 400,
        warning: 600,
        info: 500,
        loading: 450
      };

      oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if audio context is not supported
    }
  }

  // Batch operations
  showMultiple(toasts: Array<Omit<Toast, 'id' | 'timestamp'>>): string[] {
    return toasts.map(toast => this.show(toast));
  }

  // Analytics and debugging
  getToastStats(): {
    total: number;
    byType: Record<Toast['type'], number>;
    oldestTimestamp?: Date;
    newestTimestamp?: Date;
  } {
    const toasts = this.toastsSubject.value;
    const stats = {
      total: toasts.length,
      byType: {
        success: 0,
        error: 0,
        warning: 0,
        info: 0,
        loading: 0
      },
      oldestTimestamp: undefined as Date | undefined,
      newestTimestamp: undefined as Date | undefined
    };

    toasts.forEach(toast => {
      stats.byType[toast.type]++;

      if (!stats.oldestTimestamp || toast.timestamp < stats.oldestTimestamp) {
        stats.oldestTimestamp = toast.timestamp;
      }

      if (!stats.newestTimestamp || toast.timestamp > stats.newestTimestamp) {
        stats.newestTimestamp = toast.timestamp;
      }
    });

    return stats;
  }

  // Clear toasts older than specified time
  clearOlderThan(minutes: number): void {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    const currentToasts = this.toastsSubject.value;
    const recentToasts = currentToasts.filter(toast => toast.timestamp > cutoffTime);
    this.toastsSubject.next(recentToasts);
  }

  // Export/import for debugging
  exportToasts(): Toast[] {
    return [...this.toastsSubject.value];
  }

  importToasts(toasts: Toast[]): void {
    this.toastsSubject.next([...toasts]);
  }
}
