export const applicationTypes = [
  "Recordation",
  "Renewal",
  "Change of Ownership",
  "Change of Name",
  "Discontinuation",
] as const;

export const applicationStatuses = [
  "Draft",
  "Submitted",
  "Under Review",
  "Need More Information",
  "Approved",
  "Rejected",
] as const;

export const reviewerDecisions = [
  "Approved",
  "Rejected",
  "Need More Information",
] as const;

export type ApplicationType = (typeof applicationTypes)[number];
export type ApplicationStatus = (typeof applicationStatuses)[number];
export type ReviewerDecision = (typeof reviewerDecisions)[number];

export interface Application {
  id: number;
  tracking_number: string;
  applicant_name: string;
  applicant_email: string;
  company_name: string;
  application_type: ApplicationType;
  description: string;
  status: ApplicationStatus;
  reviewer_comment: string;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
}

export interface ApplicationPayload {
  applicant_name: string;
  applicant_email: string;
  company_name: string;
  application_type: ApplicationType;
  description: string;
}

export interface ReviewerDecisionPayload {
  decision: ReviewerDecision;
  reviewer_comment?: string;
}
