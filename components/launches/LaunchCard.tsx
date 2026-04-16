"use client";

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import clsx from "clsx";
import { Rocket, Star } from "lucide-react";
import type { Launch } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { LaunchStatusBadge } from "@/components/ui/Badge";
import { useFavorites } from "@/context/FavoritesContext";

interface LaunchCardProps {
  launch: Launch;
}

function LaunchCard({ launch }: LaunchCardProps) {
  const { isFav, toggleFavorite } = useFavorites();
  const favorited = isFav(launch.id);

  return (
    <article className="group relative flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-800/80 h-38">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {launch.links.patch.small ? (
            <Image
              src={launch.links.patch.small}
              alt={`${launch.name} mission patch`}
              width={40}
              height={40}
              className="shrink-0 rounded w-10 h-10"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-zinc-800"
            >
              <Rocket className="h-5 w-5 text-zinc-600" strokeWidth={1.5} />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-white">
              {launch.name}
            </h2>
            <p className="text-xs text-zinc-500">
              Flight #{launch.flight_number}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(launch.id);
          }}
          aria-label={favorited ? `Remove ${launch.name} from favorites` : `Add ${launch.name} to favorites`}
          aria-pressed={favorited}
          className={clsx(
            "shrink-0 rounded-md p-1.5 transition-colors",
            favorited
              ? "text-yellow-400 hover:text-yellow-300"
              : "text-zinc-600 hover:text-zinc-400"
          )}
        >
          <Star
            aria-hidden="true"
            className="h-4 w-4"
            fill={favorited ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <LaunchStatusBadge upcoming={launch.upcoming} success={launch.success} />
        <time
          dateTime={launch.date_utc}
          className="text-xs text-zinc-500"
        >
          {formatDate(launch.date_utc)}
        </time>
      </div>

      <Link
        href={`/launches/${launch.id}`}
        className="text-sm mt-2 inline underline w-fit"
        aria-label={`View details for ${launch.name}`}
      >
        <span>View launch details</span>
      </Link>
    </article>
  );
}

export default memo(LaunchCard);
