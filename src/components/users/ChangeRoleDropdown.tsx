import type React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useUpdateUserContestRole } from "../../services/members/queries";
import type { ContestPerson } from "../../types";
import {
	isAdmin,
	isDeactivated,
	isMember,
	isMemberReadOnly,
	isOwner,
	isPending,
	isSuperAdmin,
	Role,
} from "../../util/roles";
import { useDashboardData } from "../../util/routes-data";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChangeRoleDropdownProps {
	student: ContestPerson;
	onChange?: (result?: ContestPerson) => void;
}

const ChangeRoleDropdown: React.FC<ChangeRoleDropdownProps> = ({ student, onChange }) => {
	const { t, i18n } = useTranslation();
	const { currentUser } = useDashboardData();
	const updateUserContestRole = useUpdateUserContestRole();

	const studentRole = student?.contest_role;

	const dropDownItems = [
		isOwner(currentUser!.role!) &&
			!isSuperAdmin(studentRole) && {
				label: t("role.1"),
				key: Role.SUPER_ADMIN,
			},
		!isAdmin(studentRole) && {
			label: t("role.2"),
			key: Role.ADMIN,
		},
		!isMember(studentRole) && {
			label: t("role.3"),
			key: Role.MEMBER,
		},
		!isMemberReadOnly(studentRole) && {
			label: t("role.4"),
			key: Role.READ_ONLY_MEMBER,
		},
		!isPending(studentRole) && {
			label: t("role.5"),
			key: Role.PENDING,
		},
		!isDeactivated(studentRole) && {
			label: t("role.6"),
			key: Role.DEACTIVATED,
		},
	].filter(Boolean) as { label: string; key: Role }[];

	const updateRole = async (role: Role): Promise<void> => {
		try {
			const res = await updateUserContestRole.mutateAsync({
				role: role,
				userId: student.id,
			});
			toast.success(t("notification.success"));
			onChange?.(res);
		} catch (error) {
			toast.error(t("notification.error"));
		}
	};

	return !isOwner(student?.contest_role) ? (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					{t("change-role-to")}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align={i18n.dir() === "rtl" ? "start" : "end"}
			>
				{dropDownItems.map((item) => (
					<DropdownMenuItem
						key={item.key}
						onClick={() => updateRole(item.key)}
					>
						{item.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	) : null;
};

export default ChangeRoleDropdown;
