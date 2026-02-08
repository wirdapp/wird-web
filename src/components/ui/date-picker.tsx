import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

function toInputDate(date: Date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export interface DatePickerProps {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	dateFormat?: string;
	disabledDates?: (date: Date) => boolean;
	fromDate?: Date;
	toDate?: Date;
	title?: string;
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Pick a date",
	disabled = false,
	className,
	dateFormat = "PPP",
	fromDate,
	toDate,
}: DatePickerProps) {
	const isMobile = useIsMobile();
	const inputRef = useRef<HTMLInputElement>(null);

	if (isMobile) {
		return (
			<div className="relative">
				<Button
					variant="outline"
					className={cn(
						"w-full justify-start text-left font-normal",
						!value && "text-muted-foreground",
						className,
					)}
					disabled={disabled}
					onClick={() => inputRef.current?.showPicker()}
				>
					<CalendarIcon className="me-2 h-4 w-4" />
					{value ? format(value, dateFormat) : <span>{placeholder}</span>}
				</Button>
				<input
					ref={inputRef}
					type="date"
					className="absolute inset-0 opacity-0 pointer-events-none"
					tabIndex={-1}
					disabled={disabled}
					value={value ? toInputDate(value) : ""}
					min={fromDate ? toInputDate(fromDate) : undefined}
					max={toDate ? toInputDate(toDate) : undefined}
					onChange={(e) => {
						const val = e.target.value;
						if (val) {
							const [y, m, d] = val.split("-").map(Number);
							onChange?.(new Date(y, m - 1, d));
						} else {
							onChange?.(undefined);
						}
					}}
				/>
			</div>
		);
	}

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant="outline"
						className={cn(
							"w-full justify-start text-left font-normal",
							!value && "text-muted-foreground",
							className,
						)}
						disabled={disabled}
					/>
				}
			>
				<CalendarIcon className="me-2 h-4 w-4" />
				{value ? format(value, dateFormat) : <span>{placeholder}</span>}
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={value}
					onSelect={(date) => onChange?.(date)}
					fromDate={fromDate}
					toDate={toDate}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}

export interface DateRangePickerProps {
	value?: { from: Date | undefined; to: Date | undefined };
	onChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	dateFormat?: string;
	title?: string;
}

export function DateRangePicker({
	value,
	onChange,
	placeholder = "Pick a date range",
	disabled = false,
	className,
	dateFormat = "LLL dd, y",
}: DateRangePickerProps) {
	const isMobile = useIsMobile();
	const fromRef = useRef<HTMLInputElement>(null);
	const toRef = useRef<HTMLInputElement>(null);

	if (isMobile) {
		return (
			<div className="relative">
				<Button
					variant="outline"
					className={cn(
						"w-full justify-start text-left font-normal",
						!value?.from && "text-muted-foreground",
						className,
					)}
					disabled={disabled}
					onClick={() => fromRef.current?.showPicker()}
				>
					<CalendarIcon className="me-2 h-4 w-4" />
					{value?.from ? (
						value.to ? (
							<>
								{format(value.from, dateFormat)} - {format(value.to, dateFormat)}
							</>
						) : (
							format(value.from, dateFormat)
						)
					) : (
						<span>{placeholder}</span>
					)}
				</Button>
				<input
					ref={fromRef}
					type="date"
					className="absolute inset-0 opacity-0 pointer-events-none"
					tabIndex={-1}
					disabled={disabled}
					value={value?.from ? toInputDate(value.from) : ""}
					max={value?.to ? toInputDate(value.to) : undefined}
					onChange={(e) => {
						const val = e.target.value;
						if (val) {
							const [y, m, d] = val.split("-").map(Number);
							const from = new Date(y, m - 1, d);
							onChange?.({ from, to: value?.to });
							// Open the "to" picker after selecting "from"
							setTimeout(() => toRef.current?.showPicker(), 300);
						} else {
							onChange?.({ from: undefined, to: value?.to });
						}
					}}
				/>
				<input
					ref={toRef}
					type="date"
					className="absolute inset-0 opacity-0 pointer-events-none"
					tabIndex={-1}
					disabled={disabled}
					value={value?.to ? toInputDate(value.to) : ""}
					min={value?.from ? toInputDate(value.from) : undefined}
					onChange={(e) => {
						const val = e.target.value;
						if (val) {
							const [y, m, d] = val.split("-").map(Number);
							onChange?.({ from: value?.from, to: new Date(y, m - 1, d) });
						} else {
							onChange?.({ from: value?.from, to: undefined });
						}
					}}
				/>
			</div>
		);
	}

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant="outline"
						className={cn(
							"w-full justify-start text-left font-normal",
							!value?.from && "text-muted-foreground",
							className,
						)}
						disabled={disabled}
					/>
				}
			>
				<CalendarIcon className="me-2 h-4 w-4" />
				{value?.from ? (
					value.to ? (
						<>
							{format(value.from, dateFormat)} - {format(value.to, dateFormat)}
						</>
					) : (
						format(value.from, dateFormat)
					)
				) : (
					<span>{placeholder}</span>
				)}
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="range"
					selected={value}
					onSelect={(range) => {
						onChange?.({ from: range?.from, to: range?.to });
					}}
					numberOfMonths={2}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
