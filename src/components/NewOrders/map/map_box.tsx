import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { renderToString } from "react-dom/server"
import { Location24Filled } from "@fluentui/react-icons"

const pickupIcon = L.divIcon({
	html: renderToString(
		<Location24Filled style={{ color: "#3B82F6", fontSize: "24px" }} />
	),
	className: "",
	iconSize: [24, 24],
	iconAnchor: [12, 24],
})

const dropIcon = L.divIcon({
	html: renderToString(
		<Location24Filled style={{ color: "#10B981", fontSize: "24px" }} />
	),
	className: "",
	iconSize: [24, 24],
	iconAnchor: [12, 24],
})

type Props = {
	pickup: [number, number]
	drop: [number, number]
}

// 🧠 Custom bezier-style arc generator
function generateCurvedArc(
	pickup: [number, number],
	drop: [number, number],
	curveDepth: number = 3,
	segments: number = 50
): [number, number][] {
	const [lat1, lng1] = pickup
	const [lat2, lng2] = drop

	const midLat = (lat1 + lat2) / 2
	const midLng = (lng1 + lng2) / 2 + curveDepth // Add curve in longitude

	const arcPoints: [number, number][] = []

	for (let i = 0; i <= segments; i++) {
		const t = i / segments
		const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2
		const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * midLng + t * t * lng2
		arcPoints.push([lat, lng])
	}

	return arcPoints
}

export default function MapBox({ pickup, drop }: Props) {
	const center: [number, number] = [
		(pickup[0] + drop[0]) / 2,
		(pickup[1] + drop[1]) / 2,
	]

	const arcCoordinates = generateCurvedArc(pickup, drop, 1.5)

	return (
		<MapContainer
			center={center}
			zoom={5}
			scrollWheelZoom={false}
			style={{ height: "240px", borderRadius: "12px" }}
			dragging={true}
			zoomControl={true}
			doubleClickZoom={false}
			attributionControl={false}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<Marker position={pickup} icon={pickupIcon} />
			<Marker position={drop} icon={dropIcon} />
			<Polyline
				positions={arcCoordinates}
				pathOptions={{ dashArray: "12", color: "#3B82F6" }}
			/>
		</MapContainer>
	)
}
