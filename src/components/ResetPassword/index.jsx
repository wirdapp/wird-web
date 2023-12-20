import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import LoginFormContainer, {DivCenter, DivPass, TitleLogin,} from "./ResetPassword.styles";
import {DivTxtField} from "../shared/styles";
import {Form, FormInput, HeadLogIn, InputSubmit, SignupNow, SignupNowAccount,} from "../Login/login.styles"
import WirdLogo from '../../assets/Logo/WirdLogoV2.svg';
import { useTranslation } from "react-i18next";

function ForgotPassword() {
  const {t} = useTranslation();
  let Navigate = useNavigate();
  const [password, setPassword] = useState(" ");
  const [Retypepassword, setRetypePassword] = useState(" ");

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showErrorMessageMatch, setshowErrorMessageMatch] = useState(false);

  const handleChangePassowrd = (e) => {
    setPassword(e.target.value);
  };

  const handleRetypepassword = (e) => {
    setRetypePassword(e.target.value);
  };

  function handleSubmit(e) {
    e.preventDefault();

    // setLoading(true);
    if (password !== Retypepassword) {
      console.log('not = ------------------------');
      setshowErrorMessageMatch(true)
      setShowErrorMessage(false)
      return;
    }
    if (password.length < 8) {
      setShowErrorMessage(true)
      setshowErrorMessageMatch(false)
      return;
    } else {
      Navigate('/')
      console.log('trueeeeeee ------------------------')
    }
  }

  return (
    <LoginFormContainer>
      <DivCenter>
        <HeadLogIn>
          <TitleLogin>
            {t("resetPass")}
          </TitleLogin>
        </HeadLogIn>

        {/* <HeadLogIn> */}
        <img src={WirdLogo} alt=''/>
        {/* <OrWayToLogIn>Or</OrWayToLogIn> */}
        {/* </HeadLogIn> */}

        <Form onSubmit={handleSubmit}>
          <DivTxtField>
            <FormInput
              onChange={handleChangePassowrd}
              placeholder="Password"
              type="password"
              required
            />
          </DivTxtField>

          <DivTxtField>
            <FormInput
              onChange={handleRetypepassword}
              placeholder="Re-type password"
              type="password"
              required
            />
          </DivTxtField>

          {/* TODO: style the error message */}
          {showErrorMessage && (
            <DivPass className="red">{t("characterKey")}</DivPass>
          )}

          {showErrorMessageMatch && (
            <DivPass className="red">{t("passwordMatch")}</DivPass>
          )}

          {/* <PageLink href="https://www.facebook.com/Wird.Competition/" target="_blank">
            هل تواجه مشكلة تقنية أو نسيت كلمة المرور؟ تواصل مع الدعم الفني
          </PageLink> */}

          <InputSubmit type="submit" value="login">
            {t("resetPassWord")}
          </InputSubmit>
        </Form>
        <SignupNowAccount>
          <SignupNow href="https://www.facebook.com/Wird.Competition/"> {t("wirdSupport")} </SignupNow>
          {t("orKey")}
          <SignupNow href="/Login"> {t("backLogin")}</SignupNow>
        </SignupNowAccount>

      </DivCenter>
    </LoginFormContainer>
  );
}

export default ForgotPassword;
