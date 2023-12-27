import React from "react";
import Container, { LoaderAnimation } from "./loder.styles";

export default function Loader() {
  return (
    <Container>
      <LoaderAnimation />
      <span>جاري التحميل</span>
    </Container>
  );
}
