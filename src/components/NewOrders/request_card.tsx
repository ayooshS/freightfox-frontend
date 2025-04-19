import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { MoreSelection } from "@/components/NewOrders/more_selection.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { PickupDropInfo } from "@/components/NewOrders/pickup_drop_info.tsx"

type RequestCardProps = {
    poNumber: string
    material: string
    productName: string
    quantity: string
    rate: string
    pickupAddress: string
    dropAddress: string
    onReject: () => void
    onConfirm: () => void
}

export default function RequestCard({
                                        poNumber,
                                        material,
                                        productName,
                                        quantity,
                                        rate,
                                        pickupAddress,
                                        dropAddress,
                                        onReject,
                                        onConfirm,
                                    }: RequestCardProps) {
    return (
        <Card className="rounded-xl-mobile bg-surface-primary p-4 space-y-3">
            {/* Header section */}
            <div className="flex flex-col">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
            <span className="font-overline-sm-mobile text-text-tertiary">
              PO / {poNumber}
            </span>
                        <Badge variant="default" text={material} />
                    </div>
                    <MoreSelection onReject={onReject} poNumber={poNumber} dropAddress={dropAddress} />
                </div>

                <Separator
                    orientation="horizontal"
                    className="w-full h-[1px] bg-border-primary"
                />
            </div>

            {/* Title + Quantity */}
            <div className="flex justify-between items-center">
                <p className="font-body-lg-mobile text-text-primary w-[45%] line-clamp-2 break-words">
                    {productName}
                </p>
                <div className="text-right">
                    <p className="font-body-lg-mobile text-text-primary">{quantity}MT</p>
                    <p className="font-caption-lg-mobile text-text-secondary pt-xs-mobile">
                        @ ₹{rate}/MT
                    </p>
                </div>
            </div>

            <PickupDropInfo pickupAddress={pickupAddress} dropAddress={dropAddress} />

            {/* CTA */}
            <Button variant="default" size="default" className="w-full mt-2" onClick={onConfirm}>
                Review & Confirm
            </Button>
        </Card>
    )
}
