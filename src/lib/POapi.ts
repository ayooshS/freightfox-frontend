import axios from "axios";

export async function fetchPOdetails(poId: string) {
	const token = localStorage.getItem("auth_token")
	if (!token) throw new Error("No auth token found")

	let poNumericId = ""

	if (/^BZPO-\d{5}-\d{6}$/.test(poId)) {
		// BZPO-20069-284650 → extract last part
		poNumericId = poId.split("-").pop()!
	} else if (/^PO\/\d{2}\/[A-Z]{2}\/\d{4}$/.test(poId)) {
		// PO/26/MH/1391 → extract last segment
		poNumericId = poId.split("/").pop()!
	} else {
		throw new Error("Invalid PO ID format")
	}

	const response = await axios.get(
		`https://poservice.showroom.indopus.in/purchase-order-item/fetch?poId=${poNumericId}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"centre-id": "1",
				"jwt-token-enabled": "true",
				"source": "ProcureLive",
				"tenant-id": "1",
				"x-procurement": "true",
				"x-source": "procurelive",
				"x-tenant-id": "1",
			},
		}
	)

	return response.data
}
