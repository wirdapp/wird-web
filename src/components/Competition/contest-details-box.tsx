import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import type React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getCountryFlagElement, getCountryName } from "../../data/countries";
import { useDashboardData } from "../../util/routes-data";
import { ContestBadge } from "./contest-badge";

export const ContestDetailsBox: React.FC = () => {
	const { currentContest } = useDashboardData();
	const { t, i18n } = useTranslation();

	if (!currentContest) {
		return null;
	}

	const Flag = getCountryFlagElement(currentContest.country, i18n.language);

	const handleCopyCode = () => {
		navigator.clipboard.writeText(currentContest.contest_id);
		toast.success(t("copied"));
	};

	return (
		<div className="flex w-full gap-4 rounded-2xl border-2 border-wheat-warm p-4">
			<Squares2X2Icon className="h-8 w-8 text-brand-yellow" />
			<div className="flex flex-col items-start gap-2">
				<h2 className="flex items-center gap-3 text-2xl font-bold">
					{currentContest.name}
					<ContestBadge status={currentContest.status} variant="inline" />
				</h2>
				{currentContest.description && <h3>{currentContest.description}</h3>}

				<div className="flex flex-wrap items-center gap-2 text-grey-dark">
					{t("country")}:{" "}
					<span>
						{currentContest.country && (
							<span className="inline-flex items-center gap-2">
								<Flag style={{ display: "block", width: 24 }} />
								{getCountryName(currentContest.country, i18n.language)}
							</span>
						)}
					</span>
				</div>

				<div className="flex flex-wrap items-center gap-2 text-grey-dark">
					{t("start-date")}:{" "}
					<span>
						{dayjs(currentContest.start_date).locale(i18n.language).format("dddd, DD MMM YYYY")}
					</span>
				</div>

				<div className="flex flex-wrap items-center gap-2 text-grey-dark">
					{t("end-date")}:{" "}
					<span>
						{dayjs(currentContest.end_date).locale(i18n.language).format("dddd, DD MMM YYYY")}
					</span>
				</div>

				<div className="flex flex-wrap items-center gap-2 text-grey-dark">
					{t("join-code")}:{" "}
					<button
						type="button"
						onClick={handleCopyCode}
						className="inline-flex items-center gap-1 font-mono text-black hover:text-primary"
					>
						{currentContest.contest_id}
						<ClipboardDocumentIcon className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
};
