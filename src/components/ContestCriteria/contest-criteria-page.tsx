import type React from "react";
import { useTranslation } from "react-i18next";
import { AnimatedPage } from "../../ui/animated-page";
import { isAtLeastSuperAdmin } from "../../util/roles";
import { useDashboardData } from "../../util/routes-data";
import { ContestCriteriaProvider } from "./contest-criteria-context";
import { ContestPreview } from "./contest-preview";
import { SectionsList } from "./sections/sections-list";
import { Result } from "@/components/ui/result";

export function ContestCriteria(): React.ReactElement {
	const { t } = useTranslation();
	const { currentUser } = useDashboardData();

	const canAccess = currentUser?.role !== undefined && isAtLeastSuperAdmin(currentUser.role);

	return (
		<AnimatedPage>
			{canAccess ? (
				<ContestCriteriaProvider>
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
						<div className="lg:col-span-7">
							<SectionsList />
						</div>
						<div className="lg:col-span-5 lg:sticky lg:top-4 lg:self-start">
							<h3 className="text-xl font-semibold mb-4">{t("preview")}</h3>
							<div className="p-4 bg-muted min-h-[200px]">
								<ContestPreview />
							</div>
						</div>
					</div>
				</ContestCriteriaProvider>
			) : (
				<Result status="error" title={t("forbidden")} subTitle={t("notSuperAdmin")} />
			)}
		</AnimatedPage>
	);
}
