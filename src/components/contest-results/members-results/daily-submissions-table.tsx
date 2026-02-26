import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { Pencil, Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FieldTypes, FieldTypesIcons } from "../../../services/contest-criteria/consts";
import {
	useCreatePointRecord,
	useUpdatePointRecord,
} from "../../../services/contest-results/queries";
import type { Criterion, PointRecordCreateData, PointRecordUpdateData } from "../../../types";
import { isAtLeastAdmin, isAtLeastSuperAdmin } from "../../../util/roles";
import { useDashboardData } from "../../../util/routes-data";
import { CriterionField } from "../../ContestCriteria/criterion-field";

const pointRecordToCriterionType: Record<string, string> = {
	UserInputPointRecord: "UserInputCriterion",
	NumberPointRecord: "NumberCriterion",
	CheckboxPointRecord: "CheckboxCriterion",
	MultiCheckboxPointRecord: "MultiCheckboxCriterion",
	RadioPointRecord: "RadioCriterion",
};

const answerField: Record<string, string> = {
	UserInputPointRecord: "user_input",
	NumberPointRecord: "number",
	CheckboxPointRecord: "checked",
	MultiCheckboxPointRecord: "choices",
	RadioPointRecord: "choice",
};

const criterionTypeToPointRecordType: Record<string, PointRecordCreateData["resourcetype"]> = {
	numbercriterion: "NumberPointRecord",
	checkboxcriterion: "CheckboxPointRecord",
	multicheckboxcriterion: "MultiCheckboxPointRecord",
	radiocriterion: "RadioPointRecord",
	userinputcriterion: "UserInputPointRecord",
};

const criterionTypeToAnswerField: Record<string, string> = {
	numbercriterion: "number",
	checkboxcriterion: "checked",
	multicheckboxcriterion: "choices",
	radiocriterion: "choice",
	userinputcriterion: "user_input",
};

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
	criteria: Criterion[];
	userId?: string;
	date?: string | null;
}

function getAnswerValue(
	submission: PointRecordData,
): string | number | boolean | string[] | undefined {
	const field = answerField[submission.resourcetype];
	if (!field) return undefined;
	return submission[field as keyof PointRecordData] as
		| string
		| number
		| boolean
		| string[]
		| undefined;
}

const SubmissionCard: React.FC<{
	submission: PointRecordData;
	criterion: Criterion | undefined;
}> = ({ submission, criterion }) => {
	const { t } = useTranslation();
	const { currentUser } = useDashboardData();
	const updatePointRecord = useUpdatePointRecord();

	const criterionType = pointRecordToCriterionType[submission.resourcetype];
	const Icon = FieldTypesIcons[criterionType] ?? FieldTypesIcons[FieldTypes.Text];
	const canEdit = isAtLeastAdmin(currentUser?.role);
	const canEditPoints = isAtLeastSuperAdmin(currentUser?.role) && criterionType === FieldTypes.Text;

	const [editing, setEditing] = useState(false);
	const [answerValue, setAnswerValue] = useState<string | number | boolean | string[] | undefined>(
		getAnswerValue(submission),
	);
	const [pointsValue, setPointsValue] = useState(submission.point_total);
	const [fieldError, setFieldError] = useState<string | null>(null);

	const handleCancel = () => {
		setAnswerValue(getAnswerValue(submission));
		setPointsValue(submission.point_total);
		setFieldError(null);
		setEditing(false);
	};

	const handleSave = async () => {
		const answerFieldKey = answerField[submission.resourcetype];
		const data: PointRecordUpdateData = {
			[answerFieldKey]: answerValue,
		};
		if (canEditPoints && pointsValue !== submission.point_total) {
			data.points = pointsValue;
		}
		setFieldError(null);
		try {
			await updatePointRecord.mutateAsync({
				recordId: submission.id,
				date: submission.record_date,
				userId: submission.person,
				data,
			});
			toast.success(t("save"));
			setEditing(false);
		} catch (err) {
			if (isAxiosError(err) && err.response?.status === 400 && err.response.data) {
				const errors = err.response.data as Record<string, string[]>;
				const messages = Object.values(errors).flat();
				if (messages.length > 0) {
					setFieldError(messages.join(", "));
					return;
				}
			}
			toast.error(t("failedToSave"));
		}
	};

	return (
		<div className="rounded-xl border bg-card text-card-foreground">
			{/* Header: Icon + Label + Points + Edit button */}
			<div className="flex items-center gap-3 p-3">
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
					<Icon className="h-4 w-4 text-muted-foreground" />
				</div>
				<span className="flex-1 text-sm font-medium">
					{submission.contest_criterion_data.label}
				</span>
				{editing && canEditPoints ? (
					<Input
						type="number"
						value={pointsValue}
						onChange={(e) => setPointsValue(Number(e.target.value))}
						className="h-7 w-20 text-sm font-semibold text-end"
					/>
				) : (
					<span className="text-sm font-semibold">{submission.point_total}</span>
				)}
				{canEdit && !editing && (
					<Button variant="ghost" size="icon-xs" onClick={() => setEditing(true)}>
						<Pencil className="h-3.5 w-3.5" />
					</Button>
				)}
			</div>

			{/* Body: Answer */}
			<div className="border-t px-3 py-2.5">
				<p className="mb-1 text-xs text-muted-foreground">{t("dailySubmissionsPopup.answer")}</p>
				{criterion ? (
					<CriterionField
						criterion={
							{
								...criterion,
								resourcetype: criterionType,
							} as never
						}
						value={editing ? answerValue : getAnswerValue(submission)}
						onChange={editing ? setAnswerValue : undefined}
						readOnly={!editing}
					/>
				) : (
					<p className="text-sm">—</p>
				)}
				{fieldError && <p className="mt-1 text-xs text-destructive">{fieldError}</p>}
			</div>

			{/* Footer: Timestamp or Save/Cancel */}
			<div className="border-t px-3 py-2">
				{editing ? (
					<div className="flex items-center justify-end gap-2">
						<Button variant="ghost" size="sm" onClick={handleCancel}>
							{t("dailySubmissionsPopup.cancel")}
						</Button>
						<Button size="sm" onClick={handleSave} disabled={updatePointRecord.isPending}>
							{t("save")}
						</Button>
					</div>
				) : (
					<p className="text-xs text-muted-foreground">
						{t("dailySubmissionsPopup.lastUpdated")}:{" "}
						{dayjs(submission.timestamp).format("YYYY-MM-DD hh:mm A")}
					</p>
				)}
			</div>
		</div>
	);
};

const AddSubmissionCard: React.FC<{
	criterion: Criterion;
	userId: string;
	date: string;
}> = ({ criterion, userId, date }) => {
	const { t } = useTranslation();
	const { currentUser } = useDashboardData();
	const createPointRecord = useCreatePointRecord();

	const resourcetype = criterion.resourcetype.toLowerCase();
	const pointRecordType = criterionTypeToPointRecordType[resourcetype];
	const answerFieldKey = criterionTypeToAnswerField[resourcetype];
	const criterionType = pointRecordToCriterionType[pointRecordType] ?? criterion.resourcetype;
	const Icon = FieldTypesIcons[criterionType] ?? FieldTypesIcons[FieldTypes.Text];
	const canEditPoints = isAtLeastSuperAdmin(currentUser?.role) && criterionType === FieldTypes.Text;

	const [expanded, setExpanded] = useState(false);
	const [answerValue, setAnswerValue] = useState<string | number | boolean | string[] | undefined>(
		undefined,
	);
	const [pointsValue, setPointsValue] = useState<number | undefined>(undefined);
	const [fieldError, setFieldError] = useState<string | null>(null);

	const handleCancel = () => {
		setAnswerValue(undefined);
		setPointsValue(undefined);
		setFieldError(null);
		setExpanded(false);
	};

	const handleSave = async () => {
		if (!pointRecordType || !answerFieldKey) return;
		const data: PointRecordCreateData = {
			resourcetype: pointRecordType,
			contest_criterion: criterion.id,
			[answerFieldKey]: answerValue,
		};
		if (canEditPoints && pointsValue != null) {
			data.point_total = pointsValue;
		}
		setFieldError(null);
		try {
			await createPointRecord.mutateAsync({ userId, date, data });
			toast.success(t("save"));
			setExpanded(false);
			setAnswerValue(undefined);
			setPointsValue(undefined);
		} catch (err) {
			if (isAxiosError(err) && err.response?.status === 400 && err.response.data) {
				const errors = err.response.data as Record<string, string[]>;
				const messages = Object.values(errors).flat();
				if (messages.length > 0) {
					setFieldError(messages.join(", "));
					return;
				}
			}
			toast.error(t("failedToSave"));
		}
	};

	if (!expanded) {
		return (
			<button
				type="button"
				onClick={() => setExpanded(true)}
				className="w-full rounded-xl border border-dashed bg-card text-card-foreground hover:bg-muted/50 transition-colors cursor-pointer"
			>
				<div className="flex items-center gap-3 p-3">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
						<Icon className="h-4 w-4 text-muted-foreground" />
					</div>
					<span className="flex-1 text-sm font-medium text-start">{criterion.label}</span>
					<Plus className="h-4 w-4 text-muted-foreground" />
				</div>
			</button>
		);
	}

	return (
		<div className="rounded-xl border bg-card text-card-foreground">
			{/* Header */}
			<div className="flex items-center gap-3 p-3">
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
					<Icon className="h-4 w-4 text-muted-foreground" />
				</div>
				<span className="flex-1 text-sm font-medium">{criterion.label}</span>
				{canEditPoints && (
					<Input
						type="number"
						value={pointsValue ?? ""}
						onChange={(e) =>
							setPointsValue(e.target.value === "" ? undefined : Number(e.target.value))
						}
						placeholder={t("dailySubmissionsPopup.points")}
						className="h-7 w-20 text-sm font-semibold text-end"
					/>
				)}
			</div>

			{/* Body: Answer field */}
			<div className="border-t px-3 py-2.5">
				<p className="mb-1 text-xs text-muted-foreground">{t("dailySubmissionsPopup.answer")}</p>
				<CriterionField
					criterion={
						{
							...criterion,
							resourcetype: criterionType,
						} as never
					}
					value={answerValue}
					onChange={setAnswerValue}
					readOnly={false}
				/>
				{fieldError && <p className="mt-1 text-xs text-destructive">{fieldError}</p>}
			</div>

			{/* Footer: Save/Cancel */}
			<div className="border-t px-3 py-2">
				<div className="flex items-center justify-end gap-2">
					<Button variant="ghost" size="sm" onClick={handleCancel}>
						{t("dailySubmissionsPopup.cancel")}
					</Button>
					<Button size="sm" onClick={handleSave} disabled={createPointRecord.isPending}>
						{t("save")}
					</Button>
				</div>
			</div>
		</div>
	);
};

export const DailySubmissionsTable: React.FC<DailySubmissionsTableProps> = ({
	submissions,
	criteria,
	userId,
	date,
}) => {
	const { t } = useTranslation();
	const { currentUser } = useDashboardData();
	const canAdd = isAtLeastAdmin(currentUser?.role);

	const submittedCriterionIds = new Set(submissions.map((s) => s.contest_criterion_data.id));
	const unsubmittedCriteria = canAdd
		? criteria.filter((c) => !submittedCriterionIds.has(c.id))
		: [];

	if (submissions.length === 0 && unsubmittedCriteria.length === 0) {
		return <Empty description={t("dailySubmissionsPopup.noSubmissions")} />;
	}

	return (
		<div className="flex flex-col gap-3">
			{[...submissions]
				.sort((a, b) => a.id.localeCompare(b.id))
				.map((submission) => {
					const criterion = criteria.find((c) => c.id === submission.contest_criterion_data.id);
					return (
						<SubmissionCard key={submission.id} submission={submission} criterion={criterion} />
					);
				})}
			{unsubmittedCriteria.length > 0 && userId && date && (
				<>
					{submissions.length > 0 && <Separator />}
					<p className="text-xs text-muted-foreground font-medium">
						{t("dailySubmissionsPopup.addSubmission")}
					</p>
					{unsubmittedCriteria.map((criterion) => (
						<AddSubmissionCard
							key={criterion.id}
							criterion={criterion}
							userId={userId}
							date={date}
						/>
					))}
				</>
			)}
		</div>
	);
};
