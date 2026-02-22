"use server";

import { getSheetsClient } from "./google";

type GuestChurch = { name: string; arrived: boolean };
type GuestDinner = { name: string; arrived: boolean; table?: string };

export async function fetchChurchGuests(): Promise<GuestChurch[]> {
  try {
    const sheets = await getSheetsClient();
    if (!sheets || !process.env.SPREADSHEET_ID) return [];

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Church!A:H",
    });

    const values = res.data.values ?? [];
    const guests = values
      .slice(1)
      .map((row) => {
        const name = (row[0] || "").toString().trim();
        const arrivedRaw = (row[7] || "").toString().trim().toUpperCase();
        return { name, arrived: arrivedRaw === "YES" } as GuestChurch;
      })
      .filter((g) => g.name);

    console.log(`fetched successfully: ${guests.length} records`);
    return guests;
  } catch (err) {
    console.error("fetchChurchGuests error:", err);
    return [];
  }
}

export async function fetchDinnerGuests(): Promise<GuestDinner[]> {
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

    console.log(`fetched successfully: ${guests.length} records`);
    return guests;
  } catch (err) {
    console.error("fetchDinnerGuests error:", err);
    return [];
  }
}
