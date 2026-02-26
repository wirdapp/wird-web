import { CheckIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FieldTypes } from "../../../services/contest-criteria/consts";
import type { CriterionCreateData, Section, UUID } from "../../../types";
import { CriteriaAdvancedFields } from "./criteria-advanced-fields";
import { CriteriaBasicFields } from "./criteria-basic-fields";
import { CriteriaTypeFields } from "./criteria-type-fields";
import { useContestCriteria } from "./use-contest-criteria";

interface CriteriaFormPopupProps {
	criterionId: UUID | null;
	section: Section;
	open: boolean;
	onClose: () => void;
	index: number;
}

interface CriterionOption {
	id: string;
	label: string;
	is_correct: boolean;
}

interface CriterionFormValues {
	label: string;
	description: string;
	points: number;
	resourcetype: string;
	allow_multiline?: boolean;
	lower_bound?: number;
	upper_bound?: number;
	checked_label?: string;
	unchecked_label?: string;
	partial_points?: boolean;
	options?: CriterionOption[];
	visible?: boolean;
	active?: boolean;
	activate_on_dates?: string[];
	deactivate_on_dates?: string[];
}

export const CriteriaFormPopup: React.FC<CriteriaFormPopupProps> = ({
	criterionId,
	section,
	open,
	onClose,
	index,
}) => {
	const [loading, setLoading] = React.useState(false);
	const [submitting, setSubmitting] = React.useState(false);
	const { t } = useTranslation();
	const form = useForm<CriterionFormValues>({
		defaultValues: {
			label: "",
			description: "",
			resourcetype: FieldTypes.Text,
			points: 1,
			visible: true,
			active: true,
			lower_bound: 0,
			upper_bound: 20,
			checked_label: t("yes"),
			unchecked_label: t("no"),
		},
	});
	const { actions } = useContestCriteria({ sectionId: section.id });

	const actionsRef = useRef(actions);
	actionsRef.current = actions;

	const formRef = useRef(form);
	formRef.current = form;

	const isEdit = !!criterionId;

	useEffect(() => {
		if (!open) return;
		if (criterionId) {
			setLoading(true);
			actionsRef.current
				.getById(criterionId)
				.then((criterion) => {
					formRef.current.reset(criterion as unknown as CriterionFormValues);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			formRef.current.reset({
				label: "",
				description: "",
				resourcetype: FieldTypes.Text,
				points: 1,
				visible: true,
				active: true,
				lower_bound: 0,
				upper_bound: 20,
				checked_label: t("yes"),
				unchecked_label: t("no"),
			});
		}
	}, [open, criterionId, t]);

	const handleFormSubmit = async (values: CriterionFormValues): Promise<void> => {
		setSubmitting(true);
		try {
			if (
				values.resourcetype === FieldTypes.Radio ||
				values.resourcetype === FieldTypes.MultipleChoices
			) {
				if (!values.options || !values.options.some((option) => option.is_correct)) {
					toast.error(t("correct-option-required"));
					setSubmitting(false);
					return;
				}
			}
			if (criterionId) {
				await actions.update(criterionId, {
					...values,
				});
				toast.success(t("criteria-updated"));
			} else {
				await actions.add({
					...values,
					section: section.id,
					order_in_section: index,
				} as CriterionCreateData);
				toast.success(t("criteria-added"));
			}
			handleClose();
		} catch (e) {
			toast.error(t("criteria-operation-failed"));
			console.error(e);
		} finally {
			setSubmitting(false);
		}
	};

	const handleClose = (): void => {
		onClose();
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
			<DialogContent className="max-w-[600px]">
				<DialogHeader>
					<DialogTitle>{isEdit ? t("update-criteria") : t("add-criteria")}</DialogTitle>
				</DialogHeader>
				<div className="relative">
					{loading && (
						<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
							<Spinner size="lg" />
						</div>
					)}
					<FormProvider {...form}>
						<form
							onSubmit={form.handleSubmit(handleFormSubmit)}
							className={cn("space-y-6", loading && "opacity-50 pointer-events-none")}
						>
							<Tabs defaultValue="basic">
								<TabsList className="w-full">
									<TabsTrigger value="basic" className="flex-1">
										{t("criteria-basic")}
									</TabsTrigger>
									<TabsTrigger value="type" className="flex-1">
										{t("criteria-type")}
									</TabsTrigger>
									<TabsTrigger value="advanced" className="flex-1">
										{t("criteria-advanced")}
									</TabsTrigger>
								</TabsList>
								<div className="min-h-[320px] max-h-[400px] overflow-y-auto mt-4">
									<TabsContent value="basic" className="mt-0 p-2">
										<CriteriaBasicFields />
									</TabsContent>
									<TabsContent value="type" className="mt-0 p-2">
										<CriteriaTypeFields isEdit={isEdit} />
									</TabsContent>
									<TabsContent value="advanced" className="mt-0 p-2">
										<CriteriaAdvancedFields />
									</TabsContent>
								</div>
							</Tabs>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
									{t("cancel")}
								</Button>
								<Button type="submit" disabled={loading || submitting}>
									{submitting ? <Spinner size="sm" /> : <CheckIcon className="h-4 w-4" />}
									{isEdit ? t("update") : t("add")}
								</Button>
							</DialogFooter>
						</form>
					</FormProvider>
				</div>
			</DialogContent>
		</Dialog>
	);
};
