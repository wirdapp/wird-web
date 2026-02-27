import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { GroupsService } from "../../services/groups/groups.service";
import { MembersService } from "../../services/members/members.service";
import { createNormalizedFilter } from "../../util/normalize-text";
import type { Role } from "../../util/roles";
import { getFullName } from "../../util/user-utils";

interface MemberOption {
	value: string;
	label: string;
	username: string;
}

interface MultiMembersSelectProps {
	role?: Role | string;
	groupId?: string;
	excludeUsernames?: string[];
	value: string[];
	onChange: (ids: string[]) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

export const MultiMembersSelect: React.FC<MultiMembersSelectProps> = ({
	role,
	groupId,
	excludeUsernames,
	value,
	onChange,
	placeholder,
	className,
	disabled,
}) => {
	const memberFilter = useMemo(
		() => createNormalizedFilter<MemberOption>((item) => `${item.label} ${item.username}`),
		[],
	);
	const [members, setMembers] = useState<MemberOption[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);

		const fetchMembers = async () => {
			const res = await MembersService.getUsers({ role, page_size: 1000 });
			const membersList = Array.isArray(res) ? res : res.results;
			let options: MemberOption[] = membersList.map((member) => ({
				value: member.id,
				label: getFullName(member.person_info) ?? member.person_info.username,
				username: member.person_info.username,
			}));

			if (groupId) {
				const groupMembers = await GroupsService.getGroupMembers({ groupId });
				const groupUsernames = new Set(groupMembers.map((gm) => gm.person.username));
				options = options.filter((m) => groupUsernames.has(m.username));
			}

			return options;
		};

		fetchMembers()
			.then(setMembers)
			.finally(() => setLoading(false));
	}, [role, groupId]);

	const filteredMembers = useMemo(
		() => members.filter((member) => !excludeUsernames?.includes(member.username)),
		[members, excludeUsernames],
	);

	const selectedOptions = useMemo(
		() => filteredMembers.filter((m) => value.includes(m.value)),
		[filteredMembers, value],
	);

	if (loading) {
		return (
			<div
				className={cn(
					"flex min-h-11 items-center gap-2 rounded-lg border border-input px-4 py-2",
					className,
				)}
			>
				<Spinner size="sm" />
				<span className="text-muted-foreground text-sm">Loading...</span>
			</div>
		);
	}

	return (
		<Combobox
			items={filteredMembers}
			itemToStringValue={(item: MemberOption) => `${item.label} ${item.username}`}
			filter={memberFilter}
			multiple
			value={selectedOptions}
			onValueChange={(items: MemberOption[]) => {
				onChange(items.map((item) => item.value));
			}}
		>
			<ComboboxChips className={cn("min-h-10 text-base", className)}>
				<ComboboxValue>
					{value.map((id) => {
						const option = filteredMembers.find((m) => m.value === id);
						return option ? (
							<ComboboxChip key={option.value} className="text-sm py-1">
								{option.label}
							</ComboboxChip>
						) : null;
					})}
				</ComboboxValue>
				<ComboboxChipsInput placeholder={placeholder} className="text-base" disabled={disabled} />
			</ComboboxChips>
			<ComboboxContent>
				<ComboboxEmpty>No members found</ComboboxEmpty>
				<ComboboxList>
					{(item) => (
						<ComboboxItem key={item.value} value={item} className="py-2 text-base">
							{item.label}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
};
