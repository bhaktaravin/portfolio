import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WORK_PROCESS } from '../data/portfolio.data';

@Component({
  selector: 'app-how-i-work',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-i-work.html',
  styleUrls: ['./how-i-work.css'],
})
export class HowIWorkComponent {
  readonly steps = WORK_PROCESS;

  scrollToBook(): void {
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
