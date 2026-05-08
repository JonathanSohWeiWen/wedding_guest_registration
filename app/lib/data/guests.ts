"use server";

import { getSheetsClient } from "../google";
import { TableId } from "./constants";

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  tableNumber: TableId;
  seat?: string; // Optional seat assignment (e.g. "A", "B", "C" for tables 30 & 31). Also parsed from combined values like "30A"/"31C".
  arrived?: boolean;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeTableId(value: string): TableId {
  const raw = value.trim();
  if (!raw) return 0;
  if (/^VIP/i.test(raw)) return raw.toUpperCase();
  const num = Number(raw);
  return Number.isNaN(num) ? raw : num;
}

function parseGuestRow(row: unknown[], index: number): Guest | null {
  const cells = row as Array<unknown>;
  const fullName = (cells[0] ?? "").toString().trim();
  if (!fullName) return null;

  const arrivedRaw = (cells[3] ?? "").toString().trim().toUpperCase();
  const tableRaw = (cells[4] ?? "").toString().trim();
  const seatRaw = (cells[5] ?? "").toString().trim();

  const combinedTableMatch = tableRaw.match(/^([0-9]+)\s*([A-Za-z])?$/);
  const numericTable = combinedTableMatch ? combinedTableMatch[1] : tableRaw;
  const seatFromTable = combinedTableMatch
    ? combinedTableMatch[2]?.toUpperCase()
    : undefined;

  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const firstName = nameParts.shift() ?? "";
  const lastName = nameParts.join(" ") || "";
  const idBase = `${firstName}-${lastName || `guest-${index + 1}`}`;

  return {
    id: slugify(idBase),
    firstName,
    lastName,
    tableNumber: normalizeTableId(numericTable),
    seat: seatRaw || seatFromTable || undefined,
    arrived: arrivedRaw === "YES",
  };
}

async function fetchGuestRows(sheet: "Church" | "Dinner"): Promise<Guest[]> {
  try {
    const sheets = await getSheetsClient();
    if (!sheets || !process.env.SPREADSHEET_ID) return [];

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheet}!A:H`,
    });

    const values = res.data.values ?? [];
    return values
      .slice(1)
      .map((row, index) => parseGuestRow(row, index))
      .filter((guest): guest is Guest => guest !== null);
  } catch (err) {
    console.error("fetchGuestRows error:", err);
    return [];
  }
}

export async function getAllGuests(
  sheet: "Church" | "Dinner",
): Promise<Guest[]> {
  return await fetchGuestRows(sheet);
}

export async function getGuestById(
  sheet: "Church" | "Dinner",
  id: string,
): Promise<Guest | undefined> {
  const guests = await getAllGuests(sheet);
  return guests.find((guest) => guest.id === id);
}

export async function getGuestsByTableNumber(
  sheet: "Church" | "Dinner",
  tableNumber: TableId,
): Promise<Guest[]> {
  const guests = await getAllGuests(sheet);
  return guests.filter(
    (guest) => String(guest.tableNumber) === String(tableNumber),
  );
}
