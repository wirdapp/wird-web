import React from "react";
import { Alert, Button, Flex, Form, Input, Modal, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useDashboardData } from "../../../util/routes-data";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { colors } from "../../../styles";
import { TrashIcon } from "@heroicons/react/24/outline";

export const ContestDeleteSection = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { currentContest } = useDashboardData();
  const [confirmText, setConfirmText] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);

  return (
    <div className="danger-zone">
      <h3>{t("danger-zone")}</h3>
      <p>{t("deleting-contest-description")}</p>
      <Button danger type="primary" onClick={() => setIsOpen(true)}>
        {t("delete-contest")}
      </Button>
      <Modal
        title={
          <Space size="small">
            <ExclamationTriangleIcon
              style={{ color: colors.yellow, height: 24, display: "block" }}
            />
            {t("are-you-sure")}
          </Space>
        }
        open={isOpen}
        onOk={() => console.log("delete")}
        onCancel={() => setIsOpen(false)}
        okButtonProps={{
          danger: true,
          loading: deleting,
          disabled: confirmText !== currentContest.contest_id,
          icon: <TrashIcon />,
        }}
        okText={t("delete-contest")}
      >
        <Flex vertical gap={16}>
          <p style={{ margin: 0 }}>{t("deleting-contest-description")}:</p>
          <ul style={{ margin: 0 }}>
            <li>{t("users")}</li>
            <li>{t("groups")}</li>
            <li>{t("points")}</li>
            <li>{t("results")}</li>
          </ul>
          <Alert type="error" message={t("action-cannot-be-undone")} />
          <Form layout="vertical">
            <Form.Item label={t("write-contest-code-to-confirm")} name="sure">
              <Input
                onChange={(e) => setConfirmText(e.target.value)}
                value={confirmText}
                placeholder={t("write-contest-code", {
                  code: currentContest.contest_id,
                })}
              />
            </Form.Item>
          </Form>
        </Flex>
      </Modal>
    </div>
  );
};
