import { useQueries } from "@tanstack/react-query";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ContestResultsService } from "../../../services/contest-results/contest-results.service";
import { contestResultsKeys } from "../../../services/contest-results/queries";

interface DateSliderProps {
	fromDate: Dayjs;
	toDate: Dayjs;
	userId: string;
	contestId: string;
	selectedDate: string | null;
	onSelectDate: (date: string) => void;
}

export function DateSlider({
	fromDate,
	toDate,
	userId,
	contestId,
	selectedDate,
	onSelectDate,
}: DateSliderProps) {
	const { t } = useTranslation();
	const [centerDate, setCenterDate] = useState<Dayjs>(fromDate);

	// Jump slider to show the selected date when it changes (e.g. from date picker)
	useEffect(() => {
		if (!selectedDate) return;
		const selected = dayjs(selectedDate);
		setCenterDate((prev) => {
			const leftmost = prev.subtract(2, "day");
			const rightmost = prev.add(2, "day");
			if (selected.isBefore(leftmost, "day") || selected.isAfter(rightmost, "day")) {
				return selected;
			}
			return prev;
		});
	}, [selectedDate]);

	const days = Array.from({ length: 5 }, (_, i) => centerDate.add(i - 2, "day"));

	const queries = useQueries({
		queries: days.map((day) => {
			const dateStr = day.format("YYYY-MM-DD");
			const inRange = !day.isBefore(fromDate, "day") && !day.isAfter(toDate, "day");
			return {
				queryKey: contestResultsKeys.memberDaySubmissions(contestId, userId, dateStr),
				queryFn: () =>
					ContestResultsService.getMemberDaySubmissions({
						userId,
						date: dateStr,
						contestId,
					}),
				enabled: inRange,
				staleTime: 5 * 60 * 1000,
			};
		}),
	});

	const leftmost = centerDate.subtract(2, "day");
	const rightmost = centerDate.add(2, "day");
	const prevDisabled = !leftmost.isAfter(fromDate, "day");
	const nextDisabled = !rightmost.isBefore(toDate, "day");

	const handlePrev = () => setCenterDate((c) => c.subtract(5, "day"));
	const handleNext = () => setCenterDate((c) => c.add(5, "day"));

	return (
		<div className="flex items-center justify-center gap-1" dir="ltr">
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 shrink-0"
				onClick={handlePrev}
				disabled={prevDisabled}
				aria-label={t("dailySubmissionsPopup.previousDays")}
			>
				<ChevronLeftIcon className="size-4" />
			</Button>

			<div className="flex gap-1">
				{days.map((day, i) => {
					const dateStr = day.format("YYYY-MM-DD");
					const inRange = !day.isBefore(fromDate, "day") && !day.isAfter(toDate, "day");

					if (!inRange) {
						return <div key={dateStr} className="w-12 h-14" />;
					}

					const query = queries[i];
					const isSelected = selectedDate === dateStr;

					if (query.isLoading) {
						return (
							<div
								key={dateStr}
								className="w-12 h-14 flex flex-col items-center justify-center gap-1"
							>
								<Skeleton className="w-6 h-4 rounded" />
								<Skeleton className="w-8 h-3 rounded" />
							</div>
						);
					}

					const data = query.data;
					const hasSubmissions = Array.isArray(data)
						? data.length > 0
						: !!(data as { points?: unknown[] } | undefined)?.points?.length;

					if (!hasSubmissions) {
						return (
							<TooltipProvider key={dateStr}>
								<Tooltip>
									<TooltipTrigger
										render={
											<div className="w-12 h-14 rounded-md flex flex-col items-center justify-center text-xs text-muted-foreground/40 cursor-default" />
										}
									>
										<span className="text-base font-semibold leading-tight">{day.format("D")}</span>
										<span className="text-[10px] leading-tight">{day.format("MMM")}</span>
									</TooltipTrigger>
									<TooltipContent side="bottom">
										{t("dailySubmissionsPopup.noSubmissions")}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						);
					}

					return (
						<button
							type="button"
							key={dateStr}
							onClick={() => onSelectDate(dateStr)}
							className={cn(
								"w-12 h-14 rounded-md flex flex-col items-center justify-center text-xs transition-colors",
								isSelected
									? "bg-primary text-primary-foreground"
									: "text-primary hover:bg-muted cursor-pointer",
							)}
						>
							<span className="text-base font-semibold leading-tight">{day.format("D")}</span>
							<span className="text-[10px] leading-tight">{day.format("MMM")}</span>
						</button>
					);
				})}
			</div>

			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 shrink-0"
				onClick={handleNext}
				disabled={nextDisabled}
				aria-label={t("dailySubmissionsPopup.nextDays")}
			>
				<ChevronRightIcon className="size-4" />
			</Button>
		</div>
	);
}
