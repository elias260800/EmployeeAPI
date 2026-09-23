import React, { useRef, useEffect, useCallback } from "react";
import type { Device } from "../types/device.types";
import { useClientInfiniteScroll } from "../hooks/useClientInfiniteScroll";
import { DeviceTableContent } from "./DeviceTableContent";
import { DeviceStateFeedback } from "./DeviceStateFeedback";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Paper,
  LinearProgress,
} from "@mui/material";
import { ArrowDownCircle, CheckCircle2 } from "lucide-react";

interface DeviceInfiniteScrollProps {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onOpenCreate?: () => void;
  onSeedDemo?: () => void;
  onDelete?: (id: string, name: string) => void;
  isSeeding?: boolean;
}

export const DeviceInfiniteScroll: React.FC<DeviceInfiniteScrollProps> = ({
  devices,
  isLoading,
  error,
  onRetry,
  onOpenCreate,
  onSeedDemo,
  onDelete,
  isSeeding = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    visibleItems,
    visibleCount,
    totalItems,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useClientInfiniteScroll(devices, {
    initialBatchSize: 8,
    batchSize: 8,
    simulatedDelayMs: 200,
  });

  // IntersectionObserver detecta cuando el usuario llega al limite inferior
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (
        scrollHeight - scrollTop - clientHeight < 120 &&
        hasMore &&
        !isLoadingMore
      ) {
        loadMore();
      }
    },
    [hasMore, isLoadingMore, loadMore],
  );

  if (isLoading || error || devices.length === 0) {
    return (
      <DeviceStateFeedback
        isLoading={isLoading}
        error={error}
        isEmpty={devices.length === 0}
        onRetry={onRetry}
        onOpenCreate={onOpenCreate}
        onSeedDemo={onSeedDemo}
        isSeeding={isSeeding}
      />
    );
  }

  const progressPercent =
    totalItems > 0 ? (visibleCount / totalItems) * 100 : 100;

  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        mt: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Barra de cabecera del Scroll Infinito */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={`Mostrando ${visibleCount} de ${totalItems} dispositivos`}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="caption" color="text.secondary">
            Carga progresiva continua de filas al hacer scroll
          </Typography>
        </Box>
      </Box>

      {/* Barra de progreso de lectura del dataset */}
      <LinearProgress
        variant="determinate"
        value={progressPercent}
        sx={{ height: 3, bgcolor: "divider" }}
      />

      {/* Contenedor desplazable con scroll infinito */}
      <Box
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{
          maxHeight: 540,
          overflowY: "auto",
          p: 2,
          scrollBehavior: "smooth",
        }}
        data-testid="infinite-scroll-container"
      >
        <DeviceTableContent
          devices={visibleItems}
          onDelete={onDelete}
          ariaLabel="tabla continua con scroll infinito"
        />

        {/* Centinela de scroll e indicadores de estado al final de la lista */}
        <Box
          ref={sentinelRef}
          sx={{
            py: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
          data-testid="infinite-scroll-sentinel"
        >
          {isLoadingMore && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CircularProgress size={20} color="primary" />
              <Typography variant="body2" color="text.secondary">
                Cargando más dispositivos...
              </Typography>
            </Box>
          )}

          {!isLoadingMore && hasMore && (
            <Button
              variant="outlined"
              size="small"
              onClick={loadMore}
              startIcon={<ArrowDownCircle size={16} />}
              sx={{ textTransform: "none", color: "text.secondary" }}
            >
              Cargar más dispositivos ({totalItems - visibleCount} restantes)
            </Button>
          )}

          {!hasMore && totalItems > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
              }}
            >
              <CheckCircle2 size={16} color="#c084fc" />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                Has llegado al final. Mostrando los {totalItems} dispositivos.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
