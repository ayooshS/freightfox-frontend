---
title: Untitled doc (3)
---
<SwmSnippet path="/src/components/NewOrders/request_card.tsx" line="1">

---

&nbsp;

```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { MoreSelection } from "@/components/NewOrders/more_selection.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { PickupDropInfo } from "@/components/NewOrders/pickup_drop_info.tsx"

type RequestCardProps = {
    ship_order_id: string
    material: string
    product_sku: string
    order_qty: string
    booked_rate: string
    pickup_address: string
    delivery_address: string
    onReject: () => void
    onConfirm: () => void
}

export default function RequestCard({
                                        ship_order_id,
                                        material,
                                        product_sku,
                                        order_qty,
                                        booked_rate,
                                        pickup_address,
                                        delivery_address,
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
              Ship ID: {ship_order_id}
            </span>
                        <Badge variant="default" text={material} />
                    </div>
                    <MoreSelection onReject={onReject} ship_order_id={ship_order_id} delivery_address={delivery_address} />
                </div>

                <Separator
                    orientation="horizontal"
                    className="w-full h-[1px] bg-border-primary"
                />
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
            <Button variant="default" size="default" className="w-full mt-2" onClick={onConfirm}>
                Review & Confirm
            </Button>
        </Card>
    )
}
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZnJlaWdodGZveC1mcm9udGVuZCUzQSUzQWF5b29zaFM=" repo-name="freightfox-frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
