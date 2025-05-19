import { useEffect, useState } from "react"
import MyOrderCard from "@/components/MyOrders/my_order_card.tsx"
import { getAcceptedOrders } from "@/lib/api.ts"
import { motion } from "framer-motion"

import { LoadingDots } from "@/components/LoadingDots.tsx"
import { MyOrderCardSkeleton } from "@/components/MyOrders/skeleton_my_order_card.tsx"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button.tsx"
import { Add24Regular } from "@fluentui/react-icons"

type MyOrder = {
    ship_order_id: string
    total_placed_capacity: number
    transporter_id: string
    status: string
    order_qty: number
    unit_of_measurement: string
    pickup_address: string
    delivery_address: string
    booked_rate: number
    product_sku: string
    product_description: string
    dispatch_plan: {
        reporting_date: string
        vehicle_capacity: number
    }[]
}

export function MyOrdersPage() {
    const [searchParams] = useSearchParams()
    const transporter_id = searchParams.get("transporter_id") ?? "T100"
    const [orderlist, setOrderlist] = useState<MyOrder[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setIsError(false)

            const { data, error } = await getAcceptedOrders(transporter_id)

            if (data !== null) {
                setOrderlist(data.orders)
            } else {
                console.error(error)
                setIsError(true)
            }
            setIsLoading(false)
        }

        fetchData()
    }, [])

    return (
        <main>
            <div className="flex flex-col gap-5">
                <div>
					<span className="font-body-lg-mobile font-bold text-text-primary">
						{isLoading ? <LoadingDots /> : orderlist.length}
					</span>
                    <span className="font-body-lg-mobile text-text-secondary"> Order/s </span>
                </div>

                {/* Loading skeletons */}
                {isLoading &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <MyOrderCardSkeleton key={i} />
                    ))}

                {/* ❌ Error state */}
                {!isLoading && isError && (
                    <div className="flex flex-1 flex-col justify-center items-center text-center px-6 gap-4 min-h-[calc(80dvh_-_120px)]">
                        <img src="/myOrderNull.svg" alt="Error" className="w-3/5 max-w-[240px]" />
                        <p className="font-body-base-mobile text-text-secondary">
                            Something went wrong. Try refreshing or creating a new order.
                        </p>
                        <Button
                            size="lg"
                            variant="default"
                            onClick={() =>
                                window.location.href = `/New-orders?transporter_id=${transporter_id}`
                            }
                            className="w-full"
                        >
                            <Add24Regular />
                            Create your first order
                        </Button>
                    </div>
                )}

                {/* 🚫 Empty state */}
                {!isLoading && !isError && orderlist.length === 0 && (
                    <div className="flex flex-1 flex-col justify-center items-center text-center px-6 gap-4 min-h-[calc(80dvh_-_120px)]">
                        <img src="/myOrderNull.svg" alt="No orders" className="w-3/5 max-w-[240px]" />
                        <p className="font-body-base-mobile text-text-secondary">
                            Place your first ship order from here!
                        </p>
                        <Button
                            size="lg"
                            variant="default"
                            onClick={() =>
                                window.location.href = `/New-orders?transporter_id=${transporter_id}`
                            }
                            className="w-full"
                        >
                            <Add24Regular />
                            Create your first order
                        </Button>
                    </div>
                )}

                {/* ✅ Populated state */}
                {!isLoading && !isError &&
                    orderlist.map((order, index) => (
                        <motion.div
                            key={order.ship_order_id}
                            initial={{ opacity: 0, y: 36 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: index * 0.08 }}
                        >
                            <MyOrderCard key={order.ship_order_id} {...order} />
                        </motion.div>
                    ))}
            </div>
        </main>
    )
}
