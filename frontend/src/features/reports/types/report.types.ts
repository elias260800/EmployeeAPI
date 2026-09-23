export const ReportStatus = {
  Processing: "Processing",
  Completed: "Completed",
} as const;

export type ReportStatus =
  (typeof ReportStatus)[keyof typeof ReportStatus];

export const ReportStatusCode = {
  Processing: 0,
  Completed: 1,
} as const;

export type ReportStatusCode =
  (typeof ReportStatusCode)[keyof typeof ReportStatusCode];

export type ReportStatusType = ReportStatus | ReportStatusCode;

export interface ReportResult {
  totalEmployees: number;
  departments: number;
}

export interface ReportJob {
  id: string;
  status: ReportStatusType;
  createdAt: string;
  completedAt: string | null;
  result: ReportResult | null;
}

export interface ReportGenerationResponse {
  executionId: string;
}

export const ReportUIStatus = {
  Idle: "idle",
  Generating: "generating",
  Polling: "polling",
  Completed: "completed",
  Error: "error",
  Timeout: "timeout",
  Cancelled: "cancelled",
} as const;

export type ReportUIStatus =
  (typeof ReportUIStatus)[keyof typeof ReportUIStatus];

export function isReportCompleted(status: ReportStatusType): boolean {
  return (
    status === ReportStatus.Completed ||
    status === ReportStatusCode.Completed
  );
}

export function isReportProcessing(status: ReportStatusType): boolean {
  return (
    status === ReportStatus.Processing ||
    status === ReportStatusCode.Processing
  );
}
