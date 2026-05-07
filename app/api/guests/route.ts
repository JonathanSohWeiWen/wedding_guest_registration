import { NextRequest, NextResponse } from "next/server";
import { getAllGuests } from "@/app/lib/data/guests";

export async function GET(_request: NextRequest) {
  try {
    const guests = await getAllGuests();
    return NextResponse.json(guests);
  } catch (error) {
    console.error("/api/guests GET error:", error);
    return NextResponse.json(
      { error: "Unable to load guest data" },
      { status: 500 },
    );
  }
}
