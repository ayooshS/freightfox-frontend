export function extractCityState(fullAddress: string): string {
	const parts = fullAddress.split(",")
	return parts.slice(-2).join(",").trim() // e.g., "Raipur, Chhattisgarh"
}
