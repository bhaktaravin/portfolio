import { Component, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";

import { AnalyticsService } from "../services/analytics.service";
import { ToastService } from "../services/toast.service";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string; // Anti-spam field
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  general?: string;
}

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./contact.html",
  styleUrls: ["./contact.css"],
})
export class ContactComponent {
  private analytics = inject(AnalyticsService);
  private toastService = inject(ToastService);

  // Form state signals
  private _isSubmitting = signal(false);
  private _submitted = signal(false);
  private _errors = signal<FormErrors>({});
  private _submitCount = signal(0);

  // Public readonly signals
  readonly isSubmitting = this._isSubmitting.asReadonly();
  readonly submitted = this._submitted.asReadonly();
  readonly errors = this._errors.asReadonly();
  readonly submitCount = this._submitCount.asReadonly();

  // Form data
  contact: ContactForm = {
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  };

  // Contact information
  contactInfo = {
    email: "ravin.bhakta@gmail.com",
    phone: "+1 (510) 755-7264",
    location: "Fremont, CA",
    linkedin: "https://www.linkedin.com/in/ravin-rohitbhai-bhakta",
    github: "https://github.com/bhaktaravin",
    availability: "Available for new opportunities",
  };

  // Subject options
  subjectOptions = [
    { value: "collaboration", label: "🤝 Collaboration" },
    { value: "job-opportunity", label: "💼 Job Opportunity" },
    { value: "freelance", label: "💻 Freelance Project" },
    { value: "consultation", label: "💡 Technical Consultation" },
    { value: "speaking", label: "🎤 Speaking Engagement" },
    { value: "general", label: "💬 General Inquiry" },
    { value: "other", label: "📝 Other" },
  ];

  // Success message variants
  successMessages = [
    "Thanks for reaching out! I'll get back to you within 24 hours. ⚡",
    "Message received! Looking forward to connecting with you soon. 🚀",
    "Your message is on its way to me! I'll respond as quickly as possible. 📧",
    "Got it! I appreciate you taking the time to connect. Talk soon! 🙌",
  ];

  // Computed properties
  readonly canSubmit = computed(
    () => this.isFormValid() && !this._isSubmitting() && !this.isRateLimited(),
  );

  readonly submitButtonText = computed(() => {
    if (this._isSubmitting()) return "Sending...";
    if (this._submitted()) return "Sent!";
    if (this._submitCount() > 0) return "Send Another";
    return "Send Message";
  });

  readonly submitButtonIcon = computed(() => {
    if (this._isSubmitting()) return "⏳";
    if (this._submitted()) return "✅";
    return "📤";
  });

  readonly successMessage = computed(() => {
    const index = Math.floor(Math.random() * this.successMessages.length);
    return this.successMessages[index];
  });

  ngOnInit(): void {
    this.analytics.trackPageView("/contact", "Contact Form");
  }

  async submitContact(form: NgForm): Promise<void> {
    if (!this.canSubmit()) {
      this.analytics.trackFormSubmission("contact", false);
      return;
    }

    // Check honeypot (anti-spam)
    if (this.contact.honeypot) {
      this.analytics.trackError("Spam attempt detected", "contact_form");
      return;
    }

    this._isSubmitting.set(true);
    this._errors.set({});

    try {
      // Validate form
      const validation = this.validateForm();
      if (!validation.isValid) {
        this._errors.set(validation.errors);
        this._isSubmitting.set(false);
        this.analytics.trackFormSubmission("contact", false);
        return;
      }

      // Simulate API call (replace with actual implementation)
      await this.sendMessage();

      // Success
      this._submitted.set(true);
      this._submitCount.update((count) => count + 1);
      this.resetForm(form);

      // Show success toast
      this.toastService.success(
        "Message Sent!",
        "Thanks for reaching out! I'll get back to you within 24 hours.",
        { duration: 6000 },
      );

      // Track success
      this.analytics.trackFormSubmission("contact", true);
      this.analytics.trackEvent({
        name: "contact_form_submit",
        category: "Contact",
        action: "submit",
        label: this.contact.subject,
        customParameters: {
          subject: this.contact.subject,
          messageLength: this.contact.message.length,
          submitCount: this._submitCount(),
        },
      });

      // Show success briefly, then allow new submissions
      setTimeout(() => {
        this._submitted.set(false);
      }, 3000);
    } catch (error) {
      this._errors.set({
        general: "Something went wrong. Please try again or email me directly.",
      });
      this.toastService.error(
        "Failed to Send",
        "Something went wrong. Please try again or email me directly.",
        { duration: 8000 },
      );
      this.analytics.trackError(
        "Contact form submission failed",
        "contact_form",
      );
    } finally {
      this._isSubmitting.set(false);
    }
  }

  private async sendMessage(): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real implementation, this would send the email
    // For now, we'll just log it and show success
    console.log("Contact form submission:", {
      ...this.contact,
      honeypot: undefined, // Don't log honeypot
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    });

    // You could integrate with services like:
    // - EmailJS
    // - Netlify Forms
    // - AWS SES
    // - Custom backend API
  }

  private validateForm(): { isValid: boolean; errors: FormErrors } {
    const errors: FormErrors = {};

    // Name validation
    if (!this.contact.name.trim()) {
      errors.name = "Name is required";
    } else if (this.contact.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (this.contact.name.trim().length > 100) {
      errors.name = "Name must be less than 100 characters";
    }

    // Email validation
    if (!this.contact.email.trim()) {
      errors.email = "Email is required";
    } else if (!this.isValidEmail(this.contact.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Subject validation
    if (!this.contact.subject.trim()) {
      errors.subject = "Please select a subject";
    }

    // Message validation
    if (!this.contact.message.trim()) {
      errors.message = "Message is required";
    } else if (this.contact.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    } else if (this.contact.message.trim().length > 2000) {
      errors.message = "Message must be less than 2000 characters";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isFormValid(): boolean {
    return !!(
      this.contact.name.trim() &&
      this.contact.email.trim() &&
      this.contact.subject.trim() &&
      this.contact.message.trim() &&
      this.isValidEmail(this.contact.email)
    );
  }

  private isRateLimited(): boolean {
    // Simple rate limiting - max 3 submissions per session
    return this._submitCount() >= 3;
  }

  private resetForm(form: NgForm): void {
    this.contact = {
      name: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
    };
    form.resetForm();
  }

  // Event handlers
  onFieldFocus(fieldName: string): void {
    this.analytics.trackEvent({
      name: "form_field_focus",
      category: "Contact",
      action: "focus",
      label: fieldName,
    });
  }

  onSubjectChange(): void {
    this.analytics.trackEvent({
      name: "form_subject_change",
      category: "Contact",
      action: "change",
      label: this.contact.subject,
    });
  }

  openEmailClient(): void {
    const subject = encodeURIComponent("Hello from your portfolio!");
    const body = encodeURIComponent(`Hi Ravin,

I found your portfolio and would like to connect.

Best regards,`);

    window.open(
      `mailto:${this.contactInfo.email}?subject=${subject}&body=${body}`,
    );

    this.analytics.trackClick("email_client", "contact");
  }

  callPhone(): void {
    window.open(`tel:${this.contactInfo.phone.replace(/\D/g, "")}`);
    this.analytics.trackClick("phone_call", "contact");
  }

  openLinkedIn(): void {
    window.open(this.contactInfo.linkedin, "_blank", "noopener,noreferrer");
    this.analytics.trackClick("linkedin_profile", "contact");
  }

  openGitHub(): void {
    window.open(this.contactInfo.github, "_blank", "noopener,noreferrer");
    this.analytics.trackClick("github_profile", "contact");
  }

  copyToClipboard(text: string, type: string): void {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        this.toastService.copied(type === "email" ? "Email address" : type);
        this.analytics.trackEvent({
          name: "copy_to_clipboard",
          category: "Contact",
          action: "copy",
          label: type,
        });
      })
      .catch((err) => {
        console.warn("Failed to copy to clipboard:", err);
        this.toastService.error(
          "Copy Failed",
          "Unable to copy to clipboard. Please select and copy manually.",
        );
      });
  }

  // Character count for message
  getMessageCharCount(): number {
    return this.contact.message.length;
  }

  getMessageCharCountColor(): string {
    const count = this.getMessageCharCount();
    if (count > 1800) return "var(--color-error)";
    if (count > 1500) return "var(--color-warning)";
    return "var(--color-text-tertiary)";
  }
}
