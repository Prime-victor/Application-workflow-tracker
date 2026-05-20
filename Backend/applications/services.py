from dataclasses import dataclass

from django.db import transaction
from django.utils import timezone

from .models import Application, ApplicationStatus


@dataclass
class WorkflowError(Exception):
    message: str
    status_code: int = 400

    def __str__(self) -> str:
        return self.message


def list_applications():
    return Application.objects.all()


def get_application(application_id: int) -> Application:
    try:
        return Application.objects.get(id=application_id)
    except Application.DoesNotExist as exc:
        raise WorkflowError("Application not found.", status_code=404) from exc


@transaction.atomic
def create_application(payload) -> Application:
    return Application.objects.create(**payload.model_dump())


@transaction.atomic
def update_application(application_id: int, payload) -> Application:
    application = get_application(application_id)
    allowed_statuses = {
        ApplicationStatus.DRAFT,
        ApplicationStatus.NEED_MORE_INFORMATION,
    }
    if application.status not in allowed_statuses:
        raise WorkflowError(
            "Only Draft or Need More Information applications can be edited."
        )

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(application, field, value)

    application.save()
    return application


@transaction.atomic
def submit_application(application_id: int) -> Application:
    application = get_application(application_id)
    allowed_statuses = {
        ApplicationStatus.DRAFT,
        ApplicationStatus.NEED_MORE_INFORMATION,
    }
    if application.status not in allowed_statuses:
        raise WorkflowError("Only Draft or Need More Information applications can be submitted.")

    application.status = ApplicationStatus.SUBMITTED
    application.submitted_at = timezone.now()
    application.save(update_fields=["status", "submitted_at", "updated_at"])
    return application


@transaction.atomic
def start_review(application_id: int) -> Application:
    application = get_application(application_id)
    if application.status != ApplicationStatus.SUBMITTED:
        raise WorkflowError("Only Submitted applications can move to Under Review.")

    application.status = ApplicationStatus.UNDER_REVIEW
    application.save(update_fields=["status", "updated_at"])
    return application


@transaction.atomic
def apply_reviewer_decision(application_id: int, payload) -> Application:
    application = get_application(application_id)
    if application.status != ApplicationStatus.UNDER_REVIEW:
        raise WorkflowError("Reviewer decisions are only allowed from Under Review.")

    allowed_decisions = {
        ApplicationStatus.APPROVED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.NEED_MORE_INFORMATION,
    }
    if payload.decision not in allowed_decisions:
        raise WorkflowError(
            "Decision must be Approved, Rejected, or Need More Information."
        )

    comment = (payload.reviewer_comment or "").strip()
    if payload.decision in {
        ApplicationStatus.REJECTED,
        ApplicationStatus.NEED_MORE_INFORMATION,
    } and not comment:
        raise WorkflowError(
            "Reviewer comment is required for Rejected and Need More Information decisions."
        )

    application.status = payload.decision
    application.reviewer_comment = comment
    application.reviewed_at = timezone.now()
    application.save(update_fields=["status", "reviewer_comment", "reviewed_at", "updated_at"])
    return application
