import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Document, Packer, Paragraph, TextRun } from "docx";

import { HeroComponent } from "./hero/hero";
import { AboutComponent } from "./about/about";
import { SkillsComponent } from "./skills/skills";
import { ExperienceComponent } from "./experience/experience";
import { ProjectsComponent } from "./projects/projects";
import { EducationComponent } from "./education/education";
import { CertificationsComponent } from "./certifications/certifications";
import { ContactComponent } from "./contact/contact";
import { TestimonialsComponent } from "./testimonials/testimonials";
import { GitHubActivityComponent } from "./github-activity/github-activity";
import { ProductsComponent } from "./products/products";

export interface Certification { name: string; issuer: string; year: string; }
export interface Stat { value: string; label: string; }
export interface SkillCategory { name: string; skills: string[]; }
export interface WorkExperience { title: string; company: string; period: string; description: string; }
export interface SocialLink { platform: string; url: string; icon: string; }
export interface Education { degree: string; institution: string; period: string; location: string; }

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterModule, FormsModule,
    HeroComponent, AboutComponent, SkillsComponent, ExperienceComponent,
    ProjectsComponent, EducationComponent, CertificationsComponent,
    ContactComponent, TestimonialsComponent, GitHubActivityComponent,
    ProductsComponent,
  ],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "Portfolio";
  activeSection = "home";
  showBackToTop = false;
  menuOpen = false;
  scrollProgress = 0;
  showResumeDropdown = false;

  private observer!: IntersectionObserver;

  readonly sections = ["home", "about", "experience", "skills", "projects", "products", "github", "education", "certifications", "contact"];

  fullName = "Ravin Bhakta";
  jobTitle = "AI-Assisted Full-Stack Engineer – Intelligent Apps & Cloud Systems";
  heroDescription = "Full-stack engineer with 5+ years building enterprise APIs and AI-assisted products. Co-founder at Wov3; ships production web platforms, LLM-powered tools, and scalable cloud applications.";
  aboutDescription = "I build AI-enabled web applications and backend systems—LLM integration, React/Angular frontends, and cloud-native APIs on AWS. From Career Copilot to enterprise platforms, I focus on turning AI capabilities into reliable, production-ready user experiences.";
  email = "ravin.bhakta@gmail.com";
  phone = "5107557264";
  location = "Fremont, CA";
  resumeLink = "assets/resume.pdf";
  currentYear = new Date().getFullYear();

  get initials(): string {
    return this.fullName.split(" ").map((n) => n.charAt(0)).join("");
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
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  @HostListener("window:scroll")
  onScroll() {
    this.showBackToTop = window.scrollY > 400;
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    this.scrollProgress = (winScroll / height) * 100;
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }
  toggleResumeDropdown() { this.showResumeDropdown = !this.showResumeDropdown; }

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
          ...this.skillCategories.map((cat) => ({ text: `${cat.name}: ${cat.skills.join(", ")}`, margin: [0, 0, 0, 5] })),
          { text: "", margin: [0, 0, 0, 10] },
          { text: "Experience", style: "sectionHeader" },
          ...this.workExperience.map((exp) => [
            { text: `${exp.title} – ${exp.company}`, bold: true },
            { text: exp.period, italics: true, margin: [0, 0, 0, 2] },
            { text: exp.description, margin: [0, 0, 0, 8] },
          ]).flat(),
          { text: "Education", style: "sectionHeader" },
          ...this.education.map((edu) => [
            { text: `${edu.degree}, ${edu.institution}`, bold: true },
            { text: `${edu.period} – ${edu.location}`, italics: true, margin: [0, 0, 0, 8] },
          ]).flat(),
          { text: "Certifications", style: "sectionHeader" },
          ...this.certifications.map((cert) => ({ text: `${cert.name} (${cert.issuer}, ${cert.year})`, margin: [0, 0, 0, 3] })),
        ],
        styles: {
          header: { fontSize: 22, bold: true },
          subheader: { fontSize: 14, bold: true },
          sectionHeader: { fontSize: 13, bold: true, color: "#003366", margin: [0, 10, 0, 4] },
        },
      };
      pdfMake.createPdf(docDefinition).download(`${this.fullName}-Resume.pdf`);
    } else {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({ children: [new TextRun({ text: this.fullName, bold: true, size: 32 })] }),
            new Paragraph({ children: [new TextRun({ text: this.jobTitle, italics: true, size: 24 })] }),
            new Paragraph(this.aboutDescription),
            new Paragraph(""),
            new Paragraph("Email: " + this.email),
            new Paragraph("Phone: " + this.phone),
            new Paragraph("Location: " + this.location),
            new Paragraph(""),
            new Paragraph({ children: [new TextRun({ text: "Skills", bold: true, size: 26 })] }),
            ...this.skillCategories.map((cat) => new Paragraph(`${cat.name}: ${cat.skills.join(", ")}`)),
            new Paragraph(""),
            new Paragraph({ children: [new TextRun({ text: "Experience", bold: true, size: 26 })] }),
            ...this.workExperience.map((exp) => [
              new Paragraph({ children: [new TextRun({ text: `${exp.title} – ${exp.company}`, bold: true })] }),
              new Paragraph({ children: [new TextRun({ text: exp.period, italics: true })] }),
              new Paragraph(exp.description),
              new Paragraph(""),
            ]).flat(),
            new Paragraph({ children: [new TextRun({ text: "Education", bold: true, size: 26 })] }),
            ...this.education.map((edu) => [
              new Paragraph({ children: [new TextRun({ text: `${edu.degree}, ${edu.institution}`, bold: true })] }),
              new Paragraph({ children: [new TextRun({ text: `${edu.period} – ${edu.location}`, italics: true })] }),
              new Paragraph(""),
            ]).flat(),
            new Paragraph({ children: [new TextRun({ text: "Certifications", bold: true, size: 26 })] }),
            ...this.certifications.map((cert) => new Paragraph(`${cert.name} (${cert.issuer}, ${cert.year})`)),
          ],
        }],
      });
      const blob = await Packer.toBlob(doc);
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${this.fullName}-Resume.docx`;
      a.click();
      globalThis.URL.revokeObjectURL(url);
    }
  }

  onSubmitContact(): void {
    alert("Thank you for your message! I will get back to you soon.");
  }
}
