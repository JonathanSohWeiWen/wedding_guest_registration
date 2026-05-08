import { redirect } from "next/navigation";

export default async function GuestPage({
  params,
}: {
  params: Promise<{ guestId: string }>;
}) {
  const { guestId } = await params;
  redirect(`/dinner/guest/${guestId}`);
}
