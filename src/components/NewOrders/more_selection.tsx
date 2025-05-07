import { useEffect, useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Dismiss24Regular, MoreHorizontal24Regular } from "@fluentui/react-icons"
import { showToast } from "@/components/ui/sonner"

type MoreSelectionProps = {
    onReject: () => void
    ship_order_id: string
    delivery_address: string
    rejecterror: string | null
    rejectStatus: string | null
    setRejectStatus: (status: string) => void
    setRejecterror: (error: string | null) => void
}

export function MoreSelection({
                                  onReject,
                                  ship_order_id,
                                  delivery_address,
                                  rejecterror,
                                  rejectStatus,
                                  setRejectStatus,
                                  setRejecterror,
                              }: MoreSelectionProps) {
    const [open, setOpen] = useState(false)
    const companyName = delivery_address.split(",")[0]?.trim()

    const handleRejectClick = () => {
        onReject()
        setOpen(false)
    }

    useEffect(() => {
        if (rejecterror) {
            showToast({
                type: "error",
                title: `Order of "${companyName}" rejected!`,
                description: `Error removing order`,
            })
            setRejecterror(null)
        } else if (rejectStatus === "success") {
            showToast({
                type: "info",
                title: `Order of "${companyName}" rejected!`,
                description: `"${ship_order_id}" has been removed from your list.`,
            })
            setRejectStatus("")
        }
    }, [rejecterror, rejectStatus, companyName, ship_order_id, setRejecterror, setRejectStatus])

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
                    onClick={handleRejectClick}
                >
                    <Dismiss24Regular style={{ width: 16, height: 16 }} />
                    Reject Order
                </Button>
            </PopoverContent>
        </Popover>
    )
}
