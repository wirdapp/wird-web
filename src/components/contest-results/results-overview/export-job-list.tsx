import dayjs from "dayjs";
import {
	AlertCircle,
	Clock,
	Download,
	FileJson,
	FileSpreadsheet,
	FileText,
	Loader2,
	Plus,
	Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty } from "@/components/ui/empty";
import type { ExportJob, ExportSerializedData } from "@/types";
import {
	generateCsvExport,
	generateExcelExport,
	generateJsonExport,
} from "../../../services/contest-results/export.service";
import { useDeleteExportJob, useExportJob } from "../../../services/contest-results/queries";
import { useGroups } from "../../../services/groups/queries";

const EXPIRY_HOURS = 24;

interface ExportJobListProps {
	jobs: ExportJob[];
	highlightedJobId?: string | null;
	onHighlightClear?: () => void;
	onNewExport?: () => void;
}

export const ExportJobList: React.FC<ExportJobListProps> = ({
	jobs,
	highlightedJobId,
	onHighlightClear,
	onNewExport,
}) => {
	const { t } = useTranslation();
	const { data: groups } = useGroups();

	const groupsMap = new Map<string, string>();
	if (groups) {
		for (const g of groups) {
			groupsMap.set(g.id, g.name);
		}
	}

	if (jobs.length === 0) {
		return (
			<Empty description={t("noExportsTitle")}>
				<p className="text-muted-foreground text-xs mb-3">{t("noExportsDescription")}</p>
				{onNewExport && (
					<Button size="sm" onClick={onNewExport}>
						<Plus className="h-4 w-4" />
						{t("newExport")}
					</Button>
				)}
			</Empty>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{jobs.map((job) => (
				<ExportJobItem
					key={job.id}
					job={job}
					isHighlighted={highlightedJobId === job.id}
					onHighlightClear={onHighlightClear}
					groupsMap={groupsMap}
				/>
			))}
		</div>
	);
};

function getExpiryInfo(createdAt: string) {
	const expiresAt = dayjs(createdAt).add(EXPIRY_HOURS, "hour");
	const now = dayjs();
	const isExpired = now.isAfter(expiresAt);
	const hoursLeft = Math.max(0, Math.ceil(expiresAt.diff(now, "hour", true)));
	return { isExpired, hoursLeft };
}

function formatDateRange(startDate: string, endDate: string) {
	const start = dayjs(startDate);
	const end = dayjs(endDate);
	if (start.year() === end.year()) {
		return `${start.format("MMM D")} – ${end.format("MMM D, YYYY")}`;
	}
	return `${start.format("MMM D, YYYY")} – ${end.format("MMM D, YYYY")}`;
}

function getExportName(job: ExportJob, groupsMap: Map<string, string>, t: (key: string) => string) {
	const dateRange = formatDateRange(job.start_date, job.end_date);

	if (job.group_id) {
		const groupName = groupsMap.get(job.group_id) ?? job.group_id;
		if (job.member_ids?.length) {
			return `${groupName} · ${job.member_ids.length} ${t("members")} · ${dateRange}`;
		}
		return `${groupName} · ${dateRange}`;
	}
	if (job.member_ids?.length) {
		return `${job.member_ids.length} ${t("members")} · ${dateRange}`;
	}
	return `${t("exportAllMembers")} · ${dateRange}`;
}

function ExportJobItem({
	job,
	isHighlighted,
	onHighlightClear,
	groupsMap,
}: {
	job: ExportJob;
	isHighlighted: boolean;
	onHighlightClear?: () => void;
	groupsMap: Map<string, string>;
}) {
	const { t } = useTranslation();
	const deleteExportJob = useDeleteExportJob();
	const isPending = job.status === "pending" || job.status === "processing";
	const prevStatusRef = useRef(job.status);
	const [isNewlyCompleted, setIsNewlyCompleted] = useState(false);

	useEffect(() => {
		if (!isHighlighted) return;
		const timer = setTimeout(() => onHighlightClear?.(), 5000);
		return () => clearTimeout(timer);
	}, [isHighlighted, onHighlightClear]);

	const { data: polledJob } = useExportJob(isPending ? job.id : null);
	const currentJob = polledJob ?? job;

	useEffect(() => {
		if (
			currentJob.status === "completed" &&
			prevStatusRef.current !== "completed" &&
			prevStatusRef.current !== undefined
		) {
			setIsNewlyCompleted(true);
			const timer = setTimeout(() => setIsNewlyCompleted(false), 5000);
			return () => clearTimeout(timer);
		}
		prevStatusRef.current = currentJob.status;
	}, [currentJob.status]);

	const { isExpired, hoursLeft } = getExpiryInfo(currentJob.created_at);

	const handleDownload = (format: "excel" | "csv" | "json") => {
		if (!currentJob.serialized_data) return;
		const exportFns: Record<string, (data: ExportSerializedData) => Promise<void>> = {
			excel: generateExcelExport,
			csv: generateCsvExport,
			json: generateJsonExport,
		};
		exportFns[format](currentJob.serialized_data);
	};

	const showHighlight = isHighlighted || isNewlyCompleted;

	return (
		<div
			className={`flex items-center justify-between rounded-lg border p-4 transition-all duration-500 ${showHighlight ? "ring-2 ring-blue-400 bg-blue-50/50" : ""}`}
		>
			<div className="flex flex-col gap-1">
				<span className="text-sm font-medium">{getExportName(currentJob, groupsMap, t)}</span>
				{currentJob.status === "completed" && (
					<span
						className={`flex items-center gap-1.5 text-xs ${isExpired ? "text-destructive" : "text-muted-foreground"}`}
					>
						<Clock className="h-3.5 w-3.5" />
						{isExpired ? t("exportExpired") : t("exportExpiresIn", { time: `${hoursLeft}h` })}
					</span>
				)}
			</div>
			<div className="flex items-center gap-2">
				{(currentJob.status === "pending" || currentJob.status === "processing") && (
					<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						{currentJob.status === "pending" ? t("exportPending") : t("exportProcessing")}
					</span>
				)}
				{currentJob.status === "completed" && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" disabled={isExpired}>
								<Download className="h-4 w-4" />
								{t("downloadExport")}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => handleDownload("excel")}>
								<FileSpreadsheet className="h-4 w-4" />
								{t("downloadExcel")}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleDownload("csv")}>
								<FileText className="h-4 w-4" />
								{t("downloadCsv")}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleDownload("json")}>
								<FileJson className="h-4 w-4" />
								{t("downloadJson")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
				{currentJob.status === "failed" && (
					<span className="flex items-center gap-1.5 text-xs text-destructive">
						<AlertCircle className="h-4 w-4" />
						{t("exportFailed")}
					</span>
				)}
				<ConfirmDialog
					title={t("deleteExportTitle")}
					description={t("deleteExportDescription")}
					confirmText={t("delete")}
					cancelText={t("cancel")}
					variant="destructive"
					disabled={deleteExportJob.isPending}
					onConfirm={() => deleteExportJob.mutateAsync(currentJob.id)}
					trigger={
						<Button
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-destructive"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					}
				/>
			</div>
		</div>
	);
}
