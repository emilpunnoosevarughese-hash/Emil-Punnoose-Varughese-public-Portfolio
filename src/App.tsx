import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './pages/Home';
import { AiChat } from './pages/AiChat';
import { Tutorials } from './pages/Tutorials';
import { Ads } from './pages/Ads';
import { AdsCreate } from './pages/AdsCreate';
import { AdsDashboard } from './pages/AdsDashboard';
import { AdminAds } from './pages/AdminAds';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LoadingSequence } from './components/ui/LoadingSequence';
import { CustomCursor } from './components/ui/CustomCursor';
import { LoginModal } from './components/ui/LoginModal';

import { AboutMe } from './pages/AboutMe';
import { Resume } from './pages/Resume';
import { RentBookDocs } from './pages/RentBookDocs';
import { EdgarAiDocs } from './pages/EdgarAiDocs';
import { QuizRewardDocs } from './pages/QuizRewardDocs';
import { PortfolioDocs } from './pages/PortfolioDocs';
import { EdgeOpsDocs } from './pages/EdgeOpsDocs';
import ComingSoon from './pages/ComingSoon';
import WhatsAppCRMDocs from './pages/WhatsAppCRMDocs';
import TelegramAutomationDocs from './pages/TelegramAutomationDocs';
import N8nWorkflowsDocs from './pages/N8nWorkflowsDocs';

// SpecLab imports
import { SpecLabHome } from './pages/speclab/SpecLabHome';
import { SpecLabCategory } from './pages/speclab/SpecLabCategory';
import { SpecLabProduct } from './pages/speclab/SpecLabProduct';
import { CompatibilityChecker } from './pages/speclab/CompatibilityChecker';
import { BuildAdvisor } from './pages/speclab/BuildAdvisor';
import { CustomBuilder } from './pages/speclab/CustomBuilder';
import { ConnectorExplorer } from './pages/speclab/ConnectorExplorer';
import { TechDetective } from './pages/speclab/TechDetective';
import { AdminSpecLab } from './pages/speclab/AdminSpecLab';
import { TechCalculator } from './pages/tools/TechCalculator';
import { AdminVerificationCenter } from './pages/speclab/AdminVerificationCenter';
import { AdminSourceRegistry } from './pages/speclab/AdminSourceRegistry';
import { AdminReports } from './pages/speclab/AdminReports';
import { ImageManager } from './pages/speclab/admin/ImageManager';

function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return null;
}

// Animated wrapper for routes
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/ai-chat" element={<PageWrapper><AiChat /></PageWrapper>} />
        <Route path="/tutorials" element={<PageWrapper><Tutorials /></PageWrapper>} />
        <Route path="/ads" element={<PageWrapper><Ads /></PageWrapper>} />
        <Route path="/ads/create" element={<PageWrapper><AdsCreate /></PageWrapper>} />
        <Route path="/ads/dashboard" element={<PageWrapper><AdsDashboard /></PageWrapper>} />
        <Route path="/admin/ads" element={<PageWrapper><AdminAds /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutMe /></PageWrapper>} />
        <Route path="/resume" element={<PageWrapper><Resume /></PageWrapper>} />
        <Route path="/rent-book-pro-docs" element={<PageWrapper><RentBookDocs /></PageWrapper>} />
        <Route path="/edgar-ai-docs" element={<PageWrapper><EdgarAiDocs /></PageWrapper>} />
        <Route path="/quizreward-docs" element={<PageWrapper><QuizRewardDocs /></PageWrapper>} />
        <Route path="/portfolio-docs" element={<PageWrapper><PortfolioDocs /></PageWrapper>} />
        <Route path="/edgeops-docs" element={<PageWrapper><EdgeOpsDocs /></PageWrapper>} />
        <Route path="/coming-soon" element={<PageWrapper><ComingSoon /></PageWrapper>} />
        <Route path="/whatsapp-crm-docs" element={<PageWrapper><WhatsAppCRMDocs /></PageWrapper>} />
        <Route path="/telegram-automation-docs" element={<PageWrapper><TelegramAutomationDocs /></PageWrapper>} />
        <Route path="/n8n-workflows-docs" element={<PageWrapper><N8nWorkflowsDocs /></PageWrapper>} />
        
        {/* SpecLab routes */}
        <Route path="/speclab" element={<PageWrapper><SpecLabHome /></PageWrapper>} />
        <Route path="/speclab/compatibility" element={<PageWrapper><CompatibilityChecker /></PageWrapper>} />
        <Route path="/speclab/build-advisor" element={<PageWrapper><BuildAdvisor /></PageWrapper>} />
        <Route path="/speclab/custom-builder" element={<PageWrapper><CustomBuilder /></PageWrapper>} />
        <Route path="/speclab/connectors" element={<PageWrapper><ConnectorExplorer /></PageWrapper>} />
        <Route path="/speclab/tech-detective" element={<PageWrapper><TechDetective /></PageWrapper>} />
        <Route path="/speclab/:category" element={<PageWrapper><SpecLabCategory /></PageWrapper>} />
        <Route path="/speclab/:category/:slug" element={<PageWrapper><SpecLabProduct /></PageWrapper>} />
        <Route path="/tools/tech-calculator" element={<PageWrapper><TechCalculator /></PageWrapper>} />
        <Route path="/admin/speclab" element={<PageWrapper><AdminSpecLab /></PageWrapper>} />
        <Route path="/admin/speclab/verification" element={<PageWrapper><AdminVerificationCenter /></PageWrapper>} />
        <Route path="/admin/speclab/sources" element={<PageWrapper><AdminSourceRegistry /></PageWrapper>} />
        <Route path="/admin/speclab/images" element={<PageWrapper><ImageManager /></PageWrapper>} />
        <Route path="/admin/speclab/reports" element={<PageWrapper><AdminReports /></PageWrapper>} />

        {/* Redirects for static game files */}
        <Route path="/spec" element={<ExternalRedirect to="/spec/index.html" />} />
        <Route path="/spec/index" element={<ExternalRedirect to="/spec/index.html" />} />
        <Route path="/mech" element={<ExternalRedirect to="/mech/index.html" />} />
        <Route path="/mech/index" element={<ExternalRedirect to="/mech/index.html" />} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAiChat = location.pathname.startsWith('/ai-chat');
  const isSpecLab = location.pathname.startsWith('/speclab') || location.pathname.startsWith('/admin/speclab') || location.pathname.startsWith('/tools/tech-calculator');
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'midnight';

  return (
    <div
      className={`flex flex-col transition-colors duration-500 ${isAiChat ? `${isDark ? 'bg-[#212121]' : 'bg-[#ffffff]'} h-dvh overflow-hidden` : 'bg-[var(--color-background)] min-h-screen'}`}
    >
      {!isAiChat && <Navigation />}
      {/* For ai-chat: take full screen without padding so the sidebar can go to the top */}
      <main
        className={isAiChat ? 'flex-1 min-h-0 overflow-hidden flex flex-col' : 'flex-grow'} style={!isAiChat ? { paddingTop: 'var(--nav-height)' } : undefined}
      >
        {children}
      </main>
      {!(isAiChat || isSpecLab) && <Footer />}
    </div>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
      className="w-full h-full flex flex-col min-h-0"
    >
      {children}
    </motion.div>
  );
}

function App() {
  // Immediate redirect for static game routes to avoid loading screen
  if (
    window.location.pathname === '/spec' || 
    window.location.pathname === '/spec/index' ||
    window.location.pathname === '/mech' ||
    window.location.pathname === '/mech/index'
  ) {
    const target = window.location.pathname.startsWith('/mech') ? '/mech/index.html' : '/spec/index.html';
    window.location.replace(target);
    return null;
  }

  const [loading, setLoading] = useState(() => {
    // Only show loading screen once per session
    const hasLoaded = sessionStorage.getItem('has_loaded_before');
    if (hasLoaded) return false;
    return true;
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('has_loaded_before', 'true');
    setLoading(false);
  };

  // Stop scrolling while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [loading]);

  return (
    <ThemeProvider>
      <LoginModal />
      <Router>
        <CustomCursor />
        
        <AnimatePresence>
          {loading && (
            <LoadingSequence onComplete={handleLoadingComplete} />
          )}
        </AnimatePresence>

        <Routes>
          <Route path="*" element={
            <MainLayout>
              <AnimatedRoutes />
            </MainLayout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;



