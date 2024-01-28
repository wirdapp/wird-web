import React from "react";
import { MemberImgsAndNumNumbers } from "../../Home/TopRanks/TopRanks.styles";
import { getFullName, getInitials } from "../../../util/user-utils";
import { Avatar, Tooltip } from "antd";

const styles = [
  { background: "#FDD561", color: "black" },
  { background: "#FF5367", color: "white" },
  { background: "#503E9D", color: "#FDD561" },
];

function NumberAndAbbreviationOfNames(props) {
  return (
    <MemberImgsAndNumNumbers>
      <Avatar.Group maxCount={3}>
        {props.users.map((user, i) => {
          return (
            <Tooltip title={getFullName(user.person_info)}>
              <Avatar key={i} style={styles[i]}>
                {getInitials(user.person_info)}
              </Avatar>
            </Tooltip>
          );
        })}
      </Avatar.Group>
    </MemberImgsAndNumNumbers>
  );
}

export default NumberAndAbbreviationOfNames;
