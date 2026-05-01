import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldCheck, Mail, Key } from 'lucide-react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RouterProvider, Outlet, useLocation, Link } from 'react-router-dom';
import { createRouter } from './router';
import { LoadingProgress } from '@/components/ui/LoadingProgress';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function RootLayout() {
  const { user, profile, signIn, signUp, signInWithProvider, signOut, resetPassword, loading, showLogin, setShowLogin } = useAuth();
  const [showSignUp, setShowSignUp] = React.useState(false);
  const [showResetPassword, setShowResetPassword] = React.useState(false);
  const [loginData, setLoginData] = React.useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = React.useState({ email: '', password: '', displayName: '' });
  const [resetEmail, setResetEmail] = React.useState('');
  const [authLoading, setAuthLoading] = React.useState(false);

  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    if (error) {
      toast.error(error.message);
    } else {
      setShowLogin(false);
      setLoginData({ email: '', password: '' });
      toast.success("Welcome back!");
    }
    setAuthLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.displayName);
    if (error) {
      toast.error(error.message);
    } else {
      setShowSignUp(false);
      setSignUpData({ email: '', password: '', displayName: '' });
      toast.success("Account created! Please check your email to verify your account.");
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.info("Logged out");
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setAuthLoading(true);
    const { error } = await signInWithProvider(provider);
    if (error) {
      toast.error(error.message);
    }
    setAuthLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await resetPassword(resetEmail);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset email sent. Check your inbox.');
      setShowResetPassword(false);
      setResetEmail('');
      setShowLogin(false);
    }
    setAuthLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-white/40 text-sm font-medium animate-pulse">Initializing NJO BAR...</p>
        </motion.div>
      </div>
    );
  }

  // If on admin path, the CMSLayout handles its own structure
  if (isAdminPath) {
    return (
      <ErrorBoundary>
        <LoadingProgress />
        <Outlet />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <LoadingProgress />
      <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500 selection:text-black">
        <Navbar
          user={user}
          onLogin={() => setShowLogin(true)}
          onLogout={handleLogout}
        />

        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="bg-zinc-950 border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
          {/* Footer Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-amber-500/5 blur-[120px] rounded-full" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="col-span-1 md:col-span-2 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(255,107,53,0.3)]">
                    <span className="text-black font-black text-xs">NJO</span>
                  </div>
                  <span className="text-3xl font-black tracking-tighter">NJO<span className="text-amber-500">BAR</span></span>
                </div>
                <p className="text-white/40 text-lg font-medium max-w-sm leading-relaxed">
                  Redefining the Nairobi bar experience through premium mixology, bespoke event management, and artisanal service.
                </p>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all cursor-pointer">
                    <span className="font-black text-xs">IG</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all cursor-pointer">
                    <span className="font-black text-xs">TK</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all cursor-pointer">
                    <span className="font-black text-xs">FB</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase font-black text-amber-500 tracking-[0.3em]">Explore</h4>
                <ul className="space-y-4 text-sm font-bold text-white/40">
                  <li><Link to="/drinks" className="hover:text-white transition-colors">Our Drinks</Link></li>
                  <li><Link to="/bookings" className="hover:text-white transition-colors">Event Services</Link></li>
                  <li><Link to="/academy" className="hover:text-white transition-colors">Academy</Link></li>
                  <li><Link to="/admin" className="hover:text-white transition-colors">CMS Portal</Link></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] uppercase font-black text-amber-500 tracking-[0.3em]">Contact</h4>
                <ul className="space-y-4 text-sm font-bold text-white/40">
                  <li>barnjo20@gmail.com</li>
                  <li>+254 713 136 565</li>
                  <li>Westlands, Nairobi</li>
                  <li>Kenya</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">© 2026 NJO Bar & Events. All rights reserved.</p>
              <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
                <a href="#" className="hover:text-amber-500 transition-colors">Privacy</a>
                <a href="#" className="hover:text-amber-500 transition-colors">Terms</a>
                <a href="#" className="hover:text-amber-500 transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Login Modal */}
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <DialogContent className="bg-zinc-950/80 border-white/10 text-white max-w-md backdrop-blur-3xl rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-4xl font-black tracking-tighter flex items-center gap-4">
                <ShieldCheck className="text-amber-500 w-10 h-10" /> Welcome <span className="text-amber-500">Back</span>
              </DialogTitle>
              <DialogDescription className="text-white/40 text-base font-medium">
                Enter your credentials to access your NJO experience.
              </DialogDescription>
            </DialogHeader>
            <AnimatePresence mode="wait">
              {showResetPassword ? (
                <motion.form 
                  key="reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleResetPassword} 
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <Label htmlFor="reset-email" className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        className="bg-white/5 border-white/10 h-14 rounded-2xl pl-14 focus:ring-amber-500/50 font-bold"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-amber-500 text-black hover:bg-amber-600 font-black h-16 rounded-2xl shadow-[0_15px_30px_rgba(255,107,53,0.2)]" disabled={authLoading}>
                    {authLoading ? 'Verifying...' : 'Reset My Password'}
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="text-amber-500 hover:text-amber-400 text-xs font-black uppercase tracking-widest"
                    >
                      Return to login
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form 
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleLogin} 
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="bg-white/5 border-white/10 h-14 rounded-2xl pl-14 focus:ring-amber-500/50 font-bold"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="password" title="Enter your password" className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Password</Label>
                      <div className="relative">
                        <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="bg-white/5 border-white/10 h-14 rounded-2xl pl-14 focus:ring-amber-500/50 font-bold"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-amber-500 text-black hover:bg-amber-600 font-black h-16 rounded-2xl shadow-[0_15px_30px_rgba(255,107,53,0.2)]" disabled={authLoading}>
                    {authLoading ? 'Authorizing...' : 'Sign In Now'}
                  </Button>
                  
                  <div className="flex flex-col gap-4">
                    <Button type="button" variant="outline" onClick={() => handleSocialLogin('google')} className="w-full border-white/10 text-white hover:bg-white/5 font-black h-14 rounded-2xl uppercase tracking-widest text-xs">
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-3" />
                      Google SSO
                    </Button>
                  </div>

                  <div className="flex justify-between items-center px-2">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-amber-500 transition-colors"
                    >
                      Reset Password
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowLogin(false); setShowSignUp(true); }}
                      className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400"
                    >
                      Join NJO
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>

        {/* Sign Up Modal */}
        <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
          <DialogContent className="bg-zinc-950/80 border-white/10 text-white max-w-md backdrop-blur-3xl rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-4xl font-black tracking-tighter flex items-center gap-4">
                <ShieldCheck className="text-amber-500 w-10 h-10" /> Join <span className="text-amber-500">NJO</span>
              </DialogTitle>
              <DialogDescription className="text-white/40 text-base font-medium">
                Create your account to unlock premium features.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignUp} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="displayName" className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Full Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Enter your name"
                    className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:ring-amber-500/50 font-bold"
                    value={signUpData.displayName}
                    onChange={(e) => setSignUpData({...signUpData, displayName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-email" className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      className="bg-white/5 border-white/10 h-14 rounded-2xl pl-14 focus:ring-amber-500/50 font-bold"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-password" title="Set a strong password" className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Secure Password</Label>
                  <div className="relative">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 h-14 rounded-2xl pl-14 focus:ring-amber-500/50 font-bold"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full bg-amber-500 text-black hover:bg-amber-600 font-black h-16 rounded-2xl shadow-[0_15px_30px_rgba(255,107,53,0.2)]" disabled={authLoading}>
                {authLoading ? 'Creating Account...' : 'Initialize Membership'}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setShowSignUp(false); setShowLogin(true); }}
                  className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-amber-500 transition-colors"
                >
                  Already have an account? <span className="text-amber-500">Sign in</span>
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Toaster position="bottom-right" theme="dark" />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
}

function AppWrapper() {
  const { user, profile, signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
    toast.info("Logged out");
    window.location.href = '/';
  };

  const router = React.useMemo(() => createRouter(user, profile, handleLogout), [user, profile]);

  return <RouterProvider router={router} />;
}
