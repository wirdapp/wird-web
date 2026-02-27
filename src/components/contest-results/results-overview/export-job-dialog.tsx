import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { AlertTriangle, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { MultiMembersSelect } from "@/components/shared/multi-members-select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Segmented } from "@/components/ui/segmented";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGroups } from "@/services/groups/queries";
import { useDashboardData } from "@/util/routes-data";
import { useCreateExportJob } from "../../../services/contest-results/queries";
import { Role } from "../../../util/roles";

type MemberFilterMode = "all" | "specific" | "group";
type GroupMemberMode = "all" | "specific";

const MAX_MEMBERS = 250;
const MAX_DAYS = 31;

interface ExportJobDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onJobCreated: (jobId: string, message?: string) => void;
}

export const ExportJobDialog: React.FC<ExportJobDialogProps> = ({
	open,
	onOpenChange,
	onJobCreated,
}) => {
	const { t } = useTranslation();
	const { currentContest } = useDashboardData();
	const createExportJob = useCreateExportJob();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const contestStartStr = currentContest?.start_date
		? dayjs(currentContest.start_date).format("YYYY-MM-DD")
		: "";
	const contestEndStr = currentContest?.end_date
		? dayjs(currentContest.end_date).format("YYYY-MM-DD")
		: "";

	const thirtyDaysLater = contestStartStr
		? dayjs(contestStartStr).add(30, "day").format("YYYY-MM-DD")
		: "";
	const defaultEndStr =
		contestEndStr && thirtyDaysLater
			? contestEndStr < thirtyDaysLater
				? contestEndStr
				: thirtyDaysLater
			: contestEndStr;

	const [searchParams] = useSearchParams();
	const groupIdParam = searchParams.get("groupId");

	const [filterMode, setFilterMode] = useState<MemberFilterMode>(groupIdParam ? "group" : "all");
	const [selectedGroupId, setSelectedGroupId] = useState<string>(groupIdParam ?? "");
	const [startDate, setStartDate] = useState(contestStartStr);
	const [endDate, setEndDate] = useState(defaultEndStr);
	const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
	const [groupMemberMode, setGroupMemberMode] = useState<GroupMemberMode>("all");

	const dateOutOfBounds =
		(startDate && contestStartStr && startDate < contestStartStr) ||
		(endDate && contestEndStr && endDate > contestEndStr);

	const dateRangeExceedsMax =
		startDate && endDate && dayjs(endDate).diff(dayjs(startDate), "day") > MAX_DAYS;

	const hasSpecificMembers =
		filterMode === "specific" || (filterMode === "group" && groupMemberMode === "specific");

	const maxMembersExceeded = hasSpecificMembers && selectedMemberIds.length > MAX_MEMBERS;

	const membersRequired = filterMode === "specific" && selectedMemberIds.length === 0;

	const groupRequired = filterMode === "group" && !selectedGroupId;

	const groupMembersRequired =
		filterMode === "group" && groupMemberMode === "specific" && selectedMemberIds.length === 0;

	const filterModeItems = [
		{ value: "all", label: t("exportAllMembers") },
		{ value: "specific", label: t("specificMembers") },
		{ value: "group", label: t("exportByGroup") },
	];

	const handleFilterModeChange = (value: string) => {
		setFilterMode(value as MemberFilterMode);
		setSelectedMemberIds([]);
		setSelectedGroupId(groupIdParam && value === "group" ? groupIdParam : "");
		setGroupMemberMode("all");
	};

	const canSubmit =
		!!startDate &&
		!!endDate &&
		!dateOutOfBounds &&
		!dateRangeExceedsMax &&
		!maxMembersExceeded &&
		!groupRequired &&
		!membersRequired &&
		!groupMembersRequired &&
		!createExportJob.isPending;

	const handleSubmit = async () => {
		if (!canSubmit || !currentContest) return;

		setErrorMessage(null);
		try {
			const data: Parameters<typeof createExportJob.mutateAsync>[0] = {
				contest: currentContest.id,
				start_date: startDate,
				end_date: endDate,
			};

			if (filterMode === "all") {
				data.all_members = true;
			} else if (filterMode === "specific") {
				data.member_ids = selectedMemberIds;
			} else if (filterMode === "group") {
				data.group_id = selectedGroupId;
				if (groupMemberMode === "specific") {
					data.member_ids = selectedMemberIds;
				}
			}

			const result = await createExportJob.mutateAsync(data);
			if (!result.message) {
				toast.success(t("exportCreated"));
			}
			onJobCreated(result.data.id, result.message);
			onOpenChange(false);
		} catch (error) {
			const message =
				isAxiosError(error) && error.response?.data?.message
					? error.response.data.message
					: t("exportError");
			setErrorMessage(message);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("createExport")}</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-2">
						<Label>{t("exportDateRange")}</Label>
						<div className="grid grid-cols-2 gap-3">
							<Input
								type="date"
								value={startDate}
								min={contestStartStr}
								max={contestEndStr}
								disabled={createExportJob.isPending}
								onChange={(e) => setStartDate(e.target.value)}
							/>
							<Input
								type="date"
								value={endDate}
								min={contestStartStr}
								max={contestEndStr}
								disabled={createExportJob.isPending}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
						{dateOutOfBounds && (
							<p className="text-sm text-destructive">
								{t("exportDateRange")}: {contestStartStr} - {contestEndStr}
							</p>
						)}
						{dateRangeExceedsMax && (
							<p className="text-sm text-destructive">{t("exportMaxDays")}</p>
						)}
					</div>

					<div className="flex flex-col gap-3">
						<Label>{t("exportMembers")}</Label>
						<Segmented
							items={filterModeItems}
							value={filterMode}
							onValueChange={handleFilterModeChange}
							disabled={createExportJob.isPending}
						/>

						{filterMode === "specific" && (
							<div className="flex flex-col gap-1">
								<MultiMembersSelect
									role={`${Role.ADMIN},${Role.MEMBER}`}
									value={selectedMemberIds}
									onChange={setSelectedMemberIds}
									placeholder={t("selectSpecificMembers")}
									disabled={createExportJob.isPending}
								/>
								{maxMembersExceeded && (
									<p className="text-sm text-destructive">{t("maxMembersExceeded")}</p>
								)}
							</div>
						)}

						{filterMode === "group" && (
							<GroupFilterSection
								selectedGroupId={selectedGroupId}
								onGroupChange={(id) => {
									setSelectedGroupId(id);
									setSelectedMemberIds([]);
									setGroupMemberMode("all");
								}}
								groupMemberMode={groupMemberMode}
								onGroupMemberModeChange={(mode) => {
									setGroupMemberMode(mode);
									if (mode === "all") setSelectedMemberIds([]);
								}}
								selectedMemberIds={selectedMemberIds}
								onMemberIdsChange={setSelectedMemberIds}
								disabled={createExportJob.isPending}
								maxMembersExceeded={!!maxMembersExceeded}
							/>
						)}
					</div>
				</div>

				{errorMessage && (
					<Alert
						variant="destructive"
						className="flex items-center gap-3 [&>svg]:static [&>svg]:shrink-0 [&>svg~*]:ps-0 [&>svg+div]:translate-y-0"
					>
						<AlertTriangle className="h-4 w-4" />
						<AlertDescription className="flex-1">{errorMessage}</AlertDescription>
						<button type="button" onClick={() => setErrorMessage(null)} className="shrink-0">
							<X className="h-4 w-4" />
						</button>
					</Alert>
				)}

				<DialogFooter>
					<Button onClick={handleSubmit} disabled={!canSubmit}>
						{createExportJob.isPending ? (
							<Spinner size="sm" className="text-primary-foreground" />
						) : null}
						{t("createExport")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

function GroupFilterSection({
	selectedGroupId,
	onGroupChange,
	groupMemberMode,
	onGroupMemberModeChange,
	selectedMemberIds,
	onMemberIdsChange,
	disabled,
	maxMembersExceeded,
}: {
	selectedGroupId: string;
	onGroupChange: (id: string) => void;
	groupMemberMode: GroupMemberMode;
	onGroupMemberModeChange: (mode: GroupMemberMode) => void;
	selectedMemberIds: string[];
	onMemberIdsChange: (ids: string[]) => void;
	disabled: boolean;
	maxMembersExceeded: boolean;
}) {
	const { t } = useTranslation();
	const { data: groups } = useGroups();

	const groupSelectItems = useMemo(() => {
		const items: { value: string; label: string }[] = [];
		if (groups) {
			for (const group of groups) {
				items.push({ value: group.id, label: group.name });
			}
		}
		return items;
	}, [groups]);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<Select
					value={selectedGroupId}
					onValueChange={(val) => onGroupChange(val ?? "")}
					items={groupSelectItems}
				>
					<SelectTrigger disabled={disabled}>
						<SelectValue placeholder={t("exportGroup")} />
					</SelectTrigger>
					<SelectContent>
						{groupSelectItems.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{!selectedGroupId && <p className="text-sm text-destructive">{t("groupRequired")}</p>}
			</div>
			{selectedGroupId && (
				<>
					<RadioGroup
						value={groupMemberMode}
						onValueChange={(val) => onGroupMemberModeChange(val as GroupMemberMode)}
						className="flex flex-row gap-4"
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="all" id="group-member-all" disabled={disabled} />
							<Label htmlFor="group-member-all" className="cursor-pointer font-normal">
								{t("allGroupMembers")}
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="specific" id="group-member-specific" disabled={disabled} />
							<Label htmlFor="group-member-specific" className="cursor-pointer font-normal">
								{t("specificMembers")}
							</Label>
						</div>
					</RadioGroup>

					{groupMemberMode === "specific" && (
						<div className="flex flex-col gap-1">
							<MultiMembersSelect
								role={`${Role.ADMIN},${Role.MEMBER}`}
								groupId={selectedGroupId}
								value={selectedMemberIds}
								onChange={onMemberIdsChange}
								placeholder={t("selectSpecificMembers")}
								disabled={disabled}
							/>
							{maxMembersExceeded && (
								<p className="text-sm text-destructive">{t("maxMembersExceeded")}</p>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
