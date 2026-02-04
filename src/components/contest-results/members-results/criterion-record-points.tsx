import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldTypes } from "../../../services/contest-criteria/consts";
import type { Criterion } from "../../../types";
import { isAtLeastSuperAdmin } from "../../../util/roles";
import { useDashboardData } from "../../../util/routes-data";

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
}

interface SaveParams {
	record: PointRecordData;
	data: SaveData;
}

interface CriterionRecordPointsProps {
	onSave: (params: SaveParams) => Promise<PointRecordData>;
	pointRecord: PointRecordData;
	criteria: Criterion[];
}

interface FormValues {
	point_total: number;
}

export const CriterionRecordPoints: React.FC<CriterionRecordPointsProps> = ({
	onSave,
	pointRecord: recordFromProps,
	criteria,
}) => {
	const [pointRecord, setPointRecord] = useState<PointRecordData>(recordFromProps);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const { currentUser } = useDashboardData();

	const criterion = criteria.find((c) => c.id === pointRecord.contest_criterion_data.id);

	const canEdit =
		currentUser?.role !== undefined &&
		isAtLeastSuperAdmin(currentUser.role) &&
		criterion?.resourcetype === FieldTypes.Text;

	const form = useForm<FormValues>({
		defaultValues: {
			point_total: pointRecord.point_total,
		},
	});

	const newPoints = useWatch({
		control: form.control,
		name: "point_total",
	});

	useEffect(() => {
		setPointRecord(recordFromProps);
		form.reset({ point_total: recordFromProps.point_total });
	}, [recordFromProps, form]);

	const onFormSubmit = async (values: FormValues): Promise<void> => {
		if (!canEdit) return;
		setSubmitting(true);
		const updatedRecord = await onSave({
			record: pointRecord,
			data: {
				point_total: values.point_total,
			},
		});
		setPointRecord(updatedRecord);
		setSubmitting(false);
	};

	const handleReset = (): void => {
		form.reset({ point_total: pointRecord.point_total });
	};

	const hasChanged = newPoints !== pointRecord.point_total;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onFormSubmit)}>
				<div className="flex items-center gap-1">
					{canEdit ? (
						<FormField
							control={form.control}
							name="point_total"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="number"
											max={criterion?.max_points}
											min={0}
											className="w-24"
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					) : (
						pointRecord.point_total
					)}
					{canEdit && hasChanged && (
						<div className="flex gap-1 ms-1">
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
