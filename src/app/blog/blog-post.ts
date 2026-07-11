import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { getBlogPostBySlug, PROFILE } from '../data/portfolio.data';
import type { BlogPost } from '../data/portfolio.data';
import { MetaService } from '../services/meta.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-post.html',
  styleUrls: ['./blog.css'],
})
export class BlogPostComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(MetaService);

  post: BlogPost | undefined;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.post = getBlogPostBySlug(slug);
    if (this.post) {
      this.meta.update({
        title: this.post.title,
        description: this.post.excerpt,
        url: `${PROFILE.siteUrl}/blog/${this.post.slug}`,
      });
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
