import {useTranslation} from "react-i18next";
import {AnimatedPage} from "../../ui/animated-page";
import {GroupContextProvider} from "./groups-context";
import React, {useEffect, useState} from "react";
import {GroupsList} from './groups-list/groups-list';
import {css} from "@emotion/css";
import {Avatar, Col, Row, Typography} from "antd";
import {getFullName, getInitials} from "../../util/user-utils";
import {MembersApi} from "../../services/members/api";
import {getColor} from "../leaderboard";
import {Top3RankDiv} from "../Home/TopRanks/TopRanks.styles";
import {Role} from "../../util/ContestPeople_Role";

export function Group() {
    const {t} = useTranslation();
    const [members, setMembers] = useState([]);

    const loadMembers = async () => {
        try {
            const data = await MembersApi.getUsers();
            setMembers(data);
        } catch (err) {
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);


    return (
        <AnimatedPage>
            <GroupContextProvider>
                <Row gutter={24}>
                    <Col
                        span={24}
                        lg={14}
                        className={css`
                           margin-bottom: 16px;
                       `}
                    >
                        <GroupsList members={members}/>
                    </Col>
                    <Col span={24} lg={10}>
                        <div
                            className={css`
                            @media (min-width: 992px) {
                              position: sticky;
                              top: 16px;
                            }
                        `}
                        >
                            <Typography.Title level={3}>{t("students")}</Typography.Title>
                            <div
                                className={css`
                                      padding: 16px;
                                      background-color: #f0f2f5;
                                      min-height: 200px;
                                    `}
                            >
                                {
                                    members.filter(member => Role.MEMBER === member.contest_role).map((member, i) => {
                                        const user = {
                                            firstName: member.person_info.first_name,
                                            lastName: member.person_info.last_name,
                                            username: member.person_info.username,
                                            id: member.id
                                        };
                                        return (
                                            <Top3RankDiv
                                                to={`/dashboard/results/members?userId=${user.id}`}
                                                key={i}>
                                                <Avatar src={user.profile_photo} size={40}
                                                        style={{background: getColor(i)}}>
                                                    {getInitials(user)}
                                                </Avatar>
                                                {getFullName(user)}
                                            </Top3RankDiv>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
            </GroupContextProvider>
        </AnimatedPage>
    );
}