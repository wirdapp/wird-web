import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { ConfigProvider } from "antd";
import { lightTheme } from "./styles/antd-theme";

function App() {
  return (
    <ConfigProvider theme={lightTheme}>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </ConfigProvider>
  );
}

export default App;
