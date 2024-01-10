export const ContestResultsApi = {
  async getResults() {
    // const res = await axios.get("/contests/results/");
    // return res.data;
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            results: [
              {
                index: 0, // relative to contest start date
                date: "2024-01-01",
                submissions_count: 45,
                total_members: 50,
                top_three: [
                  { id: "xxx", first_name: "Abdedwdw", last_name: "Ksds" },
                  { id: "yyy", first_name: "Zem", last_name: "koop" },
                  { id: "zzz", first_name: "Jnnc", last_name: "scdw" },
                ],
              },
              {
                index: 1, // relative to contest start date
                date: "2024-01-02",
                submissions_count: 50,
                total_members: 50,
                top_three: [
                  { id: "xxx", first_name: "Abdedwdw", last_name: "Sd" },
                  { id: "yyy", first_name: "Zemkoop", last_name: "Ssx" },
                  { id: "zzz", first_name: "Jnncscdw", last_name: "Gfd" },
                ],
              },
              {
                index: 2, // relative to contest start date
                date: "2024-01-03",
                submissions_count: 35,
                total_members: 50,
                top_three: [
                  { id: "xxx", first_name: "Abdedwdw", last_name: "Tvsa" },
                  { id: "yyy", first_name: "Zemkoop", last_name: "Evdc" },
                  { id: "zzz", first_name: "Jnncscdw", last_name: "Scwe" },
                ],
              },
              {
                index: 3,
                date: "2024-01-04",
                submissions_count: 33,
                total_members: 50,
                top_three: [
                  { id: "xxx", first_name: "Abdedwdw", last_name: "Tvsa" },
                  { id: "yyy", first_name: "Zemkoop", last_name: "Evdc" },
                  { id: "zzz", first_name: "Jnncscdw", last_name: "Scwe" },
                ],
              },
              {
                index: 4,
                date: "2024-01-05",
                submissions_count: 19,
                total_members: 50,
                top_three: [
                  { id: "xxx", first_name: "Abdedwdw", last_name: "Tvsa" },
                  { id: "zzz", first_name: "Jnncscdw", last_name: "Scwe" },
                ],
              },
              {
                index: 5,
                date: "2024-01-06",
                submissions_count: 47,
                total_members: 50,
                top_three: [
                  { id: "yyy", first_name: "Zemkoop", last_name: "Evdc" },
                  { id: "zzz", first_name: "Jnncscdw", last_name: "Scwe" },
                ],
              },
              {
                index: 6,
                date: "2024-01-07",
                submissions_count: 40,
                total_members: 50,
                top_three: [
                  { id: "xxx", first_name: "Abdedwdw", last_name: "Tvsa" },
                  { id: "yyy", first_name: "Zemkoop", last_name: "Evdc" },
                  { id: "zzz", first_name: "Jnncscdw", last_name: "Scwe" },
                ],
              },
              {
                index: 7,
                date: "2024-01-08",
                submissions_count: 10,
                total_members: 50,
                top_three: [
                  { id: "xxx", first_name: "Abdedwdw", last_name: "Tvsa" },
                ],
              },
              {
                index: 8,
                date: "2024-01-09",
                submissions_count: 0,
                total_members: 50,
                top_three: [],
              },
              {
                index: 9,
                date: "2024-01-10",
                submissions_count: 0,
                total_members: 50,
                top_three: [],
              },
              {
                index: 10,
                date: "2024-01-11",
                submissions_count: 0,
                total_members: 50,
                top_three: [],
              },
              {
                index: 11,
                date: "2024-01-12",
                submissions_count: 0,
                total_members: 50,
                top_three: [],
              },
              {
                index: 12,
                date: "2024-01-13",
                submissions_count: 0,
                total_members: 50,
                top_three: [],
              },
              {
                index: 13,
                date: "2024-01-14",
                submissions_count: 0,
                total_members: 50,
                top_three: [],
              },
              {
                index: 14,
                date: "2024-01-15",
                submissions_count: 0,
                total_members: 50,
                top_three: [],
              },
              {
                index: 15,
                date: "2024-01-16",
                submissions_count: 0,
                total_members: 50,
                top_three: [],
              },
              {
                index: 16,
                date: "2024-01-17",
                submissions_count: 0,
                total_members: 50,
                top_three: [],
              },
            ],
          }),
        1200,
      ),
    );
  },
  async getMemberResults(userId) {
    // const res = await axios.get(`/contests/results/${userId}/`);
    // return res.data;
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            id: "xxx",
            rank: 2,
            username: "haitham",
            first_name: "Haitham",
            last_name: "Alathamneh",
            total_points: 220,
            days: [
              {
                index: 0, // relative to contest start date
                date: "2024-01-01",
                total_points: 70,
              },
              {
                index: 1,
                date: "2024-01-02",
                total_points: 90,
              },
              {
                index: 2,
                date: "2024-01-03",
                total_points: 60,
              },
              {
                index: 3,
                date: "2024-01-04",
                total_points: 0,
              },
              {
                index: 4,
                date: "2024-01-05",
                total_points: 0,
              },
              {
                index: 5,
                date: "2024-01-06",
                total_points: 0,
              },
              {
                index: 6,
                date: "2024-01-07",
                total_points: 0,
              },
              {
                index: 7,
                date: "2024-01-08",
                total_points: 0,
              },
              {
                index: 8,
                date: "2024-01-09",
                total_points: 0,
              },
              {
                index: 9,
                date: "2024-01-10",
                total_points: 0,
              },
              {
                index: 10,
                date: "2024-01-11",
                total_points: 0,
              },
              {
                index: 11,
                date: "2024-01-12",
                total_points: 0,
              },
              {
                index: 12,
                date: "2024-01-13",
                total_points: 0,
              },
              {
                index: 13,
                date: "2024-01-14",
                total_points: 0,
              },
              {
                index: 14,
                date: "2024-01-15",
                total_points: 0,
              },
              {
                index: 15,
                date: "2024-01-16",
                total_points: 0,
              },
              {
                index: 16,
                date: "2024-01-17",
                total_points: 0,
              },
            ],
            scores: [
              { criteria_id: "uuu", title: "Pages of Quran", total_points: 23 },
              {
                criteria_id: "ooo",
                title: "Prayer in Mosque",
                total_points: 10,
              },
              {
                criteria_id: "iii",
                title: "Lorem ipsum",
                total_points: 30,
              },
              {
                criteria_id: "eee",
                title: "Another criteria",
                total_points: 20,
              },
            ],
          }),
        1200,
      ),
    );
  },
  async getMemberDaySubmissions(userId, date) {
    // const res = await axios.get(`/contests/submissions/${userId}/${date}/`, {
    //   params: {
    //     day_index: dayIndex,
    //   },
    // });
    // return res.data;
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            index: 2, // relative to contest start date
            date: "YYYY-MM-DD",
            id: "xxx",
            rank: 2,
            name: "User Name",
            total_points: 54,
            scores: [
              {
                criteria_id: "uuu",
                title: "Pages of Quran",
                answer: 8,
                submitted_at: "YYYY-MM-DD HH:mm",
              },
              {
                criteria_id: "ooo",
                title: "Prayer in Mosque",
                answer: true,
                submitted_at: "YYYY-MM-DD HH:mm",
              },
            ],
          }),
        1200,
      ),
    );
  },
};
