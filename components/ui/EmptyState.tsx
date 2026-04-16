interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your filters or search terms.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <svg
        aria-hidden="true"
        className="h-14 w-14 text-zinc-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
        />
      </svg>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-zinc-200">{title}</p>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
