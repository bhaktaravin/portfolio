import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TESTIMONIALS } from "../data/portfolio.data";

@Component({
  selector: "app-testimonials",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./testimonials.html",
  styleUrls: ["./testimonials.css"],
})
export class TestimonialsComponent {
  readonly testimonials = TESTIMONIALS;
}
