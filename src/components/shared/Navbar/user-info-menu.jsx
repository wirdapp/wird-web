import React from "react";
import { css } from "@emotion/css";
import { colors } from "../../../styles";
import {
  ProfileInfo,
  ProfileName,
  ProfilePicture,
  UserInfoWrapper,
} from "./navbar.styles";
import {
  ArrowLeftOnRectangleIcon,
  LanguageIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { changeLanguage } from "../../../util/ContestPeople_Role";
import { destroySession } from "../../../services/auth/session";
import { Button, Dropdown } from "antd";
import { getInitials } from "../../../util/user-utils";
import { useDashboardData } from "../../../util/routes-data";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserIcon } from "@heroicons/react/20/solid";

export const UserInfoMenu = () => {
  const { currentUser } = useDashboardData();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <Dropdown
      trigger={["click"]}
      overlayClassName={css`
        width: 200px;

        svg {
          width: 20px;
          height: 20px;
          color: ${colors.orange};
        }
      `}
      menu={{
        items: [
          {
            label: (
              <UserInfoWrapper>
                <ProfileInfo>
                  <ProfilePicture src={currentUser?.profile_photo}>
                    {currentUser?.profile_photo ??
                      currentUser?.username?.[0] + currentUser?.username?.[1]}
                  </ProfilePicture>
                  {/* Show user name if no first name */}
                  <ProfileName>
                    {currentUser.first_name
                      ? currentUser.first_name + " " + currentUser.last_name
                      : currentUser.username}
                  </ProfileName>
                </ProfileInfo>
              </UserInfoWrapper>
            ),
          },
          { type: "divider" },
          {
            label: t("help"),
            icon: <QuestionMarkCircleIcon />,
            onClick: () => {
              navigate("/dashboard/help");
            },
          },
          {
            label: t("language"),
            icon: <LanguageIcon />,
            onClick: () => {
              changeLanguage(i18n.language === "ar" ? "en" : "ar");
            },
          },
          {
            label: t("logout"),
            icon: <ArrowLeftOnRectangleIcon />,
            onClick: () => {
              destroySession();
              navigate("/login");
            },
          },
        ],
      }}
    >
      <Button type="primary" shape="circle" style={{ fontWeight: 700 }}>
        {getInitials(currentUser) ?? <UserIcon />}
      </Button>
    </Dropdown>
  );
};
