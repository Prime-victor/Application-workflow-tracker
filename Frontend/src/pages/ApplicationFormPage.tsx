import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createApplication,
  fetchApplication,
  updateApplication,
} from "../api/applications";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ErrorState } from "../components/ErrorState";
import { FormField } from "../components/FormField";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { SelectField } from "../components/SelectField";
import { TextareaField } from "../components/TextareaField";
import { useToast } from "../hooks/useToast";
import {
  applicationTypes,
  type ApplicationPayload,
  type ApplicationType,
} from "../types/application";
import { formatError } from "../utils/format";

type FormErrors = Partial<Record<keyof ApplicationPayload, string>>;

const initialForm: ApplicationPayload = {
  applicant_name: "",
  applicant_email: "",
  company_name: "",
  application_type: "Recordation",
  description: "",
};

export function ApplicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<ApplicationPayload>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [pageError, setPageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing || !id) {
      return;
    }
    const applicationId = id;

    async function loadApplication() {
      try {
        setIsLoading(true);
        setPageError(null);
        const data = await fetchApplication(applicationId);
        setForm({
          applicant_name: data.applicant_name,
          applicant_email: data.applicant_email,
          company_name: data.company_name,
          application_type: data.application_type,
          description: data.description,
        });
      } catch (err) {
        setPageError(formatError(err));
      } finally {
        setIsLoading(false);
      }
    }

    void loadApplication();
  }, [id, isEditing]);

  function setField<K extends keyof ApplicationPayload>(
    field: K,
    value: ApplicationPayload[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (form.applicant_name.trim().length < 2) {
      nextErrors.applicant_name = "Applicant name must be at least 2 characters.";
    }
    if (!/\S+@\S+\.\S+/.test(form.applicant_email)) {
      nextErrors.applicant_email = "Enter a valid email address.";
    }
    if (form.company_name.trim().length < 2) {
      nextErrors.company_name = "Company name must be at least 2 characters.";
    }
    if (form.description.trim().length < 10) {
      nextErrors.description = "Description must be at least 10 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSaving(true);
      setPageError(null);
      const payload = {
        ...form,
        applicant_name: form.applicant_name.trim(),
        applicant_email: form.applicant_email.trim(),
        company_name: form.company_name.trim(),
        description: form.description.trim(),
      };

      const result = isEditing && id
        ? await updateApplication(id, payload)
        : await createApplication(payload);

      showToast(
        isEditing ? "Application updated successfully." : "Draft created successfully.",
      );
      navigate(`/applications/${result.id}`);
    } catch (err) {
      setPageError(formatError(err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={isEditing ? "Edit Draft" : "Create Draft"}
        title={isEditing ? "Update application details" : "Create a new application"}
        description="Fill in the application details below. Drafts can be updated until they are submitted for review."
        actions={
          <Link to="/">
            <Button variant="secondary">Back to list</Button>
          </Link>
        }
      />

      {isLoading ? <LoadingState message="Loading application..." /> : null}
      {!isLoading && pageError ? <ErrorState message={pageError} /> : null}

      {!isLoading && !(isEditing && pageError) ? (
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                label="Applicant name"
                value={form.applicant_name}
                onChange={(event) => setField("applicant_name", event.target.value)}
                error={errors.applicant_name}
                placeholder="Jane Doe"
              />
              <FormField
                label="Applicant email"
                type="email"
                value={form.applicant_email}
                onChange={(event) => setField("applicant_email", event.target.value)}
                error={errors.applicant_email}
                placeholder="jane@company.com"
              />
              <FormField
                label="Company name"
                value={form.company_name}
                onChange={(event) => setField("company_name", event.target.value)}
                error={errors.company_name}
                placeholder="Acme Limited"
              />
              <SelectField
                label="Application type"
                value={form.application_type}
                onChange={(event) =>
                  setField("application_type", event.target.value as ApplicationType)
                }
              >
                {applicationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </SelectField>
            </div>

            <TextareaField
              label="Description"
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
              error={errors.description}
              placeholder="Describe the application request and any context needed for review."
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link to={isEditing && id ? `/applications/${id}` : "/"}>
                <Button type="button" variant="secondary" fullWidth>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSaving} fullWidth>
                {isSaving
                  ? "Saving..."
                  : isEditing
                    ? "Save changes"
                    : "Create draft"}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
