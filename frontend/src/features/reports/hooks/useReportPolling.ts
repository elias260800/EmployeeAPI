import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { reportApi } from "../api/reportApi";
import {
  isReportCompleted,
  type ReportJob,
  ReportUIStatus,
} from "../types/report.types";

interface UseReportPollingOptions {
  pollingIntervalMs?: number;
  maxAttempts?: number;
}

interface UseReportPollingReturn {
  status: ReportUIStatus;
  report: ReportJob | null;
  errorMsg: string | null;
  attempts: number;
  startGeneration: () => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

const DEFAULT_POLLING_INTERVAL = 2000;
const DEFAULT_MAX_ATTEMPTS = 25; // 25 * 2s = ~50s

export function useReportPolling(
  options: UseReportPollingOptions = {},
): UseReportPollingReturn {
  const {
    pollingIntervalMs = DEFAULT_POLLING_INTERVAL,
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
  } = options;

  const [status, setStatus] = useState<ReportUIStatus>(ReportUIStatus.Idle);
  const [report, setReport] = useState<ReportJob | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const pollStatusRef = useRef<
    ((id: string, attempt: number) => Promise<void>) | null
  >(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const abortInFlight = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    clearTimer();
    abortInFlight();
    if (isMountedRef.current) {
      setStatus(ReportUIStatus.Cancelled);
      setErrorMsg(null);
    }
  }, [clearTimer, abortInFlight]);

  const reset = useCallback(() => {
    clearTimer();
    abortInFlight();
    if (isMountedRef.current) {
      setReport(null);
      setAttempts(0);
      setStatus(ReportUIStatus.Idle);
      setErrorMsg(null);
    }
  }, [clearTimer, abortInFlight]);

  const pollStatus = useCallback(
    async (executionId: string, currentAttempt: number) => {
      if (!isMountedRef.current) return;

      if (currentAttempt > maxAttempts) {
        setStatus(ReportUIStatus.Timeout);
        setErrorMsg(
          "El reporte excedió el tiempo máximo de espera. Por favor, reintenta.",
        );
        return;
      }

      setAttempts(currentAttempt);

      abortInFlight();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const job = await reportApi.getReportStatus(
          executionId,
          controller.signal,
        );

        if (!isMountedRef.current) return;

        if (isReportCompleted(job.status)) {
          setReport(job);
          setStatus(ReportUIStatus.Completed);
          setErrorMsg(null);
          return;
        }

        setStatus(ReportUIStatus.Polling);
        timerRef.current = setTimeout(() => {
          pollStatusRef.current?.(executionId, currentAttempt + 1);
        }, pollingIntervalMs);
      } catch (err: unknown) {
        if (!isMountedRef.current) return;

        if (axios.isCancel(err)) {
          return;
        }

        setStatus(ReportUIStatus.Error);
        setErrorMsg("Error al consultar el estado del reporte.");
      }
    },
    [maxAttempts, pollingIntervalMs, abortInFlight],
  );

  useEffect(() => {
    pollStatusRef.current = pollStatus;
  }, [pollStatus]);

  const startGeneration = useCallback(async () => {
    clearTimer();
    abortInFlight();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus(ReportUIStatus.Generating);
    setErrorMsg(null);
    setReport(null);
    setAttempts(0);

    try {
      const response = await reportApi.generateReport(controller.signal);

      if (!isMountedRef.current) return;

      setStatus(ReportUIStatus.Polling);
      timerRef.current = setTimeout(() => {
        pollStatusRef.current?.(response.executionId, 1);
      }, pollingIntervalMs);
    } catch (err: unknown) {
      if (!isMountedRef.current) return;

      if (axios.isCancel(err)) {
        return;
      }

      setStatus(ReportUIStatus.Error);
      setErrorMsg("No se pudo iniciar la generación del reporte.");
    }
  }, [clearTimer, abortInFlight, pollingIntervalMs]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearTimer();
      abortInFlight();
    };
  }, [clearTimer, abortInFlight]);

  return {
    status,
    report,
    errorMsg,
    attempts,
    startGeneration,
    cancel,
    reset,
  };
}
