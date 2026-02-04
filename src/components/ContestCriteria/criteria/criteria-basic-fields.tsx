import type React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const CriteriaBasicFields: React.FC = () => {
	const { t } = useTranslation();
	const form = useFormContext();

	return (
		<div className="space-y-4">
			<FormField
				control={form.control}
				name="label"
				rules={{ required: t("requiredField") }}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{t("criteria-title")}</FormLabel>
						<FormControl>
							<Input placeholder={t("criteria-title")} {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="description"
				rules={{ required: t("requiredField") }}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{t("criteria-description")}</FormLabel>
						<FormControl>
							<Textarea placeholder={t("criteria-description")} {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="points"
				render={({ field }) => (
					<FormItem>
						<FormLabel>{t("criteria-points")}</FormLabel>
						<FormControl>
							<Input
								type="number"
								min={1}
								{...field}
								onChange={(e) => field.onChange(Number(e.target.value))}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
};
