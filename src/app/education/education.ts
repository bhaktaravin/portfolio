import { Component } from '@angular/core';

import { EDUCATION } from '../data/portfolio.data';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [],
  templateUrl: './education.html',
  styleUrls: ['./education.css'],
})
export class EducationComponent {
  readonly educationList = EDUCATION;
}
