"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Item({
  className,
  ...props
}) {
  return (
    <div
      data-slot="item"
      className={cn(
        "rounded-md border p-4",
        className
      )}
      {...props}
    />
  )
}

export { Item }
