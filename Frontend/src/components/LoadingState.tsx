export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-ink-700">
      {message}
    </div>
  );
}
