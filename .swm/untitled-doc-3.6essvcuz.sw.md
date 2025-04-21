---
title: RequestCard Component Overview
---
# Introduction

This document will walk you through the <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="20:6:6" line-data="export default function RequestCard({">`RequestCard`</SwmToken> component overview.

The <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="20:6:6" line-data="export default function RequestCard({">`RequestCard`</SwmToken> component is designed to handle the display and interaction of order requests within the application.

We will cover:

1. What properties are essential for the <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="20:6:6" line-data="export default function RequestCard({">`RequestCard`</SwmToken> component.
2. How the component interacts with user actions.
3. The significance of the <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="20:6:6" line-data="export default function RequestCard({">`RequestCard`</SwmToken> component in the application.

# Essential properties for <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="20:6:6" line-data="export default function RequestCard({">`RequestCard`</SwmToken>

<SwmSnippet path="/src/components/NewOrders/request_card.tsx" line="8">

---

The <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="20:6:6" line-data="export default function RequestCard({">`RequestCard`</SwmToken> component is defined with a set of properties that are crucial for representing an order request. These properties include identifiers like <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="9:1:1" line-data="    poNumber: string">`poNumber`</SwmToken>, details like <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="10:1:1" line-data="    material: string">`material`</SwmToken> and <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="11:1:1" line-data="    productName: string">`productName`</SwmToken>, and logistics information such as <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="14:1:1" line-data="    pickupAddress: string">`pickupAddress`</SwmToken> and <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="15:1:1" line-data="    dropAddress: string">`dropAddress`</SwmToken>. The properties ensure that all necessary information is encapsulated within the component for display and interaction purposes.

```
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
```

---

</SwmSnippet>

# User interaction handling

The component includes two functions, <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="16:1:1" line-data="    onReject: () =&gt; void">`onReject`</SwmToken> and <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="17:1:1" line-data="    onConfirm: () =&gt; void">`onConfirm`</SwmToken>, which are designed to handle user actions. These functions allow the component to respond to user decisions, either rejecting or confirming the order request. This interaction is vital for the component's role in processing order requests.

# Significance in the application

The <SwmToken path="/src/components/NewOrders/request_card.tsx" pos="20:6:6" line-data="export default function RequestCard({">`RequestCard`</SwmToken>

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
```

---

</SwmSnippet>

&nbsp;component plays a significant role in the application by providing a structured and interactive way to manage order requests. It encapsulates all necessary information and user actions, making it a central piece in the order management workflow.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZnJlaWdodGZveC1mcm9udGVuZCUzQSUzQWF5b29zaFM=" repo-name="freightfox-frontend"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
