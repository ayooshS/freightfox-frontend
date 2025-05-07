import {useNavigate, useLocation, useSearchParams} from "react-router-dom"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ScheduleDeliveryTab} from "@/components/ScheduleOrder/schedule_del_tab.tsx";
import {OrderDetailsTab} from "@/components/ScheduleOrder/order_del_tab.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from "@/store/store.ts";
import {ArrowLeft24Regular} from "@fluentui/react-icons";
import {cn} from "@/lib/utils.ts";
import {useEffect, useState} from "react";
import {addmultipleVehicle, addVehicle} from "@/store/slice/vehicleSlice.ts";
import {placeVehicle, updateOrderStatus,} from "@/lib/api.ts";


export default function OrderDetailPage() {
	const [isPlacing, setIsPlacing] = useState(false);
	const vehicles = useSelector((state: RootState) => state.vehicle.vehicles)
	const navigate = useNavigate()
	const {state} = useLocation()
	const [searchParams] = useSearchParams()
	const buyerName = searchParams.get("company") || state?.buyerName || "N/A"
	const dispatch = useDispatch()
	const ordertype: string  = searchParams.get("order")!



	const {
		ship_order_id,
		status,
		order_qty,
		pickup_address,
		delivery_address,
		booked_rate,
		product_sku,
		product_description,
		dispatch_plan,
		transporter_id,
		vehicle,
	} = state || {}

	const handleClick = () => {
		if (ordertype === "new") {
			navigate("/New-orders" + "?transporter_id=" + transporter_id)
		} else {
			navigate("/My-orders" + "?transporter_id=" + transporter_id)
		}
	}

	useEffect(() => {
		if (ordertype === "new") {
			dispatch(addVehicle({
				id: "",
				transporter_id:transporter_id,
				vehicle_number: "",
				capacity: 0,
				driver_mobile_number: "",
				driver_name: "",
				placement_date: "",
				eway_bill_number: "",
				invoice_number: "",
				lorry_receipt_number: "",
				state: "new"
			}))
		}else{
			dispatch(addmultipleVehicle(vehicle))
		}

	}, [])

	let disabledAdd = true;
	let disabledPlace = true;
	let totalqty = 0
	let maindisabled = false;

	for (const vehicle of vehicles) {
		console.log(vehicle)
		if (vehicle.capacity != 0 && vehicle.driver_name != "" && vehicle.driver_mobile_number != "" && vehicle.vehicle_number != "" && vehicle.invoice_number != "" && vehicle.lorry_receipt_number != "") {
			disabledAdd = false;
			disabledPlace = false;
		} else {
			disabledAdd = true;
			disabledPlace = true;
			maindisabled = true;
			break;
		}

	}

	for (const vehicle of vehicles){
		totalqty = totalqty + vehicle.capacity
	}

	if (totalqty >= parseInt(order_qty) && !maindisabled) {
		disabledAdd = true;
	}

	if(!maindisabled){
		if (totalqty <= parseInt(order_qty)) {
			disabledPlace = false;
		}else if(parseInt(order_qty) < totalqty){
			disabledPlace = true;
		}
	}


	if(ordertype === "existing" && status === "in-progress" ){
		disabledPlace = true;
	}

	async function handlePlace() {
		setIsPlacing(true);
		let sum_vehicle_qty = 0;
		const isoUTCString = new Date().toISOString();

		 sum_vehicle_qty = vehicles.reduce((accumulator, vehicle) => {
			return accumulator + vehicle.capacity;
		}, 0);

		const filtervehicle = vehicles.filter(vehicle => vehicle.state === "new")

		const modifiedvehicles = filtervehicle.map((veh) => {
			return {
				...veh,
				placement_date: isoUTCString,
			};
		});

		const obj = {
			ship_id: ship_order_id,
			total_placed_capacity: sum_vehicle_qty,
			vehicles: modifiedvehicles,
		};

		try {
			const { data, error } = await placeVehicle(obj);

			if (data === "success") {
				console.log("Vehicles placed successfully");

				const { data: statusData, error: statusError } = await updateOrderStatus(ship_order_id);

				if (statusData === "success") {
					console.log("Order status updated to accept");
					navigate("/My-orders?transporter_id=" + transporter_id);
				} else {
					console.error("Failed to update status:", statusError);
				}
			} else {
				console.error("Vehicle placement failed:", error);
			}
		} catch (err) {
			console.error("Error placing vehicle or updating status:", err);
		} finally {
			setIsPlacing(false);
		}
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
								onClick={handleClick}
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
							ordertype={ordertype}
							disabledAdd={disabledAdd}
							vehicles={vehicles}
							transporter_id = {transporter_id}

						/>
					</TabsContent>

					<TabsContent value="details">
						<OrderDetailsTab
							ship_order_id={ship_order_id}
							product_sku={product_sku}
							product_description={product_description}
							order_qty={order_qty}
							pickup_address={pickup_address}
							delivery_address={delivery_address}
							dispatch_plan={dispatch_plan}
							booked_rate={booked_rate}
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
								totalqty > order_qty ? "text-red-500" : "text-text-action-press"
							)}
							>
                             {totalqty}
                        </span>
						<span className="font-subtitle-lg-mobile text-text-action-press">/{order_qty}MT</span>
						<Progress value={totalqty} max={order_qty} className="mt-2"/>
					</div>


					{/* Button below */}
					<Button
						onClick={handlePlace}
						isLoading={isPlacing} // ✅ use the new prop
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
