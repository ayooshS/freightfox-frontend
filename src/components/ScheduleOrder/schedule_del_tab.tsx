import {Button} from "@/components/ui/button"
import {useDispatch} from 'react-redux';
import {addVehicle, updateVehicle, Vehicle} from "@/store/slice/vehicleSlice";
import {AddCircle20Regular} from "@fluentui/react-icons";

import {VehicleCard} from "@/components/ScheduleOrder/vehicle_card.tsx";



export function ScheduleDeliveryTab({
	                                    ordertype,
	                                    vehicles,
	                                    disabledAdd,
	                                    transporter_id,
                                    }: {
	ordertype: string
	vehicles: Vehicle[]
	disabledAdd: boolean
	transporter_id: string
}) {
	const dispatch = useDispatch()

	return (
		<div className="pb-4 pt-4">
			{vehicles.map((vehicle, index) => (
				<VehicleCard
					key={index}
					index={index}
					vehicle={vehicle}
					type={ordertype === "existing" && vehicle.state !== "new" ? "view" : "edit"}
					onVehicleNoChange={(val) =>
						dispatch(updateVehicle({ ...vehicle, vehicle_number: val }))
					}
					onDriverChange={(val) =>
						dispatch(updateVehicle({ ...vehicle, driver_name: val }))
					}
					onPhoneChange={(val) =>
						dispatch(updateVehicle({ ...vehicle, driver_mobile_number: val }))
					}
					onQtyChange={(capacity) =>
						dispatch(updateVehicle({ ...vehicle, capacity }))
					}
					onInvoiceChange={(val) =>
						dispatch(updateVehicle({ ...vehicle, invoice_number: val }))
					}
					onEwayChange={(val) =>
						dispatch(updateVehicle({ ...vehicle, eway_bill_number: val }))
					}
					onLorryChange={(val) =>
						dispatch(updateVehicle({ ...vehicle, lorry_receipt_number: val }))
					}
					onTransporterChange={(val) =>
						dispatch(updateVehicle({ ...vehicle, transporter_id: val }))
					}
				/>
			))}

			<Button
				variant="link"
				size="lg"
				disabled={disabledAdd}
				onClick={() =>
					dispatch(
						addVehicle({
							transporter_identifier: "",
							transporter_name: "",
							id: "",
							transporter_id: transporter_id,
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
					)
				}
			>
				<AddCircle20Regular />
				Add Another Vehicle
			</Button>
		</div>
	)
}
