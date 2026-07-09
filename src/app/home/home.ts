import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeroComponent } from '../hero/hero';
import { AboutComponent } from '../about/about';
import { SkillsComponent } from '../skills/skills';
import { ExperienceComponent } from '../experience/experience';
import { ProjectsComponent } from '../projects/projects';
import { EducationComponent } from '../education/education';
import { CertificationsComponent } from '../certifications/certifications';
import { ContactComponent } from '../contact/contact';
import { TestimonialsComponent } from '../testimonials/testimonials';
import { GitHubActivityComponent } from '../github-activity/github-activity';
import { ProductsComponent } from '../products/products';
import { PricingComponent } from '../pricing/pricing';
import { BookingComponent } from '../booking/booking';
import { BlogPreviewComponent } from '../blog/blog-preview';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent, AboutComponent, SkillsComponent, ExperienceComponent,
    ProjectsComponent, EducationComponent, CertificationsComponent,
    ContactComponent, TestimonialsComponent, GitHubActivityComponent,
    ProductsComponent, PricingComponent, BookingComponent, BlogPreviewComponent,
  ],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;
  private readonly onSectionChange = (id: string) => {
    window.dispatchEvent(new CustomEvent('section-change', { detail: id }));
  };

  private readonly pageSections = [
    'home', 'about', 'projects', 'services', 'testimonials', 'skills',
    'experience', 'contact', 'book', 'blog', 'products', 'github',
    'education', 'certifications',
  ];

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.onSectionChange(entry.target.id);
        });
      },
      { threshold: 0.3 },
    );
    this.pageSections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
