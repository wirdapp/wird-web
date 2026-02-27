import { AlertTriangle, Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useExportJobs } from "../../../services/contest-results/queries";
import { ExportJobDialog } from "./export-job-dialog";
import { ExportJobList } from "./export-job-list";

export const ExportResults: React.FC = () => {
	const { t } = useTranslation();
	const { data: jobs, isLoading } = useExportJobs();
	const [searchParams, setSearchParams] = useSearchParams();
	const [dialogOpen, setDialogOpen] = useState(!!searchParams.get("groupId"));

	const handleDialogOpenChange = (open: boolean) => {
		setDialogOpen(open);
		if (!open && searchParams.has("groupId")) {
			searchParams.delete("groupId");
			setSearchParams(searchParams, { replace: true });
		}
	};
	const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);

	const handleJobCreated = (jobId: string, message?: string) => {
		setHighlightedJobId(jobId);
		setAlertMessage(message ?? null);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">{t("exportResults")}</h3>
				<Button onClick={() => setDialogOpen(true)}>
					<Plus className="h-4 w-4" />
					{t("newExport")}
				</Button>
			</div>

			{alertMessage && (
				<Alert
					variant="warning"
					className="flex items-center gap-3 [&>svg]:static [&>svg]:shrink-0 [&>svg~*]:ps-0 [&>svg+div]:translate-y-0"
				>
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription className="flex-1">{alertMessage}</AlertDescription>
					<button type="button" onClick={() => setAlertMessage(null)} className="shrink-0">
						<X className="h-4 w-4" />
					</button>
				</Alert>
			)}

			{isLoading ? (
				<div className="flex justify-center py-8">
					<Spinner />
				</div>
			) : (
				<ExportJobList
					jobs={jobs ?? []}
					highlightedJobId={highlightedJobId}
					onHighlightClear={() => setHighlightedJobId(null)}
					onNewExport={() => setDialogOpen(true)}
				/>
			)}

			<ExportJobDialog
				open={dialogOpen}
				onOpenChange={handleDialogOpenChange}
				onJobCreated={handleJobCreated}
			/>
		</div>
	);
};
