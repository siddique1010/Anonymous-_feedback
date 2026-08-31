'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { LayoutDashboard, LogOut, Menu, MessageSquare, X } from 'lucide-react';

function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user: User = session?.user;
  const displayName = user?.username || user?.email || 'Account';
  const initials = displayName.slice(0, 2).toUpperCase();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 text-white backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href={session ? '/dashboard' : '/'}
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
            <MessageSquare className="h-5 w-5" />
          </span>
          <span>True Feedback</span>
        </Link>

        {session ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden items-center gap-2 text-sm text-slate-300 transition hover:text-white md:flex"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold">
                {initials}
              </span>
              <span className="max-w-36 truncate text-sm text-slate-200">
                {displayName}
              </span>
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
              className="hidden md:inline-flex"
              size="sm"
              variant="outline"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button
              aria-label="Open account menu"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              size="icon"
              variant="ghost"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button size="sm" variant="outline">Login</Button>
          </Link>
        )}
      </div>
      {session && isMobileMenuOpen && (
        <div className="border-t border-slate-800 px-4 py-4 md:hidden">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold">
              {initials}
            </span>
            <span className="truncate text-sm">{displayName}</span>
          </div>
          <div className="grid gap-2">
            <Link href="/dashboard" onClick={closeMobileMenu}>
              <Button className="w-full justify-start" variant="ghost">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button
              className="w-full justify-start"
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
              variant="ghost"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
