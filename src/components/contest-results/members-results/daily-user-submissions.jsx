import React, { useEffect, useState } from "react";
import { Button, DatePicker, Empty, Form } from "antd";
import { useTranslation } from "react-i18next";
import { useDashboardData } from "../../../util/routes-data";
import dayjs from "dayjs";
import { ContestResultsApi } from "../../../services/contest-results/api";
import { ContestCriteriaApi } from "../../../services/contest-criteria/api";
import { DailySubmissionsTable } from "./daily-submissions-table";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export const DailyUserSubmissions = ({ onBack, userId }) => {
  const { t, i18n } = useTranslation();
  const { currentContest } = useDashboardData();
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [form] = Form.useForm();
  const [criteria, setCriteria] = useState([]);
  const [resultEmpty, setResultEmpty] = useState(false);

  useEffect(() => {
    if (!currentContest) return;
    ContestCriteriaApi.getCriteria({ contestId: currentContest.id }).then(
      (res) => {
        setCriteria(res);
      },
    );
  }, [currentContest]);

  useEffect(() => {
    setSubmissions([]);
    form.resetFields();
    setResultEmpty(false);
  }, [userId]);

  const loadSubmissions = async (date) => {
    setLoading(true);
    setResultEmpty(false);
    try {
      const res = await ContestResultsApi.getMemberDaySubmissions({
        userId,
        date: date.format("YYYY-MM-DD"),
      });
      setSubmissions(res.points);
      if (res.points.length === 0) setResultEmpty(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onFormFinish = async (values) => {
    await loadSubmissions(values.date);
  };

  return (
    <div>
      <Button
        type="link"
        onClick={onBack}
        icon={i18n.dir() === "rtl" ? <ArrowRightIcon /> : <ArrowLeftIcon />}
      >
        {t("back")}
      </Button>
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
        <DailySubmissionsTable submissions={submissions} criteria={criteria} />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            resultEmpty
              ? t("dailySubmissionsPopup.noSubmissions")
              : t("dailySubmissionsPopup.selectDate")
          }
        />
      )}
    </div>
  );
};
