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

    // Use shared helper to get an authenticated sheets client
    const sheets = await getSheetsClient();
    if (!sheets) {
      console.error("mark-attendance: failed to get sheets client");
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 },
      );
    }

    // Read columns A through H so we can check arrival status in column H
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Church!A:H",
    });
    const values: unknown[][] = getRes.data.values ?? [];
    const rowIndex = values.findIndex(
      (r) =>
        (r[0] || "").toString().trim().toLowerCase() === name.toLowerCase(),
    );
    if (rowIndex === -1)
      return NextResponse.json({ error: "Name not found" }, { status: 404 });

    const rowNumber = rowIndex + 1; // sheets rows are 1-based

    const existing =
      values[rowIndex] && values[rowIndex][7]
        ? values[rowIndex][7].toString().trim().toUpperCase()
        : "";
    if (existing === "YES") {
      console.log(
        `Attempt to mark already-arrived guest: ${name} (row ${rowNumber})`,
      );
      return NextResponse.json(
        { error: "Already marked", name, row: rowNumber, arrived: true },
        { status: 409 },
      );
    }

    const range = `Church!H${rowNumber}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values: [["YES"]] },
    });

    console.log(`Marked attendance for ${name} at ${range}`);
    return NextResponse.json({ ok: true, name, row: rowNumber, arrived: true });
  } catch (err: unknown) {
    if (err instanceof Error)
      return NextResponse.json(
        { error: err?.message || String(err) },
        { status: 500 },
      );

    console.error("mark-attendance error:", err);
  }
}
