import {Button} from "@/components/ui/button"
import {useDispatch} from 'react-redux';
import {addVehicle, updateVehicle, Vehicle} from "@/store/slice/vehicleSlice";
import {AddCircle20Regular} from "@fluentui/react-icons";

import {VehicleCard} from "@/components/ScheduleOrder/vehicle_card.tsx";

export function ScheduleDeliveryTab({vehicles, disabledAdd}: { vehicles: Vehicle[], disabledAdd: boolean }) {
	const dispatch = useDispatch();

	return (
		<div className="pb-4 pt-4">
			{vehicles.map((vehicle, index) => (
				<VehicleCard
					key={index}
					index={index}
					vehicle={vehicle}
					onVehicleNoChange={(val) =>
						dispatch(updateVehicle({ ...vehicle, vehicleno: val }))
					}
					onDriverChange={(val) =>
						dispatch(updateVehicle({ ...vehicle, driver: val }))
					}
					onPhoneChange={(val) =>
						dispatch(updateVehicle({ ...vehicle, phone: val }))
					}
					onQtyChange={(qty) =>
						dispatch(updateVehicle({ ...vehicle, qty }))
					}
				/>

			))}

			<Button
				variant="link"
				size="lg"
				disabled={disabledAdd}
				onClick={() =>
					dispatch(addVehicle({
						id:"",
						qty: 0,
						vehicleno: "",
						driver: "",
						phone: "",
						state:"new"
					}))
				}
				className=""
			>
				<AddCircle20Regular/>
				Add Another Vehicle
			</Button>
		</div>
	);
}
