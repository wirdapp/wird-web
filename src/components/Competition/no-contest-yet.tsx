import { PlusCircleIcon } from "@heroicons/react/20/solid";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Result } from "@/components/ui/result";
import { CreateContestPopup } from "./create-contest-popup";
import { JoinContestPopup } from "./join-contest-popup";

export const NoContestYet: React.FC = () => {
	const { t } = useTranslation();
	const [createContestOpen, setCreateContestOpen] = useState<boolean>(false);
	const [joinContestOpen, setJoinContestOpen] = useState<boolean>(false);

	return (
		<Result
			status="info"
			title=""
			subTitle={t("no-contest-yet-msg")}
			extra={
				<div className="flex gap-2">
					<Button onClick={() => setCreateContestOpen(true)}>
						<PlusCircleIcon className="h-4 w-4" />
						{t("create-contest")}
					</Button>
					<Button variant="outline" onClick={() => setJoinContestOpen(true)}>
						{t("join-contest")}
					</Button>
					<CreateContestPopup
						visible={createContestOpen}
						onClose={() => setCreateContestOpen(false)}
					/>
					<JoinContestPopup visible={joinContestOpen} onClose={() => setJoinContestOpen(false)} />
				</div>
			}
		/>
	);
};
