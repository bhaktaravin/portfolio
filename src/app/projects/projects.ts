import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      title: 'MangaViewer',
      description: 'Modern manga reading application built with Angular and TypeScript, featuring responsive design, chapter navigation, and optimized image loading for seamless reading experience.',
      technologies: ['Angular', 'TypeScript', 'CSS3', 'HTML5', 'Responsive Design'],
      githubUrl: 'https://github.com/ravinbhakta/mangaviewer',
      liveUrl: 'https://mangaviewer-rust-angular.vercel.app/home',
      image: './images/mangaviewer.png'
    },
    {
      title: 'Flutter Personal Finance Tracker',
      description: 'Cross-platform mobile application for personal finance management built with Flutter. Features expense tracking, budget planning, financial analytics, and intuitive mobile-first design.',
      technologies: ['Flutter', 'Dart', 'SQLite', 'Material Design', 'Charts'],
      githubUrl: 'https://github.com/bhaktaravin/flutter_personal_finance_tracker',
      liveUrl: '',
      image: 'assets/projects/placeholder.svg'
    },
    {
      title: 'Pokemon Palace Quest',
      description: 'A Fun Quiz web application that allows Users to choose options to guess the Gen 1 aka - The Original 151 pokemon- using the Pokemon Api.',
      technologies: ['ReactJS', 'Vite', 'Tailwindcss', 'Typescript', 'Shadcn/ui'],
      githubUrl: 'https://github.com/bhaktaravin/poke-pal-quiz',
      liveUrl:'https://pokemon-palace-quest.lovable.app',
      image: './images/poke-pal-quiz.png'
    }
  ];
}

