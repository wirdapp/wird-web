import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
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

	const handleJobCreated = (jobId: string) => {
		const alreadyExists = jobs?.some((j) => j.id === jobId);
		if (alreadyExists) {
			toast.info(t("existingExportFound"));
		}
		setHighlightedJobId(jobId);
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
