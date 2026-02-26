import { AlertTriangle, Mail } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthService } from "../../services/auth/auth.service";
import { useDashboardData } from "../../util/routes-data";

export const EmailNotVerifiedAlert: React.FC = () => {
	const { t } = useTranslation();
	const { currentUser } = useDashboardData();
	const [submitting, setSubmitting] = React.useState<boolean>(false);

	const handleResendVerificationEmail = async (): Promise<void> => {
		setSubmitting(true);
		try {
			await AuthService.resendVerificationEmail(currentUser?.email ?? "");
			toast.success(t("verificationEmailSent"));
		} catch (e) {
			console.error(e);
			if ((e as Error).message === "email-already-sent") {
				toast.error(t("emailAlreadySent"));
				return;
			}
			toast.error(t("somethingWentWrong"));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Alert className="bg-yellow-50 border-yellow-200">
			<AlertTriangle className="h-4 w-4 text-yellow-600" />
			<AlertTitle className="text-yellow-800">{t("emailNotVerified")}</AlertTitle>
			<AlertDescription className="text-yellow-700">
				<div className="flex flex-col gap-2">
					<div
						// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted i18n string
						dangerouslySetInnerHTML={{
							__html: t("emailNotVerifiedDescription", {
								email: currentUser?.email ?? "",
							}),
						}}
					/>
					<div className="flex items-center gap-1">
						{t("didntReceiveEmail")}{" "}
						<Button
							variant="link"
							className="p-0 h-auto text-yellow-800 hover:text-yellow-900"
							disabled={submitting}
							onClick={handleResendVerificationEmail}
						>
							<Mail className="h-4 w-4 mr-1" />
							{submitting ? t("loading") : t("resendVerificationEmail")}
						</Button>
					</div>
				</div>
			</AlertDescription>
		</Alert>
	);
};
