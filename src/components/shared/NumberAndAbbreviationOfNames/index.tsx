import type { ContestPerson } from "../../../types";
import { getFullName, getInitials } from "../../../util/user-utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const avatarStyles = [
	"bg-[#FDD561] text-black",
	"bg-[#FF5367] text-white",
	"bg-[#503E9D] text-[#FDD561]",
];

interface NumberAndAbbreviationOfNamesProps {
	users: ContestPerson[];
}

function NumberAndAbbreviationOfNames(props: NumberAndAbbreviationOfNamesProps) {
	const displayUsers = props.users.slice(0, 3);
	const remainingCount = props.users.length - 3;

	return (
		<div className="flex flex-row items-center gap-0 ms-auto">
			<div className="flex -space-x-2 rtl:space-x-reverse">
				{displayUsers.map((user, i) => (
					<Tooltip key={i}>
						<TooltipTrigger asChild>
							<Avatar className="h-9 w-9 border-2 border-background">
								<AvatarFallback className={avatarStyles[i]}>
									{getInitials(user.person_info)}
								</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent>
							{getFullName(user.person_info)}
						</TooltipContent>
					</Tooltip>
				))}
				{remainingCount > 0 && (
					<Avatar className="h-9 w-9 border-2 border-background">
						<AvatarFallback className="bg-muted text-muted-foreground text-xs">
							+{remainingCount}
						</AvatarFallback>
					</Avatar>
				)}
			</div>
		</div>
	);
}

export default NumberAndAbbreviationOfNames;
