
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, GraduationCap, ArrowRight, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { passwordSchema, passwordRequirements, registerSchema } from '../utils/validation';

const RequirementItem: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <div className={`flex items-center gap-2 text-[11px] sm:text-sm transition-all duration-300 ${met ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
    <div className={`flex-shrink-0 p-0.5 rounded-full transition-all duration-500 ${met ? 'bg-emerald-100 dark:bg-emerald-900/40 rotate-0 scale-110' : 'bg-slate-100 dark:bg-slate-800 -rotate-90 scale-100'}`}>
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />
      ) : (
        <Circle className="w-3.5 h-3.5" strokeWidth={3} />
      )}
    </div>
    <span className="leading-none">{text}</span>
  </div>
);

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const isLogin = location.pathname === '/login';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getFriendlyErrorMessage = (message: string) => {
    const msg = message.toLowerCase();
    if (msg.includes('invalid login credentials')) {
      return 'Incorrect email or password. Please try again.';
    }
    if (msg.includes('user already registered')) {
      return 'An account with this email already exists.';
    }
    if (msg.includes('email not confirmed')) {
      return 'Please verify your email address before logging in.';
    }
    if (msg.includes('network error')) {
      return 'Connection lost. Please check your internet and try again.';
    }
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLogin) {
      const result = registerSchema.safeParse({ name, email, password, college });
      if (!result.success) {
        setError(result.error.issues[0].message);
        setLoading(false);
        return;
      }
    } else {
      if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({ name, email, password, college, branch: 'General', semester: '1st' });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.message || 'Authentication failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30 animate-pulse" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mb-6 shadow-indigo-600/20">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Join Neural Breach'}
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {isLogin ? 'Access your college resources library' : 'Start sharing and learning with your peers'}
          </p>
        </div>

        <form className="mt-8 space-y-4 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800 transition-colors" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl mb-6 border border-red-100 dark:border-red-900/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    required
                    type="text"
                    placeholder="College Name"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                required
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && password && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password Requirements</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <RequirementItem
                    met={password.length >= passwordRequirements.minLength}
                    text={`Min ${passwordRequirements.minLength} characters`}
                  />
                  <RequirementItem
                    met={passwordRequirements.hasUpperCase(password)}
                    text="Uppercase letter"
                  />
                  <RequirementItem
                    met={passwordRequirements.hasLowerCase(password)}
                    text="Lowercase letter"
                  />
                  <RequirementItem
                    met={passwordRequirements.hasNumber(password)}
                    text="Number digit"
                  />
                  <RequirementItem
                    met={passwordRequirements.hasSpecialChar(password)}
                    text="Special character"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

          <div className="text-center mt-6">
            <button type="button" onClick={() => navigate(isLogin ? '/register' : '/login')} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
