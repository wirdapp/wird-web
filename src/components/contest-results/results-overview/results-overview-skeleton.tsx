import { PresentationChartLineIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ResultsOverviewSkeleton: React.FC = () => {
	return (
		<div className="flex flex-col gap-6">
			<Skeleton className="h-6 w-[250px] rounded-xl" />
			<div className="flex items-center justify-center h-[150px] w-full rounded-xl bg-primary/10 animate-pulse">
				<PresentationChartLineIcon className="h-6 w-6 text-muted-foreground" />
			</div>
			<div className="mt-4 flex flex-col gap-6">
				<Skeleton className="h-[60px] w-full rounded-xl" />
				<Skeleton className="h-[60px] w-full rounded-xl" />
				<Skeleton className="h-[60px] w-full rounded-xl" />
				<Skeleton className="h-[60px] w-full rounded-xl" />
				<Skeleton className="h-[60px] w-full rounded-xl" />
			</div>
		</div>
	);
};
