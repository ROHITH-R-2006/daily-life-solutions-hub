"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Kbd({
  className,
  ...props
}) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "border-input bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100",
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
