import NameListServerDinner from "../../components/NameListServerDinner";

export default function DinnerPage() {
  return (
    <div className="flex h-screen items-start justify-center bg-gradient-to-br from-sage-50 via-white to-cream-50 font-sans">
      <main className="w-full h-full pt-8 pb-8 px-6 flex flex-col">
        <div className="h-full w-full rounded-2xl bg-white p-8 shadow-lg border border-sage-200 flex flex-col">
          <div className="text-center mb-8">
            <p className="text-xl font-serif text-sage-600 mb-2">
              Dinner Guest Registration
            </p>
            <h1 className="mb-3 text-3xl font-serif font-semibold text-sage-900">
              Dinner Registration
            </h1>
            <p className="text-sm text-sage-700">
              Find your name and mark your attendance for dinner
            </p>
          </div>
          <NameListServerDinner />
        </div>
      </main>
    </div>
  );
}
