"use client";

import * as LabelPrimitive from "@radix-ui/react-label";

export function Label(props: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className="text-sm font-medium text-slate-700" {...props} />;
}
