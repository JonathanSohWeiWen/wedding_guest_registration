import { NextRequest, NextResponse } from "next/server";
import { getAllGuests } from "@/app/lib/data/guests";

export async function GET(request: NextRequest) {
  const sheet = request.nextUrl.searchParams.get("sheet");
  if (sheet !== "Church" && sheet !== "Dinner")
    throw new Error("Invalid sheet name");
  try {
    const guests = await getAllGuests(sheet);
    return NextResponse.json(guests);
  } catch (error) {
    console.error("/api/guests GET error:", error);
    return NextResponse.json(
      { error: "Unable to load guest data" },
      { status: 500 },
    );
  }
}
