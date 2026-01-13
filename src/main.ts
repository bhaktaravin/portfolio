import { bootstrapApplication } from "@angular/platform-browser";
import { importProvidersFrom } from "@angular/core";
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideServiceWorker } from "@angular/service-worker";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import AOS from "aos";

import { AppComponent } from "./app/app";
import { routes } from "./app/app.routes";
import { environment } from "./environments/environment";

bootstrapApplication(AppComponent, {
  providers: [
    // Router configuration
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: "top",
        anchorScrolling: "enabled",
      }),
    ),

    // Core providers
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),

    // Firebase providers
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideFirestore(() => getFirestore()),
    ]),

    // Service Worker for PWA
    provideServiceWorker("ngsw-worker.js", {
      enabled: environment.production,
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
}).catch((err) => console.error(err));

// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: "ease-in-out-sine",
  delay: 100,
  once: true,
});
