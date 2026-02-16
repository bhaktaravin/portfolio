import { Component, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface TerminalEntry {
  command: string;
  response: SafeHtml;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
})
export class TerminalComponent implements AfterViewInit {
  @ViewChild('terminalBody') terminalBody!: ElementRef<HTMLDivElement>;
  @ViewChild('terminalInput') terminalInput!: ElementRef<HTMLInputElement>;

  currentCommand = '';
  history: TerminalEntry[] = [];
  commandHistory: string[] = [];
  historyIndex = -1;
  showWelcome = true;
  prompt = 'ravin@portfolio:~$ ';
  quickCommands = ['help', 'about', 'skills', 'projects', 'experience', 'contact'];

  asciiArt = `
 ██████╗  █████╗ ██╗   ██╗██╗███╗   ██╗
 ██╔══██╗██╔══██╗██║   ██║██║████╗  ██║
 ██████╔╝███████║██║   ██║██║██╔██╗ ██║
 ██╔══██╗██╔══██║╚██╗ ██╔╝██║██║╚██╗██║
 ██║  ██║██║  ██║ ╚████╔╝ ██║██║ ╚████║
 ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═╝  ╚═══╝
  `;

  private commands: Record<string, () => string> = {
    help: () => this.cmdHelp(),
    about: () => this.cmdAbout(),
    skills: () => this.cmdSkills(),
    experience: () => this.cmdExperience(),
    projects: () => this.cmdProjects(),
    education: () => this.cmdEducation(),
    contact: () => this.cmdContact(),
    whoami: () => this.cmdWhoami(),
    neofetch: () => this.cmdNeofetch(),
    ls: () => this.cmdLs(),
    cat: () => this.cmdCat(),
    date: () => this.cmdDate(),
    clear: () => { this.clearTerminal(); return ''; },
    pwd: () => '<span class="cmd-value">/home/ravin/portfolio</span>',
    echo: () => '<span class="cmd-muted">Usage: echo &lt;message&gt;</span>',
    sudo: () => '<span class="error-text">Nice try! 🔒 Permission denied.</span>',
    exit: () => '<span class="cmd-warn">There is no escape... just kidding!</span><br><span class="cmd-muted">Type <span class="cmd-highlight">help</span> for available commands.</span>',
    history: () => this.cmdHistory(),
    man: () => '<span class="cmd-muted">Manual not found. Try <span class="cmd-highlight">help</span> instead.</span>',
    cd: () => '<span class="cmd-muted">You\'re already home. 🏠</span>',
    rm: () => '<span class="error-text">⚠️ I like my files where they are, thank you.</span>',
    curl: () => this.cmdCurl(),
    ping: () => this.cmdPing(),
    fortune: () => this.cmdFortune(),
    cowsay: () => this.cmdCowsay(),
    matrix: () => '<span class="cmd-success">Wake up, Neo... The Matrix has you.</span><br><span class="cmd-muted">Follow the white rabbit. 🐇</span>',
  };

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.focusInput(), 100);
  }

  focusInput(): void {
    this.terminalInput?.nativeElement?.focus();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.executeCommand(this.currentCommand.trim());
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.commandHistory.length > 0) {
        if (this.historyIndex < this.commandHistory.length - 1) {
          this.historyIndex++;
        }
        this.currentCommand = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.currentCommand = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
      } else {
        this.historyIndex = -1;
        this.currentCommand = '';
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      this.autocomplete();
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      this.clearTerminal();
    }
  }

  executeCommand(input: string): void {
    if (!input) {
      this.history.push({ command: '', response: this.sanitizer.bypassSecurityTrustHtml('') });
      this.scrollToBottom();
      return;
    }

    this.commandHistory.push(input);
    this.historyIndex = -1;

    const parts = input.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    let response: string;

    if (cmd === 'echo') {
      response = `<span class="cmd-value">${this.escapeHtml(input.substring(5))}</span>`;
    } else if (cmd === 'cat' && args.length > 0) {
      response = this.cmdCatFile(args[0]);
    } else if (this.commands[cmd]) {
      response = this.commands[cmd]();
    } else {
      response = `<span class="error-text">Command not found: ${this.escapeHtml(cmd)}</span><br><span class="cmd-muted">Type <span class="cmd-highlight">help</span> to see available commands.</span>`;
    }

    if (cmd !== 'clear') {
      this.history.push({
        command: input,
        response: this.sanitizer.bypassSecurityTrustHtml(response),
      });
    }

    this.currentCommand = '';
    this.scrollToBottom();
  }

  executeQuickCommand(cmd: string): void {
    this.currentCommand = cmd;
    this.executeCommand(cmd);
  }

  clearTerminal(): void {
    this.history = [];
    this.showWelcome = false;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.terminalBody?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }

  private autocomplete(): void {
    if (!this.currentCommand) return;
    const matches = Object.keys(this.commands).filter(c => c.startsWith(this.currentCommand.toLowerCase()));
    if (matches.length === 1) {
      this.currentCommand = matches[0];
    } else if (matches.length > 1) {
      const response = matches.map(m => `<span class="cmd-key">${m}</span>`).join('  ');
      this.history.push({
        command: this.currentCommand,
        response: this.sanitizer.bypassSecurityTrustHtml(response),
      });
      this.scrollToBottom();
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ─── COMMANDS ─────────────────────────────────────────────

  private cmdHelp(): string {
    return `
<span class="cmd-section-title">📋 Available Commands</span>
<table class="cmd-table">
  <tr><th>Command</th><th>Description</th></tr>
  <tr><td><span class="cmd-key">about</span></td><td>Learn about me</td></tr>
  <tr><td><span class="cmd-key">skills</span></td><td>View my technical skills</td></tr>
  <tr><td><span class="cmd-key">experience</span></td><td>Work experience timeline</td></tr>
  <tr><td><span class="cmd-key">projects</span></td><td>Browse my projects</td></tr>
  <tr><td><span class="cmd-key">education</span></td><td>Educational background</td></tr>
  <tr><td><span class="cmd-key">contact</span></td><td>How to reach me</td></tr>
  <tr><td><span class="cmd-key">whoami</span></td><td>Quick bio</td></tr>
  <tr><td><span class="cmd-key">neofetch</span></td><td>System info (portfolio style)</td></tr>
  <tr><td><span class="cmd-key">ls</span></td><td>List portfolio sections</td></tr>
  <tr><td><span class="cmd-key">cat &lt;file&gt;</span></td><td>Read a section file</td></tr>
  <tr><td><span class="cmd-key">history</span></td><td>Command history</td></tr>
  <tr><td><span class="cmd-key">fortune</span></td><td>Random dev wisdom</td></tr>
  <tr><td><span class="cmd-key">cowsay</span></td><td>Moo 🐄</td></tr>
  <tr><td><span class="cmd-key">date</span></td><td>Current date/time</td></tr>
  <tr><td><span class="cmd-key">clear</span></td><td>Clear the terminal</td></tr>
</table>
<br><span class="cmd-muted">Pro tip: Use ↑/↓ for history, Tab for autocomplete, Ctrl+L to clear</span>`;
  }

  private cmdAbout(): string {
    return `
<span class="cmd-section-title">👋 About Ravin Bhakta</span>

<span class="cmd-key">Role:</span>      <span class="cmd-value">Full Stack Developer</span>
<span class="cmd-key">Location:</span>  <span class="cmd-value">Bay Area, California</span>
<span class="cmd-key">Experience:</span><span class="cmd-value"> 5+ years in software development</span>

<span class="cmd-muted">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

With over 5 years of experience in full-stack development, I specialize
in building enterprise-grade applications that scale. My expertise spans
across modern web technologies, cloud platforms, and agile methodologies.

<span class="cmd-section-title">Core Competencies:</span>
 <span class="cmd-accent">▸</span> Frontend: Angular, React, TypeScript, Modern CSS
 <span class="cmd-accent">▸</span> Backend: Java Spring, Python/Django, Node.js, REST APIs
 <span class="cmd-accent">▸</span> Cloud & DevOps: AWS, Heroku, CI/CD, Docker
 <span class="cmd-accent">▸</span> Databases: SQL, NoSQL, Data Modeling, Performance Tuning

<span class="cmd-section-title">Key Achievements:</span>
 <span class="cmd-success">✓</span> Reduced system processing time by 30%
 <span class="cmd-success">✓</span> Improved API response times by 40%
 <span class="cmd-success">✓</span> Led migration from legacy systems, cutting costs by 20%
 <span class="cmd-success">✓</span> Integrated SAP connectors, reducing data latency by 25%`;
  }

  private cmdSkills(): string {
    const skills = [
      { name: 'Angular', level: 90 },
      { name: 'TypeScript', level: 88 },
      { name: 'Python', level: 85 },
      { name: 'Java / Spring', level: 82 },
      { name: 'SQL / Oracle', level: 85 },
      { name: 'React', level: 78 },
      { name: 'Node.js', level: 80 },
      { name: 'AWS / Cloud', level: 75 },
      { name: 'Docker / DevOps', level: 70 },
      { name: 'Git / VCS', level: 90 },
    ];

    const rows = skills.map(s => {
      const filled = Math.round(s.level / 5);
      const empty = 20 - filled;
      const bar = `<span class="cmd-success">${'█'.repeat(filled)}</span><span class="cmd-muted">${'░'.repeat(empty)}</span>`;
      return `  <span class="cmd-key">${s.name.padEnd(16)}</span> ${bar} <span class="cmd-value">${s.level}%</span>`;
    }).join('\n');

    return `
<span class="cmd-section-title">🛠️  Technical Skills</span>
<span class="cmd-muted">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

${rows}

<span class="cmd-section-title">📚 Currently Learning:</span>
 <span class="cmd-accent">▸</span> Machine Learning & AI
 <span class="cmd-accent">▸</span> Rust
 <span class="cmd-accent">▸</span> Web3 & Blockchain
 <span class="cmd-accent">▸</span> Kubernetes`;
  }

  private cmdExperience(): string {
    return `
<span class="cmd-section-title">💼 Professional Experience</span>
<span class="cmd-muted">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cmd-accent">┌─</span> <span class="cmd-value">Associate, Application Developer</span>
<span class="cmd-accent">│</span>  <span class="cmd-key">Blue Shield of California</span> · Oakland, CA
<span class="cmd-accent">│</span>  <span class="cmd-muted">Jul 2021 - Jun 2025</span>
<span class="cmd-accent">│</span>
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> Enterprise software development (VBA, PowerShell, Git)
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> API debugging & integration optimization (+40% perf)
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> Complex SQL queries & Oracle data modeling
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> Cross-functional team collaboration
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> Mentored junior developers
<span class="cmd-accent">└─────────────────────────────────────────</span>

<span class="cmd-accent">┌─</span> <span class="cmd-value">Product Delivery Manager</span>
<span class="cmd-accent">│</span>  <span class="cmd-key">Entappia</span> · Palo Alto, CA
<span class="cmd-accent">│</span>  <span class="cmd-muted">Aug 2019 - Jul 2021</span>
<span class="cmd-accent">│</span>
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> RESTful API development & integration
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> SAP + Firebase/DynamoDB cloud connectors
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> Legacy codebase modernization (-30% costs)
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> Agile methodology implementation
<span class="cmd-accent">└─────────────────────────────────────────</span>

<span class="cmd-accent">┌─</span> <span class="cmd-value">Quality Assurance Intern</span>
<span class="cmd-accent">│</span>  <span class="cmd-key">Housing Authority</span> · Los Angeles, CA
<span class="cmd-accent">│</span>  <span class="cmd-muted">Sep 2018 - May 2019</span>
<span class="cmd-accent">│</span>
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> Redesigned app processing (XML → C#)
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> Modernized UI with Bootstrap & KendoUI
<span class="cmd-accent">│</span>  <span class="cmd-success">✓</span> ASP.NET MVC portal development
<span class="cmd-accent">└─────────────────────────────────────────</span>`;
  }

  private cmdProjects(): string {
    return `
<span class="cmd-section-title">🚀 Featured Projects</span>
<span class="cmd-muted">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cmd-warn">01</span> <span class="cmd-value">MangaViewer</span>  <span class="cmd-muted">[Advanced]</span>
    Full-stack manga reading app with real-time updates
    <span class="cmd-key">Tech:</span> Angular · TypeScript · Spring Boot · Firebase
    <span class="cmd-link">→ github.com/ravin-it/MangaViewer</span>

<span class="cmd-warn">02</span> <span class="cmd-value">Job Recommender System</span>  <span class="cmd-muted">[Advanced]</span>
    AI-powered job matching with NLP analysis
    <span class="cmd-key">Tech:</span> Python · Django · scikit-learn · PostgreSQL
    <span class="cmd-link">→ github.com/ravin-it/job-recommender</span>

<span class="cmd-warn">03</span> <span class="cmd-value">Pokemon Quiz App</span>  <span class="cmd-muted">[Intermediate]</span>
    Interactive quiz game with 800+ Pokemon
    <span class="cmd-key">Tech:</span> Flutter · Dart · REST API
    <span class="cmd-link">→ github.com/ravin-it/pokemon-quiz</span>

<span class="cmd-muted">Type</span> <span class="cmd-highlight">cat projects/&lt;name&gt;</span> <span class="cmd-muted">for details on a specific project.</span>`;
  }

  private cmdEducation(): string {
    return `
<span class="cmd-section-title">🎓 Education</span>
<span class="cmd-muted">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cmd-accent">┌─</span> <span class="cmd-value">Bachelor of Science in Computer Science</span>
<span class="cmd-accent">│</span>  <span class="cmd-key">California State University, Los Angeles</span>
<span class="cmd-accent">│</span>  <span class="cmd-muted">Graduated 2019</span>
<span class="cmd-accent">│</span>
<span class="cmd-accent">│</span>  Relevant Coursework:
<span class="cmd-accent">│</span>  <span class="cmd-success">▸</span> Data Structures & Algorithms
<span class="cmd-accent">│</span>  <span class="cmd-success">▸</span> Software Engineering
<span class="cmd-accent">│</span>  <span class="cmd-success">▸</span> Database Management Systems
<span class="cmd-accent">│</span>  <span class="cmd-success">▸</span> Computer Networks
<span class="cmd-accent">│</span>  <span class="cmd-success">▸</span> Operating Systems
<span class="cmd-accent">└─────────────────────────────────────────</span>`;
  }

  private cmdContact(): string {
    return `
<span class="cmd-section-title">📬 Contact Information</span>
<span class="cmd-muted">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>

<span class="cmd-key">Email:</span>     <span class="cmd-link">ravinbhakta3@gmail.com</span>
<span class="cmd-key">GitHub:</span>    <span class="cmd-link">github.com/ravin-it</span>
<span class="cmd-key">LinkedIn:</span>  <span class="cmd-link">linkedin.com/in/ravinbhakta</span>
<span class="cmd-key">Portfolio:</span> <span class="cmd-link">ravinbhakta.com</span>

<span class="cmd-muted">Feel free to reach out — I'm always open to new opportunities!</span>
<span class="cmd-muted">Or visit the</span> <span class="cmd-highlight">contact</span> <span class="cmd-muted">section on the main portfolio page.</span>`;
  }

  private cmdWhoami(): string {
    return `<span class="cmd-value">ravin</span> — Full Stack Developer | Angular enthusiast | Bay Area, CA`;
  }

  private cmdNeofetch(): string {
    return `
<span class="cmd-accent">        .--.        </span>  <span class="cmd-key">ravin</span>@<span class="cmd-value">portfolio</span>
<span class="cmd-accent">       |o_o |       </span>  <span class="cmd-muted">──────────────────</span>
<span class="cmd-accent">       |:_/ |       </span>  <span class="cmd-key">OS:</span>      <span class="cmd-value">Portfolio v2.0</span>
<span class="cmd-accent">      //   \\ \\      </span>  <span class="cmd-key">Host:</span>    <span class="cmd-value">Angular 19</span>
<span class="cmd-accent">     (|     | )     </span>  <span class="cmd-key">Kernel:</span>  <span class="cmd-value">TypeScript 5.x</span>
<span class="cmd-accent">    /'\\_   _/\`\\    </span>  <span class="cmd-key">Shell:</span>   <span class="cmd-value">zsh (portfolio-cli)</span>
<span class="cmd-accent">    \\___)=(___/    </span>  <span class="cmd-key">Uptime:</span>  <span class="cmd-value">5+ years of coding</span>
<span class="cmd-accent">                    </span>  <span class="cmd-key">Pkgs:</span>    <span class="cmd-value">Angular, Spring, Django, Flutter</span>
<span class="cmd-accent">                    </span>  <span class="cmd-key">CPU:</span>     <span class="cmd-value">Caffeine-powered ☕</span>
<span class="cmd-accent">                    </span>  <span class="cmd-key">Memory:</span>  <span class="cmd-value">Unlimited curiosity</span>
<span class="cmd-accent">                    </span>  <span class="cmd-key">DE:</span>      <span class="cmd-value">VS Code (Dark Theme)</span>
<span class="cmd-accent">                    </span>
<span class="cmd-accent">                    </span>  <span style="background:#f7768e;color:#f7768e">██</span><span style="background:#ff9e64;color:#ff9e64">██</span><span style="background:#e0af68;color:#e0af68">██</span><span style="background:#9ece6a;color:#9ece6a">██</span><span style="background:#7aa2f7;color:#7aa2f7">██</span><span style="background:#bb9af7;color:#bb9af7">██</span><span style="background:#7dcfff;color:#7dcfff">██</span>`;
  }

  private cmdLs(): string {
    return `
<span class="cmd-accent">drwxr-xr-x</span>  <span class="cmd-key">about/</span>
<span class="cmd-accent">drwxr-xr-x</span>  <span class="cmd-key">skills/</span>
<span class="cmd-accent">drwxr-xr-x</span>  <span class="cmd-key">experience/</span>
<span class="cmd-accent">drwxr-xr-x</span>  <span class="cmd-key">projects/</span>
<span class="cmd-accent">drwxr-xr-x</span>  <span class="cmd-key">education/</span>
<span class="cmd-accent">drwxr-xr-x</span>  <span class="cmd-key">contact/</span>
<span class="cmd-accent">-rw-r--r--</span>  <span class="cmd-value">README.md</span>
<span class="cmd-accent">-rw-r--r--</span>  <span class="cmd-value">RESUME.md</span>`;
  }

  private cmdCat(): string {
    return `<span class="cmd-muted">Usage: cat &lt;filename&gt;</span>
<span class="cmd-muted">Available files: README.md, RESUME.md</span>
<span class="cmd-muted">Available dirs: about, skills, experience, projects, education, contact</span>`;
  }

  private cmdCatFile(filename: string): string {
    const map: Record<string, () => string> = {
      'readme.md': () => this.cmdAbout(),
      'resume.md': () => `<span class="cmd-section-title">📄 Resume</span>\n\n<span class="cmd-muted">Download the full PDF from the portfolio navigation.</span>\n<span class="cmd-muted">Quick summary:</span>\n\n${this.cmdWhoami()}\n\n${this.cmdSkills()}`,
      'about': () => this.cmdAbout(),
      'about/': () => this.cmdAbout(),
      'skills': () => this.cmdSkills(),
      'skills/': () => this.cmdSkills(),
      'experience': () => this.cmdExperience(),
      'experience/': () => this.cmdExperience(),
      'projects': () => this.cmdProjects(),
      'projects/': () => this.cmdProjects(),
      'education': () => this.cmdEducation(),
      'education/': () => this.cmdEducation(),
      'contact': () => this.cmdContact(),
      'contact/': () => this.cmdContact(),
    };

    const handler = map[filename.toLowerCase()];
    if (handler) return handler();
    return `<span class="error-text">cat: ${this.escapeHtml(filename)}: No such file or directory</span>`;
  }

  private cmdDate(): string {
    return `<span class="cmd-value">${new Date().toString()}</span>`;
  }

  private cmdHistory(): string {
    if (this.commandHistory.length === 0) {
      return '<span class="cmd-muted">No commands in history yet.</span>';
    }
    return this.commandHistory
      .map((cmd, i) => `  <span class="cmd-muted">${String(i + 1).padStart(4)}</span>  ${cmd}`)
      .join('\n');
  }

  private cmdCurl(): string {
    return `
<span class="cmd-muted">Fetching ravinbhakta.com...</span>
<span class="cmd-success">HTTP/1.1 200 OK</span>
<span class="cmd-key">Content-Type:</span> text/html; charset=utf-8
<span class="cmd-key">X-Powered-By:</span> Angular 19
<span class="cmd-key">X-Developer:</span> Ravin Bhakta
<span class="cmd-key">X-Coffee-Level:</span> Dangerously High ☕

<span class="cmd-muted">&lt;!DOCTYPE html&gt;</span>
<span class="cmd-muted">&lt;html&gt;</span>
<span class="cmd-muted">  &lt;head&gt;&lt;title&gt;</span><span class="cmd-value">Ravin Bhakta | Full Stack Developer</span><span class="cmd-muted">&lt;/title&gt;&lt;/head&gt;</span>
<span class="cmd-muted">  &lt;body&gt;</span><span class="cmd-value">Welcome to my portfolio!</span><span class="cmd-muted">&lt;/body&gt;</span>
<span class="cmd-muted">&lt;/html&gt;</span>`;
  }

  private cmdPing(): string {
    return `
<span class="cmd-muted">PING ravinbhakta.com (127.0.0.1): 56 data bytes</span>
<span class="cmd-value">64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042ms</span>
<span class="cmd-value">64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.038ms</span>
<span class="cmd-value">64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.041ms</span>

<span class="cmd-muted">--- ravinbhakta.com ping statistics ---</span>
<span class="cmd-success">3 packets transmitted, 3 received, 0% packet loss</span>
<span class="cmd-muted">round-trip min/avg/max = 0.038/0.040/0.042 ms</span>
<span class="cmd-success">🟢 Portfolio is online and running!</span>`;
  }

  private cmdFortune(): string {
    const fortunes = [
      '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
      '"First, solve the problem. Then, write the code." — John Johnson',
      '"The best error message is the one that never shows up." — Thomas Fuchs',
      '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
      '"Simplicity is the soul of efficiency." — Austin Freeman',
      '"Make it work, make it right, make it fast." — Kent Beck',
      '"Talk is cheap. Show me the code." — Linus Torvalds',
      '"Programs must be written for people to read, and only incidentally for machines to execute." — Harold Abelson',
      '"The only way to learn a new programming language is by writing programs in it." — Dennis Ritchie',
      '"In theory, there is no difference between theory and practice. But in practice, there is." — Jan L.A. van de Snepscheut',
    ];
    const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
    return `\n<span class="cmd-warn">🔮 ${pick}</span>\n`;
  }

  private cmdCowsay(): string {
    const messages = [
      'Hire Ravin!',
      'I love Angular!',
      'Ship it!',
      'Works on my machine.',
      'Have you tried turning it off and on?',
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    const border = '─'.repeat(msg.length + 2);
    return `
<span class="cmd-value"> ┌${border}┐</span>
<span class="cmd-value"> │ ${msg} │</span>
<span class="cmd-value"> └${border}┘</span>
<span class="cmd-value">        \\   ^__^</span>
<span class="cmd-value">         \\  (oo)\\_______</span>
<span class="cmd-value">            (__)\\       )\\/\\</span>
<span class="cmd-value">                ||----w |</span>
<span class="cmd-value">                ||     ||</span>`;
  }
}
