import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  fetchApplication,
  startReview,
  submitApplication,
} from "../api/applications";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { useToast } from "../hooks/useToast";
import type { Application } from "../types/application";
import { formatDate, formatError } from "../utils/format";

export function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadApplication() {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setApplication(await fetchApplication(id));
    } catch (err) {
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadApplication();
  }, [id]);

  async function handleSubmit() {
    if (!id || !application) {
      return;
    }

    try {
      setIsActing(true);
      const next = await submitApplication(id);
      setApplication(next);
      showToast(
        application.status === "Need More Information"
          ? "Application resubmitted successfully."
          : "Application submitted successfully.",
      );
    } catch (err) {
      setError(formatError(err));
    } finally {
      setIsActing(false);
    }
  }

  async function handleStartReview() {
    if (!id) {
      return;
    }

    try {
      setIsActing(true);
      const next = await startReview(id);
      setApplication(next);
      showToast("Application moved to under review.");
    } catch (err) {
      setError(formatError(err));
    } finally {
      setIsActing(false);
    }
  }

  function renderActions() {
    if (!application) {
      return null;
    }

    switch (application.status) {
      case "Draft":
        return (
          <>
            <Link to={`/applications/${application.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={isActing}>
              {isActing ? "Submitting..." : "Submit"}
            </Button>
          </>
        );
      case "Submitted":
        return (
          <Button onClick={handleStartReview} disabled={isActing}>
            {isActing ? "Starting review..." : "Start Review"}
          </Button>
        );
      case "Under Review":
        return (
          <>
            <Button
              variant="secondary"
              onClick={() => navigate(`/applications/${application.id}/decision?decision=Approved`)}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              onClick={() => navigate(`/applications/${application.id}/decision?decision=Rejected`)}
            >
              Reject
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  `/applications/${application.id}/decision?decision=Need%20More%20Information`,
                )
              }
            >
              Need More Information
            </Button>
          </>
        );
      case "Need More Information":
        return (
          <>
            <Link to={`/applications/${application.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={isActing}>
              {isActing ? "Resubmitting..." : "Resubmit"}
            </Button>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Application Detail"
        title={application?.tracking_number ?? "Application details"}
        description="Review application information, status history, and the next workflow actions based on the current state."
        actions={
          <div className="flex flex-wrap gap-3">{renderActions()}</div>
        }
      />

      {isLoading ? <LoadingState message="Loading application details..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={loadApplication} /> : null}

      {!isLoading && application ? (
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card>
            <div className="grid gap-6 md:grid-cols-2">
              <DetailRow label="Tracking number" value={application.tracking_number} />
              <DetailRow
                label="Status"
                value={<StatusBadge status={application.status} />}
              />
              <DetailRow label="Applicant name" value={application.applicant_name} />
              <DetailRow label="Applicant email" value={application.applicant_email} />
              <DetailRow label="Company name" value={application.company_name} />
              <DetailRow label="Application type" value={application.application_type} />
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-ink-800">Description</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink-700">
                {application.description}
              </p>
            </div>

            {application.reviewer_comment ? (
              <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-800">
                  Reviewer comment
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-orange-700">
                  {application.reviewer_comment}
                </p>
              </div>
            ) : null}
          </Card>

          <Card>
            <div className="space-y-5">
              <DetailRow label="Created at" value={formatDate(application.created_at)} />
              <DetailRow label="Updated at" value={formatDate(application.updated_at)} />
              <DetailRow
                label="Submitted at"
                value={formatDate(application.submitted_at)}
              />
              <DetailRow
                label="Reviewed at"
                value={formatDate(application.reviewed_at)}
              />
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink-800">{label}</p>
      <div className="mt-2 text-sm text-ink-700">{value}</div>
    </div>
  );
}
