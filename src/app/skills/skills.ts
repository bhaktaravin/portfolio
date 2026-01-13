import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

interface SkillCategory {
  name: string;
  skills: string[];
}

@Component({
  selector: "app-skills",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./skills.html",
  styleUrls: ["./skills.css"],
})
export class SkillsComponent {
  programmingLanguages: string[] = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "Ruby",
    "Go",
    "Swift",
    "Kotlin",
    "PHP",
  ];

  frameworks: string[] = [
    "Angular",
    "React",
    "Vue.js",
    "Node.js",
    "Django",
    "Spring Boot",
    ".NET Core",
    "Express.js",
    "Flask",
    "Ruby on Rails",
    "Laravel",
  ];

  tools: string[] = [
    "Git",
    "Docker",
    "Jenkins",
    "Webpack",
    "VS Code",
    "Postman",
    "JIRA",
    "Figma",
    "Linux",
    "npm",
    "Yarn",
  ];

  databases: string[] = [
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "SQLite",
    "Redis",
    "Firebase",
    "Oracle",
  ];

  cloudPlatforms: string[] = [
    "AWS",
    "Azure",
    "Google Cloud Platform",
    "Heroku",
    "DigitalOcean",
    "SAP",
  ];

  // SVG icon mapping for common skills/techs
  skillIcons: Record<string, string> = {
    Angular: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M128 0L256 48L232 208L128 256L24 208L0 48L128 0Z" fill="#DD0031"/><path d="M128 0V256L232 208L256 48L128 0Z" fill="#C3002F"/><path d="M128 32L208 64L192 192L128 224L64 192L48 64L128 32Z" fill="white"/><path d="M128 32V224L192 192L208 64L128 32Z" fill="#B3002D"/><path d="M128 64L160 192H144L136 160H120L112 192H96L128 64ZM128 96L116 144H140L128 96Z" fill="#DD0031"/></svg>`,
    React: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><g><ellipse rx="50" ry="130" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16"/><ellipse rx="130" ry="50" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16"/><ellipse rx="50" ry="130" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16" transform="rotate(60 128 128)"/><ellipse rx="130" ry="50" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16" transform="rotate(60 128 128)"/><ellipse rx="50" ry="130" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16" transform="rotate(120 128 128)"/><ellipse rx="130" ry="50" cx="128" cy="128" fill="none" stroke="#61DAFB" stroke-width="16" transform="rotate(120 128 128)"/><circle cx="128" cy="128" r="28" fill="#61DAFB"/></g></svg>`,
    TypeScript: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="60" fill="#3178C6"/><path d="M104 104V120H120V208H136V120H152V104H104Z" fill="white"/><path d="M184 104V208H200V104H184Z" fill="white"/></svg>`,
    JavaScript: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="60" fill="#F7DF1E"/><path d="M104 104V208H120V120H136V208H152V104H104Z" fill="#323330"/><path d="M184 104V208H200V104H184Z" fill="#323330"/></svg>`,
    CSS3: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M128 0L256 48L232 208L128 256L24 208L0 48L128 0Z" fill="#264DE4"/><path d="M128 0V256L232 208L256 48L128 0Z" fill="#2965F1"/><path d="M128 32L208 64L192 192L128 224L64 192L48 64L128 32Z" fill="white"/><path d="M128 32V224L192 192L208 64L128 32Z" fill="#EBEBEB"/></svg>`,
    HTML5: `<svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M128 0L256 48L232 208L128 256L24 208L0 48L128 0Z" fill="#E44D26"/><path d="M128 0V256L232 208L256 48L128 0Z" fill="#F16529"/><path d="M128 32L208 64L192 192L128 224L64 192L48 64L128 32Z" fill="white"/><path d="M128 32V224L192 192L208 64L128 32Z" fill="#EBEBEB"/></svg>`,
  };

  getSkillIcon(skill: string): string | null {
    // Normalize for common variants
    if (skill.toLowerCase() === "typescript")
      return this.skillIcons["TypeScript"];
    if (skill.toLowerCase() === "javascript")
      return this.skillIcons["JavaScript"];
    if (skill.toLowerCase() === "reactjs" || skill.toLowerCase() === "react")
      return this.skillIcons["React"];
    if (
      skill.toLowerCase() === "angularjs" ||
      skill.toLowerCase() === "angular"
    )
      return this.skillIcons["Angular"];
    if (skill.toLowerCase() === "css3" || skill.toLowerCase() === "css")
      return this.skillIcons["CSS3"];
    if (skill.toLowerCase() === "html5" || skill.toLowerCase() === "html")
      return this.skillIcons["HTML5"];
    return this.skillIcons[skill] || null;
  }

  // Skills Array
  skills: string[] = [
    ...this.programmingLanguages,
    ...this.frameworks,
    ...this.tools,
    ...this.databases,
    ...this.cloudPlatforms,
  ];

  skillCategories: SkillCategory[] = [
    {
      name: "Programming Languages",
      skills: this.programmingLanguages,
    },
    {
      name: "Frameworks",
      skills: this.frameworks,
    },
    {
      name: "Tools",
      skills: this.tools,
    },
    {
      name: "Databases",
      skills: this.databases,
    },
    {
      name: "Cloud Platforms",
      skills: this.cloudPlatforms,
    },
  ];
}
