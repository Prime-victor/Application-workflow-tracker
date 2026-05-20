import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { fetchApplication, submitDecision } from "../api/applications";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { SelectField } from "../components/SelectField";
import { TextareaField } from "../components/TextareaField";
import { useToast } from "../hooks/useToast";
import {
  reviewerDecisions,
  type Application,
  type ReviewerDecision,
} from "../types/application";
import { formatError } from "../utils/format";

export function ReviewerDecisionPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const initialDecision = searchParams.get("decision");
  const safeDecision = reviewerDecisions.includes(
    initialDecision as ReviewerDecision,
  )
    ? (initialDecision as ReviewerDecision)
    : "Approved";

  const [application, setApplication] = useState<Application | null>(null);
  const [decision, setDecision] = useState<ReviewerDecision>(safeDecision);
  const [reviewerComment, setReviewerComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    const applicationId = id;

    async function loadApplication() {
      try {
        setIsLoading(true);
        setError(null);
        setApplication(await fetchApplication(applicationId));
      } catch (err) {
        setError(formatError(err));
      } finally {
        setIsLoading(false);
      }
    }

    void loadApplication();
  }, [id]);

  const commentRequired =
    decision === "Rejected" || decision === "Need More Information";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedComment = reviewerComment.trim();
    if (commentRequired && !trimmedComment) {
      setCommentError("A reviewer comment is required for this decision.");
      return;
    }

    if (!id) {
      return;
    }

    try {
      setIsSaving(true);
      setCommentError(null);
      await submitDecision(id, {
        decision,
        reviewer_comment: trimmedComment || undefined,
      });
      showToast("Reviewer decision recorded successfully.");
      navigate(`/applications/${id}`);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Review Decision"
        title={application ? `Decision for ${application.tracking_number}` : "Decision"}
        description="Approve the application or send it back with clear guidance if more information is required."
        actions={
          id ? (
            <Link to={`/applications/${id}`}>
              <Button variant="secondary">Back to detail</Button>
            </Link>
          ) : undefined
        }
      />

      {isLoading ? <LoadingState message="Loading review form..." /> : null}
      {!isLoading && error ? <ErrorState message={error} /> : null}

      {!isLoading && application ? (
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <SelectField
              label="Decision"
              value={decision}
              onChange={(event) => {
                setDecision(event.target.value as ReviewerDecision);
                setCommentError(null);
              }}
            >
              {reviewerDecisions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectField>

            <TextareaField
              label="Reviewer comment"
              value={reviewerComment}
              onChange={(event) => {
                setReviewerComment(event.target.value);
                setCommentError(null);
              }}
              error={commentError ?? undefined}
              placeholder={
                commentRequired
                  ? "Explain why the application was rejected or what more information is needed."
                  : "Optional comment for the decision."
              }
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link to={`/applications/${application.id}`}>
                <Button type="button" variant="secondary" fullWidth>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSaving} fullWidth>
                {isSaving ? "Saving..." : "Save decision"}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
