"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";

export function Progress({ value }: { value: number }) {
  return (
    <ProgressPrimitive.Root className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200" value={value}>
      <ProgressPrimitive.Indicator
        className="h-full rounded-full bg-cyan-500 transition-transform"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
