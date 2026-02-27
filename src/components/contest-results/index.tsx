import type React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { Empty } from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContestStatus } from "../../services/contests/utils";
import { AnimatedPage } from "../../ui/animated-page";
import { isAtLeastSuperAdmin } from "../../util/roles";
import { useDashboardData } from "../../util/routes-data";
import { MembersResults } from "./members-results/members-results";
import { ExportResults } from "./results-overview/export-results";
import { ResultsOverview } from "./results-overview/results-overview";

export const ContestResults: React.FC = () => {
	const { t } = useTranslation();
	const { tab: tabParam } = useParams<{ tab: string }>();
	const navigate = useNavigate();
	const { currentContest, currentUser } = useDashboardData();

	const onTabChange = (tab: string): void => {
		navigate(`../results/${tab}`);
	};

	return (
		<AnimatedPage className="h-full">
			{currentContest?.status === ContestStatus.NOT_STARTED ? (
				<Empty description={t("contestNotStarted")} className="mt-12" />
			) : (
				<Tabs value={tabParam} onValueChange={onTabChange} className="h-full flex flex-col">
					<TabsList>
						<TabsTrigger value="overview">{t("results-overview")}</TabsTrigger>
						<TabsTrigger value="members">{t("results-members")}</TabsTrigger>
						{isAtLeastSuperAdmin(currentUser?.role) && (
							<TabsTrigger value="export">{t("exportToExcel")}</TabsTrigger>
						)}
					</TabsList>
					<TabsContent value="overview" className="flex-1">
						<ResultsOverview />
					</TabsContent>
					<TabsContent value="members" className="flex-1">
						<MembersResults />
					</TabsContent>
					{isAtLeastSuperAdmin(currentUser?.role) && (
						<TabsContent value="export" className="flex-1">
							<ExportResults />
						</TabsContent>
					)}
				</Tabs>
			)}
		</AnimatedPage>
	);
};
