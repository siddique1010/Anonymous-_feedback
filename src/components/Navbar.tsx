'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { LayoutDashboard, LogOut, Menu, MessageSquare, Sparkles, X, ArrowRight } from 'lucide-react';

function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user: User = session?.user;
  const displayName = user?.username || user?.email || 'Account';
  const initials = displayName.slice(0, 2).toUpperCase();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Brand Logo with 3D depth */}
        <Link
          href={session ? '/dashboard' : '/'}
          className="group flex items-center gap-2.5 font-bold tracking-tight text-white transition-all duration-300"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow group-hover:rotate-3">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/40 backdrop-blur-sm">
              <MessageSquare className="h-5 w-5 text-indigo-300 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              True Feedback
            </span>
            <span className="text-[10px] -mt-1 font-medium tracking-widest text-indigo-400 uppercase">
              Enterprise
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {session ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800/60 hover:text-white md:flex"
            >
              <LayoutDashboard className="h-4 w-4 text-indigo-400" />
              <span>Dashboard</span>
            </Link>

            {/* User Profile Pill with 3D depth */}
            <div className="hidden items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/80 py-1 pl-1 pr-3.5 shadow-inner backdrop-blur-sm md:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                {initials}
              </div>
              <span className="max-w-32 truncate text-xs font-semibold text-slate-200">
                {displayName}
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" title="Active" />
            </div>

            {/* 3D Logout Button with Cursor Hover & Press Reactions */}
            <button
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
              className="group relative hidden items-center gap-2 overflow-hidden rounded-lg border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-300 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 hover:shadow-[0_8px_20px_-4px_rgba(239,68,68,0.3)] active:translate-y-0.5 active:scale-95 md:inline-flex"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-red-400" />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              aria-label="Toggle Navigation Menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-all hover:bg-slate-800 hover:text-white md:hidden"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            {/* 3D Login Button with Glow & Cursor Reactions */}
            <Link href="/sign-in">
              <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow hover:brightness-110 active:translate-y-0 active:scale-95">
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </Link>

            <Link href="/sign-up" className="hidden sm:inline-block">
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3.5 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-95">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Register</span>
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {session && isMobileMenuOpen && (
        <div className="border-t border-slate-800/80 bg-slate-950/95 px-4 py-5 backdrop-blur-xl md:hidden">
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-md">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{displayName}</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Session</span>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Link href="/dashboard" onClick={closeMobileMenu}>
              <Button className="w-full justify-start gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800" variant="ghost">
                <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                Dashboard
              </Button>
            </Link>
            <Button
              className="w-full justify-start gap-2 border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200"
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
              variant="ghost"
            >
              <LogOut className="h-4 w-4 text-red-400" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
