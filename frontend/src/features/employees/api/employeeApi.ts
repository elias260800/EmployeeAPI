import { apiClient } from "../../../api/client";
import type {
  Employee,
  Department,
  Position,
  EmployeeFilterParams,
} from "../types/employee.types";

export const employeeApi = {
  getEmployees: async (filters?: EmployeeFilterParams): Promise<Employee[]> => {
    const params: Record<string, string> = {};

    if (filters?.departmentName) {
      params.departmentName = filters.departmentName;
    }
    if (filters?.positionName) {
      params.positionName = filters.positionName;
    }

    const response = await apiClient.get<Employee[]>("/employee", { params });
    return response.data;
  },

  getDepartments: async (): Promise<Department[]> => {
    const response = await apiClient.get<Department[]>("/employee/departments");
    return response.data;
  },

  getPositionsByDepartment: async (
    departmentId: string,
  ): Promise<Position[]> => {
    const response = await apiClient.get<Position[]>(
      `/employee/departments/${departmentId}/positions`,
    );
    return response.data;
  },
};
