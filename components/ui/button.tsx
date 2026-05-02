"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const buttonVariants = {
  default: "bg-slate-950 text-white hover:bg-slate-800",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
  destructive: "bg-red-600 text-white hover:bg-red-500",
  ghost: "text-slate-700 hover:bg-slate-100",
};

const sizes = {
  default: "h-11 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-12 px-5 text-base",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof sizes;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          buttonVariants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
