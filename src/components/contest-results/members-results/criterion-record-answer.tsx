/**
 * @deprecated This editable component is no longer used. Submission cards are now read-only.
 * Kept for potential reuse in a future editing flow.
 */
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import type { Criterion } from "../../../types";
import { CriterionField } from "../../ContestCriteria/criterion-field";

type AnswerValue = string | number | boolean | string[];

interface PointRecordData {
	id: string;
	point_total: number;
	contest_criterion_data: {
		id: string;
		label: string;
	};
	resourcetype: string;
	record_date: string;
	person: string;
	timestamp: string;
	user_input?: string;
	number?: number;
	checked?: boolean;
	choices?: string[];
	choice?: string;
}

interface SaveData {
	point_total?: number;
	points?: number;
	number?: number;
	checked?: boolean;
	choice?: string;
	choices?: string[];
	user_input?: string;
	[key: string]: AnswerValue | undefined;
}

interface SaveParams {
	record: PointRecordData;
	data: SaveData;
}

interface CriterionRecordAnswerProps {
	onSave: (params: SaveParams) => Promise<PointRecordData>;
	pointRecord: PointRecordData;
	criteria: Criterion[];
}

const answerField: Record<string, keyof PointRecordData> = {
	UserInputPointRecord: "user_input",
	NumberPointRecord: "number",
	CheckboxPointRecord: "checked",
	MultiCheckboxPointRecord: "choices",
	RadioPointRecord: "choice",
};

export const CriterionRecordAnswer: React.FC<CriterionRecordAnswerProps> = ({
	onSave,
	pointRecord: recordFromProps,
	criteria,
}) => {
	const [pointRecord, setPointRecord] = useState<PointRecordData>(recordFromProps);
	const [submitting, setSubmitting] = useState<boolean>(false);

	const criterion = criteria.find((c) => c.id === pointRecord.contest_criterion_data.id);
	const fieldName = answerField[pointRecord.resourcetype];
	const answer = fieldName ? pointRecord[fieldName] : undefined;

	const form = useForm<Record<string, AnswerValue>>({
		defaultValues: {
			[pointRecord.id]: answer as AnswerValue,
		},
	});

	const newAnswer = useWatch({
		control: form.control,
		name: pointRecord.id,
	});

	useEffect(() => {
		setPointRecord(recordFromProps);
		form.reset({
			[recordFromProps.id]: recordFromProps[
				answerField[recordFromProps.resourcetype] as keyof PointRecordData
			] as AnswerValue,
		});
	}, [recordFromProps, form]);

	if (!criterion) return null;

	const onFormSubmit = async (values: Record<string, AnswerValue>): Promise<void> => {
		setSubmitting(true);
		const updatedRecord = await onSave({
			record: pointRecord,
			data: {
				[fieldName]: values[pointRecord.id],
			},
		});
		setPointRecord(updatedRecord);
		setSubmitting(false);
	};

	const handleReset = (): void => {
		form.reset({ [pointRecord.id]: answer as AnswerValue });
	};

	const isText = pointRecord.resourcetype === "UserInputPointRecord";
	const hasChanged = newAnswer !== answer;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onFormSubmit)}>
				<div className="flex flex-nowrap items-center gap-1">
					<FormField
						control={form.control}
						name={pointRecord.id}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<CriterionField
										criterion={criterion}
										value={field.value}
										onChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					{hasChanged && (
						<div className={`flex ${isText ? "flex-col" : "flex-row"} gap-1 ms-1`}>
							<Button type="submit" size="icon" className="h-6 w-6" disabled={submitting}>
								<CheckIcon className="h-4 w-4" />
							</Button>
							<Button
								type="button"
								variant="outline"
								size="icon"
								className="h-6 w-6"
								onClick={handleReset}
								disabled={submitting}
							>
								<XMarkIcon className="h-4 w-4" />
							</Button>
						</div>
					)}
				</div>
			</form>
		</Form>
	);
};
