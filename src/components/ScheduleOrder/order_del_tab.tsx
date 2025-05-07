import { Scales24Regular } from "@fluentui/react-icons"
import {DeliveryDetailsDrawer} from "@/components/NewOrders/Drawer/delivery_dets_drawer.tsx";

export function OrderDetailsTab({

	                                product_description,
	                                ship_order_id,
	                                product_sku,
	                                order_qty,
	                                pickup_address,
	                                delivery_address,
	                                // booked_rate,
	                                // dispatch_plan
                                }: {

	ship_order_id: string
	product_description: string
	product_sku: string
	order_qty: number
	pickup_address: string
	delivery_address: string
	booked_rate: number
	dispatch_plan: [
		{
			vehicle: number
			size: number
			eta: string
		}]
}) {
	return (
		<div className="space-y-4">
			<div className="p-4 rounded-xl bg-white shadow-sm">
				<p className="font-body-md text-text-primary"></p>
				<p className="font-caption text-text-tertiary">#{ship_order_id}</p>
				<div className="flex items-center gap-2 mt-2">
					<Scales24Regular className="w-4 h-4" />
					<p className="text-sm">{order_qty} MT</p>
				</div>
				<p className="text-sm text-text-secondary mt-1">{product_sku}</p>
				<p className="text-sm text-text-secondary mt-1">{product_description}</p>
			</div>

			<div className="p-1 rounded-xl bg-white">
				<DeliveryDetailsDrawer pickup_address={pickup_address} delivery_address={delivery_address} />
			</div>

			{/*<div className="p-1 rounded-xl bg-white shadow-sm">*/}
			{/*	<DispatchDetailsDrawer dispatch_plan={dispatch_plan} booked_rate={booked_rate} />*/}
			{/*</div>*/}
		</div>
	)
}
