import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function SkeletonRequestCard() {
    return (
        <Card className="rounded-xl-mobile bg-surface-primary p-4 space-y-3">
            {/* Header */}
            <div className="flex flex-col">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-[80px]" />
                        <Skeleton className="h-4 w-[60px] rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-5" />
                </div>

            </div>

            {/* Title + Quantity */}
            <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-[45%]" />
                <div className="flex flex-col gap-1 items-end">
                    <Skeleton className="h-4 w-[50px]" />
                    <Skeleton className="h-3 w-[80px]" />
                </div>
            </div>

            {/* Pickup & Drop section */}
            <div className="flex justify-between items-center relative">
                <div className="flex flex-col items-center gap-1 z-[10]">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-[80px]" />
                </div>

                {/* Dashed line */}


                <div className="flex flex-col items-center gap-1 z-[10]">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-[80px]" />
                </div>
            </div>

            {/* CTA Button */}
            <Skeleton className="h-10 w-full rounded-md mt-2" />
        </Card>
    )
}
