import { UserIcon } from "@heroicons/react/20/solid";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Person } from "../../types";
import { getInitials } from "../../util/user-utils";

const blankUserBackgroundColors = ["#503E9D", "#FDD561", "#FF5367", "#FFBAC2", "#FB862C"];

const getBlankUserBackgroundColor = (colorIndex: number): string => {
	return (
		blankUserBackgroundColors[colorIndex % blankUserBackgroundColors.length] ??
		blankUserBackgroundColors[0]
	);
};

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
	user?: Person | null;
	colorIndex?: number;
	className?: string;
}

export const Avatar = ({ user, colorIndex = 0, className, style, ...props }: AvatarProps) => {
	const bgColor = getBlankUserBackgroundColor(colorIndex);

	return (
		<div
			className={cn(
				"user-avatar w-10 h-10 rounded-full flex justify-center items-center text-white select-none transition-all duration-200 ease-in-out hover:brightness-90 [&_svg]:w-6 [&_svg]:h-6",
				className,
			)}
			style={{ backgroundColor: bgColor, ...style }}
			{...props}
		>
			{getInitials(user) ?? <UserIcon />}
		</div>
	);
};
