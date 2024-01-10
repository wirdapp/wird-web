import React, { useEffect, useState } from "react";
import "./NavStyle.css";
import {
  Container,
  LeftNavItems,
  Navbar,
  RightNavItems,
  SidebarMenu,
  StyledPageTitle,
} from "./navbar.styles";
import { isSuperAdmin } from "../../../util/ContestPeople_Role";
import { ReactComponent as SidebarIcon } from "assets/icons/sidebarIcon.svg";
import Sidebar from "../Sidebar";
import { useDashboardData } from "../../../util/routes-data";
import { ContestInfoMenu } from "./contest-info-menu";
import { useLayoutContext } from "../../layout/DashboardLayout";
import { Button } from "antd";
import { UserInfoMenu } from "./user-info-menu";

function Nav() {
  const { currentUser } = useDashboardData();
  const [hasPermission, setPermission] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { pageTitle } = useLayoutContext();

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    setPermission(currentUser && isSuperAdmin(currentUser));
  }, [currentUser]);

  return (
    <header>
      <Container>
        <Navbar>
          <LeftNavItems>
            <Button
              shape="circle"
              className="menu-button"
              onClick={handleToggle}
            >
              <SidebarIcon style={{ width: "16px" }} />
            </Button>
            <StyledPageTitle>{pageTitle}</StyledPageTitle>
          </LeftNavItems>
          <RightNavItems>
            <ContestInfoMenu />
            <UserInfoMenu />
          </RightNavItems>
        </Navbar>
        <SidebarMenu
          className={sidebarOpen ? "open" : ""}
          onClick={() => setSidebarOpen(false)}
        >
          <Sidebar setIsSideBarCollapsed={handleToggle} />
        </SidebarMenu>
      </Container>
    </header>
  );
}

export default Nav;
