import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
	image?: React.ReactNode;
	imageStyle?: React.CSSProperties;
	description?: React.ReactNode;
}

const EmptyImage = () => (
	<svg
		className="h-24 w-24 text-muted-foreground/50"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		strokeWidth={1}
	>
		<title>Empty inbox</title>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
		/>
	</svg>
);

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
	({ className, image, imageStyle, description = "No data", children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn("flex flex-col items-center justify-center py-8 px-4 text-center", className)}
				{...props}
			>
				<div style={imageStyle} className="mb-4">
					{image || <EmptyImage />}
				</div>
				{description && <p className="text-muted-foreground text-sm">{description}</p>}
				{children && <div className="mt-4">{children}</div>}
			</div>
		);
	},
);
Empty.displayName = "Empty";

export { Empty };
