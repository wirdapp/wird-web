import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import LoginFormContainer, {DivCenter, DivPass, TitleLogin,} from "./ForgotPassword.styles";
import {DivTxtField} from "../shared/styles";
import {Form, FormInput, HeadLogIn, InputSubmit, SignupNow, SignupNowAccount,} from "../Login/login.styles";
import WirdLogo from "../../assets/Logo/WirdLogoV2.svg";
import { useTranslation } from "react-i18next";

function ForgotPassword() {
  let Navigate = useNavigate();
  const {t} = useTranslation();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setShowErrorMessage(true);
    // setLoading(true);
    Navigate("/reset-password");
  }

  return (
    <LoginFormContainer>
      <DivCenter>
        <HeadLogIn>
          <TitleLogin>{t("forgetPass")}</TitleLogin>
        </HeadLogIn>

        {/* <HeadLogIn> */}
        <img src={WirdLogo} alt=""/>
        {/* <OrWayToLogIn>Or</OrWayToLogIn> */}
        {/* </HeadLogIn> */}

        <Form onSubmit={handleSubmit}>
          <DivTxtField>
            <FormInput type="text" placeholder="Email address" required/>
          </DivTxtField>

          {/* TODO: style the error message */}
          {showErrorMessage && (
            <DivPass className="red">{t("checkEmail")}</DivPass>
          )}

          {/* <PageLink href="https://www.facebook.com/Wird.Competition/" target="_blank">
            هل تواجه مشكلة تقنية أو نسيت كلمة المرور؟ تواصل مع الدعم الفني
          </PageLink> */}

          <InputSubmit type="submit" value="login">
 
           {t("resetPass")}
          </InputSubmit>
        </Form>
        <SignupNowAccount>
          {t("orKey")}<SignupNow href="/Login"> {t("backLogin")}</SignupNow>
        </SignupNowAccount>
      </DivCenter>
    </LoginFormContainer>
  );
}

export default ForgotPassword;
