import React from "react";
import { I18nextProvider } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import i18n from "./i18n";
import { router } from "./router";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";

dayjs.locale(i18n.language);

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  );
}

export default App;
