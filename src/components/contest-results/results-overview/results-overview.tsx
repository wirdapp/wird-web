import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContestResultsService } from "../../../services/contest-results/contest-results.service";
import type { DailySubmissionSummary } from "../../../types";
import { Empty } from "@/components/ui/empty";
import { ResultsOverviewSkeleton } from "./results-overview-skeleton";
import { SubmissionsCountChart } from "./submissions-count-chart";
import { SubmissionsList } from "./submissions-list";

export const ResultsOverview: React.FC = () => {
	const { t } = useTranslation();
	const [loading, setLoading] = useState<boolean>(false);
	const [results, setResults] = useState<DailySubmissionSummary[]>([]);

	useEffect(() => {
		setLoading(true);
		ContestResultsService.getResults()
			.then((results) => {
				setResults(results);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return loading ? (
		<ResultsOverviewSkeleton />
	) : (
		<div className="rounded-lg">
			{results.length === 0 ? (
				<Empty description={t("no-results")} className="py-20" />
			) : (
				<>
					<h3 className="text-xl font-light text-foreground mb-4">
						{t("contest-submissions")}
					</h3>
					<SubmissionsCountChart chartData={results} />
					<SubmissionsList results={results} />
				</>
			)}
		</div>
	);
};
