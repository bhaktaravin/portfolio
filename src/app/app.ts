import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import {
  PROFILE,
  SOCIAL_LINKS,
  PRIMARY_NAV,
  MORE_NAV,
  FOOTER_NAV,
} from './data/portfolio.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);

  activeSection = 'home';
  showBackToTop = false;
  menuOpen = false;
  scrollProgress = 0;
  showResumeDropdown = false;
  showMoreMenu = false;
  isHome = true;

  readonly fullName = PROFILE.fullName;
  readonly socialLinks = SOCIAL_LINKS;
  readonly primaryNav = PRIMARY_NAV;
  readonly moreNav = MORE_NAV;
  readonly footerNav = FOOTER_NAV;
  readonly currentYear = new Date().getFullYear();

  private sectionListener = (e: Event) => {
    this.activeSection = (e as CustomEvent<string>).detail;
  };

  ngOnInit(): void {
    window.addEventListener('section-change', this.sectionListener);
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isHome = this.router.url === '/' || this.router.url === '';
      });
    this.isHome = this.router.url === '/' || this.router.url === '';
  }

  ngOnDestroy(): void {
    window.removeEventListener('section-change', this.sectionListener);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showBackToTop = window.scrollY > 400;
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollProgress = height > 0 ? (winScroll / height) * 100 : 0;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.resume-dropdown')) this.showResumeDropdown = false;
    if (!target.closest('.nav-more')) this.showMoreMenu = false;
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }

  closeMenu(): void {
    this.menuOpen = false;
    this.showMoreMenu = false;
  }

  scrollToTop(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  toggleResumeDropdown(): void {
    this.showResumeDropdown = !this.showResumeDropdown;
    this.showMoreMenu = false;
  }

  toggleMoreMenu(): void {
    this.showMoreMenu = !this.showMoreMenu;
    this.showResumeDropdown = false;
  }

  isMoreSectionActive(): boolean {
    return this.moreNav.some((link) => link.id === this.activeSection);
  }

  downloadResume(type: 'pdf' | 'docx'): void {
    this.showResumeDropdown = false;
    const link = document.createElement('a');
    link.href = type === 'pdf' ? PROFILE.resumeLink : 'assets/resume.docx';
    link.download = `Ravin_Bhakta_Resume.${type}`;
    link.click();
  }
}
