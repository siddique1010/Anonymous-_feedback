'use client';

import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { Sparkles, User, Loader2, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/sign-in');
    } else if (status === 'authenticated' && !session.user.needsUsernameSetup) {
      router.replace('/dashboard');
    }
  }, [router, session, status]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse & { username: string }>(
        '/api/complete-oauth-profile',
        { username }
      );

      await update({
        username: response.data.username,
        needsUsernameSetup: false,
      });
      router.replace('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Unable to save username',
        description:
          axiosError.response?.data.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || !session?.user.needsUsernameSetup) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white overflow-hidden">
      {/* 3D Ambient Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[320px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-[110px] pointer-events-none -z-10" />

      {/* Floating 3D Glassmorphic Card */}
      <section className="relative w-full max-w-md rounded-3xl border border-slate-800/90 bg-slate-900/80 p-8 shadow-depth backdrop-blur-2xl transition-all duration-300 hover:border-slate-700/80 hover:shadow-depth-hover">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-glow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/60">
                <Sparkles className="h-7 w-7 text-indigo-300" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Choose Your Username
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            This will be used for your public anonymous message link.
          </p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
              Public Handle
            </label>
            <div className="relative">
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="your_handle"
                minLength={2}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
                required
                className="border-slate-800 bg-slate-950/80 pl-10 text-sm text-white placeholder:text-slate-600 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/25 transition-all rounded-xl h-12"
              />
              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Use 2–20 letters, numbers, or underscores.
            </p>
          </div>

          {/* 3D Continue Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-5 py-3.5 text-sm font-semibold text-white shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow hover:brightness-110 active:translate-y-0 active:scale-95 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Handle…</span>
              </>
            ) : (
              <>
                <span>Complete Setup</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
