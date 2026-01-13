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
      company: "Blue Shield of California",
      title: "Associate, Application Developer",
      location: "Oakland",
      start: "Jul 2021",
      end: "Jun 2025",
      details: [
        "Leveraged VBA, PowerShell, and version control tools (SVN/Git) to support software development and maintenance in an enterprise environment.",
        "Applied debugging and integration techniques for APIs, services, and RESTful architectures to resolve complex business challenges and optimize system performance.",
        "Demonstrated expert proficiency in SQL by writing complex queries and supporting data modeling efforts using Oracle SQL Server.",
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
        "Utilized RESTful API services and contributed to the development of APIs, aligning with modern integration practices.",
        "Integrated SAP Open Connectors with cloud databases such as Firebase and Amazon DynamoDB to enhance system performance and scalability.",
        "Modernized legacy codebases by revising, modularizing, and updating to adhere to contemporary development standards, thereby reducing operational costs and improving functionality.",
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
