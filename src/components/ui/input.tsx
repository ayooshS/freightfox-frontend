import * as React from "react"
import {cn} from "@/lib/utils"

type NativeInputProps = Omit<React.ComponentProps<"input">, "size">

type InputProps = NativeInputProps & {
    size?: "sm" | "default" | "lg"
    variant?: "outline" | "filled"
    error?: boolean
    errorMessage?: string
}

function Input({
                   className,
                   type = "text",
                   size = "default",
                   variant = "outline",
                   error = false,
                   errorMessage,
                   ...props
               }: InputProps) {
    return (
        <div className="w-full flex flex-col gap-1">
            <input
                type={type}
                aria-invalid={error}
                aria-describedby={error ? "input-error-text" : undefined}
                data-size={size}
                data-variant={variant}
                data-slot="input"
                className={cn(
                    "file:text-foreground placeholder:text-text-tertiary font-body-base-mobile selection:bg-primary selection:text-primary-foreground transition-[color,box-shadow] outline-none",
                    "dark:bg-input/30 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

                    // Size variants
                    {
                        "h-8 text-sm px-2 py-1": size === "sm",
                        "h-9 text-base px-3 py-1.5": size === "default",
                        "h-14 px-4 py-3": size === "lg",
                    },

                    {
                        "border border-[var(--color-border-primary)] text-text-primary bg-surface-primary hover:border-[var(--color-border-action-hover)] focus:outline-none focus:border-[#0486FF] focus:ring-[1px] focus:ring-[#0486FF]":
                            variant === "outline",

                        "border border-[var(--color-border-secondary)] text-text-primary bg-surface-secondary hover:border-[var(--color-border-action-hover)] focus:outline-none focus:border-[var(--color-border-action-press)] focus:ring-[3px] focus:ring-[color:var(--color-border-action-press)]":
                            variant === "filled",
                    },

                    // Error override
                    error && "border-[var(--color-border-error)] text-text-error",

                    // Common
                    "rounded-md w-full",
                    className
                )}
                {...props}
            />

            {error && errorMessage && (
                <p
                    id="input-error-text"
                    className="text-caption-sm-mobile text-text-error mt-xs-mobile pl-1"
                >
                    {errorMessage}
                </p>
            )}
        </div>
    )
}

export {Input}
