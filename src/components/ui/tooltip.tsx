import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = ({
  delayDuration,
  children,
  ...props
}: {
  delayDuration?: number
  children: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>, "delay">) => (
  <TooltipPrimitive.Provider delay={delayDuration} {...props}>
    {children}
  </TooltipPrimitive.Provider>
)

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & {
    asChild?: boolean
    render?: React.ReactElement
  }
>(({ asChild, render, children, ...props }, ref) => {
  // Support both asChild (legacy) and render (Base UI) patterns
  const renderProp = render || (asChild && React.isValidElement(children) ? children as React.ReactElement : undefined)

  if (renderProp && asChild) {
    return (
      <TooltipPrimitive.Trigger ref={ref} render={renderProp} {...props} />
    )
  }

  return (
    <TooltipPrimitive.Trigger ref={ref} render={render} {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    sideOffset?: number
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    hidden?: boolean
  }
>(({ className, sideOffset = 4, side, align, hidden, ...props }, ref) => {
  if (hidden) return null

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner sideOffset={sideOffset} side={side} align={align}>
        <TooltipPrimitive.Popup
          ref={ref}
          className={cn(
            "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
