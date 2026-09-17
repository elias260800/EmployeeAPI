import { apiClient } from "../../../api/client";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },
};
