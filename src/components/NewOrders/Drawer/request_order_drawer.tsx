import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer.tsx"
import {Button} from "@/components/ui/button.tsx"
import {cn} from "@/lib/utils.ts"
import {Box16Regular, Scales24Regular} from "@fluentui/react-icons";
import {DeliveryDetailsDrawer} from "@/components/NewOrders/Drawer/delivery_dets_drawer.tsx";
import {DispatchDetailsDrawer} from "@/components/NewOrders/Drawer/dispatch_dets_drawer.tsx";
import {useNavigate} from "react-router-dom";


type DispatchEntry = {
	vehicle: number
	size: number
	eta: string
}

type Props = {
	triggerButton: React.ReactNode
	buyerName: string
	poNumber: string
	productDetails: string
	quantity: string
	pickupAddress: string
	dropAddress: string
	rate: string
	dispatchData: DispatchEntry[] // ✅ add this
}


export default function RequestDetailDrawer({
	                                            triggerButton,
	                                            buyerName,
	                                            poNumber,
	                                            productDetails,
	                                            quantity,
	                                            pickupAddress,
	                                            dropAddress,
	                                            dispatchData,
	                                            rate
                                            }: Props) {

	const navigate = useNavigate();

	const handleAccept = () => {
		navigate(`/order-detail?company=${encodeURIComponent(buyerName)}&order=new`, {
			state: {
				poNumber,
				productDetails,
				quantity,
				pickupAddress,
				dropAddress,
				dispatchData,
				rate,
			},
		})
	}



	return (
		<Drawer direction="bottom">
			<DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
			<DrawerContent
				className={cn(
					"h-[65vh]",
					"flex flex-col"
				)}
			>
				<div className="h-1 w-12 bg-muted rounded-full mx-auto mb-2"/>

				{/* Scrollable content: fills available space except CTA */}
				<div className="overflow-y-auto flex-1 space-y-4 px-xl-mobile">
					<DrawerHeader>
						<DrawerDescription className="font-overline-sm-mobile text-text-tertiary">
							PO #{poNumber}
						</DrawerDescription>
						<DrawerTitle className="font-body-lg-mobile text-text-primary ">{buyerName}</DrawerTitle>

					</DrawerHeader>

					<div className="font-caption-lg-mobile text-text-primary">
						<div className="flex justify-between">
							<div className="flex flex-row items-start gap-xs-mobile w-[65%]">
								<Box16Regular style={{width: 16, height: 16}}/>
								<p>{productDetails}</p>
							</div>

							<div className="flex flex-row items-start gap-xs-mobile">
								<Scales24Regular style={{width: 16, height: 16}}/>
								<p>{quantity} MT</p>
							</div>
						</div>
					</div>

					{/*delivery details*/}
					<DeliveryDetailsDrawer
						pickupAddress={pickupAddress}
						dropAddress={dropAddress}
					/>

					{/*dispatch plan*/}

					<DispatchDetailsDrawer
						dispatchData={dispatchData}
						rate={rate}
					/>


				</div>

				{/* Sticky CTA at bottom */}
				<div
					className="shadow-customprimary border-t border-border-primary flex justify-around bg-white p-xl-mobile pb-xl-mobile pt-xl-mobile">
					<Button
						className="w-full"
						variant="default"
						size="lg"
						onClick={handleAccept}
					>
						Accept & Continue
					</Button>

				</div>
			</DrawerContent>
		</Drawer>

	)
}
