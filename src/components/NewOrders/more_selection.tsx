import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
    Dismiss24Regular,
    MoreHorizontal24Regular,
} from "@fluentui/react-icons"
import { showToast } from "@/components/ui/sonner"

type MoreSelectionProps = {
    onReject: () => void
    poNumber: string
    dropAddress: string
}

export function MoreSelection({ onReject, poNumber, dropAddress }: MoreSelectionProps) {
    const [open, setOpen] = useState(false)

    const handleReject = () => {
        const companyName = dropAddress.split(",")[0]?.trim()

        onReject()
        setOpen(false)

        showToast({
            type: "info",
            title: `Order of "${companyName}" rejected!`,
            description: `"${poNumber}" has been removed from your list.`,
        })
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-md-mobile text-text-tertiary">
                    <MoreHorizontal24Regular style={{ width: 20, height: 20 }} />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="bg-surface-error w-auto" align="end" side="bottom">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-text-error flex gap-2 items-center font-caption-lg-mobile hover:bg-[#ffe5e5]"
                    onClick={handleReject}
                >
                    <Dismiss24Regular style={{ width: 16, height: 16 }} />
                    Reject Order
                </Button>
            </PopoverContent>
        </Popover>
    )
}
