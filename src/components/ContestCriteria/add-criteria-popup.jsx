import React from "react";
import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import { FieldTypesOptions } from "../../services/contest-criteria/consts";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useDashboardData } from "../../util/routes-data";
import { getContestDays } from "../../util/contest-utils";
import { css } from "@emotion/css";
import { useContestCriteriaContext } from "./contest-criteria-context";

export const AddCriteriaPopup = ({ open, onClose }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { currentContest } = useDashboardData();
  const [partiallyAvailable, setPartiallyAvailable] = React.useState(false);
  const { criteria } = useContestCriteriaContext();

  const handleAddCriteria = async (values) => {
    try {
      await criteria.add(values);
      messageApi.success(t("criteria-added"));
      onClose();
    } catch (e) {
      messageApi.error(t("criteria-add-failed"));
      console.error(e);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={t("add-criteria")}
      onOk={() => form.submit()}
      okText={t("add-criteria")}
      cancelText={t("cancel")}
      okButtonProps={{ loading: false, icon: <PlusIcon /> }}
    >
      {contextHolder}
      <Form
        onFinish={handleAddCriteria}
        form={form}
        layout="vertical"
        style={{ marginBlock: 24 }}
      >
        <Form.Item
          label={t("criteria-title")}
          name="label"
          rules={[{ required: true }]}
        >
          <Input placeholder={t("criteria-title")} />
        </Form.Item>
        <Form.Item
          label={t("criteria-type")}
          name="resourcetype"
          rules={[{ required: true }]}
        >
          <Select
            placeholder={t("criteria-type")}
            options={FieldTypesOptions}
          />
        </Form.Item>
        <Form.Item label={t("criteria-description")} name="description">
          <Input.TextArea placeholder={t("criteria-description")} />
        </Form.Item>
        <Form.Item label={t("criteria-weight")} name="points" initialValue={1}>
          <InputNumber min={1} />
        </Form.Item>
        <fieldset
          className={css`
            border: 1px solid #d9d9d9;
            padding: 16px;
            border-radius: 8px;
          `}
        >
          <legend
            className={css`
              width: auto !important;
              padding: 0 8px !important;
              border: none !important;
              margin: 0 !important;
            `}
          >
            <Form.Item
              name="partially_available"
              valuePropName="checked"
              noStyle
            >
              <Checkbox
                value={partiallyAvailable}
                onChange={(e) => setPartiallyAvailable(e.target.checked)}
              >
                {t("criteria-partially-available")}
              </Checkbox>
            </Form.Item>
          </legend>
          {partiallyAvailable ? (
            <Form.Item
              label={t("criteria-days-available")}
              name="days_available"
            >
              <Select
                mode="multiple"
                placeholder={t("criteria-days-available")}
                options={[...getContestDays(currentContest)].map((day) => ({
                  label: day.format("dddd, MMMM Do YYYY"),
                  value: day.format("YYYY-MM-DD"),
                }))}
              />
            </Form.Item>
          ) : (
            <Typography.Text type="secondary">
              {t("criteria-available-all-days")}
            </Typography.Text>
          )}
        </fieldset>
      </Form>
    </Modal>
  );
};
