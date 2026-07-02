import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Document, Packer, Paragraph, TextRun } from 'docx';

import { ThemeService } from './services/theme.service';
import {
  PROFILE,
  SOCIAL_LINKS,
  PRIMARY_NAV,
  MORE_NAV,
  FOOTER_NAV,
  RESUME_SKILL_CATEGORIES,
  experiencesToResume,
  educationToResume,
  certificationsToResume,
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
  readonly theme = inject(ThemeService);

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

  async downloadResume(type: 'pdf' | 'docx'): Promise<void> {
    this.showResumeDropdown = false;
    const workExperience = experiencesToResume();
    const education = educationToResume();
    const certifications = certificationsToResume();
    const skillCategories = RESUME_SKILL_CATEGORIES;

    if (type === 'pdf') {
      const docDefinition = {
        content: [
          { text: PROFILE.fullName, style: 'header' },
          { text: PROFILE.jobTitle, style: 'subheader', margin: [0, 0, 0, 10] },
          { text: PROFILE.aboutDescription, margin: [0, 0, 0, 15] },
          { text: 'Email: ' + PROFILE.email },
          { text: 'Phone: ' + PROFILE.phone },
          { text: 'Location: ' + PROFILE.location, margin: [0, 0, 0, 15] },
          { text: 'Skills', style: 'sectionHeader' },
          ...skillCategories.map((cat) => ({
            text: `${cat.name}: ${cat.skills.join(', ')}`,
            margin: [0, 0, 0, 5],
          })),
          { text: '', margin: [0, 0, 0, 10] },
          { text: 'Experience', style: 'sectionHeader' },
          ...workExperience.flatMap((exp) => [
            { text: `${exp.title} – ${exp.company}`, bold: true },
            { text: exp.period, italics: true, margin: [0, 0, 0, 2] },
            { text: exp.description, margin: [0, 0, 0, 8] },
          ]),
          { text: 'Education', style: 'sectionHeader' },
          ...education.flatMap((edu) => [
            { text: `${edu.degree}, ${edu.institution}`, bold: true },
            { text: `${edu.period} – ${edu.location}`, italics: true, margin: [0, 0, 0, 8] },
          ]),
          { text: 'Certifications', style: 'sectionHeader' },
          ...certifications.map((cert) => ({
            text: `${cert.name} (${cert.issuer}, ${cert.year})`,
            margin: [0, 0, 0, 3],
          })),
        ],
        styles: {
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 14, bold: true },
          sectionHeader: { fontSize: 13, bold: true, color: '#003366', margin: [0, 10, 0, 4] },
        },
      };
      pdfMake.createPdf(docDefinition).download(`${PROFILE.fullName}-Resume.pdf`);
    } else {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({ children: [new TextRun({ text: PROFILE.fullName, bold: true, size: 32 })] }),
            new Paragraph({ children: [new TextRun({ text: PROFILE.jobTitle, italics: true, size: 24 })] }),
            new Paragraph(PROFILE.aboutDescription),
            new Paragraph(''),
            new Paragraph('Email: ' + PROFILE.email),
            new Paragraph('Phone: ' + PROFILE.phone),
            new Paragraph('Location: ' + PROFILE.location),
            new Paragraph(''),
            new Paragraph({ children: [new TextRun({ text: 'Skills', bold: true, size: 26 })] }),
            ...skillCategories.map((cat) => new Paragraph(`${cat.name}: ${cat.skills.join(', ')}`)),
            new Paragraph(''),
            new Paragraph({ children: [new TextRun({ text: 'Experience', bold: true, size: 26 })] }),
            ...workExperience.flatMap((exp) => [
              new Paragraph({ children: [new TextRun({ text: `${exp.title} – ${exp.company}`, bold: true })] }),
              new Paragraph({ children: [new TextRun({ text: exp.period, italics: true })] }),
              new Paragraph(exp.description),
              new Paragraph(''),
            ]),
            new Paragraph({ children: [new TextRun({ text: 'Education', bold: true, size: 26 })] }),
            ...education.flatMap((edu) => [
              new Paragraph({ children: [new TextRun({ text: `${edu.degree}, ${edu.institution}`, bold: true })] }),
              new Paragraph({ children: [new TextRun({ text: `${edu.period} – ${edu.location}`, italics: true })] }),
              new Paragraph(''),
            ]),
            new Paragraph({ children: [new TextRun({ text: 'Certifications', bold: true, size: 26 })] }),
            ...certifications.map((cert) => new Paragraph(`${cert.name} (${cert.issuer}, ${cert.year})`)),
          ],
        }],
      });
      const blob = await Packer.toBlob(doc);
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${PROFILE.fullName}-Resume.docx`;
      a.click();
      globalThis.URL.revokeObjectURL(url);
    }
  }
}
