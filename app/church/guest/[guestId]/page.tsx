import { colors } from "@/app/lib/data/constants";
import { getGuestById } from "@/app/lib/data/guests";
import CheckInButton from "@/components/CheckInButton";
import FloralBackground from "@/components/FloralBackground";
import FloralCorner from "@/components/FloralCorner";
import FloralDivider from "@/components/FloralDivider";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ChurchGuestPage({
  params,
}: {
  params: Promise<{ guestId: string }>;
}) {
  const { guestId } = await params;
  const guest = await getGuestById("Church", guestId);

  if (!guest) notFound();
  guest;

  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <FloralBackground />
      <FloralCorner position="top-left" />
      <FloralCorner position="bottom-right" />
      <div
        className="h-2 relative z-10"
        style={{
          background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.primary} 50%, ${colors.accent} 100%)`,
        }}
      />
      <main className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-8 sm:py-16 max-w-2xl mx-auto w-full relative z-10">
        <div className="text-center mb-8">
          <div
            className="inline-block text-4xl mb-4"
            style={{ color: colors.accent }}
          >
            ❦
          </div>
          <h2
            className="text-sm uppercase tracking-widest mb-2"
            style={{
              fontFamily: "Inter, sans-serif",
              color: colors.text.secondary,
              fontWeight: "500",
              letterSpacing: "2px",
            }}
          >
            Wedding Guest
          </h2>
        </div>
        <div className="text-center mb-8">
          <h1
            className="text-4xl sm:text-5xl"
            style={{
              fontFamily: "var(--font-script), cursive",
              color: colors.text.primary,
              fontWeight: "400",
              fontStyle: "italic",
              letterSpacing: "0.5px",
              lineHeight: "1.3",
            }}
          >
            {guest.firstName} <br />
            {guest.lastName}
          </h1>
        </div>
        <FloralDivider />
        <div className="text-center mb-12">
          <p
            className="text-sm uppercase tracking-wider mb-3"
            style={{
              fontFamily: "Inter, sans-serif",
              color: colors.text.secondary,
              fontWeight: "500",
              letterSpacing: "1.5px",
            }}
          >
            Welcome to the ceremony
          </p>
          <div
            className="inline-block text-3xl"
            style={{ color: colors.primary }}
          >
            ⛪
          </div>
        </div>
        <FloralDivider />
        <div className="mb-6 max-w-md mx-auto w-full">
          <CheckInButton
            guestId={guest.id}
            guestName={`${guest.firstName} ${guest.lastName}`}
          />
        </div>
        <div className="flex flex-col gap-3 max-w-md mx-auto w-full mb-8">
          <Link
            href="/church"
            className="text-center px-6 py-3"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: "400",
              color: colors.text.secondary,
              textDecoration: "underline",
            }}
          >
            Search for another guest
          </Link>
          <Link
            href="/"
            className="text-center px-6 py-3"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: "400",
              color: colors.text.secondary,
              textDecoration: "underline",
            }}
          >
            Back to Home
          </Link>
        </div>
        <div className="text-center">
          <div
            className="inline-block text-3xl mb-4"
            style={{ color: colors.accent, opacity: 0.6 }}
          >
            ❦
          </div>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-script), cursive" }}
          >
            {process.env.NEXT_PUBLIC_COUPLE}
          </p>
        </div>
      </main>
      <div
        className="h-2 relative z-10"
        style={{
          background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.primary} 50%, ${colors.accent}100%)`,
        }}
      />
    </div>
  );
}
