import type {
  ApiResponse,
  PaginatedData,
  Pagination,
} from "@/types/api.types";

export interface Agent {
  _id: string;
  name: string;
  brandId: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AgentsData extends PaginatedData<Agent> {
  agents: Agent[];
}

export type GetAllAgentsResponse = ApiResponse<AgentsData, true>;

export interface CreateAgentPayload {
  name: string;
  brandId: string;
}

export interface UpdateAgentPayload {
  name?: string;
  brandId?: string;
}

export interface CreateAgentData {
  agent: Agent;
}

export interface UpdateAgentData {
  agent: Agent;
}

export interface GetAgentData {
  agent: Agent;
}

export type CreateAgentResponse = ApiResponse<CreateAgentData>;
export type UpdateAgentResponse = ApiResponse<UpdateAgentData>;
export type DeleteAgentResponse = ApiResponse<null>;
export type GetAgentResponse = ApiResponse<GetAgentData>;

// Re-export Pagination type for convenience
export type { Pagination };

