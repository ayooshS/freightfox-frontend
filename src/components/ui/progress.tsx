import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
                    className,
                    value = 0,
                    max = 100,
                    ...props
                  }: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number
  max?: number
}) {
  const percentage = Math.min((value / max) * 100, 100)
  const isOverflow = value > max

  return (
      <ProgressPrimitive.Root
          data-slot="progress"
          className={cn(
              "bg-surface-action-press/10 relative h-2 w-full overflow-hidden rounded-full",
              className
          )}
          {...props}
      >
        <ProgressPrimitive.Indicator
            data-slot="progress-indicator"
            className={cn(
                "h-full w-full flex-1 transition-all",
                isOverflow ? "bg-icon-error" : "bg-icon-on-action-press"
            )}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
  )
}



export { Progress }
