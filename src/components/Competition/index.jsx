import React, { useEffect, useMemo, useState } from "react";
import EditCompetitionForm from "./EditCompetitionForm";
import ContestMembers from "./ContestMembers";
import ContestModeratorDefault from "../ContestModerator/ContestModerator.styles";
import { useTranslation } from "react-i18next";
import { useDashboardData } from "../../util/routes-data";
import { NoContestYet } from "./no-contest-yet";
import { getInviteLink } from "../../services/contests/utils";
import { ManageAnnouncements } from "./manage-announcements";
import styled from "@emotion/styled";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { AnimatedPage } from "../../ui/animated-page";
import { Flex, Space, Spin, Typography } from "antd";
import { ContestsApi } from "../../services/contests/api";
import { css } from "@emotion/css";
import dayjs from "dayjs";
import { ContestBadge } from "./contest-badge";

const StyledContestEditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export default function Competition() {
  const { currentContest } = useDashboardData();
  const [contest, setContest] = useState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentContest) return;
    setLoading(true);
    ContestsApi.getContestDetails(currentContest.id)
      .then((result) => {
        setContest({
          ...result,
          start_date: dayjs(result.start_date),
          end_date: dayjs(result.end_date),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentContest]);

  const status = useMemo(() => {
    if (!contest) return "upcoming";
    const now = dayjs();
    if (contest.end_date.isBefore(now)) return "finished";
    if (contest.start_date.isAfter(now)) return "upcoming";
    return "ongoing";
  }, [contest]);

  if (loading)
    return (
      <Flex
        justify="center"
        align="center"
        className={css`
          height: 300px;
        `}
      >
        <Spin size="large" />
      </Flex>
    );

  return (
    <AnimatedPage>
      {contest ? (
        <ContestModeratorDefault>
          <div className="contest-details-wrapper">
            <Squares2X2Icon />
            <div className="contest-details">
              <h2>
                <Space>
                  {contest.name}
                  <ContestBadge status={status} />
                </Space>
              </h2>
              {contest.description && <h3>{contest.description}</h3>}

              <div className="contest-detail-item">
                {t("start-date")}:{" "}
                <Typography.Text>
                  {contest.start_date.format("dddd, DD MMM YYYY")}
                </Typography.Text>
              </div>

              <div className="contest-detail-item">
                {t("end-date")}:{" "}
                <Typography.Text>
                  {contest.end_date.format("dddd, DD MMM YYYY")}
                </Typography.Text>
              </div>

              <div className="contest-detail-item">
                {t("join-code")}:{" "}
                <Typography.Text copyable>{contest.contest_id}</Typography.Text>
              </div>
              <div className="contest-detail-item">
                {t("copy-link")}:{" "}
                <Typography.Text copyable>
                  {getInviteLink(contest.contest_id)}
                </Typography.Text>
              </div>
            </div>
          </div>

          <ContestMembers contest={contest} />
          <StyledContestEditWrapper>
            <ManageAnnouncements />
            <EditCompetitionForm contest={contest} onChange={setContest} />
          </StyledContestEditWrapper>
        </ContestModeratorDefault>
      ) : (
        <NoContestYet />
      )}
    </AnimatedPage>
  );
}
