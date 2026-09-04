"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Preview", href: "#preview" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-3"
          : "py-5",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-5 transition-all duration-300 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8",
          isScrolled
            ? "rounded-none border-b border-[#111412]/10 bg-white/70 py-3 shadow-lg shadow-black/5 backdrop-blur-xl md:rounded-full md:border md:px-5"
            : "bg-transparent py-0",
        )}
      >
        <Link
          href="/"
          className="group inline-flex w-fit items-center gap-2.5"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl text-white shadow-lg transition duration-200 group-hover:-translate-y-0.5 group-hover:scale-105",
              isScrolled ? "bg-[#111412] shadow-black/15" : "bg-[#111412] shadow-black/15",
            )}
          >
            <Activity className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "text-lg font-black tracking-tight transition-colors",
              isScrolled ? "text-black" : "text-[#111412]",
            )}
          >
            CrewRostering
          </span>
        </Link>

        <nav
          className={cn(
            "hidden items-center justify-center gap-1 rounded-full border px-1.5 py-1.5 md:flex",
            isScrolled
              ? "border-white/10 bg-white/[0.04]"
              : "border-[#111412]/10 bg-white/55 shadow-sm backdrop-blur-md",
          )}
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold transition duration-200 hover:-translate-y-0.5",
                isScrolled
                  ? "text-[#4d5549] hover:bg-white hover:text-[#111412]"
                  : "text-[#4d5549] hover:bg-white hover:text-[#111412]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden justify-end md:flex">
          <Button
            asChild
            size="sm"
            className={cn(
              "group h-10 rounded-full px-5 font-black shadow-xl transition duration-200 hover:-translate-y-0.5 active:translate-y-0",
              isScrolled
                ? "bg-white text-[#111412] shadow-black/20 hover:bg-slate-100"
                : "bg-[#111412] text-white shadow-black/15 hover:bg-[#263026]",
            )}
          >
            <Link href="/launch">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <button
          className={cn(
            "inline-grid h-10 w-10 place-items-center rounded-full border transition md:hidden",
            isScrolled
              ? "border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
              : "border-[#111412]/10 bg-white/60 text-[#111412] hover:bg-white",
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "col-span-2 overflow-hidden rounded-3xl border shadow-2xl md:hidden",
              isScrolled
                ? "border-white/10 bg-[#030712] shadow-black/30"
                : "border-[#111412]/10 bg-white/95 shadow-black/10 backdrop-blur-xl",
            )}
          >
            <div className="flex flex-col gap-2 p-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-base font-bold transition",
                    isScrolled
                      ? "text-slate-300 hover:bg-white/10 hover:text-white"
                      : "text-[#4d5549] hover:bg-[#f5f2ea] hover:text-[#111412]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                asChild
                className={cn(
                  "mt-2 h-12 w-full rounded-full text-base font-black",
                  isScrolled
                    ? "bg-white text-[#111412] hover:bg-slate-100"
                    : "bg-[#111412] text-white hover:bg-[#263026]",
                )}
              >
                <Link href="/launch" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
