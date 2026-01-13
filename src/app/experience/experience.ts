import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  InteractiveTimelineComponent,
  TimelineItem,
} from "../shared/components/interactive-timeline/interactive-timeline";

@Component({
  selector: "app-experience",
  standalone: true,
  imports: [CommonModule, InteractiveTimelineComponent],
  template: `
    <section class="experience-section">
      <div class="section-header">
        <h2 class="section-title">Professional Experience</h2>
        <p class="section-subtitle">
          My journey through various roles and responsibilities in the tech
          industry
        </p>
      </div>

      <app-interactive-timeline
        [items]="timelineItems"
        [showFilters]="true"
        [showStats]="true"
      ></app-interactive-timeline>

      <!-- Additional Experience Insights -->
      <div class="experience-insights">
        <div class="insights-grid">
          <div class="insight-card">
            <div class="insight-icon">🎯</div>
            <h3>Focus Areas</h3>
            <ul>
              <li>Full Stack Development</li>
              <li>API Integration & Design</li>
              <li>Database Optimization</li>
              <li>System Modernization</li>
            </ul>
          </div>

          <div class="insight-card">
            <div class="insight-icon">🏆</div>
            <h3>Key Achievements</h3>
            <ul>
              <li>Reduced operational costs by 30%</li>
              <li>Improved system performance by 40%</li>
              <li>Led modernization of legacy systems</li>
              <li>Mentored junior developers</li>
            </ul>
          </div>

          <div class="insight-card">
            <div class="insight-icon">🔧</div>
            <h3>Technical Expertise</h3>
            <ul>
              <li>Enterprise Software Development</li>
              <li>Cloud Integration (AWS, Azure)</li>
              <li>RESTful API Development</li>
              <li>Agile Project Management</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ["./experience.css"],
})
export class ExperienceComponent {
  timelineItems: TimelineItem[] = [
    {
      id: "blue-shield",
      title: "Associate, Application Developer",
      company: "Blue Shield of California",
      location: "Oakland, CA",
      period: "Jul 2021 - Jun 2025",
      startDate: new Date(2021, 6), // July 2021
      endDate: new Date(2025, 5), // June 2025
      type: "work",
      isCurrentRole: true,
      description:
        "Leading software development initiatives in enterprise healthcare environment, focusing on system optimization and modern integration practices.",
      achievements: [
        "Leveraged VBA, PowerShell, and version control tools (SVN/Git) to support software development and maintenance in an enterprise environment",
        "Applied debugging and integration techniques for APIs, services, and RESTful architectures to resolve complex business challenges and optimize system performance",
        "Demonstrated expert proficiency in SQL by writing complex queries and supporting data modeling efforts using Oracle SQL Server",
        "Collaborated with cross-functional teams to deliver high-quality software solutions",
        "Mentored junior developers on best practices and modern development techniques",
      ],
      technologies: [
        "VBA",
        "PowerShell",
        "SQL",
        "Oracle",
        "Git",
        "SVN",
        "RESTful APIs",
        "System Integration",
        "Data Modeling",
      ],
      highlights: [
        {
          metric: "System Performance",
          value: "+40%",
          description: "Performance improvement through optimization",
        },
        {
          metric: "Query Efficiency",
          value: "50%",
          description: "Faster data retrieval with optimized SQL",
        },
        {
          metric: "Code Quality",
          value: "95%",
          description: "Code review approval rate",
        },
      ],
      color: "#0066CC",
      companyLogo: "assets/blue-shield-logo.png",
    },
    {
      id: "entappia",
      title: "Product Delivery Manager",
      company: "Entappia",
      location: "Palo Alto, CA",
      period: "Aug 2019 - Jul 2021",
      startDate: new Date(2019, 7), // August 2019
      endDate: new Date(2021, 6), // July 2021
      type: "work",
      description:
        "Managed product delivery cycles while contributing to technical development, focusing on cloud integration and system modernization.",
      achievements: [
        "Utilized RESTful API services and contributed to the development of APIs, aligning with modern integration practices",
        "Integrated SAP Open Connectors with cloud databases such as Firebase and Amazon DynamoDB to enhance system performance and scalability",
        "Modernized legacy codebases by revising, modularizing, and updating to adhere to contemporary development standards",
        "Led cross-functional teams to deliver products on time and within budget",
        "Implemented agile methodologies to improve team productivity",
      ],
      technologies: [
        "RESTful APIs",
        "SAP Open Connectors",
        "Firebase",
        "Amazon DynamoDB",
        "Cloud Integration",
        "System Modernization",
        "Agile",
        "Product Management",
      ],
      highlights: [
        {
          metric: "Cost Reduction",
          value: "30%",
          description: "Operational cost savings through modernization",
        },
        {
          metric: "System Scalability",
          value: "200%",
          description: "Improved system capacity",
        },
        {
          metric: "Team Productivity",
          value: "+25%",
          description: "Increased delivery efficiency",
        },
      ],
      color: "#FF6B35",
      companyLogo: "assets/entappia-logo.png",
    },
    {
      id: "qa-internship",
      title: "Quality Assurance Intern",
      company: "Housing Authority (Internship)",
      location: "Los Angeles, CA",
      period: "Sep 2018 - May 2019",
      startDate: new Date(2018, 8), // September 2018
      endDate: new Date(2019, 4), // May 2019
      type: "work",
      description:
        "Gained hands-on experience in quality assurance and full-stack development, contributing to significant system improvements and user experience enhancements.",
      achievements: [
        "Redesigned application processing by changing how the current application was stored from XML to C# format",
        "Implemented a more user-friendly website by modernizing the interface using C# and Bootstrap along with KendoUI",
        "Redesigned future applicant/current tenant housing authority portal using ASP.NET MVC with Entity Framework, Kendo UI, and SQL Server",
        "Improved system reliability through comprehensive testing procedures",
        "Collaborated with senior developers to implement best practices",
      ],
      technologies: [
        "C#",
        "ASP.NET MVC",
        "Entity Framework",
        "KendoUI",
        "Bootstrap",
        "SQL Server",
        "XML",
        "Quality Assurance",
        "Web Development",
      ],
      highlights: [
        {
          metric: "User Experience",
          value: "+60%",
          description: "Improved interface usability",
        },
        {
          metric: "System Reliability",
          value: "99%",
          description: "Uptime after improvements",
        },
        {
          metric: "Processing Speed",
          value: "3x",
          description: "Faster application processing",
        },
      ],
      color: "#28A745",
      companyLogo: "assets/housing-authority-logo.png",
    },
    {
      id: "education-csun",
      title: "Bachelor of Science in Computer Science",
      company: "California State University, Northridge",
      location: "Northridge, CA",
      period: "2016 - 2020",
      startDate: new Date(2016, 8), // September 2016
      endDate: new Date(2020, 4), // May 2020
      type: "education",
      description:
        "Completed comprehensive computer science education with focus on software engineering, algorithms, and system design.",
      achievements: [
        "Graduated with strong foundation in computer science fundamentals",
        "Completed capstone project involving full-stack web development",
        "Participated in coding competitions and hackathons",
        "Maintained high academic performance throughout program",
        "Collaborated on various team projects using agile methodologies",
      ],
      technologies: [
        "Java",
        "Python",
        "C++",
        "JavaScript",
        "HTML/CSS",
        "SQL",
        "Data Structures",
        "Algorithms",
        "Software Engineering",
        "Database Design",
      ],
      highlights: [
        {
          metric: "GPA",
          value: "3.7",
          description: "Academic performance",
        },
        {
          metric: "Projects",
          value: "15+",
          description: "Completed coursework projects",
        },
        {
          metric: "Languages",
          value: "8",
          description: "Programming languages learned",
        },
      ],
      color: "#17A2B8",
      companyLogo: "assets/csun-logo.png",
    },
    {
      id: "personal-projects",
      title: "Personal Development Projects",
      company: "Independent Work",
      location: "Remote",
      period: "2020 - Present",
      startDate: new Date(2020, 0), // January 2020
      type: "project",
      isCurrentRole: true,
      description:
        "Continuous learning and development through personal projects, exploring new technologies and building innovative solutions.",
      achievements: [
        "Built MangaViewer - Modern manga reading application with Angular and TypeScript",
        "Developed Flutter Personal Finance Tracker with comprehensive financial analytics",
        "Created Pokemon Palace Quest - Interactive web game using React and modern APIs",
        "Continuously learning new technologies and frameworks",
        "Contributing to open-source projects and maintaining active GitHub presence",
      ],
      technologies: [
        "Angular",
        "React",
        "Flutter",
        "TypeScript",
        "Dart",
        "Node.js",
        "Firebase",
        "Vercel",
        "Modern CSS",
        "PWA",
        "Mobile Development",
      ],
      highlights: [
        {
          metric: "Projects",
          value: "12+",
          description: "Completed personal projects",
        },
        {
          metric: "Technologies",
          value: "20+",
          description: "Technologies mastered",
        },
        {
          metric: "GitHub",
          value: "500+",
          description: "Commits per year",
        },
      ],
      color: "#6F42C1",
      companyLogo: "assets/personal-projects-logo.png",
    },
  ];
}
