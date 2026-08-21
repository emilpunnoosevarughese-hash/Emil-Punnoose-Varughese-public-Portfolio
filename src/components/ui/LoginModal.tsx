import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Mouse tracking for interactive face
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse values
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  // Transform values for the eyes and head
  const headRotateX = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [10, -10]);
  const headRotateY = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-15, 15]);
  
  const pupilX = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-8, 8]);
  const pupilY = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-8, 8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen, mouseX, mouseY]);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSignUp(false);
      setIsForgotPass(false);
      setError('');
      setMessage('');
    };
    const handleClose = () => setIsOpen(false);
    
    window.addEventListener('open-login-modal', handleOpen);
    window.addEventListener('close-login-modal', handleClose);
    
    return () => {
      window.removeEventListener('open-login-modal', handleOpen);
      window.removeEventListener('close-login-modal', handleClose);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isForgotPass) {
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset link sent! Check your inbox.');
        setIsOpen(false);
        return;
      }

      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google Sign-In');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl min-h-[500px] flex flex-col md:flex-row overflow-hidden rounded-[2rem] bg-[#111] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Left Side: Interactive Face / Branding */}
            <div className="relative w-full md:w-5/12 bg-gradient-to-br from-[#1a1a2e] to-[#0f0c29] p-8 flex flex-col items-center justify-center overflow-hidden border-r border-white/5">
              {/* Background ambient light */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-[60px]" />
              </div>

              {/* 3D Tracking Robot Face */}
              <motion.div 
                style={{ rotateX: headRotateX, rotateY: headRotateY, perspective: 1000 }}
                className="relative z-10 w-48 h-48 mb-8 pointer-events-none"
              >
                {/* Robot Head Base */}
                <div className="absolute inset-0 bg-[#222] rounded-[3rem] border-2 border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
                  {/* Visor Area */}
                  <div className="w-[85%] h-[40%] bg-black rounded-full border border-white/5 relative flex items-center justify-center gap-6 shadow-[inset_0_0_15px_rgba(0,0,0,1)]">
                    
                    {/* Left Eye */}
                    <div className="w-12 h-12 bg-[#111] rounded-full flex items-center justify-center border border-white/5 overflow-hidden relative shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                      <motion.div 
                        style={{ x: pupilX, y: pupilY }}
                        className="w-5 h-5 bg-primary rounded-full shadow-[0_0_10px_rgba(0,223,216,0.8)]"
                      >
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 opacity-70" />
                      </motion.div>
                    </div>

                    {/* Right Eye */}
                    <div className="w-12 h-12 bg-[#111] rounded-full flex items-center justify-center border border-white/5 overflow-hidden relative shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                      <motion.div 
                        style={{ x: pupilX, y: pupilY }}
                        className="w-5 h-5 bg-primary rounded-full shadow-[0_0_10px_rgba(0,223,216,0.8)]"
                      >
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 opacity-70" />
                      </motion.div>
                    </div>

                  </div>
                  
                  {/* Robot details */}
                  <div className="absolute bottom-6 w-16 h-1.5 bg-white/10 rounded-full" />
                  <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                </div>
              </motion.div>

              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-2">
                  EXPLORE.<br />LEARN. GROW.
                </h2>
                <p className="text-white/60 text-sm">Sign in to sync your progress across devices.</p>
              </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="relative w-full md:w-7/12 bg-[#0a0a0a] p-8 md:p-12 flex flex-col justify-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-w-sm w-full mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center p-[2px]">
                    <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center">
                      <img src="/logo.png" alt="Logo" className="w-7 h-7 rounded-full" />
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white text-center mb-2 uppercase tracking-wide">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h3>
                <p className="text-white/50 text-sm text-center mb-8">
                  {isSignUp ? 'Enter your details to get started' : 'Enter your email and password to access your account'}
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/70 ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {!isForgotPass && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5 overflow-hidden"
                      >
                        <label className="text-sm font-medium text-white/70 ml-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required={!isForgotPass}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(!isSignUp && !isForgotPass) && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between pt-1 pb-2 overflow-hidden"
                      >
                        <label className="flex items-center space-x-2 cursor-pointer group">
                          <input type="checkbox" className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50" />
                          <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">Remember me</span>
                        </label>
                        <button 
                          type="button" 
                          onClick={() => { setIsForgotPass(true); setError(''); setMessage(''); }}
                          disabled={loading}
                          className="text-xs text-white/50 hover:text-white transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : isForgotPass ? (
                      <span>Reset Password</span>
                    ) : (
                      <>
                        {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                        <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 mb-6 flex items-center">
                  <div className="flex-grow h-px bg-white/10"></div>
                  <span className="px-4 text-xs font-medium text-white/30 uppercase">Or</span>
                  <div className="flex-grow h-px bg-white/10"></div>
                </div>

                <button 
                  onClick={handleGoogleSignIn}
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="font-medium text-sm">Sign in with Google</span>
                </button>

                <p className="mt-8 text-center text-sm text-white/50">
                  {isForgotPass ? "Remembered your password?" : isSignUp ? "Already have an account?" : "Don't have an account?"}
                  <button 
                    onClick={() => { if (isForgotPass) setIsForgotPass(false); else setIsSignUp(!isSignUp); }}
                    className="ml-2 font-semibold text-primary hover:text-white transition-colors"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}




