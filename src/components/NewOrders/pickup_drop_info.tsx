import { Location24Regular } from "@fluentui/react-icons"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function PickupDropInfo({
                                   pickupAddress,
                                   dropAddress,
                               }: {
    pickupAddress: string
    dropAddress: string
}) {
    return (
        <div className="flex justify-between items-start relative px-1">
            {/* Pickup */}
            <div className="flex flex-col items-start gap-1 z-[10] w-[45%]">
                <Badge
                    variant="custom"
                    bgColor="bg-surface-information text-icon-information"
                    icon={<Location24Regular style={{ width: 16, height: 16 }} />}
                />
                <span className="font-overline-sm-mobile text-text-tertiary">Pickup</span>
                <p className="font-caption-lg-mobile text-left text-text-primary line-clamp-2 break-words">
                    {pickupAddress}
                </p>
            </div>

            {/* Dashed line */}
            <div className="absolute inset-x-0 top-[12px] px-13 z-[1]">
                <Separator
                    orientation="horizontal"
                    className="border-t border-dashed border-border-secondary h-[1px]"
                />
            </div>

            {/* Drop */}
            <div className="flex flex-col items-end gap-1 z-[10] w-[45%]">
                <Badge
                    variant="custom"
                    bgColor="bg-surface-success text-icon-success"
                    icon={<Location24Regular style={{ width: 16, height: 16 }} />}
                />
                <span className="font-overline-sm-mobile text-text-tertiary">Drop</span>
                <p className="font-caption-lg-mobile text-right text-text-primary line-clamp-2 break-words">
                    {dropAddress}
                </p>
            </div>
        </div>
    )
}
