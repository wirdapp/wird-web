import type React from "react";
import { useLeaderboard } from "../../services/contest-results/queries";
import { useMembers } from "../../services/members/queries";
import { AnimatedPage } from "../../ui/animated-page";
import { useDashboardData } from "../../util/routes-data";
import { getFullName } from "../../util/user-utils";
import { ContestDetailsBox } from "../Competition/contest-details-box";
import HomeBanner from "./HomeBanner";
import TopRanks from "./TopRanks";

function Home(): React.ReactElement {
	const { currentUser, currentContest } = useDashboardData();

	const { data: membersData, isLoading: studentsLoading } = useMembers({
		contestId: currentContest?.id,
	});

	const { data: leaderboardData, isLoading: topMembersLoading } = useLeaderboard(
		currentContest?.id,
	);

	const students = membersData?.results ?? [];
	const topMembers = leaderboardData?.slice(0, 3) ?? [];

	return (
		<AnimatedPage className="flex flex-col justify-center items-start gap-4 min-[900px]:gap-8">
			<HomeBanner name={getFullName(currentUser)} />
			{currentContest && <ContestDetailsBox />}
			<TopRanks
				students={students}
				topMembers={topMembers}
				studentsLoading={studentsLoading}
				topMembersLoading={topMembersLoading}
			/>
		</AnimatedPage>
	);
}

export default Home;
