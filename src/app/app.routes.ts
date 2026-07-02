import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Ravin Bhakta - Freelance Full-Stack & AI Web Developer',
    loadComponent: () => import('./home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'blog',
    title: 'Blog - Ravin Bhakta',
    loadComponent: () => import('./blog/blog-list').then((m) => m.BlogListComponent),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./blog/blog-post').then((m) => m.BlogPostComponent),
  },
  {
    path: 'projects/:slug',
    loadComponent: () => import('./case-study/case-study').then((m) => m.CaseStudyComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
