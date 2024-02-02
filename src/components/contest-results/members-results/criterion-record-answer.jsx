import React, { useEffect, useState } from "react";
import { Button, Flex, Form, Space } from "antd";
import { CriterionField } from "../../ContestCriteria/criterion-field";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const answerField = {
  UserInputPointRecord: "user_input",
  NumberPointRecord: "number",
  CheckboxPointRecord: "checked",
  MultiCheckboxPointRecord: "choices",
  RadioPointRecord: "choice",
};

export const CriterionRecordAnswer = ({
  onSave,
  pointRecord: recordFromProps,
  criteria,
}) => {
  const [pointRecord, setPointRecord] = useState(recordFromProps);
  const [form] = Form.useForm();
  const newAnswer = Form.useWatch(pointRecord.id, form);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPointRecord(recordFromProps);
  }, [recordFromProps]);

  const criterion = criteria.find(
    (c) => c.id === pointRecord.contest_criterion_data.id,
  );
  const fieldName = answerField[pointRecord.resourcetype];
  const answer = pointRecord[fieldName];

  if (!criterion) return null;

  const onFormFinish = async (values) => {
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

  const isText = pointRecord.resourcetype === "UserInputPointRecord";

  return (
    <Form form={form} onFinish={onFormFinish}>
      <Flex wrap="nowrap" align="center">
        <Form.Item name={pointRecord.id} initialValue={answer} noStyle>
          <CriterionField criterion={criterion} />
        </Form.Item>
        {newAnswer !== answer && (
          <Space
            direction={isText ? "vertical" : "horizontal"}
            style={{ marginInlineStart: 4 }}
            size={4}
          >
            <Button
              type="primary"
              size="small"
              htmlType="submit"
              icon={<CheckIcon />}
              loading={submitting}
            />
            <Button
              size="small"
              htmlType="reset"
              icon={<XMarkIcon />}
              disabled={submitting}
            />
          </Space>
        )}
      </Flex>
    </Form>
  );
};
