import dayjs from "dayjs";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { MultiMembersSelect } from "@/components/shared/multi-members-select";
import { Button } from "@/components/ui/button";
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
import { useDashboardData } from "@/util/routes-data";
import { ContestResultsService } from "../../../services/contest-results/contest-results.service";
import { generateExcelExport } from "../../../services/contest-results/export.service";
import { Role } from "../../../util/roles";

type MemberFilterMode = "all" | "group";

export const ExportResults: React.FC = () => {
	const { t } = useTranslation();
	const { currentContest } = useDashboardData();

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

	const { data: groups } = useGroups();
	const [filterMode, setFilterMode] = useState<MemberFilterMode>(groupIdParam ? "group" : "all");
	const [selectedGroupId, setSelectedGroupId] = useState<string>(groupIdParam ?? "");
	const [startDate, setStartDate] = useState(contestStartStr);
	const [endDate, setEndDate] = useState(defaultEndStr);
	const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const groupSelectItems = useMemo(() => {
		const items: { value: string; label: string }[] = [];
		if (groups) {
			for (const group of groups) {
				items.push({ value: group.id, label: group.name });
			}
		}
		return items;
	}, [groups]);

	const groupRequired = filterMode === "group" && !selectedGroupId;

	const daysDiff = startDate && endDate ? dayjs(endDate).diff(dayjs(startDate), "day") : 0;
	const dateRangeExceedsMax = daysDiff > 31;
	const dateOutOfBounds =
		(startDate && contestStartStr && startDate < contestStartStr) ||
		(endDate && contestEndStr && endDate > contestEndStr);

	const handleFilterModeChange = (value: string) => {
		setFilterMode(value as MemberFilterMode);
		setSelectedMemberIds([]);
		setSelectedGroupId("");
	};

	const handleExport = async () => {
		if (!startDate || !endDate) return;
		if (dateRangeExceedsMax) return;

		setLoading(true);
		try {
			const data = await ContestResultsService.exportResults({
				startDate,
				endDate,
				memberIds: selectedMemberIds.length > 0 ? selectedMemberIds : undefined,
				groupId: filterMode === "group" && selectedGroupId ? selectedGroupId : undefined,
			});
			await generateExcelExport(data);
			toast.success(t("exportSuccess"));
		} catch (error) {
			console.error("Export failed:", error);
			toast.error(t("exportError"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-6 max-w-lg">
			<div className="flex flex-col gap-2">
				<Label>{t("exportDateRange")}</Label>
				<div className="grid grid-cols-2 gap-3">
					<Input
						type="date"
						value={startDate}
						min={contestStartStr}
						max={contestEndStr}
						disabled={loading}
						onChange={(e) => setStartDate(e.target.value)}
					/>
					<Input
						type="date"
						value={endDate}
						min={contestStartStr}
						max={contestEndStr}
						disabled={loading}
						onChange={(e) => setEndDate(e.target.value)}
					/>
				</div>
				{dateRangeExceedsMax && <p className="text-sm text-destructive">{t("exportMaxDays")}</p>}
				{dateOutOfBounds && (
					<p className="text-sm text-destructive">
						{t("exportDateRange")}: {contestStartStr} - {contestEndStr}
					</p>
				)}
			</div>

			<div className="flex flex-col gap-3">
				<Label>{t("exportMembers")}</Label>
				<RadioGroup
					value={filterMode}
					onValueChange={handleFilterModeChange}
					className="flex flex-row gap-4"
				>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="all" id="filter-all" disabled={loading} />
						<Label htmlFor="filter-all" className="cursor-pointer font-normal">
							{t("exportAllMembers")}
						</Label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="group" id="filter-group" disabled={loading} />
						<Label htmlFor="filter-group" className="cursor-pointer font-normal">
							{t("exportByGroup")}
						</Label>
					</div>
				</RadioGroup>

				{filterMode === "group" && (
					<div className="flex flex-col gap-1">
						<Select
							value={selectedGroupId}
							onValueChange={(val) => {
								setSelectedGroupId(val ?? "");
								setSelectedMemberIds([]);
							}}
							items={groupSelectItems}
						>
							<SelectTrigger disabled={loading}>
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
						{groupRequired && <p className="text-sm text-destructive">{t("groupRequired")}</p>}
					</div>
				)}

				<MultiMembersSelect
					role={Role.MEMBER}
					groupId={filterMode === "group" && selectedGroupId ? selectedGroupId : undefined}
					value={selectedMemberIds}
					onChange={setSelectedMemberIds}
					placeholder={filterMode === "group" ? t("allGroupMembers") : t("allMembersSelected")}
					disabled={loading}
				/>
			</div>

			<Button
				onClick={handleExport}
				disabled={
					loading ||
					!startDate ||
					!endDate ||
					dateRangeExceedsMax ||
					!!dateOutOfBounds ||
					groupRequired
				}
				className="w-fit"
			>
				{loading ? (
					<Spinner size="sm" className="text-primary-foreground" />
				) : (
					<Download data-icon="inline-start" />
				)}
				{t("exportToExcel")}
			</Button>
		</div>
	);
};
