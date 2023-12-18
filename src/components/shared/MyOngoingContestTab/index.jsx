import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import MyOngoingContestItem from "./MyOngoingContestItem";
import {retrieveContestsInfo, retrieveCurrentContestInfo,} from "../../../services/competitionsServices";
import {Collapse} from "../../../ui/collapse";
import {css} from "@emotion/css";
import {Button} from "../../../ui/button";
import {useTranslation} from "react-i18next";

function MyOngoingContestTab({competition}) {
  const [currentContest, setCurrentContest] = useState({});
  const [otherContests, setOtherContests] = useState([]);
  const [newContestName, setNewContestName] = useState("");
  const [contestCode, setContestCode] = useState("");
  const {hash} = useLocation();
  const {t} = useTranslation();

  useEffect(() => {
    retrieveCurrentContestInfo(
      (res) => {
        if (res && res.status === 200) {
          setCurrentContest(res.data);
        }
      },
      (err) => {
        console.log(`Failed to get current contest: ${err}`);
      }
    );
  }, []);

  useEffect(() => {
    retrieveContestsInfo(
      (res) => {
        if (res && res.status === 200) {
          setOtherContests(
            res.data.filter((contest) => contest.id !== currentContest.id)
          );
        }
      },
      (err) => {
        console.log(`Failed to contests: ${err}`);
      }
    );
  }, [currentContest]);


  return (
    <Collapse title={
      [currentContest, ...otherContests].length > 0 && Object.keys(currentContest).length > 0
        ? (
          <>
            {[currentContest, ...otherContests].map((contest, index) => (
              <MyOngoingContestItem
                key={contest.id + index}
                contest={contest}
                index={index}
              />
            ))}
          </>
        ) : (
          <MyOngoingContestItem contest="emptyContest"/>
        )
    }>
      <div className={css`
          display: flex;
          gap: 24px;
          align-items: center;
          justify-content: center;
          padding: 24px;
      `}>
        <Button variant="primary">
          + {t('create-contest')}
        </Button>
        <Button>
          {t('join-contest')}
        </Button>
      </div>
    </Collapse>
  );
}

export default MyOngoingContestTab;
