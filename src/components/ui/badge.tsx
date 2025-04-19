// components/ui/badge.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden transition-[color,box-shadow] [&>svg]:pointer-events-none",
    {
        variants: {
            variant: {
                default:
                    "border-none font-overline-sm-mobile bg-surface-secondary text-text-tertiary px-md-mobile py-xs-mobile",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground",
                destructive:
                    "border-transparent bg-destructive text-white",
                outline:
                    "text-foreground border",
                custom: "border-none px-lg-mobile py-xs-mobile rounded-full", // Will be styled manually
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

type BadgeProps = React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    text?: string
    bgColor?: string
    icon?: React.ReactNode
}

function Badge({
                   className,
                   variant,
                   asChild = false,
                   text,
                   bgColor,
                   icon,
                   ...props
               }: BadgeProps) {
    const Comp = asChild ? Slot : "span"

    const classes = cn(
        badgeVariants({ variant }),
        variant === "custom" && bgColor,
        className
    )

    return (
        <Comp
            data-slot="badge"
            className={classes}
            {...props}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {text}
        </Comp>
    )
}

export { Badge, badgeVariants }
