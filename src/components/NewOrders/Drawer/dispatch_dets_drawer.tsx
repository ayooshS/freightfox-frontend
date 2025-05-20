// components/DeliveryDetailsDrawer.tsx
import { Separator } from "@/components/ui/separator"
// import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";



type DispatchEntry = {
	vehicle: number
	size: number
	eta: string
}

type Props = {
	dispatch_plan: DispatchEntry[]
	booked_rate: number
}


export function DispatchDetailsDrawer({ booked_rate }: Props) {
	return (
		<div className="bg-surface-secondary rounded-xl-mobile items-stretch px-2 py-2 pt-8 pb-8 flex flex-col gap-xl-mobile">
			<div className="flex flex-col gap-md-mobile">
				<div className="flex flex-col gap-xs-mobile">
					<div className="font-body-base-mobile text-text-primary">
						Dispatch Plan
					</div>
					<div className="font-overline-sm-mobile text-text-tertiary">
						Booked @₹{booked_rate}/MT
					</div>
				</div>
				<Separator orientation="horizontal" className="w-full h-[1px] bg-border-primary" />
			</div>

			{/*<Table>*/}
			{/*	<TableHeader>*/}
			{/*		<TableRow>*/}
			{/*			<TableHead className="font-body-base-mobile text-text-secondary">Vehicle</TableHead>*/}
			{/*			<TableHead className="font-body-base-mobile text-text-secondary">Size(MT)</TableHead>*/}
			{/*			<TableHead className="font-body-base-mobile text-text-secondary">ETA</TableHead>*/}
			{/*		</TableRow>*/}
			{/*		*/}
			{/*	</TableHeader>*/}
			{/*	<TableBody>*/}
			{/*		{dispatch_plan.map((entry, index) => (*/}
			{/*			<TableRow key={index}>*/}
			{/*				<TableCell className="font-body-base-mobile text-text-primary" >{entry.vehicle}</TableCell>*/}
			{/*				<TableCell className="font-body-base-mobile text-text-primary" >{entry.size}</TableCell>*/}
			{/*				<TableCell className="font-body-base-mobile text-text-primary" >{entry.eta}</TableCell>*/}
			{/*			</TableRow>*/}
			{/*		))}*/}
			{/*	</TableBody>*/}
			{/*</Table>*/}



		</div>
	)
}
