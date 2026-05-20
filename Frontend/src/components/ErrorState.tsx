interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-2 text-sm">{message}</p>
      {onRetry ? (
        <button
          className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
          onClick={onRetry}
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
