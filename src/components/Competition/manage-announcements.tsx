import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Empty } from "@/components/ui/empty";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNotification, useNotifications } from "../../services/notifications/queries";
import { isAtLeastSuperAdmin } from "../../util/roles";
import { useDashboardData } from "../../util/routes-data";

interface ApiErrorResponse {
	response?: {
		data?: Record<string, string>;
	};
}

export const ManageAnnouncements: React.FC = () => {
	const { currentContest, currentUser } = useDashboardData();
	const { t } = useTranslation();
	const [announcementFormVisible, setAnnouncementFormVisible] = useState<boolean>(false);
	const createNotification = useCreateNotification();
	const { data: notifications = [], isFetching } = useNotifications(currentContest?.id);

	const formSchema = z.object({
		title: z.string().min(1, t("requiredField")),
		body: z
			.string()
			.min(1, t("requiredField"))
			.max(500, t("maxCharsLimit", { max: 500 })),
	});

	type FormValues = z.infer<typeof formSchema>;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			body: "",
		},
	});

	const onFormFinish = async (values: FormValues): Promise<void> => {
		if (!currentContest) return;

		try {
			await createNotification.mutateAsync({
				contestId: currentContest.id,
				title: values.title.trim(),
				body: values.body.trim(),
			});
			setAnnouncementFormVisible(false);
			form.reset();
		} catch (err) {
			console.log(err);
			const error = err as ApiErrorResponse;
			const errorsList: string[] = [];
			Object.values(error.response?.data ?? {}).forEach((errMsg) => {
				errorsList.push(errMsg);
			});
			if (errorsList.length > 0) {
				errorsList.forEach((errItem) => {
					toast.error(errItem);
				});
			} else {
				toast.error(t("something-went-wrong"));
			}
		}
	};

	const canManageAnnouncements =
		currentUser?.role !== undefined ? isAtLeastSuperAdmin(currentUser.role) : false;

	return (
		<>
			<div className="rounded-3xl bg-wheat-warm p-6">
				<div className="flex items-center justify-between">
					<h2 className="text-base font-bold">{t("active-announcements")}</h2>

					{canManageAnnouncements && (
						<Button variant="outline" onClick={() => setAnnouncementFormVisible(true)}>
							{t("new-announcement")}
						</Button>
					)}
				</div>
				{notifications.length === 0 ? (
					<Empty />
				) : (
					<div className="relative">
						{isFetching && (
							<div className="absolute inset-0 flex items-center justify-center bg-white/50">
								<Spinner />
							</div>
						)}
						<ul className="m-0 flex list-none flex-col gap-0.5 p-0 py-4">
							{notifications.map((notification, index) => (
								<li
									key={notification.id}
									className={`flex w-full items-center justify-between whitespace-pre-wrap bg-white p-3 ${
										index === 0 ? "rounded-t-lg" : ""
									} ${index === notifications.length - 1 ? "rounded-b-lg" : ""}`}
								>
									<div className="flex flex-col gap-1">
										<span className="text-[10px] text-muted-foreground">
											{notification.created_at
												? dayjs(notification.created_at).format("DD MMM YYYY HH:mm")
												: t("not-sent-yet")}
										</span>
										<span className="font-semibold">{notification.title}</span>
										<span>{notification.body}</span>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			<Dialog
				open={announcementFormVisible}
				onOpenChange={(open) => !open && setAnnouncementFormVisible(false)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("make-an-announcement")}</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onFormFinish)}
							className="max-w-full space-y-4 overflow-hidden px-1"
						>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("notification-title")}</FormLabel>
										<FormControl>
											<Input
												placeholder={t("notification-title-placeholder")}
												disabled={createNotification.isPending}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="body"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("notification-body")}</FormLabel>
										<FormControl>
											<Textarea
												placeholder={t("notification-body-placeholder")}
												rows={5}
												maxLength={500}
												disabled={createNotification.isPending}
												className="overflow-x-auto"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setAnnouncementFormVisible(false)}
									disabled={createNotification.isPending}
								>
									{t("cancel")}
								</Button>
								<Button type="submit" disabled={createNotification.isPending}>
									{createNotification.isPending ? "..." : t("add")}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};
