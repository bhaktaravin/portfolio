import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css'
})
export class TestimonialsComponent {
  testimonials = [
    {
      text: 'Ravin is a highly skilled engineer who always delivers on time and exceeds expectations. A pleasure to work with!',
      author: 'Jane Doe',
      title: 'Senior Developer, Acme Corp'
    },
    {
      text: 'His attention to detail and problem-solving skills are top-notch. Highly recommended!',
      author: 'John Smith',
      title: 'Team Lead, Tech Solutions'
    }
  ];

}
