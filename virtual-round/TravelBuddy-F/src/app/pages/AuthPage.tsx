import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, Mail, Lock, User, ArrowRight, Eye, EyeOff, 
  CheckCircle2, XCircle, ShieldCheck, Globe, Calendar, Phone,
  Loader2, CheckCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// Social Auth SVGs
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.365 21.436c-1.144.156-2.18-.545-3.15-.545-.968 0-1.92.7-3.085.525-2.02-.303-4.004-2.167-4.97-4.225-1.57-3.344-1.1-7.59 1.155-9.664 1.385-1.275 3.064-1.578 4.316-1.578 1.408 0 2.572.784 3.42 1.258.625.353 1.336.75 2.227.75 1.077 0 1.94-.526 2.898-1.07 1.18-.67 2.443-1.39 3.99-1.09 1.098.214 2.628.985 3.522 2.572-3.176 1.722-2.613 5.922.378 7.37-1.022 2.434-2.58 4.908-4.906 5.34-1.022.19-1.93.357-2.89.357-1.13 0-1.936-.184-2.905-.357zM15.42 5.568c.87-1.107 1.4-2.56 1.134-4.056-1.3.1-2.91.95-3.834 2.11-.79.99-1.427 2.484-1.105 3.935 1.434.12 2.946-.864 3.805-1.989z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 21 21">
    <path fill="#f35325" d="M1 1h9v9H1z"/>
    <path fill="#81bc06" d="M11 1h9v9h-9z"/>
    <path fill="#05a6f0" d="M1 11h9v9H1z"/>
    <path fill="#ffba08" d="M11 11h9v9h-9z"/>
  </svg>
);

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    countryCode: '+1',
    dob: '',
    country: '',
    termsAccepted: false
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password Requirements (computed, not a hook)
  const reqs = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password)
  };
  const strengthScore = Object.values(reqs).filter(Boolean).length;
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';
  if (strengthScore === 4) { strengthLabel = 'Strong'; strengthColor = 'bg-green-500'; }
  else if (strengthScore >= 2) { strengthLabel = 'Medium'; strengthColor = 'bg-yellow-500'; }

  // Validation useEffect — MUST be before any early return
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email is required";
    if (isLogin) {
      if (!formData.password) newErrors.password = "Password is required";
    } else {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (strengthScore < 4) newErrors.password = "Password does not meet requirements";
      if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms";
    }
    setErrors(newErrors);
  }, [formData, strengthScore, isLogin]);

  // Safe early return — all hooks have already been called above
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true, email: true, password: true, termsAccepted: true
    });
    
    const currentErrors = { ...errors };
    delete currentErrors.submit; // Clear any previous submit errors
    
    if (Object.keys(currentErrors).length === 0) {
      setIsLoading(true);
      try {
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });
          if (error) throw error;
          // Navigation is handled by the `if (user)` check at the top
        } else {
          const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: { full_name: formData.fullName },
            }
          });
          if (error) throw error;
          setIsSuccess(true);
        }
      } catch (err: any) {
        setErrors(prev => ({ ...prev, submit: err.message || 'An error occurred during authentication.' }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Helper for Input Error Shake
  const getErrorAnimation = (name: string) => {
    return touched[name] && errors[name] ? { x: [-10, 10, -10, 10, 0] } : {};
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      
      {/* Left Panel: Visual/Travel Theme */}
      <div className="relative hidden lg:block overflow-hidden bg-[#0A0F1C]">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200"
          alt="Travel view from airplane"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/40 backdrop-blur-[2px]"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2,2" />
          </svg>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-16 text-white">
          <div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 w-fit mb-12 shadow-xl">
              <div className="flex items-center gap-2">
                <Plane className="w-8 h-8" />
                <span className="text-2xl font-bold tracking-tight">Travel Buddy</span>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Your journey <br/>begins here.
              </h1>
              <p className="text-xl text-white/80 max-w-md font-light leading-relaxed">
                Join a global community of explorers. Plan smarter, travel further, and experience the world effortlessly with AI.
              </p>
            </motion.div>
          </div>

          <div className="flex gap-8 border-t border-white/20 pt-8 mt-auto">
            <div>
              <div className="text-3xl font-bold">2M+</div>
              <div className="text-sm text-white/60 mt-1">Active Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">150+</div>
              <div className="text-sm text-white/60 mt-1">Countries Supported</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex flex-col min-h-screen relative p-6 sm:p-12">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 lg:mb-16">
          <Link to="/" className="lg:hidden flex items-center gap-2">
             <div className="bg-primary p-2 rounded-xl text-white"><Plane className="w-5 h-5"/></div>
             <span className="font-bold text-xl">Travel Buddy</span>
          </Link>
          <div className="hidden lg:block"></div> {/* Spacer */}
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-muted-foreground">
              {isLogin ? "New to Travel Buddy?" : "Already have an account?"}
            </span>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setTouched({});
              }}
              className="text-primary hover:underline"
            >
              {isLogin ? 'Create an account' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Check your email</h2>
                <p className="text-muted-foreground mb-8">
                  We've sent a verification link to <span className="font-bold text-foreground">{formData.email}</span>. Please click the link to activate your account.
                </p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-primary to-secondary py-3.5 rounded-xl text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                >
                  Continue to Dashboard
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {isLogin ? 'Enter your details to access your trips.' : 'Start your premium travel experience today.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  {errors.submit && (
                    <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      {errors.submit}
                    </div>
                  )}

                  {!isLogin && (
                    <motion.div animate={getErrorAnimation("fullName")}>
                      <label className="block text-sm font-medium mb-1.5 text-foreground">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Jane Doe"
                          className={`w-full bg-input-background border ${touched.fullName && errors.fullName ? 'border-red-500' : 'border-border hover:border-slate-300 dark:hover:border-slate-600'} rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                        />
                        {touched.fullName && !errors.fullName && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                      </div>
                      {touched.fullName && errors.fullName && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3 h-3"/> {errors.fullName}</p>}
                    </motion.div>
                  )}

                  <motion.div animate={getErrorAnimation("email")}>
                    <label className="block text-sm font-medium mb-1.5 text-foreground">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="you@example.com"
                        className={`w-full bg-input-background border ${touched.email && errors.email ? 'border-red-500' : 'border-border hover:border-slate-300 dark:hover:border-slate-600'} rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                      />
                      {touched.email && !errors.email && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                    </div>
                    {touched.email && errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><XCircle className="w-3 h-3"/> {errors.email}</p>}
                  </motion.div>

                  {!isLogin && (
                    <div className="grid grid-cols-[100px_1fr] gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground">Code</label>
                        <select 
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleChange}
                          className="w-full bg-input-background border border-border rounded-xl px-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                        >
                          <option value="+1">US +1</option>
                          <option value="+44">UK +44</option>
                          <option value="+91">IN +91</option>
                          <option value="+61">AU +61</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground">Phone Number</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="555 123 4567"
                            className="w-full bg-input-background border border-border hover:border-slate-300 dark:hover:border-slate-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <motion.div animate={getErrorAnimation("password")}>
                    <label className="block text-sm font-medium mb-1.5 text-foreground">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                        className={`w-full bg-input-background border ${touched.password && errors.password ? 'border-red-500' : 'border-border hover:border-slate-300 dark:hover:border-slate-600'} rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Live Password Strength Indicator */}
                    {!isLogin && formData.password.length > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-medium text-muted-foreground">Password Strength</span>
                          <span className={`text-xs font-bold ${
                            strengthScore === 4 ? 'text-green-500' : strengthScore >= 2 ? 'text-yellow-500' : 'text-red-500'
                          }`}>{strengthLabel}</span>
                        </div>
                        <div className="flex gap-1 h-1.5 w-full mb-3">
                          {[1, 2, 3, 4].map(level => (
                            <div 
                              key={level} 
                              className={`flex-1 rounded-full transition-colors duration-300 ${level <= strengthScore ? strengthColor : 'bg-border'}`}
                            ></div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <span className={`flex items-center gap-1 ${reqs.length ? 'text-green-500' : ''}`}><CheckCircle2 className="w-3 h-3"/> 8+ characters</span>
                          <span className={`flex items-center gap-1 ${reqs.upper ? 'text-green-500' : ''}`}><CheckCircle2 className="w-3 h-3"/> Uppercase letter</span>
                          <span className={`flex items-center gap-1 ${reqs.number ? 'text-green-500' : ''}`}><CheckCircle2 className="w-3 h-3"/> Number</span>
                          <span className={`flex items-center gap-1 ${reqs.special ? 'text-green-500' : ''}`}><CheckCircle2 className="w-3 h-3"/> Special char</span>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {!isLogin && (
                    <motion.div animate={getErrorAnimation("termsAccepted")} className="mt-6">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="flex items-center h-5">
                          <input 
                            type="checkbox" 
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary bg-input-background" 
                          />
                        </div>
                        <div className="text-sm text-muted-foreground leading-tight">
                          I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>. By creating an account, I consent to the processing of my personal data.
                        </div>
                      </label>
                      {touched.termsAccepted && errors.termsAccepted && <p className="text-red-500 text-xs mt-1.5">You must agree to the terms.</p>}
                    </motion.div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-muted-foreground font-medium">Remember me</span>
                      </label>
                      <a href="#" className="text-primary font-medium hover:underline">
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-secondary py-3.5 mt-2 rounded-xl text-white font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-4">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Your data is securely encrypted
                  </div>
                </form>

                <div className="mt-8">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-background text-muted-foreground font-medium">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button className="flex items-center justify-center p-3.5 border border-border rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:border-slate-300 transition-all text-foreground group">
                      <div className="group-hover:scale-110 transition-transform"><GoogleIcon /></div>
                    </button>
                    <button className="flex items-center justify-center p-3.5 border border-border rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:border-slate-300 transition-all text-foreground group">
                      <div className="group-hover:scale-110 transition-transform"><AppleIcon /></div>
                    </button>
                    <button className="flex items-center justify-center p-3.5 border border-border rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:border-slate-300 transition-all text-foreground group">
                      <div className="group-hover:scale-110 transition-transform"><MicrosoftIcon /></div>
                    </button>
                    <button className="flex items-center justify-center p-3.5 border border-border rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:border-slate-300 transition-all text-foreground group">
                      <div className="group-hover:scale-110 transition-transform"><GithubIcon /></div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <button className="hover:text-foreground transition-colors">Support</button>
          <button className="hover:text-foreground transition-colors">Terms</button>
          <div className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors">
            <Globe className="w-4 h-4" /> EN
          </div>
        </div>
      </div>
    </div>
  );
}
