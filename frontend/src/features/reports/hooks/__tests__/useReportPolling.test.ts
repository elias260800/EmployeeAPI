import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReportPolling } from "../useReportPolling";
import { reportApi } from "../../api/reportApi";
import { ReportUIStatus } from "../../types/report.types";

vi.mock("../../api/reportApi", () => ({
  reportApi: {
    generateReport: vi.fn(),
    getReportStatus: vi.fn(),
  },
}));

describe("useReportPolling", () => {
  it("inicia en estado Idle", () => {
    const { result } = renderHook(() => useReportPolling());
    expect(result.current.status).toBe(ReportUIStatus.Idle);
    expect(result.current.report).toBeNull();
  });

  it("cambia a estado Cancelled cuando se llama a cancel()", async () => {
    vi.mocked(reportApi.generateReport).mockImplementation(
      () => new Promise(() => {}),
    );

    const { result } = renderHook(() => useReportPolling());

    act(() => {
      void result.current.startGeneration();
    });

    expect(result.current.status).toBe(ReportUIStatus.Generating);

    act(() => {
      result.current.cancel();
    });

    expect(result.current.status).toBe(ReportUIStatus.Cancelled);
  });

  it("vuelve a Idle cuando se llama a reset()", () => {
    const { result } = renderHook(() => useReportPolling());

    act(() => {
      result.current.cancel();
    });

    expect(result.current.status).toBe(ReportUIStatus.Cancelled);

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe(ReportUIStatus.Idle);
  });
});
