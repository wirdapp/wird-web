import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useExportJobs } from "../../../services/contest-results/queries";
import { ExportJobDialog } from "./export-job-dialog";
import { ExportJobList } from "./export-job-list";

export const ExportResults: React.FC = () => {
	const { t } = useTranslation();
	const { data: jobs, isLoading } = useExportJobs();
	const [dialogOpen, setDialogOpen] = useState(false);
	const sessionJobIds = useRef(new Set<string>());

	const handleJobCreated = (jobId: string) => {
		sessionJobIds.current.add(jobId);
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
				<ExportJobList jobs={jobs ?? []} sessionJobIds={sessionJobIds.current} />
			)}

			<ExportJobDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onJobCreated={handleJobCreated}
			/>
		</div>
	);
};
