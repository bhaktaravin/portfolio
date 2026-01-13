import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./contact.html",
  styleUrls: ["./contact.css"],
})
export class ContactComponent {
  contact = {
    name: "",
    email: "",
    message: "",
  };
  submitted = false;

  submitContact() {
    // Here you can add logic to send the form data to your backend or email service
    this.submitted = true;
    // Optionally reset the form
    this.contact = { name: "", email: "", message: "" };
  }
}
