import {Box16Regular, Scales24Regular} from "@fluentui/react-icons"
import {DeliveryDetailsDrawer} from "@/components/NewOrders/Drawer/delivery_dets_drawer.tsx";
import {Separator} from "@/components/ui/separator.tsx";

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
		<div className="space-y-4 pt-4">


			<div className="p-4 rounded-xl bg-white">
				<div className="flex flex-col gap-sm-mobile"><p className="font-body-base-mobile text-text-primary">Ship Order Overview</p>
					<p className="font-overline-sm-mobile text-text-tertiary">Ship ID: {ship_order_id}</p>
					<Separator orientation="horizontal" className="w-full h-[1px] bg-border-primary"/></div>
				<div className="flex justify-between pt-4">
					<div className="flex gap-xs-mobile">
						<div className="flex flex-col items-center gap-md-mobile">
							<div className="flex items-start gap-xs-mobile">
								<Box16Regular style={{width: 20, height: 20}}/>
								<p className="font-body-lg-mobile text-text-primary">{product_sku}</p>
							</div>
							<p className="font-body-base-mobile text-text-secondary">{product_description}</p>
						</div>

						{/* You can remove this empty gap if unnecessary */}
					</div>

					<div className="flex items-start gap-xs-mobile">
						<Scales24Regular style={{width: 20, height: 20}}/>
						<p className="font-body-lg-mobile text-text-primary">{order_qty} MT</p>
					</div>
				</div>
			</div>

			<div >
				<DeliveryDetailsDrawer pickup_address={pickup_address} delivery_address={delivery_address} bgColorClass="bg-surface-primary"/>
			</div>

			{/*<div className="p-1 rounded-xl bg-white shadow-sm">*/}
			{/*	<DispatchDetailsDrawer dispatch_plan={dispatch_plan} booked_rate={booked_rate} />*/}
			{/*</div>*/}
		</div>
	)
}
