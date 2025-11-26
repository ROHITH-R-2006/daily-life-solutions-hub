"use client"

import * as React from "react"
import * as OTPInput from "input-otp"

import { cn } from "@/lib/utils"

const REGEXP_ONLY_DIGITS_AND_CHARS =
  "^[a-zA-Z0-9]+$"

function InputOTP({
  className,
  containerClassName,
  ...props
}) {
  return (
    <OTPInput.OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}) {
  const inputOTPContext = React.useContext(
    OTPInput.OTPInputContext
  )
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      data-slot="input-otp-slot"
      data-state={isActive ? "cursor" : "inactive"}
      data-has-fake-caret={hasFakeCaret}
      className={cn(
        "border-input relative inline-flex size-9 items-center justify-center border-y border-r border-l first:rounded-l-md first:border-l last:rounded-r-md bg-background text-sm font-medium shadow-sm transition-all data-[state=cursor]:border-ring data-[state=cursor]:ring-1 data-[state=cursor]:ring-ring data-[has-fake-caret=true]:text-transparent data-[has-fake-caret=true]:before:pointer-events-none data-[has-fake-caret=true]:before:absolute data-[has-fake-caret=true]:before:left-1/2 data-[has-fake-caret=true]:before:top-1/2 data-[has-fake-caret=true]:before:h-4 data-[has-fake-caret=true]:before:w-px data-[has-fake-caret=true]:before:-translate-x-1/2 data-[has-fake-caret=true]:before:-translate-y-1/2 data-[has-fake-caret=true]:before:bg-foreground data-[has-fake-caret=true]:before:animate-pulse",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret h-4 w-px bg-foreground" />
        </div>
      )}
    </div>
  )
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS_AND_CHARS,
}
