import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { MultiMembersSelect } from "@/components/shared/multi-members-select";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGroups } from "@/services/groups/queries";
import { useMembers } from "@/services/members/queries";
import { useDashboardData } from "@/util/routes-data";
import { useCreateExportJob } from "../../../services/contest-results/queries";
import { Role } from "../../../util/roles";

type MemberFilterMode = "members" | "group" | "range";

const MAX_MEMBERS = 250;
const MAX_DAYS = 31;

interface ExportJobDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onJobCreated: (jobId: string) => void;
}

export const ExportJobDialog: React.FC<ExportJobDialogProps> = ({
	open,
	onOpenChange,
	onJobCreated,
}) => {
	const { t } = useTranslation();
	const { currentContest } = useDashboardData();
	const createExportJob = useCreateExportJob();

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

	const [filterMode, setFilterMode] = useState<MemberFilterMode>(
		groupIdParam ? "group" : "members",
	);
	const [selectedGroupId, setSelectedGroupId] = useState<string>(groupIdParam ?? "");
	const [startDate, setStartDate] = useState(contestStartStr);
	const [endDate, setEndDate] = useState(defaultEndStr);
	const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
	const [rankFrom, setRankFrom] = useState<string>("");
	const [rankTo, setRankTo] = useState<string>("");

	const dateOutOfBounds =
		(startDate && contestStartStr && startDate < contestStartStr) ||
		(endDate && contestEndStr && endDate > contestEndStr);

	const dateRangeExceedsMax =
		startDate && endDate && dayjs(endDate).diff(dayjs(startDate), "day") > MAX_DAYS;

	const maxMembersExceeded =
		(filterMode === "members" || (filterMode === "group" && selectedMemberIds.length > 0)) &&
		selectedMemberIds.length > MAX_MEMBERS;

	const membersRequired = filterMode === "members" && selectedMemberIds.length === 0;
	const groupRequired = filterMode === "group" && !selectedGroupId;
	const rankRequired =
		filterMode === "range" && (!rankFrom || !rankTo || Number(rankFrom) > Number(rankTo));

	const handleFilterModeChange = (value: string) => {
		setFilterMode(value as MemberFilterMode);
		setSelectedMemberIds([]);
		setSelectedGroupId(groupIdParam && value === "group" ? groupIdParam : "");
		setRankFrom("");
		setRankTo("");
	};

	const canSubmit =
		!!startDate &&
		!!endDate &&
		!dateOutOfBounds &&
		!dateRangeExceedsMax &&
		!maxMembersExceeded &&
		!groupRequired &&
		!rankRequired &&
		!membersRequired &&
		!createExportJob.isPending;

	const handleSubmit = async () => {
		if (!canSubmit || !currentContest) return;

		try {
			const data: Parameters<typeof createExportJob.mutateAsync>[0] = {
				contest: currentContest.id,
				requester: "27b6dc08-4b1e-4fdf-b99b-2ae324abeb21",
				start_date: startDate,
				end_date: endDate,
			};

			if (filterMode === "members") {
				data.member_ids = selectedMemberIds;
			} else if (filterMode === "group") {
				if (selectedMemberIds.length > 0) {
					data.member_ids = selectedMemberIds;
				} else {
					data.group_id = selectedGroupId;
				}
			} else if (filterMode === "range" && rankFrom && rankTo) {
				data.members_from = Number(rankFrom);
				data.members_to = Number(rankTo);
			}

			const job = await createExportJob.mutateAsync(data);
			toast.success(t("exportCreated"));
			onJobCreated(job.id);
			onOpenChange(false);
		} catch {
			toast.error(t("exportError"));
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
						<RadioGroup
							value={filterMode}
							onValueChange={handleFilterModeChange}
							className="flex flex-row flex-wrap gap-4"
						>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="members"
									id="filter-members"
									disabled={createExportJob.isPending}
								/>
								<Label htmlFor="filter-members" className="cursor-pointer font-normal">
									{t("exportByMembers")}
								</Label>
							</div>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="group"
									id="filter-group"
									disabled={createExportJob.isPending}
								/>
								<Label htmlFor="filter-group" className="cursor-pointer font-normal">
									{t("exportByGroup")}
								</Label>
							</div>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="range"
									id="filter-range"
									disabled={createExportJob.isPending}
								/>
								<Label htmlFor="filter-range" className="cursor-pointer font-normal">
									{t("exportByRange")}
								</Label>
							</div>
						</RadioGroup>

						{filterMode === "members" && (
							<div className="flex flex-col gap-1">
								<MultiMembersSelect
									role={Role.MEMBER}
									value={selectedMemberIds}
									onChange={setSelectedMemberIds}
									placeholder={t("exportMembers")}
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
								}}
								selectedMemberIds={selectedMemberIds}
								onMemberIdsChange={setSelectedMemberIds}
								disabled={createExportJob.isPending}
								maxMembersExceeded={!!maxMembersExceeded}
							/>
						)}

						{filterMode === "range" && (
							<MemberRangeFilterSection
								rankFrom={rankFrom}
								rankTo={rankTo}
								onRankFromChange={setRankFrom}
								onRankToChange={setRankTo}
								disabled={createExportJob.isPending}
							/>
						)}
					</div>
				</div>

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
	selectedMemberIds,
	onMemberIdsChange,
	disabled,
	maxMembersExceeded,
}: {
	selectedGroupId: string;
	onGroupChange: (id: string) => void;
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
				<div className="flex flex-col gap-1">
					<MultiMembersSelect
						role={Role.MEMBER}
						groupId={selectedGroupId}
						value={selectedMemberIds}
						onChange={onMemberIdsChange}
						placeholder={t("allGroupMembers")}
						disabled={disabled}
					/>
					{maxMembersExceeded && (
						<p className="text-sm text-destructive">{t("maxMembersExceeded")}</p>
					)}
				</div>
			)}
		</div>
	);
}

function MemberRangeFilterSection({
	rankFrom,
	rankTo,
	onRankFromChange,
	onRankToChange,
	disabled,
}: {
	rankFrom: string;
	rankTo: string;
	onRankFromChange: (val: string) => void;
	onRankToChange: (val: string) => void;
	disabled: boolean;
}) {
	const { t } = useTranslation();
	const { data: membersData } = useMembers({ page_size: 1, role: Role.MEMBER });
	const totalMembers = membersData?.count ?? 0;

	return (
		<div className="flex flex-col gap-3">
			{totalMembers > 0 && (
				<p className="text-sm text-muted-foreground">
					{t("totalMembers", { count: totalMembers })}
				</p>
			)}
			<div className="grid grid-cols-2 gap-3">
				<div className="flex flex-col gap-1">
					<Label className="text-xs">{t("rangeFrom")}</Label>
					<Input
						type="number"
						min={1}
						max={totalMembers || undefined}
						value={rankFrom}
						onChange={(e) => onRankFromChange(e.target.value)}
						disabled={disabled}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="text-xs">{t("rangeTo")}</Label>
					<Input
						type="number"
						min={rankFrom ? Number(rankFrom) : 1}
						max={totalMembers || undefined}
						value={rankTo}
						onChange={(e) => onRankToChange(e.target.value)}
						disabled={disabled}
					/>
				</div>
			</div>
		</div>
	);
}
