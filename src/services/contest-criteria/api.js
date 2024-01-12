import axios from "../../util/axios";

export const ContestCriteriaApi = {
  async getSections() {
    const { data } = await axios.get("/admin_panel/section/");
    return data;
  },
  async addSection(section) {
    const { data } = await axios.post("/admin_panel/section/", section);
    return data;
  },
  async updateSection(id, section) {
    const { data } = await axios.put(`/admin_panel/section/${id}/`, section);
    return data;
  },
  async deleteSection(id) {
    const { data } = await axios.delete(`/admin_panel/section/${id}/`);
    return data;
  },

  async getCriteria() {
    const { data } = await axios.get("/admin_panel/criteria/");
    return data;
  },
  async addCriteria(criteria) {
    const { data } = await axios.post("/admin_panel/criteria/", criteria);
    return data;
  },
  async updateCriteria(id, criteria) {
    const { data } = await axios.patch(
      `/admin_panel/criteria/${id}/`,
      criteria,
    );
    return data;
  },
  async deleteCriteria(id) {
    const { data } = await axios.delete(`/admin_panel/criteria/${id}/`);
    return data;
  },
};
