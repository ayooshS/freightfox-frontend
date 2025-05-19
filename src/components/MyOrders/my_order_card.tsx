import {useNavigate, useSearchParams} from "react-router-dom"
import { Card } from "@/components/ui/card.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ChevronRight16Regular } from "@fluentui/react-icons"
import { Progress } from "@/components/ui/progress.tsx"
import { OrderStatus } from "@/components/MyOrders/order_status.tsx"
import {getVehiclePlacements} from "@/lib/api.ts";


type MyOrderCardProps = {
	ship_order_id: string
	total_placed_capacity: number
	status: string
	order_qty: number
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

export default function MyOrderCard({
	                                    ship_order_id,
	                                    total_placed_capacity,
	                                    status,
	                                    order_qty,
	                                    pickup_address,
	                                    delivery_address,
	                                    booked_rate,
	                                    product_sku,
	                                    product_description,
	                                    dispatch_plan,
                                    }: MyOrderCardProps) {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const transporterID: string  = searchParams.get("transporter_id")!


	const derivedStatus = total_placed_capacity < order_qty ? "in-progress" : "done"

	const handleCardClick = async () => {
		const {data,error} = await getVehiclePlacements(ship_order_id, transporterID)
		if(data !== null){
			if(derivedStatus === "in-progress" ){
				data.vehicles.unshift({
					id: "",
					transporter_id:transporterID,
					vehicle_number: "",
					capacity: 0,
					driver_mobile_number: "",
					driver_name: "",
					placement_date: "",
					eway_bill_number: "",
					invoice_number: "",
					lorry_receipt_number: "",
					state: "new"
				})
			}
			navigate(`/order-detail?company=${encodeURIComponent(ship_order_id)}&order=existing`, {
				state: {
					ship_order_id : data.ship_id,
					status,
					order_qty,
					pickup_address,
					delivery_address,
					booked_rate,
					product_sku,
					product_description,
					dispatch_plan,
					transporter_id: transporterID,
					vehicle: data.vehicles,
					// ✅ pass fetched vehicles here
				}
			})
		}else {
			console.log(error)
		}

	}
	// console.log("@@@@@@@@@@@@@@@ " + vehicles)



	return (
		<Card
			onClick={handleCardClick}
			className="rounded-xl-mobile bg-surface-primary p-4 space-y-3 cursor-pointer hover:bg-muted transition"
		>
			{/* Header */}
			<div className="flex flex-col">
				<div className="flex justify-between items-center w-full">
					<div className="flex items-center gap-2">
            <span className="font-overline-sm-mobile text-text-tertiary">
              Ship ID: {ship_order_id}
            </span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={(e) => {
							e.stopPropagation()
							handleCardClick()
						}}
					>
						<ChevronRight16Regular />
					</Button>
				</div>
				<Separator orientation="horizontal" className="w-full h-[1px] bg-border-primary" />
			</div>

			{/* Product Info + Status */}
			<div className="flex justify-between items-center">
				<div>
					<p className="font-body-lg-mobile text-text-primary">{product_sku}</p>
					<p className="font-overline-sm-mobile text-text-tertiary line-clamp-2 break-words">
						{product_description}
					</p>
				</div>
				<div className="text-right">
					<OrderStatus status={derivedStatus} />
				</div>
			</div>

			{/* Progress */}
			<div className="mb-2">
				<p className="font-subtitle-lg-mobile text-text-action-press">
					{total_placed_capacity}/{order_qty}MT
				</p>
				<Progress value={total_placed_capacity} max={order_qty} className="mt-2 w-full" />
			</div>
		</Card>
	)
}
