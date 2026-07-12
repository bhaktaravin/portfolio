import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import emailjs from "@emailjs/browser";
import { environment } from "../../environments/environment";
import { CONTACT_INTENTS, PROFILE } from "../data/portfolio.data";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./contact.html",
  styleUrls: ["./contact.css"],
})
export class ContactComponent {
  readonly email = PROFILE.email;
  readonly responseTime = PROFILE.responseTime;
  readonly intentOptions = CONTACT_INTENTS;

  contact = { name: "", email: "", message: "", intent: "" };
  honeypot = "";
  toast: { message: string; type: "success" | "error" } | null = null;
  isSubmitting = false;
  emailCopied = false;

  private formLoadedAt = Date.now();

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.email);
      this.emailCopied = true;
      setTimeout(() => (this.emailCopied = false), 2000);
    } catch {
      window.location.href = `mailto:${this.email}`;
    }
  }

  async submitContact(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.isSpam()) {
      this.showToast("Message sent! I'll get back to you soon.", "success");
      form.resetForm();
      this.resetContact();
      return;
    }

    const intentLabel =
      this.intentOptions.find((o) => o.value === this.contact.intent)?.label ??
      this.contact.intent;

    this.isSubmitting = true;
    try {
      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        {
          from_name: this.contact.name,
          from_email: this.contact.email,
          intent: intentLabel,
          message: `Interest: ${intentLabel}\n\n${this.contact.message}`,
        },
        environment.emailjs.publicKey
      );
      this.showToast("Message sent! I'll get back to you soon.", "success");
      form.resetForm();
      this.resetContact();
    } catch {
      this.showToast("Something went wrong. Please try again.", "error");
    } finally {
      this.isSubmitting = false;
    }
  }

  private resetContact(): void {
    this.contact = { name: "", email: "", message: "", intent: "" };
  }

  private isSpam(): boolean {
    if (this.honeypot.trim().length > 0) return true;
    if (Date.now() - this.formLoadedAt < 2000) return true;

    const { name, email, message } = this.contact;
    const urlPattern = /https?:\/\/|www\./i;
    const repeatedChars = /(.)\1{6,}/;
    const spamKeywords = /\b(viagra|casino|crypto|click here|free money|winner|congratulations)\b/i;

    if (urlPattern.test(name)) return true;
    if (repeatedChars.test(message)) return true;
    if (spamKeywords.test(message)) return true;

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
