import { Component, inject, OnInit, OnDestroy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { Subscription } from "rxjs";

import { ThemeToggleComponent } from "./theme-toggle.component";
import { AnalyticsService } from "../services/analytics.service";
import { ToastService } from "../services/toast.service";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  analyticsLabel?: string;
}

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  template: `
    <nav
      class="navbar"
      [class.scrolled]="isScrolled()"
      [class.mobile-open]="isMobileMenuOpen()"
    >
      <div class="navbar-container container">
        <!-- Brand/Logo -->
        <a
          href="#hero"
          class="navbar-brand"
          (click)="scrollToSection('hero', $event)"
          [attr.aria-label]="brandLabel"
        >
          <div class="brand-content">
            <div class="brand-avatar">
              <span class="brand-initials">{{ initials }}</span>
              <div class="brand-glow"></div>
            </div>
            <span class="brand-text">{{ brandName }}</span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <div class="navbar-nav desktop-only">
          <ul class="nav-links" role="menubar">
            <li
              *ngFor="let item of navItems; trackBy: trackNavItem"
              class="nav-item"
              role="none"
            >
              <a
                [href]="item.href"
                class="nav-link"
                [class.active]="activeSection() === item.id"
                [attr.aria-label]="item.label"
                [attr.target]="item.external ? '_blank' : null"
                [attr.rel]="item.external ? 'noopener noreferrer' : null"
                (click)="handleNavClick(item, $event)"
                role="menuitem"
              >
                <span
                  class="nav-icon"
                  *ngIf="item.icon"
                  [innerHTML]="item.icon"
                ></span>
                <span class="nav-label">{{ item.label }}</span>
                <span class="nav-indicator"></span>
              </a>
            </li>
          </ul>

          <!-- CTA Buttons -->
          <div class="nav-actions">
            <!-- Command Palette Hint -->
            <div class="command-hint">
              <kbd class="command-key">⌘</kbd>
              <kbd class="command-key">K</kbd>
            </div>

            <a
              href="#contact"
              class="btn btn-outline btn-sm"
              (click)="scrollToSection('contact', $event)"
              [attr.aria-label]="'Contact ' + brandName"
            >
              <span class="btn-icon">📧</span>
              <span class="btn-text">Contact</span>
            </a>

            <button
              class="btn btn-primary btn-sm"
              (click)="downloadResume()"
              [attr.aria-label]="'Download ' + brandName + ' resume'"
            >
              <span class="btn-icon">📄</span>
              <span class="btn-text">Resume</span>
            </button>
          </div>

          <!-- Theme Toggle -->
          <app-theme-toggle></app-theme-toggle>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="mobile-controls mobile-only">
          <app-theme-toggle></app-theme-toggle>

          <button
            class="mobile-menu-toggle"
            [class.active]="isMobileMenuOpen()"
            (click)="toggleMobileMenu()"
            [attr.aria-label]="isMobileMenuOpen() ? 'Close menu' : 'Open menu'"
            [attr.aria-expanded]="isMobileMenuOpen()"
            type="button"
          >
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div
          class="mobile-menu"
          [class.open]="isMobileMenuOpen()"
          [attr.aria-hidden]="!isMobileMenuOpen()"
        >
          <div class="mobile-menu-content">
            <ul class="mobile-nav-links" role="menu">
              <li
                *ngFor="let item of navItems; trackBy: trackNavItem"
                class="mobile-nav-item"
                role="none"
              >
                <a
                  [href]="item.href"
                  class="mobile-nav-link"
                  [class.active]="activeSection() === item.id"
                  [attr.target]="item.external ? '_blank' : null"
                  [attr.rel]="item.external ? 'noopener noreferrer' : null"
                  (click)="handleNavClick(item, $event)"
                  role="menuitem"
                >
                  <span
                    class="mobile-nav-icon"
                    *ngIf="item.icon"
                    [innerHTML]="item.icon"
                  ></span>
                  <span class="mobile-nav-label">{{ item.label }}</span>
                </a>
              </li>
            </ul>

            <div class="mobile-nav-actions">
              <a
                href="#contact"
                class="btn btn-outline"
                (click)="scrollToSection('contact', $event)"
              >
                <span class="btn-icon">📧</span>
                <span class="btn-text">Contact Me</span>
              </a>

              <button class="btn btn-primary" (click)="downloadResume()">
                <span class="btn-icon">📄</span>
                <span class="btn-text">Download Resume</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Backdrop -->
        <div
          class="mobile-menu-backdrop"
          [class.active]="isMobileMenuOpen()"
          (click)="closeMobileMenu()"
          [attr.aria-hidden]="true"
        ></div>
      </div>

      <!-- Scroll Progress Indicator -->
      <div class="scroll-progress" [style.width.%]="scrollProgress()"></div>
    </nav>
  `,
  styleUrls: [],
  styles: [
    `
      /* Clean navbar styles */
      .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: var(--z-fixed, 1030);
        background: transparent; /* Start transparent */
        backdrop-filter: none; /* No blur initially for clean hero look */
        -webkit-backdrop-filter: none;
        border-bottom: 1px solid transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        min-height: 70px;
      }

      .navbar.scrolled {
        background: var(--color-navbar-bg, rgba(255, 255, 255, 0.9));
        backdrop-filter: var(--color-navbar-backdrop, blur(10px));
        -webkit-backdrop-filter: var(--color-navbar-backdrop, blur(10px));
        border-bottom: 1px solid var(--color-border, #e5e7eb);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      [data-theme="dark"] .navbar.scrolled {
        background: var(--color-navbar-bg, rgba(15, 23, 42, 0.9));
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      }

      .navbar-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem var(--container-padding, 2rem);
        max-width: var(--container-max-width, 1200px);
        margin: 0 auto;
        width: 100%;
        height: 70px;
      }

      /* Brand/Logo */
      .navbar-brand {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--color-text-primary, #1f2937);
        font-weight: 700;
        font-size: 1.25rem;
        transition: all 0.2s ease;
        z-index: 10;
      }

      .navbar-brand:hover {
        color: var(--color-primary-600, #2563eb);
        transform: translateY(-1px);
      }

      .brand-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .brand-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #2563eb 0%, #0284c7 100%);
        border-radius: 50%;
        color: white;
        font-weight: 700;
        font-size: 1rem;
        position: relative;
      }

      .brand-initials {
        z-index: 2;
        position: relative;
      }

      .brand-text {
        font-weight: 700;
        letter-spacing: -0.025em;
      }

      /* Desktop Navigation */
      /* Desktop Navigation */
      .navbar-nav {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      /* Utility Classes */
      .desktop-only {
        display: flex;
      }

      .mobile-only {
        display: none;
      }

      @media (max-width: 768px) {
        .desktop-only {
          display: none !important;
        }
        .mobile-only {
          display: flex !important;
        }
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-item {
        position: relative;
      }

      .nav-link {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        color: var(--color-text-secondary, #6b7280);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.875rem;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .nav-link:hover,
      .nav-link.active {
        color: var(--color-primary-600, #2563eb);
        background: var(--color-primary-50, rgba(59, 130, 246, 0.1));
        text-decoration: none;
      }

      [data-theme="dark"] .nav-link:hover,
      [data-theme="dark"] .nav-link.active {
        background: rgba(59, 130, 246, 0.15);
        color: var(--color-primary-400, #60a5fa);
      }

      .nav-icon {
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nav-indicator {
        position: absolute;
        bottom: -2px;
        left: 50%;
        width: 0;
        height: 2px;
        background: var(--color-primary-600);
        border-radius: 1px;
        transform: translateX(-50%);
        transition: width 0.3s ease;
      }

      .nav-link.active .nav-indicator {
        width: 80%;
      }

      /* Navigation Actions */
      .nav-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-shrink: 0;
      }

      /* Command Palette Hint */
      .command-hint {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-right: 0.5rem;
        opacity: 0.6;
        transition: opacity 0.3s ease;
      }

      .command-hint:hover {
        opacity: 1;
      }

      .command-key {
        background: var(--color-surface, #f8fafc);
        color: var(--color-text-secondary, #6b7280);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        font-family: var(--font-family-mono, monospace);
        border: 1px solid var(--color-border, #e5e7eb);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        min-width: 20px;
        text-align: center;
      }

      [data-theme="dark"] .command-key {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.7);
      }

      .btn-icon {
        font-size: 0.875rem;
      }

      /* Mobile Controls */
      .mobile-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .mobile-menu-toggle {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
      }

      .hamburger-line {
        width: 24px;
        height: 2px;
        background: var(--color-text-primary);
        border-radius: 2px;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        transform-origin: center;
      }

      .hamburger-line:nth-child(1) {
        margin-bottom: 4px;
      }

      .hamburger-line:nth-child(2) {
        margin-bottom: 4px;
      }

      .mobile-menu-toggle.active .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      .mobile-menu-toggle.active .hamburger-line:nth-child(2) {
        opacity: 0;
        transform: scale(0);
      }

      .mobile-menu-toggle.active .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }

      /* Mobile Menu */
      .mobile-menu {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--color-card-bg);
        transform: translateY(-100%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: var(--z-modal);
        border-top: 1px solid var(--color-border);
      }

      .mobile-menu.open {
        transform: translateY(0);
      }

      .mobile-menu-content {
        padding: 2rem;
        height: 100%;
        overflow-y: auto;
      }

      .mobile-nav-links {
        list-style: none;
        margin: 0 0 2rem 0;
        padding: 0;
      }

      .mobile-nav-item {
        margin-bottom: 0.5rem;
      }

      .mobile-nav-link {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        color: var(--color-text-secondary);
        text-decoration: none;
        font-weight: 500;
        font-size: 1.125rem;
        border-radius: 0.75rem;
        transition: all 0.3s ease;
      }

      .mobile-nav-link:hover,
      .mobile-nav-link.active {
        color: var(--color-primary-600);
        background: var(--color-primary-50);
        text-decoration: none;
      }

      [data-theme="dark"] .mobile-nav-link:hover,
      [data-theme="dark"] .mobile-nav-link.active {
        background: rgba(59, 130, 246, 0.1);
      }

      .mobile-nav-icon {
        font-size: 1.25rem;
        width: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mobile-nav-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: auto;
        padding-top: 2rem;
        border-top: 1px solid var(--color-border);
      }

      .mobile-menu-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: var(--z-modal-backdrop);
      }

      .mobile-menu-backdrop.active {
        opacity: 1;
        visibility: visible;
      }

      /* Scroll Progress */
      .scroll-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background: var(--gradient-primary);
        transition: width 0.1s ease;
      }

      /* Button Styles */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        font-weight: 500;
        text-decoration: none;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
        border: none;
        cursor: pointer;
        white-space: nowrap;
      }

      .btn-sm {
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
      }

      .btn-primary {
        background: var(--color-primary-600, #2563eb);
        color: white;
      }

      .btn-primary:hover {
        background: var(--color-primary-700, #1d4ed8);
        transform: translateY(-1px);
      }

      .btn-outline {
        background: transparent;
        color: var(--color-primary-600, #2563eb);
        border: 1px solid var(--color-primary-600, #2563eb);
      }

      .btn-outline:hover {
        background: var(--color-primary-600, #2563eb);
        color: white;
        text-decoration: none;
      }

      [data-theme="dark"] .btn-primary {
        background: var(--color-primary-500, #3b82f6);
      }

      [data-theme="dark"] .btn-primary:hover {
        background: var(--color-primary-400, #60a5fa);
      }

      [data-theme="dark"] .btn-outline {
        color: var(--color-primary-400, #60a5fa);
        border-color: var(--color-primary-400, #60a5fa);
      }

      [data-theme="dark"] .btn-outline:hover {
        background: var(--color-primary-400, #60a5fa);
        color: var(--color-surface, #1e293b);
      }

      @media (max-width: 768px) {
        .desktop-only {
          display: none;
        }

        .mobile-only {
          display: flex;
        }

        .navbar-container {
          padding: 0.75rem 1rem;
          min-height: 60px;
        }

        .mobile-menu {
          top: 60px;
        }

        .brand-text {
          display: none;
        }
      }

      /* Accessibility */
      @media (prefers-reduced-motion: reduce) {
        .navbar,
        .nav-link,
        .mobile-menu,
        .hamburger-line,
        .scroll-progress {
          transition: none;
        }
      }

      /* Focus styles */
      .nav-link:focus,
      .mobile-nav-link:focus,
      .mobile-menu-toggle:focus {
        outline: 2px solid var(--color-primary-500);
        outline-offset: 2px;
        border-radius: 0.25rem;
      }
    `,
  ],
})
export class NavigationComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private analytics = inject(AnalyticsService);
  private toastService = inject(ToastService);

  // Signals for reactive state
  private _isScrolled = signal(false);
  private _isMobileMenuOpen = signal(false);
  private _activeSection = signal("hero");
  private _scrollProgress = signal(0);

  // Public readonly signals
  readonly isScrolled = this._isScrolled.asReadonly();
  readonly isMobileMenuOpen = this._isMobileMenuOpen.asReadonly();
  readonly activeSection = this._activeSection.asReadonly();
  readonly scrollProgress = this._scrollProgress.asReadonly();

  private routerSubscription?: Subscription;
  private scrollListenerAdded = false;

  // Brand information
  brandName = "Ravin Bhakta";
  brandLabel = "Ravin Bhakta - Full-Stack Engineer Portfolio";
  initials = "RB";

  // Navigation items
  navItems: NavItem[] = [
    {
      id: "hero",
      label: "Home",
      href: "#hero",
      icon: "🏠",
      analyticsLabel: "home",
    },
    {
      id: "about",
      label: "About",
      href: "#about",
      icon: "👨‍💻",
      analyticsLabel: "about",
    },
    {
      id: "experience",
      label: "Experience",
      href: "#experience",
      icon: "💼",
      analyticsLabel: "experience",
    },
    {
      id: "skills",
      label: "Skills",
      href: "#skills",
      icon: "🛠️",
      analyticsLabel: "skills",
    },
    {
      id: "projects",
      label: "Projects",
      href: "#projects",
      icon: "🚀",
      analyticsLabel: "projects",
    },
    {
      id: "blog",
      label: "Blog",
      href: "#blog",
      icon: "📝",
      analyticsLabel: "blog",
    },
    {
      id: "education",
      label: "Education",
      href: "#education",
      icon: "🎓",
      analyticsLabel: "education",
    },
  ];

  ngOnInit(): void {
    this.setupScrollListener();
    this.setupRouterListener();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.removeScrollListener();
  }

  private setupScrollListener(): void {
    if (this.scrollListenerAdded) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      // Update scroll state
      this._isScrolled.set(scrollY > 50);

      // Update scroll progress
      const progress = (scrollY / documentHeight) * 100;
      this._scrollProgress.set(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    this.scrollListenerAdded = true;
  }

  private removeScrollListener(): void {
    // Note: In a real app, you'd want to store the handler reference to remove it properly
    // For now, we'll rely on component destruction
  }

  private setupRouterListener(): void {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Close mobile menu on navigation
        this._isMobileMenuOpen.set(false);
      });
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this._activeSection.set(sectionId);
        }
      });
    }, options);

    // Observe sections after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.navItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section) {
          observer.observe(section);
        }
      });
    }, 100);
  }

  handleNavClick(item: NavItem, event: Event): void {
    // Track analytics
    this.analytics.trackClick(
      `nav_${item.analyticsLabel || item.id}`,
      "navigation",
    );

    if (!item.external) {
      event.preventDefault();
      this.scrollToSection(item.id);
    }

    // Close mobile menu
    this._isMobileMenuOpen.set(false);
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      // Track analytics
      this.analytics.trackClick(`scroll_to_${sectionId}`, "navigation");
    }

    // Close mobile menu
    this._isMobileMenuOpen.set(false);
  }

  toggleMobileMenu(): void {
    const isOpen = !this._isMobileMenuOpen();
    this._isMobileMenuOpen.set(isOpen);

    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Track analytics
    this.analytics.trackClick(
      `mobile_menu_${isOpen ? "open" : "close"}`,
      "navigation",
    );
  }

  closeMobileMenu(): void {
    this._isMobileMenuOpen.set(false);
    document.body.style.overflow = "";
  }

  downloadResume(): void {
    // Track analytics
    this.analytics.trackDownload("Ravin_Bhakta_Resume.pdf", "pdf");

    // Create download link
    const link = document.createElement("a");
    link.href = "assets/resume.pdf";
    link.download = "Ravin_Bhakta_Resume.pdf";
    link.click();

    // Show success toast
    this.toastService.success(
      "Download Started",
      "Your resume is being downloaded",
      { duration: 3000 },
    );

    // Close mobile menu
    this._isMobileMenuOpen.set(false);
  }

  trackNavItem(index: number, item: NavItem): string {
    return item.id;
  }
}
