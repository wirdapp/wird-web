import React, { useMemo, useState } from "react";
import { Button, Form, message, Space, Table } from "antd";
import { CriterionField } from "../../ContestCriteria/criterion-field";
import { useTranslation } from "react-i18next";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ContestResultsApi } from "../../../services/contest-results/api";
import { useDashboardData } from "../../../util/routes-data";
import { css } from "@emotion/css";

const answerField = {
  UserInputPointRecord: "user_input",
  NumberPointRecord: "number",
  CheckboxPointRecord: "checked",
  MultiCheckboxPointRecord: "choices",
  RadioPointRecord: "choice",
};

const CriterionPointRecord = ({ pointRecord, criteria }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const newAnswer = Form.useWatch(pointRecord.id, form);
  const { currentContest } = useDashboardData();
  const [submitting, setSubmitting] = useState(false);

  const criterion = criteria.find(
    (c) => c.id === pointRecord.contest_criterion,
  );
  const fieldName = answerField[pointRecord.resourcetype];
  const answer = pointRecord[fieldName];

  if (!criterion) return null;

  const onFormFinish = async (values) => {
    setSubmitting(true);
    try {
      await ContestResultsApi.updatePointRecord({
        contestId: currentContest.id,
        recordId: pointRecord.id,
        date: pointRecord.record_date,
        userId: pointRecord.person,
        data: {
          [fieldName]: values[pointRecord.id],
        },
      });
    } catch (error) {
      message.error(t("failedToSave"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form form={form} onFinish={onFormFinish}>
      <Form.Item name={pointRecord.id} initialValue={answer} noStyle>
        <CriterionField criterion={criterion} />
      </Form.Item>
      {newAnswer !== answer && (
        <Space style={{ marginInlineStart: 4 }} size={4}>
          <Button
            type="text"
            size="small"
            htmlType="submit"
            icon={<CheckIcon />}
            loading={submitting}
          />
          <Button
            type="text"
            size="small"
            htmlType="reset"
            icon={<XMarkIcon />}
            disabled={submitting}
          />
        </Space>
      )}
    </Form>
  );
};

export const DailySubmissionsTable = ({ submissions, onClose, criteria }) => {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        render: (_, __, index) => index + 1,
      },
      {
        title: t("dailySubmissionsPopup.criteriaTitle"),
        dataIndex: ["contest_criterion_data", "label"],
        key: "title",
      },
      {
        title: t("dailySubmissionsPopup.answer"),
        key: "answer",
        render: (record, index) => (
          <CriterionPointRecord pointRecord={record} criteria={criteria} />
        ),
      },
    ],
    [criteria, t],
  );

  return (
    <div
      className={css`
        margin: 0 -14px;
        @media (min-width: 768px) {
          margin: 0;
        }
      `}
    >
      <Table
        columns={columns}
        dataSource={submissions}
        pagination={false}
        rowKey="id"
        scroll={{ x: 500 }}
      />
    </div>
  );
};
