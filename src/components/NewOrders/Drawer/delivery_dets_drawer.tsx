// components/DeliveryDetailsDrawer.tsx
import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge"
import {Location24Regular} from "@fluentui/react-icons"
import {useEffect, useState} from "react"

import {geocodeAddress} from "@/lib/geocode"
import MapBox from "@/components/NewOrders/map/map_box.tsx";
import {extractCityState} from "@/lib/extractCityState"
import { calculateDistance } from "@/lib/calculateDistance"



type Props = {
	pickupAddress: string
	dropAddress: string
	distance?: string // optional in case you want to vary it
}

export function DeliveryDetailsDrawer({
	                                      pickupAddress,
	                                      dropAddress,
	                                      distance,
                                      }: Props) {

	const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null)
	const [dropCoords, setDropCoords] = useState<[number, number] | null>(null)
	const [error, setError] = useState<boolean>(false) // ✅ add this
	const [distanceKm, setDistanceKm] = useState<string | null>(null)


	useEffect(() => {
		async function fetchCoords() {
			try {
				const pickup = await geocodeAddress(extractCityState(pickupAddress))
				const drop = await geocodeAddress(extractCityState(dropAddress))
				setPickupCoords(pickup)
				setDropCoords(drop)

				const distance = calculateDistance(pickup, drop)
				setDistanceKm(`${distance}km`)
			} catch (err) {
				console.error("Error fetching coordinates:", err)
				setError(true)
			}
		}

		fetchCoords()
	}, [pickupAddress, dropAddress])



	return (
		<div
			className="bg-surface-secondary rounded-xl-mobile items-stretch px-2 py-2 pt-8 pb-8 flex flex-col gap-xl-mobile">
			<div className="flex flex-col gap-md-mobile">
				<div className="flex flex-col gap-xs-mobile">
					<div className="font-body-base-mobile text-text-primary">
						Delivery Details
					</div>
					<div className="font-overline-sm-mobile text-text-tertiary">
						Approx. distance {distanceKm ?? distance}
					</div>
				</div>
				<Separator orientation="horizontal" className="w-full h-[1px] bg-border-primary"/>
			</div>

			{/*here comes the map*/}
			{pickupCoords && dropCoords ? (
				<MapBox pickup={pickupCoords} drop={dropCoords}/>
			) : (
				<div
					className="bg-muted h-96 rounded-xl-mobile flex items-center justify-center text-xs text-muted-foreground">
					{error ? "Failed to load map." : "Loading map..."}
				</div>
			)}


			<div className="flex flex-row items-start gap-md-mobile">
				<Badge
					variant="custom"
					bgColor="bg-surface-information text-icon-information"
					icon={<Location24Regular style={{width: 16, height: 16}}/>}
				/>
				<div>
					<span className="font-overline-sm-mobile text-text-tertiary">Pickup</span>
					<p className="font-caption-lg-mobile text-text-primary">{pickupAddress}</p>
				</div>
			</div>

			<div className="flex flex-row items-start gap-md-mobile">
				<Badge
					variant="custom"
					bgColor="bg-surface-success text-icon-success"
					icon={<Location24Regular style={{width: 16, height: 16}}/>}
				/>
				<div>
					<span className="font-overline-sm-mobile text-text-tertiary">Drop</span>
					<p className="font-caption-lg-mobile text-text-primary">{dropAddress}</p>
				</div>
			</div>
		</div>
	)
}
