import React from "react";
import SearchNamesClient from "./SearchNamesClient";
import { SPREADSHEET_ID } from "../.secrets/secrets";
import { getSheetsClient } from "../app/lib/google";

type Guest = { name: string; arrived: boolean };

async function fetchNames(): Promise<Guest[]> {
  try {
    const sheets = await getSheetsClient();
    if (!sheets || !SPREADSHEET_ID) return [];

    // Fetch columns A through H so we can read arrival status in column H
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Church!A:H",
    });

    const values = res.data.values ?? [];
    const guests = values
      .map((row) => {
        const name = (row[0] || "").toString().trim();
        const arrivedRaw = (row[7] || "").toString().trim().toUpperCase();
        return { name, arrived: arrivedRaw === "YES" } as Guest;
      })
      .filter((g) => g.name);

    return guests;
  } catch (err) {
    console.error("fetchNames error:", err);
    return [];
  }
}

export default async function NameListServer() {
  const names = await fetchNames();
  return <SearchNamesClient names={names} />;
}
