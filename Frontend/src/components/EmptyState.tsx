import { Link } from "react-router-dom";

import { Button } from "./Button";

export function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/75 p-10 text-center">
      <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-ink-100" />
      <h3 className="text-lg font-semibold text-ink-900">
        No applications yet
      </h3>
      <p className="mt-2 text-sm text-ink-700">
        Create your first draft to start tracking the review workflow.
      </p>
      <div className="mt-6">
        <Link to="/applications/new">
          <Button>Create application</Button>
        </Link>
      </div>
    </div>
  );
}
