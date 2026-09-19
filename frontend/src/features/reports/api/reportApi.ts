import { apiClient } from "../../../api/client";
import type {
  ReportGenerationResponse,
  ReportJob,
} from "../types/report.types";

export const reportApi = {
  generateReport: async (
    signal?: AbortSignal,
  ): Promise<ReportGenerationResponse> => {
    const response = await apiClient.post<ReportGenerationResponse>(
      "/report/generate",
      {},
      { signal },
    );
    return response.data;
  },

  getReportStatus: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<ReportJob> => {
    const response = await apiClient.get<ReportJob>(`/report/${id}/status`, {
      signal,
    });
    return response.data;
  },
};
