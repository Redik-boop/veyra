import React, { useState, useEffect } from 'react';
import { useDB, putItem, getItems } from '../hooks/useDB';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => (
  <div className="min-h-screen w-full bg-veyra-black flex items-center justify-center p-4 relative overflow-hidden">
    {/* Background Decoration */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-veyra-accentBlue/10 blur-[120px] rounded-full" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-veyra-accentGreen/10 blur-[120px] rounded-full" />

    <div className="w-full max-w-md z-10">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16 bg-veyra-accentBlue rounded-2xl flex items-center justify-center shadow-lg shadow-veyra-accentBlue/20 rotate-3">
            <span className="text-white font-bold text-4xl -rotate-3">V</span>
            <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-yellow-400 rounded-full" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">{title}</h1>
        <p className="text-veyra-textMuted">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

export const SignIn = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setCurrentUser } = useAuth();
  const db = useDB();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!db) return;

    try {
      const users = await getItems(db, 'users');
      const user = users.find(u => u.username === email || u.id === email);

      if (user) {
        setCurrentUser(user);
        localStorage.setItem('veyra_session', JSON.stringify(user));
      } else {
        setError('Account not found. Please sign up first.');
      }
    } catch (err) {
      setError('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your offline journey"
    >
      <form onSubmit={handleSignIn} className="glass-panel p-8 rounded-3xl space-y-5 shadow-2xl border-white/10">
        {error && (
          <div className="p-3 bg-red-500/20 text-red-400 text-xs rounded-lg border border-red-500/30 text-center">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-veyra-textMuted" size={20} />
            <input
              type="text"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-veyra-darkgray border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-veyra-accentBlue outline-none transition-all"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-veyra-textMuted" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-veyra-darkgray border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-veyra-accentBlue outline-none transition-all"
              required
            />
          </div>
        </div>
        <button
          disabled={loading}
          className="w-full bg-veyra-accentBlue hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
        >
          {loading ? 'Signing in...' : 'Sign In'}
          {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
        <p className="text-center text-sm text-veyra-textMuted">
          New to Veyra?{' '}
          <button type="button" onClick={onSwitch} className="text-veyra-accentBlue font-bold hover:underline">
            Create account
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export const SignUp = ({ onSwitch }: { onSwitch: () => void }) => {
  const [form, setForm] = useState({ email: '', password: '', displayName: '', username: '' });
  const { setCurrentUser } = useAuth();
  const db = useDB();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!db) return;

    const newUser = {
      id: `u${Date.now()}`,
      username: form.username || form.email,
      displayName: form.displayName,
      bio: 'New member of Veyra',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username}`,
      createdAt: Date.now(),
    };

    await putItem(db, 'users', newUser);
    setCurrentUser(newUser);
    localStorage.setItem('veyra_session', JSON.stringify(newUser));
  };

  return (
    <AuthLayout
      title="Join Veyra"
      subtitle="Experience the power of an offline social network"
    >
      <form onSubmit={handleSignUp} className="glass-panel p-8 rounded-3xl space-y-5 shadow-2xl border-white/10">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-veyra-textMuted" size={20} />
            <input
              type="text"
              placeholder="Full Name"
              value={form.displayName}
              onChange={(e) => setForm({...form, displayName: e.target.value})}
              className="w-full bg-veyra-darkgray border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-veyra-accentBlue outline-none transition-all"
              required
            />
          </div>
          <div className="relative">
            <Sparkles className="absolute left-3 top-3 text-veyra-textMuted" size={20} />
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value})}
              className="w-full bg-veyra-darkgray border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-veyra-accentBlue outline-none transition-all"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-veyra-textMuted" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full bg-veyra-darkgray border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-veyra-accentBlue outline-none transition-all"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-veyra-textMuted" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full bg-veyra-darkgray border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-veyra-accentBlue outline-none transition-all"
              required
            />
          </div>
        </div>
        <button
          disabled={loading}
          className="w-full bg-veyra-accentBlue hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
        >
          {loading ? 'Creating Account...' : 'Start Journey'}
          {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
        <p className="text-center text-sm text-veyra-textMuted">
          Already have an account?{' '}
          <button type="button" onClick={onSwitch} className="text-veyra-accentBlue font-bold hover:underline">
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};
