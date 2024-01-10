import React, { useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Modal,
  Table,
  Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import { useDashboardData } from "../../../util/routes-data";
import dayjs from "dayjs";
import { ContestResultsApi } from "../../../services/contest-results/api";

export const DailySubmissionsPopup = ({ open, onClose, userId }) => {
  const { t } = useTranslation();
  const { currentContest } = useDashboardData();
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [modifiedSubmissions, setModifiedSubmissions] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [form] = Form.useForm();

  const onAnswerChange = (index, value) => {
    const newSubmissions = modifiedSubmissions
      ? [...modifiedSubmissions]
      : [...submissions];
    console.log(newSubmissions, index, value);
    newSubmissions[index].answer = value;
    setModifiedSubmissions(newSubmissions);
    setIsDirty(true);
  };

  const columns = useMemo(
    () => [
      {
        render: (_, __, index) => index + 1,
      },
      {
        title: t("dailySubmissionsPopup.criteriaTitle"),
        dataIndex: "title",
        key: "title",
      },
      {
        title: t("dailySubmissionsPopup.answer"),
        dataIndex: "answer",
        key: "answer",
        render: (answer, _, index) => {
          return (
            <Typography.Text
              editable={{
                text: answer,
                onChange: (val) => onAnswerChange(index, val),
              }}
            >
              {answer}
            </Typography.Text>
          );
        },
      },
    ],
    [],
  );

  const loadSubmissions = async (date) => {
    setLoading(true);
    try {
      const res = await ContestResultsApi.getMemberDaySubmissions(userId, date);
      setSubmissions(res.scores);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onFormFinish = async (values) => {
    await loadSubmissions(values.date);
  };

  const handleClose = () => {
    onClose();
    form.resetFields();
    setSubmissions([]);
    setModifiedSubmissions([]);
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={t("dailySubmissionsPopup.title")}
      footer={
        submissions.length > 0
          ? [
              <Button key="close" onClick={handleClose}>
                {t("cancel")}
              </Button>,
              <Button
                key="save"
                type="primary"
                onClick={handleClose}
                disabled={!isDirty}
              >
                {t("save")}
              </Button>,
            ]
          : null
      }
      width={submissions.length > 0 ? 800 : 600}
    >
      <Form
        form={form}
        layout="inline"
        onFinish={onFormFinish}
        style={{ margin: "24px 0" }}
      >
        <Form.Item
          label={t("dailySubmissionsPopup.date")}
          name="date"
          rules={[{ required: true, message: t("requiredField") }]}
        >
          <DatePicker
            disabledDate={(current) => {
              // Can not select days before today and today
              return (
                current &&
                (dayjs(currentContest.start_date)
                  .startOf("day")
                  .isAfter(current) ||
                  dayjs(currentContest.end_date).endOf("day").isBefore(current))
              );
            }}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {t("dailySubmissionsPopup.load")}
        </Button>
      </Form>

      {submissions.length > 0 ? (
        <Table columns={columns} dataSource={submissions} pagination={false} />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t("dailySubmissionsPopup.noData")}
        />
      )}
    </Modal>
  );
};
