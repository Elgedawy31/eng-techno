'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  GetAllAgentsResponse,
  GetAgentResponse,
  CreateAgentPayload,
  CreateAgentResponse,
  UpdateAgentPayload,
  UpdateAgentResponse,
  DeleteAgentResponse,
} from "../types/agent.types";

class AgentService {
  async getAllAgents(
    page: number = 1,
    limit: number = 10,
    brandId?: string,
    signal?: AbortSignal
  ): Promise<GetAllAgentsResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (brandId) {
        params.brandId = brandId;
      }

      const response = await clientAxios.get<GetAllAgentsResponse>("/agents", {
        params,
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAgentById(id: string): Promise<GetAgentResponse> {
    try {
      const response = await clientAxios.get<GetAgentResponse>(`/agents/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createAgent(payload: CreateAgentPayload): Promise<CreateAgentResponse> {
    try {
      const response = await clientAxios.post<CreateAgentResponse>(
        "/agents",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateAgent(
    id: string,
    payload: UpdateAgentPayload
  ): Promise<UpdateAgentResponse> {
    try {
      const response = await clientAxios.put<UpdateAgentResponse>(
        `/agents/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteAgent(id: string): Promise<DeleteAgentResponse> {
    try {
      const response = await clientAxios.delete<DeleteAgentResponse>(
        `/agents/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const agentService = new AgentService();

