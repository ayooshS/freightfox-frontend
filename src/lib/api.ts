// src/lib/api.ts
import axios from 'axios'
import {Vehicle} from "@/store/slice/vehicleSlice.ts";

type shipOrderObjType = {
	ship_id: string
	total_placed_capacity: number
	vehicles: Vehicle[]
}

type getVehiclePlacementsType = {
	transporter_id: string
	ship_order_id: string
	page_size?: number
}

const BASE_URL =
	'https://7bf5a057-7a03-49d8-8426-14d6bcbfec9d-00-36g3647l70hve.pike.replit.dev:5000'

export async function fetchOrders(transporterID: string) {
	const response = await axios.get(
		`${BASE_URL}/v1/ship-orders?page_size=50&status_filter=new&transporter_id=${transporterID}`
	)

	return response.data.orders
}

export async function rejectOrder(id: string) {
	const response = await axios.put(`${BASE_URL}/v1/ship-orders/${id}/status?transporter_id=T100&action=reject`)
	if (response.status === 200) {
		return { data: "success", error: null }
	} else {
		return { data: null, error: "Unexpected response" }
	}

}

export async function placeVehicle(shipOrderObj : shipOrderObjType) {
	const response = await axios.post(`${BASE_URL}/v1/vehicle-placements`,shipOrderObj )

	if (response.status === 201) {
		return { data: "success", error: null }
	} else {
		return { data: null, error: "Unexpected response" }
	}
}

export async function getAcceptedOrders() {
	const response = await axios.get(
		`${BASE_URL}/v1/ship-orders?page_size=50&status_filter=accepted&transporter_id=T100`
	)

	if (response.status === 200) {
		return { data: response.data, error: null };
	} else {
		return { data: null, error: "Unexpected response" };
	}

}


export async function updateOrderStatus(ship_order_id: string) {
	const queryParams = new URLSearchParams({
		transporter_id: "T100",
		action: "accept"
	});

	const response = await axios.put(
		`${BASE_URL}/v1/ship-orders/${ship_order_id}/status?${queryParams}`
	);

	if (response.status === 200) {
		return { data: "success", error: null };
	} else {
		return { data: null, error: "Unexpected response" };
	}
}

export async function getVehiclePlacements(
	                                           ship_order_id: string,
	                                           transporter_id: string,
	                                           page_size = 10,)
{

	const response = await axios.get(`${BASE_URL}/v1/vehicle-placements?page_size=${page_size}&transporter_id=${transporter_id}&ship_order_id=${ship_order_id}`)

	if (response.status === 200) {
		return { data: response.data, error: null };

	} else {
		return { data: null, error: "Unexpected response" };
	}


	// ✅ return vehicles from the first item
	// if (Array.isArray(response.data) && response.data.length > 0) {
	// 	return response.data[0].vehicles || []
	// } else {
	// 	return []
	// }
}





