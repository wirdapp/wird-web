import React, { useEffect, useState } from "react";
import { ContestResultsApi } from "../../../services/contest-results/api";
import { useTranslation } from "react-i18next";
import { StyledOverviewWrapper } from "./results-overview.styles";
import { SubmissionsCountChart } from "./submissions-count-chart";
import { SubmissionsList } from "./submissions-list";
import { ResultsOverviewSkeleton } from "./results-overview-skeleton";
import { Empty } from "antd";
import { css } from "@emotion/css";

export const ResultsOverview = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setLoading(true);
    ContestResultsApi.getResults()
      .then((results) => {
        setResults(results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return loading ? (
    <ResultsOverviewSkeleton />
  ) : (
    <StyledOverviewWrapper>
      {results.length === 0 ? (
        <Empty
          description={t("no-results")}
          className={css`
            padding: 80px 0;
          `}
        />
      ) : (
        <>
          <h3>{t("contest-submissions")}</h3>
          <SubmissionsCountChart chartData={results} />
          <SubmissionsList results={results} />
        </>
      )}
    </StyledOverviewWrapper>
  );
};
