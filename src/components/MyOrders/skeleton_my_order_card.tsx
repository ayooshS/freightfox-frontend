import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function MyOrderCardSkeleton() {
	return (
		<Card className="rounded-xl-mobile bg-surface-primary p-4 space-y-3 cursor-pointer hover:bg-muted transition">
			{/* Header Skeleton */}
			<div className="flex flex-col">
				<div className="flex justify-between items-center w-full">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-24" />
					</div>
					<Skeleton className="h-6 w-6 rounded-full" />
				</div>
				<Separator orientation="horizontal" className="w-full h-[1px] bg-border-primary" />
			</div>

			{/* Product Info + Status Skeleton */}
			<div className="flex justify-between items-center">
				<div className="space-y-1">
					<Skeleton className="h-5 w-28" />
					<Skeleton className="h-4 w-40" />
				</div>
				<Skeleton className="h-6 w-20" />
			</div>

			{/* Progress Skeleton */}
			<div className="mb-2 space-y-2">
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-2.5 w-full rounded-full" />
			</div>
		</Card>
	)
}
