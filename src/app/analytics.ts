// Thin wrapper around the Umami tracker loaded in index.html. Umami only
// loads on the production domain, so this is a no-op locally.
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

export function trackEvent(event: string, data?: Record<string, string>): void {
  window.umami?.track(event, data);
}
