import dayjs from "dayjs";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/components/ui/date-picker";
import { useCriteria } from "../../../services/contest-criteria/queries";
import { useMemberDaySubmissions } from "../../../services/contest-results/queries";
import { useDashboardData } from "../../../util/routes-data";
import { DailySubmissionsTable } from "./daily-submissions-table";
import { DateSlider } from "./date-slider";

interface DailyUserSubmissionsProps {
	userId?: string;
}

export const DailyUserSubmissions: React.FC<DailyUserSubmissionsProps> = ({ userId }) => {
	const { t } = useTranslation();
	const { currentContest } = useDashboardData();
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [dateValue, setDateValue] = useState<Date | undefined>(undefined);

	const { data: criteriaData = [] } = useCriteria(currentContest?.id);
	const { data: submissionsData } = useMemberDaySubmissions(
		userId,
		selectedDate ?? undefined,
		currentContest?.id,
	);

	const submissions = (submissionsData as { points?: unknown[] } | undefined)?.points ?? [];

	useEffect(() => {
		if (currentContest?.start_date) {
			const startDate = dayjs(currentContest.start_date);
			setSelectedDate(startDate.format("YYYY-MM-DD"));
			setDateValue(startDate.toDate());
		}
	}, [currentContest?.start_date]);

	const handleDatePickerChange = (date: Date | undefined): void => {
		setDateValue(date);
		if (date) {
			setSelectedDate(dayjs(date).format("YYYY-MM-DD"));
		}
	};

	const handleSliderDateSelect = (date: string): void => {
		setSelectedDate(date);
		setDateValue(dayjs(date).toDate());
	};

	const fromDate = currentContest?.start_date
		? dayjs(currentContest.start_date).toDate()
		: undefined;
	const toDate = currentContest?.end_date ? dayjs(currentContest.end_date).toDate() : undefined;

	return (
		<div>
			{currentContest && userId && fromDate && toDate && (
				<div className="sticky -top-px z-10 bg-background -mx-6 px-6 py-3">
					<DateSlider
						fromDate={dayjs(fromDate)}
						toDate={dayjs(toDate)}
						userId={userId}
						contestId={String(currentContest.id)}
						selectedDate={selectedDate}
						onSelectDate={handleSliderDateSelect}
					/>
				</div>
			)}
			<div className="mb-4">
				<DatePicker
					value={dateValue}
					onChange={handleDatePickerChange}
					placeholder={t("dailySubmissionsPopup.date")}
					title={t("dailySubmissionsPopup.date")}
					fromDate={fromDate}
					toDate={toDate}
					className="w-[180px] h-8 text-xs"
				/>
			</div>
			<DailySubmissionsTable submissions={submissions as never[]} criteria={criteriaData} userId={userId} date={selectedDate} />
		</div>
	);
};
