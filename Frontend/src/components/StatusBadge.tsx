import type { ApplicationStatus } from "../types/application";

const statusClasses: Record<ApplicationStatus, string> = {
  Draft: "bg-slate-100 text-slate-700 ring-slate-200",
  Submitted: "bg-sky-100 text-sky-700 ring-sky-200",
  "Under Review": "bg-amber-100 text-amber-700 ring-amber-200",
  "Need More Information": "bg-orange-100 text-orange-700 ring-orange-200",
  Approved: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  Rejected: "bg-rose-100 text-rose-700 ring-rose-200",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
