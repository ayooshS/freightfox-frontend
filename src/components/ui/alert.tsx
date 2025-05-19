import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Info24Filled, Warning24Filled } from "@fluentui/react-icons"

import { cn } from "@/lib/utils"

const alertVariants = cva(
    "relative w-full rounded-lg  px-6 py-6 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    {
        variants: {
            variant: {
                default: "bg-card text-card-foreground",
                destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
                error: "bg-surface-error text-text-primary [&>svg]:text-text-error",
                warning: "bg-yellow-50 text-yellow-800 border-yellow-200 [&>svg]:text-text-warning"
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Alert({
                   className,
                   variant,
                   children,
                   ...props
               }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    const icon =
        variant === "error" ? <Info24Filled className="" /> :
            variant === "warning" ? <Warning24Filled  /> :
                null

    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        >
            {icon}
            {children}
        </div>
    )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cn("col-start-2 line-clamp-1 min-h-4 text-text-primary font-body-lg-mobile tracking-tight mb-3", className)}
            {...props}
        />
    )
}

function AlertDescription({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn("text-text-secondary font-body-base-mobile col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)}
            {...props}
        />
    )
}

export { Alert, AlertTitle, AlertDescription }
