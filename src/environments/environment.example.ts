// Copy this file to environment.ts and fill in your values
export const environment = {
  production: false,
  emailjs: {
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID",
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  },
  apiUrl: "http://localhost:3000",
  enableAnalytics: false,
  enableServiceWorker: false,
  cacheTimeout: 30000,
  version: "1.0.0-dev",
  debugMode: true,
  logLevel: "debug",
};
