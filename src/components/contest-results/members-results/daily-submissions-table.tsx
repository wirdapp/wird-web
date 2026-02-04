import dayjs from "dayjs";
import type React from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useUpdatePointRecord } from "../../../services/contest-results/queries";
import type { Criterion, PointRecordUpdateData } from "../../../types";
import { CriterionRecordAnswer } from "./criterion-record-answer";
import { CriterionRecordPoints } from "./criterion-record-points";

interface PointRecordData {
	id: string;
	point_total: number;
	contest_criterion_data: {
		id: string;
		label: string;
	};
	resourcetype: string;
	record_date: string;
	person: string;
	timestamp: string;
	user_input?: string;
	number?: number;
	checked?: boolean;
	choices?: string[];
	choice?: string;
}

interface DailySubmissionsTableProps {
	submissions: PointRecordData[];
	onUpdated?: (record?: PointRecordData) => void;
	criteria: Criterion[];
}

interface UpdateRecordParams {
	record: PointRecordData;
	data: PointRecordUpdateData;
}

export const DailySubmissionsTable: React.FC<DailySubmissionsTableProps> = ({
	submissions,
	onUpdated,
	criteria,
}) => {
	const { t } = useTranslation();
	const updatePointRecord = useUpdatePointRecord();

	const onUpdateRecord = useCallback(
		async ({ record, data }: UpdateRecordParams): Promise<PointRecordData> => {
			try {
				const updatedRecord = await updatePointRecord.mutateAsync({
					recordId: record.id,
					date: record.record_date,
					userId: record.person,
					data,
				});
				toast.success(t("saved-successfully"));
				onUpdated?.(updatedRecord as unknown as PointRecordData);
				return updatedRecord as unknown as PointRecordData;
			} catch (_error) {
				toast.error(t("failedToSave"));
			}
			return record;
		},
		[updatePointRecord, onUpdated, t],
	);

	return (
		<div className="-mx-3.5 md:mx-0">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[50px]">#</TableHead>
						<TableHead className="w-[250px]">{t("dailySubmissionsPopup.criteriaTitle")}</TableHead>
						<TableHead className="w-[200px]">{t("dailySubmissionsPopup.points")}</TableHead>
						<TableHead>{t("dailySubmissionsPopup.answer")}</TableHead>
						<TableHead>{t("dailySubmissionsPopup.lastUpdated")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{submissions.map((submission, index) => (
						<TableRow key={submission.id}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{submission.contest_criterion_data.label}</TableCell>
							<TableCell>
								<CriterionRecordPoints
									pointRecord={submission}
									criteria={criteria}
									onSave={onUpdateRecord}
								/>
							</TableCell>
							<TableCell>
								<CriterionRecordAnswer
									pointRecord={submission}
									criteria={criteria}
									onSave={onUpdateRecord}
								/>
							</TableCell>
							<TableCell>{dayjs(submission.timestamp).format("YYYY-MM-DD hh:mm A")}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
