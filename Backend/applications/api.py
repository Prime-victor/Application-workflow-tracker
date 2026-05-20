from ninja import NinjaAPI
from ninja.errors import HttpError

from .schemas import (
    ApplicationCreateSchema,
    ApplicationOutSchema,
    ApplicationUpdateSchema,
    ReviewerDecisionSchema,
)
from .services import (
    WorkflowError,
    apply_reviewer_decision,
    create_application,
    get_application,
    list_applications,
    start_review,
    submit_application,
    update_application,
)


api = NinjaAPI(title="Mini Application Workflow Tracker API")


def _handle_service_error(error: WorkflowError):
    raise HttpError(error.status_code, error.message)


@api.post("/applications/", response=ApplicationOutSchema)
def create_application_endpoint(request, payload: ApplicationCreateSchema):
    try:
        return create_application(payload)
    except WorkflowError as error:
        _handle_service_error(error)


@api.get("/applications/", response=list[ApplicationOutSchema])
def list_applications_endpoint(request):
    return list_applications()


@api.get("/applications/{application_id}", response=ApplicationOutSchema)
def get_application_endpoint(request, application_id: int):
    try:
        return get_application(application_id)
    except WorkflowError as error:
        _handle_service_error(error)


@api.patch("/applications/{application_id}", response=ApplicationOutSchema)
def update_application_endpoint(
    request, application_id: int, payload: ApplicationUpdateSchema
):
    try:
        return update_application(application_id, payload)
    except WorkflowError as error:
        _handle_service_error(error)


@api.post("/applications/{application_id}/submit", response=ApplicationOutSchema)
def submit_application_endpoint(request, application_id: int):
    try:
        return submit_application(application_id)
    except WorkflowError as error:
        _handle_service_error(error)


@api.post("/applications/{application_id}/start-review", response=ApplicationOutSchema)
def start_review_endpoint(request, application_id: int):
    try:
        return start_review(application_id)
    except WorkflowError as error:
        _handle_service_error(error)


@api.post("/applications/{application_id}/decision", response=ApplicationOutSchema)
def reviewer_decision_endpoint(
    request, application_id: int, payload: ReviewerDecisionSchema
):
    try:
        return apply_reviewer_decision(application_id, payload)
    except WorkflowError as error:
        _handle_service_error(error)
