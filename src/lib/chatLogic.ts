// ─── Content-Grounded Chat Logic for Edgar AI ───────────────────────────────
import { edgarContent } from '../data/edgarContent';

export interface ChatCTA {
  label: string;
  href: string;
  icon?: string;  // emoji
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  cta?: ChatCTA;          // optional action button rendered below the bubble
}

interface AIResponse {
  content: string;
  suggestions: string[];
  cta?: ChatCTA;
}

// ─── Intent Keywords ─────────────────────────────────────────────────────────
const INTENTS: Record<string, string[]> = {
  greeting:    ['hi', 'hello', 'hey', 'start', 'begin', 'sup', 'howdy', 'greet'],
  skills:      ['skill', 'stack', 'tech', 'react', 'node', 'tools', 'language', 'know', 'use', 'build with', 'python', 'typescript', 'tailwind', 'firebase', 'mongodb'],
  experience:  ['experience', 'work', 'job', 'company', 'role', 'background', 'career', 'history', 'btech', 'b.tech', 'degree', 'college', 'university', 'student', 'study here', 'education'],
  projects:    ['project', 'portfolio', 'built', 'build', 'made', 'app', 'game', 'website', 'created', 'spec', 'mech', 'quizreward', 'rent', 'whatsapp', 'telegram', 'edgar'],
  contact:     ['contact', 'hire', 'email', 'message', 'talk', 'connect', 'reach', 'available', 'opportunity', 'freelance'],
  resume:      ['resume', 'cv', 'download'],
  whoami:      ['who are you', 'what are you', 'your name', 'about you', 'what can you do'],
  frontend:    ['frontend', 'front end', 'ui', 'interface', 'css', 'animation', 'framer', 'design'],
  backend:     ['backend', 'back end', 'server', 'api', 'database', 'db', 'node', 'express'],
  ai_projects: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'openai', 'gemini', 'gpt', 'bot', 'automation', 'nlp'],
  mobile:      ['mobile', 'android', 'ios', 'react native'],
  // ── Learning Hub intent ──────────────────────────────────────────────────
  learning:    [
    'study', 'material', 'tutorial', 'learn', 'course', 'resource',
    'guide', 'notes', 'documentation', 'docs', 'lesson', 'teaching',
    'how to learn', 'where to learn', 'reading', 'reference',
    'dsa', 'data structure', 'algorithm', 'system design',
    'learning hub', 'hub', 'tutorials page',
  ],
};

// ─── Score-Based Intent Matching ─────────────────────────────────────────────
function matchIntent(message: string): string {
  const lower = message.toLowerCase();
  let bestIntent = 'default';
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(INTENTS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length > 4 ? 2 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  return bestIntent;
}

// ─── Build Answers from Content ──────────────────────────────────────────────
function buildResponse(intent: string, userName?: string): AIResponse {
  const c = edgarContent;
  const name = userName ? `${userName}! ` : '';

  switch (intent) {

    case 'greeting':
      return {
        content: `Hi ${name}I'm Edgar AI, Emil's portfolio assistant. I can answer questions about his skills, experience, projects, and how to get in touch. What would you like to explore?`,
        suggestions: ["What's his tech stack?", "Show me his projects", "Tell me about his experience"],
      };

    case 'whoami':
      return {
        content: `I'm Edgar AI — a simulated assistant built specifically for this portfolio. I run entirely on the frontend with no backend calls. I can answer questions about Emil's skills, projects, experience, study background, and I can even point you to his Learning Hub for study materials! 🤖`,
        suggestions: ["What's Emil's tech stack?", "What projects has he built?", "Where can I find study materials?"],
      };

    case 'skills': {
      const fe = c.skills.frontend.join(', ');
      const be = c.skills.backend.join(', ');
      const ai = c.skills.ai.join(', ');
      const db = c.skills.databases.join(', ');
      return {
        content: `Emil's tech stack spans the full spectrum:\n\n🎨 **Frontend:** ${fe}\n\n⚙️ **Backend:** ${be}\n\n🤖 **AI & ML:** ${ai}\n\n🗄️ **Databases:** ${db}`,
        suggestions: ["Show me a project using React", "Tell me about his AI work", "How do I hire him?"],
      };
    }

    case 'frontend':
      return {
        content: `Emil is a strong frontend engineer. His core stack is **React + TypeScript**, styled with **Tailwind CSS**, and animated with **Framer Motion** for premium micro-interactions. He also works with **HTML5 Canvas**, **WebGL**, and **Three.js** for 3D/game experiences.`,
        suggestions: ["What backend tech does he use?", "See a frontend project", "Tell me about his AI work"],
      };

    case 'backend':
      return {
        content: `On the backend, Emil builds with **Node.js + Express** for REST APIs, uses **WebSockets / BullMQ** for real-time and async workloads, and deploys with **Docker + Nginx + PM2**. He's proficient in **MongoDB, PostgreSQL, Redis**, and **Firebase**.`,
        suggestions: ["What frontend tech does he use?", "Does he work with AI APIs?", "How do I contact him?"],
      };

    case 'ai_projects':
      return {
        content: `AI is Emil's speciality! He works with **OpenAI, Gemini, and LangChain** for LLM integrations, builds **NLP pipelines**, and creates automation bots (WhatsApp, Telegram) that process thousands of messages daily. He's also built vector database search pipelines and ONNX on-device ML models.`,
        suggestions: ["Tell me about the WhatsApp CRM", "What is the Telegram Automation?", "Show all his projects"],
      };

    case 'experience': {
      const exp = c.experience.map(e =>
        `• **${e.role}** @ ${e.company} (${e.period})\n  ${e.description}`
      ).join('\n\n');
      return {
        content: `Here's Emil's background:\n\n${exp}\n\nHe balances his Computer Science degree with active freelance development work.`,
        suggestions: ["What's his tech stack?", "What has he built?", "Is he available to hire?"],
      };
    }

    case 'projects': {
      const list = c.projects.map(p => `• **${p.name}** — ${p.description}`).join('\n');
      return {
        content: `Emil has built ${c.projects.length} featured projects:\n\n${list}\n\nWant details on any specific project?`,
        suggestions: ["Tell me about QuizReward", "Tell me about the WhatsApp CRM", "Tell me about SPEC"],
      };
    }

    case 'contact': {
      const ct = c.contact;
      return {
        content: `${ct.hireMeText}\n\n📧 **Email:** ${ct.email}\n🐙 **GitHub:** github.com/emilpunnoose\n💼 **LinkedIn:** linkedin.com/in/emilpunnoose`,
        suggestions: ["Download his resume", "What are his skills?", "Show his projects"],
      };
    }

    case 'resume':
      return {
        content: `Emil's resume is available on the portfolio. Click **Resume** in the top navigation bar to view it. He's currently open to freelance and part-time opportunities while completing his BTech!`,
        suggestions: ["What's his experience?", "How do I contact him?", "What's his tech stack?"],
      };

    case 'mobile':
      return {
        content: `Emil currently focuses primarily on web applications. However, his projects like QuizReward and Rent Book Pro are **fully responsive** and work beautifully on mobile. He has React Native exposure and could take on mobile projects.`,
        suggestions: ["What web projects has he built?", "Tell me about his skills", "How do I hire him?"],
      };

    // ── Learning Hub ─────────────────────────────────────────────────────────
    case 'learning': {
      const hub = c.learningHub;
      const topics = hub.topics.join(' · ');
      return {
        content: `Looking for study materials? Emil curates structured resources in his **Learning Hub** 📚\n\nTopics covered: ${topics}\n\nYou can explore tutorials, guides, and curated references all in one place. Click below to open it, or just keep chatting here!`,
        suggestions: ["What's Emil's tech stack?", "Show me his projects", "How do I contact him?"],
        cta: {
          label: '📚 Open Learning Hub',
          href: hub.url,
          icon: '📚',
        },
      };
    }

    default:
      return {
        content: `I don't have a specific answer for that yet! I'm best at answering questions about Emil's **skills**, **projects**, **experience**, **education**, and **how to contact him**. I can also point you to his **Learning Hub** for study materials!`,
        suggestions: ["What's his tech stack?", "Show me his projects", "Where can I find study materials?"],
      };
  }
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export const generateAIResponse = async (
  userMessage: string,
  userName?: string
): Promise<AIResponse> => {
  // Simulate realistic typing delay (800ms – 2000ms)
  const delay = Math.floor(Math.random() * 1200) + 800;
  await new Promise(resolve => setTimeout(resolve, delay));

  const intent = matchIntent(userMessage);
  return buildResponse(intent, userName);
};
