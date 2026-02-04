import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ResultProps extends React.HTMLAttributes<HTMLDivElement> {
	status: "success" | "error" | "warning" | "info";
	title: string;
	subTitle?: string;
	icon?: React.ReactNode;
	extra?: React.ReactNode;
}

const statusConfig = {
	success: {
		icon: CheckCircle,
		iconColor: "text-green-500",
	},
	error: {
		icon: XCircle,
		iconColor: "text-destructive",
	},
	warning: {
		icon: AlertCircle,
		iconColor: "text-yellow-500",
	},
	info: {
		icon: Info,
		iconColor: "text-blue-500",
	},
};

const Result = React.forwardRef<HTMLDivElement, ResultProps>(
	({ className, status, title, subTitle, icon, extra, ...props }, ref) => {
		const config = statusConfig[status];
		const IconComponent = config.icon;

		return (
			<div
				ref={ref}
				className={cn(
					"flex flex-col items-center justify-center py-12 px-6 text-center",
					className,
				)}
				{...props}
			>
				<div className={cn("mb-6", config.iconColor)}>
					{icon || <IconComponent className="h-16 w-16" />}
				</div>
				<h3 className="text-2xl font-semibold mb-2">{title}</h3>
				{subTitle && <p className="text-muted-foreground text-base mb-6 max-w-md">{subTitle}</p>}
				{extra && <div className="flex gap-3">{extra}</div>}
			</div>
		);
	},
);
Result.displayName = "Result";

export interface ResultButtonProps extends React.ComponentProps<typeof Button> {
	children: React.ReactNode;
}

const ResultButton = React.forwardRef<HTMLButtonElement, ResultButtonProps>(
	({ children, ...props }, ref) => {
		return (
			<Button ref={ref} {...props}>
				{children}
			</Button>
		);
	},
);
ResultButton.displayName = "ResultButton";

export { Result, ResultButton };
