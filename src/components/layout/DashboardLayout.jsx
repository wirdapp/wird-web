import React, { useEffect } from "react";
import Sidebar from "../shared/Sidebar";
import { Container, MainContent } from "./layout.styles";
import Navbar from "../shared/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const LayoutContext = React.createContext({
  pageTitle: "",
  setPageTitle: () => {},
});
export const useLayoutContext = () => React.useContext(LayoutContext);

export const DashboardLayout = () => {
  const [pageTitle, setPageTitle] = React.useState("");
  const location = useLocation();

  useEffect(() => {
    setPageTitle("");
  }, [location.pathname]);

  return (
    <LayoutContext.Provider value={{ pageTitle, setPageTitle }}>
      <Container>
        <Sidebar />
        <MainContent>
          <Navbar />
          <div className="page-content">
            <Outlet />
          </div>
        </MainContent>
      </Container>
    </LayoutContext.Provider>
  );
};
