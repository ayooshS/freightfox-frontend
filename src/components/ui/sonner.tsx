import { toast, Toaster as SonnerToaster, type ToasterProps } from "sonner"
import { useTheme } from "next-themes"
import {
    CheckmarkCircle20Filled,
    ErrorCircle20Filled,
    Info20Filled,
    Warning20Filled,
    Dismiss16Regular,
} from "@fluentui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { JSX } from "react"

type ToastType = "success" | "error" | "info" | "warning"

const iconMap: Record<ToastType, JSX.Element> = {
    success: <CheckmarkCircle20Filled className="text-icon-success" />,
    error: <ErrorCircle20Filled className="text-icon-error" />,
    info: <Info20Filled className="text-icon-information" />,
    warning: <Warning20Filled className="text-icon-warning" />,
}

const bgMap: Record<ToastType, string> = {
    success: "bg-[var(--color-surface-success)]",
    error: "bg-[var(--color-surface-error)]",
    info: "bg-[var(--color-surface-information)]",
    warning: "bg-[var(--color-surface-warning)]",
}

const borderMap: Record<ToastType, string> = {
    success: "border-[var(--color-border-success)]",
    error: "border-[var(--color-border-error)]",
    info: "border-[var(--color-border-information)]",
    warning: "border-[var(--color-border-warning)]",
}

// ✅ The toaster UI that must be rendered in AppShell
export const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <SonnerToaster
            theme={theme as "light" | "dark" | "system"}
            toastOptions={{
                className: "w-full max-w-[480px]", // ✅ full width, constrained to 480px
            }}
            className="[&>div]:!left-1/2 [&>div]:!translate-x-[-50%] [&>div]:!right-auto"
            style={
                {
                    "--toast-radius": "var(--radius-xl-mobile)",
                    "--toast-shadow": "var(--shadow-customCard)",
                } as React.CSSProperties
            }
            {...props}
        />
    )
}

// ✅ The toast logic to show a styled toast
export function showToast({
                              type,
                              title,
                              description,
                          }: {
    type: ToastType
    title: string
    description?: string
}) {
    toast.custom((t) => (
        <div
            className={cn(
                "relative flex gap-3 items-start p-4 w-full border rounded-xl-mobile",
                bgMap[type],
                borderMap[type]
            )}
            style={{
                boxShadow: "var(--shadow-customCard)",
            }}
        >
            <div className="mt-1 shrink-0">{iconMap[type]}</div>

            <div className="flex flex-col pr-6">
                <p className="font-body-base-mobile text-text-primary">{title}</p>
                {description && (
                    <p className="font-caption-sm-mobile text-text-secondary mt-xs-mobile">
                        {description}
                    </p>
                )}
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 text-text-primary hover:text-icon-primary"
                onClick={() => toast.dismiss(t)}
            >
                <Dismiss16Regular style={{ width: 16, height: 16 }} />
            </Button>
        </div>
    ))
}
