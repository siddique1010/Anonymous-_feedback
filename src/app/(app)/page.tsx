'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ShieldCheck, Zap, Sparkles, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Ambient 3D Spotlight Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/15 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-indigo-600/15 blur-[140px] pointer-events-none -z-10" />

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-16 md:py-24 relative z-10">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md shadow-glow-sm animate-pulse-glow">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400"></span>
            <span className="text-xs font-semibold text-indigo-300 tracking-wide">
              Enterprise-Grade Confidential Feedback Platform
            </span>
          </div>

          {/* 3D Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Unfiltered Truth. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              100% Anonymous.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Empower your team, audience, or friends to share genuine thoughts with complete peace of mind. Zero tracking, enterprise encryption, and instant AI insights.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <button className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-indigo-400/40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-7 py-3.5 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-lg hover:brightness-110 active:translate-y-0 active:scale-95">
                <span className="relative z-10 flex items-center gap-2">
                  <span>Create Your Board</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </Link>

            <Link href="/sign-in" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-6 py-3.5 text-base font-medium text-slate-300 backdrop-blur-md shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800 hover:text-white active:scale-95">
                <span>Sign In to Dashboard</span>
              </button>
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
            <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-glow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Zero Identification</h3>
              <p className="text-xs text-slate-400 mt-1">Sender identity is never stored or exposed to anyone.</p>
            </div>

            <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-glow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Instant SMTP Delivery</h3>
              <p className="text-xs text-slate-400 mt-1">Direct enterprise email pipeline for instantaneous OTP verification.</p>
            </div>

            <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-glow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-3 border border-purple-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Smart AI Prompts</h3>
              <p className="text-xs text-slate-400 mt-1">Integrated AI assistant providing engaging conversation starters.</p>
            </div>
          </div>
        </section>

        {/* 3D Carousel Section */}
        <section className="w-full max-w-xl mx-auto mt-16 md:mt-20">
          <div className="text-center mb-6">
            <h2 className="text-sm font-semibold tracking-widest text-indigo-400 uppercase">
              Live Feed Preview
            </h2>
            <p className="text-xl font-bold text-white mt-1">Real Messages from Real Communities</p>
          </div>

          <div className="relative">
            <Carousel
              plugins={[Autoplay({ delay: 3500 })]}
              className="w-full"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="p-2">
                    <div className="group rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-depth backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-depth-hover">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Mail className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-sm text-slate-200">{message.title}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      </div>
                      <div className="pt-4">
                        <p className="text-slate-300 text-sm leading-relaxed">{message.content}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                          <span>Received anonymously</span>
                          <span>{message.received}</span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/95 px-6 py-8 text-slate-400 text-sm">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300">All Systems Operational</span>
          </div>
          <p className="text-xs text-slate-500 text-center sm:text-right">
            © {new Date().getFullYear()} True Feedback Inc. All confidential rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
