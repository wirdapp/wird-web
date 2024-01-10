import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateContest } from "../../../services/competitionsServices";

import { ParticipantsTitelsAtHome } from "../ContestMembers/ContestMembers.styles";
import {
  EditContestFormWrapper,
  ParticipantsNumbers,
} from "./EditCompetition.styles";

import { DivPass } from "../../Admins/Admins.styles";
import { Button, Checkbox, Form, Input, Space } from "antd";

export default function EditCompetitionForm({ contest, onChange }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [classColor, setClassColor] = useState("");

  const handleUpdateContest = (values) => {
    updateContest(
      contest.id,
      values,
      (res) => {
        if (res?.status === 200) {
          setClassColor("green");
          setMessages([t("contest-has-been-edited-successfully")]);
        }
      },
      (err) => {
        let errMessages = [];
        errMessages.push([t("contest-isn't-edited-successfully")]);
        if (err.response.data) {
          let obj = err.response.data;
          Object.keys(obj).forEach((e) => {
            errMessages.push(`${obj[e]} : ${e}`);
          });
        }
        setClassColor("red");
        setMessages(errMessages);
      },
    );
  };

  return (
    <EditContestFormWrapper>
      <ParticipantsNumbers>
        <ParticipantsTitelsAtHome>
          {t("contest-information")}
        </ParticipantsTitelsAtHome>

        <Form
          onFinish={handleUpdateContest}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={contest}
          style={{ width: "100%" }}
        >
          <Form.Item
            label={t("name-label")}
            name="name"
            rules={[{ required: true, message: t("requiredField") }]}
          >
            <Input placeholder={t("name-label")} />
          </Form.Item>
          <Form.Item label={t("description-label")} name="description">
            <Input placeholder={t("description-label")} />
          </Form.Item>
          <Form.Item
            name="show_standings"
            wrapperCol={{ offset: 4, span: 20 }}
            valuePropName="checked"
          >
            <Checkbox>{t("active-announcements")}</Checkbox>
          </Form.Item>
          <Form.Item
            name="readonly_mode"
            wrapperCol={{ offset: 4, span: 20 }}
            valuePropName="checked"
          >
            <Checkbox>{t("readonly")}</Checkbox>
          </Form.Item>

          {messages.length > 0 &&
            messages.map((message, index) => {
              return (
                <DivPass className={classColor} key={index}>
                  {message}
                </DivPass>
              );
            })}

          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <Space>
              <Button htmlType="submit" type="primary">
                {t("update")}
              </Button>
              <Button htmlType="reset">{t("reset")}</Button>
            </Space>
          </Form.Item>
        </Form>
      </ParticipantsNumbers>
    </EditContestFormWrapper>
  );
}
