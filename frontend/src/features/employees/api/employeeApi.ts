import { apiClient } from "../../../api/client";
import type { Employee } from "../types/employee.types";

export const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await apiClient.get<Employee[]>("/employee");
    return response.data;
  },
};
