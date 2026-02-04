import type React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ContestStatus } from "../../types";

interface ContestBadgeProps {
	status: ContestStatus;
	variant?: "badge" | "inline";
}

const statusClasses: Record<ContestStatus, string> = {
	[ContestStatus.NOT_STARTED]: "bg-amber-500",
	[ContestStatus.STARTED]: "bg-blue-500",
	[ContestStatus.FINISHED]: "bg-emerald-500",
};

export const ContestBadge: React.FC<ContestBadgeProps> = ({ status, variant = "badge" }) => {
	const { t } = useTranslation();

	if (variant === "inline") {
		return (
			<span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
				<span className={cn("size-2 rounded-full shrink-0", statusClasses[status])} />
				{t(`contestStatus.${status}`)}
			</span>
		);
	}

	return (
		<div
			className={cn(
				"inline-flex items-center justify-center rounded-xl px-2 py-1 text-xs font-bold uppercase text-white",
				statusClasses[status]
			)}
		>
			{t(`contestStatus.${status}`)}
		</div>
	);
};
