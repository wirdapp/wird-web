import axios from "../../util/axios";
import { Role } from "../../util/ContestPeople_Role";

export const MembersApi = {
  getUsers: async (role, search) => {
    const res = await axios.get("/admin_panel/contest_people/", {
      params: {
        contest_role: role,
        search,
      },
    });
    return res.data;
  },
  getMembers: (search) => MembersApi.getUsers(Role.MEMBER, search),
  getAdmins: (search) => MembersApi.getUsers(Role.ADMIN, search),
  getPending: (search) => MembersApi.getUsers(Role.PENDING, search),
  getDeactivated: (search) => MembersApi.getUsers(Role.DEACTIVATED, search),
  async addUserToContest(username, contestId, role) {
    const res = await axios.post("/admin_panel/contest_people/", {
      username,
      contest: contestId,
      contest_role: role,
    });
    return res.data;
  },
  async addAdminToContest(username, contestId) {
    return MembersApi.addUserToContest(username, contestId, Role.ADMIN);
  },
};
