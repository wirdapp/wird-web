import type React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BoundsInputProps {
	value?: [number | undefined, number | undefined];
	onChange?: (value: [number | undefined, number | undefined]) => void;
}

export const BoundsInput: React.FC<BoundsInputProps> = ({ value, onChange }) => {
	const { t } = useTranslation();

	const handleChange = (type: "min" | "max", val: string): void => {
		const numVal = val === "" ? undefined : Number(val);
		const newValue: [number | undefined, number | undefined] = [
			...(value ?? [undefined, undefined]),
		] as [number | undefined, number | undefined];
		newValue[type === "min" ? 0 : 1] = numVal;
		onChange?.(newValue);
	};

	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="space-y-2">
				<Label>{t("criteria-min")}</Label>
				<Input
					type="number"
					value={value?.[0] ?? ""}
					onChange={(e) => handleChange("min", e.target.value)}
				/>
			</div>
			<div className="space-y-2">
				<Label>{t("criteria-max")}</Label>
				<Input
					type="number"
					value={value?.[1] ?? ""}
					onChange={(e) => handleChange("max", e.target.value)}
				/>
			</div>
		</div>
	);
};
