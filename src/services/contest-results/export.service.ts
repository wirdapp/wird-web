import type { ExportSerializedData } from "../../types";

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
	// biome-ignore lint/suspicious/noExplicitAny: ExcelJS workbook type from dynamic import
	row.eachCell((cell: any) => {
		cell.fill = HEADER_FILL;
		cell.font = HEADER_FONT;
	});
}

// biome-ignore lint/suspicious/noExplicitAny: ExcelJS workbook type from dynamic import
function buildSummarySheet(workbook: any, data: ExportSerializedData) {
	const sheet = workbook.addWorksheet("Summary");

	const headers = ["Member", ...data.dates, "Total"];
	const headerRow = sheet.addRow(headers);
	styleHeaderRow(headerRow);

	sheet.getColumn(1).width = 25;
	for (let i = 2; i <= data.dates.length + 1; i++) {
		sheet.getColumn(i).width = 12;
	}
	sheet.getColumn(data.dates.length + 2).width = 15;

	for (const member of data.members) {
		const total = data.dates.reduce((sum, date) => sum + (member.points_by_date[date] ?? 0), 0);
		const rowValues = [
			member.name,
			...data.dates.map((date) => member.points_by_date[date] ?? 0),
			total,
		];
		const row = sheet.addRow(rowValues);

		for (let i = 2; i <= rowValues.length; i++) {
			row.getCell(i).alignment = NUMBER_ALIGNMENT;
		}
	}

	const totalRowValues = [
		"Total",
		...data.dates.map((date) =>
			data.members.reduce((sum, m) => sum + (m.points_by_date[date] ?? 0), 0),
		),
		data.members.reduce(
			(sum, m) => sum + data.dates.reduce((s, date) => s + (m.points_by_date[date] ?? 0), 0),
			0,
		),
	];
	const totalRow = sheet.addRow(totalRowValues);
	totalRow.font = { bold: true };
	for (let i = 2; i <= totalRowValues.length; i++) {
		totalRow.getCell(i).alignment = NUMBER_ALIGNMENT;
	}
}

export async function generateExcelExport(data: ExportSerializedData): Promise<void> {
	const ExcelJS = await import("exceljs");
	const { saveAs } = await import("file-saver");

	const WorkbookClass = ExcelJS.default?.Workbook ?? ExcelJS.Workbook;
	const workbook = new WorkbookClass();

	buildSummarySheet(workbook, data);

	const buffer = await workbook.xlsx.writeBuffer();
	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	const startDate = data.dates[0] ?? "export";
	const endDate = data.dates[data.dates.length - 1] ?? "";
	const filename = `results_${startDate}_to_${endDate}.xlsx`;
	saveAs(blob, filename);
}
