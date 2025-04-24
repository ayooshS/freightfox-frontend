import { Scales24Regular } from "@fluentui/react-icons"
import {DeliveryDetailsDrawer} from "@/components/NewOrders/Drawer/delivery_dets_drawer.tsx";
import {DispatchDetailsDrawer} from "@/components/NewOrders/Drawer/dispatch_dets_drawer.tsx";

export function OrderDetailsTab({
	                                buyerName,
	                                poNumber,
	                                productDetails,
	                                quantity,
	                                pickupAddress,
	                                dropAddress,
	                                rate,
	                                dispatchData
                                }: {
	buyerName: string
	poNumber: string
	productDetails: string
	quantity: string
	pickupAddress: string
	dropAddress: string
	rate: string
	dispatchData: [
		{
			vehicle: number
			size: number
			eta: string
		}]
}) {
	return (
		<div className="space-y-4">
			<div className="p-4 rounded-xl bg-white shadow-sm">
				<p className="font-body-md text-text-primary">{buyerName}</p>
				<p className="font-caption text-text-tertiary">#{poNumber}</p>
				<div className="flex items-center gap-2 mt-2">
					<Scales24Regular className="w-4 h-4" />
					<p className="text-sm">{quantity} MT</p>
				</div>
				<p className="text-sm text-text-secondary mt-1">{productDetails}</p>
			</div>

			<div className="p-1 rounded-xl bg-white">
				<DeliveryDetailsDrawer pickupAddress={pickupAddress} dropAddress={dropAddress} />
			</div>

			<div className="p-1 rounded-xl bg-white shadow-sm">
				<DispatchDetailsDrawer dispatchData={dispatchData} rate={rate} />
			</div>
		</div>
	)
}
