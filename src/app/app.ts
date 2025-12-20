import { Component } from '@angular/core';



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
  
  constructor() {}
  
  
  
  
  // Personal Information - Update these with your details
  fullName = 'Ravin Bhakta';
  jobTitle = 'Mid-Level Software Engineer | Full-Stack Developer | JavaScript, TypeScript, Node.js, React | Building Scalable Web Apps | AWS | Agile';
  heroDescription = 'Skilled Software Engineer with robust experience in Rust and Java development, API integration, and agile methodologies. Demonstrates proven expertise in building and maintaining scalable enterprise solutions, optimizing system performance, and collaborating with cross-functional teams.';
  aboutDescription = 'Skilled Software Engineer with robust experience in Rust and Java development, API integration, and agile methodologies. Demonstrates proven expertise in building and maintaining scalable enterprise solutions, optimizing system performance, and collaborating with cross-functional teams. Bringing strong debugging, SQL, and full-stack development proficiency to deliver efficient, modern applications.';
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
  
  // Skills Categories
  skillCategories: SkillCategory[] = [
    {
      name: 'Programming Languages',
      skills: ['Java', 'Rust', 'TypeScript', 'JavaScript', 'C#', 'Oracle PL/SQL', 'PowerShell ISE']
    },
    {
      name: 'Frontend Development',
      skills: ['ReactJS', 'AngularJS', 'Bootstrap', 'Kendo UI', 'HTML5', 'CSS3']
    },
    {
      name: 'Backend & Databases',
      skills: ['Node.js', 'Express', 'Mongoose', 'MongoDB', 'Supabase', 'Firebase', 'Oracle SQL Server']
    },
    {
      name: 'Cloud & DevOps',
      skills: ['AWS', 'Docker', 'GCP', 'Version Control (SVN/Git)', 'Agile/Scrum']
    }
  ];
  
  // Work Experience
  workExperience: WorkExperience[] = [
    {
      title: 'Operations Associate Applications Developer',
      company: 'Blue Shield of California',
      period: 'July 2021 - June 2025',
      description: 'Leveraged VBA, PowerShell, and version control tools (SVN/Git) to support software development and maintenance in an enterprise environment. Applied debugging and integration techniques for APIs, services, and RESTful architectures to resolve complex business challenges and optimize system performance.'
    },
    {
      title: 'Software Developer',
      company: 'Entappia',
      period: 'August 2019 - June 2021',
      description: 'Developed RESTful APIs, increasing integration capabilities and enhanced system interconnectivity. Integrated SAP Open Connectors with cloud databases such as Firebase and Amazon DynamoDB to enhance system performance and scalability. Revamped legacy codebases by updating and modularizing, aligning them with modern standards, reducing costs, and enhancing functionality.'
    },
    {
      title: 'Quality Assurance Intern',
      company: 'Los Angeles Housing Authority',
      period: 'August 2018 - April 2019',
      description: 'Increased processing speed by transitioning from XML to C# storage system. Implemented a more user-friendly website by making it look more modern using C# and Bootstrap along with KendoUI. Redesigned future applicant/current tenant housing authority portal using ASP.NET MVC with Entity, Kendo UI, and SQL Server.'
    }
  ];

 
  
  // Social Links
  socialLinks: SocialLink[] = [
    { platform: 'GitHub', url: 'https://github.com/bhaktaravin', icon: '🐙' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ravin-rohitbhai-bhakta', icon: '💼' },
    { platform: 'Email', url: 'mailto:ravin.bhakta@gmail.com', icon: '�' },
    { platform: 'Phone', url: 'tel:5107557264', icon: '�' }
  ];
  
  // Education
  education: Education[] = [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'California State University, Los Angeles',
      period: 'August 2015 - April 2019',
      location: 'Los Angeles, CA'
    }
  ];
  
  // Contact form submission
  onSubmitContact(): void {
    // Add your contact form logic here
    alert('Thank you for your message! I will get back to you soon.');
  }
}
