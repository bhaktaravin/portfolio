import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    title: "Ravin Bhakta - AI-Assisted Full-Stack Engineer",
    data: {
      description:
        "AI-assisted full-stack engineer building LLM-powered applications, intelligent workflows, and scalable cloud solutions.",
    },
    children: [],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
