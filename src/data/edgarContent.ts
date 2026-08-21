// ─── Single source of truth for all portfolio content ───────────────────────
// Edit this file to keep Edgar AI answers accurate as the portfolio evolves.

export const edgarContent = {
  profile: {
    name: "Emil Punnoose Varughese",
    title: "AI & Full-Stack Developer",
    tagline: "Building intelligent systems, complex automations, and premium web interfaces.",
    bio: "Emil is a BTech student (Computer Science, 2023–2027) who also runs a self-employed AI & Full-Stack development practice. He blends engineering precision with creative product thinking — building AI tools, automation systems, and premium web applications.",
    location: "India",
    availability: "Open to freelance & part-time opportunities",
  },

  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Framer Motion", "Tailwind CSS", "HTML5 Canvas", "WebGL", "Three.js"],
    backend: ["Node.js", "Express", "Python", "REST APIs", "WebSockets", "BullMQ"],
    databases: ["MongoDB", "PostgreSQL", "Firebase Firestore", "Redis"],
    ai: ["OpenAI API", "Gemini API", "LangChain", "ONNX", "Vector Databases", "NLP", "Prompt Engineering"],
    devops: ["Docker", "PM2", "Nginx", "Vercel", "Git"],
    other: ["WhatsApp Cloud API", "Telegram Bot API", "Stripe API", "OAuth2 / JWT"],
  },

  experience: [
    {
      role: "AI & Full-Stack Developer",
      company: "Freelance / Self-Employed",
      period: "2023 – Present",
      description: "Building custom AI integrations, automation bots, CRM systems, and premium web applications for clients globally. Specialises in WhatsApp/Telegram automation and LLM-powered tools. Runs alongside his BTech studies.",
    },
    {
      role: "BTech – Computer Science & Engineering",
      company: "University",
      period: "2023 – 2027 (Currently Enrolled)",
      description: "Currently pursuing a Bachelor of Technology in Computer Science & Engineering. Applies academic knowledge directly to real-world projects — from AI pipelines to full-stack web apps and automation systems.",
    },
  ],

  learningHub: {
    description: "Emil shares structured study materials, coding tutorials, and curated resources in the Learning Hub — a dedicated section of this portfolio for developers and students.",
    url: "/tutorials",
    label: "Open Learning Hub",
    topics: ["Web Development", "AI & Machine Learning", "DSA", "System Design", "Automation", "React & TypeScript"],
  },

  projects: [
    {
      name: "Edgar AI",
      description: "A portfolio assistant AI — the very bot you're talking to! Built with React, TypeScript and a content-grounded response engine.",
      stack: ["React", "TypeScript", "Framer Motion"],
      url: "/ai-chat",
      category: "AI",
    },
    {
      name: "QuizReward",
      description: "Gamified live quiz platform with real-time multiplayer sessions, Firebase Firestore, and a server-authoritative game engine.",
      stack: ["React", "TypeScript", "Firebase", "WebSockets"],
      url: "/quizreward/index.html",
      category: "Web App",
    },
    {
      name: "Rent Book Pro",
      description: "Full-featured property and tenant management SaaS — lease tracking, payment records, and a secure stateless edge architecture.",
      stack: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
      url: "/rent-book-pro/index.html",
      category: "Business Software",
    },
    {
      name: "SPEC",
      description: "Premium browser-based FPS game — cinematic multiplayer tactical shooter with canvas rendering, no download required.",
      stack: ["HTML5 Canvas", "JavaScript", "WebGL"],
      url: "/spec/index.html",
      category: "Game",
    },
    {
      name: "Mech",
      description: "Browser-based open-world mech game with tile-based navigation, collectibles, and portal progression across 15 levels.",
      stack: ["HTML5 Canvas", "JavaScript"],
      url: "/mech/index.html",
      category: "Game",
    },
    {
      name: "WhatsApp CRM Automation",
      description: "Enterprise-grade CRM that transforms WhatsApp Business into a full automation platform — AI responses, lead scoring, broadcasts.",
      stack: ["Node.js", "WhatsApp Cloud API", "MongoDB", "Redis", "BullMQ"],
      url: "/whatsapp-crm-docs",
      category: "Automation",
    },
    {
      name: "Telegram Automation Fleet",
      description: "Scalable fleet of Telegram bots for moderation, sales, and data processing — stateless workers, Redis sessions, webhook-driven.",
      stack: ["Node.js", "Telegraf", "MongoDB", "Redis", "Docker"],
      url: "/telegram-automation-docs",
      category: "Automation",
    },
  ],

  contact: {
    email: "emilpunnoose@gmail.com",
    github: "https://github.com/emilpunnoose",
    linkedin: "https://linkedin.com/in/emilpunnoose",
    resumeUrl: "/resume",
    hireMeText: "Emil is currently open to freelance projects and full-time opportunities. The best way to reach him is via the Contact section on the portfolio or by clicking 'Hire Me' in the navigation bar.",
  },
};

export type EdgarContent = typeof edgarContent;
