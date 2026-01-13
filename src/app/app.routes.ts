import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadComponent: () => import("./about/about").then((m) => m.AboutComponent),
    title: "Ravin Bhakta - Full-Stack Engineer",
    data: {
      description:
        "Full-Stack Engineer with 5+ years of experience building enterprise APIs, internal tools, and scalable cloud solutions.",
      preload: true,
    },
  },
  {
    path: "about",
    loadComponent: () => import("./about/about").then((m) => m.AboutComponent),
    title: "About - Ravin Bhakta",
    data: {
      description:
        "Learn more about my background, skills, and experience as a Full-Stack Engineer.",
      animation: "slideIn",
    },
  },
  {
    path: "skills",
    loadComponent: () =>
      import("./skills/skills").then((m) => m.SkillsComponent),
    title: "Skills - Ravin Bhakta",
    data: {
      description:
        "My technical skills including Angular, React, Java Spring, Python Django, and AWS cloud technologies.",
      animation: "fadeIn",
    },
  },
  {
    path: "experience",
    loadComponent: () =>
      import("./experience/experience").then((m) => m.ExperienceComponent),
    title: "Experience - Ravin Bhakta",
    data: {
      description:
        "Professional work experience at Blue Shield of California, Entappia, and Los Angeles Housing Authority.",
      animation: "slideUp",
    },
  },
  {
    path: "education",
    loadComponent: () =>
      import("./education/education").then((m) => m.EducationComponent),
    title: "Education - Ravin Bhakta",
    data: {
      description:
        "Educational background including Bachelor of Science in Computer Science from Cal State LA.",
      animation: "fadeIn",
    },
  },
  {
    path: "certifications",
    loadComponent: () =>
      import("./certifications/certifications").then(
        (m) => m.CertificationsComponent,
      ),
    title: "Certifications - Ravin Bhakta",
    data: {
      description:
        "Professional certifications including Machine Learning, Cybersecurity, and Scrum Master credentials.",
      animation: "slideIn",
    },
  },
  {
    path: "projects",
    loadComponent: () =>
      import("./projects/projects").then((m) => m.ProjectsComponent),
    title: "Projects - Ravin Bhakta",
    data: {
      description:
        "Featured projects including MangaViewer, Flutter Finance Tracker, and Pokemon Palace Quest.",
      animation: "slideUp",
    },
  },
  {
    path: "testimonials",
    loadComponent: () =>
      import("./testimonials/testimonials").then(
        (m) => m.TestimonialsComponent,
      ),
    title: "Testimonials - Ravin Bhakta",
    data: {
      description: "What colleagues and clients say about working with me.",
      animation: "fadeIn",
    },
  },
  {
    path: "contact",
    loadComponent: () =>
      import("./contact/contact").then((m) => m.ContactComponent),
    title: "Contact - Ravin Bhakta",
    data: {
      description:
        "Get in touch for opportunities, collaborations, or just to say hello.",
      animation: "slideIn",
    },
  },
  {
    path: "**",
    redirectTo: "/home",
  },
];
