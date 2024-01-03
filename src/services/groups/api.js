import axios from "../../util/axios";

export const GroupsApi = {
  async getGroups() {
    const res = await axios.get("/admin_panel/groups/");
    return res.data;
  },
};
