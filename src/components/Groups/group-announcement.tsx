import { TrashIcon } from "@heroicons/react/20/solid";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateGroup } from "../../services/groups/queries";
import type { Group, GroupAnnouncement as GroupAnnouncementType } from "../../types";

interface GroupAnnouncementProps {
	group: Group & { announcements: GroupAnnouncementType[] };
}

interface LegacyAnnouncement {
	text: string;
	date: string;
}

export const GroupAnnouncement: React.FC<GroupAnnouncementProps> = ({ group }) => {
	const { t } = useTranslation();

	const announcementSchema = z.object({
		newAnnouncementText: z.string().min(1, t("requiredField")),
	});

	type AnnouncementFormValues = z.infer<typeof announcementSchema>;
	const [deleting, setDeleting] = React.useState<number | null>(null);
	const updateGroup = useUpdateGroup();

	const form = useForm<AnnouncementFormValues>({
		resolver: zodResolver(announcementSchema),
		defaultValues: {
			newAnnouncementText: "",
		},
	});

	const handleSaveAnnouncement = async (announcements: LegacyAnnouncement[]) => {
		try {
			await updateGroup.mutateAsync({
				id: group.id,
				body: { announcements } as unknown as { name?: string },
			});
			toast.success(t("group-updated"));
		} catch (e) {
			console.error(e);
			toast.error(t("something-went-wrong"));
		}
	};

	const handleAddAnnouncement = async (values: AnnouncementFormValues) => {
		const newAnnouncement: LegacyAnnouncement = {
			text: values.newAnnouncementText,
			date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		};
		const existingAnnouncements = (group.announcements as unknown as LegacyAnnouncement[]) || [];
		await handleSaveAnnouncement([...existingAnnouncements, newAnnouncement]);
		form.reset();
	};

	const handleDeleteAnnouncement = async (index: number) => {
		setDeleting(index);
		const existingAnnouncements = (group.announcements as unknown as LegacyAnnouncement[]) || [];
		const updatedAnnouncements = [...existingAnnouncements];
		updatedAnnouncements.splice(index, 1);
		await handleSaveAnnouncement(updatedAnnouncements);
		setDeleting(null);
	};

	const newAnnouncementText = form.watch("newAnnouncementText");
	const announcements = (group.announcements as unknown as LegacyAnnouncement[]) || [];

	return (
		<div className="flex flex-col gap-6">
			<div className="bg-background border rounded-lg divide-y">
				{announcements.map((item: LegacyAnnouncement, index: number) => (
					<div key={`${item.date}-${index}`} className="flex items-start justify-between p-4 gap-4">
						<div className="flex items-start gap-3 min-w-0">
							<span className="text-muted-foreground shrink-0">{index + 1}.</span>
							<div className="flex flex-col min-w-0">
								<span className="whitespace-pre-wrap break-words">{item.text}</span>
								<small className="text-muted-foreground">{item.date}</small>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
							onClick={() => handleDeleteAnnouncement(index)}
							disabled={deleting === index}
						>
							{deleting === index ? (
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
							) : (
								<TrashIcon className="h-4 w-4" />
							)}
						</Button>
					</div>
				))}
				{announcements.length === 0 && (
					<div className="p-4 text-center text-muted-foreground">{t("no-announcements")}</div>
				)}
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleAddAnnouncement)} className="space-y-4">
					<FormField
						control={form.control}
						name="newAnnouncementText"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2">
									<PlusCircleIcon className="h-5 w-5" />
									{t("make-an-announcement")}
								</FormLabel>
								<FormControl>
									<Textarea placeholder={t("make-an-announcement")} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" size="sm" disabled={!newAnnouncementText || updateGroup.isPending}>
						{updateGroup.isPending ? (
							<span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
						) : (
							<PlusIcon className="h-4 w-4" />
						)}
						{t("new-announcement")}
					</Button>
				</form>
			</Form>
		</div>
	);
};
