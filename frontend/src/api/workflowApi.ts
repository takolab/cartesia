// src/api/workflowApi.ts
import httpClient from './httpClient';

export interface StartWorkflowRequest {
  user_query: string;
}

export interface StartWorkflowResponse {
  workflowId: string;
}

export type WorkflowStatus = 'pending' | 'ready' | 'failed';

export interface GetWorkflowStatusResponse {
  status: WorkflowStatus;
  eleven_labs_agent_id?: string;
}

// POST /api/workflows
export async function startWorkflow(
  payload: StartWorkflowRequest,
): Promise<StartWorkflowResponse> {
  const response = await httpClient.post<StartWorkflowResponse>('/api/workflows', payload);
  return response.data;
}

// GET /api/workflows/:id/status
export async function getWorkflowStatus(
  workflowId: string,
): Promise<GetWorkflowStatusResponse> {
  const response = await httpClient.get<GetWorkflowStatusResponse>(
    `/api/workflows/${workflowId}/status`,
  );
  return response.data;
}
