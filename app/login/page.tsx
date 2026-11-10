'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const res = login(email, password);
    setLoading(false);
    if (!res.ok) { setError(res.error || 'Login failed.'); return; }
    router.replace('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md glass-panel p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to your Task Tracker account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-muted-foreground">{showPw ? '🙈' : '👁️'}</button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <span className="text-primary cursor-pointer">Forgot password?</span>
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-indigo-500/20 disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Don't have an account? <Link href="/register" className="text-primary font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
