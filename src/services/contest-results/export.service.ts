import type { ExportResultsResponse } from "../../types";

const HEADER_FILL = {
	type: "pattern" as const,
	pattern: "solid" as const,
	fgColor: { argb: "FF4472C4" },
};

const HEADER_FONT = {
	bold: true,
	color: { argb: "FFFFFFFF" },
};

const NUMBER_ALIGNMENT = {
	horizontal: "right" as const,
};

// biome-ignore lint/suspicious/noExplicitAny: ExcelJS workbook type from dynamic import
function styleHeaderRow(row: any) {
	row.eachCell((cell: any) => {
		cell.fill = HEADER_FILL;
		cell.font = HEADER_FONT;
	});
}

// biome-ignore lint/suspicious/noExplicitAny: ExcelJS workbook type from dynamic import
function buildSummarySheet(workbook: any, data: ExportResultsResponse) {
	const sheet = workbook.addWorksheet(
		data.contest_name ? `${data.contest_name} - Summary` : "Summary",
	);

	const headers = ["Member", ...data.dates, "Total Points", "Total Submissions"];
	const headerRow = sheet.addRow(headers);
	styleHeaderRow(headerRow);

	sheet.getColumn(1).width = 25;
	for (let i = 2; i <= data.dates.length + 1; i++) {
		sheet.getColumn(i).width = 12;
	}
	sheet.getColumn(data.dates.length + 2).width = 15;
	sheet.getColumn(data.dates.length + 3).width = 15;

	for (const member of data.members) {
		const rowValues = [
			member.name,
			...data.dates.map((date) => member.daily_points[date] ?? 0),
			member.total_points,
			member.total_submissions,
		];
		const row = sheet.addRow(rowValues);

		for (let i = 2; i <= rowValues.length; i++) {
			row.getCell(i).alignment = NUMBER_ALIGNMENT;
		}
	}

	const totalRowValues = [
		"Contest Total",
		...data.dates.map((date) =>
			data.members.reduce((sum, m) => sum + (m.daily_points[date] ?? 0), 0),
		),
		data.members.reduce((sum, m) => sum + m.total_points, 0),
		data.members.reduce((sum, m) => sum + m.total_submissions, 0),
	];
	const totalRow = sheet.addRow(totalRowValues);
	totalRow.font = { bold: true };
	for (let i = 2; i <= totalRowValues.length; i++) {
		totalRow.getCell(i).alignment = NUMBER_ALIGNMENT;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: ExcelJS workbook type from dynamic import
function buildDetailedSheet(workbook: any, data: ExportResultsResponse) {
	const sheet = workbook.addWorksheet(
		data.contest_name ? `${data.contest_name} - Details` : "Detailed Breakdown",
	);

	const headers = ["Member", "Criterion", ...data.dates, "Total"];
	const headerRow = sheet.addRow(headers);
	styleHeaderRow(headerRow);

	sheet.getColumn(1).width = 25;
	sheet.getColumn(2).width = 25;
	for (let i = 3; i <= data.dates.length + 2; i++) {
		sheet.getColumn(i).width = 12;
	}
	sheet.getColumn(data.dates.length + 3).width = 15;

	for (const member of data.members) {
		let isFirst = true;
		for (const criterion of data.criteria) {
			const dailyPoints = member.criterion_daily_points[criterion.id] ?? {};
			const total = data.dates.reduce((sum, date) => sum + (dailyPoints[date] ?? 0), 0);
			const rowValues = [
				isFirst ? member.name : "",
				`${criterion.section_label} - ${criterion.label}`,
				...data.dates.map((date) => dailyPoints[date] ?? 0),
				total,
			];
			const row = sheet.addRow(rowValues);

			if (isFirst) {
				row.getCell(1).font = { bold: true };
				isFirst = false;
			}

			for (let i = 3; i <= rowValues.length; i++) {
				row.getCell(i).alignment = NUMBER_ALIGNMENT;
			}
		}
	}
}

export async function generateExcelExport(data: ExportResultsResponse): Promise<void> {
	const ExcelJS = await import("exceljs");
	const { saveAs } = await import("file-saver");

	const WorkbookClass = ExcelJS.default?.Workbook ?? ExcelJS.Workbook;
	const workbook = new WorkbookClass();

	buildSummarySheet(workbook, data);
	buildDetailedSheet(workbook, data);

	const buffer = await workbook.xlsx.writeBuffer();
	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	const filename = `${data.contest_name}_results_${data.date_range.start}_to_${data.date_range.end}.xlsx`;
	saveAs(blob, filename);
}
