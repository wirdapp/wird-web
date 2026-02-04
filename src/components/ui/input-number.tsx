import { Minus, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputNumberProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
	value?: number;
	onChange?: (value: number | undefined) => void;
	min?: number;
	max?: number;
	step?: number;
	showControls?: boolean;
	precision?: number;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
	(
		{
			className,
			value,
			onChange,
			min,
			max,
			step = 1,
			showControls = true,
			precision,
			disabled,
			...props
		},
		ref,
	) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const val = e.target.value;
			if (val === "" || val === "-") {
				onChange?.(undefined);
				return;
			}
			const num = parseFloat(val);
			if (!Number.isNaN(num)) {
				onChange?.(clamp(num, min, max));
			}
		};

		const increment = () => {
			const newValue = (value ?? 0) + step;
			const clamped = clamp(newValue, min, max);
			const rounded = precision !== undefined ? round(clamped, precision) : clamped;
			onChange?.(rounded);
		};

		const decrement = () => {
			const newValue = (value ?? 0) - step;
			const clamped = clamp(newValue, min, max);
			const rounded = precision !== undefined ? round(clamped, precision) : clamped;
			onChange?.(rounded);
		};

		const canIncrement = max === undefined || (value ?? 0) < max;
		const canDecrement = min === undefined || (value ?? 0) > min;

		const displayValue =
			value !== undefined
				? precision !== undefined
					? value.toFixed(precision)
					: String(value)
				: "";

		if (!showControls) {
			return (
				<Input
					ref={ref}
					type="number"
					className={className}
					value={displayValue}
					onChange={handleChange}
					min={min}
					max={max}
					step={step}
					disabled={disabled}
					{...props}
				/>
			);
		}

		return (
			<div className={cn("flex items-center", className)}>
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="h-11 w-11 rounded-e-none"
					onClick={decrement}
					disabled={disabled || !canDecrement}
				>
					<Minus className="h-5 w-5" />
				</Button>
				<Input
					ref={ref}
					type="number"
					className="h-11 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					value={displayValue}
					onChange={handleChange}
					min={min}
					max={max}
					step={step}
					disabled={disabled}
					{...props}
				/>
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="h-11 w-11 rounded-s-none"
					onClick={increment}
					disabled={disabled || !canIncrement}
				>
					<Plus className="h-5 w-5" />
				</Button>
			</div>
		);
	},
);
InputNumber.displayName = "InputNumber";

function clamp(value: number, min?: number, max?: number): number {
	let result = value;
	if (min !== undefined && result < min) result = min;
	if (max !== undefined && result > max) result = max;
	return result;
}

function round(value: number, precision: number): number {
	const factor = 10 ** precision;
	return Math.round(value * factor) / factor;
}

export { InputNumber };
