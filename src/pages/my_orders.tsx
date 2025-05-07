import { useEffect, useState } from "react"
import MyOrderCard from "@/components/MyOrders/my_order_card.tsx"
import { getAcceptedOrders } from "@/lib/api.ts"
import { motion } from "framer-motion"

import { LoadingDots } from "@/components/LoadingDots.tsx"
import {MyOrderCardSkeleton} from "@/components/MyOrders/skeleton_my_order_card.tsx";

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
    const [orderlist, setOrderlist] = useState<MyOrder[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const { data, error } = await getAcceptedOrders()
            if (data !== null) {
                setOrderlist(data.orders)
            } else {
                console.error(error)
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

                {isLoading &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <MyOrderCardSkeleton key={i} />
                    ))}

                {!isLoading &&
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
