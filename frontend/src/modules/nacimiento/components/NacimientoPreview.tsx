import {
  Dialog, DialogContent, DialogActions, Button, Box,
  Typography, IconButton,
} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'
import { usePrint } from '@/shared/hooks/usePrint'
import { PRINT_CSS_NACIMIENTO } from '@/shared/styles/printStyles'
import type { NacimientoFormValues } from '../schemas/nacimiento.schema'

/* ── Catálogos ─────────────────────────────────────────── */
const SEXO: Record<number, string> = { 1: 'Hombre', 2: 'Mujer' }
const ANOMALIAS: Record<number, string> = { 1: 'Sí', 2: 'No' }
const TIPO_PARTO: Record<number, string> = { 1: 'Parto normal', 2: 'Cesárea' }
const PERSONA_PARTO: Record<number, string> = {
  1: 'Médico', 2: 'Personal de enfermería', 3: 'Paramédico',
  4: 'Comadrona', 5: 'Empírica', 6: 'Ninguna', 9: 'Ignorado',
}
const PUEBLO: Record<number, string> = {
  1: 'Maya', 2: 'Garífuna', 3: 'Xinka', 4: 'Mestizo / Ladino', 5: 'Otro',
}
const ESTADO_CIVIL_M: Record<number, string> = {
  1: 'Soltera', 2: 'Casada', 3: 'Unida', 4: 'Viuda', 5: 'Divorciada', 6: 'Unión no declarada',
}
const ESTADO_CIVIL_P: Record<number, string> = {
  1: 'Soltero', 2: 'Casado', 3: 'Unido', 4: 'Viudo', 5: 'Divorciado', 6: 'Unión no declarada',
}
const ESCOLARIDAD: Record<number, string> = {
  1: 'Ninguna', 2: 'Primaria', 3: 'Básico', 4: 'Diversificado', 5: 'Universitario',
}
const LUGAR_NAC: Record<number, string> = {
  1: 'Hospital público', 2: 'Hospital privado', 3: 'Centro de salud',
  4: 'Seguro social', 5: 'Vía pública', 6: 'Domicilio', 7: 'Otro', 9: 'Ignorado',
}
const QUIEN_INFORMA: Record<number, string> = {
  1: 'Médico', 2: 'Personal de enfermería', 3: 'Personal institucional',
  4: 'Comadrona', 5: 'Autoridad Local',
}

/* ── Subcomponentes ────────────────────────────────────── */
function F({ l, v, cls = 'f' }: { l: string; v?: string | number | null; cls?: string }) {
  return (
    <div className={cls}>
      <span className="f-lbl">{l}</span>
      <div className="f-val">{v ?? ''}</div>
    </div>
  )
}
function SB({ t }: { t: string }) {
  return <div className="sec-bar">{t}</div>
}

/* ── Props ─────────────────────────────────────────────── */
interface Props { open: boolean; onClose: () => void; data: NacimientoFormValues }

export default function NacimientoPreview({ open, onClose, data }: Props) {
  const { printRef, print } = usePrint('Informe de Nacimiento — HRO', PRINT_CSS_NACIMIENTO)
  const fecha = data.ninoFechaNacimiento ? dayjs(data.ninoFechaNacimiento).format('DD/MM/YYYY') : ''

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      {/* Cabecera del modal */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider',
        background: 'linear-gradient(90deg, #003087 0%, #0057B8 50%, #00A8CC 100%)',
        boxShadow: '0 2px 12px rgba(0, 48, 135, 0.3)',
      }}>
        <Typography variant="h6" fontWeight={700} color="white">
          Vista previa — Informe de Nacimiento
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 2, bgcolor: '#e8e8e8' }}>
        <style>{PRINT_CSS_NACIMIENTO}</style>
        <div className="form-container">
          <Box ref={printRef} sx={{
            bgcolor: 'white',
            border: '1px solid #bbb',
            fontFamily: 'Arial, sans-serif',
            fontSize: '0.72rem',
            '@media print': { border: 'none' },
          }}>

          {/* ════════════ FRENTE — PÁGINA 1 ════════════ */}
          <div className="form-header">
            <div className="form-header-top">
              <img src="/assets/images/1-LogoINE.png" alt="INE" />
              <div className="form-header-center">
                <h1>REPÚBLICA DE GUATEMALA</h1>
                <h2>INFORME DE NACIMIENTO</h2>
              </div>
              <img src="/assets/images/3-LogoHRO.jpg" alt="HRO" />
            </div>
          </div>

          <SB t="I. DATOS DEL QUE SUSCRIBE" />
          <div className="row">
            <F l="Nombres y Apellidos" v={data.suscribeNombresApellidos} cls="f-half" />
            <F l="Documento personal de identificación - DPI" v={data.suscribeCuiCedula} cls="f-quarter" />
            <F l="No. Colegiado (si es profesional)" v={data.suscribeNoColegiado} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="Quién Informa el nacimiento"
              v={data.suscribeQuienInforma ? QUIEN_INFORMA[data.suscribeQuienInforma] ?? '' : ''}
              cls="f-full" />
          </div>

          <SB t="II. DATOS DEL LUGAR DE NACIMIENTO" />
          <div className="row">
            <F l="1. Departamento" v={data.lugarDepartamento} cls="f-third" />
            <F l="2. Municipio" v={data.lugarMunicipio} cls="f-third" />
            <F l="4. Lugar donde ocurrió el nacimiento"
              v={data.lugarOcurrioNacimiento ? LUGAR_NAC[data.lugarOcurrioNacimiento] ?? '' : ''}
              cls="f-third" />
          </div>
          <div className="row">
            <F l="3. Dirección" v={data.lugarDireccion} cls="f-full" />
          </div>

          <SB t="III. DATOS DEL NIÑO (A) Y DEL NACIMIENTO" />
          <div className="row">
            <span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2 }}>5. NOMBRE</span>
            <F l="Primer nombre" v={data.ninoPrimerNombre} cls="f-fifth" />
            <F l="Segundo nombre" v={data.ninoSegundoNombre} cls="f-fifth" />
            <F l="Tercer nombre" v={data.ninoTercerNombre} cls="f-fifth" />
            <F l="Primer apellido" v={data.ninoPrimerApellido} cls="f-fifth" />
            <F l="Segundo apellido" v={data.ninoSegundoApellido} cls="f-fifth" />
          </div>
          <div className="row">
            <F l="6. Fecha de nacimiento" v={fecha} cls="f-quarter" />
            <F l="7. Hora (horas y minutos)" v={data.ninoHoraNacimiento} cls="f-quarter" />
            <F l="8. Sexo" v={data.ninoSexo ? SEXO[data.ninoSexo] : ''} cls="f-quarter" />
            <F l="11. Edad gestacional (semanas)" v={data.ninoEdadGestacionalSemanas?.toString()} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="9. Peso libras" v={data.ninoPesoLibras?.toString()} cls="f-quarter" />
            <F l="Onzas" v={data.ninoPesoOnzas?.toString()} cls="f-quarter" />
            <F l="10. Talla (cm)" v={data.ninoTallaCm?.toString()} cls="f-quarter" />
            <F l="14. No. hijos nacidos en el parto" v={data.ninoNumHijosNacidosParto?.toString()} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="12. Anomalías congénitas visibles" v={data.ninoAnomaliasCongenitas ? ANOMALIAS[data.ninoAnomaliasCongenitas] : ''} cls="f-third" />
            <F l="13. Tipo de parto" v={data.ninoTipoParto ? TIPO_PARTO[data.ninoTipoParto] : ''} cls="f-third" />
            <F l="15. Persona que atendió el parto"
              v={data.ninoPersonaAtendioElParto ? PERSONA_PARTO[data.ninoPersonaAtendioElParto] : ''}
              cls="f-third" />
          </div>
          <div className="row">
            <F l="16. Total hijos de la madre (incluyendo este)" v={data.ninoTotalHijosMadre?.toString()} cls="f-third" />
            <F l="Nacidos muertos" v={data.ninoHijosNacidosMuertos?.toString()} cls="f-third" />
            <F l="Cuántos(as) viven" v={data.ninoHijosViven?.toString()} cls="f-third" />
          </div>

          <SB t="IV. DATOS DE LA MADRE" />
          <div className="row">
            <span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2 }}>17. NOMBRE</span>
            <F l="Primer nombre" v={data.madrePrimerNombre} cls="f-fifth" />
            <F l="Segundo nombre" v={data.madreSegundoNombre} cls="f-fifth" />
            <F l="Primer apellido" v={data.madrePrimerApellido} cls="f-fifth" />
            <F l="Segundo apellido" v={data.madreSegundoApellido} cls="f-fifth" />
            <F l="Apellido de casada" v={data.madreApellidoCasada} cls="f-fifth" />
          </div>
          <div className="row">
            <F l="18. DPI" v={data.madreCuiCedula} cls="f-quarter" />
            <F l="19. Edad" v={data.madreEdad?.toString()} cls="f-sixth" />
            <F l="20. Nacionalidad" v={data.madreNacionalidad} cls="f-quarter" />
            <F l="21. Ocupación u oficio" v={data.madreOcupacion} cls="f-third" />
          </div>
          <div className="row">
            <span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2 }}>22. Dirección de residencia actual</span>
            <F l="Dirección" v={data.madreDireccion} cls="f-half" />
            <F l="Zona" v={data.madreZona} cls="f-sixth" />
            <F l="Municipio" v={data.madreMunicipio} cls="f-third" />
            <F l="Departamento" v={data.madreDepartamento} cls="f-third" />
          </div>
          <div className="row">
            <F l="23. Pueblo de pertenencia" v={data.madrePuebloPertenencia ? PUEBLO[data.madrePuebloPertenencia] : ''} cls="f-third" />
            <F l="24. Estado civil" v={data.madreEstadoCivil ? ESTADO_CIVIL_M[data.madreEstadoCivil] : ''} cls="f-third" />
            <F l="25. Escolaridad" v={data.madreEscolaridad ? ESCOLARIDAD[data.madreEscolaridad] : ''} cls="f-third" />
          </div>

          {/* Sección V: Padre — solo se imprime si hay al menos un dato */}
          {(data.padrePrimerNombre || data.padrePrimerApellido || data.padreCuiCedula) ? (
            <>
              <SB t="V. DATOS DEL PADRE" />
              <div className="row">
                <span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2 }}>26. NOMBRE</span>
                <F l="Primer nombre" v={data.padrePrimerNombre} cls="f-quarter" />
                <F l="Segundo nombre" v={data.padreSegundoNombre} cls="f-quarter" />
                <F l="Primer apellido" v={data.padrePrimerApellido} cls="f-quarter" />
                <F l="Segundo apellido" v={data.padreSegundoApellido} cls="f-quarter" />
              </div>
              <div className="row">
                <F l="27. DPI" v={data.padreCuiCedula} cls="f-quarter" />
                <F l="28. Edad" v={data.padreEdad?.toString()} cls="f-sixth" />
                <F l="29. Nacionalidad" v={data.padreNacionalidad} cls="f-quarter" />
                <F l="30. Ocupación u oficio" v={data.padreOcupacion} cls="f-third" />
              </div>
              <div className="row">
                <span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2 }}>31. Dirección de residencia actual</span>
                <F l="Dirección" v={data.padreDireccion} cls="f-half" />
                <F l="Zona" v={data.padreZona} cls="f-sixth" />
                <F l="Municipio" v={data.padreMunicipio} cls="f-third" />
                <F l="Departamento" v={data.padreDepartamento} cls="f-third" />
              </div>
              <div className="row">
                <F l="32. Pueblo de pertenencia" v={data.padrePuebloPertenencia ? PUEBLO[data.padrePuebloPertenencia] : ''} cls="f-third" />
                <F l="33. Estado civil" v={data.padreEstadoCivil ? ESTADO_CIVIL_P[data.padreEstadoCivil] : ''} cls="f-third" />
                <F l="34. Escolaridad" v={data.padreEscolaridad ? ESCOLARIDAD[data.padreEscolaridad] : ''} cls="f-third" />
              </div>
            </>
          ) : null}

          {/* Bloque de cierre */}
          <div className="close-blk">
            <div className="sello-box">SELLO<br />INSTITUCIONAL<br />Y/O PROFESIONAL</div>
            <div className="legal-txt">
              "Y para que se haga la inscripción respectiva en el Registro Nacional de las Personas,
              se emite el presente Informe de nacimiento, en _________________________________<br /><br />
              a los _______ días del mes de _______________________ de dos mil _______________<br /><br />
              Firma de la persona que extiende el informe: ____________________________________"
            </div>
          </div>
          <p className="nota-pie">
            Nota: En caso de nacer más de un niño, debe llenarse un informe de nacimiento para cada uno,
            asignándole el orden en que haya nacido.
          </p>

          {/* ════════════ REVERSO — PÁGINA 2 ════════════ */}
          {/* page-break antes del bloque de huellas para que siempre vaya al reverso */}
          <div className="page-break" />

          {/* Header reverso */}
          <div className="form-header">
            <div className="form-header-top">
              <img src="/assets/images/1-LogoINE.png" alt="INE" />
              <div className="form-header-center">
                <h1>REPÚBLICA DE GUATEMALA</h1>
                <h2>INFORME DE NACIMIENTO</h2>
              </div>
              <img src="/assets/images/3-LogoHRO.jpg" alt="HRO" />
            </div>
          </div>

          {/* Huellas — siempre en el reverso */}
          <div className="huellas-wrap">
            {/* Columna izquierda: huella plantar grande */}
            <div className="fp-plantar-col">
              <p className="fp-plantar-lbl">Impresión plantar del recién nacido(a)<br />(Pie derecho)</p>
              <div className="fp-plantar" />
            </div>
            {/* Columna derecha: dos huellas de pulgar */}
            <div className="fp-small-col">
              <div className="fp-small-item">
                <p className="fp-small-lbl">Impresión del dedo pulgar derecho<br />del recién nacido(a)</p>
                <div className="fp-small" />
              </div>
              <div className="fp-small-item">
                <p className="fp-small-lbl">Impresión del dedo pulgar derecho<br />de la madre</p>
                <div className="fp-small" />
              </div>
            </div>
          </div>

          </Box>
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1, minWidth: 200 }}>
          💡 Para mejor resultado: en el diálogo de impresión seleccione{' '}
          <strong>Papel: Oficio / Legal (8.5" × 14")</strong>.
          Si imprime en Carta, el contenido se reduce automáticamente.
        </Typography>
        <Button onClick={onClose} variant="outlined">Cerrar</Button>
        <Button onClick={print} variant="contained" startIcon={<PrintIcon />}>
          Imprimir / Generar PDF
        </Button>
      </DialogActions>
    </Dialog>
  )
}
