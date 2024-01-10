import React, { useEffect, useState } from "react";
import { MembersSelect } from "./members-select";
import { DatePicker, Empty, Form, Spin } from "antd";
import styled from "@emotion/styled";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { ContestResultsApi } from "../../../services/contest-results/api";

const StyledMembersResultsWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  .side-filters {
    width: 100%;
    max-width: 350px;
    @media (min-width: 768px) {
      width: 200px;
      padding-inline-end: 16px;
      border-inline-end: 1px solid #e8e8e8;
    }
  }

  .main-content {
    width: 100%;
    min-height: 500px;
    @media (min-width: 768px) {
      width: calc(100% - 200px);
    }

    .ant-empty {
      margin-top: 100px;
    }

    .spinner-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 250px;
    }
  }
`;

export const MembersResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    user_id: searchParams.get("user_id"),
    date: searchParams.get("date")
      ? dayjs(searchParams.get("date"))
      : undefined,
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const onValuesChange = (_, values) => {
    const nextFilters = { ...filters, ...values };
    setFilters(nextFilters);
    setSearchParams(new URLSearchParams(nextFilters));
  };

  useEffect(() => {
    if (!filters.user_id || !filters.date) {
      setLoading(false);
      setResults([]);
      return;
    }
    setLoading(true);
    ContestResultsApi.getResults(filters)
      .then((res) => {
        setResults(res.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters]);

  return (
    <StyledMembersResultsWrapper>
      <div className="side-filters">
        <Form
          layout="vertical"
          onValuesChange={onValuesChange}
          initialValues={filters}
        >
          <Form.Item label="Select a person" name="user_id">
            <MembersSelect />
          </Form.Item>
          <Form.Item label="Select day" name="date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </div>
      <div className="main-content">
        {loading ? (
          <div className="spinner-wrapper">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {results.length ? (
              <span>results here</span>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Select a person and a day to see results"
              />
            )}
          </>
        )}
      </div>
    </StyledMembersResultsWrapper>
  );
};
