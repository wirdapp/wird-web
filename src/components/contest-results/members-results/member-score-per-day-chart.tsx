import dayjs from "dayjs";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface DayData {
	index: number;
	date: string;
	points: number;
}

interface TooltipPayloadItem {
	value: number;
	color: string;
	payload: DayData;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: TooltipPayloadItem[];
	label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
	const { t } = useTranslation();

	if (active && payload && payload.length) {
		return (
			<Card className="border shadow-md">
				<CardContent className="p-3">
					<span>
						{t("day")} {Number(label)}
					</span>
					<div className="flex gap-2 items-center mt-1">
						<span
							className="w-2.5 h-2.5 rounded-full inline-block"
							style={{ backgroundColor: payload[0].color }}
						/>
						<span>
							{t("score")}: {payload[0].value}
						</span>
					</div>
					<div className="mt-1">
						<small className="text-muted-foreground">
							{t("date")}:{" "}
							{payload[0].payload.date
								? dayjs(payload[0].payload.date).format("DD/MM/YYYY")
								: ""}{" "}
						</small>
					</div>
				</CardContent>
			</Card>
		);
	}

	return null;
};

interface CustomXTickProps {
	x?: number;
	y?: number;
	payload?: {
		index: number;
		value: unknown;
	};
}

const CustomXTick: React.FC<CustomXTickProps> = ({ x, y, payload }) => {
	return (
		<g transform={`translate(${x},${y})`}>
			<text x={0} y={0} dy={16} textAnchor="end" fill="#afafaf">
				{payload ? payload.index + 1 : ""}
			</text>
		</g>
	);
};

interface MemberScorePerDayChartProps {
	data?: DayData[];
}

export const MemberScorePerDayChart: React.FC<MemberScorePerDayChartProps> = ({ data }) => {
	const { i18n } = useTranslation();
	const isRtl = i18n.dir() === "rtl";

	return (
		<ResponsiveContainer width="100%" height={250}>
			<BarChart height={250} data={data}>
				<CartesianGrid stroke="#f5f5f5" />
				<XAxis dataKey="index" stroke="#afafaf" tick={<CustomXTick />} reversed={isRtl} />
				<Tooltip content={<CustomTooltip />} />
				<Bar dataKey="points" fill="#FB6D3B" />
			</BarChart>
		</ResponsiveContainer>
	);
};
