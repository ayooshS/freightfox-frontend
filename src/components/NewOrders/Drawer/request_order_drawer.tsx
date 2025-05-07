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
// import {DispatchDetailsDrawer} from "@/components/NewOrders/Drawer/dispatch_dets_drawer.tsx";
import {useNavigate} from "react-router-dom";


type DispatchEntry = {
	vehicle: number
	size: number
	eta: string
}

type Props = {
	triggerButton: React.ReactNode
	buyer_name: string
	ship_order_id: string
	product_sku: string
	order_qty: number
	pickup_address: string
	delivery_address: string
	booked_rate: number
	product_description: string;
	dispatch_plan: DispatchEntry[] // ✅ add this
	transporter_id: string;
}


export default function RequestDetailDrawer({
	                                            triggerButton,
	                                            buyer_name,
	                                            ship_order_id,
	                                            product_sku,
	                                            order_qty,
	                                            pickup_address,
	                                            delivery_address,
	                                            dispatch_plan,
	                                            booked_rate,
	                                            product_description,
												transporter_id,
                                            }: Props) {

	// const dispatch = useDispatch();

	const navigate = useNavigate();

	const handleAccept = () => {

		navigate(`/order-detail?company=${encodeURIComponent(ship_order_id)}&order=new`, {
			state: {
				ship_order_id,
				status:"",
				order_qty,
				pickup_address,
				delivery_address,
				booked_rate,
				product_sku,
				product_description,
				dispatch_plan,
				transporter_id,
				vehicle: []
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
							Ship ID:{ship_order_id}
						</DrawerDescription>
						<DrawerTitle className="font-body-lg-mobile text-text-primary ">{buyer_name}</DrawerTitle>

					</DrawerHeader>


						<div className="flex justify-between">
							<div className="flex gap-xs-mobile">
								<div className="flex flex-col items-center gap-md-mobile">
									<div className="flex items-start gap-xs-mobile">
										<Box16Regular style={{ width: 20, height: 20 }} />
										<p className="font-body-lg-mobile text-text-primary">{product_sku}</p>
									</div>
									<p className="font-body-base-mobile text-text-secondary">{product_description}</p>
								</div>

								{/* You can remove this empty gap if unnecessary */}
							</div>

							<div className="flex items-start gap-xs-mobile">
								<Scales24Regular style={{ width: 20, height: 20 }} />
								<p className="font-body-lg-mobile text-text-primary">{order_qty} MT</p>
							</div>
						</div>



					{/*delivery details*/}
					<DeliveryDetailsDrawer
						pickup_address={pickup_address}
						delivery_address={delivery_address}
					/>

					{/*dispatch plan*/}

					{/*<DispatchDetailsDrawer*/}
					{/*	dispatch_plan={dispatch_plan}*/}
					{/*	booked_rate={booked_rate}*/}
					{/*/>*/}


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
