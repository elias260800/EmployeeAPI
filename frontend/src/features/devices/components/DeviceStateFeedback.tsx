import React from "react";
import {
  Paper,
  Box,
  CircularProgress,
  Typography,
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
} from "@mui/material";

export interface DeviceStateFeedbackProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry?: () => void;
  onOpenCreate?: () => void;
  onSeedDemo?: () => void;
  isSeeding?: boolean;
}

export const DeviceStateFeedback: React.FC<DeviceStateFeedbackProps> = ({
  isLoading,
  error,
  isEmpty,
  onRetry,
  onOpenCreate,
  onSeedDemo,
  isSeeding = false,
}) => {
  if (isLoading) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: "center", my: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <CircularProgress size={36} color="primary" />

          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Cargando dispositivos...
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Consultando registros...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ my: 2 }}
        action={
          onRetry && (
            <Button
              color="error"
              size="small"
              variant="outlined"
              onClick={onRetry}
            >
              Reintentar conexión
            </Button>
          )
        }
      >
        <AlertTitle>Error al cargar dispositivos</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Card
        variant="outlined"
        sx={{
          my: 2,
          textAlign: "center",
          p: 3,
          borderStyle: "dashed",
          bgcolor: "action.hover",
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            📟
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            No hay dispositivos registrados en la base de datos
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 540, mx: "auto", mb: 3 }}
          >
            La colección inicia vacía. Es necesario registrar dispositivos
            manualmente o poblarla con datos de prueba.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {onOpenCreate && (
              <Button
                variant="contained"
                color="primary"
                onClick={onOpenCreate}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                + Registrar dispositivo
              </Button>
            )}
            {onSeedDemo && (
              <Button
                variant="outlined"
                color="inherit"
                disabled={isSeeding}
                onClick={onSeedDemo}
                sx={{ textTransform: "none" }}
              >
                {isSeeding
                  ? "Poblando 200 dispositivos..."
                  : "Cargar 200 dispositivos demo"}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return null;
};
