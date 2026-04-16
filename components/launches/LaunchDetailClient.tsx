"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink as ExternalLinkIcon, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchRocketById, fetchLaunchpadById } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useFavorites } from "@/context/FavoritesContext";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Launch } from "@/lib/types";
import { LaunchStatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import clsx from "clsx";

interface LaunchDetailClientProps {
  launch: Launch;
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

function ExternalLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
    >
      {label}
      <ExternalLinkIcon aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
    </a>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  if (images.length === 0) return null;

  return (
    <section aria-label="Launch image gallery" className="space-y-3">
      <h2 className="text-lg font-semibold text-white">Gallery</h2>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
        <Image
          src={images[selectedIndex]}
          alt={`Launch photo ${selectedIndex + 1} of ${images.length}`}
          fill
          className="object-cover"
          sizes="100%"
          quality={75}
        />
      </div>
      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Gallery thumbnails"
        >
          {images.map((src, i) => (
            <button
              key={src}
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Photo ${i + 1}`}
              onClick={() => setSelectedIndex(i)}
              className={clsx(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                i === selectedIndex
                  ? "border-blue-500"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="100%"
                className="object-cover"
                quality={75}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function RocketSection({ rocketId }: { rocketId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.rocket(rocketId),
    queryFn: () => fetchRocketById(rocketId),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-zinc-500">Rocket details unavailable.</p>
    );
  }

  return (
    <section aria-label="Rocket details" className="space-y-3">
      <h2 className="text-lg font-semibold text-white">Rocket: {data.name}</h2>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Type" value={data.type} />
        <StatCard
          label="Cost per launch"
          value={`$${formatNumber(data.cost_per_launch)}`}
        />
        <StatCard
          label="Success rate"
          value={`${data.success_rate_pct}%`}
        />
        <StatCard label="First flight" value={data.first_flight} />
      </dl>
      {data.description && (
        <p className="text-sm leading-relaxed text-zinc-400">
          {data.description}
        </p>
      )}
    </section>
  );
}

function LaunchpadSection({ launchpadId }: { launchpadId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.launchpad(launchpadId),
    queryFn: () => fetchLaunchpadById(launchpadId),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-zinc-500">Launchpad details unavailable.</p>
    );
  }

  return (
    <section aria-label="Launchpad details" className="space-y-3">
      <h2 className="text-lg font-semibold text-white">
        Launchpad: {data.full_name}
      </h2>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Location" value={`${data.locality}, ${data.region}`} />
        <StatCard label="Status" value={data.status} />
        <StatCard label="Attempts" value={data.launch_attempts} />
        <StatCard label="Successes" value={data.launch_successes} />
      </dl>
      {data.details && (
        <p className="text-sm leading-relaxed text-zinc-400">{data.details}</p>
      )}
    </section>
  );
}

export default function LaunchDetailClient({ launch }: LaunchDetailClientProps) {
  const { isFav, toggleFavorite } = useFavorites();
  const favorited = isFav(launch.id);
  const flickrImages = launch.links.flickr.original;

  const links = [
    { href: launch.links.webcast, label: "Watch webcast" },
    { href: launch.links.article, label: "Article" },
    { href: launch.links.wikipedia, label: "Wikipedia" },
    { href: launch.links.presskit, label: "Press kit" },
  ].filter((l): l is { href: string; label: string } => Boolean(l.href));

  return (
    <article className="space-y-8">
      <div className="flex items-start gap-4">
        {launch.links.patch.large && (
          <Image
            src={launch.links.patch.large}
            alt={`${launch.name} mission patch`}
            width={96}
            height={96}
            className="shrink-0 rounded-xl w-24 h-24"
          />
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {launch.name}
            </h1>
            <button
              onClick={() => toggleFavorite(launch.id)}
              aria-label={
                favorited
                  ? `Remove ${launch.name} from favorites`
                  : `Add ${launch.name} to favorites`
              }
              aria-pressed={favorited}
              className={clsx(
                "shrink-0 rounded-lg p-2 transition-colors",
                favorited
                  ? "bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              )}
            >
              <Star
                aria-hidden="true"
                className="h-5 w-5"
                fill={favorited ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <LaunchStatusBadge
              upcoming={launch.upcoming}
              success={launch.success}
            />
            <time dateTime={launch.date_utc} className="text-sm text-zinc-400">
              {formatDate(launch.date_utc, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </time>
            <span className="text-zinc-600">·</span>
            <span className="text-sm text-zinc-400">
              Flight #{launch.flight_number}
            </span>
          </div>
        </div>
      </div>

      {launch.details && (
        <section aria-label="Mission details">
          <h2 className="mb-2 text-lg font-semibold text-white">
            Mission Details
          </h2>
          <p className="leading-relaxed text-zinc-400">{launch.details}</p>
        </section>
      )}

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Status" value={
          launch.upcoming ? "Upcoming" :
          launch.success === true ? "Success" :
          launch.success === false ? "Failed" : "Unknown"
        } />
        <StatCard label="Cores" value={launch.cores.length} />
        <StatCard label="Payloads" value={launch.payloads.length} />
        <StatCard
          label="Static fire"
          value={launch.static_fire_date_utc
            ? formatDate(launch.static_fire_date_utc)
            : "N/A"}
        />
      </dl>

      {launch.failures.length > 0 && (
        <section aria-label="Failure details" className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            Failure Details
          </h2>
          <ul className="space-y-2">
            {launch.failures.map((f, i) => (
              <li
                key={i}
                className="rounded-lg border border-red-900/40 bg-red-950/20 p-3 text-sm text-red-300"
              >
                <span className="font-medium">T+{f.time}s</span>
                {f.altitude !== null && (
                  <span className="text-red-400"> at {f.altitude}km</span>
                )}
                : {f.reason}
              </li>
            ))}
          </ul>
        </section>
      )}

      {links.length > 0 && (
        <section aria-label="External links" className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Links</h2>
          <div className="flex flex-wrap gap-2">
            {links.map(({ href, label }) => (
              <ExternalLink key={href} href={href} label={label} />
            ))}
          </div>
        </section>
      )}

      <ImageGallery images={flickrImages} />

      <RocketSection rocketId={launch.rocket} />

      <LaunchpadSection launchpadId={launch.launchpad} />

      <div className="pt-4">
        <Link
          href="/launches"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
          Back to launches
        </Link>
      </div>
    </article>
  );
}
