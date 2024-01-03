import { useDashboardData } from "../../util/routes-data";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import styled from "@emotion/styled";
import { colors } from "../../styles";
import { Dropdown } from "../../ui/dropdown";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { List, ListItem, MenuTitle } from "../shared/Navbar/navbar.styles";
import { PlusCircleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { CreateContestPopup } from "./create-contest-popup";
import { JoinContestPopup } from "./join-contest-popup";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as ContestsApi from "../../services/contests/api";
import { CopyButton } from "../../ui/copy-button";
import { getInviteLink } from "../../services/contests/utils";

const StyledContestName = styled.span`
  @media (max-width: 500px) {
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StyledCurrentContestWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 10px;
  background-color: ${colors.lightGrey};
  border-radius: 10px;
  margin-bottom: 20px;

  .contest-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background-color: ${colors.lightRed};
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 24px;
      height: 24px;
      color: ${colors.black};
    }
  }

  h2 {
    font-size: 20px;
    font-weight: 700;
  }

  .contest-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    width: 100%;

    button {
      font-size: 12px;

      svg {
        width: 14px;
      }
    }
  }

  .invite-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${colors.darkGrey};
    padding: 8px;
    background-color: ${colors.white};
    border-radius: 4px;
    width: 100%;
  }
`;

export const ContestInfoMenu = () => {
  const { currentContest, contests } = useDashboardData();
  const [createContestOpen, setCreateContestOpen] = useState(false);
  const [joinContestOpen, setJoinContestOpen] = useState(false);
  const { t } = useTranslation();

  const otherContests = contests.filter(
    (contest) => contest.id !== currentContest?.id,
  );

  const switchContest = async (contest) => {
    try {
      await ContestsApi.switchContest(contest.id);
      window.location.reload();
    } catch (err) {
      console.error(err);
      console.log(`Failed to switch contest: ${err}`);
    }
  };

  return (
    <>
      <Dropdown
        title={
          <>
            {currentContest ? (
              <>
                <Squares2X2Icon />
                <StyledContestName>{currentContest?.name}</StyledContestName>
              </>
            ) : (
              t("no-contest-yet")
            )}
            <ChevronDownIcon />
          </>
        }
      >
        {currentContest && (
          <>
            <StyledCurrentContestWrapper>
              <div className="contest-details">
                {t("join-code")}:
                <div className="invite-link">
                  <code>{currentContest?.contest_id}</code>
                  <CopyButton value={currentContest.contest_id} />
                </div>
                <CopyButton value={getInviteLink(currentContest.contest_id)}>
                  {t("copy-link")}
                </CopyButton>
              </div>
            </StyledCurrentContestWrapper>
            <hr />
          </>
        )}
        {otherContests.length > 0 && (
          <>
            <div className="menu-group">
              <div className="menu-group-title">{t("switch-contest")}</div>
              <List>
                {otherContests?.map?.((contest) => {
                  return (
                    <ListItem
                      key={contest?.id}
                      onClick={() => switchContest(contest)}
                    >
                      <MenuTitle>{contest?.name}</MenuTitle>
                    </ListItem>
                  );
                })}
              </List>
            </div>
            <hr />
          </>
        )}
        <List>
          <ListItem onClick={() => setCreateContestOpen(true)}>
            <PlusCircleIcon />
            <MenuTitle>{t("create-contest")}</MenuTitle>
          </ListItem>
          <ListItem onClick={() => setJoinContestOpen(true)}>
            <UserPlusIcon />
            <MenuTitle>{t("join-contest")}</MenuTitle>
          </ListItem>
        </List>
      </Dropdown>
      <CreateContestPopup
        visible={createContestOpen}
        onClose={() => setCreateContestOpen(false)}
      />
      <JoinContestPopup
        visible={joinContestOpen}
        onClose={() => setJoinContestOpen(false)}
      />
    </>
  );
};
