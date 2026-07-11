import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LazyLoadDirective } from '../directives/lazy-load.directive';
import { getProjectBySlug, PROFILE } from '../data/portfolio.data';
import type { Project } from '../data/portfolio.data';
import { MetaService } from '../services/meta.service';

@Component({
  selector: 'app-case-study',
  standalone: true,
  imports: [CommonModule, RouterModule, LazyLoadDirective],
  templateUrl: './case-study.html',
  styleUrls: ['./case-study.css'],
})
export class CaseStudyComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(MetaService);

  project: Project | undefined;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.project = getProjectBySlug(slug);
    if (this.project) {
      this.meta.update({
        title: `${this.project.title} — Case Study`,
        description: this.project.description,
        image: this.project.image ? `${PROFILE.siteUrl}/${this.project.image}` : undefined,
        url: `${PROFILE.siteUrl}/projects/${this.project.slug}`,
      });
    }
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/placeholder.svg';
  }
}
