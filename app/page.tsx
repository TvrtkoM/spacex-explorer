import Link from "next/link";
import type { Metadata } from "next";
import { Image as ImageIcon, Rocket, Search, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "SpaceX Explorer",
  description:
    "Browse and explore all SpaceX missions. Filter by status, search missions, and save your favorites.",
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <div className="space-y-6 max-w-2xl">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800">
            <Rocket aria-hidden="true" className="h-10 w-10 text-blue-400" strokeWidth={1.25} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            SpaceX Explorer
          </h1>
          <p className="text-lg text-zinc-400">
            Browse every SpaceX mission. Filter, search, and bookmark your
            favorite launches.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/launches"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            Browse launches
          </Link>
          <Link
            href="/favorites"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-700 px-6 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            View favorites
          </Link>
        </div>

        <ul
          className="grid grid-cols-1 gap-3 pt-6 text-left sm:grid-cols-3"
          aria-label="Features"
        >
          {[
            {
              icon: <Search aria-hidden="true" className="h-5 w-5 text-blue-400" strokeWidth={1.5} />,
              title: "Search & Filter",
              desc: "Filter by status, date range, and outcome.",
            },
            {
              icon: <Star aria-hidden="true" className="h-5 w-5 text-blue-400" strokeWidth={1.5} />,
              title: "Favorites",
              desc: "Bookmark launches to access them quickly.",
            },
            {
              icon: <ImageIcon aria-hidden="true" className="h-5 w-5 text-blue-400" strokeWidth={1.5} />,
              title: "Image Galleries",
              desc: "View Flickr photos for each mission.",
            },
          ].map(({ icon, title, desc }) => (
            <li
              key={title}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-2"
            >
              {icon}
              <p className="text-sm font-semibold text-zinc-200">{title}</p>
              <p className="text-xs text-zinc-500">{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
