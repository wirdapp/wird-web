import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Pencil, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
import {
	useCreateNotification,
	useDeleteNotification,
	useNotifications,
	useUpdateNotification,
} from "../../services/notifications/queries";
import type { AllNotification } from "../../types";
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
	const [editingNotification, setEditingNotification] = useState<AllNotification | null>(null);
	const createNotification = useCreateNotification();
	const deleteNotification = useDeleteNotification();
	const updateNotification = useUpdateNotification();
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

	const isEditing = editingNotification !== null;
	const isMutating = createNotification.isPending || updateNotification.isPending;

	const openCreateDialog = () => {
		setEditingNotification(null);
		form.reset({ title: "", body: "" });
		setAnnouncementFormVisible(true);
	};

	const openEditDialog = (notification: AllNotification) => {
		setEditingNotification(notification);
		form.reset({ title: notification.title, body: notification.body });
		setAnnouncementFormVisible(true);
	};

	const closeDialog = () => {
		setAnnouncementFormVisible(false);
		setEditingNotification(null);
	};

	const handleDelete = async (notificationId: string) => {
		if (!currentContest) return;
		await deleteNotification.mutateAsync(
			{ contestId: currentContest.id, notificationId },
			{
				onSuccess: () => {
					toast.success(t("notification-deleted-successfully"));
				},
				onError: () => {
					toast.error(t("something-went-wrong"));
				},
			},
		);
	};

	const onFormFinish = async (values: FormValues): Promise<void> => {
		if (!currentContest) return;

		try {
			if (isEditing) {
				await updateNotification.mutateAsync({
					contestId: currentContest.id,
					notificationId: editingNotification.id,
					title: values.title.trim(),
					body: values.body.trim(),
				});
			} else {
				await createNotification.mutateAsync({
					contestId: currentContest.id,
					title: values.title.trim(),
					body: values.body.trim(),
				});
			}
			closeDialog();
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
						<Button variant="outline" onClick={openCreateDialog}>
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
										<div className="flex items-center gap-2">
											{notification.sent_at && (
												<span className="text-[10px] text-muted-foreground">
													{dayjs(notification.sent_at).format("DD MMM YYYY HH:mm")}
												</span>
											)}
											<span
												className={`text-[10px] font-medium ${notification.is_sent ? "text-green-600" : "text-amber-500"}`}
											>
												{notification.is_sent ? t("sent") : t("not-sent-yet")}
											</span>
										</div>
										<span className="font-semibold">{notification.title}</span>
										<span>{notification.body}</span>
									</div>
									{canManageAnnouncements && (
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => openEditDialog(notification)}
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<ConfirmDialog
												trigger={
													<Button variant="ghost" size="icon">
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												}
												title={t("delete-notification")}
												description={t("delete-notification-confirm")}
												confirmText={t("delete")}
												cancelText={t("cancel")}
												variant="destructive"
												onConfirm={() => handleDelete(notification.id)}
											/>
										</div>
									)}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
			<Dialog open={announcementFormVisible} onOpenChange={(open) => !open && closeDialog()}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{isEditing ? t("edit-announcement") : t("make-an-announcement")}
						</DialogTitle>
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
												disabled={isMutating}
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
												disabled={isMutating}
												className="overflow-x-auto"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={closeDialog} disabled={isMutating}>
									{t("cancel")}
								</Button>
								<Button type="submit" disabled={isMutating}>
									{isMutating ? "..." : isEditing ? t("save") : t("add")}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};
