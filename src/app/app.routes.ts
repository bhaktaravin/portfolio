import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    title: "Ravin Bhakta - Full-Stack Engineer",
    data: {
      description:
        "Full-Stack Engineer with 5+ years of experience building enterprise APIs, internal tools, and scalable cloud solutions.",
    },
    children: [],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
