import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { MembersApi } from "../../../services/members/api";
import { getFullName } from "../../../util/user-utils";

export const MembersSelect = ({ ...props }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    MembersApi.getUsers()
      .then((res) => {
        setMembers(
          res.map((member) => ({
            value: member.id,
            label: getFullName(member.person_info),
          })),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Select
      {...props}
      loading={loading}
      options={members}
      showSearch
      optionFilterProp="label"
    />
  );
};
