import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Pick a date",
	disabled = false,
	className,
	dateFormat = "PPP",
	disabledDates,
	fromDate,
	toDate,
}: DatePickerProps) {
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
					onSelect={onChange}
					disabled={disabledDates}
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
}

export function DateRangePicker({
	value,
	onChange,
	placeholder = "Pick a date range",
	disabled = false,
	className,
	dateFormat = "LLL dd, y",
}: DateRangePickerProps) {
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
				<CalendarIcon className="mr-2 h-4 w-4" />
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
						onChange?.({
							from: range?.from,
							to: range?.to,
						});
					}}
					numberOfMonths={2}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
