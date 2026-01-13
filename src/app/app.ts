import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Document, Packer, Paragraph, TextRun } from "docx";

// Import standalone components
import { HeroComponent } from "./hero/hero";
import { AboutComponent } from "./about/about";
import { SkillsComponent } from "./skills/skills";
import { ExperienceComponent } from "./experience/experience";
import { ProjectsComponent } from "./projects/projects";
import { EducationComponent } from "./education/education";
import { CertificationsComponent } from "./certifications/certifications";
import { ContactComponent } from "./contact/contact";
import { TestimonialsComponent } from "./testimonials/testimonials";
import { BlogComponent } from "./blog/blog.component";
import { NavigationComponent } from "./shared/navigation.component";
import { CommandPaletteComponent } from "./shared/components/command-palette/command-palette";
import { GitHubIntegrationComponent } from "./shared/components/github-integration/github-integration";
import { ToastComponent } from "./shared/components/toast/toast.component";

// Import services
import { ThemeService } from "./services/theme.service";
import { AnalyticsService } from "./services/analytics.service";
import { PerformanceService } from "./services/performance.service";
import { ToastService } from "./services/toast.service";

// --- Interfaces ---
export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface WorkExperience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    FormsModule,
    NavigationComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    EducationComponent,
    CertificationsComponent,
    BlogComponent,
    ContactComponent,
    TestimonialsComponent,
    CommandPaletteComponent,
    GitHubIntegrationComponent,
    ToastComponent,
  ],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
})
export class AppComponent {
  title = "Portfolio";

  constructor(
    public themeServiceInstance: ThemeService,
    private analytics: AnalyticsService,
    private performance: PerformanceService,
    private toastService: ToastService,
  ) {
    // Initialize analytics
    this.analytics.trackPageView("/", "Portfolio Home");

    // Set up performance monitoring
    this.setupPerformanceMonitoring();
  }

  certifications: Certification[] = [
    {
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      year: "2024",
    },
    {
      name: "Certified Kubernetes Application Developer (CKAD)",
      issuer: "Cloud Native Computing Foundation",
      year: "2023",
    },
    {
      name: "SAP Certified Application Associate",
      issuer: "SAP",
      year: "2022",
    },
    { name: "CompTIA Security+", issuer: "CompTIA", year: "2021" },
  ];

  // Personal Information
  fullName = "Ravin Bhakta";
  jobTitle = "Full-Stack Engineer – Enterprise & Cloud Applications";
  heroDescription =
    "Full-Stack Engineer with 5+ years of experience building enterprise APIs, internal tools, and scalable cloud solutions. Known for technical depth in full-stack web apps and system optimization.";
  aboutDescription =
    "I build and scale enterprise-grade web applications, specializing in full-stack development (React, Angular, Java Spring, Python/Django) and cloud integration (AWS, Heroku, SAP). My focus is on delivering robust APIs, optimizing system performance, and supporting business growth through technical leadership.";
  email = "ravin.bhakta@gmail.com";
  phone = "5107557264";
  location = "Fremont, CA";
  resumeLink = "assets/resume.pdf";
  currentYear = new Date().getFullYear();

  // Get initials for profile image
  get initials(): string {
    return this.fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("");
  }

  // Statistics
  stats: Stat[] = [
    { value: "5+", label: "Years Experience" },
    { value: "10+", label: "Projects Completed" },
    { value: "3", label: "Companies Worked" },
    { value: "15+", label: "Technologies" },
  ];

  // Skills Categories
  skillCategories: SkillCategory[] = [
    {
      name: "Frontend",
      skills: ["Angular", "React", "Spring Boot (Thymeleaf)"],
    },
    {
      name: "Backend",
      skills: ["Java (Spring)", "Python (Django)", "Ruby on Rails"],
    },
    {
      name: "Cloud",
      skills: ["AWS", "Heroku", "SAP"],
    },
  ];

  // Work Experience
  workExperience: WorkExperience[] = [
    {
      title: "Operations Associate Applications Developer",
      company: "Blue Shield of California",
      period: "July 2021 - June 2025",
      description:
        "Focused on enterprise APIs, internal tools, and system optimization. Automated key workflows using VBA and PowerShell, reducing manual processing time by 30% and minimizing errors in enterprise operations. Debugged and optimized REST APIs, decreasing incident resolution time by 40% and improving system reliability for 1,000+ users. Led version control best practices (SVN/Git), enabling faster team collaboration and reducing deployment issues.",
    },
    {
      title: "Software Developer",
      company: "Entappia",
      period: "August 2019 - June 2021",
      description:
        "Specialized in full-stack web apps and cloud integration. Designed and launched RESTful APIs, boosting system integration speed by 50% and supporting seamless data exchange across platforms. Integrated SAP Open Connectors with cloud databases (Firebase, DynamoDB), improving scalability and reducing data latency by 25%. Modernized legacy codebases, cutting maintenance costs by 20% and increasing feature delivery velocity.",
    },
    {
      title: "Quality Assurance Intern",
      company: "Los Angeles Housing Authority",
      period: "August 2018 - April 2019",
      description:
        "Contributed to enterprise tooling and automation. Migrated data storage from XML to C#, accelerating processing speed by 3x and supporting faster applicant onboarding. Revamped user portal UI with C#, Bootstrap, and KendoUI, increasing user satisfaction and reducing support tickets. Redesigned housing authority portal (ASP.NET MVC, SQL Server), enabling secure, scalable access for thousands of tenants.",
    },
  ];

  // Social Links
  socialLinks: SocialLink[] = [
    { platform: "GitHub", url: "https://github.com/bhaktaravin", icon: "🐙" },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/ravin-rohitbhai-bhakta",
      icon: "🔗",
    },
    { platform: "Email", url: "mailto:ravin.bhakta@gmail.com", icon: "✉️" },
    { platform: "Phone", url: "tel:5107557264", icon: "📞" },
  ];

  // Education
  education: Education[] = [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "California State University, Los Angeles",
      period: "August 2015 - April 2019",
      location: "Los Angeles, CA",
    },
  ];

  // Resume dropdown
  showResumeDropdown = false;

  toggleResumeDropdown() {
    this.showResumeDropdown = !this.showResumeDropdown;
  }

  async downloadResume(type: "pdf" | "docx") {
    this.showResumeDropdown = false;
    if (type === "pdf") {
      const docDefinition = {
        content: [
          { text: this.fullName, style: "header" },
          { text: this.jobTitle, style: "subheader", margin: [0, 0, 0, 10] },
          { text: this.aboutDescription, margin: [0, 0, 0, 15] },
          { text: "Email: " + this.email },
          { text: "Phone: " + this.phone },
          { text: "Location: " + this.location, margin: [0, 0, 0, 15] },

          { text: "Skills", style: "sectionHeader" },
          ...this.skillCategories.map((cat) => ({
            text: `${cat.name}: ${cat.skills.join(", ")}`,
            margin: [0, 0, 0, 5],
          })),
          { text: "", margin: [0, 0, 0, 10] },

          { text: "Experience", style: "sectionHeader" },
          ...this.workExperience
            .map((exp) => [
              { text: `${exp.title} – ${exp.company}`, bold: true },
              { text: exp.period, italics: true, margin: [0, 0, 0, 2] },
              { text: exp.description, margin: [0, 0, 0, 8] },
            ])
            .flat(),

          { text: "Education", style: "sectionHeader" },
          ...this.education
            .map((edu) => [
              { text: `${edu.degree}, ${edu.institution}`, bold: true },
              {
                text: `${edu.period} – ${edu.location}`,
                italics: true,
                margin: [0, 0, 0, 8],
              },
            ])
            .flat(),

          { text: "Certifications", style: "sectionHeader" },
          ...this.certifications.map((cert: Certification) => ({
            text: `${cert.name} (${cert.issuer}, ${cert.year})`,
            margin: [0, 0, 0, 3],
          })),
        ],
        styles: {
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 14, bold: true },
          sectionHeader: {
            fontSize: 13,
            bold: true,
            color: "#003366",
            margin: [0, 10, 0, 4],
          },
        },
      };
      pdfMake.createPdf(docDefinition).download(`${this.fullName}-Resume.pdf`);
      this.toastService.success(
        "Download Started",
        "Your PDF resume is being downloaded",
      );
    } else if (type === "docx") {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: this.fullName, bold: true, size: 32 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: this.jobTitle, italics: true, size: 24 }),
                ],
              }),
              new Paragraph(this.aboutDescription),
              new Paragraph(""),
              new Paragraph("Email: " + this.email),
              new Paragraph("Phone: " + this.phone),
              new Paragraph("Location: " + this.location),
              new Paragraph(""),
              new Paragraph({
                children: [
                  new TextRun({ text: "Skills", bold: true, size: 26 }),
                ],
              }),
              ...this.skillCategories.map(
                (cat) => new Paragraph(`${cat.name}: ${cat.skills.join(", ")}`),
              ),
              new Paragraph(""),
              new Paragraph({
                children: [
                  new TextRun({ text: "Experience", bold: true, size: 26 }),
                ],
              }),
              ...this.workExperience
                .map((exp) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${exp.title} – ${exp.company}`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: exp.period, italics: true }),
                    ],
                  }),
                  new Paragraph(exp.description),
                  new Paragraph(""),
                ])
                .flat(),
              new Paragraph({
                children: [
                  new TextRun({ text: "Education", bold: true, size: 26 }),
                ],
              }),
              ...this.education
                .map((edu) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${edu.degree}, ${edu.institution}`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${edu.period} – ${edu.location}`,
                        italics: true,
                      }),
                    ],
                  }),
                  new Paragraph(""),
                ])
                .flat(),
              new Paragraph({
                children: [
                  new TextRun({ text: "Certifications", bold: true, size: 26 }),
                ],
              }),
              ...this.certifications.map(
                (cert: Certification) =>
                  new Paragraph(`${cert.name} (${cert.issuer}, ${cert.year})`),
              ),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${this.fullName}-Resume.docx`;
      a.click();
      globalThis.URL.revokeObjectURL(url);
      this.toastService.success(
        "Download Started",
        "Your Word resume is being downloaded",
      );
    }
  }

  // Contact form submission
  onSubmitContact(): void {
    this.analytics.trackFormSubmission("contact", true);
    this.toastService.success(
      "Message Sent!",
      "Thank you for your message! I will get back to you soon.",
      { duration: 6000 },
    );
  }

  // Navigation methods
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    this.analytics.trackClick("scroll_to_top", "navigation");
  }

  // Expose theme service for template access
  get themeService() {
    return this.themeServiceInstance;
  }

  // Performance monitoring
  private setupPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ("performance" in window && "observe" in PerformanceObserver.prototype) {
      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            this.analytics.trackPerformance(
              "LCP",
              Math.round(entry.startTime),
              "ms",
            );
          }
        }
      });

      try {
        observer.observe({ type: "largest-contentful-paint", buffered: true });
      } catch (e) {
        // LCP not supported
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "first-input") {
            const fid = (entry as any).processingStart - entry.startTime;
            this.analytics.trackPerformance("FID", Math.round(fid), "ms");
          }
        }
      });

      try {
        fidObserver.observe({ type: "first-input", buffered: true });
      } catch (e) {
        // FID not supported
      }
    }

    // Monitor page load time
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        this.analytics.trackPerformance(
          "PageLoad",
          Math.round(pageLoadTime),
          "ms",
        );
      }, 0);
    });
  }
}
