import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { getBlogPostBySlug } from '../data/portfolio.data';
import type { BlogPost } from '../data/portfolio.data';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-post.html',
  styleUrls: ['./blog.css'],
})
export class BlogPostComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  post: BlogPost | undefined;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.post = getBlogPostBySlug(slug);
    if (this.post) {
      this.title.setTitle(`${this.post.title} - Ravin Bhakta`);
    }
  }

  get paragraphs(): string[] {
    if (!this.post) return [];
    return this.post.content.split('\n\n').filter((p) => p.trim());
  }

  isHeading(p: string): boolean {
    return p.startsWith('## ');
  }

  headingText(p: string): string {
    return p.replace(/^## /, '');
  }
}
