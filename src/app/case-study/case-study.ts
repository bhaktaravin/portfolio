import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LazyLoadDirective } from '../directives/lazy-load.directive';
import { getProjectBySlug } from '../data/portfolio.data';
import type { Project } from '../data/portfolio.data';

@Component({
  selector: 'app-case-study',
  standalone: true,
  imports: [CommonModule, RouterModule, LazyLoadDirective],
  templateUrl: './case-study.html',
  styleUrls: ['./case-study.css'],
})
export class CaseStudyComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  project: Project | undefined;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.project = getProjectBySlug(slug);
    if (this.project) {
      this.title.setTitle(`${this.project.title} - Case Study | Ravin Bhakta`);
    }
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/placeholder.svg';
  }
}
