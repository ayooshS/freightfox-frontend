import { useState } from "react"
import { useDispatch } from "react-redux"
import {
	VehicleTruckBagRegular,
	NumberRow24Regular,
	Person16Regular,
	ChevronDown24Regular,
	Delete24Regular, ReceiptMoney20Regular, DocumentTableTruck20Regular,
} from "@fluentui/react-icons"
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { removeVehicle, Vehicle } from "@/store/slice/vehicleSlice"
import { cva, type VariantProps } from "class-variance-authority"

// ✅ Styling variants using cva
const vehicleCardVariants = cva(
	"rounded-xl-mobile flex flex-col gap-6",
	{
		variants: {
			type: {
				edit: "bg-surface-primary px-lg-mobile py-lg-mobile pt-xxl-mobile pb-xxl-mobile",
				view: "bg-surface-primary px-lg-mobile py-lg-mobile pt-xxl-mobile pb-xxl-mobile",
			},
		},
		defaultVariants: {
			type: "edit",
		},
	}
)

type VehicleCardProps = {
	vehicle: Vehicle
	index: number
	type?: "edit" | "view"
	onVehicleNoChange?: (val: string) => void
	onDriverChange?: (val: string) => void
	onPhoneChange?: (val: string) => void
	onQtyChange?: (qty: number) => void
	onInvoiceChange?: (val: string) => void
	onEwayChange?: (val: string) => void
	onLorryChange?: (val: string) => void
} & VariantProps<typeof vehicleCardVariants>

export function VehicleCard({
	                            vehicle,
	                            index,
	                            type = "edit",
	                            onVehicleNoChange,
	                            onDriverChange,
	                            onPhoneChange,
	                            onQtyChange,
								onInvoiceChange,
								onEwayChange,
								onLorryChange,
                            }: VehicleCardProps) {
	const dispatch = useDispatch()
	const [drawerOpen, setDrawerOpen] = useState(false)

	const handleDelete = () => dispatch(removeVehicle(vehicle.id!))

	return (
		<div className="pb-4">
			<Card className={vehicleCardVariants({ type })}>
				{/* Header */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<div className="flex flex-col">
							<p className="font-body-base-mobile text-text-primary">
								{`Vehicle ${index + 1}`}
							</p>
							{type === "view" && (
								<p className="font-overline-sm-mobile text-text-tertiary">{vehicle.driver_name} • {vehicle.driver_mobile_number}</p>
							)}
						</div>

						{type === "edit" && index > 0 && (
							<Button variant="destructive" size="sm" onClick={handleDelete}>
								<Delete24Regular className="h-4 w-4 text-icon-error" />
							</Button>
						)}
					</div>

					<Separator orientation="horizontal" className="w-full h-[1px] bg-border-primary" />
				</div>

				{/* Content */}
				{type === "edit" ? (
					<EditContent
						vehicle={vehicle}
						drawerOpen={drawerOpen}
						setDrawerOpen={setDrawerOpen}
						onQtyChange={onQtyChange}
						onVehicleNoChange={onVehicleNoChange}
						onDriverChange={onDriverChange}
						onPhoneChange={onPhoneChange}
						onInvoiceChange={onInvoiceChange}
						onEwayChange={onEwayChange}
						onLorryChange={onLorryChange}

					/>
				) : (
					<ViewContent vehicle={vehicle} />
				)}
			</Card>
		</div>
	)
}

// ✅ Edit mode UI
function EditContent({
	                     vehicle,
	                     drawerOpen,
	                     setDrawerOpen,
	                     onQtyChange,
	                     onVehicleNoChange,
	                     onDriverChange,
	                     onPhoneChange,
	                     onInvoiceChange,
	                     onEwayChange,
	                     onLorryChange,
                     }: {
	vehicle: Vehicle
	drawerOpen: boolean
	setDrawerOpen: (open: boolean) => void
	onQtyChange?: (val: number) => void
	onVehicleNoChange?: (val: string) => void
	onDriverChange?: (val: string) => void
	onPhoneChange?: (val: string) => void
	onInvoiceChange?: (val: string) => void
	onEwayChange?: (val: string) => void
	onLorryChange?: (val: string) => void
}) {
	const options = [10, 12, 15, 20, 25, 30, 35, 40, 42]

	return (
		<>
			{/* Quantity Picker */}
			<div className="flex flex-col gap-xs-mobile">
				<div className="flex gap-sm-mobile items-start">
					<VehicleTruckBagRegular className="text-icon-primary w-4 h-4" />
					<p className="font-caption-lg-mobile text-text-primary mb-2">Quantity (MT)</p>
				</div>
				<Button
					variant="outline"
					size="lg"
					className="w-full justify-between"
					onClick={() => setDrawerOpen(true)}
				>
					<span>{vehicle.capacity ? `${vehicle.capacity} MT` : "Select Quantity"}</span>
					<ChevronDown24Regular className="h-2 w-2 text-icon-primary" />
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
									variant={vehicle.capacity === qty ? "default" : "ghost"}
									onClick={() => {
										onQtyChange?.(qty)
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



			{/* Driver Details */}
			<div className="">
				<div className="flex flex-col gap-xs-mobile">
					<div className="flex gap-sm-mobile items-start">
						<Person16Regular className="text-icon-primary w-4 h-4"/>
						<p className="font-caption-lg-mobile text-text-primary mb-2">Driver Details</p>
					</div>
					<Input
						size="lg"
						variant="outline"
						value={vehicle.driver_name}
						onChange={(e) => {
							const alphaValue = e.target.value.replace(/[^a-zA-Z\s]/g, "")
							const capitalized = alphaValue
								.split(" ")
								.map(word =>
									word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
								)
								.join(" ")
							onDriverChange?.(capitalized)
						}}
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
							value={vehicle.driver_mobile_number}
							onChange={(e) => {
								const numericValue = e.target.value.replace(/\D/g, "")
								onPhoneChange?.(numericValue)
							}}
							size="lg"
							variant="outline"
							type="tel"
							inputMode="numeric"
							maxLength={10}
							placeholder="Driver Phone Number"
							error={vehicle.driver_mobile_number.length > 0 && vehicle.driver_mobile_number.length !== 10}
							errorMessage="Please enter a valid phone number"
						/>
					</div>
				</div>

				
			</div>


			<div className="flex gap-md-mobile w-full">
				<div className="flex flex-col gap-xs-mobile">
					<div className="flex gap-sm-mobile items-start">
						<NumberRow24Regular className="text-icon-primary w-4 h-4"/>
						<p className="font-caption-lg-mobile text-text-primary mb-2">Vehicle Number</p>
					</div>
					<Input
						size="lg"
						variant="outline"
						value={vehicle.vehicle_number}
						onChange={(e) => {
							const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
							const parts = []

							if (raw.length > 0) parts.push(raw.slice(0, 2))       // KA
							if (raw.length > 2) parts.push(raw.slice(2, 4))       // 01
							if (raw.length > 4) parts.push(raw.slice(4, 6))       // AB
							if (raw.length > 6) parts.push(raw.slice(6, 10))      // 1234

							const formatted = parts.join(" ")
							onVehicleNoChange?.(formatted)
						}}
						placeholder="Eg. KA 01 AB 1234"
						error={
							vehicle.vehicle_number.length > 0 &&
							!/^[A-Z]{2}\s\d{2}\s[A-Z]{1,2}\s\d{1,4}$/.test(vehicle.vehicle_number)
						}
						errorMessage="Please enter a valid vehicle number"
						maxLength={13} // includes spaces: "KA 01 AB 1234" = 13 chars
					/>

				</div>

				<div className="flex flex-col gap-xs-mobile">
					<div className="flex gap-sm-mobile items-start">
						<ReceiptMoney20Regular className="text-icon-primary w-4 h-4"/>
						<p className="font-caption-lg-mobile text-text-primary mb-2">Invoice Number</p>

					</div>
					<Input
						size="lg"
						variant="outline"
						value={vehicle.invoice_number}
						onChange={(e) => onInvoiceChange?.(e.target.value.toUpperCase())}
						placeholder="Eg. INV-0001"
					/>
				</div>
			</div>

			<div className="flex gap-md-mobile w-full">
				<div className="flex flex-col gap-xs-mobile flex-1">
					<div className="flex gap-sm-mobile items-start">
						<DocumentTableTruck20Regular className="text-icon-primary w-4 h-4"/>
						<p className="font-caption-lg-mobile text-text-primary mb-2">E-Way Bill Number</p>
					</div>
					<Input
						size="lg"
						variant="outline"
						value={vehicle.eway_bill_number}
						onChange={(e) => onEwayChange?.(e.target.value.toUpperCase())}
						placeholder="Eg. 16001938B"
					/>
				</div>

				<div className="flex flex-col gap-xs-mobile flex-1">
					<div className="flex gap-sm-mobile items-start">
						<DocumentTableTruck20Regular className="text-icon-primary w-4 h-4"/>
						<p className="font-caption-lg-mobile text-text-primary mb-2">Lorry Receipt Number</p>
					</div>
					<Input
						size="lg"
						variant="outline"
						value={vehicle.lorry_receipt_number}
						onChange={(e) => onLorryChange?.(e.target.value.toUpperCase())}
						placeholder="Eg. 939SKS22"

					/>
				</div>
			</div>

		</>
	)
}

// ✅ View-only mode UI
function ViewContent({ vehicle }: { vehicle: Vehicle }) {
	return (
		<div className="flex justify-between items-center">
			<div>
				<p className="font-body-lg-mobile text-text-primary">{vehicle.vehicle_number}</p>
				<p className="font-overline-sm-mobile text-text-tertiary line-clamp-2 break-words">
					  {vehicle.invoice_number} • {vehicle.eway_bill_number} • {vehicle.lorry_receipt_number}
				</p>
			</div>
			<div className="text-right">
				<p className="font-body-lg-mobile text-text-primary">{vehicle.capacity} MT</p>
			</div>
		</div>
	)
}
