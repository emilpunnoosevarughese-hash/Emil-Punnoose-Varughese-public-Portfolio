import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MessageCircle, Server, Code2, ShieldCheck,
  Database, Webhook, Users, Zap, Bot, ChevronDown, ChevronRight,
  BarChart3, Filter, Bell, Send, GitBranch, Clock, Lock, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Types ───────────────────────────────────────────────────
interface AccordionItem { title: string; content: string; }

// ─── Data ────────────────────────────────────────────────────
const features = [
  {
    icon: <Bot className="w-6 h-6" />,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    title: 'AI-Powered Auto Responses',
    desc: 'NLP-driven engine parses incoming messages, classifies intent, and dispatches context-aware responses 24/7 — zero human intervention required for Tier-1 queries.',
  },
  {
    icon: <Filter className="w-6 h-6" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Lead Qualification Pipeline',
    desc: 'Conversational flows score and tag leads automatically using keyword scoring + ML classification. Qualified leads are pushed into the CRM with full metadata.',
  },
  {
    icon: <Send className="w-6 h-6" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Bulk Broadcast Engine',
    desc: 'Schedule and dispatch personalized bulk messages to segmented contact lists. Rate-limited to respect WhatsApp Business API policy. Template-approval-aware.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Real-Time Analytics Dashboard',
    desc: 'Track message delivery rates, open rates, response times, lead funnel throughput, and agent performance — all updated live via WebSocket streams.',
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'Multi-Stage Conversation Flows',
    desc: 'Visual drag-and-drop flow builder to design multi-step conversation journeys. Supports branching logic, time-based triggers, and fallback escalation to human agents.',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    title: 'Agent Escalation & Alerts',
    desc: 'When NLP confidence drops below threshold, the system instantly alerts the assigned agent via dashboard notification + email, handing off full conversation context.',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'End-to-End Encrypted Storage',
    desc: 'All message data encrypted at rest (AES-256) and in transit (TLS 1.3). GDPR-compliant data retention policies with configurable auto-purge schedules.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    title: 'Multi-Account & Multi-Region',
    desc: 'Manage multiple WhatsApp Business accounts from a single dashboard. Deploy workers across regions with automatic failover and load balancing.',
  },
];

const stack = [
  { name: 'WhatsApp Cloud API', role: 'Messaging Infrastructure', color: 'bg-green-500' },
  { name: 'Node.js + Express', role: 'Backend API Server', color: 'bg-yellow-500' },
  { name: 'MongoDB Atlas', role: 'Primary Database', color: 'bg-emerald-500' },
  { name: 'Redis', role: 'Queue & Rate Limiting', color: 'bg-red-500' },
  { name: 'BullMQ', role: 'Job Queue Processing', color: 'bg-purple-500' },
  { name: 'Webhooks', role: 'Real-time Event Bus', color: 'bg-blue-500' },
  { name: 'JWT + OAuth2', role: 'Auth & Security', color: 'bg-amber-500' },
  { name: 'Docker + PM2', role: 'Deployment & Process Mgmt', color: 'bg-cyan-500' },
];

const faqs: AccordionItem[] = [
  {
    title: 'How does the WhatsApp Cloud API integration work?',
    content: 'The system registers a verified webhook endpoint with Meta\'s WhatsApp Cloud API. All incoming messages are received as HTTP POST payloads, parsed, and queued in BullMQ for async processing. Outgoing messages are dispatched via the REST API with automatic retry logic on failure.',
  },
  {
    title: 'How is rate limiting handled to avoid API bans?',
    content: 'Redis tracks a sliding-window counter per phone number per minute. The broadcast engine uses BullMQ\'s rate limiter with configurable delays between messages. The system also detects WhatsApp\'s 429 responses and backs off exponentially.',
  },
  {
    title: 'Can it handle multiple business accounts simultaneously?',
    content: 'Yes. Each WhatsApp Business Account (WABA) is modelled as a separate tenant with its own credentials, webhook token, and worker pool. The dashboard provides a unified view across all accounts.',
  },
  {
    title: 'How does lead scoring work?',
    content: 'Incoming messages are processed through a keyword-scoring pipeline: keyword matches from a configurable dictionary add points to a lead score. Additionally, a lightweight ML classifier (ONNX model running on-server) detects purchase intent. Leads crossing the threshold are auto-tagged and surfaced to the sales queue.',
  },
  {
    title: 'Is the system GDPR compliant?',
    content: 'All PII is encrypted at rest with AES-256. Data retention policies are configurable per tenant. Users can request data export (JSON) or deletion via the admin panel. Audit logs track all data access events.',
  },
];

const codeSnippets: Record<string, string> = {
  webhook: `// Webhook Handler — src/controllers/webhookController.js
export const handleWebhook = async (req, res) => {
  const { entry } = req.body;

  for (const e of entry) {
    for (const change of e.changes) {
      const msg = change.value?.messages?.[0];
      if (!msg) continue;

      // Queue for async processing
      await messageQueue.add('inbound', {
        from: msg.from,
        type: msg.type,
        text: msg.text?.body,
        timestamp: msg.timestamp,
        wabaId: e.id,
      }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
    }
  }

  res.sendStatus(200); // Always ACK immediately
};`,

  nlp: `// NLP Intent Classifier — src/services/nlpService.js
import { InferenceSession } from 'onnxruntime-node';

const session = await InferenceSession.create('./models/intent.onnx');

export const classifyIntent = async (text) => {
  const tokens = tokenize(text.toLowerCase());
  const tensor = new Tensor('float32', tokens, [1, tokens.length]);
  const { output } = await session.run({ input: tensor });

  const labels = ['greeting', 'pricing', 'support', 'purchase', 'complaint', 'other'];
  const scores = softmax(Array.from(output.data));
  const topIdx = scores.indexOf(Math.max(...scores));

  return {
    intent: labels[topIdx],
    confidence: scores[topIdx],
    needsEscalation: scores[topIdx] < 0.72,
  };
};`,

  broadcast: `// Broadcast Engine — src/services/broadcastService.js
export const scheduleBroadcast = async ({ contacts, template, scheduledAt }) => {
  const jobs = contacts.map((contact, i) => ({
    name: 'outbound',
    data: { to: contact.phone, templateId: template.id, vars: contact.vars },
    opts: {
      delay: i * 1200, // 1.2s between messages (rate limit)
      attempts: 3,
      removeOnComplete: true,
    },
  }));

  await broadcastQueue.addBulk(jobs);
  console.log(\`Queued \${jobs.length} messages for broadcast\`);
};`,
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
              ? <ChevronDown className="w-4 h-4 text-green-400 flex-shrink-0" />
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
          className="text-xs text-slate-500 hover:text-green-400 transition-colors"
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
const WhatsAppCRMDocs: React.FC = () => {
  const navigate = useNavigate();
  const [activeSnippet, setActiveSnippet] = useState<'webhook' | 'nlp' | 'broadcast'>('webhook');

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
  };

  return (
    <div className="min-h-screen bg-[#080c10] text-slate-200">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        {/* BG gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <MessageCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold tracking-widest text-green-400 uppercase px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10">Business Automation</span>
                  <span className="text-xs font-bold tracking-widest text-slate-500 uppercase px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50">Node.js · MongoDB · WhatsApp API</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3">
                  WhatsApp CRM<br />
                  <span className="text-green-400">Automation</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                  Enterprise-grade automation system that transforms WhatsApp Business into a full-featured CRM — with AI responses, lead scoring, bulk broadcasts, and real-time analytics.
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {[
                { val: '50k+', label: 'Messages / Day', icon: <Send className="w-4 h-4" /> },
                { val: '94%', label: 'NLP Accuracy', icon: <Bot className="w-4 h-4" /> },
                { val: '<200ms', label: 'Response Time', icon: <Clock className="w-4 h-4" /> },
                { val: '99.9%', label: 'Uptime SLA', icon: <ShieldCheck className="w-4 h-4" /> },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-1.5 text-green-400 mb-1">{s.icon}</div>
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
            <Server className="w-5 h-5 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Project Overview</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 text-base leading-8">
              The <strong className="text-white">WhatsApp CRM Automation</strong> system is a backend-first, enterprise-grade platform built to replace traditional email and phone-based CRM workflows with real-time WhatsApp conversations. It integrates directly with the <strong className="text-white">Meta WhatsApp Cloud API</strong>, enabling businesses to manage leads, automate customer support, broadcast promotions, and analyse engagement — all from a single unified dashboard.
            </p>
            <p className="text-slate-300 text-base leading-8 mt-4">
              The architecture is event-driven: incoming messages trigger webhook events processed asynchronously via <strong className="text-white">BullMQ job queues</strong>, enabling the system to handle massive volumes without dropping messages under load. An on-server <strong className="text-white">ONNX ML model</strong> classifies message intent in real time, routing conversations to the correct automation flow or escalating to a human agent when confidence is low.
            </p>
          </div>

          {/* Architecture diagram (ASCII-style visual) */}
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-slate-300">System Architecture</span>
            </div>
            <div className="p-6 font-mono text-xs text-slate-400 leading-7 overflow-x-auto">
              <pre>{`
┌─────────────────────────────────────────────────────────────┐
│                    WhatsApp Cloud API                        │
│              (Meta Business Platform / Webhooks)             │
└─────────────────────┬───────────────────────────────────────┘
                       │  POST /webhook
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express API Server                        │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│   │  Auth Guard  │  │  Rate Limiter │  │  Webhook Handler │ │
│   │  (JWT/OAuth) │  │   (Redis)     │  │   (validates +   │ │
│   └──────────────┘  └──────────────┘  │    enqueues)     │ │
│                                        └────────┬─────────┘ │
└─────────────────────────────────────────────────┼───────────┘
                                                  │
                       ┌──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    BullMQ Job Queue (Redis)                  │
│   ┌────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│   │  Inbound   │  │   Broadcast  │  │   Notification     │ │
│   │   Queue    │  │    Queue     │  │      Queue         │ │
│   └─────┬──────┘  └──────┬───────┘  └─────────┬──────────┘ │
└─────────┼────────────────┼─────────────────────┼────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────┐  ┌──────────────────┐  ┌────────────────────┐
│ NLP Service │  │ Broadcast Worker  │  │  Alert Service     │
│ (ONNX Model)│  │ (rate-limited)   │  │  (email + push)    │
└──────┬──────┘  └──────────────────┘  └────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                             │
│   contacts │ conversations │ leads │ analytics │ templates  │
└─────────────────────────────────────────────────────────────┘
`}</pre>
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-5 h-5 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Key Features</h2>
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
            <Database className="w-5 h-5 text-green-400" />
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
            <Code2 className="w-5 h-5 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Code Deep Dive</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">Explore the core implementation across the three main layers of the system.</p>

          {/* Tab selector */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {([
              { key: 'webhook', label: 'Webhook Handler' },
              { key: 'nlp', label: 'NLP Classifier' },
              { key: 'broadcast', label: 'Broadcast Engine' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveSnippet(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  activeSnippet === tab.key
                    ? 'bg-green-500/15 text-green-400 border border-green-500/30'
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
                activeSnippet === 'webhook' ? 'webhookController.js' :
                activeSnippet === 'nlp' ? 'nlpService.js' : 'broadcastService.js'
              }
            />
          </motion.div>
        </motion.section>

        {/* FAQ */}
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-5 h-5 text-green-400" />
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
          className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-950/40 via-slate-900/60 to-slate-900/60 p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
          <Webhook className="w-10 h-10 text-green-400 mx-auto mb-4 relative z-10" />
          <h3 className="text-2xl font-black text-white mb-3 relative z-10">Ready to automate your CRM?</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed relative z-10">
            This system is available for custom enterprise deployments. Get in touch to discuss integration with your existing WhatsApp Business account.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap relative z-10">
            <a
              href="/#contact"
              className="px-7 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:-translate-y-0.5"
            >
              Get in Touch
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

export default WhatsAppCRMDocs;
