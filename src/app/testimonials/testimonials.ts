import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Testimonial {
  name: string;
  title: string;
  date: string;
  relationship: string;
  text: string;
  image?: string;
}

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css'
})
export class TestimonialsComponent {
  private firestore: Firestore = inject(Firestore);
  testimonials$: Observable<Testimonial[]>;

  showForm = false;
  newTestimonial: Testimonial = {
    name: '',
    title: '',
    date: '',
    relationship: '',
    text: '',
    image: ''
  };

  constructor() {
    const testimonialsRef = collection(this.firestore, 'testimonials');
    this.testimonials$ = collectionData(testimonialsRef, { idField: 'id' }) as Observable<Testimonial[]>;
  }

  async submitTestimonial() {
    if (!this.newTestimonial.name || !this.newTestimonial.title || !this.newTestimonial.date || !this.newTestimonial.relationship || !this.newTestimonial.text) {
      return;
    }
    const testimonialsRef = collection(this.firestore, 'testimonials');
    await addDoc(testimonialsRef, this.newTestimonial);
    this.newTestimonial = { name: '', title: '', date: '', relationship: '', text: '', image: '' };
    this.showForm = false;
  }
}
