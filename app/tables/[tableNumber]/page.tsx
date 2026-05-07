import { getGuestsByTableNumber, type Guest } from "@/app/lib/data/guests";
import {
  getAllTableNumbers,
  isLongTable,
  isVIPTable,
  LONG_TABLE_SEATS,
} from "@/app/lib/utils";
import FloralBackground from "@/components/FloralBackground";
import Link from "next/link";

export default async function TablePage({
  params,
}: {
  params: Promise<{ tableNumber: string }>;
}) {
  const { tableNumber } = await params;
  const isVIP = isVIPTable(tableNumber);
  const isLong = isLongTable(tableNumber);
  const tableGuests = await getGuestsByTableNumber(tableNumber);
  const seatCount = tableGuests.length;

  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div style={{ opacity: 0.03 }}>
        <FloralBackground />
      </div>
      <main className="flex flex-col w-full relative z-10 flex-1">
        <div className="p-6 sm:p-12 w-full max-w-2xl mx-auto flex flex-col flex-1">
          <div
            className="text-center mb-8 pb-6 pt-4 sm:pt-8"
            style={{ borderBottom: "2px solid #758857" }}
          >
            <h1
              className="text-4xl sm:text-5xl mb-2"
              style={{
                fontFamily: "var(--font-script), cursive",
                color: "#758857",
                fontWeight: "400",
                fontStyle: "italic",
                letterSpacing: "1px",
              }}
            >
              {isVIP ? tableNumber : `Table ${tableNumber}`}
            </h1>
            <p
              className="text-sm"
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#7c7c62",
                fontWeight: "400",
                letterSpacing: "0.5px",
              }}
            >
              {TableCountText(isVIP, isLong, seatCount)}
            </p>
          </div>
          <div className="flex-1">
            {isLong ? (
              <LongTableSeatingChart
                tableNumber={tableNumber}
                tableGuests={tableGuests}
              />
            ) : (
              <SeatingList tableGuests={tableGuests} />
            )}
          </div>
          <div className="mt-auto pt-8 pb-4 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: "500",
                fontSize: "14px",
                borderRadius: "8px",
                border: "2px solid #758857",
                backgroundColor: "transparent",
                color: "#758857",
              }}
            >
              Back to Seating Chart
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

const SeatingList = ({ tableGuests }: { tableGuests: Guest[] }) => {
  return (
    <div className="space-y-4">
      <h2
        className="text-lg mb-4 text-center"
        style={{
          fontFamily: "Inter, sans-serif",
          color: "#758857",
          fontWeight: "500",
          letterSpacing: "1px",
          textTransform: "uppercase",
          fontSize: "14px",
        }}
      >
        Seated Guest
      </h2>
      <div className="space-y-3">
        {tableGuests.map((guest) => (
          <div
            key={guest.id}
            className="flex items-center justify-between py-3 px-4"
            style={{ backgroundColor: "#f9f8f6", borderRadius: "6px" }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#2C2C2A",
                fontSize: "16px",
                fontWeight: "400",
              }}
            >{`${guest.firstName} ${guest.lastName}`}</span>
            <div className="flex items-center gap-2">
              {guest.seat && (
                <span
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: "#758857",
                    color: "#FFFFFF",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                  }}
                >
                  Seat {guest.seat}
                </span>
              )}
              {guest.arrived && (
                <span
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: "#E8F5E9",
                    color: "#2E7D32",
                    fontFamily: "Inter, sans-sarif",
                    fontWeight: "500",
                    fontSize: "10px",
                  }}
                >
                  Arrived
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LongTableSeatingChart = ({
  tableNumber,
  tableGuests,
}: {
  tableNumber: string;
  tableGuests: Guest[];
}) => {
  const getGuestBySeat = (seat: string) =>
    tableGuests.find((guest) => guest.seat === seat);
  return (
    <div className="space-y-4">
      <h2
        className="text-lg mb-6 text-center"
        style={{
          fontFamily: "Inter, sans-serif",
          color: "#758857",
          fontWeight: "500",
          letterSpacing: "1px",
          textTransform: "uppercase",
          fontSize: "14px",
        }}
      >
        Seating Chart
      </h2>
      <div className="flex gap-4 justify-center items-start">
        <div className="flex-1 max-w-xs">
          <div
            className="text-center mb-3 text-xs"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#7c7c62",
              fontWeight: "500",
              letterSpacing: "0.5px",
            }}
          >
            LEFT
          </div>
          <div className="space-y-2">
            {LONG_TABLE_SEATS.left.map((seat) => {
              const guest = getGuestBySeat(seat);
              return (
                <div
                  key={seat}
                  className="flex items-center justify-between px-3 py-2 rounded"
                  style={{
                    backgroundColor: guest ? "#f9f8f6" : "#FAFAFA",
                    border: "1px solid #E0E0DE",
                    height: "40px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      color: guest ? "#2C2C2A" : "#9E9E9E",
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                  >
                    {guest && `${guest.firstName} ${guest.lastName}`}
                  </span>
                  {guest && guest.arrived && (
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: "#E8F5E9",
                        color: "#2E7D32",
                        fontWeight: "500",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "9px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="w-px"
          style={{
            backgroundColor: "#7c7c62",
            opacity: 0.3,
            marginTop: "27px",
          }}
        />
        <div className="flex-1 max-w-xs">
          <div
            className="text-center mb-3 text-xs"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#7c7c62",
              fontWeight: "500",
              letterSpacing: "0.5px",
            }}
          >
            RIGHT
          </div>
          <div className="space-y-2">
            {LONG_TABLE_SEATS.right.map((seat) => {
              const guest = getGuestBySeat(seat);
              return (
                <div
                  key={seat}
                  className="flex items-center justify-between px-3 py-2 rounded"
                  style={{
                    backgroundColor: guest ? "#f9f8f6" : "#FAFAFA",
                    border: "1px solid #E0E0DE",
                    height: "40px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      color: guest ? "#2C2C2A" : "#9E9E9E",
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                  >
                    {guest && `${guest.firstName} ${guest.lastName}`}
                  </span>
                  {guest && guest.arrived && (
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: "#E8F5E9",
                        color: "#2E7D32",
                        fontWeight: "500",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "9px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const TableCountText = (isVip: boolean, isLong: boolean, seatCount: number) => {
  if (isVip) return `VIP Table · ${seatCount} Seats`;
  else if (isLong) return `Long Table · ${seatCount} Seats`;
  else return `Table · ${seatCount} Seats`;
};
