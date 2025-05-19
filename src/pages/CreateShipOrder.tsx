// src/pages/CreateShipOrder.tsx
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import {createShipOrder, fetchOrders} from "@/lib/api"
import { fetchPOdetails } from "@/lib/POapi"
import { cn } from "@/lib/utils.ts"
import { Separator } from "@/components/ui/separator.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
	Box24Regular,
	TextDescription24Regular,
	NumberSymbol24Regular,
	Money24Regular,
	Location24Regular,
	Person24Regular,
} from "@fluentui/react-icons"
import { showToast } from "@/components/ui/sonner.tsx"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

type CreateShipOrderProps = {
	open: boolean
	onOpenChange: (value: boolean) => void
	refetch: () => void
	onNewOrder: (so: { id: string; createdAt: number }) => void
}

export function CreateShipOrder({ open, onOpenChange, refetch, onNewOrder }: CreateShipOrderProps) {
	const [step, setStep] = useState<"enter" | "confirm">("enter")
	const [poId, setPoId] = useState("")
	const [bookedRate, setBookedRate] = useState("")
	const [poData, setPoData] = useState<any | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<{ title: string; message: string } | null>(null)
	const [submitting, setSubmitting] = useState(false)

	const [searchParams] = useSearchParams()
	const transporter_id = searchParams.get("transporter_id") ?? "T100"

	const resetForm = () => {
		setStep("enter")
		setPoId("")
		setBookedRate("")
		setPoData(null)
		setError(null)
	}

	const validPOFormat = (po: string) =>
		/^BZPO-\d{5}-\d{6}$/.test(po) || /^PO\/\d{2}\/[A-Z]{2}\/\d{4}$/.test(po)

	const handleFetchPO = async () => {
		if (!poId || !validPOFormat(poId)) return
		setLoading(true)
		setError(null)

		try {
			const result = await fetchPOdetails(poId)
			const item = result.items?.[0]
			if (!item) throw new Error(`Couldn't find purchase order for PO ID "${poId}"`)
			const existingOrders = await fetchOrders(transporter_id)
			const isDuplicate = existingOrders.some(
				(order: any) =>
					order.fulfilment_order_id === poId &&
					order.status.toLowerCase() !== "rejected"
			)

			if (isDuplicate) {
				setError({
					title: "Duplicate PO Detected",
					message: "A Ship Order for this PO already exists, please retry by entering another PO ID."
				})
				setLoading(false)
				return
			}

			setPoData(item)
			setStep("confirm")
		} catch (err: any) {
			setError({
				title: "PO Not Found",
				message: err.message || "We couldn’t find a purchase order for the ID. Please check the ID and try again.s"
			})
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async () => {
		if (!poData) return
		setSubmitting(true)

		const payload = {
			fulfilment_order_id: poId,
			transporter_id,
			unit_of_measurement: "MT",
			dispatch_plan: [],
			order_qty: poData.totalQuantity,
			booked_rate: bookedRate ? parseFloat(bookedRate) : 0,
			product_sku: poData.productSpecsSnapshot?.code ?? "N/A",
			product_description:
				(poData.productSpecsSnapshot?.aliasName ?? "") +
				" " +
				(poData.productSpecsSnapshot?.description ?? ""),
			pickup_address: poData.purchaseOrder?.fromEntitySnapshot?.registeredAddress?.streetAddress ?? "N/A",
			delivery_address: poData.purchaseOrder?.toBillingAddressSnapshot?.streetAddress ?? "N/A",
			buyer_name: poData.purchaseOrder?.fromEntitySnapshot?.name ?? "N/A",
		}

		const { data, error } = await createShipOrder(payload)
		console.log("SO RESPONSE", data);
		console.log("Saving in localStorage:", {
			id: data?.ship_order_id,
			createdAt: Date.now(),
		});
		setSubmitting(false)

		if (error) {
			setError({
				title: "Submission Failed",
				message: typeof error === "string" ? error : JSON.stringify(error)
			})
			showToast({
				type: "error",
				title: "Failed to create ship order",
				description: "Please try again later.",
			})
		} else {
			showToast({
				type: "success",
				title: "Ship Order Created",
				description: `SO created for PO ID ${poId}`,
			})
			refetch()
			resetForm()
			onOpenChange(false)
			onNewOrder({
				id: data.ship_order_id,
				createdAt: Date.now()
			})
			console.log("Ship Order Created Response", data)
		}
	}

	const renderEnterStep = () => (
		<div className="flex flex-col gap-4 px-4 py-2">
			<Input
				size="lg"
				variant="outline"
				type="text"
				placeholder="PO ID (e.g. BZPO-20069-254362 or PO/12/AB/1234)"
				value={poId}
				onChange={(e) => {
					setPoId(e.target.value)
					if (error) setError(null)
				}}
				error={poId.length > 0 && !validPOFormat(poId)}
				errorMessage="Enter valid PO-ID. Eg:BZPO-12345-678901 or PO/12/AB/1234"
			/>

			<Input
				size="lg"
				variant="outline"
				type="number"
				placeholder="Booked Rate (Optional)"
				value={bookedRate}
				onChange={(e) => setBookedRate(e.target.value)}
				min={0}
			/>

			{error && (
				<Alert variant="error">
					<AlertTitle>{error.title}</AlertTitle>
					<AlertDescription>{error.message}</AlertDescription>
				</Alert>
			)}

		</div>
	)


	const Row = ({
		             icon,
		             label,
		             value,
	             }: {
		icon: React.ReactNode
		label: string
		value: React.ReactNode
	}) => (
		<div className="flex items-start gap-sm-mobile justify-between w-full">
			<div className="flex gap-sm-mobile items-center min-w-[40%]">
				<div className="text-icon-primary">{icon}</div>
				<p className="font-caption-lg-mobile text-text-tertiary">{label}</p>
			</div>
			<p className="font-body-base-mobile text-text-primary text-right w-[35%] break-words">{value}</p>
		</div>
	)

	const renderConfirmStep = () => (
		<div className="px-xl-mobile">
			<div className="flex flex-col gap-4 px-xl-mobile py-xl-mobile border border-border-primary rounded-xl-mobile">
				<p className="font-body-base-mobile font-bold text-text-primary">{poId}</p>
				<Separator orientation="horizontal" className="w-full h-[1px] bg-border-primary" />

				<Row icon={<Person24Regular />} label="Buyer Name" value={poData?.purchaseOrder?.fromEntitySnapshot?.name} />
				<Row icon={<Box24Regular />} label="Product SKU" value={poData?.productSpecsSnapshot?.code} />
				<Row
					icon={<TextDescription24Regular />}
					label="Product Description"
					value={`${poData?.productSpecsSnapshot?.aliasName ?? ""} ${poData?.productSpecsSnapshot?.description ?? ""}`}
				/>
				<Row icon={<NumberSymbol24Regular />} label="Quantity" value={poData?.totalQuantity} />
				<Row icon={<Money24Regular />} label="Booked Rate" value={bookedRate || "₹0"} />
				<Row icon={<Location24Regular />} label="Pickup Address" value={poData?.purchaseOrder?.fromEntitySnapshot?.registeredAddress?.streetAddress} />
				<Row icon={<Location24Regular />} label="Delivery Address" value={poData?.purchaseOrder?.toBillingAddressSnapshot?.streetAddress} />
			</div>

			<div className="flex items-center mt-4 mb-6">
				<span className="font-body-base-mobile text-text-tertiary">Use a different PO?</span>
				<Button variant="link" size="lg" onClick={resetForm}>Click here</Button>
			</div>
		</div>
	)

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className={cn("h-[65vh]", "flex flex-col")}>
				<div className="overflow-y-auto flex-1 space-y-4 px-xl-mobile">
					<DrawerHeader className="px-xl-mobile">
						<DrawerTitle className="font-body-lg-mobile text-text-primary">Create New Ship Order</DrawerTitle>
						<DrawerDescription className="font-caption-lg-mobile text-text-tertiary">
							{step === "enter"
								? "Enter purchase order id to fetch details"
								: "Confirm purchase order details before proceeding"}
						</DrawerDescription>
					</DrawerHeader>

					{step === "enter" ? renderEnterStep() : renderConfirmStep()}
				</div>

				{/* ✅ Footer */}
				<div className="shadow-customprimary border-t border-border-primary bg-white p-xl-mobile pb-xl-mobile pt-xl-mobile flex gap-2 justify-end">
					{step === "enter" ? (
						<Button
							variant="default"
							size="lg"
							onClick={handleFetchPO}
							disabled={loading || !validPOFormat(poId) || Boolean(error)}
							className="w-full"
						>
							{loading ? "Fetching..." : "Fetch PO Details"}
						</Button>
					) : (
						<Button
							variant="default"
							size="lg"
							onClick={handleSubmit}
							disabled={submitting}
							className="w-full"
						>
							{submitting ? "Submitting..." : "Create Ship Order"}
						</Button>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	)
}
