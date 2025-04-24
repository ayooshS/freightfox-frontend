// store/vehicleSlice.ts
import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit"



export type Vehicle = {
	id: string
	qty: number
	vehicleno: string
	driver: string
	phone: string
	state: string
}

type VehicleState = {
	vehicles: Vehicle[]
}

const initialState: VehicleState = {
	vehicles: [
		{
			id: nanoid(),
			qty: 0,
			vehicleno: "",
			driver: "",
			phone: "",
			state: "new",
		}
	],
}

const vehicleSlice = createSlice({
	name: "vehicle",
	initialState,
	reducers: {
		addVehicle: (state, action: PayloadAction<Vehicle>) => {

				state.vehicles.push({
					id: nanoid(),
					qty: action.payload.qty,
					vehicleno: action.payload.vehicleno,
					driver: action.payload.driver,
					phone: action.payload.phone,
					state: action.payload.state,
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

	},
})

export const { addVehicle, removeVehicle, resetVehicles , updateVehicle} = vehicleSlice.actions
export default vehicleSlice.reducer
