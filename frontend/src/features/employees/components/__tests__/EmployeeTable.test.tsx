import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmployeeTable } from "../EmployeeTable";
import type { Employee } from "../../types/employee.types";

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Ana García",
    email: "ana@mail.com",
    department: "Tecnología",
    position: "Software Engineer",
  },
  {
    id: "2",
    name: "Carlos López",
    email: "carlos@mail.com",
    department: "Diseño",
    position: "UX Designer",
  },
];

describe("EmployeeTable", () => {
  it("renderiza el estado de carga explícito cuando isLoading es true", () => {
    render(<EmployeeTable employees={[]} isLoading={true} error={null} />);

    expect(screen.getByText("Cargando empleados...")).toBeInTheDocument();
  });

  it("renderiza el estado de error y ejecuta el callback de reintento al hacer clic", () => {
    const handleRetry = vi.fn();
    render(
      <EmployeeTable
        employees={[]}
        isLoading={false}
        error="Error al conectar con el servidor"
        onRetry={handleRetry}
      />,
    );

    expect(
      screen.getByText("Error al conectar con el servidor"),
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /reintentar/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("renderiza el estado vacío explícito cuando no hay empleados", () => {
    render(<EmployeeTable employees={[]} isLoading={false} error={null} />);

    expect(
      screen.getByText("No se encontraron empleados."),
    ).toBeInTheDocument();
  });

  it("renderiza las columnas de la tabla y los datos de los empleados correctamente", () => {
    render(
      <EmployeeTable
        employees={mockEmployees}
        isLoading={false}
        error={null}
      />,
    );

    // Columnas requeridas
    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Departamento")).toBeInTheDocument();
    expect(screen.getByText("Cargo")).toBeInTheDocument();

    // Filas renderizadas
    expect(screen.getByText("Ana García")).toBeInTheDocument();
    expect(screen.getByText("ana@mail.com")).toBeInTheDocument();
    expect(screen.getByText("Tecnología")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();

    expect(screen.getByText("Carlos López")).toBeInTheDocument();
    expect(screen.getByText("carlos@mail.com")).toBeInTheDocument();
  });
});
