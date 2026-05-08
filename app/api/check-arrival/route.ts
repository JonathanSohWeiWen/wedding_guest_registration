import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/app/lib/google";

type Body = { name?: string };

export async function POST(req: NextRequest) {
  const sheet = req.nextUrl.searchParams.get("sheet");
  if (sheet !== "Church" && sheet !== "Dinner")
    throw new Error("Invalid sheet name");
  try {
    const body: Body = await req.json();
    const name = body?.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: "Missing spreadsheet id" },
        { status: 500 },
      );
    }

    const sheets = await getSheetsClient();
    if (!sheets) {
      console.error("check-arrival: failed to get sheets client");
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 },
      );
    }

    // Read from Dinner sheet - Column D is the Arrived status
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheet}!A:D`,
    });
    const values: unknown[][] = getRes.data.values ?? [];
    const rowIndex = values.findIndex(
      (r) =>
        (r[0] || "").toString().trim().toLowerCase() === name.toLowerCase(),
    );

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Name not found" }, { status: 404 });
    }

    const arrivedStatus =
      values[rowIndex] && values[rowIndex][3]
        ? values[rowIndex][3].toString().trim().toUpperCase()
        : "";

    return NextResponse.json({
      arrived: arrivedStatus === "YES",
      name,
    });
  } catch (error) {
    console.error("/api/check-arrival POST error:", error);
    return NextResponse.json(
      { error: "Unable to check arrival status" },
      { status: 500 },
    );
  }
}
