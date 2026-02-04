import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ContestsService } from "../../services/contests/contests.service";
import { changeCurrentContest } from "../../services/contests/utils";

interface JoinContestPopupProps {
	visible: boolean;
	onClose?: () => void;
}

export const JoinContestPopup: React.FC<JoinContestPopupProps> = ({ visible, onClose }) => {
	const { t } = useTranslation();
	const [submitting, setSubmitting] = React.useState<boolean>(false);
	const [serverError, setServerError] = React.useState<string | null>(null);

	const formSchema = z.object({
		code: z.string().min(1, t("requiredField")),
	});

	type FormValues = z.infer<typeof formSchema>;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			code: "",
		},
	});

	const handleSubmit = async (values: FormValues): Promise<void> => {
		setSubmitting(true);
		setServerError(null);
		try {
			await ContestsService.joinContest(values.code);
			const contests = await ContestsService.getContests();
			const newCurrentContest = contests.find((contest) => contest.contest_id === values.code);
			if (newCurrentContest) {
				changeCurrentContest(newCurrentContest.id);
				window.location.reload();
			}
			onClose?.();
		} catch (error) {
			console.log(error);
			setServerError(t("code-error"));
		} finally {
			setSubmitting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			form.reset();
			setServerError(null);
			onClose?.();
		}
	};

	return (
		<Dialog open={visible} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("join-contest")}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("code-label")}</FormLabel>
									<FormControl>
										<Input placeholder={t("code-label")} disabled={submitting} {...field} />
									</FormControl>
									<FormMessage>{serverError}</FormMessage>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
								{t("cancel")}
							</Button>
							<Button type="submit" disabled={submitting}>
								{submitting ? "..." : t("join-contest")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
