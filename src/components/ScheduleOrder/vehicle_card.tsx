import {useState} from "react"
import {useDispatch} from 'react-redux';
import {Input} from "@/components/ui/input"
import {Separator} from "@/components/ui/separator"
import {
	VehicleTruckBagRegular,
	NumberRow24Regular,
	Person16Regular,
	ChevronDown24Regular,
	Delete24Regular
} from "@fluentui/react-icons"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button"
import {removeVehicle, Vehicle} from "@/store/slice/vehicleSlice"

type Props = {
	vehicle: Vehicle
	index: number
	onVehicleNoChange: (val: string) => void
	onDriverChange: (val: string) => void
	onPhoneChange: (val: string) => void
	onQtyChange: (qty: number) => void
}

export function VehicleCard({
	                            vehicle,
	                            index,
	                            onVehicleNoChange,
	                            onDriverChange,
	                            onPhoneChange,
	                            onQtyChange
                            }: Props) {
	const [drawerOpen, setDrawerOpen] = useState(false)

	const options = [10, 12, 15, 20, 25, 30, 35, 40, 42]

	const dispatch = useDispatch();

	const handleDelete = () => {
		dispatch(removeVehicle(vehicle.id))
	}

	return (
		<div className="pb-4">
			<div
				className="bg-surface-primary px-lg-mobile py-lg-mobile pt-xxl-mobile pb-xxl-mobile rounded-xl-mobile flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<p className="font-body-base-mobile text-text-primary">Vehicle {index + 1}</p>
						{
							index > 0 ? (<Button variant="destructive" size="sm" className="" onClick={handleDelete}>
								<Delete24Regular className="h-4 w-4 text-icon-error"/>
							</Button>)  : ""
						}
					</div>
					<Separator orientation="horizontal" className="w-full h-[1px] bg-border-primary"/>
				</div>

				{/* Quantity Picker */}
				<div className="flex flex-col gap-xs-mobile">
					<div className="flex gap-sm-mobile items-start">
						<VehicleTruckBagRegular className="text-icon-primary w-4 h-4"/>
						<p className="font-caption-lg-mobile text-text-primary mb-2">Quantity (MT)</p></div>
					<Button
						variant="outline"
						size="lg"
						className="w-full justify-between"
						onClick={() => setDrawerOpen(true)}
					>
						<span>{vehicle.qty ? `${vehicle.qty} MT` : "Select Quantity"}</span>
						<ChevronDown24Regular className="h-2 w-2 text-icon-primary"/>
					</Button>

					<Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="bottom">
						<DrawerContent className="h-[50vh] rounded-t-2xl px-4 pt-4 space-y-2">
							<DrawerHeader>
								<DrawerTitle>Select Quantity</DrawerTitle>
							</DrawerHeader>
							<div className="flex flex-col overflow-y-auto">
								{options.map((qty) => (
									<Button
										className="w-full"
										size="lg"
										key={qty}
										variant={vehicle.qty === qty ? "default" : "ghost"}
										onClick={() => {
											onQtyChange(qty)
											setDrawerOpen(false)
										}}
									>
										{qty} MT
									</Button>
								))}
							</div>
						</DrawerContent>
					</Drawer>
				</div>

				{/* Vehicle No */}
				<div className="flex flex-col gap-xs-mobile">
					<div className="flex gap-sm-mobile items-start">
						<NumberRow24Regular className="text-icon-primary w-4 h-4"/>
						<p className="font-caption-lg-mobile text-text-primary mb-2">Vehicle Number</p>
					</div>
					<Input
						size="lg"
						variant="outline"
						value={vehicle.vehicleno}
						onChange={(e) => onVehicleNoChange(e.target.value)}
						placeholder="Vehicle Number (e.g. KA 01 AB 1234)"
					/>
				</div>

				{/* Driver Details */}
				<div className="flex flex-col gap-xs-mobile">
					<div className="flex gap-sm-mobile items-start">
						<Person16Regular className="text-icon-primary w-4 h-4"/>
						<p className="font-caption-lg-mobile text-text-primary mb-2">Driver Details</p>
					</div>

					<Input
						size="lg"
						variant="outline"
						value={vehicle.driver}
						onChange={(e) => onDriverChange(e.target.value)}
						placeholder="Driver Name"
					/>

					<div className="flex items-start gap-md-mobile w-full">
						<Select defaultValue="+91">
							<SelectTrigger size="lg" variant="outline">
								<SelectValue/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="+91">+91</SelectItem>
							</SelectContent>
						</Select>

						<Input
							value={vehicle.phone}
							onChange={(e) => onPhoneChange(e.target.value)}
							errorMessage="Please enter a valid phone number"
							size="lg"
							variant="outline"
							type="tel"
							inputMode="numeric"
							pattern="\d*"
							maxLength={10}
							placeholder="Driver Phone Number"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
