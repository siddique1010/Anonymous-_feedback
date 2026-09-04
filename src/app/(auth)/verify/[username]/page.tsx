'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { ShieldCheck, Loader2, KeyRound, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white overflow-hidden">
      {/* 3D Ambient Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[320px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-[110px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-600/10 blur-[130px] pointer-events-none -z-10" />

      {/* Floating 3D Glassmorphic Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800/90 bg-slate-900/80 p-8 shadow-depth backdrop-blur-2xl transition-all duration-300 hover:border-slate-700/80 hover:shadow-depth-hover">
        {/* Security Shield Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-sm transition-transform duration-300 hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/60">
                <ShieldCheck className="h-7 w-7 text-emerald-400" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Security Verification
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter the 6-digit OTP sent to your email for <span className="font-semibold text-slate-200">@{params.username}</span>
          </p>
        </div>

        {/* Verification Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-300 text-center block">
                    6-Digit Verification Code
                  </FormLabel>
                  <div className="relative mt-2">
                    <Input
                      {...field}
                      maxLength={6}
                      placeholder="000000"
                      className="border-slate-800 bg-slate-950/80 text-center font-mono text-2xl tracking-[0.4em] text-white placeholder:text-slate-600 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/25 transition-all rounded-xl h-14"
                    />
                    <KeyRound className="absolute left-3.5 top-4 h-5 w-5 text-slate-600" />
                  </div>
                  <FormMessage className="text-xs text-red-400 text-center" />
                </FormItem>
              )}
            />

            {/* 3D Verify Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-5 py-3.5 text-sm font-semibold text-white shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow hover:brightness-110 active:translate-y-0 active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Code…</span>
                </>
              ) : (
                <>
                  <span>Verify & Proceed</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </Form>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-slate-400 space-y-2">
          <p>
            Didn&apos;t receive the code? Check your spam/junk folder or{' '}
            <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-medium">
              sign up again
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
