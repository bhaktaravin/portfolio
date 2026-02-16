import { Component, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type EditorTab = 'html' | 'css' | 'js';

interface CodeTemplate {
  name: string;
  icon: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css'],
})
export class PlaygroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('previewFrame') previewFrame!: ElementRef<HTMLIFrameElement>;

  activeTab = signal<EditorTab>('html');
  autoRun = signal(true);
  isFullscreen = signal(false);
  showTemplates = signal(false);
  consoleOutput = signal<{ type: string; message: string }[]>([]);
  showConsole = signal(false);

  htmlCode = signal(`<div class="container">
  <h1>Hello, World! 👋</h1>
  <p>Edit this code and see live changes!</p>
  <button onclick="handleClick()">Click Me</button>
  <div id="output"></div>
</div>`);

  cssCode = signal(`* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.container {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  animation: fadeIn 0.5s ease;
}

p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

button {
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border: 2px solid #fff;
  background: transparent;
  color: #fff;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: #fff;
  color: #764ba2;
}

#output {
  margin-top: 1rem;
  font-size: 1.1rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}`);

  jsCode = signal(`let clickCount = 0;

function handleClick() {
  clickCount++;
  const output = document.getElementById('output');
  output.textContent = \`Clicked \${clickCount} time\${clickCount > 1 ? 's' : ''}! 🎉\`;
  output.style.animation = 'none';
  output.offsetHeight; // trigger reflow
  output.style.animation = 'fadeIn 0.3s ease';
}`);

  templates: CodeTemplate[] = [
    {
      name: 'Hello World',
      icon: '👋',
      description: 'A simple starter template',
      html: this.htmlCode(),
      css: this.cssCode(),
      js: this.jsCode(),
    },
    {
      name: 'CSS Animation',
      icon: '🎨',
      description: 'Beautiful CSS animations',
      html: `<div class="scene">
  <div class="cube">
    <div class="face front">Front</div>
    <div class="face back">Back</div>
    <div class="face right">Right</div>
    <div class="face left">Left</div>
    <div class="face top">Top</div>
    <div class="face bottom">Bottom</div>
  </div>
</div>
<p class="caption">CSS 3D Cube</p>`,
      css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  min-height: 100vh;
  background: #0f172a; color: #e2e8f0;
  font-family: 'Inter', sans-serif;
}
.scene { width: 200px; height: 200px; perspective: 600px; }
.cube {
  width: 100%; height: 100%;
  position: relative; transform-style: preserve-3d;
  animation: rotate 8s infinite linear;
}
.face {
  position: absolute; width: 200px; height: 200px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 600;
  border: 2px solid rgba(99, 102, 241, 0.5);
  background: rgba(99, 102, 241, 0.15);
  backdrop-filter: blur(4px);
}
.front  { transform: rotateY(0deg) translateZ(100px); }
.back   { transform: rotateY(180deg) translateZ(100px); }
.right  { transform: rotateY(90deg) translateZ(100px); }
.left   { transform: rotateY(-90deg) translateZ(100px); }
.top    { transform: rotateX(90deg) translateZ(100px); }
.bottom { transform: rotateX(-90deg) translateZ(100px); }
.caption { margin-top: 2rem; font-size: 1rem; opacity: 0.7; }
@keyframes rotate {
  from { transform: rotateX(0) rotateY(0); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}`,
      js: '// Pure CSS animation — no JavaScript needed!',
    },
    {
      name: 'API Fetch',
      icon: '🌐',
      description: 'Fetch data from a REST API',
      html: `<div class="app">
  <h2>Random User Generator</h2>
  <div id="card" class="card loading">Loading...</div>
  <button onclick="fetchUser()">Get New User</button>
</div>`,
      css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  display: flex; justify-content: center; align-items: center;
  min-height: 100vh; background: #1e293b;
  font-family: 'Inter', sans-serif; color: #e2e8f0;
}
.app { text-align: center; padding: 2rem; }
h2 { margin-bottom: 1.5rem; color: #93c5fd; }
.card {
  background: #334155; border-radius: 12px; padding: 1.5rem;
  margin-bottom: 1.5rem; min-width: 280px;
  transition: all 0.3s ease;
}
.card img {
  width: 80px; height: 80px; border-radius: 50%;
  margin-bottom: 1rem; border: 3px solid #60a5fa;
}
.card h3 { color: #93c5fd; margin-bottom: 0.5rem; }
.card p { opacity: 0.8; font-size: 0.9rem; }
button {
  padding: 0.7rem 1.5rem; background: #3b82f6;
  color: #fff; border: none; border-radius: 8px;
  font-size: 1rem; cursor: pointer; transition: background 0.3s;
}
button:hover { background: #2563eb; }`,
      js: `async function fetchUser() {
  const card = document.getElementById('card');
  card.innerHTML = 'Loading...';
  try {
    const res = await fetch('https://randomuser.me/api/');
    const data = await res.json();
    const user = data.results[0];
    card.innerHTML = \`
      <img src="\${user.picture.large}" alt="User">
      <h3>\${user.name.first} \${user.name.last}</h3>
      <p>📧 \${user.email}</p>
      <p>📍 \${user.location.city}, \${user.location.country}</p>
    \`;
  } catch (err) {
    card.innerHTML = 'Failed to fetch user. Try again!';
  }
}
fetchUser();`,
    },
    {
      name: 'Canvas Drawing',
      icon: '🎮',
      description: 'Interactive canvas animation',
      html: `<canvas id="canvas"></canvas>
<p class="hint">Move your mouse to draw particles ✨</p>`,
      css: `* { margin: 0; padding: 0; }
body {
  overflow: hidden; background: #0f172a;
  font-family: 'Inter', sans-serif;
}
canvas { display: block; }
.hint {
  position: fixed; bottom: 20px; left: 50%;
  transform: translateX(-50%); color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
}`,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const colors = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'];

class Particle {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.life = 1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.02;
    this.size *= 0.98;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

canvas.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(e.clientX, e.clientY));
  }
});

function animate() {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});`,
    },
  ];

  private debounceTimer: any;

  ngAfterViewInit(): void {
    setTimeout(() => this.runCode(), 100);
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  setTab(tab: EditorTab): void {
    this.activeTab.set(tab);
  }

  onCodeChange(tab: EditorTab, value: string): void {
    switch (tab) {
      case 'html': this.htmlCode.set(value); break;
      case 'css': this.cssCode.set(value); break;
      case 'js': this.jsCode.set(value); break;
    }

    if (this.autoRun()) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.runCode(), 400);
    }
  }

  runCode(): void {
    if (!this.previewFrame) return;

    const iframe = this.previewFrame.nativeElement;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Intercept console.log in iframe
    const consoleScript = `
      <script>
        (function() {
          const origLog = console.log;
          const origError = console.error;
          const origWarn = console.warn;
          console.log = function(...args) {
            window.parent.postMessage({ type: 'console', level: 'log', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, '*');
            origLog.apply(console, args);
          };
          console.error = function(...args) {
            window.parent.postMessage({ type: 'console', level: 'error', message: args.map(a => String(a)).join(' ') }, '*');
            origError.apply(console, args);
          };
          console.warn = function(...args) {
            window.parent.postMessage({ type: 'console', level: 'warn', message: args.map(a => String(a)).join(' ') }, '*');
            origWarn.apply(console, args);
          };
          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ type: 'console', level: 'error', message: msg + ' (line ' + line + ')' }, '*');
          };
        })();
      <\/script>
    `;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${this.cssCode()}</style>
          ${consoleScript}
        </head>
        <body>
          ${this.htmlCode()}
          <script>${this.jsCode()}<\/script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(content);
    doc.close();
  }

  loadTemplate(template: CodeTemplate): void {
    this.htmlCode.set(template.html);
    this.cssCode.set(template.css);
    this.jsCode.set(template.js);
    this.showTemplates.set(false);
    this.activeTab.set('html');
    setTimeout(() => this.runCode(), 100);
  }

  toggleFullscreen(): void {
    this.isFullscreen.update(v => !v);
  }

  clearCode(): void {
    this.htmlCode.set('');
    this.cssCode.set('');
    this.jsCode.set('');
    this.consoleOutput.set([]);
    this.runCode();
  }

  toggleConsole(): void {
    this.showConsole.update(v => !v);
  }

  clearConsole(): void {
    this.consoleOutput.set([]);
  }

  getActiveCode(): string {
    switch (this.activeTab()) {
      case 'html': return this.htmlCode();
      case 'css': return this.cssCode();
      case 'js': return this.jsCode();
    }
  }

  getLineCount(code: string): number[] {
    return Array.from({ length: code.split('\n').length }, (_, i) => i + 1);
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.getActiveCode()).then(() => {
      // Could integrate toast service here
    });
  }
}
