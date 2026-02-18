import type React from "react";
import { useMemo } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useMembers } from "../../../services/members/queries";
import type { ContestPerson, Role } from "../../../types";
import { getFullName } from "../../../util/user-utils";

type ValueFieldFunction = (member: ContestPerson) => string;

interface MembersSelectProps {
	roles?: Role[];
	valueField?: string | ValueFieldFunction;
	excludeUsernames?: string[];
	value?: string | string[];
	onValueChange?: (value: string | null) => void;
	onChange?: (value: string | string[]) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	mode?: "multiple" | "single";
	status?: "error" | undefined;
}

export const MembersSelect: React.FC<MembersSelectProps> = ({
	roles,
	valueField = "id",
	excludeUsernames,
	value,
	onValueChange,
	onChange: _onChange,
	placeholder,
	className,
	disabled,
	mode: _mode,
	status: _status,
}) => {
	const { data, isLoading: loading } = useMembers();

	const members = useMemo(() => {
		if (!data) return [];
		return data.results
			.filter((member) => !roles || roles.includes(member.contest_role))
			.map((member) => ({
				value: typeof valueField === "function" ? valueField(member) : member.id,
				label: getFullName(member.person_info),
				username: member.person_info.username,
			}));
	}, [data, valueField, roles]);

	const filteredMembers = useMemo(
		() => members.filter((member) => !excludeUsernames?.includes(member.username)),
		[members, excludeUsernames],
	);

	return (
		<Select
			value={Array.isArray(value) ? value[0] : value}
			onValueChange={onValueChange}
			disabled={disabled || loading}
			items={filteredMembers.map((m) => ({ value: m.value, label: m.label }))}
		>
			<SelectTrigger className={cn("w-full", className)}>
				{loading ? (
					<div className="flex items-center gap-2">
						<Spinner size="sm" />
						<span className="text-muted-foreground">Loading...</span>
					</div>
				) : (
					<SelectValue placeholder={placeholder} />
				)}
			</SelectTrigger>
			<SelectContent title={placeholder}>
				{filteredMembers.map((member) => (
					<SelectItem key={member.value} value={member.value}>
						{member.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
