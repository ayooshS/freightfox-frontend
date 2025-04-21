// components/ui/MapBox.tsx
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const markerIcon = new L.Icon({
	iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
})

type Props = {
	pickup: [number, number]
	drop: [number, number]
}

export default function MapBox({ pickup, drop }: Props) {
	const center: [number, number] = [
		(pickup[0] + drop[0]) / 2,
		(pickup[1] + drop[1]) / 2,
	]

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
			<Marker position={pickup} icon={markerIcon} />
			<Marker position={drop} icon={markerIcon} />
			<Polyline positions={[pickup, drop]} pathOptions={{ dashArray: "6", color: "#3B82F6" }} />
		</MapContainer>
	)
}
