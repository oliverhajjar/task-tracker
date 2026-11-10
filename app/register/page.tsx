'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const res = register(name, email, password);
    setLoading(false);
    if (!res.ok) { setError(res.error || 'Registration failed.'); return; }
    router.replace('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md glass-panel p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Create account</h1>
        <p className="text-sm text-muted-foreground mb-6">Start tracking your tasks today.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
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
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Confirm password</label>
            <input type={showPw ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-indigo-500/20 disabled:opacity-60">
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Already have an account? <Link href="/login" className="text-primary font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
