import type * as React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedItem {
	value: string;
	label: React.ReactNode;
}

export interface SegmentedProps {
	items: SegmentedItem[];
	value: string;
	onValueChange: (value: string) => void;
	disabled?: boolean;
	className?: string;
}

export const Segmented: React.FC<SegmentedProps> = ({
	items,
	value,
	onValueChange,
	disabled,
	className,
}) => {
	return (
		<div className={cn("inline-flex w-fit rounded-lg bg-muted p-1", className)}>
			{items.map((item) => (
				<button
					key={item.value}
					type="button"
					disabled={disabled}
					onClick={() => onValueChange(item.value)}
					className={cn(
						"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						"disabled:pointer-events-none disabled:opacity-50",
						value === item.value
							? "bg-background text-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{item.label}
				</button>
			))}
		</div>
	);
};
