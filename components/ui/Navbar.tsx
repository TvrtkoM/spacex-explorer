"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/context/FavoritesContext";
import clsx from "clsx";
import { Rocket } from "lucide-react";

const navLinks = [
  { href: "/launches", label: "Launches" },
  { href: "/charts", label: "Statistics" },
  { href: "/favorites", label: "Favorites" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-white text-lg tracking-tight hover:opacity-80 transition-opacity"
          aria-label="SpaceX Explorer home"
        >
          <Rocket aria-hidden="true" className="h-6 w-6 text-blue-400" strokeWidth={1.5} />
          SpaceX Explorer
        </Link>

        <ul className="flex items-center gap-1" role="list">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={clsx(
                    "relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                  {label === "Favorites" && favorites.length > 0 && (
                    <span
                      className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-xs font-bold text-white"
                      aria-label={`${favorites.length} favorites`}
                    >
                      {favorites.length}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
