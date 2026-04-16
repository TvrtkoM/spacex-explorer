import clsx from "clsx";
import type { ReactNode } from "react";

type BadgeVariant = "success" | "failure" | "upcoming" | "neutral";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  failure: "bg-red-500/15 text-red-400 ring-red-500/20",
  upcoming: "bg-blue-500/15 text-blue-400 ring-blue-500/20",
  neutral: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20",
};

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantClasses[variant]
      )}
    >
      {children}
    </span>
  );
}

export function LaunchStatusBadge({
  upcoming,
  success,
}: {
  upcoming: boolean;
  success: boolean | null;
}) {
  if (upcoming) return <Badge variant="upcoming">Upcoming</Badge>;
  if (success === true) return <Badge variant="success">Success</Badge>;
  if (success === false) return <Badge variant="failure">Failed</Badge>;
  return <Badge variant="neutral">Unknown</Badge>;
}
