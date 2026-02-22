export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-sage-50 via-white to-cream-50 font-sans">
      <div className="h-full w-full rounded-2xl bg-white p-8 shadow-lg border border-sage-200 text-center flex flex-col justify-center">
        <p className="text-xl font-serif text-sage-600 mb-2">
          Jonathan & Rachelle&apos;s Wedding
        </p>
        <h1 className="mb-3 text-4xl font-serif font-semibold text-sage-900">
          Guest Registration
        </h1>
        <p className="text-sm text-sage-700 mb-6">
          Choose a registration type below
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/church"
            className="px-6 py-3 bg-sage-600 text-white rounded-md hover:bg-sage-700"
          >
            Church Registration
          </a>
          <a
            href="/dinner"
            className="px-6 py-3 bg-sage-600 text-white rounded-md hover:bg-sage-700"
          >
            Dinner Registration
          </a>
        </div>
      </div>
    </div>
  );
}
