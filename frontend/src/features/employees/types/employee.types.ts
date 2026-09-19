export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  dni?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
  departmentId: string;
}

export interface EmployeeFilterParams {
  departmentName?: string;
  positionName?: string;
}
