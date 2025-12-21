
import { Component } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Document, Packer, Paragraph, TextRun } from 'docx';


// ...existing interfaces...
interface Certification {
  name: string;
  issuer: string;
  year: string;
}


interface Stat {
  value: string;
  label: string;
}

interface SkillCategory {
  name: string;
  skills: string[];
}

interface WorkExperience {
  title: string;
  company: string;
  period: string;
  description: string;
}



interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
}



@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})


export class App {
  title = 'Portfolio';
  
  // Dark mode functionality
  isDarkMode = false;
  
  constructor() {
    pdfMake.vfs = pdfFonts.vfs;
  }
  
  
  
  
  // Personal Information - Directional, resume-focused
  fullName = 'Ravin Bhakta';
  jobTitle = 'Full-Stack Engineer – Enterprise & Cloud Applications';
  heroDescription = 'Full-Stack Engineer with 5+ years of experience building enterprise APIs, internal tools, and scalable cloud solutions. Known for technical depth in full-stack web apps and system optimization.';
  aboutDescription = 'I build and scale enterprise-grade web applications, specializing in full-stack development (React, Angular, Java Spring, Python/Django) and cloud integration (AWS, Heroku, SAP). My focus is on delivering robust APIs, optimizing system performance, and supporting business growth through technical leadership.';
  email = 'ravin.bhakta@gmail.com';
  phone = '5107557264';
  location = 'Fremont, CA';
  resumeLink = '#'; // Add your resume link
  currentYear = new Date().getFullYear();
  
  // Get initials for profile image
  get initials(): string {
    return this.fullName.split(' ').map(name => name.charAt(0)).join('');
  }
  
  // Statistics
  stats: Stat[] = [
    { value: '5+', label: 'Years Experience' },
    { value: '10+', label: 'Projects Completed' },
    { value: '3', label: 'Companies Worked' },
    { value: '15+', label: 'Technologies' }
  ];
  
  // Skills Categories - Sharpened for credibility and focus
  skillCategories: SkillCategory[] = [
    {
      name: 'Frontend',
      skills: ['Angular', 'React', 'Spring Boot (Thymeleaf)']
    },
    {
      name: 'Backend',
      skills: ['Java (Spring)', 'Python (Django)', 'Ruby on Rails']
    },
    {
      name: 'Cloud',
      skills: ['AWS', 'Heroku', 'SAP']
    }
  ];
  
  // Work Experience - Clean, chronological, with impact summary and technical focus
  workExperience: WorkExperience[] = [
    {
      title: 'Operations Associate Applications Developer',
      company: 'Blue Shield of California',
      period: 'July 2021 - June 2025',
      description: 'Focused on enterprise APIs, internal tools, and system optimization. Automated key workflows using VBA and PowerShell, reducing manual processing time by 30% and minimizing errors in enterprise operations. Debugged and optimized REST APIs, decreasing incident resolution time by 40% and improving system reliability for 1,000+ users. Led version control best practices (SVN/Git), enabling faster team collaboration and reducing deployment issues.'
    },
    {
      title: 'Software Developer',
      company: 'Entappia',
      period: 'August 2019 - June 2021',
      description: 'Specialized in full-stack web apps and cloud integration. Designed and launched RESTful APIs, boosting system integration speed by 50% and supporting seamless data exchange across platforms. Integrated SAP Open Connectors with cloud databases (Firebase, DynamoDB), improving scalability and reducing data latency by 25%. Modernized legacy codebases, cutting maintenance costs by 20% and increasing feature delivery velocity.'
    },
    {
      title: 'Quality Assurance Intern',
      company: 'Los Angeles Housing Authority',
      period: 'August 2018 - April 2019',
      description: 'Contributed to enterprise tooling and automation. Migrated data storage from XML to C#, accelerating processing speed by 3x and supporting faster applicant onboarding. Revamped user portal UI with C#, Bootstrap, and KendoUI, increasing user satisfaction and reducing support tickets. Redesigned housing authority portal (ASP.NET MVC, SQL Server), enabling secure, scalable access for thousands of tenants.'
    }
  ];

  // Certifications (no duplicates)
  certifications: Certification[] = [
    { name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', year: '2024' },
    { name: 'Certified Kubernetes Application Developer (CKAD)', issuer: 'Cloud Native Computing Foundation', year: '2023' },
    { name: 'SAP Certified Application Associate', issuer: 'SAP', year: '2022' },
    { name: 'CompTIA Security+', issuer: 'CompTIA', year: '2021' }
  ];

 
  
  // Social Links
  socialLinks: SocialLink[] = [
    { platform: 'GitHub', url: 'https://github.com/bhaktaravin', icon: '🐙' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ravin-rohitbhai-bhakta', icon: '💼' },
    { platform: 'Email', url: 'mailto:ravin.bhakta@gmail.com', icon: '�' },
    { platform: 'Phone', url: 'tel:5107557264', icon: '�' }
  ];
  
  // Education (cleaned, no high school)
  education: Education[] = [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'California State University, Los Angeles',
      period: 'August 2015 - April 2019',
      location: 'Los Angeles, CA'
    }
  ];
  
  // File type selection for resume download
  selectedFileType: 'pdf' | 'docx' = 'pdf';

 

  async downloadResume() {
    if (this.selectedFileType === 'pdf') {
      const docDefinition = {
        content: [
          { text: this.fullName, style: 'header' },
          { text: this.jobTitle, style: 'subheader' },
          { text: this.aboutDescription, margin: [0, 10, 0, 10] },
          { text: 'Email: ' + this.email },
          { text: 'Phone: ' + this.phone },
          { text: 'Location: ' + this.location },
        ]
      };
      pdfMake.createPdf(docDefinition).download(`${this.fullName}-Resume.pdf`);
    } else if (this.selectedFileType === 'docx') {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({ children: [new TextRun({ text: this.fullName, bold: true, size: 32 })] }),
              new Paragraph({ children: [new TextRun({ text: this.jobTitle, italics: true, size: 24 })] }),
              new Paragraph(this.aboutDescription),
              new Paragraph('Email: ' + this.email),
              new Paragraph('Phone: ' + this.phone),
              new Paragraph('Location: ' + this.location),
            ]
          }
        ]
      });
      const blob = await Packer.toBlob(doc);
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.fullName}-Resume.docx`;
      a.click();
      globalThis.URL.revokeObjectURL(url);
    }
  }

  // Contact form submission
  onSubmitContact(): void {
    // Add your contact form logic here
    alert('Thank you for your message! I will get back to you soon.');
  }
}
