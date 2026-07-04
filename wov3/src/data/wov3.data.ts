export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  price: string;
  features: string[];
  badge?: string;
  /** Shopify Storefront API variant GID for checkout */
  variantId?: string;
  imageUrl?: string;
  shopifyHandle?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
}

export const BRAND = {
  name: 'Wov3',
  tagline: 'Comfort That Never Quits',
  heroTitle: 'Step into the Future of Comfort',
  heroSubtitle:
    '3D-printed footwear engineered for athletes and built for everyone. Energy return, adaptive cushioning, and recovery that never stops.',
  ctaPrimary: 'Shop Collection',
  ctaSecondary: 'Ask Our AI Guide',
};

export const TECHNOLOGY = {
  title: 'HALS Technology',
  subtitle: 'High-Accuracy Layering System',
  description:
    'Wov3 employs HALS ultrafast 3D printing at the core of its manufacturing process. This groundbreaking system raises production speed, precision, and scalability to new levels—enabling complex, multi-dimensional lattice designs beyond standard molding or assembly-line techniques.',
  benefits: [
    { title: 'Energy Return', desc: 'Lattice structures return energy with every step, reducing fatigue.' },
    { title: 'Adaptive Cushioning', desc: 'Elastomeric mesh molds to your foot for personalized comfort.' },
    { title: 'Sustainable', desc: 'On-demand printing eliminates waste from traditional manufacturing.' },
    { title: 'Precision Fit', desc: 'Scan-to-print insoles tailored to your unique gait and arch.' },
  ],
};

export const PRODUCTS: Product[] = [
  {
    id: 'wv-1',
    name: 'WV-1',
    tagline: 'Recovery Slides',
    description:
      'The perfect slip-on crafted through advanced 3D printing. Innovative elastomeric mesh molds effortlessly to your foot—ideal for post-workout relaxation or daily wear.',
    category: 'Recovery',
    price: 'From $89',
    features: ['Breathable lattice mesh', 'Instant slip-on comfort', 'Post-workout recovery'],
    badge: 'Best Seller',
  },
  {
    id: 'wv-2',
    name: 'WV-2',
    tagline: 'Running Shoes',
    description:
      'Engineered for performance with HALS-printed midsoles that adapt to your stride. Lightweight, responsive, and built to go the distance.',
    category: 'Performance',
    price: 'From $149',
    features: ['Responsive energy return', 'Lightweight construction', 'All-day durability'],
  },
  {
    id: 'wv-3',
    name: 'WV-3',
    tagline: 'Massage Clogs',
    description:
      'Featuring an integrated massage footbed that stimulates pressure points to improve circulation and reduce post-activity fatigue.',
    category: 'Recovery',
    price: 'From $119',
    features: ['Integrated massage footbed', 'Targeted pressure relief', 'Active recovery support'],
  },
  {
    id: 'wv-4',
    name: 'WV-4',
    tagline: 'Custom Insole',
    description:
      'Foot scanning captures your geometry in seconds. We model lattice density to your gait, then print a tailored insole for personalized arch support.',
    category: 'Custom',
    price: 'From $79',
    features: ['3D foot scan', 'Gait-based lattice tuning', 'Personalized arch support'],
    badge: 'Custom Fit',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Jadarian Price',
    role: 'Notre Dame Football — Running Back',
    quote:
      "I couldn't believe the comfort level until I tried the WV-1. After slipping them on, I immediately understood the hype. A game-changer for recovery!",
    initials: 'JP',
  },
  {
    name: 'Bree Bates',
    role: 'Michigan Track',
    quote:
      'WV-1 is the perfect combination of style and comfort. Out of all my options these are my go-to.',
    initials: 'BB',
  },
  {
    name: 'Charles Du',
    role: 'Notre Dame Football — Cornerback',
    quote:
      "WV-1 is unbelievably comfy—they're the first thing I put on after a game. Once you try them, you won't want to take them off.",
    initials: 'CD',
  },
  {
    name: 'Ethan Edwards',
    role: 'Michigan Ice Hockey',
    quote:
      'The WV-1 molds to my feet perfectly, giving me the support and cushioning I need to recover after a long day on the ice.',
    initials: 'EE',
  },
  {
    name: 'Nolan Miller',
    role: "Michigan Men's Soccer Captain",
    quote:
      "There's nothing better than finishing my workouts, slipping my slides on, and letting my body comfortably recover.",
    initials: 'NM',
  },
  {
    name: 'Nick Butler-Simpson',
    role: 'Michigan Track',
    quote:
      'I let all my teammates try them—every single one loved it. The comfort and recovery support are unmatched.',
    initials: 'NB',
  },
];

export const CHAT_KNOWLEDGE = {
  greeting:
    "Hi! I'm the Wov3 AI guide. I can help you find the perfect shoe, explain our HALS 3D printing technology, or answer questions about custom insoles. What would you like to know?",
  quickActions: [
    'Tell me about WV-1',
    'Compare all products',
    'How does HALS work?',
    'Custom insole process',
    'Sizing & returns',
  ],
  responses: {
    'wv-1':
      'WV-1 Recovery Slides are our best seller — a slip-on with 3D-printed elastomeric mesh that molds to your foot. Perfect for post-workout recovery or everyday comfort. Starting at $89.',
    'wv-2':
      'WV-2 Running Shoes feature HALS-printed responsive midsoles for energy return on every stride. Lightweight and durable — built for performance. Starting at $149.',
    'wv-3':
      'WV-3 Massage Clogs have an integrated massage footbed that stimulates pressure points, improves circulation, and reduces post-activity fatigue. Starting at $119.',
    'wv-4':
      'WV-4 Custom Insoles start with a quick 3D foot scan. We model lattice density to your gait and print a tailored insole for personalized arch support. Starting at $79.',
    compare:
      'Here\'s a quick comparison:\n• WV-1 — Recovery slides, best for post-workout ($89)\n• WV-2 — Running shoes, performance-focused ($149)\n• WV-3 — Massage clogs, active recovery ($119)\n• WV-4 — Custom insoles, scan-to-print fit ($79)\n\nFor recovery after sports, WV-1 or WV-3. For running, WV-2. For personalized support, WV-4.',
    hals: 'HALS (High-Accuracy Layering System) is our ultrafast 3D printing technology. It enables complex lattice structures that return energy, cushion impact, and adapt to your foot — something traditional molding can\'t achieve. It\'s also more sustainable since we print on demand.',
    custom:
      'Custom insole process: 1) Quick 3D foot scan captures your geometry. 2) We analyze your gait and arch. 3) Lattice density is tuned to your needs. 4) Your WV-4 insole is printed and shipped. Takes about 2 weeks from scan to delivery.',
    sizing:
      'WV-1 through WV-3 run true to size. If between sizes, we recommend sizing up for recovery slides. WV-4 custom insoles are made to your exact scan — no sizing guesswork. We offer 30-day returns on standard products.',
    default:
      'Great question! Wov3 specializes in 3D-printed footwear using HALS technology. Our lineup includes recovery slides (WV-1), running shoes (WV-2), massage clogs (WV-3), and custom insoles (WV-4). Ask me about any product or our technology!',
  } as Record<string, string>,
};
