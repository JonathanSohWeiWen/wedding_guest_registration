"use client";

import { useEffect, useState } from "react";
import SearchNamesClient from "../../components/SearchNamesClient";
import { fetchDinnerGuests } from "../lib/actions";

type GuestDinner = { name: string; arrived: boolean; table?: string };

export default function DinnerPage() {
  const [guests, setGuests] = useState<GuestDinner[]>([]);

  useEffect(() => {
    fetchDinnerGuests().then(setGuests);
  }, []);

  return (
    <div className="flex h-screen items-start justify-center bg-gradient-to-br from-sage-50 via-white to-cream-50 font-sans">
      <main className="w-full h-full pt-8 pb-8 px-6 flex flex-col">
        <div className="h-full w-full rounded-2xl bg-white p-8 shadow-lg border border-sage-200 flex flex-col">
          <div className="text-center mb-8">
            <p className="text-xl font-serif text-sage-600 mb-2">
              Jonathan & Rachelle's Wedding
            </p>
            <h1 className="mb-3 text-3xl font-serif font-semibold text-sage-900">
              Dinner Guest Registration
            </h1>
            <p className="text-sm text-sage-700">
              Find your name and mark your attendance for dinner
            </p>
          </div>
          <SearchNamesClient<GuestDinner>
            names={guests}
            placeholder="Search your name for dinner"
            ariaLabel="Search dinner name"
            apiEndpoint="/api/mark-attendance-dinner"
            getButtonText={(guest, loading) =>
              guest.arrived
                ? "Already here!"
                : loading
                  ? "Marking..."
                  : `I am here! Mark my attendance`
            }
            renderExtraContent={(guest) =>
              guest.table ? (
                <div className="text-sm text-sage-700">Table {guest.table}</div>
              ) : null
            }
          />
        </div>
      </main>
    </div>
  );
}
