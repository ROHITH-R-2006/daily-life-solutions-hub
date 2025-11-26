"use client"

import * as React from "react"
import * as InputGroupPrimitive from "@radix-ui/react-primitive"

import { cn } from "@/lib/utils"

function InputGroup({ className, ...props }) {
  return (
    <InputGroupPrimitive.Slot
      data-slot="input-group"
      className={cn("relative inline-flex w-full items-center", className)}
      {...props}
    />
  )
}

function InputGroupAddon({
  className,
  side = "left",
  ...props
}) {
  return (
    <div
      data-slot="input-group-addon"
      data-side={side}
      className={cn(
        "text-muted-foreground bg-muted/50 border-input flex h-9 items-center gap-1 border px-3 py-1 text-sm",
        "data-[side=left]:order-first data-[side=left]:rounded-l-md",
        "data-[side=right]:order-last data-[side=right]:rounded-r-md",
        className
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon }
