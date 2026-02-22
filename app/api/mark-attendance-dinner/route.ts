import { NextResponse } from "next/server";
import { getSheetsClient } from "../../lib/google";
import { SPREADSHEET_ID } from "../../../.secrets/secrets";

type Body = { name?: string };

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const name = body?.name?.trim();
    if (!name)
      return NextResponse.json({ error: "Missing name" }, { status: 400 });

    const spreadsheetId = SPREADSHEET_ID;
    if (!spreadsheetId)
      return NextResponse.json(
        { error: "Missing spreadsheet id" },
        { status: 500 },
      );

    const sheets = await getSheetsClient();
    if (!sheets) {
      console.error("mark-attendance-dinner: failed to get sheets client");
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 },
      );
    }

    // Read columns A through H from Dinner sheet so we can get table number (col D)
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Dinner!A:H",
    });
    const values: any[] = getRes.data.values ?? [];
    const rowIndex = values.findIndex(
      (r) =>
        (r[0] || "").toString().trim().toLowerCase() === name.toLowerCase(),
    );
    if (rowIndex === -1)
      return NextResponse.json({ error: "Name not found" }, { status: 404 });

    const rowNumber = rowIndex + 1;
    const tableRaw =
      values[rowIndex] && values[rowIndex][3]
        ? values[rowIndex][3].toString().trim()
        : "";

    const existing =
      values[rowIndex] && values[rowIndex][7]
        ? values[rowIndex][7].toString().trim().toUpperCase()
        : "";
    if (existing === "YES") {
      console.log(
        `Attempt to mark already-arrived dinner guest: ${name} (row ${rowNumber}), table=${tableRaw}`,
      );
      return NextResponse.json(
        {
          error: "Already marked",
          name,
          row: rowNumber,
          arrived: true,
          table: tableRaw,
        },
        { status: 409 },
      );
    }

    const range = `Dinner!H${rowNumber}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values: [["YES"]] },
    });

    console.log(
      `Marked dinner attendance for ${name} at ${range}, table=${tableRaw}`,
    );
    return NextResponse.json({
      ok: true,
      name,
      row: rowNumber,
      arrived: true,
      table: tableRaw,
    });
  } catch (err: any) {
    console.error("mark-attendance-dinner error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 },
    );
  }
}
