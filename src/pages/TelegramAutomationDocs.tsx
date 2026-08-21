import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MessageSquare, Server, Code2, ShieldCheck,
  Database, Webhook, Users, Zap, Bot, ChevronDown, ChevronRight,
  BarChart3, Filter, Send, GitBranch, Clock, Terminal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Types ───────────────────────────────────────────────────
interface AccordionItem { title: string; content: string; }

// ─── Data ────────────────────────────────────────────────────
const features = [
  {
    icon: <Bot className="w-6 h-6" />,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
    title: 'Multi-Bot Fleet Management',
    desc: 'Manage a fleet of specialized Telegram bots (Support, Moderation, Sales) from a single centralized control panel. Share data context seamlessly between bots.',
  },
  {
    icon: <Filter className="w-6 h-6" />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'Automated Group Moderation',
    desc: 'Advanced anti-spam filters, keyword detection, and behavior analysis to automatically mute, kick, or ban malicious users in massive community groups.',
  },
  {
    icon: <Terminal className="w-6 h-6" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Interactive Inline Menus',
    desc: 'Rich, interactive chat experiences using Telegram\'s inline keyboards, callback queries, and deep linking for complex user journeys directly within the chat.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Live Telemetry & Analytics',
    desc: 'Real-time dashboard tracking active users, command usage frequencies, conversion funnels, and moderation actions taken across all managed groups.',
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Dynamic Workflow Builder',
    desc: 'Visual node-based editor to define conversation logic, state machines, and API integrations without writing code for every new campaign.',
  },
  {
    icon: <Send className="w-6 h-6" />,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    title: 'High-Throughput Broadcasting',
    desc: 'Asynchronous broadcasting engine capable of delivering updates to hundreds of thousands of subscribers safely without hitting Telegram API limits.',
  },
  {
    icon: <Database className="w-6 h-6" />,
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10 border-fuchsia-500/20',
    title: 'Stateful Session Management',
    desc: 'Redis-backed session storage allows bots to remember user context, preferences, and multi-step form data across sessions and even across different bots.',
  },
  {
    icon: <Webhook className="w-6 h-6" />,
    color: 'text-blue-500',
    bg: 'bg-blue-600/10 border-blue-600/20',
    title: 'External API Integrations',
    desc: 'Seamlessly connect Telegram interactions with external CRMs, payment gateways (Stripe/Crypto), and internal company databases via secure webhooks.',
  },
];

const stack = [
  { name: 'Telegram Bot API', role: 'Core Platform', color: 'bg-sky-500' },
  { name: 'Telegraf / Node.js', role: 'Bot Framework & Runtime', color: 'bg-yellow-500' },
  { name: 'MongoDB', role: 'Persistent Storage', color: 'bg-emerald-500' },
  { name: 'Redis', role: 'Session State & Pub/Sub', color: 'bg-red-500' },
  { name: 'Docker', role: 'Containerization', color: 'bg-blue-500' },
  { name: 'Nginx', role: 'Reverse Proxy & Load Balancing', color: 'bg-green-500' },
  { name: 'Grafana & Prometheus', role: 'Metrics & Monitoring', color: 'bg-orange-500' },
  { name: 'BullMQ', role: 'Task Scheduling', color: 'bg-purple-500' },
];

const faqs: AccordionItem[] = [
  {
    title: 'How does the system handle high message volume during spikes?',
    content: 'The architecture uses Webhooks rather than Long Polling for production deployments. Incoming updates from Telegram hit a robust Nginx reverse proxy, which load-balances requests across multiple Node.js worker instances. Heavy tasks are immediately offloaded to BullMQ backed by Redis, ensuring the webhook responds instantly to Telegram.',
  },
  {
    title: 'How are multi-step conversations (forms) managed?',
    content: 'We use a Scene-based middleware approach (via Telegraf Scenes) combined with Redis for session storage. This creates isolated state machines for complex flows like user onboarding or checkout, allowing users to pause and resume flows seamlessly.',
  },
  {
    title: 'Can the bots process media (images, documents)?',
    content: 'Yes. The bots can receive, process, and forward media. For heavy processing (e.g., OCR on images or virus scanning on documents), the file ID is passed to a background worker which downloads the file from Telegram\'s servers asynchronously and updates the user upon completion.',
  },
  {
    title: 'How do you prevent getting rate-limited or banned by Telegram?',
    content: 'The broadcasting engine strictly adheres to Telegram\'s limits (e.g., ~30 messages per second globally, ~1 message per second to a specific chat). A centralized Redis token bucket rate limiter coordinates outgoing API calls across all worker nodes to prevent limit violations.',
  },
  {
    title: 'Is it possible to integrate payment processing?',
    content: 'Absolutely. The bots integrate with Telegram\'s native Payments API (Stripe, etc.) as well as external crypto payment gateways. Payment state is securely tracked, and webhooks fulfill the digital product or service automatically upon successful payment.',
  },
];

const codeSnippets: Record<string, string> = {
  webhook: `// Webhook Setup — src/bot.js
import { Telegraf } from 'telegraf';
import express from 'express';

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// Set up webhook path
const secretPath = \`/telegraf/\${bot.secretPathComponent()}\`;
bot.telegram.setWebhook(\`https://api.mydomain.com\${secretPath}\`);

// Middleware to log updates
bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log('Response time %sms', ms);
});

// Express app handles webhook POSTs
app.use(bot.webhookCallback(secretPath));
app.listen(3000, () => console.log('Bot listening on port 3000'));`,

  scene: `// User Onboarding Scene — src/scenes/onboarding.js
import { Scenes } from 'telegraf';

export const onboardingScene = new Scenes.WizardScene(
  'ONBOARDING_WIZARD',
  async (ctx) => {
    await ctx.reply('Welcome! What is your full name?');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.name = ctx.message.text;
    await ctx.reply('Great. Please share your contact number.', {
      reply_markup: {
        keyboard: [[{ text: '📱 Share Contact', request_contact: true }]],
        one_time_keyboard: true,
        resize_keyboard: true
      }
    });
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message.contact) {
      await ctx.reply('Please use the button to share your contact.');
      return;
    }
    ctx.session.phone = ctx.message.contact.phone_number;
    await saveUserToDB(ctx.from.id, ctx.session);
    await ctx.reply('Registration complete! Explore our menu.', mainMenuKeyboard);
    return ctx.scene.leave();
  }
);`,

  broadcast: `// Broadcasting Worker — src/workers/broadcast.js
import { Queue, Worker } from 'bullmq';
import { Telegram } from 'telegraf';

const telegram = new Telegram(process.env.BOT_TOKEN);
const broadcastQueue = new Queue('broadcasts', { connection: redisConfig });

const worker = new Worker('broadcasts', async (job) => {
  const { userId, message, keyboard } = job.data;
  
  try {
    await telegram.sendMessage(userId, message, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  } catch (error) {
    if (error.response?.error_code === 403) {
      // User blocked the bot, deactivate in DB
      await deactivateUser(userId);
    } else if (error.response?.error_code === 429) {
      // Rate limited, re-queue with delay
      const retryAfter = error.response.parameters.retry_after * 1000;
      throw new Error(\`Rate limit: retry after \${retryAfter}ms\`); // BullMQ handles retry
    }
  }
}, {
  limiter: { max: 25, duration: 1000 } // Global max 25 msgs/sec
});`,
};

// ─── Accordion ───────────────────────────────────────────────
function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/40 transition-colors"
          >
            <span className="font-semibold text-slate-200 text-sm">{item.title}</span>
            {open === i
              ? <ChevronDown className="w-4 h-4 text-sky-400 flex-shrink-0" />
              : <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
            }
          </button>
          {open === i && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-5 pb-5"
            >
              <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">{item.content}</p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Code Block ───────────────────────────────────────────────
function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-slate-500 text-xs font-mono">{label}</span>
        <button
          onClick={copy}
          className="text-xs text-slate-500 hover:text-sky-400 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-5 text-xs leading-relaxed text-slate-300 overflow-x-auto font-mono whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
const TelegramAutomationDocs: React.FC = () => {
  const navigate = useNavigate();
  const [activeSnippet, setActiveSnippet] = useState<'webhook' | 'scene' | 'broadcast'>('webhook');

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
  };

  return (
    <div className="min-h-screen bg-[#080c10] text-slate-200">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        {/* BG gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 pt-28 pb-16 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 text-sm"
          >
            <div className="p-1.5 rounded-lg bg-slate-800/60 group-hover:bg-slate-700/60 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Portfolio
          </button>

          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(14,165,233,0.15)]">
                <Send className="w-8 h-8 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold tracking-widest text-sky-400 uppercase px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10">Bot / Workflow</span>
                  <span className="text-xs font-bold tracking-widest text-slate-500 uppercase px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50">Node.js · Redis · Telegraf</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3">
                  Telegram<br />
                  <span className="text-sky-400">Automation Fleet</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                  A high-performance infrastructure for building, deploying, and managing a fleet of specialized Telegram bots capable of processing thousands of interactions concurrently.
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {[
                { val: '2M+', label: 'Messages Processed', icon: <MessageSquare className="w-4 h-4" /> },
                { val: '150k', label: 'Active Users', icon: <Users className="w-4 h-4" /> },
                { val: '<100ms', label: 'Response Latency', icon: <Clock className="w-4 h-4" /> },
                { val: '100%', label: 'Delivery Rate', icon: <ShieldCheck className="w-4 h-4" /> },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-1.5 text-sky-400 mb-1">{s.icon}</div>
                  <div className="text-2xl font-black text-white">{s.val}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 pb-32 space-y-24">

        {/* Overview */}
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-5 h-5 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Project Overview</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 text-base leading-8">
              The <strong className="text-white">Telegram Automation Fleet</strong> is a robust, horizontally scalable architecture designed to manage multiple Telegram bots from a unified codebase and administrative dashboard. It powers complex use cases ranging from automated community moderation in supergroups, to advanced sales funnels with interactive inline keyboards, to seamless customer support ticketing.
            </p>
            <p className="text-slate-300 text-base leading-8 mt-4">
              Built on <strong className="text-white">Node.js</strong> and the <strong className="text-white">Telegraf</strong> framework, the system leverages a <strong className="text-white">Webhook-driven architecture</strong> sitting behind Nginx. Application state and user sessions are managed entirely in <strong className="text-white">Redis</strong>, ensuring that worker nodes remain completely stateless and can be scaled up or down instantaneously based on Telegram traffic spikes.
            </p>
          </div>

          {/* Architecture diagram (ASCII-style visual) */}
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-semibold text-slate-300">Stateless Bot Architecture</span>
            </div>
            <div className="p-6 font-mono text-xs text-slate-400 leading-7 overflow-x-auto">
              <pre>{`
┌─────────────────────────────────────────────────────────────┐
│                      Telegram API Servers                    │
└─────────────────────┬───────────────────────────────────────┘
                      │  Webhooks (JSON)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                       │
│             (SSL Termination & Load Balancing)               │
└─────┬───────────────────────┬───────────────────────┬───────┘
      │                       │                       │
      ▼                       ▼                       ▼
┌────────────┐          ┌────────────┐          ┌────────────┐
│ Bot Worker │          │ Bot Worker │          │ Bot Worker │
│ (Node.js)  │          │ (Node.js)  │          │ (Node.js)  │
└─────┬──────┘          └─────┬──────┘          └─────┬──────┘
      │                       │                       │
      └───────────────┬───────┴───────┬───────────────┘
                      │               │
                      ▼               ▼
        ┌──────────────────┐    ┌──────────────────┐
        │  Redis Cluster   │    │  MongoDB Atlas   │
        │ - Sessions       │    │ - User Profiles  │
        │ - Rate Limiting  │    │ - Chat History   │
        │ - Job Queues     │    │ - Configs        │
        └──────────────────┘    └──────────────────┘
`}</pre>
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-5 h-5 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Key Capabilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`p-5 rounded-xl border ${f.bg} flex gap-4 items-start`}
              >
                <div className={`mt-0.5 ${f.color} flex-shrink-0`}>{f.icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-1.5 text-sm">{f.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-3 mb-8">
            <Database className="w-5 h-5 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Technical Stack</h2>
          </div>
          <div className="space-y-3">
            {stack.map((s, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-3.5 hover:border-slate-700 transition-colors"
              >
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.color}`} />
                <span className="font-semibold text-white text-sm flex-1">{s.name}</span>
                <span className="text-slate-500 text-xs">{s.role}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Code Snippets */}
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="w-5 h-5 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Code Deep Dive</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Examine the core patterns used to build scalable, resilient bots.</p>

          {/* Tab selector */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {([
              { key: 'webhook', label: 'Webhook Config' },
              { key: 'scene', label: 'Scene/Wizard Flow' },
              { key: 'broadcast', label: 'Broadcast Worker' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveSnippet(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  activeSnippet === tab.key
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div key={activeSnippet} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <CodeBlock
              code={codeSnippets[activeSnippet]}
              label={
                activeSnippet === 'webhook' ? 'bot.js' :
                activeSnippet === 'scene' ? 'onboarding.js' : 'broadcast.js'
              }
            />
          </motion.div>
        </motion.section>

        {/* FAQ */}
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-5 h-5 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <Accordion items={faqs} />
        </motion.section>

        {/* CTA */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 via-slate-900/60 to-slate-900/60 p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />
          <Bot className="w-10 h-10 text-sky-400 mx-auto mb-4 relative z-10" />
          <h3 className="text-2xl font-black text-white mb-3 relative z-10">Power up your Telegram presence</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed relative z-10">
            Need a custom Telegram bot solution for moderation, sales, or community management? Get in touch to discuss your requirements.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap relative z-10">
            <a
              href="/#contact"
              className="px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:-translate-y-0.5"
            >
              Contact Me
            </a>
            <button
              onClick={() => navigate(-1)}
              className="px-7 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 font-bold text-sm tracking-wide transition-all"
            >
              ← Back to Portfolio
            </button>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default TelegramAutomationDocs;
