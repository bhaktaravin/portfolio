import { Component } from '@angular/core';

interface Education {
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  location: string;
  details?: string[];
  institutionUrl?: string;
}

@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  styleUrls: ['./education.css']
})
export class EducationComponent {
  educationList: Education[] = [
    {
      institution: 'California State University, Los Angeles',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      start: 'Sep 2015',
      end: 'May 2019',
      location: 'Los Angeles, CA',
      details: [
        'Bachelors of Science in Computer Science'
      ],
      institutionUrl: 'https://www.calstatela.edu/'
    }
  ];

}
