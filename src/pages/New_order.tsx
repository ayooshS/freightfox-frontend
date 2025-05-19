// src/pages/NewOrderPage.tsx
import { useQuery } from '@tanstack/react-query'
import { fetchOrders } from '@/lib/api.ts'
import RequestCard from '@/components/NewOrders/request_card'
import { SkeletonRequestCard } from '@/components/NewOrders/skeleton_request_card.tsx'
import { LoadingDots } from '@/components/LoadingDots.tsx'
import { motion } from 'framer-motion'
import {useSearchParams} from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useHeaderAction } from "@/HeaderActionContext"
import { CreateShipOrder } from "./CreateShipOrder" // adjust path if needed
import {Add16Regular} from "@fluentui/react-icons"


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
    const transporterID: string = searchParams.get("transporter_id")!
    const [recentSO, setRecentSO] = useState<{ id: string; createdAt: number } | null>(null)


    const {
        data: orders = [],
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ['shipOrders', transporterID],
        queryFn: () => fetchOrders(transporterID),
    })

    const [open, setOpen] = useState(false)
    const { setAction } = useHeaderAction()

    useEffect(() => {
        // Inject button into the header
        setAction(
            <Button size="default" variant="outline" onClick={() => setOpen(true)}>
                <Add16Regular/>
                Ship Order
            </Button>
        )
        return () => setAction(null) // clean up when component unmounts
    }, [setAction])

    useEffect(() => {
        const raw = localStorage.getItem("recentlyCreatedSO")
        if (raw) {
            try {
                const parsed = JSON.parse(raw)
                // valid for 2 minutes
                if (Date.now() - parsed.createdAt <= 2 * 60 * 1000) {
                    setRecentSO(parsed)
                } else {
                    localStorage.removeItem("recentlyCreatedSO")
                }
            } catch {
                localStorage.removeItem("recentlyCreatedSO")
            }
        }
    }, [])




    return (

        <>
            <main>
                <div className="flex flex-col gap-5">
                    <div>
                        <span className="font-body-lg-mobile font-bold text-text-primary">
                            {isLoading ? <LoadingDots /> : orders.length}
                        </span>
                        <span className="font-body-lg-mobile text-text-secondary"> New Orders</span>
                    </div>

                    {isLoading &&
                        Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonRequestCard key={i} />
                        ))}

                    {!isLoading && !isError && orders.length === 0 && (
                        <div className="flex flex-1 flex-col justify-center items-center text-center px-6 gap-4 min-h-[calc(80dvh_-_120px)]">
                            <img src="/NewOrderNull.svg" alt="No orders" className="w-3/5 max-w-[240px]" />
                            <p className="font-body-base-mobile text-text-secondary">
                                No ship orders available. Start by creating one!
                            </p>
                            <Button onClick={() => setOpen(true)} variant="default" size="lg" className="w-full">
                                Create Ship Order
                            </Button>
                        </div>
                    )}


                    {!isLoading && !isError &&
                        [...orders]
                            .sort((a, b) => parseInt(b.ship_order_id.split("/").pop()!) - parseInt(a.ship_order_id.split("/").pop()!))
                            .map((order: Order, index: number) => (
                                <motion.div
                                    key={order.ship_order_id}
                                    initial={{ opacity: 0, y: 36 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: index * 0.08 }}
                                >
                                    <RequestCard
                                        key={order.ship_order_id}
                                        refetch={refetch}
                                        showPing={recentSO?.id === order.ship_order_id}
                                        {...order}
                                    />

                                </motion.div>
                            ))
                    }


                    {isError && (
                        <div className="flex flex-col justify-center items-center text-center px-6 gap-4 min-h-[calc(80dvh_-_120px)]">
                            <img src="/Error404.svg" alt="Error" className="w-3/5 max-w-[240px]" />
                            <p className="font-body-base-mobile text-text-secondary">
                                Something went wrong. Please try again later.
                            </p>
                        </div>
                    )}

                </div>
            </main>

            {/* Bottom sheet component */}
            <CreateShipOrder
                open={open}
                onOpenChange={setOpen}
                refetch={refetch}
                onNewOrder={(so) => {
                    setRecentSO(so)
                    localStorage.setItem("recentlyCreatedSO", JSON.stringify(so))
                }}
            />
        </>
    )
}
