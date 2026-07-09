// Central source of truth for all portfolio content.
// Update here once — sections, resume export, blog, and case studies stay in sync.

export interface NavLink {
  id: string;
  label: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  ariaLabel?: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface CaseStudy {
  problem: string;
  solution: string;
  impact: string;
  highlights: string[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  caseStudy?: CaseStudy;
}

export interface ExperienceEntry {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  details: string[];
  companyUrl: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  location: string;
  details?: string[];
  institutionUrl?: string;
}

export interface CertificationEntry {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  credentialUrl: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface LearningItem {
  name: string;
  progress: number;
  icon: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

export interface ResumeExperience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  period: string;
  location: string;
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  year: string;
}

export const PROFILE = {
  fullName: 'Ravin Bhakta',
  jobTitle: 'Freelance Full-Stack & AI Web Developer',
  tagline: 'I build and deploy client websites, web apps, and AI-powered features.',
  heroDescription:
    'From consulting sites on AWS Amplify to full-stack platforms on Vercel—Next.js, React, TypeScript, and optional LLM integrations. You get a live product, not just mockups.',
  aboutDescription:
    'I help businesses and founders launch polished web experiences—marketing sites, member portals, dashboards, and AI-assisted tools. Recent client work includes educational consulting (AWS Amplify) and a membership platform (Vercel + Postgres). I handle design implementation, full-stack development, deployment, and handoff so you get a live URL you can share.',
  aboutSubtitle: 'Websites, web apps, and AI features—built and deployed for you',
  email: 'ravin.bhakta@gmail.com',
  phone: '5107557264',
  location: 'Fremont, CA',
  availability: 'Available for freelance',
  resumeLink: 'assets/resume.pdf',
  calLink: 'https://cal.com/ravinbhakta/30min',
};

export const STATS: Stat[] = [
  { value: '3+', label: 'Live Client Sites' },
  { value: '10+', label: 'Projects Shipped' },
  { value: '5+', label: 'Years Building' },
  { value: '100%', label: 'Remote-Friendly' },
];

export const ABOUT_STATS: Stat[] = [
  { value: '3+', label: 'Live Client Sites' },
  { value: '10+', label: 'Projects Shipped' },
  { value: '5+', label: 'Years Building' },
  { value: 'Remote', label: 'US-Based · Freelance' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'GitHub', url: 'https://github.com/bhaktaravin', icon: '🐙', ariaLabel: 'Visit my GitHub profile' },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ravin-rohitbhai-bhakta', icon: '🔗', ariaLabel: 'Connect on LinkedIn' },
  { platform: 'Gumroad', url: 'https://ravinspire34.gumroad.com/', icon: '🛒', ariaLabel: 'Visit my Gumroad store' },
  { platform: 'Email', url: 'mailto:ravin.bhakta@gmail.com', icon: '✉️', ariaLabel: 'Send me an email' },
  { platform: 'Phone', url: 'tel:5107557264', icon: '📞' },
];

export const TECH_STACK = [
  'Next.js', 'React', 'TypeScript', 'AWS Amplify', 'Vercel', 'Neon Postgres',
];

export const HERO_TECH_STACK = [
  'Next.js', 'React', 'TypeScript', 'AWS Amplify', 'Vercel', 'AI Features',
];

export const SERVICES: Service[] = [
  {
    icon: '🌐',
    title: 'Business & marketing websites',
    description: 'Fast, responsive sites with modern UX—Next.js or React, hosted on AWS Amplify or Vercel.',
  },
  {
    icon: '⚙️',
    title: 'Full-stack web applications',
    description: 'Auth, dashboards, forms, and databases—Neon Postgres, Prisma, and production-ready APIs.',
  },
  {
    icon: '🤖',
    title: 'AI-powered features',
    description: 'Optional LLM integrations: chat, document analysis, smart search, and workflow automation.',
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Landing Page',
    price: 'From $1,500',
    description: 'A polished marketing site to establish your brand and capture leads.',
    features: [
      'Up to 5 pages',
      'Mobile-responsive design',
      'Contact form integration',
      'SEO basics & analytics setup',
      'Deployed to AWS Amplify or Vercel',
    ],
    cta: 'Get a quote',
  },
  {
    name: 'Full-Stack App',
    price: 'From $4,000',
    description: 'Auth, dashboards, databases, and APIs—production-ready from day one.',
    features: [
      'User authentication',
      'Database & API layer',
      'Admin dashboard',
      'CI/CD pipeline',
      '2 weeks post-launch support',
    ],
    highlighted: true,
    cta: 'Start a project',
  },
  {
    name: 'AI Integration',
    price: 'From $2,500',
    description: 'Add intelligent features to your existing product or new build.',
    features: [
      'LLM-powered chat or search',
      'Document analysis & summarization',
      'Prompt engineering & guardrails',
      'API integration (OpenAI, etc.)',
      'Performance & cost optimization',
    ],
    cta: 'Discuss your idea',
  },
];

export const PROJECTS: Project[] = [
  {
    slug: 'wov3',
    title: 'Wov3',
    description:
      'Recovery footwear engineered around how athletes load, unload, and reset—3D-printed lattice tuned per discipline via foot scanning and gait analysis. Production e-commerce and fitting platform deployed on Vercel.',
    technologies: ['React', 'JavaScript', 'Vercel', 'E-commerce'],
    liveUrl: 'https://www.wov3.com/',
    image: 'assets/wov3.png',
    featured: true,
    caseStudy: {
      problem:
        'Athletes need recovery footwear matched to their biomechanics—not generic foam slides that ignore how they land, load, and reset between training blocks.',
      solution:
        'Co-founded Wov3 with a scan-to-print pipeline: structured-light foot capture, gait analysis, and 3D-printed lattice footwear—paired with a React e-commerce site for storytelling, fitting bookings, and athlete testimonials.',
      impact:
        '30+ semi-pro and pro athletes onboarded; co-developed with TU/e Sports Lab and validated through pressure mapping and force-plate testing before shipping.',
      highlights: [
        '3D-printed lattice tuned per athlete and discipline',
        'Foot scanning and gait capture integrated into the product story',
        'Production React site on Vercel with Calendly fitting flows',
        'Partnerships with TU/e Sports Lab, Mol PT, and collegiate athletes',
      ],
    },
  },
  {
    slug: 'hetal-ascher-consulting',
    title: 'Hetal Ascher Consulting',
    description: 'Client project: educational consulting site for schools and educators—workshops, coaching, and consultation booking. Next.js with Neon Postgres, deployed on AWS Amplify.',
    technologies: ['Next.js', 'TypeScript', 'Neon Postgres', 'AWS Amplify'],
    liveUrl: 'https://main.dbe3ycstvczq3.amplifyapp.com/',
    githubUrl: 'https://github.com/bhaktaravin/hetalascherteachingconsultion',
    image: 'assets/hetalascher.png',
    featured: true,
  },
  {
    slug: 'nagga',
    title: 'NAGGA — North American Gujarati Golf Association',
    description: 'Client project: membership and events platform with registration, member directory, leaderboards, and JWT-authenticated dashboards. Next.js, Prisma, and Neon Postgres on Vercel.',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Neon Postgres', 'Vercel'],
    liveUrl: 'https://nagagolftournamentsite.vercel.app/',
    githubUrl: 'https://github.com/bhaktaravin/nagagolftournamentsite',
    image: 'assets/nagga.png',
    featured: true,
  },
  {
    slug: 'instant-messenger',
    title: 'Instant Messenger — Blast From The Past',
    description: 'Client-ready deploy: retro AOL-style messenger in Rust with egui + WebAssembly, WebSocket chat, and live hosting on AWS Amplify.',
    technologies: ['Rust', 'WebAssembly', 'egui', 'WebSockets', 'AWS Amplify'],
    liveUrl: 'https://main.d3krtfrp4s3ts2.amplifyapp.com/',
    githubUrl: 'https://github.com/bhaktaravin/blast-from-the-past-messenger',
    image: 'assets/instant-messenger.png',
    featured: true,
  },
  {
    slug: 'career-copilot',
    title: 'Career Copilot',
    description: 'AI-powered job application copilot with LLM-driven resume analysis, job-description matching, interview practice, and application pipeline tracking.',
    technologies: ['React', 'TypeScript', 'LLM Integration', 'AI/ML', 'Tailwindcss', 'Replit'],
    liveUrl: 'https://job-application-assistant-ravinbhakta.replit.app',
    githubUrl: 'https://github.com/bhaktaravin/careercopilot',
    image: 'assets/nothumbnail.jpg',
    featured: true,
    caseStudy: {
      problem: 'Job seekers need fast, actionable feedback on resumes and interviews, but generic advice rarely maps to real roles, ATS expectations, or specific job descriptions.',
      solution: 'Architected an AI-first career workflow with LLM-backed resume scoring, JD gap analysis, and interview prep—React and TypeScript on Replit for rapid iteration and always-on deployment.',
      impact: 'Delivers production-grade AI product UX: users get actionable, role-specific feedback in one session instead of generic career advice.',
      highlights: [
        'LLM-powered resume analysis and ATS-style scoring',
        'AI job-description matching with keyword gap insights',
        'Mock interview flows with intelligent, role-aware feedback',
        'Application pipeline dashboard with live Replit deployment',
      ],
    },
  },
  {
    slug: 'mangaviewer',
    title: 'MangaViewer',
    description: 'Modern manga reading app with AI-powered search, chapter navigation, favorites, and progress tracking.',
    technologies: ['Angular', 'TypeScript', 'AI-Powered Search', 'CSS3', 'HTML5'],
    githubUrl: 'https://github.com/ravinbhakta/mangaviewer',
    liveUrl: 'https://mangaviewer-rust-angular.vercel.app/home',
    image: 'assets/mangaviewer.png',
    featured: true,
    caseStudy: {
      problem: 'Manga readers need fast discovery and smooth reading—generic search and clunky UIs make it hard to find titles and track progress across devices.',
      solution: 'Built an Angular app with AI-powered search, lazy-loaded chapters, favorites, and progress tracking—combining intelligent discovery with performance-first image delivery.',
      impact: 'Sub-second loads, smooth scrolling, and AI-assisted discovery that helps users find and resume manga faster than traditional catalog browsing.',
      highlights: [
        'AI-powered search for intelligent title discovery',
        'Lazy loading with intersection observer for optimal performance',
        'Favorites and reading progress tracking across sessions',
        'Responsive design with keyboard shortcuts for power users',
      ],
    },
  },
  {
    slug: 'flutter-finance-tracker',
    title: 'Flutter Personal Finance Tracker',
    description: 'Cross-platform mobile application for personal finance management built with Flutter.',
    technologies: ['Flutter', 'Dart', 'SQLite', 'Material Design', 'Charts'],
    githubUrl: 'https://github.com/bhaktaravin/flutter_personal_finance_tracker',
    image: 'assets/nothumbnail.jpg',
    featured: false,
  },
  {
    slug: 'pokequiz',
    title: "PokéQuiz — Who's That Pokémon?",
    description: 'Interactive Gen 1 Pokémon quiz with silhouette guessing, real-time scoring, and API-driven question generation.',
    technologies: ['ReactJS', 'Vite', 'Tailwindcss', 'Typescript', 'Shadcn/ui'],
    githubUrl: 'https://github.com/bhaktaravin/poke-pal-quiz',
    liveUrl: 'https://www.whosthatpokemon.tv/',
    image: 'assets/poke-pal-quiz.png',
    featured: true,
    caseStudy: {
      problem: 'Pokemon fans wanted an engaging way to test their knowledge of Gen 1 Pokemon, but existing quizzes were either too simple or had poor UX.',
      solution: 'Created an interactive quiz application using React and the Pokemon API, featuring multiple-choice questions, real-time scoring, and beautiful UI with Shadcn components and Tailwind CSS.',
      impact: 'Delivered an engaging quiz experience with instant feedback, smooth animations, and mobile-responsive design that works flawlessly across all devices.',
      highlights: [
        'Real-time API integration with Pokemon database',
        'Responsive design with Tailwind CSS',
        'Modern UI components with Shadcn/ui',
        'TypeScript for type safety and better DX',
      ],
    },
  },
  {
    slug: 'youtube-clone',
    title: 'YouTube Clone',
    description: "A YouTube-inspired video browsing application built with React and Vite.",
    technologies: ['React', 'Vite', 'JavaScript', 'CSS3', 'HTML5'],
    githubUrl: 'https://github.com/bhaktaravin/youtube-clone',
    image: 'assets/nothumbnail.jpg',
    featured: false,
    caseStudy: {
      problem: 'Understanding complex UI patterns and state management in large-scale applications like YouTube requires hands-on practice with real-world layouts.',
      solution: "Recreated YouTube's interface using React and Vite, implementing sidebar navigation, video grid layouts, and video player pages.",
      impact: 'Demonstrated proficiency in building complex, production-ready UIs with modern React patterns, component composition, and responsive design principles.',
      highlights: [
        'Component-based architecture for scalability',
        'Responsive grid layout system',
        "Fast development with Vite's HMR",
        'Clean, maintainable code structure',
      ],
    },
  },
  {
    slug: 'orbit-shell',
    title: 'Orbit Shell',
    description: 'Cross-platform interactive shell in Rust with built-ins, ANSI terminal styling, and OS-native command execution.',
    technologies: ['Rust', 'CLI'],
    githubUrl: 'https://github.com/bhaktaravin/orbit-shell',
    image: 'assets/orbit-shell.png',
    featured: true,
    caseStudy: {
      problem: 'A portfolio-grade systems project needs clear cross-platform behavior and maintainable delivery—not a one-off script that only runs on one machine.',
      solution: 'Built orbit-shell in Rust with cfg-gated process spawning, native builtins, styled output that respects NO_COLOR, and a CI matrix running fmt, clippy, build, and test on three operating systems.',
      impact: 'Shows practical Rust, CLI tooling, and disciplined shipping for developer-facing software.',
      highlights: [
        'Cross-platform execution via cmd vs /bin/sh',
        'Built-in commands and polished terminal UX',
        'CI on Ubuntu, macOS, and Windows',
      ],
    },
  },
];

export const EXPERIENCES: ExperienceEntry[] = [
  {
    company: 'Wov3',
    title: 'Co-Founder',
    location: 'Remote',
    start: 'Jan 2026',
    end: 'Present',
    details: [
      'Co-founding Wov3 — recovery footwear with 3D-printed lattice structures customized per athlete through foot scanning, gait capture, and discipline-specific tuning.',
      'Building the production e-commerce and fitting platform at wov3.com on React and Vercel — scan-to-print storytelling, Calendly booking, and athlete social proof.',
      'Partnering with TU/e Sports Lab and 30+ semi-pro and pro athletes to validate pressure mapping, lattice generations, and recovery-focused product design.',
    ],
    companyUrl: 'https://www.wov3.com/',
  },
  {
    company: 'Self Employed',
    title: 'Senior Software Engineer — Self-Employed',
    location: 'Fremont, CA',
    start: 'Jul 2025',
    end: 'Present',
    details: [
      'Independent development of AI-assisted full-stack and backend applications using modern TypeScript, React, and cloud-native tooling.',
      'Shipped Career Copilot—an LLM-powered job application assistant with resume analysis, JD matching, and interview practice.',
      'Delivered client-facing web platforms (consulting sites, event management) with responsive UX, AWS/Vercel hosting, and performance-focused architecture.',
    ],
    companyUrl: '',
  },
  {
    company: 'Blue Shield of California',
    title: 'Associate, Application Developer',
    location: 'Oakland',
    start: 'Jul 2021',
    end: 'Jun 2025',
    details: [
      'Leveraged VBA, PowerShell, and version control tools (SVN/Git) to automate enterprise workflows in a regulated healthcare environment.',
      'Applied debugging and integration techniques for APIs, services, and RESTful architectures at scale.',
      'Demonstrated expert proficiency in SQL by writing complex queries and supporting data modeling efforts using Oracle SQL Server.',
    ],
    companyUrl: 'https://www.blueshieldca.com/',
  },
  {
    company: 'Entappia',
    title: 'Product Delivery Manager',
    location: 'Palo Alto',
    start: 'Aug 2019',
    end: 'Jul 2021',
    details: [
      'Utilized RESTful API services and contributed to API development for connected, data-rich product experiences.',
      'Integrated SAP Open Connectors with cloud databases (Firebase, Amazon DynamoDB) to enhance scalability.',
      'Modernized legacy codebases with modular architecture and contemporary standards.',
    ],
    companyUrl: 'https://entappia.com',
  },
  {
    company: 'Quality Assurance Internship',
    title: 'Intern',
    location: 'Los Angeles',
    start: 'Sep 2018',
    end: 'May 2019',
    details: [
      'Redesigned application processing by migrating storage from XML to C#.',
      'Implemented a more user-friendly website using C#, Bootstrap, and KendoUI.',
      'Redesigned housing authority portal using ASP.NET MVC with Entity, Kendo UI, and SQL Server.',
    ],
    companyUrl: '',
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    institution: 'University of Colorado Boulder',
    degree: 'Master of Science',
    field: 'Artificial Intelligence',
    start: 'May 2026',
    end: 'Present',
    location: 'Boulder, CO',
    details: ['Currently pursuing MS in Artificial Intelligence'],
    institutionUrl: 'https://www.colorado.edu/',
  },
  {
    institution: 'California State University, Los Angeles',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    start: 'Sep 2015',
    end: 'May 2019',
    location: 'Los Angeles, CA',
    details: ['Bachelors of Science in Computer Science'],
    institutionUrl: 'https://www.calstatela.edu/',
  },
];

export const CERTIFICATIONS: CertificationEntry[] = [
  {
    title: 'Machine Learning with Python',
    issuer: 'Coursera (Authorized by IBM)',
    date: 'Jan 2026',
    credentialId: '',
    credentialUrl: 'https://www.credly.com/badges/e649df27-1069-4a73-8b61-644c375f0186/public_url',
  },
  {
    title: 'Introduction to Scrum Master Profession',
    issuer: 'IBM',
    date: 'Sep 2025',
    credentialId: 'TA7GK09XYXMS',
    credentialUrl: '',
  },
  {
    title: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI, Stanford University',
    date: 'Sep 2025',
    credentialId: 'N4TFEZM0AEIQ',
    credentialUrl: '',
  },
  {
    title: 'Unsupervised Learning, Recommenders, Reinforcement Learning',
    issuer: 'Stanford University',
    date: 'Sep 2025',
    credentialId: 'OEB2D648FQAT',
    credentialUrl: '',
  },
  {
    title: 'Advanced Learning Algorithms',
    issuer: 'DeepLearning.AI, Stanford University',
    date: 'Aug 2025',
    credentialId: 'V72APAFWZ376',
    credentialUrl: '',
  },
  {
    title: 'Introduction to Cybersecurity Careers',
    issuer: 'IBM',
    date: 'Aug 2025',
    credentialId: '4ZZO6LCO4RNJ',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/4Z2O6LCO4RNJ',
  },
  {
    title: 'Supervised Machine Learning: Regression and Classification',
    issuer: 'Stanford University',
    date: 'Jul 2025',
    credentialId: 'IR03C6YJGOOK',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/IR03C6YJGOOK',
  },
];

export const CURRENTLY_LEARNING: LearningItem[] = [
  { name: 'LLM Agents', progress: 70, icon: '🤖' },
  { name: 'Rust', progress: 45, icon: '🦀' },
  { name: 'RAG Pipelines', progress: 55, icon: '🔍' },
];

const AI_AND_LLM = ['LLM Integration', 'Prompt Engineering', 'AI-Assisted UX', 'OpenAI API', 'Generative AI', 'RAG'];
const PROGRAMMING_LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'Go', 'Swift', 'Kotlin', 'PHP'];
const FRAMEWORKS = ['Angular', 'React', 'Vue.js', 'Node.js', 'Django', 'Spring Boot', '.NET Core', 'Express.js', 'Flask', 'Ruby on Rails', 'Laravel'];
const TOOLS = ['Git', 'Docker', 'Jenkins', 'Webpack', 'VS Code', 'Postman', 'JIRA', 'Figma', 'Linux', 'npm', 'Yarn'];
const DATABASES = ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Redis', 'Firebase', 'Oracle'];
const CLOUD_PLATFORMS = ['AWS', 'Azure', 'Google Cloud Platform', 'Heroku', 'DigitalOcean', 'SAP'];

export const SKILL_CATEGORIES: SkillCategory[] = [
  { name: 'AI & LLM', skills: AI_AND_LLM },
  { name: 'Programming Languages', skills: PROGRAMMING_LANGUAGES },
  { name: 'Frameworks', skills: FRAMEWORKS },
  { name: 'Tools', skills: TOOLS },
  { name: 'Databases', skills: DATABASES },
  { name: 'Cloud Platforms', skills: CLOUD_PLATFORMS },
];

export const RESUME_SKILL_CATEGORIES: SkillCategory[] = [
  { name: 'AI & LLM', skills: ['LLM Integration', 'Prompt Engineering', 'AI-Assisted UX', 'OpenAI API'] },
  { name: 'Frontend', skills: ['Angular', 'React', 'TypeScript', 'Tailwind CSS'] },
  { name: 'Backend', skills: ['NestJS', 'Node.js', 'Java (Spring)', 'Python (Django)'] },
  { name: 'Cloud', skills: ['AWS', 'AWS Amplify', 'Vercel', 'Railway'] },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'shipping-client-sites-on-aws-amplify',
    title: 'Shipping Client Sites on AWS Amplify: Lessons from the Field',
    excerpt: 'What I learned deploying production Next.js apps on AWS Amplify for real clients—from env vars to custom domains.',
    date: '2026-02-15',
    readTime: '6 min',
    tags: ['AWS', 'Next.js', 'Freelance'],
    content: `Deploying client sites on AWS Amplify is straightforward once you know the gotchas. Here's what I've learned shipping production apps for consulting clients.

## Why Amplify for client work

AWS Amplify gives you CI/CD, SSL, and CDN out of the box. For clients who already use AWS or want enterprise-grade hosting without managing servers, it's a strong choice.

## Environment variables

The biggest friction point is environment variables. Amplify reads them at build time for Next.js, so you need to set them in the Amplify console—not just in a local \`.env\` file. Document this for clients during handoff.

## Custom domains

Connecting a custom domain takes 15–30 minutes if DNS is already managed. Walk clients through the CNAME records and verify SSL provisioning completes before calling the project done.

## Postgres with Neon

For database-backed sites, I pair Amplify with Neon Postgres. The serverless Postgres model keeps costs low for low-traffic client sites while scaling when needed.

## Takeaway

Amplify + Next.js + Neon is my go-to stack for client marketing and consulting sites. The deployment story is clean, and clients get a live URL they can share on day one.`,
  },
  {
    slug: 'building-llm-features-that-ship',
    title: 'Building LLM Features That Actually Ship',
    excerpt: 'Practical patterns for integrating LLMs into web apps without over-engineering—prompt design, guardrails, and cost control.',
    date: '2026-01-28',
    readTime: '8 min',
    tags: ['AI', 'LLM', 'TypeScript'],
    content: `Everyone wants AI features. Few ship them well. Here's how I approach LLM integration for production web apps.

## Start with the user workflow

Don't bolt on a chatbot because it's trendy. Map the user's actual task—resume analysis, document Q&A, smart search—and design the LLM call around that specific outcome.

## Prompt engineering is product work

Your system prompt is part of your product spec. Version it, test it, and treat changes like code changes. I keep prompts in dedicated files with clear variable injection points.

## Guardrails matter

Always validate LLM output before showing it to users. Parse structured responses (JSON mode), handle failures gracefully, and set token limits to control costs.

## Cost control

Cache repeated queries, use smaller models for classification tasks, and batch requests where possible. A feature that costs $50/month per user won't survive production.

## Career Copilot as a case study

Career Copilot uses LLMs for resume scoring, JD matching, and interview prep. Each feature has its own prompt chain, output validation, and fallback when the API is slow or unavailable.

## Bottom line

LLM features ship when you treat them like any other API integration—with error handling, testing, and cost awareness baked in from the start.`,
  },
  {
    slug: 'angular-portfolio-lessons',
    title: 'What I Learned Rebuilding My Portfolio in Angular 21',
    excerpt: 'Standalone components, signals, Firebase integration, and why I chose a single-page layout over a CMS.',
    date: '2026-01-10',
    readTime: '5 min',
    tags: ['Angular', 'Portfolio', 'Web Dev'],
    content: `I rebuilt my portfolio from scratch using Angular 21. Here's what worked and what I'd do differently.

## Standalone components everywhere

No NgModules. Every component is standalone with explicit imports. The result is a flatter structure that's easier to navigate and tree-shake.

## Signals for reactive UI

Project filtering uses Angular signals instead of RxJS for simple state. For a portfolio site, signals are the right level of reactivity without the ceremony.

## Centralized data

The biggest refactor was moving all content into a single \`portfolio.data.ts\` file. Sections, resume export, blog posts, and case studies all read from one source. No more copy-paste drift between components.

## Firebase for social proof

Testimonials and product reviews use Firestore for real-time updates. Visitors can leave reviews, and I see them instantly. Security rules are the next priority.

## Single-page vs. multi-page

I kept the main portfolio as a single scrollable page for impact, but added routes for blog posts and case studies. Best of both worlds: fast first impression, deep content when needed.

## What's next

Dark/light mode toggle, Cal.com booking, and a proper PWA setup. The foundation is solid—now it's about polish and conversion.`,
  },
];

export const PRIMARY_NAV: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export const MORE_NAV: NavLink[] = [
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'blog', label: 'Blog' },
];

export const FOOTER_NAV: NavLink[] = [
  { id: 'products', label: 'Products' },
  { id: 'github', label: 'GitHub' },
  { id: 'book', label: 'Book a Call' },
];

export const PAGE_SECTIONS = [
  'home', 'about', 'projects', 'services', 'testimonials', 'skills',
  'experience', 'contact', 'book', 'blog', 'products', 'github',
  'education', 'certifications',
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function experiencesToResume(): ResumeExperience[] {
  return EXPERIENCES.map((exp) => ({
    title: exp.title,
    company: exp.company,
    period: `${exp.start} - ${exp.end}`,
    description: exp.details.join(' '),
  }));
}

export function educationToResume(): ResumeEducation[] {
  return EDUCATION.map((edu) => ({
    degree: `${edu.degree} in ${edu.field}${edu.end === 'Present' ? ' (In progress)' : ''}`,
    institution: edu.institution,
    period: `${edu.start} - ${edu.end}`,
    location: edu.location,
  }));
}

export function certificationsToResume(): ResumeCertification[] {
  return CERTIFICATIONS.map((cert) => ({
    name: cert.title,
    issuer: cert.issuer,
    year: cert.date,
  }));
}
