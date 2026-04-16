import Link from "next/link";

export default function LaunchNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 py-32 text-center sm:px-6">
      <h1 className="text-6xl font-bold text-zinc-700">404</h1>
      <div className="space-y-1">
        <p className="text-xl font-semibold text-zinc-200">Launch not found</p>
        <p className="text-zinc-500">
          That mission doesn&apos;t exist or may have been removed.
        </p>
      </div>
      <Link
        href="/launches"
        className="rounded-lg bg-zinc-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
      >
        Browse all launches
      </Link>
    </main>
  );
}
