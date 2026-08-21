import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Server, Code2, Network, Workflow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';

const N8nWorkflowsDocs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-orange-500/30">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-32">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12"
        >
          <div className="p-2 rounded-full bg-slate-800/50 group-hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Portfolio
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
              <Share2 className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">n8n Workflows</h1>
              <p className="text-xl text-slate-400">Complex Node-based Automation</p>
            </div>
          </div>

          <div className="prose prose-invert prose-slate max-w-none mt-16">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Server className="w-6 h-6 text-orange-400" />
              Project Overview
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              n8n Workflows represent a series of interconnected, automated processes linking multiple APIs, databases, and third-party services. These workflows replace manual data entry and synchronize information across entirely different platforms in real-time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800/50 bg-slate-900/50">
                <Network className="w-8 h-8 text-orange-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">API Integrations</h3>
                <p className="text-slate-400 text-sm">Seamlessly connecting REST and GraphQL APIs to fetch, transform, and push data across isolated systems.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-slate-800/50 bg-slate-900/50">
                <Workflow className="w-8 h-8 text-red-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Visual Automation</h3>
                <p className="text-slate-400 text-sm">Complex conditional logic, loops, and data formatting implemented through intuitive visual node graphs.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-4 mt-16">
              <Code2 className="w-6 h-6 text-orange-400" />
              Technical Stack
            </h2>
            <ul className="space-y-3 mt-6">
              <li className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="font-medium text-white">n8n</span>
                <span className="text-slate-500 text-sm ml-auto">Workflow Engine</span>
              </li>
              <li className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="font-medium text-white">JavaScript / Node.js</span>
                <span className="text-slate-500 text-sm ml-auto">Custom Code Nodes</span>
              </li>
              <li className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="font-medium text-white">REST/Webhooks</span>
                <span className="text-slate-500 text-sm ml-auto">Triggers & Actions</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default N8nWorkflowsDocs;
