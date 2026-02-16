import { Component, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: number;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface QuickAction {
  label: string;
  query: string;
  icon: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Chat Button -->
    <button
      class="chat-fab"
      [class.open]="isOpen()"
      (click)="toggleChat()"
      [attr.aria-label]="isOpen() ? 'Close chat' : 'Chat with AI assistant'"
      title="Chat with me"
    >
      <span class="fab-icon" *ngIf="!isOpen()">💬</span>
      <span class="fab-icon close" *ngIf="isOpen()">✕</span>
      <span class="fab-pulse" *ngIf="!isOpen() && !hasInteracted()"></span>
    </button>

    <!-- Chat Window -->
    <div class="chat-window" [class.open]="isOpen()" *ngIf="isOpen()">
      <!-- Header -->
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">
            <span>RB</span>
            <span class="status-dot"></span>
          </div>
          <div class="chat-header-text">
            <h3>Ravin's Assistant</h3>
            <p>Ask me anything about Ravin</p>
          </div>
        </div>
        <button class="chat-close" (click)="toggleChat()" aria-label="Close chat">✕</button>
      </div>

      <!-- Messages -->
      <div class="chat-messages" #messagesContainer>
        <div
          *ngFor="let msg of messages(); trackBy: trackByMessage"
          class="message"
          [class.user]="msg.role === 'user'"
          [class.bot]="msg.role === 'bot'"
        >
          <div class="message-avatar" *ngIf="msg.role === 'bot'">🤖</div>
          <div class="message-bubble">
            <p [innerHTML]="formatMessage(msg.text)"></p>
            <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
          </div>
        </div>

        <div class="typing-indicator" *ngIf="isTyping()">
          <div class="message-avatar">🤖</div>
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions" *ngIf="messages().length <= 1">
        <button
          *ngFor="let action of quickActions"
          class="quick-action-btn"
          (click)="sendQuickAction(action)"
        >
          <span>{{ action.icon }}</span> {{ action.label }}
        </button>
      </div>

      <!-- Input -->
      <div class="chat-input-wrapper">
        <input
          class="chat-input"
          type="text"
          [(ngModel)]="userInput"
          (keydown.enter)="sendMessage()"
          placeholder="Ask about skills, experience, projects..."
          [disabled]="isTyping()"
        />
        <button
          class="chat-send"
          (click)="sendMessage()"
          [disabled]="!userInput.trim() || isTyping()"
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = signal(false);
  isTyping = signal(false);
  hasInteracted = signal(false);
  userInput = '';
  private messageIdCounter = 0;

  messages = signal<ChatMessage[]>([
    {
      id: 0,
      role: 'bot',
      text: "Hi there! 👋 I'm Ravin's portfolio assistant. Ask me about his skills, experience, projects, or anything else!",
      timestamp: new Date(),
    },
  ]);

  quickActions: QuickAction[] = [
    { label: 'Skills & Tech', query: 'What are your technical skills?', icon: '🛠️' },
    { label: 'Experience', query: 'Tell me about your work experience', icon: '💼' },
    { label: 'Projects', query: 'What projects have you built?', icon: '🚀' },
    { label: 'Contact', query: 'How can I contact you?', icon: '📧' },
  ];

  // Knowledge base from resume
  private readonly knowledge = {
    name: 'Ravin Bhakta',
    title: 'Full-Stack Engineer',
    location: 'Fremont, CA',
    email: 'ravin.bhakta@gmail.com',
    phone: '5107557264',
    linkedin: 'linkedin.com/in/ravinbhakta',
    github: 'github.com/bhaktaravin',

    summary: 'Full-stack developer with 4+ years of experience at Blue Shield of California, specializing in enterprise web apps, APIs, and cloud solutions. Expert in Angular, React, TypeScript, Python, and AWS.',

    skills: {
      languages: ['TypeScript', 'Python', 'SQL', 'Java', 'C#', 'JavaScript', 'HTML/CSS'],
      frontend: ['Angular', 'React', 'Vue.js', 'Tailwind CSS', 'Bootstrap'],
      backend: ['FastAPI', 'Flask', 'ASP.NET', 'Node.js', 'Spring Boot', 'Django'],
      cloud: ['AWS (EC2, S3, Lambda)', 'Azure', 'Docker', 'Kubernetes'],
      databases: ['PostgreSQL', 'MongoDB', 'SQLite', 'DynamoDB', 'Firebase'],
      tools: ['Git', 'SVN', 'Jira', 'CI/CD', 'Jenkins', 'Terraform'],
    },

    experience: [
      {
        title: 'Operations Associate Applications Developer',
        company: 'Blue Shield of California',
        period: 'Jul 2021 – Jun 2025',
        highlights: [
          'Automated workflows using VBA and PowerShell, reducing manual processing by 30%',
          'Debugged and optimized REST APIs, cutting incident resolution time by 40%',
          'Led version control best practices (SVN/Git) for faster collaboration',
          'Supported 1,000+ users with improved system reliability',
        ],
      },
      {
        title: 'Software Developer',
        company: 'Entappia',
        period: 'Aug 2019 – Jul 2021',
        highlights: [
          'Built RESTful APIs boosting system integration speed by 50%',
          'Integrated SAP Open Connectors with cloud databases, reducing data latency by 25%',
          'Modernized legacy codebases, cutting maintenance costs by 20%',
        ],
      },
      {
        title: 'Quality Assurance Intern',
        company: 'Housing Authority of LA',
        period: 'Sep 2018 – May 2019',
        highlights: [
          'Created automated test scripts reducing manual test effort by 40%',
          'Identified and documented 200+ bugs improving software quality',
        ],
      },
    ],

    projects: [
      {
        name: 'MangaViewer',
        tech: 'Angular, TypeScript, PWA',
        description: 'Modern manga reading app with optimized performance, responsive design, and PWA capabilities. Features lazy loading and touch gestures.',
      },
      {
        name: 'Python Job Recommender',
        tech: 'Python, Flask, FastAPI, SQLAlchemy, Pandas',
        description: 'Automated job scraper and recommendation system. Scrapes 50K+ jobs daily with 85% recommendation accuracy.',
      },
      {
        name: 'Pokemon Palace Quest',
        tech: 'React, TypeScript, Vite, Tailwind',
        description: 'Interactive quiz game for guessing Gen 1 Pokemon, featuring multiple game modes and 1000+ daily sessions.',
      },
    ],

    education: {
      degree: 'B.S. Computer Science',
      school: 'Cal State University, Northridge (CSUN)',
      period: '2016–2020',
      gpa: '3.7',
    },

    certifications: [
      'AWS Certified Solutions Architect – Associate',
      'Certified Kubernetes Application Developer (CKAD)',
      'SAP Certified Application Associate',
      'CompTIA Security+',
    ],

    availability: 'Currently open to freelance and full-time opportunities',
  };

  // Intent patterns for matching
  private readonly intents: { patterns: RegExp[]; handler: () => string }[] = [
    {
      patterns: [/\b(hi|hello|hey|sup|yo|greet|howdy)\b/i],
      handler: () => "Hey! 👋 I'm here to help you learn about Ravin. Feel free to ask about his **skills**, **experience**, **projects**, or **education**!",
    },
    {
      patterns: [/\b(skill|tech|stack|language|framework|tool|know|proficien)/i],
      handler: () => {
        const k = this.knowledge.skills;
        return `**Technical Skills:**\n\n🔤 **Languages:** ${k.languages.join(', ')}\n\n🎨 **Frontend:** ${k.frontend.join(', ')}\n\n⚙️ **Backend:** ${k.backend.join(', ')}\n\n☁️ **Cloud:** ${k.cloud.join(', ')}\n\n🗄️ **Databases:** ${k.databases.join(', ')}\n\n🛠️ **Tools:** ${k.tools.join(', ')}`;
      },
    },
    {
      patterns: [/\b(experience|work|job|career|employ|company|compan|profession|where.*work)/i],
      handler: () => {
        return this.knowledge.experience.map(e => {
          const bullets = e.highlights.map(h => '• ' + h).join('\n');
          return `**${e.title}** at *${e.company}*\n📅 ${e.period}\n${bullets}`;
        }).join('\n\n---\n\n');
      },
    },
    {
      patterns: [/\b(project|portfolio|built|build|app|application|made|create)/i],
      handler: () => {
        return '**Featured Projects:**\n\n' + this.knowledge.projects.map(p =>
          `🚀 **${p.name}** _(${p.tech})_\n${p.description}`
        ).join('\n\n');
      },
    },
    {
      patterns: [/\b(education|school|university|college|degree|study|gpa|academic)/i],
      handler: () => {
        const e = this.knowledge.education;
        return `🎓 **${e.degree}**\n📍 ${e.school}\n📅 ${e.period}\n📊 GPA: ${e.gpa}`;
      },
    },
    {
      patterns: [/\b(certif|credential|aws|kubernetes|ckad|sap|comptia|security\+)/i],
      handler: () => {
        return '**Certifications:**\n\n' + this.knowledge.certifications.map(c => `🏅 ${c}`).join('\n');
      },
    },
    {
      patterns: [/\b(contact|email|phone|reach|hire|connect|linkedin|github|social)/i],
      handler: () => {
        return `**Get in Touch:**\n\n📧 Email: ${this.knowledge.email}\n📱 Phone: ${this.knowledge.phone}\n💼 LinkedIn: ${this.knowledge.linkedin}\n🐙 GitHub: ${this.knowledge.github}\n📍 Location: ${this.knowledge.location}\n\n${this.knowledge.availability}`;
      },
    },
    {
      patterns: [/\b(about|who|tell me|overview|summary|intro|background)/i],
      handler: () => {
        return `**About ${this.knowledge.name}:**\n\n${this.knowledge.summary}\n\n📍 Based in ${this.knowledge.location}\n🎓 ${this.knowledge.education.degree} from ${this.knowledge.education.school}\n\n${this.knowledge.availability}`;
      },
    },
    {
      patterns: [/\b(avail|freelance|hire|open|opportunity|looking|status)/i],
      handler: () => {
        return `✅ **${this.knowledge.availability}**\n\nFeel free to reach out:\n📧 ${this.knowledge.email}\n💼 ${this.knowledge.linkedin}`;
      },
    },
    {
      patterns: [/\b(blue\s*shield|bsc|health\s*care|insurance)/i],
      handler: () => {
        const bsc = this.knowledge.experience[0];
        const bullets = bsc.highlights.map(h => '• ' + h).join('\n');
        return `**${bsc.title}** at *${bsc.company}*\n📅 ${bsc.period}\n\n${bullets}`;
      },
    },
    {
      patterns: [/\b(entappia|sap|startup)/i],
      handler: () => {
        const ent = this.knowledge.experience[1];
        const bullets = ent.highlights.map(h => '• ' + h).join('\n');
        return `**${ent.title}** at *${ent.company}*\n📅 ${ent.period}\n\n${bullets}`;
      },
    },
    {
      patterns: [/\b(angular|react|vue|frontend|front.?end)/i],
      handler: () => {
        return `**Frontend Expertise:**\n\n🅰️ **Angular** — Primary framework, used for enterprise apps & this portfolio\n⚛️ **React** — Used for Pokemon Palace Quest game\n💚 **Vue.js** — Experience with Vue ecosystem\n\nPlus: Tailwind CSS, Bootstrap, HTML5, CSS3, TypeScript`;
      },
    },
    {
      patterns: [/\b(python|flask|fastapi|django|backend|back.?end)/i],
      handler: () => {
        return `**Backend Expertise:**\n\n🐍 **Python** — Flask, FastAPI, Django\n☕ **Java** — Spring Boot\n🟢 **Node.js** — Express, REST APIs\n🔷 **C#** — ASP.NET\n\nBuilt RESTful APIs with 50% faster integration speed and 200ms response times.`;
      },
    },
    {
      patterns: [/\b(cloud|aws|azure|docker|kubernetes|devops|deploy)/i],
      handler: () => {
        return `**Cloud & DevOps:**\n\n☁️ **AWS** — EC2, S3, Lambda (Certified Solutions Architect)\n🔵 **Azure** — Cloud services\n🐳 **Docker** — Containerization\n☸️ **Kubernetes** — CKAD Certified\n🔧 **CI/CD** — Jenkins, GitHub Actions, Terraform`;
      },
    },
    {
      patterns: [/\b(manga|viewer|reading)/i],
      handler: () => {
        const p = this.knowledge.projects[0];
        return `📖 **${p.name}**\n\n${p.description}\n\n**Tech:** ${p.tech}\n\n**Metrics:**\n• 1.2s page load time (50% faster)\n• 95/100 Lighthouse mobile score\n• 40% increase in user engagement`;
      },
    },
    {
      patterns: [/\b(pokemon|quiz|game|poke)/i],
      handler: () => {
        const p = this.knowledge.projects[2];
        return `🎮 **${p.name}**\n\n${p.description}\n\n**Tech:** ${p.tech}\n\n**Metrics:**\n• 1000+ daily game sessions\n• 68% quiz completion rate\n• 0.8s initial load time`;
      },
    },
    {
      patterns: [/\b(job.*recommend|recommend.*job|scraper|smart)/i],
      handler: () => {
        const p = this.knowledge.projects[1];
        return `💼 **${p.name}**\n\n${p.description}\n\n**Tech:** ${p.tech}\n\n**Metrics:**\n• 50K+ jobs scraped daily\n• 85% recommendation accuracy\n• 200ms API response time`;
      },
    },
    {
      patterns: [/\b(thanks?|thank\s*you|thx|appreciate)/i],
      handler: () => "You're welcome! 😊 Let me know if you have any other questions about Ravin's background.",
    },
    {
      patterns: [/\b(bye|goodbye|see\s*ya|later|cya)/i],
      handler: () => "Goodbye! 👋 Feel free to come back anytime. You can also reach Ravin directly at ravin.bhakta@gmail.com.",
    },
  ];

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen.update(v => !v);
    this.hasInteracted.set(true);
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: ++this.messageIdCounter,
      role: 'user',
      text,
      timestamp: new Date(),
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.userInput = '';
    this.isTyping.set(true);

    // Simulate typing delay
    const delay = Math.min(300 + text.length * 10, 1500);
    setTimeout(() => {
      const response = this.getResponse(text);
      const botMsg: ChatMessage = {
        id: ++this.messageIdCounter,
        role: 'bot',
        text: response,
        timestamp: new Date(),
      };
      this.messages.update(msgs => [...msgs, botMsg]);
      this.isTyping.set(false);
    }, delay);
  }

  sendQuickAction(action: QuickAction): void {
    this.userInput = action.query;
    this.sendMessage();
  }

  private getResponse(input: string): string {
    const lower = input.toLowerCase();

    for (const intent of this.intents) {
      for (const pattern of intent.patterns) {
        if (pattern.test(lower)) {
          return intent.handler();
        }
      }
    }

    // Fallback
    return "I'm not sure about that, but you can ask me about Ravin's **skills**, **experience**, **projects**, **education**, **certifications**, or **contact info**! 😊";
  }

  formatMessage(text: string): string {
    return text
      .replaceAll(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replaceAll(/\*(.*?)\*/g, '<em>$1</em>')
      .replaceAll(/_(.*?)_/g, '<em>$1</em>')
      .replaceAll('\n', '<br>');
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  trackByMessage(index: number, msg: ChatMessage): number {
    return msg.id;
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (err: unknown) {
      console.debug('Scroll error:', err);
    }
  }
}
