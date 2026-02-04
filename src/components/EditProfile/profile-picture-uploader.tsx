import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useDashboardData } from "../../util/routes-data";
import type { UpdateUserInfoValues } from "./index";

interface ProfilePictureUploaderProps {
	onSubmit: (values: UpdateUserInfoValues) => Promise<void>;
}

export const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ onSubmit }) => {
	const { t } = useTranslation();
	const { currentUser } = useDashboardData();
	const [loading, setLoading] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string | null | undefined>(currentUser?.profile_photo);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setImageUrl(currentUser?.profile_photo);
	}, [currentUser]);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
		if (!isJpgOrPng) {
			toast.error("You can only upload JPG/PNG file!");
			return;
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			toast.error("Image must be smaller than 2MB!");
			return;
		}

		setLoading(true);
		try {
			await onSubmit({ profile_photo: file });
		} finally {
			setLoading(false);
		}
	};

	const handleClick = () => {
		inputRef.current?.click();
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						onClick={handleClick}
						className={cn(
							"relative rounded-full overflow-hidden cursor-pointer",
							"w-[100px] h-[100px]",
							"border-2 border-dashed border-input hover:border-primary/50",
							"transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
						)}
					>
						<input
							ref={inputRef}
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="sr-only"
						/>
						{imageUrl ? (
							<Avatar className="w-full h-full">
								<AvatarImage src={imageUrl} alt="avatar" />
								<AvatarFallback className="bg-transparent">
									<ArrowUpTrayIcon className="w-5 h-5 text-muted-foreground" />
								</AvatarFallback>
							</Avatar>
						) : (
							<div className="flex flex-col items-center justify-center w-full h-full bg-muted/30">
								{loading ? (
									<Spinner size="sm" />
								) : (
									<>
										<PlusIcon className="w-5 h-5 text-muted-foreground" />
										<span className="text-xs text-muted-foreground mt-2">Upload</span>
									</>
								)}
							</div>
						)}
						{loading && imageUrl && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/30">
								<Spinner size="sm" className="text-white" />
							</div>
						)}
					</button>
				</TooltipTrigger>
				<TooltipContent side="bottom">{t("change-profile-photo")}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
