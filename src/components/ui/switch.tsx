import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import * as React from "react";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<HTMLElement, Omit<SwitchPrimitive.Root.Props, "ref">>(
	({ className, ...props }, ref) => (
		<SwitchPrimitive.Root
			className={cn(
				"peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary data-[unchecked]:bg-input",
				className,
			)}
			{...props}
			ref={ref}
		>
			<SwitchPrimitive.Thumb
				className={cn(
					"pointer-events-none block h-5 w-5 rounded-full bg-background ring-0 transition-transform data-[checked]:translate-x-5 data-[unchecked]:translate-x-0.5",
				)}
			/>
		</SwitchPrimitive.Root>
	),
);
Switch.displayName = "Switch";

export { Switch };
