import axios from "../../util/axios";

export const getContests = async () => {
  const { data } = await axios.get("/contests/");
  return data;
};

export async function updateContest(contestId, contest) {
  const { data } = await axios.put(`/contests/${contestId}/`, contest);
  return data;
}

export async function switchContest(contestId) {
  const { data } = await axios.post("/contests/switch_contest/", {
    id: contestId,
  });
  return data;
}

export async function currentContest() {
  const { data } = await axios.get("/contests/current/");
  return data;
}
