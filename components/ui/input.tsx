import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
        className,
      )}
      {...props}
    />
  );
}
