// src/pages/CreateShipOrder.tsx
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
	DrawerClose
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createShipOrder } from "@/lib/api"

type CreateShipOrderProps = {
	open: boolean
	onOpenChange: (value: boolean) => void
	refetch: () => void // ✅ new prop
}


export function CreateShipOrder({open, onOpenChange, refetch }: CreateShipOrderProps) {
	const [form, setForm] = useState({
		ship_order_id: "",
		transporter_id: "T100", // or get from auth/session
		order_qty: 0,
		pickup_address: "",
		delivery_address: "",
		booked_rate: 0,
		product_sku: "",
		product_description: ""
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleChange = (field: keyof typeof form, value: string | number) => {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	const handleSubmit = async () => {
		setLoading(true)
		setError(null)

		const payload = {
			...form,
			unit_of_measurement: "MT",
			dispatch_plan: []
		}

		const { error } = await createShipOrder(payload)
		setLoading(false)

		if (error) {
			setError(error)
		} else {
			setForm({
				ship_order_id: "",
				transporter_id: "T100",
				order_qty: 0,
				pickup_address: "",
				delivery_address: "",
				booked_rate: 0,
				product_sku: "",
				product_description: ""
			})

			await refetch() // ✅ refresh list immediately
			onOpenChange(false) // ✅ close drawer after
		}
	}




	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader className="px-4">
					<DrawerTitle>Create New Ship Order</DrawerTitle>
					<DrawerDescription>Fill in the shipping details below</DrawerDescription>
				</DrawerHeader>

				<div className="flex flex-col gap-4 px-4 py-2">
					<input
						type="text"
						placeholder="Ship Order ID"
						value={form.ship_order_id}
						onChange={(e) => handleChange("ship_order_id", e.target.value)}
						className="border border-border-primary rounded p-2 text-sm"
					/>
					<input
						type="text"
						placeholder="Product SKU"
						value={form.product_sku}
						onChange={(e) => handleChange("product_sku", e.target.value)}
						className="border border-border-primary rounded p-2 text-sm"
					/>
					<input
						type="text"
						placeholder="Product Description"
						value={form.product_description}
						onChange={(e) => handleChange("product_description", e.target.value)}
						className="border border-border-primary rounded p-2 text-sm"
					/>
					<input
						type="number"
						placeholder="Quantity"
						value={form.order_qty}
						onChange={(e) => handleChange("order_qty", parseInt(e.target.value))}
						className="border border-border-primary rounded p-2 text-sm"
					/>
					<input
						type="text"
						placeholder="Pickup Address"
						value={form.pickup_address}
						onChange={(e) => handleChange("pickup_address", e.target.value)}
						className="border border-border-primary rounded p-2 text-sm"
					/>
					<input
						type="text"
						placeholder="Delivery Address"
						value={form.delivery_address}
						onChange={(e) => handleChange("delivery_address", e.target.value)}
						className="border border-border-primary rounded p-2 text-sm"
					/>
					<input
						type="number"
						placeholder="Booked Rate"
						value={form.booked_rate}
						onChange={(e) => handleChange("booked_rate", parseFloat(e.target.value))}
						className="border border-border-primary rounded p-2 text-sm"
					/>
					{error && (
						<p className="text-red-500 text-sm">
							{typeof error === "string" ? error : JSON.stringify(error)}
						</p>
					)}

				</div>

				<DrawerFooter>
					<Button type="submit" disabled={loading} onClick={handleSubmit}>
						{loading ? "Submitting..." : "Submit"}
					</Button>
					<DrawerClose asChild>
						<Button variant="ghost">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
