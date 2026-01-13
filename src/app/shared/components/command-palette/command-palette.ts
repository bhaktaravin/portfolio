import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { Subscription, fromEvent } from "rxjs";
import { filter } from "rxjs/operators";
import { ToastService } from "../../../services/toast.service";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  action: () => void;
  shortcut?: string;
  keywords?: string[];
}

@Component({
  selector: "app-command-palette",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="command-palette-overlay"
      *ngIf="isOpen"
      [@fadeIn]
      (click)="close()"
    >
      <div
        class="command-palette-modal"
        (click)="$event.stopPropagation()"
        [@slideIn]
      >
        <div class="command-palette-header">
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input
              #searchInput
              type="text"
              [(ngModel)]="searchQuery"
              (input)="filterCommands()"
              (keydown)="handleKeydown($event)"
              placeholder="Type a command or search..."
              class="search-input"
              autocomplete="off"
            />
            <kbd class="shortcut-hint">ESC</kbd>
          </div>
        </div>

        <div class="command-palette-body">
          <div class="commands-container" *ngIf="filteredCommands.length > 0">
            <div
              *ngFor="
                let category of groupedCommands | keyvalue;
                trackBy: trackByCategory
              "
              class="command-category"
            >
              <div class="category-header">{{ category.key }}</div>
              <div class="category-commands">
                <div
                  *ngFor="
                    let command of category.value;
                    let i = index;
                    trackBy: trackByCommand
                  "
                  class="command-item"
                  [class.selected]="selectedIndex === getCommandIndex(command)"
                  (click)="executeCommand(command)"
                  (mouseenter)="selectedIndex = getCommandIndex(command)"
                >
                  <div class="command-icon">{{ command.icon }}</div>
                  <div class="command-content">
                    <div class="command-title">{{ command.title }}</div>
                    <div class="command-description">
                      {{ command.description }}
                    </div>
                  </div>
                  <div class="command-shortcut" *ngIf="command.shortcut">
                    <kbd>{{ command.shortcut }}</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="filteredCommands.length === 0">
            <div class="empty-icon">🔍</div>
            <div class="empty-title">No commands found</div>
            <div class="empty-description">
              Try searching for "projects", "skills", "contact", or "theme"
            </div>
          </div>
        </div>

        <div class="command-palette-footer">
          <div class="footer-shortcuts">
            <div class="shortcut-group">
              <kbd>↑</kbd><kbd>↓</kbd>
              <span>Navigate</span>
            </div>
            <div class="shortcut-group">
              <kbd>Enter</kbd>
              <span>Select</span>
            </div>
            <div class="shortcut-group">
              <kbd>Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./command-palette.css"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("200ms ease-out", style({ opacity: 1 })),
      ]),
      transition(":leave", [animate("150ms ease-in", style({ opacity: 0 }))]),
    ]),
    trigger("slideIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-20px) scale(0.95)" }),
        animate(
          "200ms ease-out",
          style({ opacity: 1, transform: "translateY(0) scale(1)" }),
        ),
      ]),
      transition(":leave", [
        animate(
          "150ms ease-in",
          style({ opacity: 0, transform: "translateY(-10px) scale(0.95)" }),
        ),
      ]),
    ]),
  ],
})
export class CommandPaletteComponent implements OnInit, OnDestroy {
  isOpen = false;
  searchQuery = "";
  selectedIndex = 0;
  filteredCommands: CommandItem[] = [];
  groupedCommands: { [category: string]: CommandItem[] } = {};

  private keyboardSubscription?: Subscription;
  private toastService = inject(ToastService);

  commands: CommandItem[] = [
    // Navigation Commands
    {
      id: "go-projects",
      title: "Go to Projects",
      description: "View my featured projects and case studies",
      icon: "🚀",
      category: "Navigation",
      action: () => this.scrollToSection("projects"),
      keywords: ["projects", "work", "portfolio", "code"],
    },
    {
      id: "go-skills",
      title: "View Skills Demo",
      description: "Interactive demonstration of technical skills",
      icon: "⚡",
      category: "Navigation",
      action: () => this.scrollToSection("skills"),
      keywords: ["skills", "demo", "abilities", "tech"],
    },
    {
      id: "go-experience",
      title: "Professional Experience",
      description: "Career timeline and work history",
      icon: "💼",
      category: "Navigation",
      action: () => this.scrollToSection("experience"),
      keywords: ["experience", "work", "career", "jobs", "history"],
    },
    {
      id: "go-about",
      title: "About Me",
      description: "Learn more about my background",
      icon: "👨‍💻",
      category: "Navigation",
      action: () => this.scrollToSection("about"),
      keywords: ["about", "bio", "background", "story"],
    },
    {
      id: "go-blog",
      title: "Blog Posts",
      description: "Read my latest articles and insights",
      icon: "📝",
      category: "Navigation",
      action: () => this.scrollToSection("blog"),
      keywords: ["blog", "articles", "posts", "writing"],
    },
    {
      id: "go-github",
      title: "GitHub Activity",
      description: "Live coding activity and repositories",
      icon: "🐙",
      category: "Navigation",
      action: () => this.scrollToSection("github"),
      keywords: ["github", "code", "repos", "activity", "commits"],
    },
    {
      id: "go-contact",
      title: "Contact Me",
      description: "Get in touch for opportunities",
      icon: "📧",
      category: "Navigation",
      action: () => this.scrollToSection("contact"),
      keywords: ["contact", "email", "reach", "hire"],
    },

    // Actions
    {
      id: "download-resume",
      title: "Download Resume",
      description: "Get my latest resume in PDF format",
      icon: "📄",
      category: "Actions",
      action: () => this.downloadResume(),
      shortcut: "Cmd+D",
      keywords: ["resume", "cv", "download", "pdf"],
    },
    {
      id: "copy-email",
      title: "Copy Email Address",
      description: "Copy my email to clipboard",
      icon: "📋",
      category: "Actions",
      action: () => this.copyToClipboard("ravin.bhakta@gmail.com"),
      keywords: ["email", "copy", "clipboard", "contact"],
    },
    {
      id: "open-github",
      title: "View GitHub Profile",
      description: "Check out my code repositories",
      icon: "🐙",
      category: "Actions",
      action: () => this.openExternalLink("https://github.com/yourusername"),
      keywords: ["github", "code", "repositories", "source"],
    },
    {
      id: "open-linkedin",
      title: "Connect on LinkedIn",
      description: "View my professional profile",
      icon: "💼",
      category: "Actions",
      action: () =>
        this.openExternalLink("https://linkedin.com/in/yourusername"),
      keywords: ["linkedin", "professional", "network", "connect"],
    },

    // Settings
    {
      id: "toggle-theme",
      title: "Toggle Dark Mode",
      description: "Switch between light and dark themes",
      icon: "🌙",
      category: "Settings",
      action: () => this.toggleTheme(),
      shortcut: "Cmd+Shift+D",
      keywords: ["theme", "dark", "light", "mode", "switch"],
    },
    {
      id: "share-portfolio",
      title: "Share Portfolio",
      description: "Copy portfolio URL to clipboard",
      icon: "🔗",
      category: "Actions",
      action: () => this.sharePortfolio(),
      keywords: ["share", "url", "link", "copy"],
    },

    // Quick Actions
    {
      id: "view-latest-project",
      title: "View Latest Project",
      description: "Jump to my most recent work",
      icon: "✨",
      category: "Quick Actions",
      action: () => this.viewLatestProject(),
      keywords: ["latest", "recent", "new", "project"],
    },
    {
      id: "schedule-call",
      title: "Schedule a Call",
      description: "Book a time to discuss opportunities",
      icon: "📅",
      category: "Actions",
      action: () => this.scheduleCall(),
      keywords: ["schedule", "call", "meeting", "book", "calendar"],
    },
  ];

  ngOnInit() {
    this.setupKeyboardShortcuts();
    this.filteredCommands = this.commands;
    this.groupCommands();
  }

  ngOnDestroy() {
    this.keyboardSubscription?.unsubscribe();
  }

  private setupKeyboardShortcuts() {
    this.keyboardSubscription = fromEvent<KeyboardEvent>(document, "keydown")
      .pipe(
        filter((event) => {
          // Cmd+K or Ctrl+K to open
          if ((event.metaKey || event.ctrlKey) && event.key === "k") {
            event.preventDefault();
            return true;
          }
          // Escape to close
          if (event.key === "Escape" && this.isOpen) {
            return true;
          }
          return false;
        }),
      )
      .subscribe((event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "k") {
          this.toggle();
        } else if (event.key === "Escape") {
          this.close();
        }
      });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.searchQuery = "";
    this.selectedIndex = 0;
    this.filteredCommands = this.commands;
    this.groupCommands();

    // Focus search input after animation
    setTimeout(() => {
      const searchInput = document.querySelector(
        ".search-input",
      ) as HTMLInputElement;
      searchInput?.focus();
    }, 100);
  }

  close() {
    this.isOpen = false;
    this.searchQuery = "";
    this.selectedIndex = 0;
  }

  filterCommands() {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.filteredCommands = this.commands;
    } else {
      this.filteredCommands = this.commands.filter(
        (command) =>
          command.title.toLowerCase().includes(query) ||
          command.description.toLowerCase().includes(query) ||
          command.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(query),
          ),
      );
    }

    this.selectedIndex = 0;
    this.groupCommands();
  }

  private groupCommands() {
    this.groupedCommands = {};
    this.filteredCommands.forEach((command) => {
      if (!this.groupedCommands[command.category]) {
        this.groupedCommands[command.category] = [];
      }
      this.groupedCommands[command.category].push(command);
    });
  }

  handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.filteredCommands.length - 1,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        break;
      case "Enter":
        event.preventDefault();
        if (this.filteredCommands[this.selectedIndex]) {
          this.executeCommand(this.filteredCommands[this.selectedIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        this.close();
        break;
    }
  }

  executeCommand(command: CommandItem) {
    command.action();
    this.close();
  }

  getCommandIndex(command: CommandItem): number {
    return this.filteredCommands.findIndex((c) => c.id === command.id);
  }

  trackByCategory(index: number, item: any): string {
    return item.key;
  }

  trackByCommand(index: number, command: CommandItem): string {
    return command.id;
  }

  // Action implementations
  private scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  private downloadResume() {
    // Create a temporary link to download resume
    const link = document.createElement("a");
    link.href = "assets/resume.pdf";
    link.download = "Ravin_Bhakta_Resume.pdf";
    link.click();

    this.toastService.success(
      "Download Started",
      "Your resume is being downloaded",
      { duration: 3000 },
    );

    this.close();
  }

  private copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const isEmail = text.includes("@");
        this.toastService.copied(isEmail ? "Email address" : "Text");
        this.close();
      })
      .catch(() => {
        this.toastService.error("Copy Failed", "Unable to copy to clipboard");
      });
  }

  private openExternalLink(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  private toggleTheme() {
    // Integrate with your theme service
    document.body.classList.toggle("dark-theme");
  }

  private sharePortfolio() {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.toastService.success(
          "Link Copied!",
          "Portfolio URL copied to clipboard",
          { duration: 3000 },
        );
        this.close();
      })
      .catch(() => {
        this.toastService.error("Share Failed", "Unable to copy portfolio URL");
      });
  }

  private viewLatestProject() {
    // Scroll to projects and highlight the first/featured one
    this.scrollToSection("projects");
    // You could add additional logic to highlight the latest project
  }

  private scheduleCall() {
    // Open calendar booking link or scroll to contact
    window.open("https://calendly.com/yourusername", "_blank");
    // Or fallback to contact section
    // this.scrollToSection('contact');
  }
}
