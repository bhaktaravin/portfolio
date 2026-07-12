import {
  Component,
  HostListener,
  inject,
  effect,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommandPaletteService } from '../services/command-palette.service';
import { PROJECTS, BLOG_POSTS } from '../data/portfolio.data';

interface PaletteItem {
  id: string;
  label: string;
  group: string;
  hint?: string;
  fragment?: string;
  route?: string | string[];
  searchText: string;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './command-palette.html',
  styleUrls: ['./command-palette.css'],
})
export class CommandPaletteComponent {
  private readonly router = inject(Router);
  private readonly palette = inject(CommandPaletteService);

  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  query = '';
  selectedIndex = 0;

  private readonly sectionItems: PaletteItem[] = [
    { id: 'home', label: 'Home', group: 'Navigate', fragment: 'home', searchText: 'home top hero' },
    { id: 'about', label: 'About', group: 'Navigate', fragment: 'about', searchText: 'about me bio' },
    { id: 'projects', label: 'Work & Projects', group: 'Navigate', fragment: 'projects', searchText: 'work projects portfolio' },
    { id: 'clients', label: 'Clients', group: 'Navigate', fragment: 'clients', searchText: 'clients trusted' },
    { id: 'testimonials', label: 'Recommendations', group: 'Navigate', fragment: 'testimonials', searchText: 'recommendations reviews linkedin colleagues' },
    { id: 'process', label: 'How I Work', group: 'Navigate', fragment: 'process', searchText: 'process timeline how i work discovery launch' },
    { id: 'services', label: 'Services & Pricing', group: 'Navigate', fragment: 'services', searchText: 'services pricing rates' },
    { id: 'ai-demo', label: 'AI Playground', group: 'Navigate', fragment: 'ai-demo', searchText: 'ai demo playground llm copy' },
    { id: 'skills', label: 'Skills', group: 'Navigate', fragment: 'skills', searchText: 'skills tech stack' },
    { id: 'experience', label: 'Experience', group: 'Navigate', fragment: 'experience', searchText: 'experience jobs career' },
    { id: 'faq', label: 'FAQ', group: 'Navigate', fragment: 'faq', searchText: 'faq questions' },
    { id: 'contact', label: 'Contact', group: 'Navigate', fragment: 'contact', searchText: 'contact email message' },
    { id: 'book', label: 'Book a Call', group: 'Navigate', fragment: 'book', searchText: 'book call cal schedule meeting' },
    { id: 'blog', label: 'Blog Preview', group: 'Navigate', fragment: 'blog', searchText: 'blog posts articles' },
    { id: 'products', label: 'Products', group: 'Navigate', fragment: 'products', searchText: 'products gumroad' },
    { id: 'github', label: 'GitHub Activity', group: 'Navigate', fragment: 'github', searchText: 'github activity commits' },
    { id: 'education', label: 'Education', group: 'Navigate', fragment: 'education', searchText: 'education degree school' },
    { id: 'certifications', label: 'Certifications', group: 'Navigate', fragment: 'certifications', searchText: 'certifications certs' },
    { id: 'blog-page', label: 'Blog (full page)', group: 'Pages', route: '/blog', searchText: 'blog list all posts' },
  ];

  private readonly projectItems: PaletteItem[] = PROJECTS.map((p) => ({
    id: `project-${p.slug}`,
    label: p.title,
    group: 'Projects',
    hint: p.technologies.slice(0, 3).join(' · '),
    route: p.caseStudy ? `/projects/${p.slug}` : undefined,
    fragment: p.caseStudy ? undefined : 'projects',
    searchText: `${p.title} ${p.description} ${p.technologies.join(' ')}`.toLowerCase(),
  }));

  private readonly blogItems: PaletteItem[] = BLOG_POSTS.map((post) => ({
    id: `blog-${post.slug}`,
    label: post.title,
    group: 'Blog',
    hint: post.readTime,
    route: `/blog/${post.slug}`,
    searchText: `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase(),
  }));

  private readonly allItems = [...this.sectionItems, ...this.projectItems, ...this.blogItems];

  readonly isOpen = this.palette.isOpen;

  get filteredItems(): PaletteItem[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.allItems;
    return this.allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.searchText.includes(q) ||
        item.group.toLowerCase().includes(q),
    );
  }

  get groupedItems(): Map<string, PaletteItem[]> {
    const groups = new Map<string, PaletteItem[]>();
    for (const item of this.filteredItems) {
      const list = groups.get(item.group) ?? [];
      list.push(item);
      groups.set(item.group, list);
    }
    return groups;
  }

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.query = '';
        this.selectedIndex = 0;
        setTimeout(() => this.searchInput()?.nativeElement.focus(), 0);
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const inField =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable;

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.palette.toggle();
      return;
    }

    if (!this.isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.palette.close();
      return;
    }

    if (inField && event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter') {
      return;
    }

    const items = this.filteredItems;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex = items.length ? (this.selectedIndex + 1) % items.length : 0;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex = items.length
        ? (this.selectedIndex - 1 + items.length) % items.length
        : 0;
    } else if (event.key === 'Enter' && items.length) {
      event.preventDefault();
      this.selectItem(items[this.selectedIndex]);
    }
  }

  onQueryChange(): void {
    this.selectedIndex = 0;
  }

  flatIndex(item: PaletteItem): number {
    return this.filteredItems.indexOf(item);
  }

  isSelected(item: PaletteItem): boolean {
    return this.flatIndex(item) === this.selectedIndex;
  }

  selectItem(item: PaletteItem): void {
    this.palette.close();

    if (item.route) {
      void this.router.navigate(Array.isArray(item.route) ? item.route : [item.route]);
      return;
    }

    if (item.fragment) {
      const onHome = this.router.url === '/' || this.router.url.startsWith('/#');
      if (onHome) {
        document.getElementById(item.fragment)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        void this.router.navigate(['/'], { fragment: item.fragment });
      }
    }
  }

  close(): void {
    this.palette.close();
  }
}
