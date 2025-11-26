"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

export { Label }
