import React, { useState } from "react";
import { css } from "@emotion/css";
import { Button, Flex, List } from "antd";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useContestCriteriaContext } from "./contest-criteria-context";
import { AddCriteriaPopup } from "./add-criteria-popup";

export const SectionCriteriaList = ({ criteriaItems }) => {
  const { t } = useTranslation();
  const { criteria } = useContestCriteriaContext();
  const [addCriteriaVisible, setAddCriteriaVisible] = useState(false);

  return (
    <Flex vertical gap={16}>
      <List
        itemLayout="vertical"
        className={css`
          background-color: #fff;
        `}
        dataSource={criteriaItems}
        size="large"
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                size="small"
                type="text"
                ghost
                danger
                icon={<TrashIcon />}
              >
                {t("delete")}
              </Button>,
            ]}
          >
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
      <Button
        size="small"
        icon={<PlusIcon />}
        type="dashed"
        onClick={() => setAddCriteriaVisible(true)}
      >
        {t("add-criteria")}
      </Button>
      <AddCriteriaPopup
        open={addCriteriaVisible}
        onClose={() => setAddCriteriaVisible(false)}
      />
    </Flex>
  );
};
