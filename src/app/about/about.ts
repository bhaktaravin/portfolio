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
  // Detailed professional background
  professionalSummary = `With over 5 years of experience in full-stack development, I specialize in building enterprise-grade applications that scale. My expertise spans across modern web technologies, cloud platforms, and agile methodologies, allowing me to deliver robust solutions that drive business value.`;

  coreCompetencies = [
    {
      area: "Frontend Development",
      skills: [
        "Angular",
        "React",
        "TypeScript",
        "Modern CSS",
        "Responsive Design",
      ],
      description:
        "Creating intuitive, accessible user interfaces with modern frameworks and best practices.",
    },
    {
      area: "Backend Development",
      skills: [
        "Java Spring",
        "Python/Django",
        "Node.js",
        "REST APIs",
        "Microservices",
      ],
      description:
        "Designing scalable server-side architectures and robust API integrations.",
    },
    {
      area: "Cloud & DevOps",
      skills: ["AWS", "Heroku", "CI/CD", "Docker", "System Optimization"],
      description:
        "Implementing cloud-native solutions with automated deployment pipelines.",
    },
    {
      area: "Database & Analytics",
      skills: [
        "SQL",
        "NoSQL",
        "Data Modeling",
        "Performance Tuning",
        "Analytics",
      ],
      description:
        "Optimizing data storage and retrieval for high-performance applications.",
    },
  ];

  achievements = [
    "Reduced system processing time by 30% through workflow automation using VBA and PowerShell",
    "Improved API response times by 40% through optimization and debugging initiatives",
    "Led migration from legacy systems, cutting maintenance costs by 20%",
    "Integrated SAP Open Connectors with cloud databases, reducing data latency by 25%",
  ];

  personalValues = [
    "Continuous learning and staying current with emerging technologies",
    "Collaborative problem-solving and knowledge sharing with teams",
    "Writing clean, maintainable code that stands the test of time",
    "User-centered design thinking in all development decisions",
  ];
}
