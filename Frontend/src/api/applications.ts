import { apiClient } from "./client";
import type {
  Application,
  ApplicationPayload,
  ReviewerDecisionPayload,
} from "../types/application";

export async function fetchApplications(): Promise<Application[]> {
  const { data } = await apiClient.get<Application[]>("/applications/");
  return data;
}

export async function fetchApplication(id: string): Promise<Application> {
  const { data } = await apiClient.get<Application>(`/applications/${id}`);
  return data;
}

export async function createApplication(
  payload: ApplicationPayload,
): Promise<Application> {
  const { data } = await apiClient.post<Application>("/applications/", payload);
  return data;
}

export async function updateApplication(
  id: string,
  payload: Partial<ApplicationPayload>,
): Promise<Application> {
  const { data } = await apiClient.patch<Application>(
    `/applications/${id}`,
    payload,
  );
  return data;
}

export async function submitApplication(id: string): Promise<Application> {
  const { data } = await apiClient.post<Application>(
    `/applications/${id}/submit`,
  );
  return data;
}

export async function startReview(id: string): Promise<Application> {
  const { data } = await apiClient.post<Application>(
    `/applications/${id}/start-review`,
  );
  return data;
}

export async function submitDecision(
  id: string,
  payload: ReviewerDecisionPayload,
): Promise<Application> {
  const { data } = await apiClient.post<Application>(
    `/applications/${id}/decision`,
    payload,
  );
  return data;
}
