"use client"

import * as React from "react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const PanelGroup = ResizablePrimitive.PanelGroup

function Panel({ className, ...props }) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      className={cn("", className)}
      {...props}
    />
  )
}

const Handle = React.forwardRef(
  ({ className, withHandle, ...props }, ref) => (
    <ResizablePrimitive.PanelResizeHandle
      ref={ref}
      data-slot="resizable-handle"
      className={cn(
        "focus-visible:ring-ring group relative flex w-px select-none touch-none bg-border after:absolute after:top-1/2 after:left-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:-translate-x-1/2 after:rounded-full after:bg-border hover:after:bg-border after:transition-colors focus-visible:outline-hidden focus-visible:ring-1",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-40 flex h-4 w-1 items-center justify-center rounded-sm bg-border">
          <div className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
)
Handle.displayName = "Handle"

export { PanelGroup, Panel, Handle }
