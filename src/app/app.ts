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

  fullName = "Ravin Bhakta";
  jobTitle = "AI-Assisted Full-Stack Engineer – Intelligent Apps & Cloud Systems";
  heroDescription = "Full-stack engineer with 5+ years building enterprise APIs and AI-assisted products. Co-founder at Wov3; ships production web platforms, LLM-powered tools, and scalable cloud applications.";
  aboutDescription = "I build AI-enabled web applications and backend systems—LLM integration, React/Angular frontends, and cloud-native APIs on AWS. From Career Copilot to enterprise platforms, I focus on turning AI capabilities into reliable, production-ready user experiences.";
  email = "ravin.bhakta@gmail.com";
  phone = "5107557264";
  location = "Fremont, CA";
  resumeLink = "assets/resume.pdf";
  currentYear = new Date().getFullYear();
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

  certifications: Certification[] = [
    { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2024" },
    { name: "Certified Kubernetes Application Developer (CKAD)", issuer: "Cloud Native Computing Foundation", year: "2023" },
    { name: "SAP Certified Application Associate", issuer: "SAP", year: "2022" },
    { name: "CompTIA Security+", issuer: "CompTIA", year: "2021" },
  ];

  stats: Stat[] = [
    { value: "5+", label: "Years Experience" },
    { value: "10+", label: "Projects Completed" },
    { value: "3", label: "Companies Worked" },
    { value: "15+", label: "Technologies" },
  ];

  skillCategories: SkillCategory[] = [
    { name: "AI & LLM", skills: ["LLM Integration", "Prompt Engineering", "AI-Assisted UX", "OpenAI API"] },
    { name: "Frontend", skills: ["Angular", "React", "TypeScript", "Tailwind CSS"] },
    { name: "Backend", skills: ["NestJS", "Node.js", "Java (Spring)", "Python (Django)"] },
    { name: "Cloud", skills: ["AWS", "AWS Amplify", "Vercel", "Railway"] },
  ];

  workExperience: WorkExperience[] = [
    {
      title: "Co-Founder",
      company: "Wov3",
      period: "January 2026 - Present",
      description: "Co-founding Wov3 — recovery footwear engineered with 3D-printed lattice structures. Building the production web platform, e-commerce flows, and athlete onboarding experience at wov3.com.",
    },
    {
      title: "Senior Software Engineer — Self-Employed",
      company: "Self Employed",
      period: "July 2025 - Present",
      description: "Independent AI-assisted full-stack development: shipped Career Copilot (LLM resume/JD/interview tools), client web platforms on AWS Amplify and Vercel, and production React/TypeScript applications.",
    },
    {
      title: "Operations Associate Applications Developer",
      company: "Blue Shield of California",
      period: "July 2021 - June 2025",
      description: "Enterprise APIs, intelligent workflow automation, and system optimization. Automated processes with VBA and PowerShell (30% time savings); debugged REST APIs (40% faster incident resolution) for 1,000+ users. Led Git/SVN practices for reliable, data-driven delivery in healthcare.",
    },
    {
      title: "Software Developer",
      company: "Entappia",
      period: "August 2019 - June 2021",
      description: "Full-stack and cloud integration with API-first architecture. Launched RESTful APIs (50% faster integration); connected SAP Open Connectors to Firebase and DynamoDB (25% lower latency). Modernized legacy systems for scalable, event-driven data flows.",
    },
    {
      title: "Quality Assurance Intern",
      company: "Los Angeles Housing Authority",
      period: "August 2018 - April 2019",
      description: "Contributed to enterprise tooling and automation. Migrated data storage from XML to C#, accelerating processing speed by 3x and supporting faster applicant onboarding. Revamped user portal UI with C#, Bootstrap, and KendoUI, increasing user satisfaction and reducing support tickets. Redesigned housing authority portal (ASP.NET MVC, SQL Server), enabling secure, scalable access for thousands of tenants.",
    },
  ];

  socialLinks: SocialLink[] = [
    { platform: "GitHub", url: "https://github.com/bhaktaravin", icon: "🐙" },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/ravin-rohitbhai-bhakta", icon: "🔗" },
    { platform: "Gumroad", url: "https://ravinspire34.gumroad.com/", icon: "🛒" },
    { platform: "Email", url: "mailto:ravin.bhakta@gmail.com", icon: "✉️" },
    { platform: "Phone", url: "tel:5107557264", icon: "📞" },
  ];

  education: Education[] = [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "California State University, Los Angeles",
      period: "August 2015 - April 2019",
      location: "Los Angeles, CA",
    },
  ];

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.activeSection = entry.target.id;
        });
      },
      { threshold: 0.3 }
    );
    this.sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });
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
