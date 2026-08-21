import rentBookImage from '../assets/images/rent_book_pro_docs.webp';
import edgarAiImage from '../assets/images/edgar_ai_2_docs.webp';
import quizRewardImage from '../assets/images/quizreward_docs.webp';
import whatsappCrmImage from '../assets/images/whatsapp_crm_preview.jpg';
import telegramAutomationImage from '../assets/images/telegram_automation_preview.jpg';
// Spec and Mech don't have direct imports from assets but we'll use public paths or fallbacks

export interface ProjectData {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  technologies: string[];
  preview?: string;
  url: string;
  ctaText: string;
  secondaryCtaText?: string;
  secondaryUrl?: string;
  featured: boolean;
  filterCategories: string[];
}

export const portfolioProjects: ProjectData[] = [
  {
    id: "p1",
    name: "Edgar AI",
    slug: "edgar-ai-2",
    category: "AI / Web Application",
    description: "Advanced AI search and interaction tool with a custom natural language processing engine. Leverages fine-tuned LLMs and vector databases.",
    technologies: ["React", "TypeScript", "AI", "Vector DB", "Python"],
    preview: edgarAiImage,
    url: "/edgar-ai-2/index.html",
    ctaText: "View Project",
    secondaryCtaText: "Docs",
    secondaryUrl: "/edgar-ai-docs",
    featured: true,
    filterCategories: ["All", "AI", "Web Apps"]
  },
  {
    id: "p2",
    name: "QuizReward",
    slug: "quizreward",
    category: "Web Application / Gamification",
    description: "Gamified learning and reward platform with live interactive sessions and a real-time server-authoritative game engine.",
    technologies: ["React", "TypeScript", "Firebase", "WebSockets"],
    preview: quizRewardImage,
    url: "/quizreward/index.html",
    ctaText: "View Project",
    featured: false,
    filterCategories: ["All", "Web Apps", "Interactive"]
  },
  {
    id: "p3",
    name: "Rent Book Pro",
    slug: "rent-book-pro",
    category: "Business Software / Web Application",
    description: "A comprehensive property and tenant management application with a secure stateless edge architecture.",
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    preview: rentBookImage,
    url: "/rent-book-pro/index.html",
    ctaText: "View Project",
    featured: false,
    filterCategories: ["All", "Web Apps"]
  },
  {
    id: "p4",
    name: "Mech",
    slug: "mech",
    category: "Interactive Web / Game",
    description: "A high-performance browser-based interactive mechanical simulation experience.",
    technologies: ["WebGL", "Three.js", "TypeScript"],
    preview: "", // Handled dynamically in the component if empty
    url: "/mech/index.html",
    ctaText: "Play / View Project",
    featured: false,
    filterCategories: ["All", "Interactive", "Experiments"]
  },
  {
    id: "p5",
    name: "Spec",
    slug: "spec",
    category: "Interactive Web Experience",
    description: "Premium Browser FPS Game. Next-generation multiplayer tactical shooter with cinematic graphics and flawless performance.",
    technologies: ["HTML5 Canvas", "React", "Node.js", "WebGL"],
    preview: "/spec-preview.png", // Existing public asset from previous version
    url: "/spec/index.html",
    ctaText: "View Project",
    featured: false,
    filterCategories: ["All", "Interactive", "Experiments"]
  },
  {
    id: "p6",
    name: "WhatsApp CRM Automation",
    slug: "whatsapp-crm",
    category: "Business Automation",
    description: "A sophisticated enterprise automation tool that transforms standard WhatsApp into a full-fledged CRM system.",
    technologies: ["WhatsApp API", "Node.js", "Express", "MongoDB"],
    preview: whatsappCrmImage,
    url: "/whatsapp-crm-docs",
    ctaText: "View Project",
    secondaryCtaText: "Docs",
    secondaryUrl: "/whatsapp-crm-docs",
    featured: false,
    filterCategories: ["All", "Web Apps", "Experiments"]
  },
  {
    id: "p7",
    name: "Telegram Automation",
    slug: "telegram-automation",
    category: "Bot / Workflow",
    description: "A fleet of highly specialized Telegram bots designed for high-throughput data processing and automated moderation.",
    technologies: ["Node.js", "Telegram API", "MongoDB", "Redis"],
    preview: telegramAutomationImage,
    url: "/telegram-automation-docs",
    ctaText: "View Project",
    secondaryCtaText: "Docs",
    secondaryUrl: "/telegram-automation-docs",
    featured: false,
    filterCategories: ["All", "Experiments", "Interactive"]
  }
];
