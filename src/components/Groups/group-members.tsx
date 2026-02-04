import { XMarkIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useRemoveGroupMember } from "../../services/groups/queries";
import type { Group, GroupMember } from "../../types";
import { GroupRole } from "../../types";
import { isAtLeastSuperAdmin } from "../../util/roles";
import { useDashboardData } from "../../util/routes-data";
import { getFullName } from "../../util/user-utils";
import { GroupUserAddForm } from "./group-user-add-form";
import { Button } from "@/components/ui/button";

interface MemberActionsProps {
	groupId: string;
	member: GroupMember;
}

const MemberActions: React.FC<MemberActionsProps> = ({ groupId, member }) => {
	const { t } = useTranslation();
	const { currentUser } = useDashboardData();
	const removeGroupMember = useRemoveGroupMember();

	const isSuperAdmin = currentUser?.role !== undefined && isAtLeastSuperAdmin(currentUser.role);

	if (!isSuperAdmin || currentUser?.username === member.person_info.username) return null;

	const removeMember = async () => {
		try {
			await removeGroupMember.mutateAsync({
				groupId: groupId!,
				memberId: member.id,
			});
			toast.success(t("group-member-removed"));
		} catch (e) {
			console.error(e);
			toast.error(t("something-went-wrong"));
		}
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			className="text-destructive hover:text-destructive hover:bg-destructive/10"
			disabled={removeGroupMember.isPending}
			onClick={removeMember}
		>
			{removeGroupMember.isPending ? (
				<span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
			) : (
				<XMarkIcon className="h-4 w-4" />
			)}
			{t("remove")}
		</Button>
	);
};

interface GroupMembersProps {
	group: Group;
	members: GroupMember[];
}

export const GroupMembers: React.FC<GroupMembersProps> = ({ group, members }) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-7">
			<div className="bg-background border rounded-lg divide-y">
				{members.map((member) => (
					<div
						key={member.id}
						className="flex items-center justify-between p-4"
					>
						<div className="flex flex-col">
							<span className="font-medium">
								{getFullName(member.person_info)}
							</span>
							<span className="text-sm text-muted-foreground">
								{member.group_role === GroupRole.ADMIN && t("group-roles.admin")}
								{member.group_role === GroupRole.MEMBER && t("group-roles.member")}
							</span>
						</div>
						<MemberActions groupId={group.id} member={member} />
					</div>
				))}
				{members.length === 0 && (
					<div className="p-4 text-center text-muted-foreground">
						{t("no-members")}
					</div>
				)}
			</div>
			<GroupUserAddForm groupId={group.id} groupMembers={members} role={GroupRole.MEMBER} />
			<GroupUserAddForm groupId={group.id} groupMembers={members} role={GroupRole.ADMIN} />
		</div>
	);
};
