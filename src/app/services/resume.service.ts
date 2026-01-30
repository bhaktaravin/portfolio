import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  constructor() { }

  generateResume(): string {
    const resume = `
RAVIN BHAKTA
Oakland, CA | LinkedIn | GitHub | Portfolio
Email: ravin@example.com | Phone: (555) 123-4567

═══════════════════════════════════════════════════════════════════════════════

PROFESSIONAL SUMMARY
Full-stack developer with 4+ years of enterprise software development experience at Blue Shield of California. Expertise in building scalable applications using modern technologies including Angular, React, Python, and cloud platforms. Proven track record of optimizing system performance, mentoring junior developers, and delivering high-quality solutions in agile environments.

═══════════════════════════════════════════════════════════════════════════════

TECHNICAL SKILLS
Languages: TypeScript, Python, SQL, Java, C#, VBA, PowerShell
Frontend: Angular, React, Vue.js, HTML5, CSS3, Tailwind CSS
Backend: FastAPI, Flask, ASP.NET MVC, Node.js
Databases: SQL Server, Oracle, Firebase, DynamoDB
Tools & Platforms: Git/SVN, AWS, Azure, Firebase, Vercel, Docker

═══════════════════════════════════════════════════════════════════════════════

PROFESSIONAL EXPERIENCE

Associate, Application Developer | Blue Shield of California, Oakland, CA | Jul 2021 – Jun 2025
• Leveraged VBA, PowerShell, and version control tools (SVN/Git) for enterprise software development
• Applied debugging and integration techniques for APIs and RESTful architectures to optimize performance
• Demonstrated expert proficiency in SQL, writing complex queries and supporting data modeling
• Mentored junior developers on best practices and modern development techniques
• Impact: Improved system performance by 40%; reduced operational costs by 30%

Product Delivery Manager | Entappia, Palo Alto, CA | Aug 2019 – Jul 2021
• Integrated SAP Open Connectors with cloud databases (Firebase, Amazon DynamoDB)
• Modernized legacy codebases through refactoring and updating to contemporary standards
• Led cross-functional teams to deliver products on time and within budget
• Impact: Achieved 30% operational cost reduction; improved system scalability by 200%

Quality Assurance Intern | Housing Authority, Los Angeles, CA | Sep 2018 – May 2019
• Redesigned application processing from XML to C# format, improving reliability to 99% uptime
• Implemented user-friendly website redesigns using C#, Bootstrap, and KendoUI
• Redesigned applicant portal using ASP.NET MVC with Entity Framework and SQL Server
• Impact: Improved user experience by 60%; increased processing speed by 3x

═══════════════════════════════════════════════════════════════════════════════

FEATURED PROJECTS

MangaViewer | Angular, TypeScript, PWA, CSS3
Modern manga reading platform with optimized performance and responsive design. Implemented lazy loading, image preloading, and efficient caching resulting in 50% faster page load times and 95/100 Lighthouse score.
GitHub: https://github.com/ravinbhakta/mangaviewer | Live: https://mangaviewer-rust-angular.vercel.app

Pokemon Palace Quest | React, TypeScript, Tailwind CSS, Vite
Interactive quiz game leveraging Pokemon API with multiple game modes and animations. Handles 1000+ daily game sessions with optimized API integration and smooth cross-device experience.
GitHub: https://github.com/bhaktaravin/poke-pal-quiz | Live: https://poke-pal-quiz.vercel.app

Python Job Recommender | Python, FastAPI, Flask, SQLAlchemy, Pandas
Automated job scraper and recommendation engine analyzing 50K+ job listings with 85% recommendation accuracy. Asynchronous architecture with 200ms API response times.
GitHub: https://github.com/yourusername/python-job-recommender

═══════════════════════════════════════════════════════════════════════════════

EDUCATION
Bachelor of Science in Computer Science | California State University, Northridge | 2016 – 2020
Comprehensive computer science education with focus on software engineering, algorithms, and system design. GPA: 3.7

═══════════════════════════════════════════════════════════════════════════════

CERTIFICATIONS & ACHIEVEMENTS
✓ Expert in enterprise software development and system modernization
✓ Proficient in full-stack development across multiple frameworks and platforms
✓ Experienced in leading and mentoring development teams
✓ Active open-source contributor with 500+ commits annually
    `;
    return resume.trim();
  }

  downloadResume(filename: string = 'Ravin_Bhakta_Resume.txt'): void {
    const resumeContent = this.generateResume();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(resumeContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  downloadResumeAsPDF(filename: string = 'Ravin_Bhakta_Resume.pdf'): void {
    // This requires a PDF library. For now, we'll provide instructions
    const resumeContent = this.generateResume();
    console.log('PDF download would require a library like jsPDF or pdfkit');
    console.log('Resume content generated, ready for PDF conversion');
    // Alternative: Point to your hosted PDF or use a PDF generation service
  }

  getResumeAsText(): string {
    return this.generateResume();
  }

  getResumeAsHTML(): string {
    const resumeText = this.generateResume();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Ravin Bhakta Resume</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 850px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
            line-height: 1.6;
            background-color: #f5f5f5;
          }
          .resume {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          h1 {
            font-size: 24px;
            margin: 0 0 5px 0;
            text-align: center;
          }
          .contact-info {
            text-align: center;
            font-size: 13px;
            margin-bottom: 20px;
            color: #666;
          }
          .section-header {
            font-weight: bold;
            font-size: 14px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
          }
          .job-title {
            font-weight: bold;
            font-size: 13px;
          }
          .job-details {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
          }
          ul {
            margin: 8px 0;
            padding-left: 20px;
            font-size: 13px;
          }
          li {
            margin-bottom: 4px;
          }
          @media print {
            body { background-color: white; }
            .resume { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="resume">
          <pre>${escapeHtml(resumeText)}</pre>
        </div>
      </body>
      </html>
    `;
    return htmlContent;
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
