"use client"

import * as React from "react"
import * as SpinnerPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Spinner({
  className,
  ...props
}) {
  return (
    <div
      data-slot="spinner"
      role="progressbar"
      aria-busy="true"
      aria-label="Loading"
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
