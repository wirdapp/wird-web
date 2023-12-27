import React, { useEffect, useState } from "react";
import { resetAdminPassword } from "../../../services/adminsServices";
import {
  DropdownDiv,
  DropdownList,
} from "../EditAdminForm/EditAdminForm.styles";
import { DivPass, Span } from "../Admins.styles";
import {
  DivTxtField,
  Form,
  FormInput,
  InputSubmit,
  DropdownListItem,
} from "../../shared/styles";

import { useTranslation } from "react-i18next";

export default function ResetAdminPasswordForm(props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setValidPassword] = useState(true);
  const [unmatchedPasswords, setUnmatchedPasswords] = useState(false);
  const [selectedAdminUsername, setSelectedAdminUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [classColor, setClassColor] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    setMessages([]);
    setClassColor("");
  }, [selectedAdminUsername, password, confirmPassword]);

  useEffect(() => {
    resetPasswordForm();
  }, [props.reset]);

  const handleResetAdminPasswordSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setUnmatchedPasswords(true);
      setClassColor("red");
      return;
    }

    if (!isValidPassword) {
      setClassColor("red");
      return;
    }

    if (selectedAdminUsername === "") {
      setMessages([t("modifyAdminChanged")]);
      setClassColor("red");
      return;
    }

    resetAdminPassword(
      selectedAdminUsername,
      { password: password },
      (res) => {
        if (res && res.status === 200) {
          setClassColor("green");
          setMessages([t("reassignMSG")]);

          setTimeout(() => {
            resetPasswordForm();
            setClassColor("");
            setMessages([]);
          }, 2000);
        }
      },
      (err) => {
        let errMessages = [];
        errMessages.push([t("notReassignMSG")]);
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

  const resetPasswordForm = () => {
    setPassword("");
    setConfirmPassword("");
    setSelectedAdminUsername("");
    setValidPassword(true);
    setUnmatchedPasswords(false);
    setMessages([]);
    setClassColor("");
  };
  const handlePasswordChange = (e) => {
    if (e.target.value.length < 8) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setUnmatchedPasswords(false);
  };

  const handleSelectedAdminChange = (e) => {
    let admin = props.admins.filter(
      (admin) => admin.username === e.target.value,
    )[0];
    if (admin) {
      setSelectedAdminUsername(admin.username);
    } else {
      setSelectedAdminUsername("");
    }
    setValidPassword(true);
    setUnmatchedPasswords(false);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Form onSubmit={handleResetAdminPasswordSubmit}>
      {props.admins && props.admins.length > 0 && (
        <DropdownDiv className="DropdownDiv">
          <DropdownList
            className="DropdownList_editAdmin"
            onChange={handleSelectedAdminChange}
            value={selectedAdminUsername}
          >
            <DropdownListItem>{t("chooseAdmin")}</DropdownListItem>
            {props.admins.map((admin, index) => {
              if (
                admin?.first_name?.length > 0 ||
                admin?.last_name?.length > 0
              ) {
                return (
                  <DropdownListItem key={index} value={admin.username}>
                    {admin.first_name} {admin.last_name}
                  </DropdownListItem>
                );
              } else {
                return (
                  <DropdownListItem key={index} value={admin.username}>
                    {admin.username}
                  </DropdownListItem>
                );
              }
            })}
          </DropdownList>
        </DropdownDiv>
      )}

      <DivTxtField>
        <Span />
        <FormInput
          onChange={handlePasswordChange}
          placeholder={t("passwordKey")}
          type="password"
          value={password}
          required
        />
      </DivTxtField>
      {!isValidPassword && <DivPass> {t("passwordValidation")}</DivPass>}

      <DivTxtField>
        <Span />
        <FormInput
          onChange={handleConfirmPasswordChange}
          placeholder={t("retypePassword")}
          type="password"
          value={confirmPassword}
          required
        />
      </DivTxtField>

      {unmatchedPasswords && <DivPass>{t("matchPassword")}</DivPass>}

      {messages.length > 0 &&
        messages.map((message, index) => {
          return (
            <DivPass className={classColor} key={index}>
              {message}
            </DivPass>
          );
        })}
      <InputSubmit type="submit" value="login">
        {t("reassign")}{" "}
      </InputSubmit>
    </Form>
  );
}
