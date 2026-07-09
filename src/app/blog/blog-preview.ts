import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BLOG_POSTS } from '../data/portfolio.data';

@Component({
  selector: 'app-blog-preview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-preview.html',
  styleUrls: ['./blog.css'],
})
export class BlogPreviewComponent {
  readonly posts = BLOG_POSTS.slice(0, 3);
}
