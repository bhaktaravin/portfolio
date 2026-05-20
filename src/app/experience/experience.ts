import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

interface Experience {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  details: string[];
  companyUrl: string;
}

@Component({
  selector: "app-experience",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./experience.html",
  styleUrls: ["./experience.css"],
})
export class ExperienceComponent {
  experiences: Experience[] = [
    {
      company: "Stealth Startup",
      title: "Co-Founder",
      location: "Remote",
      start: "Jan 2026",
      end: "Present",
      details: [
        "Co-founding and architecting a stealth-stage AI-enabled software platform focused on API-driven systems, intelligent automation, and scalable backend infrastructure.",
        "Designing LLM-integrated workflows and RESTful services that connect product features to reliable, observable backend pipelines.",
        "Driving technical direction across full-stack delivery, from prompt-aware product flows to production-ready APIs and deployment strategy.",
      ],
      companyUrl: "",
    },
    {
      company: "Self Employed",
      title: "Senior Software Engineer — Self-Employed",
      location: "Fremont, CA",
      start: "Jul 2025",
      end: "Present",
      details: [
        "Independent development of AI-assisted full-stack and backend applications using modern TypeScript, React, and cloud-native tooling.",
        "Shipped Career Copilot—an LLM-powered job application assistant with resume analysis, JD matching, and interview practice—deployed on Replit with public source on GitHub.",
        "Delivered client-facing web platforms (consulting sites, event management) with responsive UX, AWS/Vercel hosting, and performance-focused architecture.",
      ],
      companyUrl: "",
    },
    {
      company: "Blue Shield of California",
      title: "Associate, Application Developer",
      location: "Oakland",
      start: "Jul 2021",
      end: "Jun 2025",
      details: [
        "Leveraged VBA, PowerShell, and version control tools (SVN/Git) to automate enterprise workflows and support intelligent process improvements in a regulated healthcare environment.",
        "Applied debugging and integration techniques for APIs, services, and RESTful architectures—enabling data-driven automation and reliable system performance at scale.",
        "Demonstrated expert proficiency in SQL by writing complex queries and supporting data modeling efforts using Oracle SQL Server for analytics and operational reporting.",
      ],
      companyUrl: "https://www.blueshieldca.com/",
    },
    {
      company: "Entappia",
      title: "Product Delivery Manager",
      location: "Palo Alto",
      start: "Aug 2019",
      end: "Jul 2021",
      details: [
        "Utilized RESTful API services and contributed to API development—building integration layers that power connected, data-rich product experiences.",
        "Integrated SAP Open Connectors with cloud databases (Firebase, Amazon DynamoDB) to enhance scalability and enable real-time, event-driven data flows.",
        "Modernized legacy codebases with modular architecture and contemporary standards—reducing operational costs and accelerating feature delivery for cloud-connected applications.",
      ],
      companyUrl: "https://entappia.com",
    },
    {
      company: "Quality Assurance Internship",
      title: "Intern",
      location: "Los Angeles",
      start: "Sep 2018",
      end: "May 2019",
      details: [
        "Redesigned application processing by changing how the current application was stored from the system of XML to C#.",
        "Implemented a more user friendly website by making it look more modern using C# and Bootstrap along with KendoUI.",
        "Redesigned future applicant/current tenant housing authority portal using ASP.NET MVC with Entity, Kendo UI, and SQL Server.",
      ],
      companyUrl: "",
    },
  ];
}
