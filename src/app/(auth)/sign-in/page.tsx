'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { MessageSquare, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      }

      if (result?.url) {
        router.replace('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white overflow-hidden">
      {/* 3D Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-[100px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-600/10 blur-[120px] pointer-events-none -z-10" />

      {/* Floating 3D Glassmorphic Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800/90 bg-slate-900/80 p-8 shadow-depth backdrop-blur-2xl transition-all duration-300 hover:border-slate-700/80 hover:shadow-depth-hover">
        {/* Brand Icon Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-glow-sm transition-transform duration-300 hover:scale-110 hover:rotate-3">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/60">
                <MessageSquare className="h-6 w-6 text-indigo-300" />
              </div>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your secret feedback board
          </p>
        </div>

        {/* Credentials Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Email or Username
                  </FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="e.g. your_name or email@example.com"
                      className="border-slate-800 bg-slate-950/80 pl-10 text-sm text-white placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all rounded-xl h-11"
                    />
                    <Mail className="absolute left-3.5 top-3 h-5 w-5 text-slate-500" />
                  </div>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Password
                  </FormLabel>
                  <div className="relative">
                    <Input
                      type="password"
                      {...field}
                      placeholder="••••••••"
                      className="border-slate-800 bg-slate-950/80 pl-10 text-sm text-white placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all rounded-xl h-11"
                    />
                    <Lock className="absolute left-3.5 top-3 h-5 w-5 text-slate-500" />
                  </div>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />

            {/* 3D Primary Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow hover:brightness-110 active:translate-y-0 active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </Form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900 px-3 text-xs font-medium uppercase tracking-wider text-slate-500">
            or continue with
          </span>
        </div>

        {/* Social OAuth Buttons with 3D elevation */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
            className="group flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white active:scale-95"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => signIn('github', { callbackUrl: '/onboarding' })}
            className="group flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white active:scale-95"
          >
            <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Not registered yet?{' '}
          <Link
            href="/sign-up"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
