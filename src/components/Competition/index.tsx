import React from "react";
import { useTranslation } from "react-i18next";
import { AnimatedPage } from "../../ui/animated-page";
import { useDashboardData } from "../../util/routes-data";
import ContestMembers from "./ContestMembers";
import { ContestDeleteSection } from "./ContestMembers/contest-delete-section";
import { ContestDetailsBox } from "./contest-details-box";
import EditCompetitionForm from "./EditCompetitionForm";
import { ManageAnnouncements } from "./manage-announcements";

// Simple error boundary component using class component
class ErrorBoundary extends React.Component<
	{ children: React.ReactNode; fallback: React.ReactNode },
	{ hasError: boolean }
> {
	constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback;
		}
		return this.props.children;
	}
}

const Competition: React.FC = () => {
	const { t } = useTranslation();
	const { currentContest } = useDashboardData();

	if (!currentContest) {
		return null;
	}

	return (
		<AnimatedPage>
			<div className="flex flex-col gap-6">
				<ContestDetailsBox />

				<ContestMembers />
				<div className="flex flex-col gap-4 md:flex-row">
					<EditCompetitionForm contest={currentContest} />
					<div className="flex w-full flex-col gap-4">
						<ErrorBoundary fallback={<div>{t("something-went-wrong")}</div>}>
							<ManageAnnouncements />
						</ErrorBoundary>
						<ContestDeleteSection />
					</div>
				</div>
			</div>
		</AnimatedPage>
	);
};

export default Competition;
