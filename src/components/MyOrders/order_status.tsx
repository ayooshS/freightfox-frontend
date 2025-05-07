import { Badge } from "@/components/ui/badge.tsx"

type OrderStatusType = "in-progress" | "done"

const STATUS_MAP: Record<OrderStatusType, { label: string; bgColor: string }> = {
	"in-progress": {
		label: "In Progress",
		bgColor: "bg-surface-warning text-text-warning",
	},
	"done": {
		label: "Done",
		bgColor: "bg-surface-success text-text-success",
	},
}

type Props = {
	status: OrderStatusType
	className?: string
}

export function OrderStatus({ status, className }: Props) {
	const { label, bgColor } = STATUS_MAP[status]

	return (
		<Badge
			variant="custom"
			text={label}
			bgColor={bgColor}
			className={className}
		/>
	)
}
