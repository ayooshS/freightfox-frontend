import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function InputOTP({
                    className,
                    containerClassName,
                    ...props
                  }: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
      <OTPInput
          data-slot="input-otp"
          containerClassName={cn(
              "flex items-center has-disabled:opacity-50", // increased spacing
              containerClassName
          )}
          className={cn("disabled:cursor-not-allowed", className)}
          {...props}
      />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
      <div
          data-slot="input-otp-group"
          className={cn("flex items-center gap-4", className)} // increased spacing
          {...props}
      />
  )
}

function InputOTPSlot({
                        index,
                        className,
                        ...props
                      }: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
      <div
          data-slot="input-otp-slot"
          data-active={isActive}
          className={cn(
              // Base styling
              "relative flex items-center justify-center text-lg font-medium text-text-primary border-[1px] w-[60px] h-[60px] rounded-md transition-all outline-none ring-offset-background",

              // Default border
              "border-border-primary",

              // Focus styles (cursor in input slot)
              "data-[active=true]:border-border-action data-[active=true]:ring-[2px] data-[active=true]:ring-border-action",

              // Optional: hover effect
              "hover:border-[var(--color-action-hover)]",
              className
          )}
          {...props}
      >
        {char}
        {hasFakeCaret && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="animate-caret-blink bg-surface-action h-5 w-px" />
            </div>
        )}
      </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
      <div data-slot="input-otp-separator" role="separator" {...props}>
        <MinusIcon />
      </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
