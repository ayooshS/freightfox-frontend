// components/ui/avatar.tsx
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  variant?: "image" | "text"
  fallbackText?: string
  bgColor?: string
  src?: string
}

function Avatar({
                  className,
                  variant = "image",
                  fallbackText,
                  bgColor = "bg-muted",
                  src,
                  ...props
                }: AvatarProps) {
  return (
      <AvatarPrimitive.Root
          data-slot="avatar"
          className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
          {...props}
      >
        {variant === "image" && src && (
            <AvatarPrimitive.Image
                src={src}
                className="aspect-square size-full object-cover"
            />
        )}
        {variant === "text" && (
            <AvatarPrimitive.Fallback
                className={cn(
                    "flex size-full items-center justify-center rounded-full text-white font-medium",
                    bgColor
                )}
            >
              {fallbackText}
            </AvatarPrimitive.Fallback>
        )}
      </AvatarPrimitive.Root>
  )
}

export { Avatar }
