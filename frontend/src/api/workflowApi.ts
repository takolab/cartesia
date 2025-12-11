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

// ========== MOCK MODE ==========
// Set to true to use mock data for demo (no backend required)
const USE_MOCK = true;

// Mock workflow storage
interface MockWorkflow {
  id: string;
  query: string;
  createdAt: number;
  status: WorkflowStatus;
  agentId?: string;
}

const mockWorkflows = new Map<string, MockWorkflow>();

// Mock agent ID for demo
const MOCK_AGENT_ID = 'agent_9301kc7b1k14f5wv01kazanwv5hs';

// Simulate workflow processing (transitions from pending -> ready after ~2 seconds)
function simulateWorkflowProcessing(workflowId: string) {
  setTimeout(() => {
    const workflow = mockWorkflows.get(workflowId);
    if (workflow && workflow.status === 'pending') {
      workflow.status = 'ready';
      workflow.agentId = MOCK_AGENT_ID;
      mockWorkflows.set(workflowId, workflow);
    }
  }, 2000); // 2 second delay to simulate processing
}

// Mock implementation
async function mockStartWorkflow(
  payload: StartWorkflowRequest,
): Promise<StartWorkflowResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const workflow: MockWorkflow = {
    id: workflowId,
    query: payload.user_query,
    createdAt: Date.now(),
    status: 'pending',
  };

  mockWorkflows.set(workflowId, workflow);

  // Start simulated processing
  simulateWorkflowProcessing(workflowId);

  console.log('[MOCK] Workflow started:', workflowId, 'Query:', payload.user_query);

  return { workflowId };
}

async function mockGetWorkflowStatus(
  workflowId: string,
): Promise<GetWorkflowStatusResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const workflow = mockWorkflows.get(workflowId);

  if (!workflow) {
    throw new Error('Workflow not found');
  }

  console.log('[MOCK] Workflow status:', workflowId, 'Status:', workflow.status);

  return {
    status: workflow.status,
    eleven_labs_agent_id: workflow.agentId,
  };
}

// ========== PUBLIC API ==========

// POST /api/workflows
export async function startWorkflow(
  payload: StartWorkflowRequest,
): Promise<StartWorkflowResponse> {
  if (USE_MOCK) {
    return mockStartWorkflow(payload);
  }

  const response = await httpClient.post<StartWorkflowResponse>('/api/workflows', payload);
  return response.data;
}

// GET /api/workflows/:id/status
export async function getWorkflowStatus(
  workflowId: string,
): Promise<GetWorkflowStatusResponse> {
  if (USE_MOCK) {
    return mockGetWorkflowStatus(workflowId);
  }

  const response = await httpClient.get<GetWorkflowStatusResponse>(
    `/api/workflows/${workflowId}/status`,
  );
  return response.data;
}
