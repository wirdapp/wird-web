import React, { useState } from "react";
import LoginFormContainer, {
  DivCenter,
  Form,
  HeadLogIn,
  SignupNow,
  SignupNowAccount,
  StyledErrorsList,
  TitleLogin,
} from "./login.styles";

import { DivTxtField } from "../shared/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "../../services/auth/session";
import { useHandleError } from "hooks/handleError";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

function Login() {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const [username, setUsername] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const { messages, classColor, handleError } = useHandleError();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate(
        location?.state?.redirectTo?.length > 0
          ? location.state.redirectTo
          : "/dashboard",
      );
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleChangePassowrd = (e) => {
    setPassword(e.target.value);
  };

  return (
    <LoginFormContainer>
      <DivCenter>
        <HeadLogIn>
          <TitleLogin>{`${t("login")}`}</TitleLogin>
          <br />
          <SignupNowAccount>
            {t("notAccount")}{" "}
            <SignupNow href="/signup">{t("signUpKey")}</SignupNow>
          </SignupNowAccount>
        </HeadLogIn>

        {/*TODO: Uncomment when it's ready*/}
        {/*<MediaOneLine>*/}
        {/*  <MediaLogIn>*/}
        {/*    {" "}*/}
        {/*    <img src={AppleLogo} alt="" />*/}
        {/*  </MediaLogIn>*/}
        {/*  <MediaLogIn>*/}
        {/*    {" "}*/}
        {/*    <img src={GoogleLogo} alt="" />*/}
        {/*  </MediaLogIn>*/}
        {/*  <MediaLogIn>*/}
        {/*    <img src={FBLogo} alt="" />*/}
        {/*  </MediaLogIn>*/}
        {/*</MediaOneLine>*/}

        {/*/!* <HeadLogIn> *!/*/}
        {/*/!* <img src={WirdLogo} alt='' /> *!/*/}
        {/*<OrWayToLogIn>Or</OrWayToLogIn>*/}
        {/*/!* </HeadLogIn> *!/*/}

        <Form onSubmit={handleSubmit}>
          <DivTxtField>
            <Input
              type="text"
              id="username"
              onChange={handleChangeUsername}
              required
              placeholder={t("username")}
            />
          </DivTxtField>

          <DivTxtField>
            <Input
              type="password"
              id="password"
              onChange={handleChangePassowrd}
              required
              placeholder={t("password")}
            />
          </DivTxtField>

          {/* TODO: style the error message */}
          {/* {showErrorMessage && (
            <DivPass className="red">{t("checkPassword")}</DivPass>
          )} */}
          {/* <PageLink href="https://www.facebook.com/Wird.Competition/" target="_blank">
            هل تواجه مشكلة تقنية أو نسيت كلمة المرور؟ تواصل مع الدعم الفني
          </PageLink> */}
          {messages.length > 0 && (
            <StyledErrorsList>
              {messages?.map?.((message, index) => {
                return (
                  <div className={classColor} key={message}>
                    {message}
                  </div>
                );
              })}
            </StyledErrorsList>
          )}
          <Button variant="primary" type="submit" disabled={loading}>
            {t("login")}
          </Button>
        </Form>

        {/*TODO: Uncomment when it's ready*/}
        {/*<SignupNowAccount>*/}
        {/*  Or<SignupNow href="/forgot-password"> Forgot Password</SignupNow>*/}
        {/*</SignupNowAccount>*/}
      </DivCenter>
    </LoginFormContainer>
  );
}

export default Login;
