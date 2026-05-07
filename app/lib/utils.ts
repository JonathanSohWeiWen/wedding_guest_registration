import { tableLayout, type TableId } from "./data/constants";

/**
 * Get all unique table numbers from layout
 */
export function getAllTableNumbers(): TableId[] {
  const tables = new Set<TableId>();
  tableLayout.forEach((row) => {
    row.forEach((table) => {
      if (table !== 0) tables.add(table);
    });
  });
  return Array.from(tables);
}

/**
 * Sort tables with VIP first, then numeric order
 */
export function sortTables(tables: TableId[]): TableId[] {
  return [...tables].sort((a, b) => {
    const aStr = String(a);
    const bStr = String(b);
    if (aStr.startsWith("VIP") && !bStr.startsWith("VIP")) return -1;
    if (!aStr.startsWith("VIP") && bStr.startsWith("VIP")) return 1;
    if (aStr.startsWith("VIP") && bStr.startsWith("VIP"))
      return aStr.localeCompare(bStr);
    return Number(a) - Number(b);
  });
}

/**
 * Check if a table is a long table (30 or 31)
 */
export function isLongTable(table: TableId): boolean {
  return String(table) === "30" || String(table) === "31";
}

/**
 * Check if a table is a VIP table
 */
export function isVIPTable(table: TableId): boolean {
  return typeof table === "string" && table.startsWith("VIP");
}

/**
 * Seat assignments for long tables (checkerboard pattern)
 */
export const LONG_TABLE_SEATS = {
  left: ["A", "C", "E", "G", "I", "K", "M", "O", "Q", "S", "U", "W"],
  right: ["B", "D", "F", "H", "J", "L", "N", "P", "R", "T", "V", "X"],
} as const;

/**
 * Get progress bar color based on percentage (red to green gradient)
 */
export function getProgressColor(percentage: number): string {
  if (percentage === 0) return "#D32F2F";
  if (percentage <= 25) return "#E53935";
  if (percentage <= 50) return "#FB8C00";
  if (percentage <= 75) return "#FDD835";
  if (percentage < 100) return "#7CB342";
  return "#2E7D32";
}
