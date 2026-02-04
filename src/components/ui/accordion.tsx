import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

// Compatibility wrapper: Radix uses type="single"|"multiple" with string/string[] value,
// Base UI uses value as any[] always. This wrapper adapts the Radix-style API.
const Accordion = React.forwardRef<
	HTMLDivElement,
	Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue"> & {
		type?: "single" | "multiple";
		collapsible?: boolean;
		value?: string | string[] | undefined;
		defaultValue?: string | string[] | undefined;
		onValueChange?: (value: string | string[]) => void;
		disabled?: boolean;
	}
>(
	(
		{ type = "single", collapsible: _collapsible, value, defaultValue, onValueChange, ...props },
		ref,
	) => {
		const multiple = type === "multiple";

		// Convert single value to array for Base UI
		const arrayValue =
			value === undefined ? undefined : Array.isArray(value) ? value : value ? [value] : [];

		const arrayDefaultValue =
			defaultValue === undefined
				? undefined
				: Array.isArray(defaultValue)
					? defaultValue
					: defaultValue
						? [defaultValue]
						: [];

		const handleValueChange = React.useCallback(
			(newValue: unknown[]) => {
				if (!onValueChange) return;
				if (multiple) {
					onValueChange(newValue as string[]);
				} else {
					onValueChange((newValue[0] as string) ?? "");
				}
			},
			[onValueChange, multiple],
		);

		return (
			<AccordionPrimitive.Root
				ref={ref}
				value={arrayValue}
				defaultValue={arrayDefaultValue}
				onValueChange={handleValueChange}
				{...props}
			/>
		);
	},
);
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<"div"> & { value: unknown }
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<"button">
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				"flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-panel-open]>svg]:rotate-180",
				className,
			)}
			{...props}
		>
			{children}
			<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
	({ className, children, ...props }, ref) => (
		<AccordionPrimitive.Panel ref={ref} className="overflow-hidden text-sm" {...props}>
			<div className={cn("pb-4 pt-0", className)}>{children}</div>
		</AccordionPrimitive.Panel>
	),
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
