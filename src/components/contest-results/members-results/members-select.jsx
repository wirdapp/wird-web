import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { MembersApi } from "../../../services/members/api";
import { getFullName } from "../../../util/user-utils";

export const MembersSelect = ({ value, onChange, ...props }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    MembersApi.getUsers()
      .then((res) => {
        setMembers(res.results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Select
      {...props}
      loading={loading}
      options={members.map((member) => ({
        label: getFullName(member.person_info),
        value: member.uuid,
      }))}
      value={value}
      onChange={onChange}
      showSearch
      optionFilterProp="label"
    />
  );
};
