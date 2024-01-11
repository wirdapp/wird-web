import React from "react";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../shared/page-title";
import { AnimatedPage } from "../../ui/animated-page";
import { Col, Empty, Row, Typography } from "antd";
import { css } from "@emotion/css";
import { SectionsList } from "./sections-list";
import { ContestCriteriaProvider } from "./contest-criteria-context";

export default function ContestCriteria() {
  const { t } = useTranslation();
  usePageTitle(t("criterias"));

  return (
    <AnimatedPage>
      <ContestCriteriaProvider>
        <Row gutter={24}>
          <Col span={24} lg={12}>
            <SectionsList />
          </Col>
          <Col span={24} lg={12}>
            <Typography.Title level={3}>{t("preview")}</Typography.Title>
            <div
              className={css`
                padding: 16px;
                background-color: #f0f2f5;
                min-height: 200px;
              `}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("no-criterias-added")}
              />
            </div>
          </Col>
        </Row>
      </ContestCriteriaProvider>
    </AnimatedPage>
  );
}
