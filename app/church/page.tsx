"use client";

import { useEffect, useState } from "react";
import SearchNamesClient from "../../components/SearchNamesClient";
import { fetchChurchGuests } from "../lib/actions";

type GuestChurch = { name: string; arrived: boolean };

export default function ChurchPage() {
  const [guests, setGuests] = useState<GuestChurch[]>([]);

  useEffect(() => {
    fetchChurchGuests().then(setGuests);
  }, []);

  return (
    <div className="flex h-screen items-start justify-center bg-linear-to-br from-sage-50 via-white to-cream-50 font-sans">
      <main className="w-full h-full pt-8 pb-8 px-6 flex flex-col">
        <div className="h-full w-full rounded-2xl bg-white p-8 shadow-lg border border-sage-200 flex flex-col">
          <div className="text-center mb-8">
            <p className="text-xl font-serif text-sage-600 mb-2">
              Jonathan & Rachelle's Wedding
            </p>
            <h1 className="mb-3 text-3xl font-serif font-semibold text-sage-900">
              Church Guest Registration
            </h1>
            <p className="text-sm text-sage-700">
              Find your name and mark your attendance
            </p>
          </div>
          <SearchNamesClient<GuestChurch>
            names={guests}
            placeholder="Search your name"
            ariaLabel="Search name"
            apiEndpoint="/api/mark-attendance"
            getButtonText={(guest, loading) =>
              guest.arrived
                ? "Already here!"
                : loading
                  ? "Marking..."
                  : `${guest.name} has arrived at the church`
            }
          />
        </div>
      </main>
    </div>
  );
}
