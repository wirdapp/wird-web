import { TrashIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContestsService } from "../../../services/contests/contests.service";
import { removeCurrentContest } from "../../../services/contests/utils";
import { useDashboardData } from "../../../util/routes-data";

export const ContestDeleteSection: React.FC = () => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const { currentContest } = useDashboardData();
	const [confirmText, setConfirmText] = React.useState<string>("");
	const [deleting, setDeleting] = React.useState<boolean>(false);

	if (!currentContest) {
		return null;
	}

	const onDelete = async (): Promise<void> => {
		setDeleting(true);
		try {
			await ContestsService.drop(currentContest.id, true);
			toast.success(t("contest-removed"));
			removeCurrentContest();
			window.location.reload();
		} catch (error) {
			console.error(error);
			toast.error(t("something-went-wrong"));
		} finally {
			setDeleting(false);
		}
	};

	return (
		<div className="rounded-3xl border border-brand-red-light p-6 text-grey-dark">
			<h3 className="text-brand-red font-bold">{t("danger-zone")}</h3>
			<p>{t("deleting-contest-description")}</p>
			<Button variant="destructive" onClick={() => setIsOpen(true)}>
				{t("delete-contest")}
			</Button>
			<Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<ExclamationTriangleIcon className="h-6 w-6 text-brand-yellow" />
							{t("are-you-sure")}
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<p className="m-0">{t("deleting-contest-description")}:</p>
						<ul className="m-0">
							<li>{t("users")}</li>
							<li>{t("groups")}</li>
							<li>{t("points")}</li>
							<li>{t("results")}</li>
						</ul>
						<Alert variant="destructive">
							<AlertDescription>{t("action-cannot-be-undone")}</AlertDescription>
						</Alert>
						<div className="space-y-2">
							<Label>{t("write-contest-code-to-confirm")}</Label>
							<Input
								onChange={(e) => setConfirmText(e.target.value)}
								value={confirmText}
								placeholder={t("write-contest-code", {
									code: currentContest.contest_id,
								})}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
							disabled={deleting}
						>
							{t("cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={onDelete}
							disabled={confirmText !== currentContest.contest_id || deleting}
						>
							<TrashIcon className="h-4 w-4" />
							{deleting ? "..." : t("delete-contest")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
