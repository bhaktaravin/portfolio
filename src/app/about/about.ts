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
    "Mid-Level Software Engineer | Full-Stack Developer | JavaScript, TypeScript, Node.js, React | Building Scalable Web Apps | AWS | Agile";
  heroDescription =
    "Skilled Software Engineer with robust experience in Rust and Java development, API integration, and agile methodologies. Demonstrates proven expertise in building and maintaining scalable enterprise solutions, optimizing system performance, and collaborating with cross-functional teams.";
  resumeLink = "assets/ravinbhaktaresume.pdf";

  get initials(): string {
    return this.fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("");
  }

  aboutDescription =
    "Skilled Software Engineer with robust experience in Rust and Java development, API integration, and agile methodologies. Demonstrates proven expertise in building and maintaining scalable enterprise solutions, optimizing system performance, and collaborating with cross-functional teams. Bringing strong debugging, SQL, and full-stack development proficiency to deliver efficient, modern applications.";

  stats = [
    { value: "5+", label: "Years Experience" },
    { value: "10+", label: "Projects Completed" },
    { value: "3", label: "Companies Worked" },
    { value: "15+", label: "Technologies" },
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
