import { PlusIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MultipleChoiceControlProps {
	value?: string[];
	onChange?: (value: string[]) => void;
}

export const MultipleChoiceControl: React.FC<MultipleChoiceControlProps> = ({
	value,
	onChange,
}) => {
	const { t } = useTranslation();

	const addOption = (): void => {
		onChange?.([...(value ?? []), ""]);
	};

	return (
		<div className="space-y-2">
			<ol className="list-decimal ps-10 space-y-2">
				{value?.map((item, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list of editable inputs
					<li key={index}>
						<Input
							value={item}
							onChange={(e) => {
								const newValue = [...(value ?? [])];
								newValue[index] = e.target.value;
								onChange?.(newValue);
							}}
						/>
					</li>
				))}
			</ol>
			<Button type="button" variant="outline" className="ms-10 border-dashed" onClick={addOption}>
				<PlusIcon className="h-4 w-4" />
				{t("add-option")}
			</Button>
		</div>
	);
};
