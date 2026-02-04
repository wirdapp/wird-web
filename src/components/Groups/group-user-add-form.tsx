import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAddGroupMember } from "../../services/groups/queries";
import type { GroupMember } from "../../types";
import { GroupRole } from "../../types";
import { Role } from "../../util/roles";
import { useDashboardData } from "../../util/routes-data";
import { MembersSelect } from "../contest-results/members-results/members-select";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface GroupUserAddFormProps {
	groupId: string;
	groupMembers: GroupMember[];
	role: GroupRole;
}

interface ErrorObject {
	error: { [key: string]: string[] };
	data?: { contest_person: string };
}

interface AddMemberResponse {
	errors?: ErrorObject[];
}

export const GroupUserAddForm: React.FC<GroupUserAddFormProps> = ({
	groupId,
	groupMembers,
	role,
}) => {
	const { currentUser } = useDashboardData();
	const { t } = useTranslation();
	const [formErrors, setFormErrors] = React.useState<{ [key: string]: string[] }>({});
	const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
	const isMobile = useIsMobile();
	const addGroupMember = useAddGroupMember();

	const fillErrors = (errors: ErrorObject[] | undefined) => {
		if (errors) {
			errors.forEach((errorObj) => {
				setFormErrors((prev) => {
					const newErrors = { ...prev };
					Object.entries(errorObj.error).forEach(([key, value]) => {
						if (Array.isArray(newErrors[key])) {
							newErrors[key].push(...value);
						} else {
							newErrors[key] = value;
						}
					});
					return newErrors;
				});
			});
		}
	};

	const addUsersToGroup = async (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedMembers.length === 0) {
			setFormErrors({ contest_person: [t("requiredField")] });
			return;
		}
		setFormErrors({});
		try {
			const body = selectedMembers.map((id) => ({
				contest_person: id,
				group_role: role,
			}));

			const data = (await addGroupMember.mutateAsync({
				groupId: groupId!,
				body: body as unknown as { user_id?: string; username?: string; group_role?: GroupRole },
			})) as unknown as AddMemberResponse;
			if (data.errors) {
				const failedUsersIds = data.errors
					.map((error) => error.data?.contest_person)
					.filter((id): id is string => id !== undefined);
				setSelectedMembers(failedUsersIds);
				fillErrors(data.errors);
				toast.error(t("something-went-wrong"));
			} else {
				toast.success(t("group-updated"));
				setSelectedMembers([]);
			}
		} catch (e) {
			console.error(e);
			toast.error(t("something-went-wrong"));
			const axiosError = e as { response?: { data?: { errors?: ErrorObject[] } } };
			fillErrors(
				axiosError.response?.data?.errors ??
					(axiosError.response?.data as unknown as ErrorObject[] | undefined),
			);
		}
	};

	return (
		<form onSubmit={addUsersToGroup} className="space-y-3">
			<div className="flex items-center gap-2 text-sm font-medium">
				<PlusCircleIcon className="h-5 w-5" />
				{role === GroupRole.ADMIN ? t("add-admins") : t("add-members")}
			</div>
			<div className={`flex gap-2 ${isMobile ? "flex-col" : "flex-row"}`}>
				<div className="flex-1">
					<MembersSelect
						placeholder={t("select-member")}
						role={role === GroupRole.ADMIN ? Role.ADMIN : Role.MEMBER}
						excludeUsernames={[
							currentUser?.username ?? "",
							...(groupMembers ?? []).map((m) => m.person_info.username),
						]}
						mode="multiple"
						value={selectedMembers}
						onChange={(value) => setSelectedMembers(value as string[])}
						status={formErrors.contest_person ? "error" : undefined}
						className="w-full"
					/>
					{formErrors.contest_person && (
						<p className="text-sm text-destructive mt-1">
							{formErrors.contest_person.join(", ")}
						</p>
					)}
				</div>
				<Button
					type="submit"
					disabled={addGroupMember.isPending}
				>
					{addGroupMember.isPending ? (
						<span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
					) : (
						<PlusIcon className="h-4 w-4" />
					)}
					{t("add")}
				</Button>
			</div>
		</form>
	);
};
