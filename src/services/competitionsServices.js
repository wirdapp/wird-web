import { doRequest } from "./doRequest";
import { getCurrentContestId } from "./contests/utils";

export const retrieveTopMembers = (successCallback, faiCallback) => {
  const currentContestId = getCurrentContestId();
  doRequest(
    null,
    `/admin_panel/${currentContestId}/leaderboard/`,
    {
      "Content-Type": "application/json",
    },
    "get",
    successCallback,
    faiCallback,
    true,
  );
};
