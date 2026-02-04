import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { changeLanguage } from "../../util/roles";

export const AuthPageFooter = () => {
	const { t, i18n } = useTranslation();

	return (
		<div className="flex gap-4 items-center justify-center">
			<span className="text-muted-foreground text-sm">
				{t("copyrightFooterMsg", { year: new Date().getFullYear() })}
			</span>
			<Separator orientation="vertical" className="h-4" />
			{i18n.language === "en" ? (
				<Button variant="link" onClick={() => changeLanguage("ar")} className="p-0 h-auto">
					العربية
				</Button>
			) : (
				<Button variant="link" onClick={() => changeLanguage("en")} className="p-0 h-auto">
					English
				</Button>
			)}
		</div>
	);
};
