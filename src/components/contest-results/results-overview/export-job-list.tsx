import dayjs from "dayjs";
import { AlertCircle, Calendar, Clock, Download, Loader2, Users } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { ExportJob } from "@/types";
import { generateExcelExport } from "../../../services/contest-results/export.service";
import { useExportJob } from "../../../services/contest-results/queries";
import { useGroups } from "../../../services/groups/queries";

interface ExportJobListProps {
	jobs: ExportJob[];
	sessionJobIds: Set<string>;
}

export const ExportJobList: React.FC<ExportJobListProps> = ({ jobs, sessionJobIds }) => {
	const { t } = useTranslation();
	const { data: groups } = useGroups();

	const groupsMap = useMemo(() => {
		const map = new Map<string, string>();
		if (groups) {
			for (const g of groups) {
				map.set(g.id, g.name);
			}
		}
		return map;
	}, [groups]);

	if (jobs.length === 0) {
		return <p className="text-muted-foreground text-sm">{t("noExports")}</p>;
	}

	return (
		<div className="flex flex-col gap-3">
			{jobs.map((job) => (
				<ExportJobItem
					key={job.id}
					job={job}
					isSessionJob={sessionJobIds.has(job.id)}
					groupsMap={groupsMap}
				/>
			))}
		</div>
	);
};

function ExportJobFilterDescription({
	job,
	groupsMap,
}: {
	job: ExportJob;
	groupsMap: Map<string, string>;
}) {
	const { t } = useTranslation();

	if (job.members_from != null && job.members_to != null) {
		return <>{`${t("exportByRange")}: ${job.members_from}-${job.members_to}`}</>;
	}
	if (job.group_id) {
		const groupName = groupsMap.get(job.group_id);
		return <>{groupName ?? job.group_id}</>;
	}
	if (job.member_ids?.length) {
		return <>{`${job.member_ids.length} ${t("members")}`}</>;
	}
	return <>{t("exportAllMembers")}</>;
}

function ExportJobItem({
	job,
	isSessionJob,
	groupsMap,
}: {
	job: ExportJob;
	isSessionJob: boolean;
	groupsMap: Map<string, string>;
}) {
	const { t } = useTranslation();
	const hasDownloaded = useRef(false);
	const isPending = job.status === "pending" || job.status === "processing";

	const { data: polledJob } = useExportJob(isPending ? job.id : null);
	const currentJob = polledJob ?? job;

	useEffect(() => {
		if (
			isSessionJob &&
			currentJob.status === "completed" &&
			currentJob.serialized_data &&
			!hasDownloaded.current
		) {
			hasDownloaded.current = true;
			generateExcelExport(currentJob.serialized_data);
		}
	}, [isSessionJob, currentJob.status, currentJob.serialized_data]);

	const handleDownload = () => {
		if (!currentJob.serialized_data) return;
		generateExcelExport(currentJob.serialized_data);
	};

	return (
		<div className="flex items-center justify-between rounded-lg border p-4">
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-1.5 text-sm font-medium">
					<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
					{dayjs(currentJob.start_date).format("YYYY-MM-DD")} →{" "}
					{dayjs(currentJob.end_date).format("YYYY-MM-DD")}
				</div>
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<Users className="h-3.5 w-3.5" />
					<ExportJobFilterDescription job={currentJob} groupsMap={groupsMap} />
				</div>
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<Clock className="h-3.5 w-3.5" />
					{t("exportCreated")}: {dayjs(currentJob.created_at).format("YYYY-MM-DD HH:mm")}
				</div>
			</div>
			<div className="flex items-center gap-2">
				{(currentJob.status === "pending" || currentJob.status === "processing") && (
					<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						{currentJob.status === "pending" ? t("exportPending") : t("exportProcessing")}
					</span>
				)}
				{currentJob.status === "completed" && (
					<Button variant="outline" size="sm" onClick={handleDownload}>
						<Download className="h-4 w-4" />
						{t("downloadExport")}
					</Button>
				)}
				{currentJob.status === "failed" && (
					<span className="flex items-center gap-1.5 text-xs text-destructive">
						<AlertCircle className="h-4 w-4" />
						{t("exportFailed")}
					</span>
				)}
			</div>
		</div>
	);
}
