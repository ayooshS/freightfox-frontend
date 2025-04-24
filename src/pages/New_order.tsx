import { useEffect, useState } from "react"
import RequestCard from "@/components/NewOrders/request_card"
import {SkeletonRequestCard} from "@/components/NewOrders/skeleton_request_card.tsx";
// import { fetchOrders } from "@/lib/api" ← when backend is ready

type DispatchEntry = {
    vehicle: number
    size: number
    eta: string
}

type Order = {
    poNumber: string
    material: string
    productName: string
    quantity: string
    rate: string
    pickupAddress: string
    dropAddress: string
    buyerName: string
    dispatchData: DispatchEntry[]
}

export function NewOrderPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Simulated backend call
        setTimeout(() => {
            try {
                const data: Order[] = [
                    {
                        poNumber: "828392",
                        material: "Aluminium",
                        productName: "Billets CH10, Wire Rod Coil, Sow ingot",
                        quantity: "20",
                        rate: "3500.83",
                        pickupAddress: "NALCO, Damanjodi, Odisha, 763008",
                        dropAddress: "Acme Pvt. Ltd, Loha Bazar, Hirapur Colony, Raipur, Chhattisgarh 492099",
                        buyerName: "Acme Pvt Ltd",
                        dispatchData: [
                            { vehicle: 1, size: 20, eta: "4/05/25" },
                            { vehicle: 2, size: 20, eta: "6/05/25" },
                        ],
                    },
                    {
                        poNumber: "924781",
                        material: "Steel",
                        productName: "Slab MS Prime, Round Bar",
                        quantity: "35",
                        rate: "4200.93",
                        pickupAddress: "JSW Steel Plant, Bellary, Karnataka",
                        dropAddress: "Metro Infra, Andheri East, Mumbai, Maharashtra",
                        buyerName: "Metro Infra",
                        dispatchData: [
                            { vehicle: 1, size: 15, eta: "3/05/25" },
                            { vehicle: 2, size: 20, eta: "5/05/25" },
                        ],
                    },
                    {
                        poNumber: "781294",
                        material: "Copper",
                        productName: "Copper Wire, Cathode Sheets",
                        quantity: "10",
                        rate: "7200.36",
                        pickupAddress: "Hindustan Copper Ltd, Jharkhand",
                        dropAddress: "Electro Tech, Bidhannagar , Kolkata, West Bengal",
                        buyerName: "Electro Tech",
                        dispatchData: [
                            { vehicle: 1, size: 10, eta: "2/05/25" },
                        ],
                    },
                ]

                setOrders(data)
                setLoading(false)
            } catch (err) {
                console.error("Error fetching orders:", err)
                setError("Failed to load orders.")
                setLoading(false)
            }
        }, 1500)
    }, [])

    function LoadingDots() {
        return (
            <span className="inline-flex gap-1 ml-1">
      <span className="w-1 h-1 bg-text-tertiary rounded-full animate-bounce [animation-delay:0s]" />
      <span className="w-1 h-1 bg-text-tertiary rounded-full animate-bounce [animation-delay:0.2s]" />
      <span className="w-1 h-1 bg-text-tertiary rounded-full animate-bounce [animation-delay:0.4s]" />
    </span>
        )
    }

    return (
        <main>
            <div className="flex flex-col gap-5">
                <div>
                    <span className="font-body-lg-mobile font-bold text-text-primary">
                    {loading ? <LoadingDots /> : orders.length}
                     </span>
                    <span className="font-body-lg-mobile text-text-secondary"> New Orders</span>
                </div>

                {loading &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonRequestCard key={i} />
                    ))
                }

                {!loading && !error && orders.map((order) => (
                    <RequestCard
                        key={order.poNumber}
                        {...order}
                        onReject={() => console.log(`Rejected order PO/${order.poNumber}`)}
                        onConfirm={() => console.log(`Confirmed order PO/${order.poNumber}`)}
                    />
                ))}

                {error && (
                    <p className="text-red-500 font-caption-lg-mobile text-center mt-4">
                        {error}
                    </p>
                )}
            </div>
        </main>
    )
}
