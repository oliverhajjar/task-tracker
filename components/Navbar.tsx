'use client';
import Link from 'next/link';

import React from 'react';
import { formatDateLong } from '@/utils/date';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenAdd: () => void;
}

export default function Navbar({ theme, onToggleTheme, onOpenSettings, onOpenAdd }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30 shrink-0">
            D
          </div>
          <div className="min-w-0">
            <p className="font-bold text-base tracking-tight leading-none">DailyFlow</p>
            <p className="text-[11px] text-muted-foreground leading-none mt-1 hidden sm:block">Tasks & Habits</p>
          </div>
        </div>

        <div className="hidden md:block text-sm text-muted-foreground truncate">
          {formatDateLong()}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAdd}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-indigo-500/20 hover:opacity-90 transition"
          >
            <span className="text-lg leading-none">+</span> Add Task
          </button>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 rounded-xl border border-border bg-card hover:bg-muted transition flex items-center justify-center text-base"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link href="/account" className="h-9 px-3 rounded-xl border border-border bg-card hover:bg-muted transition flex items-center justify-center text-sm font-semibold">
            Account
          </Link>
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="h-9 w-9 rounded-xl border border-border bg-card hover:bg-muted transition flex items-center justify-center text-base"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
