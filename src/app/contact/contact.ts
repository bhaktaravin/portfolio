import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import emailjs from "@emailjs/browser";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./contact.html",
  styleUrls: ["./contact.css"],
})
export class ContactComponent {
  contact = { name: "", email: "", message: "" };
  honeypot = ""; // must stay empty — bots fill this
  toast: { message: string; type: "success" | "error" } | null = null;
  isSubmitting = false;

  private formLoadedAt = Date.now();

  async submitContact(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.isSpam()) {
      // Silently pretend it worked so bots don't retry
      this.showToast("Message sent! I'll get back to you soon.", "success");
      form.resetForm();
      this.contact = { name: "", email: "", message: "" };
      return;
    }

    this.isSubmitting = true;
    try {
      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        {
          from_name: this.contact.name,
          from_email: this.contact.email,
          message: this.contact.message,
        },
        environment.emailjs.publicKey
      );
      this.showToast("Message sent! I'll get back to you soon.", "success");
      form.resetForm();
      this.contact = { name: "", email: "", message: "" };
    } catch {
      this.showToast("Something went wrong. Please try again.", "error");
    } finally {
      this.isSubmitting = false;
    }
  }

  private isSpam(): boolean {
    // 1. Honeypot — bot filled the hidden field
    if (this.honeypot.trim().length > 0) return true;

    // 2. Time check — submitted in under 2 seconds
    if (Date.now() - this.formLoadedAt < 2000) return true;

    // 3. Content checks
    const { name, email, message } = this.contact;
    const urlPattern = /https?:\/\/|www\./i;
    const repeatedChars = /(.)\1{6,}/; // e.g. "aaaaaaa"
    const spamKeywords = /\b(viagra|casino|crypto|click here|free money|winner|congratulations)\b/i;

    if (urlPattern.test(name)) return true;
    if (repeatedChars.test(message)) return true;
    if (spamKeywords.test(message)) return true;

    // 4. Suspicious email patterns (disposable domains)
    const disposableDomains = ["mailinator.com", "guerrillamail.com", "trashmail.com", "tempmail.com", "10minutemail.com"];
    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (disposableDomains.includes(emailDomain)) return true;

    return false;
  }

  private showToast(message: string, type: "success" | "error") {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 4000);
  }
}
