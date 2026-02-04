import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import type React from "react";
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
import { PasswordInput } from "@/components/ui/password-input";
import { AuthService } from "../../services/auth/auth.service";
import type { ChangePasswordFormData } from "../../types";

interface ChangePasswordFormValues {
	new_password1: string;
	new_password2: string;
}

export const ChangePasswordForm: React.FC = () => {
	const { t } = useTranslation();

	const formSchema = z.object({
		new_password1: z.string().min(1, t("requiredField")),
		new_password2: z.string().min(1, t("requiredField")),
	});

	const form = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			new_password1: "",
			new_password2: "",
		},
	});

	const onSubmit = async (values: ChangePasswordFormValues) => {
		try {
			// Cast to ChangePasswordFormData - the API may not require old_password in all cases
			await AuthService.changePassword(values as unknown as ChangePasswordFormData);
			form.reset();
			toast.success(t("password-has-been-changed-successfully"));
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

	const handleReset = () => {
		form.reset();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow">
				<fieldset className="border border-primary rounded-md p-3">
					<legend className="text-sm text-foreground px-2 mx-1 mb-2">{t("change-password")}</legend>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="new_password1"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("new-password")}</FormLabel>
									<FormControl>
										<PasswordInput placeholder={t("new-password")} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="new_password2"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("confirm-new-password")}</FormLabel>
									<FormControl>
										<PasswordInput placeholder={t("confirm-new-password")} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-2">
							<Button type="submit">{t("save")}</Button>
							<Button type="button" variant="ghost" onClick={handleReset}>
								{t("cancel")}
							</Button>
						</div>
					</div>
				</fieldset>
			</form>
		</Form>
	);
};
