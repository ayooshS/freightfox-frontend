import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { PickupDropInfo } from "@/components/NewOrders/pickup_drop_info.tsx"
import { MoreSelection } from "@/components/NewOrders/more_selection.tsx"
import RequestDetailDrawer from "@/components/NewOrders/Drawer/request_order_drawer.tsx"
import { rejectOrder } from "@/lib/api.ts"
import { cn } from "@/lib/utils"

type DispatchEntry = {
    vehicle: number
    size: number
    eta: string
}

type RequestCardProps = {
    ship_order_id: string
    transporter_id: string
    status: string
    order_qty: number
    unit_of_measurement: string
    pickup_address: string
    delivery_address: string
    booked_rate: number
    product_sku: string
    product_description: string
    dispatch_plan: DispatchEntry[]
    buyer_name: string
    refetch: () => void
    showPing?: boolean
}

export default function RequestCard({
                                        buyer_name,
                                        ship_order_id,
                                        product_sku,
                                        order_qty,
                                        booked_rate,
                                        pickup_address,
                                        delivery_address,
                                        product_description,
                                        dispatch_plan,
                                        transporter_id,
                                        refetch,
                                        showPing,
                                    }: RequestCardProps) {
    const [rejecterror, setRejecterror] = useState<string | null>(null)
    const [rejectStatus, setRejectStatus] = useState("")
    const [isDismissed, setIsDismissed] = useState(false)

    async function onReject() {
        const { data, error } = await rejectOrder(ship_order_id, transporter_id)
        if (data === "success") {
            setIsDismissed(true)
            setTimeout(() => {
                setRejectStatus(data)
                refetch()
            }, 300)
        } else {
            setRejecterror(error)
        }
    }

    return (
        <Card
            className={cn(
                "rounded-xl-mobile bg-surface-primary p-4 space-y-3 transition-all duration-300 ease-in-out",
                isDismissed && "opacity-0 -translate-y-2 pointer-events-none"
            )}
        >
            {/* Header section */}
            <div className="flex flex-col">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2 relative">
                        {showPing && (
                            <span className="absolute -left-6 -top-5 flex h-4 w-4">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
							</span>
                        )}
                        <span className="font-overline-sm-mobile text-text-tertiary">
							Ship ID: {ship_order_id}
						</span>
                        <Badge variant="default" text="Aluminium" />
                    </div>
                    <MoreSelection
                        onReject={onReject}
                        ship_order_id={ship_order_id}
                        delivery_address={delivery_address}
                        rejecterror={rejecterror}
                        rejectStatus={rejectStatus}
                        setRejectStatus={setRejectStatus}
                        setRejecterror={setRejecterror}
                    />
                </div>

                <Separator orientation="horizontal" className="w-full h-[1px] bg-border-primary" />
            </div>

            {/* Title + Quantity */}
            <div className="flex justify-between items-center">
                <p className="font-body-lg-mobile text-text-primary w-[45%] line-clamp-2 break-words">
                    {product_sku}
                </p>
                <div className="text-right">
                    <p className="font-body-lg-mobile text-text-primary">{order_qty}MT</p>
                    <p className="font-caption-lg-mobile text-text-secondary pt-xs-mobile">
                        @ ₹{booked_rate}/MT
                    </p>
                </div>
            </div>

            <PickupDropInfo pickup_address={pickup_address} delivery_address={delivery_address} />

            {/* CTA */}
            <RequestDetailDrawer
                buyer_name={buyer_name}
                ship_order_id={ship_order_id}
                product_sku={product_sku}
                product_description={product_description}
                order_qty={order_qty}
                pickup_address={pickup_address}
                delivery_address={delivery_address}
                booked_rate={booked_rate}
                dispatch_plan={dispatch_plan}
                transporter_id={transporter_id}
                triggerButton={
                    <Button variant="default" size="default" className="w-full mt-2">
                        Review & Confirm
                    </Button>
                }
            />
        </Card>
    )
}
