import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


interface SkillCategory {
  name: string;
  skills: string[];
}


@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.css']
})


export class SkillsComponent {

  programmingLanguages: string[] = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C#',
    'C++',
    'Ruby',
    'Go',
    'Swift',
    'Kotlin',
    'PHP'
  ];

  frameworks: string[] = [
    'Angular',
    'React',
    'Vue.js',
    'Node.js',
    'Django',
    'Spring Boot',
    '.NET Core',
    'Express.js',
    'Flask',
    'Ruby on Rails',
    'Laravel',
    
  ];

  tools: string[] = [
    'Git',
    'Docker',
    'Jenkins',
    'Webpack',
    'VS Code',
    'Postman',
    'JIRA',
    'Figma',
    'Linux',
    'npm',
    'Yarn'
  ];
  databases: string[] = [
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'SQLite',
    'Redis',
    'Firebase',
    'Oracle'
  ];

  cloudPlatforms: string[] = [
    'AWS',
    'Azure',
    'Google Cloud Platform',
    'Heroku',
    'DigitalOcean',
    'SAP',
    
  ];

  // Skills Array
  skills: string[] = [
    ...this.programmingLanguages,
    ...this.frameworks,
    ...this.tools,
    ...this.databases,
    ...this.cloudPlatforms
  ];

  skillCategories: SkillCategory[] = [
    {
      name: 'Programming Languages',
      skills: this.programmingLanguages
    },
    {
      name: 'Frameworks',
      skills: this.frameworks
    },
    {
      name: 'Tools',
      skills: this.tools
    },
    {
      name: 'Databases',
      skills: this.databases
    },
    {
      name: 'Cloud Platforms',
      skills: this.cloudPlatforms
    }
  ];
}
