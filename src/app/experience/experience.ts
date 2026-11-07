import { Component } from '@angular/core';

import { EXPERIENCES } from '../data/portfolio.data';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [],
  templateUrl: './experience.html',
  styleUrls: ['./experience.css'],
})
export class ExperienceComponent {
  readonly experiences = EXPERIENCES;
}
