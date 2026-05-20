import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchApplications } from "../api/applications";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import type { Application } from "../types/application";
import { formatDate, formatError } from "../utils/format";

export function ApplicationListPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadApplications() {
    try {
      setIsLoading(true);
      setError(null);
      setApplications(await fetchApplications());
    } catch (err) {
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadApplications();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Application workflow tracker"
        description="Create, submit, review, and decide on applications with clear workflow transitions and a lightweight review dashboard."
        actions={
          <Link to="/applications/new">
            <Button>Create application</Button>
          </Link>
        }
      />

      {isLoading ? <LoadingState message="Loading applications..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={loadApplications} /> : null}
      {!isLoading && !error && applications.length === 0 ? <EmptyState /> : null}

      {!isLoading && !error && applications.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-ink-700">
                  <th className="px-4 py-3 font-semibold">Tracking Number</th>
                  <th className="px-4 py-3 font-semibold">Applicant</th>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-slate-100 text-ink-800 last:border-0"
                  >
                    <td className="px-4 py-4">
                      <Link
                        to={`/applications/${application.id}`}
                        className="font-semibold text-accent-600 hover:text-accent-500"
                      >
                        {application.tracking_number}
                      </Link>
                    </td>
                    <td className="px-4 py-4">{application.applicant_name}</td>
                    <td className="px-4 py-4">{application.company_name}</td>
                    <td className="px-4 py-4">{application.application_type}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-4 py-4">{formatDate(application.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
