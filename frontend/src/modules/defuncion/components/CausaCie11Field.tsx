import { useController, useFormContext, type FieldPath } from 'react-hook-form'
import { Autocomplete, Box, Chip, CircularProgress, TextField, Typography } from '@mui/material'
import { useIcdSearch, ICD_MIN_CARACTERES } from '@/shared/hooks/useIcdSearch'
import type { IcdResultadoDTO } from '@/shared/api/icd.api'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

interface CausaCie11FieldProps {
  /** Campo con el texto de la causa (ej. causaIa) */
  fieldCausa: FieldPath<DefuncionFormValues>
  /** Campo con el código CIE-11 de la causa (ej. causaIaCie11) */
  fieldCodigo: FieldPath<DefuncionFormValues>
  placeholder?: string
  sx?: object
}

/**
 * Campo de causa de defunción con búsqueda en la CIE-11.
 *
 * - Al escribir (mín. 3 caracteres) sugiere entidades de la CIE-11.
 * - Al seleccionar una, guarda el título en `fieldCausa` y el código (ej. BA41.Z) en `fieldCodigo`.
 * - Se permite texto libre; si el usuario edita el texto después de seleccionar,
 *   el código se borra porque ya no corresponde a lo escrito.
 */
export default function CausaCie11Field({ fieldCausa, fieldCodigo, placeholder, sx }: CausaCie11FieldProps) {
  const { control } = useFormContext<DefuncionFormValues>()
  const { field: causa, fieldState } = useController({ name: fieldCausa, control })
  const { field: codigo } = useController({ name: fieldCodigo, control })

  const texto = (causa.value as string | null | undefined) ?? ''
  const codigoActual = (codigo.value as string | null | undefined) || null

  const { resultados, cargando, error } = useIcdSearch(codigoActual ? '' : texto)

  // Valor seleccionado reconstruido desde el formulario (sirve también al editar un informe guardado)
  const seleccionado: IcdResultadoDTO | null = codigoActual
    ? { codigo: codigoActual, titulo: texto, uri: null }
    : null

  const sinResultadosTexto = texto.trim().length < ICD_MIN_CARACTERES
    ? `Escriba al menos ${ICD_MIN_CARACTERES} caracteres para buscar en la CIE-11`
    : error
      ? 'No se pudo consultar la CIE-11 — puede escribir la causa manualmente'
      : 'Sin coincidencias en la CIE-11'

  return (
    <Autocomplete<IcdResultadoDTO, false, false, true>
      freeSolo
      options={resultados}
      value={seleccionado}
      inputValue={texto}
      loading={cargando}
      filterOptions={(x) => x}
      getOptionLabel={(o) => (typeof o === 'string' ? o : o.titulo)}
      isOptionEqualToValue={(a, b) => a.codigo === b.codigo}
      noOptionsText={sinResultadosTexto}
      loadingText="Buscando en la CIE-11..."
      onInputChange={(_, value, reason) => {
        if (reason === 'input') {
          causa.onChange(value)
          if (codigoActual) codigo.onChange(null)
        } else if (reason === 'clear') {
          causa.onChange('')
          codigo.onChange(null)
        }
      }}
      onChange={(_, opcion) => {
        if (opcion && typeof opcion !== 'string') {
          causa.onChange(opcion.titulo)
          codigo.onChange(opcion.codigo)
        }
      }}
      onBlur={causa.onBlur}
      renderOption={(props, o) => (
        <Box component="li" {...props} key={o.codigo} sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
          <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ minWidth: 64, fontFamily: 'monospace' }}>
            {o.codigo}
          </Typography>
          <Typography variant="body2">{o.titulo}</Typography>
        </Box>
      )}
      sx={sx}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={causa.ref}
          placeholder={placeholder}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? (codigoActual ? undefined : 'Escriba para buscar en la CIE-11')}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            ...params.InputProps,
            startAdornment: codigoActual ? (
              <Chip label={`CIE-11 ${codigoActual}`} size="small" color="primary" variant="outlined"
                sx={{ fontFamily: 'monospace', fontWeight: 700, mr: 0.5 }} />
            ) : undefined,
            endAdornment: (
              <>
                {cargando && <CircularProgress size={18} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
