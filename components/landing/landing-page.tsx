"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Gauge,
  LockKeyhole,
  Network,
  Radio,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Navbar } from "./navbar";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const trustSignals = ["99.99% uptime", "Sub-second sync", "Verification ready", "Real-time analytics"];

const features = [
  {
    title: "Move at live speed",
    description: "Keep every participant, event, and decision in sync without waiting on slow refresh cycles.",
    icon: Gauge,
  },
  {
    title: "Actionable Intelligence",
    description: "Advanced quiz implementations for deeper understanding and immediate operational feedback.",
    icon: Sparkles,
  },
  {
    title: "Reliable by Default",
    description: "Design critical workflows around resilient state, clear feedback, and predictable recovery paths.",
    icon: LockKeyhole,
  },
  {
    title: "Scalable Infrastructure",
    description: "Add more teams, sessions, and workflows while keeping the experience focused and effective.",
    icon: Network,
  },
];

const steps = [
  {
    label: "01",
    title: "Digitize Roster",
    description: "Convert crew rosters and operational workflows into a smart digital system for real-time coordination.",
  },
  {
    label: "02",
    title: "Enrich Data",
    description: "Integrate live data and interactive knowledge checks to keep teams informed and ready for action.",
  },
  {
    label: "03",
    title: "Monitor Outcomes",
    description: "Release the roster and track real-time performance metrics with precision analytics.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
      {children}
    </div>
  );
}

function AnimatedSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={stagger}
    >
      {children}
    </motion.section>
  );
}

function ProductPreview() {
  const streams = [
    { label: "Response latency", value: "124ms", trend: "-18%" },
    { label: "Active interactions", value: "8,492", trend: "+32%" },
    { label: "Completions", value: "99.99%", trend: "+7%" },
  ];

  return (
    <div className="relative group">
      {/* Background Glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000" />

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500/80" />
            <span className="h-2 w-2 rounded-full bg-amber-500/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider border border-indigo-500/20">
            <Radio className="h-3 w-3" />
            Live System
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Interaction engine</p>
                <h3 className="mt-1 text-xl font-bold text-white tracking-tight">Realtime Crew Rostering</h3>
              </div>
              <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-right">
                <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-wider">Health</p>
                <p className="text-sm font-bold text-indigo-300">Optimal</p>
              </div>
            </div>

            <div className="relative h-56 overflow-hidden rounded-lg border border-white/10 bg-slate-950 p-4">
              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
              <motion.div
                className="absolute left-10 top-12 h-20 w-20 rounded-full border border-indigo-500/30 bg-indigo-500/10"
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-10 right-12 h-24 w-24 rounded-full border border-purple-500/30 bg-purple-500/10"
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.8, 0.5, 0.8] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative z-10 grid h-full grid-cols-3 items-end gap-3">
                {[52, 78, 64, 90, 70, 84].map((height, index) => (
                  <motion.span
                    key={height + index}
                    className="rounded-t bg-indigo-500/60"
                    style={{ height: `${height}%` }}
                    initial={{ scaleY: 0.7 }}
                    animate={{ scaleY: [0.8, 1, 0.9] }}
                    transition={{ duration: 2 + index * 0.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-5 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Activity className="h-4 w-4 text-indigo-500" />
              Performance snapshot
            </div>
            <div className="space-y-3">
              {streams.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.05]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                      {item.trend}
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-white tracking-tight">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-300 selection:bg-indigo-500/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 py-5 sm:px-6 lg:px-8">
        <Navbar />

        <motion.section
          className="grid items-center gap-16 pb-24 pt-20 md:pt-32 lg:grid-cols-[0.95fr_1.05fr] lg:pb-32"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>Realtime intelligence</SectionLabel>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tighter text-white sm:text-6xl lg:text-7xl">
              Coordinate crew rostering with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">speed & precision.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              A high-performance interaction layer for teams that need a reliable, scalable system for managing complex crew rosters in real-time.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 px-8">
                <Link href="/launch">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-full bg-white/5 text-white border border-white/10 hover:bg-white/10 px-8">
                <a href="#preview">View Preview</a>
              </Button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="relative">
            <ProductPreview />
          </motion.div>
        </motion.section>
      </div>

      <AnimatedSection className="border-y border-white/5 bg-white/[0.01] backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustSignals.map((signal) => (
            <motion.div
              key={signal}
              variants={fadeUp}
              className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-4 text-sm font-bold text-slate-300 text-center backdrop-blur-sm"
            >
              {signal}
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="features" className="mx-auto max-w-7xl px-5 py-32 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="max-w-2xl">
          <SectionLabel>Outcomes</SectionLabel>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Built for fast-moving teams.</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            Every feature is shaped around faster response, better judgment, and dependable live execution.
          </p>
        </motion.div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={fadeUp}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.05] hover:border-indigo-500/30 hover:-translate-y-1"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="workflow" className="bg-indigo-600 py-32 text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 relative z-10 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              How it works
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">From idea to action in three steps.</h2>
          </motion.div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {steps.map((step) => (
              <motion.div
                key={step.label}
                variants={fadeUp}
                className="group rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md transition hover:bg-white/20"
              >
                <p className="text-sm font-black text-indigo-200 opacity-60">{step.label}</p>
                <h3 className="mt-6 text-2xl font-bold text-white tracking-tight">{step.title}</h3>
                <p className="mt-4 leading-relaxed text-indigo-100/80">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="preview" className="mx-auto max-w-7xl px-5 py-32 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionLabel>Product preview</SectionLabel>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Engineered for speed.</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
             Our architecture ensures that data flows seamlessly between your roster and your operational ground truth.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-slate-400 backdrop-blur-sm">
            System Latency: <span className="font-bold text-white">124ms</span>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-indigo-500/10 to-transparent blur-2xl opacity-30" />
          <div className="relative rounded-2xl border border-white/10 bg-slate-900/50 p-2 backdrop-blur-sm">
             <div className="aspect-video rounded-xl bg-slate-950 flex items-center justify-center text-slate-600 font-medium border border-white/5">
                <div className="flex flex-col items-center gap-4">
                   <Sparkles className="h-12 w-12 text-indigo-500/50 animate-pulse" />
                   <p>Product demonstration video placeholder</p>
                </div>
             </div>
          </div>
        </motion.div>
      </AnimatedSection>

      <section className="px-5 pb-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 px-8 py-16 text-white shadow-2xl shadow-indigo-500/20 sm:px-16 relative overflow-hidden">
          {/* Decorative Background Circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Launch a faster live experience today.</h2>
              <p className="mt-6 text-lg leading-relaxed text-indigo-100">
                Give your teams one reliable place to understand exactly what is happening, when it happens.
              </p>
            </div>
            <Button asChild size="lg" className="mt-10 rounded-full bg-white text-indigo-600 hover:bg-indigo-50 px-10 font-bold lg:mt-0 transition-transform hover:scale-105">
              <Link href="/launch">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
