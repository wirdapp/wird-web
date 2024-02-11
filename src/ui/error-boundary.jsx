import { useRouteError } from "react-router-dom";
import { Error404 } from "./error-404";
import React from "react";
import { ReactComponent as WirdLogo } from "assets/icons/Shared/wirdLogo.svg";

export function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  if (error?.status === 404) {
    return <Error404 />;
  }

  return (
    <div className="error-page">
      <WirdLogo />
      <hr />
      <h2>Something went wrong :(</h2>
    </div>
  );
}
