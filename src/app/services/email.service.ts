import { Injectable } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

@Injectable({
    providedIn: 'root'
})
export class EmailService {
    // Credentials provided by user
    private readonly SERVICE_ID = 'service_w8c3wrr';
    private readonly TEMPLATE_ID = 'template_c0xfi54';
    private readonly PUBLIC_KEY = 'Y-0DZ0nj7VobA14wb';

    constructor() {
        // Initialize EmailJS
        emailjs.init(this.PUBLIC_KEY);
    }

    async sendEmail(templateParams: Record<string, unknown>): Promise<EmailJSResponseStatus> {
        try {
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.TEMPLATE_ID,
                templateParams
            );
            return response;
        } catch (error) {
            console.error('EmailJS Error:', error);
            throw error;
        }
    }
}
