import {useNavigate, useLocation, useSearchParams} from "react-router-dom"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ScheduleDeliveryTab} from "@/components/ScheduleOrder/schedule_del_tab.tsx";
import {OrderDetailsTab} from "@/components/ScheduleOrder/order_del_tab.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {useSelector} from 'react-redux';
import {RootState} from "@/store/store.ts";
import {ArrowLeft24Regular} from "@fluentui/react-icons";
import {cn} from "@/lib/utils.ts";


export default function OrderDetailPage() {
	const vehicles = useSelector((state: RootState) => state.vehicle.vehicles)
	const navigate = useNavigate()
	const {state} = useLocation()
	const [searchParams] = useSearchParams()
	const buyerName = searchParams.get("company") || state?.buyerName || "N/A"
	const {

		poNumber,
		productDetails,
		quantity,
		pickupAddress,
		dropAddress,
		dispatchData,
		rate,
	} = state || {}

	let disabledAdd = true;
	let disabledPlace = true;
	let totalqty = 0
	for (const vehicle of vehicles) {
		console.log(vehicle)
		if (vehicle.qty != 0 && vehicle.driver != "" && vehicle.phone != "" && vehicle.vehicleno != "") {
			disabledAdd = false;
			disabledPlace = false;
		} else {
			disabledAdd = true;
			disabledPlace = true;
		}

		totalqty = totalqty + vehicle.qty
	}

	if (totalqty > parseInt(quantity)) {
		disabledAdd = true;
		disabledPlace = true;
	}

	const handlePlace = () => {
		const obj = {
			poNumber,
			vehicles: vehicles,
		}
		console.log(obj)
	}


	return (
		<div className="min-h-[100dvh] flex justify-center">
			<div className="w-full max-w-[480px] bg-surface-secondary flex flex-col h-[100dvh]">

				<header className="flex pt-8 px-4">
					<div className="items-start z-0 flex w-full flex-col gap-3">
						<div className="flex w-full gap-1.5">
							<Button
								variant="ghost"
								size="lg"
								onClick={() => navigate("/New-orders")}
								className="text-text-secondary">
								<ArrowLeft24Regular className="w-9 h-9"/>
							</Button>

							<div className="flex flex-col items-stretch justify-center flex-1">
								<div className="w-full font-overline-sm-mobile text-text-secondary">
									{buyerName}
								</div>
								<div className="w-full font-subtitle-lg-mobile text-text-primary">
									Schedule Order
								</div>
							</div>
						</div>
					</div>
				</header>

				<Tabs defaultValue="schedule"
				      className="flex flex-col flex-1 overflow-y-auto py-xl-mobile px-xl-mobile">
					<TabsList className="w-full">
						<TabsTrigger className="font-body-base-mobile" value="schedule">Schedule Delivery</TabsTrigger>
						<TabsTrigger className="font-body-base-mobile" value="details">Order Details</TabsTrigger>
					</TabsList>

					<TabsContent value="schedule">
						<ScheduleDeliveryTab
							disabledAdd={disabledAdd}
							vehicles={vehicles}
						/>
					</TabsContent>

					<TabsContent value="details">
						<OrderDetailsTab
							poNumber={poNumber}
							buyerName={buyerName}
							productDetails={productDetails}
							quantity={quantity}
							pickupAddress={pickupAddress}
							dropAddress={dropAddress}
							dispatchData={dispatchData}
							rate={rate}
						/>
					</TabsContent>
				</Tabs>

				<div className="shadow-customprimary bg-white px-xl-mobile pt-xl-mobile pb-xl-mobile sticky bottom-0">
					{/* Progress bar on top */}
					<div className="mb-2">
						<p className="font-caption-lg-mobile text-text-tertiary">Total quantity added</p>
						<span
							className={cn(
								"font-subtitle-lg-mobile",
								totalqty > quantity ? "text-red-500" : "text-text-action-press"
							)}
							>
                             {totalqty}
                        </span>
						<span className="font-subtitle-lg-mobile text-text-action-press">/{quantity}MT</span>
						<Progress value={totalqty} max={quantity} className="mt-2"/>
					</div>


					{/* Button below */}
					<Button
						onClick={handlePlace}
						disabled={disabledPlace}
						className="w-full mt-2"
						variant="default"
						size="lg"
					>
						Place Vehicle
					</Button>
				</div>
			</div>
		</div>
	)
}
