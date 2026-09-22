import React, { useState } from "react";
import type { CreateDeviceRequest } from "../types/device.types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Box,
  IconButton,
} from "@mui/material";

interface CreateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDeviceRequest) => Promise<void>;
}

export const CreateDeviceModal: React.FC<CreateDeviceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("America/Santiago");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !timezone.trim()) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onSubmit({
        name: name.trim(),
        location: location.trim(),
        timezone: timezone.trim(),
      });
      setName("");
      setLocation("");
      setTimezone("America/Santiago");
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al registrar el dispositivo";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-device-dialog-title"
    >
      <DialogTitle
        id="create-device-dialog-title"
        sx={{
          m: 0,
          p: 2,
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Registrar Dispositivo / Terminal
        <IconButton
          aria-label="Cerrar modal"
          onClick={onClose}
          disabled={isSubmitting}
          size="small"
        >
          x
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 0.5 }}
          >
            <TextField
              required
              fullWidth
              label="Nombre del Dispositivo / Terminal"
              placeholder="Ej: Terminal Reloj Biométrico Principal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              slotProps={{
                htmlInput: { minLength: 2, maxLength: 100 },
              }}
            />

            <TextField
              required
              fullWidth
              label="Ubicación"
              placeholder="Ej: Santiago Centro, Piso 1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSubmitting}
              slotProps={{
                htmlInput: { maxLength: 150 },
              }}
            />

            <FormControl fullWidth required>
              <InputLabel id="device-timezone-label">
                Zona Horaria (IANA)
              </InputLabel>
              <Select
                labelId="device-timezone-label"
                label="Zona Horaria (IANA)"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="America/Santiago" style={{ display: "none" }} />
                <MenuItem value="America/Santiago">
                  America/Santiago (Chile)
                </MenuItem>
                <MenuItem value="America/Argentina/Buenos_Aires">
                  America/Argentina/Buenos_Aires
                </MenuItem>
                <MenuItem value="America/Lima">America/Lima (Perú)</MenuItem>
                <MenuItem value="America/Bogota">
                  America/Bogota (Colombia)
                </MenuItem>
                <MenuItem value="America/Mexico_City">
                  America/Mexico_City (México)
                </MenuItem>
                <MenuItem value="UTC">UTC</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {isSubmitting ? "Guardando..." : "Guardar Dispositivo"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
