import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EDUCATION } from '../data/portfolio.data';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.html',
  styleUrls: ['./education.css'],
})
export class EducationComponent {
  readonly educationList = EDUCATION;
}
