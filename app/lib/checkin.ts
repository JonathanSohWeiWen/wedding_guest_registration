const STORAGE_KEY = "wedding-checkins";
const CACHE_TTL_MS = 30_000;

export interface CheckInStatus {
  checkedIn: boolean;
  arrivedAt: string; // ISO timestamp
}

type CheckInRecord = Record<string, CheckInStatus>;

type StoredPayload = {
  timestamp: number;
  data: CheckInRecord;
};

function normalizeGuestName(name: string): string {
  return name.trim().toLowerCase();
}

export function isStorageAvailable(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function readStoredPayload(): StoredPayload | null {
  if (!isStorageAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const payload = JSON.parse(raw) as StoredPayload;
    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.timestamp !== "number" ||
      typeof payload.data !== "object" ||
      payload.data === null
    ) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    if (Date.now() - payload.timestamp > CACHE_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return payload;
  } catch (err) {
    console.error("readStoredPayload error:", err);
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveStoredPayload(data: CheckInRecord): void {
  if (!isStorageAvailable()) return;

  try {
    const payload: StoredPayload = {
      timestamp: Date.now(),
      data,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("saveStoredPayload error:", err);
  }
}

/**
 * Get all check-ins from local storage. Returns an empty map when no valid cache exists.
 */
function getAllCheckIns(): CheckInRecord {
  const payload = readStoredPayload();
  return payload?.data ?? {};
}

/**
 * Get check-in status for a specific guest
 */
export function getCheckInStatus(guestName: string): CheckInStatus {
  if (!guestName) {
    return { checkedIn: false, arrivedAt: "" };
  }

  const normalized = normalizeGuestName(guestName);
  console.log(normalized);
  const checkIns = getAllCheckIns();
  console.log(checkIns);
  return checkIns[normalized] ?? { checkedIn: false, arrivedAt: "" };
}

/**
 * Mark a guest as checked in
 */
export function checkInGuest(guestName: string): void {
  if (!guestName || !isStorageAvailable()) return;

  const normalized = normalizeGuestName(guestName);
  const url = "/api/mark-attendance";

  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: guestName }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body?.error || res.statusText || "Failed to mark attendance";
        throw new Error(message);
      }
      return res.json();
    })
    .then((body) => {
      if (body?.ok || body?.arrived) {
        const payload = readStoredPayload();
        const updatedCheckIns: CheckInRecord = payload?.data
          ? { ...payload.data }
          : {};
        updatedCheckIns[normalized] = {
          checkedIn: true,
          arrivedAt: new Date().toISOString(),
        };
        saveStoredPayload(updatedCheckIns);
      }
    })
    .catch((err) => {
      console.error("checkInGuest error:", err);
    });
}

/**
 * Get all check-ins (useful for admin dashboard)
 */
export function getAllCheckInStatuses(): CheckInRecord {
  return getAllCheckIns();
}
