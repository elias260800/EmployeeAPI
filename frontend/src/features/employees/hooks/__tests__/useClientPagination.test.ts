import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useClientPagination } from "../useClientPagination";
import type { Employee } from "../../types/employee.types";

const createMockEmployees = (count: number): Employee[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `emp-${i + 1}`,
    name: `Empleado ${i + 1}`,
    email: `emp${i + 1}@mail.com`,
    department: `Dept ${(i % 5) + 1}`,
    position: `Cargo ${(i % 3) + 1}`,
  }));
};

describe("useClientPagination", () => {
  it("particiona 2000 elementos en memoria correctamente en la primera página", () => {
    const mockEmployees = createMockEmployees(2000);
    const { result } = renderHook(() => useClientPagination(mockEmployees));

    expect(result.current.totalItems).toBe(2000);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.totalPages).toBe(100);
    expect(result.current.startItem).toBe(1);
    expect(result.current.endItem).toBe(20);
    expect(result.current.paginatedItems).toHaveLength(20);
    expect(result.current.paginatedItems[0].name).toBe("Empleado 1");
    expect(result.current.paginatedItems[19].name).toBe("Empleado 20");
  });

  it("permite navegar entre páginas y recalcula los índices de los elementos", () => {
    const mockEmployees = createMockEmployees(100);
    const { result } = renderHook(() => useClientPagination(mockEmployees));

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.startItem).toBe(21);
    expect(result.current.endItem).toBe(40);
    expect(result.current.paginatedItems[0].name).toBe("Empleado 21");
    expect(result.current.paginatedItems[19].name).toBe("Empleado 40");
  });

  it("protege contra límites inválidos (menores a 1 o mayores al total de páginas)", () => {
    const mockEmployees = createMockEmployees(50);
    const { result } = renderHook(() => useClientPagination(mockEmployees));

    act(() => {
      result.current.setPage(0);
    });
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.setPage(999);
    });
    expect(result.current.currentPage).toBe(3); // 50 items / 20 por página = 3 páginas
  });

  it("permite cambiar el tamaño de página y recalcula el total de páginas", () => {
    const mockEmployees = createMockEmployees(100);
    const { result } = renderHook(() => useClientPagination(mockEmployees));

    act(() => {
      result.current.setPageSize(50);
    });

    expect(result.current.pageSize).toBe(50);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.paginatedItems).toHaveLength(50);
  });

  it("reinicia a la página 1 cuando la lista de empleados cambia (por filtros)", () => {
    let mockEmployees = createMockEmployees(100);
    const { result, rerender } = renderHook(
      ({ employees }) => useClientPagination(employees),
      { initialProps: { employees: mockEmployees } },
    );

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.currentPage).toBe(3);

    // Simular aplicación de filtro que reduce la lista a 10 empleados
    mockEmployees = createMockEmployees(10);
    rerender({ employees: mockEmployees });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalItems).toBe(10);
    expect(result.current.totalPages).toBe(1);
  });
});
