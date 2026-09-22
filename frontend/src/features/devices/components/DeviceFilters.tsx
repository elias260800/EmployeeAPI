import React from "react";
import type { DeviceFilterParams } from "../types/device.types";
import {
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

interface DeviceFiltersProps {
  filters: DeviceFilterParams;
  onFilterChange: (filters: DeviceFilterParams) => void;
  onReset: () => void;
  onOpenCreate: () => void;
  availableLocations: string[];
  disabled?: boolean;
}

export const DeviceFilters: React.FC<DeviceFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onOpenCreate,
  availableLocations,
  disabled = false,
}) => {
  const hasActiveFilters = Boolean(filters.search || filters.location);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <TextField

          size="small"
          label="Buscar dispositivo"
          placeholder="Nombre o ubicación..."
          value={filters.search || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          disabled={disabled}
          sx={{ minWidth: 220 }}
        />

        {availableLocations.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="location-filter-label">Ubicación</InputLabel>
            <Select
              labelId="location-filter-label"
              label="Ubicación"
              value={filters.location || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, location: e.target.value })
              }
              disabled={disabled}
            >
              <MenuItem value="">
                <em>Todas las ubicaciones</em>
              </MenuItem>
              {availableLocations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {hasActiveFilters && (
          <Button
            variant="text"
            color="secondary"
            size="small"
            onClick={onReset}
            disabled={disabled}
            sx={{ textTransform: "none" }}
          >
            Limpiar filtros
          </Button>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={onOpenCreate}
        disabled={disabled}
        sx={{ textTransform: "none", fontWeight: 600 }}
      >
        + Nuevo Dispositivo
      </Button>
    </Paper>
  );
};
