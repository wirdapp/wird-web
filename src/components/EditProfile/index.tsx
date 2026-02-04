import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "../../hooks/use-mobile";
import { useUpdateUserInfo } from "../../services/auth/queries";
import { useDashboardData } from "../../util/routes-data";
import { getFullName } from "../../util/user-utils";
import { ChangePasswordForm } from "./change-password-form";
import { ProfilePictureUploader } from "./profile-picture-uploader";
import { UserDetailsForm } from "./user-details-form";

export interface UpdateUserInfoValues {
	first_name?: string;
	last_name?: string;
	profile_photo?: File;
}

function EditProfile() {
	const { currentUser } = useDashboardData();
	const { t } = useTranslation();
	const isMobile = useIsMobile();
	const updateUserInfo = useUpdateUserInfo();

	const handleSubmit = async (values: UpdateUserInfoValues): Promise<void> => {
		try {
			const formData = new FormData();
			if (values.first_name !== undefined) {
				formData.append("first_name", values.first_name);
			}
			if (values.last_name !== undefined) {
				formData.append("last_name", values.last_name);
			}
			if (values.profile_photo !== undefined) {
				formData.append("profile_photo", values.profile_photo);
			}
			await updateUserInfo.mutateAsync(formData);
			toast.success(t("profile-has-been-edited-successfully"));
		} catch (err) {
			const axiosError = err as AxiosError<Record<string, string[]>>;
			const errMessages: string[] = [];
			if (axiosError.response?.data) {
				const obj = axiosError.response.data;
				Object.keys(obj).forEach((e) => {
					errMessages.push(`${obj[e]} : ${e}`);
				});
			}
			toast.error(errMessages.length > 0 ? errMessages.join(", ") : t("something-went-wrong"));
		}
	};

	return (
		<div>
			<div className="flex items-center gap-6">
				<ProfilePictureUploader onSubmit={handleSubmit} />
				<div className="flex flex-col gap-1">
					<h3 className="text-xl font-semibold m-0">{getFullName(currentUser)}</h3>
					<span className="text-muted-foreground">{currentUser?.email}</span>
				</div>
			</div>
			<div className={cn("flex gap-6 mt-6 w-full", isMobile && "flex-col")}>
				<UserDetailsForm onSubmit={handleSubmit} />
				<ChangePasswordForm />
			</div>
		</div>
	);
}

export default EditProfile;
