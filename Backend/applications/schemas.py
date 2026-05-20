from datetime import datetime

from ninja import ModelSchema, Schema
from pydantic import EmailStr, Field

from .models import Application, ApplicationStatus, ApplicationType


class ApplicationBaseSchema(Schema):
    applicant_name: str = Field(..., min_length=2, max_length=255)
    applicant_email: EmailStr
    company_name: str = Field(..., min_length=2, max_length=255)
    application_type: ApplicationType
    description: str = Field(..., min_length=10)


class ApplicationCreateSchema(ApplicationBaseSchema):
    pass


class ApplicationUpdateSchema(Schema):
    applicant_name: str | None = Field(default=None, min_length=2, max_length=255)
    applicant_email: EmailStr | None = None
    company_name: str | None = Field(default=None, min_length=2, max_length=255)
    application_type: ApplicationType | None = None
    description: str | None = Field(default=None, min_length=10)


class ApplicationOutSchema(ModelSchema):
    created_at: datetime
    updated_at: datetime
    submitted_at: datetime | None
    reviewed_at: datetime | None

    class Meta:
        model = Application
        fields = [
            "id",
            "tracking_number",
            "applicant_name",
            "applicant_email",
            "company_name",
            "application_type",
            "description",
            "status",
            "reviewer_comment",
            "created_at",
            "updated_at",
            "submitted_at",
            "reviewed_at",
        ]


class ReviewerDecisionSchema(Schema):
    decision: ApplicationStatus
    reviewer_comment: str | None = Field(default=None, max_length=2000)
