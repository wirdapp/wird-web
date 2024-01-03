import React, { useState } from "react";
import { DivTxtField } from "../shared/styles.js";
import SignupFormContainer, {
  DivCenter,
  DivFileField,
  FileFormInput,
  InlineFormError,
} from "../Signup/Signup.styles";
import {
  Form,
  HeadLogIn,
  SignupNow,
  SignupNowAccount,
  StyledErrorsList,
  TitleLogin,
} from "../Login/login.styles";
import * as AuthApi from "../../services/auth/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHandleError } from "hooks/handleError/index.js";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { login } from "../../services/auth/session";

function Signup() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorMessageMatch, setShowErrorMessageMatch] = useState(false);
  const [isValidUserName, setValidUserName] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { messages, handleError } = useHandleError();

  const handleChangeUsername = (e) => {
    const value = e.target.value;
    let regex = new RegExp("^[\u0621-\u064Aa-zA-Z0-9+-.@_]*$");
    if (!regex.test(value)) {
      setValidUserName(false);
    } else {
      setValidUserName(true);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordConfirm.length > 0 && value !== passwordConfirm) {
      setShowErrorMessageMatch(true);
    } else {
      setShowErrorMessageMatch(false);
    }
  };

  const handleRetypePassword = (e) => {
    const value = e.target.value;
    setPasswordConfirm(value);
    if (value !== password) {
      setShowErrorMessageMatch(true);
    } else {
      setShowErrorMessageMatch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showErrorMessageMatch || !isValidUserName) {
      return;
    }

    if (password !== passwordConfirm) {
      setShowErrorMessageMatch(true);
      return;
    }

    const formData = new FormData(e.target);
    setLoading(true);
    try {
      await AuthApi.signup(formData, false);
      await login(formData.get("username"), formData.get("password1"));
      navigate("/dashboard");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupFormContainer>
      <DivCenter>
        <HeadLogIn>
          <TitleLogin>{t("signUp")}</TitleLogin>
          <SignupNowAccount>
            {t("alreadyHaveAccount")}
            <SignupNow href="/Login">{t("loginNow")}</SignupNow>
          </SignupNowAccount>
        </HeadLogIn>

        <Form onSubmit={handleSubmit}>
          <DivTxtField>
            <Input
              name="username"
              onChange={handleChangeUsername}
              type="text"
              placeholder={t("userNameKey")}
              required
            />
          </DivTxtField>
          {!isValidUserName && (
            <InlineFormError>{t("userNameDisclimar")}</InlineFormError>
          )}

          <DivTxtField>
            <Input
              name="password1"
              onChange={handlePasswordChange}
              placeholder={t("passwordKey")}
              type="password"
              required
            />
          </DivTxtField>

          <DivTxtField>
            <Input
              name="password2"
              onChange={handleRetypePassword}
              placeholder={t("retypePassword")}
              type="password"
              required
            />
          </DivTxtField>
          {showErrorMessageMatch && (
            <InlineFormError className="red">
              {t("retypePasswordDisclimar")}
            </InlineFormError>
          )}

          <DivTxtField>
            <Input
              name="first_name"
              placeholder={t("firstName")}
              type="text"
              required
            />
          </DivTxtField>

          <DivTxtField>
            <Input
              name="last_name"
              placeholder={t("lastName")}
              type="text"
              required
            />
          </DivTxtField>

          <DivTxtField>
            <Input name="email" type="text" placeholder={t("emailAddress")} />
          </DivTxtField>

          <DivTxtField>
            <Input
              name="phone_number"
              type="text"
              placeholder={t("phoneNumber")}
            />
          </DivTxtField>

          <DivFileField>
            {t("profilePhoto")}
            <FileFormInput name="profile_photo" type="file" />
          </DivFileField>
          <br />

          {/* <PageLink href="https://www.facebook.com/Wird.Competition/" target="_blank">
            هل تواجه مشكلة تقنية أو نسيت كلمة المرور؟ تواصل مع الدعم الفني
          </PageLink> */}
          {messages?.length > 0 && (
            <StyledErrorsList>
              {messages?.map?.((message, index) => {
                return (
                  <div className="red" key={message}>
                    {message}
                  </div>
                );
              })}
            </StyledErrorsList>
          )}
          <Button
            variant="primary"
            type="submit"
            value="login"
            disabled={loading}
          >
            {t("signUp")}
          </Button>
        </Form>
      </DivCenter>
    </SignupFormContainer>
  );
}

export default Signup;
