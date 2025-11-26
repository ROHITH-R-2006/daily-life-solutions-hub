"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { useFormContext, Controller } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const FieldContext = React.createContext({})

function Field({ name, ...props }) {
  return (
    <Controller
      name={name}
      {...props}
      render={({ field, fieldState, formState }) => (
        <FieldContext.Provider value={{ name }}>
          {props.render({ field, fieldState, formState })}
        </FieldContext.Provider>
      )}
    />
  )
}

function useField() {
  const fieldContext = React.useContext(FieldContext)
  const itemContext = React.useContext(FieldItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useField should be used within <Field>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const FieldItemContext = React.createContext({})

function FieldItem({ className, ...props }) {
  const id = React.useId()

  return (
    <FieldItemContext.Provider value={{ id }}>
      <div
        data-slot="field-item"
        className={cn("space-y-2", className)}
        {...props}
      />
    </FieldItemContext.Provider>
  )
}

function FieldLabel({ className, ...props }) {
  const { error, formItemId } = useField()

  return (
    <Label
      data-slot="field-label"
      htmlFor={formItemId}
      className={cn(error && "text-destructive", className)}
      {...props}
    />
  )
}

function FieldControl({ ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useField()

  return (
    <Slot
      data-slot="field-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }) {
  const { formDescriptionId } = useField()

  return (
    <p
      data-slot="field-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FieldMessage({ children, className, ...props }) {
  const { error, formMessageId } = useField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="field-message"
      id={formMessageId}
      className={cn("text-destructive text-sm font-medium", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useField,
  Field,
  FieldItem,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldMessage,
}
