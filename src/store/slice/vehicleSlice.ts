// store/vehicleSlice.ts
import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit"



export type Vehicle = {
	id?: string;
	transporter_id: string;
	vehicle_number: string;
	capacity: number;
	driver_mobile_number: string;
	driver_name: string;
	placement_date: string; // ISO date string (e.g., "2025-04-02T12:34:56Z")
	eway_bill_number: string;
	invoice_number: string;
	lorry_receipt_number: string;
	state: string
	transporter_identifier: string;
	transporter_name: string;

}

type VehicleState = {
	vehicles: Vehicle[]
}

const initialState: VehicleState = {
	vehicles: [],
}

const vehicleSlice = createSlice({
	name: "vehicle",
	initialState,
	reducers: {
		addVehicle: (state, action: PayloadAction<Vehicle>) => {

				state.vehicles.push({
					id: nanoid(),
					transporter_id: action.payload.transporter_id,
					vehicle_number: action.payload.vehicle_number,
					capacity: action.payload.capacity,
					driver_mobile_number: action.payload.driver_mobile_number,
					driver_name: action.payload.driver_name,
					placement_date: action.payload.placement_date,
					eway_bill_number: action.payload.eway_bill_number,
					invoice_number: action.payload.invoice_number,
					lorry_receipt_number: action.payload.lorry_receipt_number,
					state: action.payload.state,
					transporter_identifier: action.payload.transporter_identifier,
					transporter_name: action.payload.transporter_name,
				})

		},
		removeVehicle: (state, action: PayloadAction<string>) => {
			state.vehicles = state.vehicles.filter((v) => v.id !== action.payload)
		},
		resetVehicles: (state) => {
			state.vehicles = []
		},
		// store/vehicleSlice.ts
		updateVehicle: (state, action: PayloadAction<Vehicle>) => {
			const index = state.vehicles.findIndex(v => v.id === action.payload.id)
			if (index !== -1) {


					state.vehicles[index] = action.payload

			}
		},
		addmultipleVehicle: (state, action: PayloadAction<Vehicle[]>) => {
			state.vehicles = action.payload
		}

	},
})

export const { addVehicle, removeVehicle, resetVehicles , updateVehicle, addmultipleVehicle} = vehicleSlice.actions
export default vehicleSlice.reducer
