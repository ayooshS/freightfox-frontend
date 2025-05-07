
import { createSlice } from "@reduxjs/toolkit"
import {fetchorder} from "@/store/thunks/fetchorder.ts";


type DispatchEntry = {
	reporting_date: string; // e.g. "2024-02-20"
	vehicle_capacity: number;
}

export type Order = {
	ship_order_id: string; // e.g. "TEST002"
	transporter_id: string; // e.g. "T100"
	status: string; // e.g. "new"
	order_qty: number; // e.g. 100
	unit_of_measurement: string; // e.g. "MT"
	pickup_address: string; // e.g. "Test Pickup, City"
	delivery_address: string; // e.g. "Test Delivery, City"
	booked_rate: number; // e.g. 1000.0
	product_sku: string; // e.g. "SKU123"
	product_description: string; // e.g. "Test Product"
	dispatch_plan: DispatchEntry[];
	buyer_name: string;
}

type OrderState = {
	data: []
	isLoading: boolean
	error: string | null
}


const initialState: OrderState = {
	data: [],
	isLoading: false,
	error: null,
}

const shiporderSlice = createSlice({
	name: "order",
	initialState,
	reducers: {}, // ✅ required even if you don't use it
	extraReducers(builder) {
		builder.addCase(fetchorder.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchorder.fulfilled, (state, action) => {
			state.isLoading = false;
			state.data = action.payload;
		});
		builder.addCase(fetchorder.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.error?.message || "Something went wrong";
		});
	},
});



export default shiporderSlice.reducer