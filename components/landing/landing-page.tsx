"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  Gauge,
  LockKeyhole,
  Network,
  Radio,
  Route,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Users,
  WalletCards,
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

const marqueeCapabilities = [
  "REAL-TIME SYNC",
  "SMART SCHEDULING",
  "LIVE ANALYTICS",
  "AUTOMATION",
  "TEAM COORDINATION",
];

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
    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#111412]/10 bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b614f] shadow-sm backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-[#91b832]" />
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

function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value]);

  return (
    <>
      {prefix}
      {displayValue.toLocaleString("en-US", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}

function ProductPreview() {
  const [activeCrew, setActiveCrew] = useState("Flight");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const crewGroups = ["Cabin", "Flight", "Ground"];
  const scheduleRows = [
    { time: "06:00", route: "YYZ - LGA", crew: "A12", status: "Ready" },
    { time: "09:20", route: "YYZ - ORD", crew: "B07", status: "Needs rest" },
    { time: "13:45", route: "YYZ - YVR", crew: "C18", status: "Covered" },
  ];
  const taskRows = [
    { label: "Confirm relief captain", progress: 78, tone: "bg-[#b7d957]" },
    { label: "Gate crew certification", progress: 64, tone: "bg-[#e5b060]" },
    { label: "Payroll variance review", progress: 88, tone: "bg-white" },
  ];
  const metrics = [
    { label: "Coverage", value: 98.4, suffix: "%", decimals: 1, icon: CheckCircle2 },
    { label: "Open tasks", value: 24, suffix: "", decimals: 0, icon: ClipboardCheck },
    { label: "Cost saved", value: 18.6, suffix: "k", prefix: "$", decimals: 1, icon: WalletCards },
  ];

  return (
    <motion.div
      className="relative mx-auto h-[720px] w-full max-w-5xl overflow-hidden rounded-[34px] border border-[#171717]/10 bg-[#111412] p-4 text-white shadow-[0_34px_110px_rgba(16,24,20,0.32)] sm:h-[660px] sm:p-5 lg:mx-0"
      initial={{ opacity: 0, y: 28, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.75, ease: "easeOut", delay: 0.18 }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMouse({
          x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
        });
      }}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(183,217,87,0.18),rgba(17,20,18,0))]" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 900 660" fill="none">
        {[
          "M188 186 C320 126 470 118 632 150",
          "M250 420 C384 486 520 478 690 402",
          "M188 186 C252 312 372 374 534 372",
          "M632 150 C704 220 736 292 690 402",
        ].map((path, index) => (
          <motion.path
            key={path}
            d={path}
            stroke={index % 2 === 0 ? "#b7d957" : "#e5b060"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 14"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0.15, 1, 0.15],
              opacity: [0.14, 0.48, 0.14],
              strokeDashoffset: [0, -80],
            }}
            transition={{ duration: 5.5 + index * 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>

      <motion.div
        className="absolute left-[5%] top-[8%] w-[90%] rounded-3xl border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:top-[6%] sm:w-[58%] sm:p-5"
        animate={{ x: mouse.x * 10, y: mouse.y * 8 }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#b7d957]">Live operations</p>
            <h3 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">Roster command</h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#b7d957]/25 bg-[#b7d957]/10 px-3 py-1.5 text-xs font-bold text-[#d8f49a]">
            <Radio className="h-3.5 w-3.5" />
            Live sync
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-[#191d1a] p-3"
              animate={{ y: index === 1 ? [0, -5, 0] : [0, 4, 0] }}
              transition={{ duration: 3.2 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
            >
              <metric.icon className="mb-3 h-4 w-4 text-[#b7d957]" />
              <p className="text-[9px] font-black uppercase tracking-wider text-white/42">{metric.label}</p>
              <p className="mt-1 text-lg font-black tracking-tight sm:text-2xl">
                <AnimatedNumber
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  decimals={metric.decimals}
                />
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-[#f7f4ec] p-4 text-[#111412]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6e725f]">Schedule board</p>
              <p className="mt-1 text-xl font-black tracking-tight">Today&apos;s turns</p>
            </div>
            <CalendarDays className="h-5 w-5 text-[#6f8d23]" />
          </div>
          <div className="space-y-2">
            {scheduleRows.map((row, index) => (
              <motion.div
                key={row.route}
                className="grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-2xl border border-[#111412]/10 bg-white px-3 py-2.5 shadow-sm"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + index * 0.1 }}
              >
                <span className="text-xs font-black text-[#6e725f]">{row.time}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black">{row.route}</span>
                  <span className="block text-xs font-bold text-[#6e725f]">Crew {row.crew}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5d8] px-2 py-1 text-[10px] font-black text-[#4f6f18]">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-[#6f8d23]"
                    animate={{ scale: [1, 1.45, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                  />
                  {row.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute right-[5%] top-[47%] w-[76%] rounded-3xl border border-white/10 bg-[#20251f]/92 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:right-[4%] sm:top-[13%] sm:w-[42%]"
        animate={{ x: mouse.x * -14, y: mouse.y * -10 }}
        transition={{ type: "spring", stiffness: 75, damping: 18 }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/42">Task flow</p>
            <p className="mt-1 text-lg font-black tracking-tight">Critical actions</p>
          </div>
          <ClipboardCheck className="h-5 w-5 text-[#b7d957]" />
        </div>
        <div className="space-y-3">
          {taskRows.map((task, index) => (
            <div key={task.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-sm font-bold text-white/82">{task.label}</p>
                <span className="text-xs font-black text-white/48">{task.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-full rounded-full ${task.tone}`}
                  initial={{ width: "18%" }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 + index * 0.12 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[15%] left-[5%] w-[58%] rounded-3xl border border-[#111412]/10 bg-[#e5b060] p-4 text-[#111412] shadow-2xl shadow-black/20 sm:bottom-[9%] sm:left-[10%] sm:w-[38%]"
        animate={{ x: mouse.x * -9, y: mouse.y * 12, rotate: mouse.x * -1.5 }}
        transition={{ type: "spring", stiffness: 70, damping: 17 }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#67502b]">Notification</p>
            <p className="mt-1 text-xl font-black tracking-tight">Swap approved</p>
          </div>
          <Bell className="h-5 w-5" />
        </div>
        <p className="text-sm font-bold leading-relaxed text-[#3f3321]">
          Flight crew B07 reassigned with rest rules and certification checks already cleared.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs font-black">
          <Clock3 className="h-4 w-4" />
          2 min ago
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[6%] right-[5%] w-[68%] rounded-3xl border border-white/10 bg-[#f7f4ec] p-4 text-[#111412] shadow-2xl shadow-black/20 sm:right-[7%] sm:w-[48%]"
        animate={{ x: mouse.x * 12, y: mouse.y * -8, rotate: mouse.x * 1.2 }}
        transition={{ type: "spring", stiffness: 70, damping: 17 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6e725f]">Demand forecast</p>
            <p className="mt-1 text-xl font-black tracking-tight">Coverage load</p>
          </div>
          <Route className="h-5 w-5 text-[#6f8d23]" />
        </div>
        <div className="grid h-24 grid-cols-8 items-end gap-1.5">
          {[52, 68, 44, 82, 76, 94, 71, 86].map((height, index) => (
            <motion.span
              key={`${height}-${index}`}
              className={index === 5 ? "rounded-t-lg bg-[#b7d957]" : "rounded-t-lg bg-[#111412]"}
              style={{ height: `${height}%` }}
              initial={{ scaleY: 0.25, transformOrigin: "bottom" }}
              animate={{ scaleY: [0.86, 1, 0.9] }}
              transition={{ duration: 2.2 + index * 0.13, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute left-[38%] top-[42%] hidden h-28 w-28 place-items-center rounded-full border border-[#b7d957]/35 bg-[#b7d957]/15 shadow-2xl shadow-[#b7d957]/10 backdrop-blur-xl sm:grid"
        animate={{ scale: [1, 1.04, 1], x: mouse.x * 5, y: mouse.y * 5 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[#b7d957] text-[#111412] shadow-xl shadow-black/20">
          <ShieldCheck className="h-8 w-8" />
        </div>
      </motion.div>

      <div className="absolute bottom-4 left-4 right-4 hidden rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl sm:block">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-white/50">
          {["Fatigue rules passed", "Live demand synced", "Payroll impact modeled"].map((item, index) => (
            <span key={item} className="inline-flex items-center gap-2">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-[#b7d957]"
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 }}
              />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute left-5 top-5 flex rounded-full border border-white/10 bg-white/[0.06] p-1 backdrop-blur-xl">
        {crewGroups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setActiveCrew(group)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition sm:px-4 ${
              activeCrew === group ? "bg-[#b7d957] text-[#111412]" : "text-white/60 hover:text-white"
            }`}
          >
            {group}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
function HeroSection() {
  return (
    <motion.section
      className="grid min-h-screen items-center gap-12 pb-16 pt-28 md:pt-36 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10 lg:pb-20"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#151915]/10 bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#5b614f] shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#91b832]" />
          Crew operations SaaS
        </div>
        <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.86] tracking-normal text-[#111412] sm:text-7xl lg:text-[7.3rem] xl:text-[8.4rem]">
          Every Shift.
          <span className="block text-[#6f8d23]">Every Rule.</span>
          Under Control.
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[#4d5549] sm:text-xl">
          Plan complex rosters, resolve coverage gaps, and keep teams aligned with a live command layer built for fast-moving operations.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-14 rounded-full bg-[#111412] px-7 text-base font-black text-white shadow-xl shadow-black/15 hover:bg-[#263026]">
            <Link href="/launch">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="h-14 rounded-full border border-[#111412]/15 bg-white px-7 text-base font-black text-[#111412] hover:bg-[#f4f1e9]">
            <a href="#preview">View Demo</a>
          </Button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="relative">
        <ProductPreview />
      </motion.div>
    </motion.section>
  );
}

function CapabilityMarquee() {
  const marqueeItems = [...marqueeCapabilities, ...marqueeCapabilities, ...marqueeCapabilities];

  return (
    <section className="relative -mt-6 overflow-hidden border-y border-[#111412]/10 bg-white/35 py-4 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-[linear-gradient(90deg,#f5f2ea,rgba(245,242,234,0))]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-[linear-gradient(270deg,#f5f2ea,rgba(245,242,234,0))]" />
      <motion.div
        className="flex w-max items-center gap-5 whitespace-nowrap"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
      >
        {marqueeItems.map((capability, index) => (
          <div key={`${capability}-${index}`} className="flex items-center gap-5">
            <span className="text-xs font-black tracking-[0.22em] text-[#4d5549] sm:text-sm">
              {capability}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#91b832]" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f5f2ea] text-slate-300 selection:bg-[#b7d957]/40">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#111412_1px,transparent_1px),linear-gradient(90deg,#111412_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto flex w-full max-w-[92rem] flex-col px-5 py-5 sm:px-6 lg:px-8">
          <Navbar />
          <HeroSection />
        </div>
        <CapabilityMarquee />
      </div>

      <div className="relative bg-[#f5f2ea]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#111412_1px,transparent_1px),linear-gradient(90deg,#111412_1px,transparent_1px)] [background-size:42px_42px]" />

        <AnimatedSection className="relative border-y border-[#111412]/10 bg-white/30 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {trustSignals.map((signal) => (
              <motion.div
                key={signal}
                variants={fadeUp}
                className="rounded-xl border border-[#111412]/10 bg-white/55 px-6 py-4 text-center text-sm font-bold text-[#4d5549] shadow-sm backdrop-blur-sm"
              >
                {signal}
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection id="features" className="relative mx-auto max-w-7xl px-5 py-32 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="max-w-2xl">
            <SectionLabel>Outcomes</SectionLabel>
            <h2 className="text-4xl font-bold tracking-tight text-[#111412] sm:text-5xl">Built for fast-moving teams.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#4d5549]">
              Every feature is shaped around faster response, better judgment, and dependable live execution.
            </p>
          </motion.div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <motion.article
                key={feature.title}
                variants={fadeUp}
                className="group rounded-2xl border border-[#111412]/10 bg-white/55 p-8 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#91b832]/50 hover:bg-white/80 hover:shadow-xl hover:shadow-black/5"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#111412] text-[#b7d957] transition-colors group-hover:bg-[#b7d957] group-hover:text-[#111412]">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#111412]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4d5549]">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection id="workflow" className="relative overflow-hidden border-y border-[#111412]/10 bg-white/35 py-32 text-[#111412] backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-5 relative z-10 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#111412]/10 bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b614f] shadow-sm backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#91b832]" />
                How it works
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-[#111412] sm:text-5xl">From idea to action in three steps.</h2>
            </motion.div>
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {steps.map((step) => (
                <motion.div
                  key={step.label}
                  variants={fadeUp}
                  className="group rounded-2xl border border-[#111412]/10 bg-white/55 p-8 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/80 hover:shadow-xl hover:shadow-black/5"
                >
                  <p className="text-sm font-black text-[#6f8d23] opacity-80">{step.label}</p>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-[#111412]">{step.title}</h3>
                  <p className="mt-4 leading-relaxed text-[#4d5549]">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="preview" className="relative mx-auto max-w-7xl px-5 py-32 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <SectionLabel>Product preview</SectionLabel>
              <h2 className="text-4xl font-bold tracking-tight text-[#111412] sm:text-5xl">Engineered for speed.</h2>
              <p className="mt-4 text-lg leading-relaxed text-[#4d5549]">
               Our architecture ensures that data flows seamlessly between your roster and your operational ground truth.
              </p>
            </div>
            <div className="rounded-full border border-[#111412]/10 bg-white/55 px-6 py-3 text-sm font-medium text-[#4d5549] shadow-sm backdrop-blur-sm">
              System Latency: <span className="font-bold text-[#111412]">124ms</span>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-[#b7d957]/20 to-transparent blur-2xl opacity-50" />
            <div className="relative rounded-2xl border border-[#111412]/10 bg-white/55 p-2 shadow-xl shadow-black/5 backdrop-blur-sm">
               <div className="aspect-video rounded-xl border border-[#111412]/10 bg-[#111412] flex items-center justify-center text-white/45 font-medium">
                  <div className="flex flex-col items-center gap-4">
                     <Sparkles className="h-12 w-12 text-[#b7d957]/70 animate-pulse" />
                     <p>Product demonstration video placeholder</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </AnimatedSection>

        <section className="relative px-5 pb-32 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#111412]/10 bg-[#111412] px-8 py-16 text-white shadow-2xl shadow-black/15 sm:px-16">
            <div className="relative z-10 flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Launch a faster live experience today.</h2>
                <p className="mt-6 text-lg leading-relaxed text-white/65">
                  Give your teams one reliable place to understand exactly what is happening, when it happens.
                </p>
              </div>
              <Button asChild size="lg" className="mt-10 rounded-full bg-[#b7d957] text-[#111412] hover:bg-[#c9eb6c] px-10 font-bold lg:mt-0 transition-transform hover:scale-105">
                <Link href="/launch">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
