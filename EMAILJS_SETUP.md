# EmailJS Setup Instructions

To enable the contact form functionality, you need to set up EmailJS:

## 1. Create EmailJS Account
- Go to https://www.emailjs.com/
- Sign up for a free account
- Verify your email address

## 2. Create Email Service
- In EmailJS dashboard, go to "Email Services"
- Click "Add New Service"
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the setup instructions for your provider
- Note your **Service ID**

## 3. Create Email Template
- Go to "Email Templates"
- Click "Create New Template"
- Use this template content:

```
Subject: New Portfolio Contact from {{from_name}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

- Note your **Template ID**

## 4. Get Public Key
- Go to "Account" → "General"
- Find your **Public Key**

## 5. Update Portfolio Code
Replace the placeholder values in `src/app/app.ts`:

```typescript
// Replace these values:
emailjs.init('YOUR_PUBLIC_KEY');

// In the emailjs.send() call:
'YOUR_SERVICE_ID',    // Your service ID
'YOUR_TEMPLATE_ID',   // Your template ID
'YOUR_PUBLIC_KEY'     // Your public key (same as init)
```

## 6. Test the Contact Form
- Run your portfolio locally
- Fill out the contact form
- Check your email for the message
- Check EmailJS dashboard for delivery status

## Optional: Custom Domain
- In EmailJS dashboard, you can add your portfolio domain to improve deliverability
- Go to "Account" → "Security" → "Allowed Domains"

Your contact form will now send real emails! 🎉