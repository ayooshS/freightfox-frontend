// src/lib/api.ts
import axios from 'axios'
import {Vehicle} from "@/store/slice/vehicleSlice.ts";


type shipOrderObjType = {
	ship_id: string
	total_placed_capacity: number
	vehicles: Vehicle[]
}


const BASE_URL = process.env.BASE_TRANS_URL

export async function fetchOrders(transporterID: string) {
	const response = await axios.get(
		`${BASE_URL}/v1/ship-orders?page_size=50&status_filter=new&transporter_id=${transporterID}`
	)

	return response.data.orders
}

// src/lib/api.ts

export async function rejectOrder(id: string, transporter_id: string) {
	const queryParams = new URLSearchParams({
		ship_order_id: id,
		transporter_id: transporter_id,
		action: "reject",
	})

	const response = await axios.put(`${BASE_URL}/v1/ship-orders/status?${queryParams}`)

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

export async function getAcceptedOrders(transporterID: string) {
	const response = await axios.get(
		`${BASE_URL}/v1/ship-orders?page_size=50&status_filter=accepted&transporter_id=${transporterID}`
	)

	if (response.status === 200) {
		return { data: response.data, error: null }
	} else {
		return { data: null, error: "Unexpected response" }
	}
}


export async function updateOrderStatus(ship_order_id: string, transporter_id: string) {
	const queryParams = new URLSearchParams({
		ship_order_id, // ✅ moved from path to query param
		transporter_id,
		action: "accept"
	});



	const response = await axios.put(`${BASE_URL}/v1/ship-orders/status?${queryParams}`);

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

	const response = await axios.get(
		`${BASE_URL}/v1/vehicle-placements?page_size=${page_size}&transporter_id=${transporter_id}&ship_order_id=${ship_order_id}`
	)


	if (response.status === 200) {
		return { data: response.data, error: null };

	} else {
		return { data: null, error: "Unexpected response" };
	}

}

export async function createShipOrder(payload: {
	fulfilment_order_id: string;
	transporter_id: string;
	order_qty: number;
	unit_of_measurement: string;
	pickup_address: string;
	delivery_address: string;
	booked_rate: number;
	product_sku: string;
	product_description: string;
	buyer_name?: string; // ✅ optional
	dispatch_plan: any[]; // ✅ added earlier
}) {
	try {
		const response = await axios.post(`${BASE_URL}/v1/ship-orders`, payload);
		return { data: response.data, error: null };
	} catch (err: any) {
		return { data: null, error: err?.response?.data || "Unexpected error" };
	}
}

// src/lib/api.ts

export async function getTransporters() {
	try {
		const response = await axios.get(`${BASE_URL}/v1/transporters?page_size=10`)
		if (response.status === 200) {
			return { data: response.data.transporters, error: null }
		}
		return { data: null, error: "Unexpected response" }
	} catch (err: any) {
		return { data: null, error: err?.response?.data || "Unexpected error" }
	}
}










