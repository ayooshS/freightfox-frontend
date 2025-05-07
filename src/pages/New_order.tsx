// src/pages/NewOrderPage.tsx
import { useQuery } from '@tanstack/react-query'
import { fetchOrders } from '@/lib/api.ts'
import RequestCard from '@/components/NewOrders/request_card'
import { SkeletonRequestCard } from '@/components/NewOrders/skeleton_request_card.tsx'
import { LoadingDots } from '@/components/LoadingDots.tsx'
import { motion } from 'framer-motion'
import {useSearchParams} from "react-router-dom";

type DispatchEntry = {
    vehicle: number
    size: number
    eta: string
}

type Order = {
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
}



export function NewOrderPage() {
    const [searchParams] = useSearchParams()
    const transporterID: string  = searchParams.get("transporter_id")!
    const {
        data: orders = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['shipOrders',transporterID],
        queryFn:() => fetchOrders(transporterID),
    })

    return (
        <main>
            <div className="flex flex-col gap-5">
                <div>
                    <span className="font-body-lg-mobile font-bold text-text-primary">
                        {isLoading ? <LoadingDots /> : orders.length}
                    </span>
                    <span className="font-body-lg-mobile text-text-secondary"> New Orders</span>
                </div>

                {isLoading &&
                    Array.from({ length: 3 }).map((_, i) => <SkeletonRequestCard key={i} />)}

                {!isLoading &&
                    !isError &&
                    orders.map((order: Order, index: number) => (
                        <motion.div
                            key={order.ship_order_id}
                            initial={{ opacity: 0, y: 36 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: index * 0.08 }}
                        >
                        <RequestCard refetch={refetch} key={order.ship_order_id} {...order} />
                        </motion.div>

                    ))}

                {isError && (
                    <p className="text-red-500 font-caption-lg-mobile text-center mt-4">
                        {(error as Error).message}
                    </p>
                )}
            </div>
        </main>
    )
}

