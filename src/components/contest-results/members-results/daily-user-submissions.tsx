import dayjs from "dayjs";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCriteria } from "../../../services/contest-criteria/queries";
import { useMemberDaySubmissions } from "../../../services/contest-results/queries";
import { useDashboardData } from "../../../util/routes-data";
import { DailySubmissionsTable } from "./daily-submissions-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DailyUserSubmissionsProps {
	onUpdated?: () => void;
	userId?: string;
}

export const DailyUserSubmissions: React.FC<DailyUserSubmissionsProps> = ({
	onUpdated,
	userId,
}) => {
	const { t } = useTranslation();
	const { currentContest } = useDashboardData();
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [dateValue, setDateValue] = useState("");

	const { data: criteriaData = [] } = useCriteria(currentContest?.id);
	const {
		data: submissionsData,
		isLoading: loading,
		refetch,
	} = useMemberDaySubmissions(userId, selectedDate ?? undefined, currentContest?.id);

	const submissions = (submissionsData as { points?: unknown[] } | undefined)?.points ?? [];

	useEffect(() => {
		setSelectedDate(null);
		setDateValue("");
	}, [userId]);

	const handleLoadSubmissions = (): void => {
		if (dateValue) {
			setSelectedDate(dateValue);
		}
	};

	const afterRecordUpdate = (): void => {
		refetch();
		onUpdated?.();
	};

	const minDate = currentContest?.start_date
		? dayjs(currentContest.start_date).format("YYYY-MM-DD")
		: undefined;
	const maxDate = currentContest?.end_date
		? dayjs(currentContest.end_date).format("YYYY-MM-DD")
		: undefined;

	return (
		<div>
			<div className="flex flex-wrap items-end gap-4 mb-6">
				<div className="flex flex-col gap-2">
					<Label>{t("dailySubmissionsPopup.date")}</Label>
					<Input
						type="date"
						value={dateValue}
						onChange={(e) => setDateValue(e.target.value)}
						min={minDate}
						max={maxDate}
						className="w-[200px]"
					/>
				</div>
				<Button
					onClick={handleLoadSubmissions}
					disabled={!dateValue || loading}
				>
					{loading ? t("loading") : t("dailySubmissionsPopup.load")}
				</Button>
			</div>
			<DailySubmissionsTable
				submissions={submissions as never[]}
				criteria={criteriaData}
				onUpdated={afterRecordUpdate}
			/>
		</div>
	);
};
