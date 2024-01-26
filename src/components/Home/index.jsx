import React, { useEffect, useState } from "react";
import { HomeContainer } from "./home.styles";
import Loader from "../Loader";
import HomeBanner from "./HomeBanner";
import TopRanks from "./TopRanks";
import { useDashboardData } from "../../util/routes-data";
import { useTranslation } from "react-i18next";
import { MembersApi } from "../../services/members/api";

function Home() {
  const { currentUser, currentContest } = useDashboardData();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [topMembers, setTopMembers] = useState([]);

  useEffect(() => {
    if (!currentContest) return;
    setLoading(true);

    // MembersApi.getMembers()
    //   .then((res) => {
    //     setTopMembers(res ?? []);
    //   })
    //   .catch((err) => {
    //     console.log("Failed to retrieve top members : ", err.data);
    //   });

    MembersApi.getMembers()
      .then((data) => {
        setStudents(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <HomeContainer>
      <HomeBanner
        name={
          currentUser?.first_name?.length > 0
            ? currentUser.first_name + " " + currentUser.last_name
            : "Admin"
        }
        dayNumber={"1"}
      />
      {/* <DaysSlider /> */}
      <TopRanks students={students} topMembers={topMembers} />
    </HomeContainer>
  );
}

export default Home;
