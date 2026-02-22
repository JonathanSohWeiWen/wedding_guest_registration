import React from "react";
import SearchNamesClientDinner from "./SearchNamesClientDinner";
import { getSheetsClient } from "../app/lib/google";

type GuestDinner = { name: string; arrived: boolean; table?: string };

async function fetchDinnerGuests(): Promise<GuestDinner[]> {
  try {
    const sheets = await getSheetsClient();
    if (!sheets || !process.env.SPREADSHEET_ID) return [];

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Dinner!A:H",
    });
    const values = res.data.values ?? [];

    const guests = values
      .slice(1)
      .map((row) => {
        const name = (row[0] || "").toString().trim();
        const table = (row[3] || "").toString().trim();
        const arrivedRaw = (row[7] || "").toString().trim().toUpperCase();
        return { name, table, arrived: arrivedRaw === "YES" } as GuestDinner;
      })
      .filter((g) => g.name);

    return guests;
  } catch (err) {
    console.error("fetchDinnerGuests error:", err);
    return [];
  }
}

export default async function NameListServerDinner() {
  const guests = await fetchDinnerGuests();
  return <SearchNamesClientDinner names={guests} />;
}
