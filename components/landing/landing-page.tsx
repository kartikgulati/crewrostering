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
} from "lucide-react";

import { Button } from "@/components/ui/button";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const trustSignals = ["99.99% uptime", "Sub-second sync", "SOC 2-ready controls", "Live ops scale"];

const features = [
  {
    title: "Move at live speed",
    description: "Keep every participant, event, and decision in sync without waiting on slow refresh cycles.",
    icon: Gauge,
  },
  {
    title: "Make smarter calls",
    description: "Surface the right signal at the right moment so teams can act with confidence under pressure.",
    icon: Sparkles,
  },
  {
    title: "Stay reliable by default",
    description: "Design critical workflows around resilient state, clear feedback, and predictable recovery paths.",
    icon: LockKeyhole,
  },
  {
    title: "Scale without clutter",
    description: "Add more teams, sessions, and workflows while keeping the experience focused and fast.",
    icon: Network,
  },
];

const steps = [
  {
    label: "01",
    title: "Connect the workflow",
    description: "Bring live inputs, teams, and operational rules into one focused command surface.",
  },
  {
    label: "02",
    title: "Coordinate in real time",
    description: "Track changing conditions and trigger guided actions the moment they matter.",
  },
  {
    label: "03",
    title: "Improve every run",
    description: "Review outcomes, spot patterns, and refine the next interaction with clear performance data.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
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
      viewport={{ once: true, margin: "-80px" }}
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
    { label: "Decision confidence", value: "96.4%", trend: "+7%" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <Radio className="h-3.5 w-3.5 text-cyan-600" />
          Live
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="border-b border-slate-200 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Interaction engine</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">Realtime coordination</h3>
            </div>
            <div className="rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-2 text-right">
              <p className="text-xs font-medium text-cyan-700">Health</p>
              <p className="text-sm font-semibold text-cyan-950">Optimal</p>
            </div>
          </div>

          <div className="relative h-56 overflow-hidden rounded-lg border border-slate-200 bg-slate-950 p-4">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
            <motion.div
              className="absolute left-10 top-12 h-20 w-20 rounded-full border border-cyan-300/60 bg-cyan-300/10"
              animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-10 right-12 h-24 w-24 rounded-full border border-emerald-300/60 bg-emerald-300/10"
              animate={{ scale: [1.08, 1, 1.08], opacity: [1, 0.75, 1] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10 grid h-full grid-cols-3 items-end gap-3">
              {[52, 78, 64, 90, 70, 84].map((height, index) => (
                <motion.span
                  key={height + index}
                  className="rounded-t bg-cyan-300/80"
                  style={{ height: `${height}%` }}
                  initial={{ scaleY: 0.7 }}
                  animate={{ scaleY: [0.78, 1, 0.88] }}
                  transition={{ duration: 2 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Activity className="h-4 w-4 text-cyan-600" />
            Performance snapshot
          </div>
          <div className="space-y-3">
            {streams.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {item.trend}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 py-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-950 text-white">
              <Activity className="h-4 w-4" />
            </span>
            CrewRostering
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-950">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-slate-950">
              Workflow
            </a>
            <a href="#preview" className="transition hover:text-slate-950">
              Preview
            </a>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-lg bg-white">
            <Link href="/launch">Open App</Link>
          </Button>
        </nav>

        <motion.section
          className="grid items-center gap-12 pb-20 pt-16 md:pt-24 lg:grid-cols-[0.95fr_1.05fr] lg:pb-28"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>Realtime intelligence</SectionLabel>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Coordinate live operations with AI-speed precision.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A high-performance interaction layer for teams that need instant signal, reliable execution, and clear
              decisions when the system is moving fast.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-lg bg-slate-950 text-white hover:bg-slate-800">
                <Link href="/launch">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-lg bg-white">
                <a href="#preview">View Preview</a>
              </Button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <ProductPreview />
          </motion.div>
        </motion.section>
      </div>

      <AnimatedSection className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustSignals.map((signal) => (
            <motion.div
              key={signal}
              variants={fadeUp}
              className="rounded-lg border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700"
            >
              {signal}
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="max-w-2xl">
          <SectionLabel>Outcomes</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Built for fast-moving teams.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Every feature is shaped around faster response, better judgment, and dependable live execution.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={fadeUp}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <feature.icon className="h-5 w-5 text-cyan-600" />
              <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="workflow" className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="max-w-2xl">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From signal to action in three steps.</h2>
          </motion.div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {steps.map((step) => (
              <motion.div
                key={step.label}
                variants={fadeUp}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-sm font-semibold text-cyan-300">{step.label}</p>
                <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="preview" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionLabel>Product preview</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">A calm surface for complex moments.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Dense operational data stays readable, responsive, and ready for repeated daily use.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
            Median response: <span className="font-semibold text-slate-950">124ms</span>
          </div>
        </motion.div>
        <motion.div variants={fadeUp}>
          <ProductPreview />
        </motion.div>
      </AnimatedSection>

      <section className="px-5 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg bg-slate-950 px-6 py-12 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:px-10 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Launch a faster live experience today.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Give teams one reliable place to understand what is happening and act before momentum is lost.
            </p>
          </div>
          <Button asChild size="lg" className="mt-8 rounded-lg bg-cyan-400 text-slate-950 hover:bg-cyan-300 lg:mt-0">
            <Link href="/launch">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
