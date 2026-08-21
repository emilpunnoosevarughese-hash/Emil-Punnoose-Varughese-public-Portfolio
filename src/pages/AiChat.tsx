import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, X, Terminal, Settings, ChevronRight, Sidebar as SidebarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIChatMessage } from '../components/ui/AIChatMessage';
import { EdgarOnboarding } from '../components/ui/EdgarOnboarding';
import { EdgarSettings } from '../components/ui/EdgarSettings';
import { EdgarSidebar } from '../components/ui/EdgarSidebar';
import { Navigation } from '../components/Navigation';
import { generateAIResponse, type ChatMessage } from '../lib/chatLogic';
import {
  DEFAULT_THEME, getStoredTheme, storeTheme, applyThemeToElement,
  type ThemeId, LS_NAME_KEY,
} from '../lib/edgarThemes';
import { useTheme } from '../contexts/ThemeContext';

// ─── Constants ───────────────────────────────────────────────────────────────
const TRANSLATIONS: Record<string, { hello: string, ready: string, ask: string, typeMsg: string, think: string, suggestions: string[] }> = {
  'English (United States)': {
    hello: 'Hello', ready: 'Ready when you are.', ask: 'Ask anything', typeMsg: 'Type a message...', think: 'Think',
    suggestions: ["What's Emil's tech stack?", "Tell me about his experience", "How can I contact him?", "What projects has he built?"]
  },
  'Français (France)': {
    hello: 'Bonjour', ready: "Prêt quand vous l'êtes.", ask: "Demandez n'importe quoi", typeMsg: 'Tapez un message...', think: 'Réfléchir',
    suggestions: ["Quelle est la pile technologique d'Emil ?", "Parlez-moi de son expérience", "Comment puis-je le contacter ?", "Quels projets a-t-il créés ?"]
  },
  'Deutsch (Deutschland)': {
    hello: 'Hallo', ready: 'Bereit, wenn Sie es sind.', ask: 'Fragen Sie alles', typeMsg: 'Nachricht eingeben...', think: 'Denken',
    suggestions: ["Was ist Emils Tech-Stack?", "Erzählen Sie mir von seiner Erfahrung", "Wie kann ich ihn kontaktieren?", "Welche Projekte hat er entwickelt?"]
  },
  'हिन्दी (भारत)': {
    hello: 'नमस्ते', ready: 'जब आप तैयार हों।', ask: 'कुछ भी पूछें', typeMsg: 'एक संदेश टाइप करें...', think: 'सोचें',
    suggestions: ["एमिल का टेक स्टैक क्या है?", "मुझे उनके अनुभव के बारे में बताएं", "मैं उनसे कैसे संपर्क कर सकता हूँ?", "उन्होंने कौन से प्रोजेक्ट बनाए हैं?"]
  },
  'മലയാളം (Malayalam)': {
    hello: 'ഹലോ', ready: 'നിങ്ങൾ തയ്യാറാകുമ്പോൾ പറയാം.', ask: 'എന്തും ചോദിക്കുക', typeMsg: 'ഒരു സന്ദേശം ടൈപ്പ് ചെയ്യുക...', think: 'ചിന്തിക്കുക',
    suggestions: ["എമിലിന്റെ ടെക് സ്റ്റാക്ക് എന്താണ്?", "അവന്റെ അനുഭവത്തെക്കുറിച്ച് പറയുക", "എനിക്ക് അവനെ എങ്ങനെ ബന്ധപ്പെടാം?", "അവൻ എന്തൊക്കെ പ്രൊജക്ടുകളാണ് നിർമ്മിച്ചിട്ടുള്ളത്?"]
  },
  'Indonesia (Indonesia)': {
    hello: 'Halo', ready: 'Siap kapanpun Anda siap.', ask: 'Tanya apa saja', typeMsg: 'Ketik pesan...', think: 'Pikir',
    suggestions: ["Apa tech stack Emil?", "Ceritakan tentang pengalamannya", "Bagaimana saya bisa menghubunginya?", "Proyek apa yang telah dia buat?"]
  },
  'Italiano (Italia)': {
    hello: 'Ciao', ready: 'Pronto quando lo sei tu.', ask: 'Chiedi qualsiasi cosa', typeMsg: 'Scrivi un messaggio...', think: 'Pensa',
    suggestions: ["Qual è lo stack tecnologico di Emil?", "Parlami della sua esperienza", "Come posso contattarlo?", "Quali progetti ha realizzato?"]
  },
  '日本語 (日本)': {
    hello: 'こんにちは', ready: '準備はできています。', ask: '何でも聞いてください', typeMsg: 'メッセージを入力...', think: '考える',
    suggestions: ["エミルの技術スタックは何ですか？", "彼の経験について教えてください", "どうすれば連絡できますか？", "彼はどんなプロジェクトを作りましたか？"]
  },
  '한국어(대한민국)': {
    hello: '안녕하세요', ready: '준비되었습니다.', ask: '무엇이든 물어보세요', typeMsg: '메시지 입력...', think: '생각',
    suggestions: ["에밀의 기술 스택은 무엇인가요?", "그의 경험에 대해 말해주세요", "그에게 어떻게 연락할 수 있나요?", "그가 만든 프로젝트는 무엇인가요?"]
  },
  'Português (Brasil)': {
    hello: 'Olá', ready: 'Pronto quando você estiver.', ask: 'Pergunte qualquer coisa', typeMsg: 'Digite uma mensagem...', think: 'Pensar',
    suggestions: ["Qual é a stack de tecnologia do Emil?", "Fale-me sobre sua experiência", "Como posso contatá-lo?", "Que projetos ele desenvolveu?"]
  },
  'Español (Latinoamérica)': {
    hello: 'Hola', ready: 'Listo cuando tú lo estés.', ask: 'Pregunta lo que sea', typeMsg: 'Escribe un mensaje...', think: 'Pensar',
    suggestions: ["¿Cuál es el stack tecnológico de Emil?", "Cuéntame sobre su experiencia", "¿Cómo puedo contactarlo?", "¿Qué proyectos ha construido?"]
  },
  'Español (España)': {
    hello: 'Hola', ready: 'Listo cuando tú lo estés.', ask: 'Pregunta lo que sea', typeMsg: 'Escribe un mensaje...', think: 'Pensar',
    suggestions: ["¿Cuál es el stack tecnológico de Emil?", "Cuéntame sobre su experiencia", "¿Cómo puedo contactarlo?", "¿Qué proyectos ha construido?"]
  }
};

const SESSION_KEY = 'edgarAI_messages';

function makeInitialMessage(name?: string): ChatMessage {
  const greeting = name
    ? `Hi ${name}! I'm Edgar AI — I can answer questions about Emil's skills, experience, and portfolio. What would you like to know?`
    : `Hi there! I'm Edgar AI — I can answer questions about Emil's skills, experience, and portfolio. What would you like to know?`;
  return {
    id: 'msg-initial',
    role: 'ai',
    content: greeting,
    timestamp: new Date(),
    suggestions: ["What are his skills?", "Show me his projects", "How do I contact him?"],
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function loadMessages(): ChatMessage[] | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((m: ChatMessage) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch { return null; }
}

function saveMessages(msgs: ChatMessage[]) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(msgs)); } catch { /* ignore */ }
}

function clearMessages() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AiChat() {
  const navigate = useNavigate();
  const { theme: globalTheme } = useTheme();
  const isDark = globalTheme === 'dark' || globalTheme === 'midnight';
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── State ──
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [userName, setUserName] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (United States)');
  const [onboardingDone, setOnboardingDone] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing] = useState(false);

  // ── Initialize: read localStorage, set theme + name, decide onboarding ──
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setCurrentTheme(storedTheme);

    let storedName = '';
    try { storedName = localStorage.getItem(LS_NAME_KEY) ?? ''; } catch { /* ignore */ }

    setUserName(storedName);

    // Show onboarding only on first-ever visit (no name stored)
    if (!storedName && storedName !== '__skipped__') {
      // Small delay so the widget mounts before showing onboarding
      setTimeout(() => setShowOnboarding(true), 200);
    } else {
      setOnboardingDone(true);
      const saved = loadMessages();
      const name = storedName === '__skipped__' ? '' : storedName;
      setMessages(saved ?? [makeInitialMessage(name)]);
    }
  }, []);

  // ── Apply theme CSS vars to container whenever theme changes ──
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    
    // Automatically force a light theme if the global portfolio is in light mode
    if (!isDark) {
      applyThemeToElement(el, 'minimalism');
    } else {
      applyThemeToElement(el, currentTheme);
    }
  }, [currentTheme, onboardingDone, isDark]);

  // ── Persist messages to sessionStorage ──
  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Theme change handler ──
  const handleThemeChange = useCallback((id: ThemeId) => {
    setCurrentTheme(id);
    storeTheme(id);
    const el = chatContainerRef.current;
    if (el) applyThemeToElement(el, id);
  }, []);

  // ── Onboarding complete ──
  const handleOnboardingComplete = useCallback((name: string) => {
    const finalName = name.trim();
    const stored = finalName || '__skipped__';
    try { localStorage.setItem(LS_NAME_KEY, stored); } catch { /* ignore */ }
    setUserName(finalName);
    setShowOnboarding(false);
    // Trigger chat appear with a small delay for animation
    setTimeout(() => {
      setOnboardingDone(true);
      setMessages([makeInitialMessage(finalName)]);
    }, 50);
  }, []);

  // ── Send message ──
  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await generateAIResponse(trimmed, userName || undefined);
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'ai',
        content: response.content,
        suggestions: response.suggestions,
        cta: response.cta,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Edgar AI Error:', error);
      const errMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'ai',
        content: "Hmm, something went wrong on my end. Try asking about Emil's skills, projects, or experience!",
        suggestions: ["What's his tech stack?", "Show me his projects"],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, userName]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend(inputValue);
  };

  // ── Clear chat (soft) ──
  const handleClearChat = useCallback(() => {
    clearMessages();
    setMessages([makeInitialMessage(userName || undefined)]);
  }, [userName]);

  // ── Reset all (hard) ──
  const handleResetAll = useCallback(() => {
    clearMessages();
    try {
      localStorage.removeItem(LS_NAME_KEY);
      localStorage.removeItem('edgarAI_theme');
    } catch { /* ignore */ }
    setUserName('');
    setCurrentTheme(DEFAULT_THEME);
    const el = chatContainerRef.current;
    if (el) applyThemeToElement(el, DEFAULT_THEME);
    setOnboardingDone(false);
    setMessages([]);
    setTimeout(() => setShowOnboarding(true), 100);
  }, []);

  // ── Name change from settings ──
  const handleNameChange = useCallback((name: string) => {
    setUserName(name);
  }, []);

  const executeTerminalCommand = (text: string) => {
    setIsTerminalOpen(false);
    handleSend(text);
  };

  // ── Derive theme-aware input placeholder based on brutalism ──
  const isBrutalism = currentTheme === 'brutalism';

  const isMin = currentTheme === 'minimalism';

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS['English (United States)'];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div 
      className="flex flex-row h-full w-full overflow-hidden transition-colors duration-500"
      style={{ 
        background: isDark ? '#000000' : '#ffffff',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Sidebar */}
      <EdgarSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onNewChat={() => { handleClearChat(); if(window.innerWidth < 768) setIsSidebarOpen(false); }} 
        onSelectPrompt={handleSend} 
        userName={userName} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      {/* Main Chat Area */}
      <div className={`flex-1 min-h-0 flex flex-col relative w-full h-full ${isDark ? 'text-white/90' : 'text-gray-800'}`}>
        
        {/* Render Navigation relative to the chat container so it aligns properly with the sidebar */}
        <Navigation isAiChatLayout />

        {/* Top Fade Mask to hide scrolling text behind nav */}
        <div 
          className="absolute top-0 left-0 right-0 h-28 z-20 pointer-events-none transition-colors duration-500"
          style={{
            background: `linear-gradient(to bottom, ${isDark ? '#000000' : '#ffffff'} 25%, transparent 100%)`
          }}
        />
        {/* Open Sidebar Button (when sidebar is closed) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={`absolute top-5 left-4 z-40 p-2 rounded-md transition-colors backdrop-blur-md ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'}`}
          >
            <SidebarIcon className="w-5 h-5" />
          </button>
        )}

        {/* Top-Right Tools */}
        <div className={`absolute right-4 z-40 flex items-center gap-2 transition-all duration-300 ${isSidebarOpen ? 'top-20' : 'top-5'}`}>
          <button 
            onClick={() => setIsTerminalOpen(true)}
            className={`p-2.5 backdrop-blur-sm rounded-xl transition-all shadow-sm border ${isDark ? 'bg-[#212121]/80 hover:bg-[#2f2f2f] text-white/70 hover:text-white border-white/5' : 'bg-white/80 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border-black/5'}`}
            title="Open Terminal"
          >
            <Terminal className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2.5 backdrop-blur-sm rounded-xl transition-all shadow-sm border ${isDark ? 'bg-[#212121]/80 hover:bg-[#2f2f2f] text-white/70 hover:text-white border-white/5' : 'bg-white/80 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border-black/5'}`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Container (providing theme CSS vars to children like AIChatMessage) */}
        <div
          ref={chatContainerRef}
          className="flex-1 min-h-0 flex flex-col overflow-hidden relative z-10 w-full transition-colors duration-500"
        >
          
          <AnimatePresence>
            {onboardingDone && (
              <motion.div
                key="chat-area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-1 min-h-0 overflow-y-auto relative z-10 no-scrollbar scroll-smooth w-full flex flex-col"
              >
                <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-6 flex-1 flex flex-col relative">
                  
                  {/* Empty State vs Messages State */}
                  {messages.length <= 1 ? (
                    <div className="flex-1 flex flex-col items-center justify-center pb-20">
                      <h2 className={`text-4xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {t.hello}, {userName ? userName.split(' ')[0] : 'there'}
                      </h2>
                      <h2 className={`text-4xl font-semibold mb-8 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        {t.ready}
                      </h2>
                      
                      {/* Centered Input Box */}
                      <div className="w-full relative mb-12">
                        <div className={`relative flex items-center rounded-[2rem] border px-4 py-3 shadow-lg transition-colors ${isDark ? 'bg-[#2f2f2f] border-white/10 focus-within:bg-[#383838]' : 'bg-white border-black/10 focus-within:bg-gray-50'}`}>
                          <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isTyping}
                            placeholder={isMin ? t.typeMsg : isBrutalism ? ">_" : t.ask}
                            className={`flex-1 bg-transparent border-none outline-none px-2 text-[15px] ${isDark ? 'text-white/90 placeholder:text-white/40' : 'text-gray-900 placeholder:text-gray-400'}`}
                          />
                          <div className="flex items-center gap-2 shrink-0">
                            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-xs font-medium ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-black/5 text-gray-500'}`}>
                              <Sparkles className="w-3.5 h-3.5" />
                              {t.think}
                            </button>
                            <button
                              onClick={() => handleSend(inputValue)}
                              disabled={!inputValue.trim() || isTyping}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-40 active:scale-95 ${isDark ? 'disabled:bg-white/5 bg-white text-black' : 'disabled:bg-black/5 bg-black text-white'}`}
                            >
                              <Send className="w-4 h-4 ml-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Suggestions below center input */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                        {t.suggestions.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(prompt)}
                            disabled={isTyping}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors text-left group disabled:opacity-50 ${isDark ? 'border-white/5 bg-[#2f2f2f]/50 hover:bg-[#2f2f2f]' : 'border-black/5 bg-white/50 hover:bg-white shadow-sm'}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isDark ? 'bg-black/40 group-hover:bg-black/60' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                              <Sparkles className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
                            </div>
                            <span className={`text-[13px] font-medium leading-tight ${isDark ? 'text-white/70 group-hover:text-white/90' : 'text-gray-600 group-hover:text-gray-900'}`}>
                              {prompt}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col space-y-6 pt-4">
                      <AnimatePresence initial={false}>
                        {messages.map(msg => (
                          <AIChatMessage key={msg.id} message={msg} onSuggestionClick={handleSend} />
                        ))}
                      </AnimatePresence>

                      {/* Typing indicator */}
                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex justify-start mb-6"
                          >
                            <div className="flex max-w-[85%] flex-row">
                              <div className="shrink-0 flex items-end mr-3">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${isDark ? 'bg-white/10 border-white/10 text-white/80' : 'bg-black/5 border-black/10 text-gray-700'}`}>
                                  <Bot className="w-4 h-4" />
                                </div>
                              </div>
                              <div>
                                <div className={`text-xs font-semibold px-1 mb-1 ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
                                  Edgar AI
                                </div>
                                <div className={`px-5 py-3.5 flex items-center gap-1.5 h-11 border rounded-2xl rounded-bl-sm ${isDark ? 'bg-[#2f2f2f] border-white/10' : 'bg-white border-black/10'}`}>
                                  {[0, 0.2, 0.4].map(delay => (
                                    <motion.div
                                      key={delay}
                                      className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/40' : 'bg-gray-400'}`}
                                      animate={{ y: [0, -5, 0] }}
                                      transition={{ duration: 0.6, repeat: Infinity, delay }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div ref={messagesEndRef} className="h-4" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Docked Input Area (only visible when there are messages) */}
          {onboardingDone && messages.length > 1 && (
            <div className={`w-full shrink-0 relative z-20 bg-gradient-to-t transition-colors duration-500 pt-8 pb-4 px-4 sm:px-6 ${isDark ? 'from-[#000000] via-[#000000] to-transparent' : 'from-[#ffffff] via-[#ffffff] to-transparent'}`}>
              <div className="w-full max-w-3xl mx-auto relative">
                <div className={`relative flex items-center rounded-[2rem] border px-4 py-3 shadow-lg transition-colors ${isDark ? 'bg-[#2f2f2f] border-white/10 focus-within:bg-[#383838]' : 'bg-white border-black/10 focus-within:bg-gray-50'}`}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                    placeholder={t.ask}
                    className={`flex-1 bg-transparent border-none outline-none px-2 text-[15px] ${isDark ? 'text-white/90 placeholder:text-white/40' : 'text-gray-900 placeholder:text-gray-400'}`}
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-xs font-medium ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-black/5 text-gray-500'}`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.think}
                    </button>
                    <button
                      onClick={() => handleSend(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-40 active:scale-95 ${isDark ? 'disabled:bg-white/5 bg-white text-black' : 'disabled:bg-black/5 bg-black text-white'}`}
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
                <p className={`text-center mt-3 text-[10px] font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                  AI responses are simulated on the frontend for portfolio demonstration purposes.
                </p>
              </div>
            </div>
          )}
          {/* End of Chat Container */}
        </div>
        
        {/* Overlays (Onboarding, Settings, Terminal, Closing) */}
        {/* These must be outside the z-10 chat container so their z-[100] can cover the z-50 Navigation */}
        <AnimatePresence>
            {showOnboarding && <EdgarOnboarding onComplete={handleOnboardingComplete} />}
            <EdgarSettings
              isOpen={isSettingsOpen}
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
              onClose={() => setIsSettingsOpen(false)}
              onClearChat={handleClearChat}
              onResetAll={handleResetAll}
              userName={userName}
              onNameChange={handleNameChange}
            />
            {isTerminalOpen && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={e => e.target === e.currentTarget && setIsTerminalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl font-mono overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-[11px] text-white/40">edgar@system:~</span>
                    <button onClick={() => setIsTerminalOpen(false)} className="text-white/40 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5 space-y-3">
                    <p className="text-blue-400 text-xs mb-4">System Registry &gt; Available Commands</p>
                    {[
                      { cmd: 'run get_experience()', text: "Tell me about his experience" },
                      { cmd: 'cat skills.json', text: "What are his skills?" },
                      { cmd: 'fetch projects --all', text: "What projects has he built?" },
                      { cmd: 'initiate contact_protocol', text: "How can I contact him?" },
                      { cmd: 'query ai_integrations', text: "Tell me about his AI work" },
                    ].map((c, i) => (
                      <button
                        key={i}
                        onClick={() => executeTerminalCommand(c.text)}
                        className="w-full text-left flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors text-sm group"
                      >
                        <ChevronRight className="w-4 h-4 text-blue-400 opacity-50 group-hover:opacity-100" />
                        <span className="text-blue-300 font-medium">{c.cmd}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {isClosing && (
              <motion.div
                key="closing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-[#212121]' : 'bg-[#ffffff]'}`}
              >
                <motion.div
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className={`w-20 h-20 flex items-center justify-center mb-6 border rounded-2xl ${isDark ? 'bg-[#2f2f2f] border-white/10 text-white/80' : 'bg-gray-50 border-black/10 text-gray-800'}`}
                >
                  <Bot className="w-10 h-10" />
                </motion.div>
                <h2 className={`text-3xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Thank You!</h2>
                <p className={`mb-8 max-w-sm text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  Thanks for chatting with Edgar AI! We hope you enjoyed exploring Emil's portfolio.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className={`px-8 py-3 font-semibold text-sm transition-all active:scale-95 rounded-full ${isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  Continue Portfolio
                </button>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}
