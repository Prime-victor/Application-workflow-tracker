from django.db import models

from .utils import generate_tracking_number


class ApplicationType(models.TextChoices):
    RECORDATION = "Recordation", "Recordation"
    RENEWAL = "Renewal", "Renewal"
    CHANGE_OF_OWNERSHIP = "Change of Ownership", "Change of Ownership"
    CHANGE_OF_NAME = "Change of Name", "Change of Name"
    DISCONTINUATION = "Discontinuation", "Discontinuation"


class ApplicationStatus(models.TextChoices):
    DRAFT = "Draft", "Draft"
    SUBMITTED = "Submitted", "Submitted"
    UNDER_REVIEW = "Under Review", "Under Review"
    NEED_MORE_INFORMATION = "Need More Information", "Need More Information"
    APPROVED = "Approved", "Approved"
    REJECTED = "Rejected", "Rejected"


class Application(models.Model):
    tracking_number = models.CharField(max_length=20, unique=True, editable=False)
    applicant_name = models.CharField(max_length=255)
    applicant_email = models.EmailField()
    company_name = models.CharField(max_length=255)
    application_type = models.CharField(max_length=40, choices=ApplicationType.choices)
    description = models.TextField()
    status = models.CharField(
        max_length=24,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.DRAFT,
    )
    reviewer_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = generate_tracking_number(Application)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.tracking_number} - {self.applicant_name}"
