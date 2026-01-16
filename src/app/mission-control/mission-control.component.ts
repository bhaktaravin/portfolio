import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-mission-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mission-control.component.html',
  styleUrls: ['./mission-control.component.css']
})
export class MissionControlComponent implements OnInit {

  safeUrl: SafeResourceUrl;
  // REPLACE THIS with your actual Hugging Face Space URL
  spaceUrl = 'https://bhaktaravin-futuristic-mission-control.hf.space';
  constructor(private sanitizer: DomSanitizer) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.spaceUrl);
  }
  ngOnInit(): void { }






}
