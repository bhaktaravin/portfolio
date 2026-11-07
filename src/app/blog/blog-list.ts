import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { BLOG_POSTS } from '../data/portfolio.data';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './blog-list.html',
  styleUrls: ['./blog.css'],
})
export class BlogListComponent {
  readonly posts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
