import React from "react";
import Container, { DivCenter, H1 } from "./loder.styles";
export default function Loader() {

  return (
    <Container>
      <DivCenter/>
      <H1>{t("loading")}</H1>
    </Container>
  );
}
