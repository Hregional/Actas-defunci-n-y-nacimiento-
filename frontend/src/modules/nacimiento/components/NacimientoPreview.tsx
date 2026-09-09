import {
  Dialog, DialogContent, DialogActions, Button, Box,
  Typography, IconButton,
} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'
import { usePrint } from '@/shared/hooks/usePrint'
import { PRINT_CSS } from '@/shared/styles/printStyles'
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
  const { printRef, print } = usePrint('Informe de Nacimiento — HRO')
  const fecha = data.ninoFechaNacimiento ? dayjs(data.ninoFechaNacimiento).format('DD/MM/YYYY') : ''

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      {/* Cabecera del modal */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: '#1a1a1a',
      }}>
        <Typography variant="h6" fontWeight={700} color="white">
          Vista previa — Informe de Nacimiento
        </Typography>
        <Box display="flex" gap={1}>
          <Button variant="contained" startIcon={<PrintIcon />} onClick={print} size="small"
            sx={{ bgcolor: 'white', color: '#1a1a1a', '&:hover': { bgcolor: '#f0f0f0' } }}>
            Imprimir / PDF
          </Button>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 2, bgcolor: '#e8e8e8' }}>
        <style>{PRINT_CSS}</style>
        <Box ref={printRef} sx={{
          bgcolor: 'white', p: 1.5, border: '1px solid #ccc',
          maxWidth: 740, mx: 'auto', fontFamily: 'Arial, sans-serif', fontSize: '0.72rem',
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
            <F l="Nombres y Apellidos" v={data.suscribeNombresApellidos} cls="f-full" />
            <F l="Documento personal de identificación - DPI" v={data.suscribeCuiCedula} cls="f-full" />
            <F l="No. Colegiado (si es profesional)" v={data.suscribeNoColegiado} cls="f-half" />
            <F l="No. de Registro (si es comadrona)" v={data.suscribeNoRegistroComadrona} cls="f-half" />
            <F l="Quién Informa el nacimiento"
              v={data.suscribeQuienInforma ? `${data.suscribeQuienInforma}. ${QUIEN_INFORMA[data.suscribeQuienInforma] ?? ''}` : ''}
              cls="f-full" />
          </div>

          <SB t="II. DATOS DEL LUGAR DE NACIMIENTO" />
          <div className="row">
            <F l="1. Departamento" v={data.lugarDepartamento} cls="f-half" />
            <F l="2. Municipio" v={data.lugarMunicipio} cls="f-half" />
            <F l="3. Dirección" v={data.lugarDireccion} cls="f-full" />
            <F l="4. Lugar donde ocurrió el nacimiento"
              v={data.lugarOcurrioNacimiento ? `${data.lugarOcurrioNacimiento}. ${LUGAR_NAC[data.lugarOcurrioNacimiento] ?? ''}` : ''}
              cls="f-full" />
          </div>

          <SB t="III. DATOS DEL NIÑO (A) Y DEL NACIMIENTO" />
          <div className="row">
            <span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2 }}>5. NOMBRE</span>
            <F l="Primer nombre" v={data.ninoPrimerNombre} cls="f-third" />
            <F l="Segundo nombre" v={data.ninoSegundoNombre} cls="f-third" />
            <F l="Tercer nombre" v={data.ninoTercerNombre} cls="f-third" />
            <F l="Primer apellido" v={data.ninoPrimerApellido} cls="f-half" />
            <F l="Segundo apellido" v={data.ninoSegundoApellido} cls="f-half" />
          </div>
          <div className="row">
            <F l="6. Fecha de nacimiento (DD/MM/YYYY)" v={fecha} cls="f-third" />
            <F l="7. Hora (horas y minutos)" v={data.ninoHoraNacimiento} cls="f-third" />
            <F l="8. Sexo" v={data.ninoSexo ? `${data.ninoSexo}. ${SEXO[data.ninoSexo]}` : ''} cls="f-third" />
          </div>
          <div className="row">
            <F l="9. Peso (libras)" v={data.ninoPesoLibras?.toString()} cls="f-quarter" />
            <F l="Onzas" v={data.ninoPesoOnzas?.toString()} cls="f-quarter" />
            <F l="10. Talla (cm)" v={data.ninoTallaCm?.toString()} cls="f-quarter" />
            <F l="11. Edad gestacional (semanas)" v={data.ninoEdadGestacionalSemanas?.toString()} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="12. Anomalías congénitas visibles" v={data.ninoAnomaliasCongenitas ? ANOMALIAS[data.ninoAnomaliasCongenitas] : ''} cls="f-third" />
            <F l="13. Tipo de parto" v={data.ninoTipoParto ? TIPO_PARTO[data.ninoTipoParto] : ''} cls="f-third" />
            <F l="14. No. hijos nacidos en el parto" v={data.ninoNumHijosNacidosParto?.toString()} cls="f-third" />
          </div>
          <div className="row">
            <F l="15. Persona que atendió el parto"
              v={data.ninoPersonaAtendioElParto ? `${data.ninoPersonaAtendioElParto}. ${PERSONA_PARTO[data.ninoPersonaAtendioElParto]}` : ''}
              cls="f-full" />
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
            <F l="18. Documento personal de identificación - DPI" v={data.madreCuiCedula} cls="f-full" />
            <F l="19. Edad" v={data.madreEdad?.toString()} cls="f-quarter" />
            <F l="20. Nacionalidad" v={data.madreNacionalidad} cls="f-quarter" />
            <F l="21. Ocupación u oficio" v={data.madreOcupacion} cls="f-half" />
          </div>
          <div className="row">
            <span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2 }}>22. Dirección de residencia actual</span>
            <F l="Dirección" v={data.madreDireccion} cls="f-half" />
            <F l="Zona" v={data.madreZona} />
            <F l="Municipio" v={data.madreMunicipio} />
            <F l="Departamento" v={data.madreDepartamento} />
          </div>
          <div className="row">
            <F l="23. Pueblo de pertenencia" v={data.madrePuebloPertenencia ? `${data.madrePuebloPertenencia}. ${PUEBLO[data.madrePuebloPertenencia]}` : ''} cls="f-third" />
            <F l="24. Estado civil" v={data.madreEstadoCivil ? ESTADO_CIVIL_M[data.madreEstadoCivil] : ''} cls="f-third" />
            <F l="25. Escolaridad" v={data.madreEscolaridad ? ESCOLARIDAD[data.madreEscolaridad] : ''} cls="f-third" />
          </div>

          <SB t="V. DATOS DEL PADRE" />
          <div className="row">
            <span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2 }}>26. NOMBRE</span>
            <F l="Primer nombre" v={data.padrePrimerNombre} cls="f-quarter" />
            <F l="Segundo nombre" v={data.padreSegundoNombre} cls="f-quarter" />
            <F l="Primer apellido" v={data.padrePrimerApellido} cls="f-quarter" />
            <F l="Segundo apellido" v={data.padreSegundoApellido} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="27. Documento personal de identificación - DPI" v={data.padreCuiCedula} cls="f-full" />
            <F l="28. Edad" v={data.padreEdad?.toString()} cls="f-quarter" />
            <F l="29. Nacionalidad" v={data.padreNacionalidad} cls="f-quarter" />
            <F l="30. Ocupación u oficio" v={data.padreOcupacion} cls="f-half" />
          </div>
          <div className="row">
            <span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2 }}>31. Dirección de residencia actual</span>
            <F l="Dirección" v={data.padreDireccion} cls="f-half" />
            <F l="Zona" v={data.padreZona} />
            <F l="Municipio" v={data.padreMunicipio} />
            <F l="Departamento" v={data.padreDepartamento} />
          </div>
          <div className="row">
            <F l="32. Pueblo de pertenencia" v={data.padrePuebloPertenencia ? `${data.padrePuebloPertenencia}. ${PUEBLO[data.padrePuebloPertenencia]}` : ''} cls="f-third" />
            <F l="33. Estado civil" v={data.padreEstadoCivil ? ESTADO_CIVIL_P[data.padreEstadoCivil] : ''} cls="f-third" />
            <F l="34. Escolaridad" v={data.padreEscolaridad ? ESCOLARIDAD[data.padreEscolaridad] : ''} cls="f-third" />
          </div>

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
          <p className="continua">/ CONTINÚA AL REVERSO</p>

          {/* ════════════ REVERSO — PÁGINA 2 ════════════ */}
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

          {/* Huellas */}
          <div className="huellas-wrap">
            <div style={{ flex: 2 }}>
              <p className="fp-plantar-lbl">IMPRESIÓN PLANTAR DEL RECIÉN NACIDO(A). (PIE DERECHO)</p>
              <div className="fp-plantar" style={{ height: 110 }} />
            </div>
            <div className="fp-small-col" style={{ flex: 1 }}>
              <div>
                <p className="fp-small-lbl">IMPRESIÓN DEL DEDO PULGAR<br />DERECHO DEL RECIÉN NACIDO(A)</p>
                <div className="fp-small" />
              </div>
              <div>
                <p className="fp-small-lbl">IMPRESIÓN DEL DEDO PULGAR<br />DERECHO DE LA MADRE</p>
                <div className="fp-small" />
              </div>
            </div>
          </div>

          {/* Instrucciones completas tal cual el PDF */}
          <div className="rev-wrap">
            <div className="rev-title">INSTRUCCIONES PARA EL LLENADO DEL INFORME DE NACIMIENTO</div>

            <div className="rev-section">
              <div className="rev-sec-title">I. DATOS DEL QUE SUSCRIBE:</div>
              <div className="rev-body">
                El médico o persona que suscribe el nacimiento, deberá anotar su nombre completo y número de documento
                personal de identificación -CUI-/Cédula de vecindad, número de colegiado (si es profesional) o número
                de registro (si es comadrona). Anote además en el recuadro el número que corresponde a la persona que
                suscribe el nacimiento.
              </div>
            </div>

            <div className="rev-section">
              <div className="rev-sec-title">II. DATOS DEL LUGAR DE NACIMIENTO:</div>
              <div className="rev-body">
                <div className="rev-item">1. DEPARTAMENTO: Anote el nombre del departamento donde ocurrió el nacimiento.</div>
                <div className="rev-item">2. MUNICIPIO: Anote el nombre del municipio donde sucedió el nacimiento.</div>
                <div className="rev-item">3. DIRECCIÓN: Escriba la dirección exacta, además pregunte si esta corresponde a una ciudad, pueblo, aldea, caserío o finca.</div>
                <div className="rev-item">4. LUGAR DONDE OCURRIÓ EL NACIMIENTO: Anote en la casilla el número que corresponda, según el lugar del nacimiento.</div>
              </div>
            </div>

            <div className="rev-section">
              <div className="rev-sec-title">III. DATOS DEL NIÑO(A) Y DEL NACIMIENTO:</div>
              <div className="rev-body">
                <div className="rev-item">5. NOMBRE: Anote los nombres del niño(a) en los espacios correspondientes, también anote el apellido paterno y materno.</div>
                <div className="rev-item">6. FECHA DE NACIMIENTO: Anote la fecha en que ocurrió el nacimiento en el orden siguiente: día, mes y año.</div>
                <div className="rev-item">7. HORA: Anote la hora (en formato de 24 horas) y minutos del nacimiento.</div>
                <div className="rev-item">8. SEXO: Anote en la casilla el número correspondiente al sexo del recién nacido.</div>
                <div className="rev-item">9. PESO AL NACER: Anote el peso del niño(a) en libras y onzas.</div>
                <div className="rev-item">10. TALLA: Anote la talla del niño(a) en centímetros.</div>
                <div className="rev-item">11. EDAD GESTACIONAL: Anote el número de semanas que el niño(a) estuvo en el vientre de la madre.</div>
                <div className="rev-item">12. ANOMALÍAS CONGÉNITAS VISIBLES: Anote el número según corresponda, si el niño(a) nació o no con alguna anomalía.</div>
                <div className="rev-item">13. TIPO DE PARTO: Anote el número que corresponda en la casilla para indicar si el nacimiento fue por parto normal o cesárea.</div>
                <div className="rev-item">14. NÚMERO DE HIJOS(AS) NACIDOS(AS) EN EL PARTO: Anote cuántos hijos ha tenido la madre durante el parto. Cuando el parto ha sido doble, triple o más, asegúrese de registrar por separado cada nacimiento vivo. Todos los niños y niñas nacidos vivos deben registrarse, así mueran después del parto.</div>
                <div className="rev-item">15. PERSONA QUE ATENDIÓ EL PARTO: Anote en la casilla el número que corresponda para indicar la profesión de la persona que atendió el parto.</div>
                <div className="rev-item">16. NÚMERO DE HIJOS(AS) QUE HA TENIDO LA MADRE INCLUYENDO LOS NACIDOS MUERTOS Y EL QUE AHORA SE REGISTRA: Anote la cantidad de hijos(as) que ha tenido la madre independientemente si nacieron vivos o muertos, así también escriba por separado el número de hijos nacidos muertos. Anote además el número de hijos vivos que tiene actualmente la madre, debe contarse también el que se está registrando.</div>
              </div>
            </div>

            <div className="rev-section">
              <div className="rev-sec-title">IV. DATOS DE LA MADRE:</div>
              <div className="rev-body">
                <div className="rev-item">17. NOMBRE: Anote los nombres de la madre del niño(a) seguidos por el apellido paterno, materno y de casada si lo hubiera.</div>
                <div className="rev-item">18. DOCUMENTO PERSONAL DE IDENTIFICACIÓN –CUI-/CÉDULA DE VECINDAD: Anote el número del documento de identificación de la madre.</div>
                <div className="rev-item">19. EDAD: Anote la edad de la madre en años cumplidos.</div>
                <div className="rev-item">20. NACIONALIDAD: Registre la nacionalidad de la madre.</div>
                <div className="rev-item">21. OCUPACIÓN U OFICIO: Anote la ocupación principal de la madre (se considera ocupación principal aquella actividad que durante el mes anterior generó mayores ingresos).</div>
                <div className="rev-item">22. DIRECCIÓN DE RESIDENCIA ACTUAL: Anote la dirección donde reside actualmente la madre del niño(a), la zona, municipio y departamento.</div>
                <div className="rev-item">23. PUEBLO DE PERTENENCIA: Anote en la casilla el número correspondiente al pueblo de pertenencia de la madre, respetando el derecho individual a la autoidentificación.</div>
                <div className="rev-item">24. ESTADO CIVIL: Anote en la casilla el código correspondiente al estado civil de la madre.</div>
                <div className="rev-item">25. ESCOLARIDAD: Anote en la casilla el código que corresponda al grado de escolaridad de la madre.</div>
              </div>
            </div>

            <div className="rev-section">
              <div className="rev-sec-title">V. DATOS DEL PADRE:</div>
              <div className="rev-body">
                <div className="rev-item">26. NOMBRE: Anote los nombres del padre del niño(a) seguidos por el apellido paterno y materno.</div>
                <div className="rev-item">27. DOCUMENTO PERSONAL DE IDENTIFICACIÓN –CUI-/CÉDULA DE VECINDAD: Anote el número del documento de identificación del padre.</div>
                <div className="rev-item">28. EDAD: Anote la edad del padre en años cumplidos.</div>
                <div className="rev-item">29. NACIONALIDAD: Registre la nacionalidad del padre.</div>
                <div className="rev-item">30. OCUPACIÓN U OFICIO: Anote la ocupación principal del padre.</div>
                <div className="rev-item">31. DIRECCIÓN DE RESIDENCIA ACTUAL: Anote la dirección donde reside actualmente el padre del niño(a), la zona, municipio y departamento.</div>
                <div className="rev-item">32. PUEBLO DE PERTENENCIA: Anote en la casilla el número correspondiente al pueblo de pertenencia del padre, respetando el derecho individual a la autoidentificación.</div>
                <div className="rev-item">33. ESTADO CIVIL: Anote en la casilla el código correspondiente al estado civil del padre.</div>
                <div className="rev-item">34. ESCOLARIDAD: Anote en la casilla el código que corresponda al grado de escolaridad del padre.</div>
              </div>
            </div>
          </div>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">Cerrar</Button>
        <Button onClick={print} variant="contained" startIcon={<PrintIcon />}>
          Imprimir / Generar PDF
        </Button>
      </DialogActions>
    </Dialog>
  )
}
