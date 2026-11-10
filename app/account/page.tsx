'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, updateUserName, changePassword, deleteAccount, logout } from '@/lib/auth';

export default function AccountPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const [name, setName] = useState(user?.name || '');
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  if (!user) {
    if (typeof window !== 'undefined') router.replace('/login');
    return null;
  }

  const saveName = () => {
    updateUserName(name);
    setMsg('Name updated.');
  };

  const savePw = () => {
    setErr(''); setMsg('');
    if (newPw.length < 8) { setErr('New password must be at least 8 characters.'); return; }
    const res = changePassword(oldPw, newPw);
    if (!res.ok) { setErr(res.error || 'Failed.'); return; }
    setMsg('Password changed.');
    setOldPw(''); setNewPw('');
  };

  const handleLogout = () => { logout(); router.replace('/login'); };
  const handleDelete = () => {
    if (confirm('Delete your account and all data? This cannot be undone.')) {
      deleteAccount();
      router.replace('/register');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md glass-panel p-6 sm:p-8 space-y-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Account</h1>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
          <p className="text-sm font-semibold">{user.email}</p>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground" />
          <button onClick={saveName} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Save name</button>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Change password</label>
          <input type="password" placeholder="Current password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground" />
          <input type="password" placeholder="New password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground" />
          <button onClick={savePw} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Change password</button>
        </div>
        {msg && <p className="text-xs text-emerald-500">{msg}</p>}
        {err && <p className="text-xs text-rose-500">{err}</p>}
        <div className="flex gap-2 pt-2">
          <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold">Log out</button>
          <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl border border-rose-500/40 text-rose-500 text-sm font-semibold">Delete account</button>
        </div>
        <p className="text-center"><a href="/" className="text-primary text-sm font-semibold">← Back to dashboard</a></p>
      </div>
    </div>
  );
}
