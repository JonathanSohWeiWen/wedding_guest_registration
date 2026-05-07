import { Suspense } from "react";
import HomeContent from "./HomeContent";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex flex-col min-h-screen items-center justify-center"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="text-center">
            <div
              className="text-lg"
              style={{ fontFamily: "Inter, sans-serif", color: "#758857" }}
            >
              Loading...
            </div>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
