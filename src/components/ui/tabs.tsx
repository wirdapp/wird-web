import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
	({ className, ...props }, ref) => (
		<TabsPrimitive.List
			ref={ref}
			className={cn(
				"flex w-full h-auto items-center justify-start gap-6 overflow-x-auto border-b border-border bg-transparent p-0 text-muted-foreground",
				className,
			)}
			{...props}
		/>
	),
);
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<"button"> & { value: unknown }
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Tab
		ref={ref}
		className={cn(
			"relative inline-flex items-center justify-center whitespace-nowrap px-2 pb-3.5 pt-2.5 text-base font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active]:text-primary text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[active]:after:bg-primary",
			className,
		)}
		{...props}
	/>
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<"div"> & { value: unknown }
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Panel
		ref={ref}
		className={cn(
			"mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className,
		)}
		{...props}
	/>
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
