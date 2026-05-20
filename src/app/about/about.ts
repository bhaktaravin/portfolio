import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./about.html",
  styleUrls: ["./about.css"],
})
export class AboutComponent {
  fullName = "Ravin Bhakta";
  jobTitle =
    "Senior Software Engineer | AI-Assisted Full-Stack Developer | LLM Integration, React, TypeScript, Angular | Building Intelligent Web Apps | AWS | Agile";
  heroDescription =
    "Software engineer specializing in AI-assisted applications, LLM integration, and scalable full-stack systems. Co-founder building API-driven platforms; ships production tools like Career Copilot with intelligent resume and interview workflows.";
  resumeLink = "assets/ravinbhaktaresume.pdf";

  get initials(): string {
    return this.fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("");
  }

  aboutDescription =
    "I design and ship AI-enabled web applications—from LLM-powered career tools and intelligent search to enterprise APIs and cloud-native backends. Experienced across React, Angular, TypeScript, Rust, and AWS, with a focus on turning AI capabilities into reliable, user-facing product features.";

  stats = [
    { value: "5+", label: "Years Experience" },
    { value: "10+", label: "Projects Completed" },
    { value: "3", label: "Companies Worked" },
    { value: "15+", label: "Technologies" },
  ];

  location = "Fremont, CA";

  techStack = [
    "LLM Integration",
    "React",
    "Angular",
    "TypeScript",
    "AWS",
    "NestJS",
  ];

  downloadResume(format: string): void {
    // Logic to download resume in specified format
    const link = document.createElement("a");
    if (format === "pdf") {
      link.href = "assets/resume.pdf";
      link.download = "Ravin_Bhakta_Resume.pdf";
    } else if (format === "docx") {
      link.href = "assets/resume.docx";
      link.download = "Ravin_Bhakta_Resume.docx";
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
