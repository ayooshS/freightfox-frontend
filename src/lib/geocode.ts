// lib/geocode.ts
export async function geocodeAddress(address: string): Promise<[number, number]> {
	const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
	const data = await res.json()

	console.log("Geocoding address:", address)
	console.log("Geocode result:", data)

	if (!data || data.length === 0) throw new Error("Geocoding failed")
	return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
}
