import {
  Dialog, DialogContent, DialogActions, Button, Box,
  Typography, IconButton,
} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'
import { usePrint } from '@/shared/hooks/usePrint'
import { PRINT_CSS_DEFUNCION } from '@/shared/styles/printStyles'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

/* ── Catálogos ─────────────────────────────────────────── */
const SEXO: Record<number, string> = { 1: 'Hombre', 2: 'Mujer', 9: 'Ignorado' }
const EC: Record<number, string> = { 1: 'Soltero(a)', 2: 'Casado(a)', 3: 'Unido(a)', 9: 'Ignorado' }
const PUEBLO: Record<number, string> = { 1: 'Maya', 2: 'Garífuna', 3: 'Xinka', 4: 'Mestizo, Ladino', 5: 'Ninguno', 9: 'Ignorado' }
const ESCOL: Record<number, string> = {
  0: 'Ninguna', 1: 'Primaria incompleta', 2: 'Primaria completa',
  3: 'Básico incompleto', 4: 'Básico completo', 5: 'Diversificado incompleto',
  6: 'Diversificado completo', 7: 'Universitario incompleto', 8: 'Universitario completo', 9: 'Ignorado'
}
const ASIST: Record<number, string> = { 1: 'Médica', 2: 'Paramédica', 3: 'Comadrona', 4: 'Empírica', 5: 'Ninguna', 9: 'Ignorado' }
const LUGAR_DEF: Record<number, string> = {
  1: 'Hospital Público', 2: 'Hospital Privado', 3: 'Otros servicios de salud pública',
  4: 'IGSS', 5: 'Vía Pública', 6: 'Domicilio', 7: 'Lugar de trabajo', 8: 'Otro', 9: 'Ignorado'
}
const LUGAR_LES: Record<number, string> = {
  0: 'Vivienda', 1: 'Institución residencial', 2: 'Escuela u oficina pública', 3: 'Áreas deportivas',
  4: 'Calle o carretera (vía pública)', 5: 'Área comercial o de servicios',
  6: 'Área industrial (taller, fábrica u obra)', 7: 'Granja (rancho o parcela)', 8: 'Otro', 9: 'Ignorado'
}
const MUE_DUR: Record<number, string> = {
  1: 'El embarazo', 2: 'El parto',
  3: 'El puerperio (Dentro de los 42 días siguientes a la terminación del embarazo)',
  4: 'De 43 días a 11 meses, después del parto o aborto',
  5: 'No estuvo embarazada durante los 11 meses previos a la muerte', 9: 'Ignorado'
}
const QUIEN: Record<number, string> = { 1: 'Médico', 2: 'Paramédico', 3: 'Autoridad' }

/* ── Subcomponentes ────────────────────────────────────── */
function F({ l, v, cls = 'f' }: { l: string; v?: string | number | null; cls?: string }) {
  return (
    <div className={cls}>
      <span className="f-lbl">{l}</span>
      <div className="f-val">{v ?? ''}</div>
    </div>
  )
}
function SB({ t }: { t: string }) { return <div className="sec-bar">{t}</div> }

/** Texto de la causa con su código CIE-11 al final, si se seleccionó de la CIE-11. */
function conCie11(causa?: string | null, codigo?: string | null) {
  if (!causa) return ''
  return codigo ? `${causa} (CIE-11: ${codigo})` : causa
}

interface Props { open: boolean; onClose: () => void; data: Partial<DefuncionFormValues> }

export default function DefuncionPreview({ open, onClose, data }: Props) {
  const { printRef, print } = usePrint('Informe de Defunción — HRO', PRINT_CSS_DEFUNCION)

  const fecha = data.infoFechaDefuncion ? dayjs(data.infoFechaDefuncion).format('DD/MM/YYYY') : ''
  const edadStr = (() => {
    if (data.fallecidoEdadAnos) return `${data.fallecidoEdadAnos} años`
    if (data.fallecidoEdadMeses) return `${data.fallecidoEdadMeses} meses`
    if (data.fallecidoEdadDias) return `${data.fallecidoEdadDias} días`
    if (data.fallecidoEdadHoras) return `${data.fallecidoEdadHoras} horas`
    return ''
  })()

  // Helpers para determinar qué secciones mostrar
  const tieneSeccionFallecido = data.fallecidoNombreCompleto || data.fallecidoDocNumero
  const tieneSeccionFertil = data.fertilMuerteDurante != null
  const tieneSeccionCausa = data.causaIa || data.causaIb || data.causaIc || data.causaId || data.causaIi
  const tieneSeccionAccidental =
    data.accidentalFuePresunto != null ||
    data.accidentalLugarLesion != null ||
    data.accidentalOcurrioTrabajo != null ||
    data.accidentalFueTransito != null ||
    data.accidentalArmaProdujo
  const tieneSeccionMortinato =
    data.mortinatoMadreNombre ||
    data.mortinatoMadreDocNumero ||
    data.mortinatoFetoSexo != null ||
    data.mortinatoSemanasGestacion != null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider',
        background: 'linear-gradient(90deg, #003087 0%, #0057B8 50%, #00A8CC 100%)',
        boxShadow: '0 2px 12px rgba(0, 48, 135, 0.3)',
      }}>
        <Typography variant="h6" fontWeight={700} color="white">
          Vista previa — Informe de Defunción
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 2, bgcolor: '#e8e8e8' }}>
        <style>{PRINT_CSS_DEFUNCION}</style>
        <div className="form-container">
          <Box ref={printRef} sx={{
            bgcolor: 'white',
            border: '1px solid #bbb',
            fontFamily: 'Arial,sans-serif',
            fontSize: '0.72rem',
            '@media print': { border: 'none' },
          }}>

          {/* ════════════ FRENTE — PÁGINA 1 ════════════ */}
          <div className="form-header">
            <div className="form-header-top">
              <img src="/assets/images/1-LogoINE.png" alt="INE" />
              <img src="/assets/images/2-LogoRENAP.jpg" alt="RENAP" />
              <div className="form-header-center">
                <h1>República de Guatemala</h1>
                <h2>INFORME DE DEFUNCIÓN</h2>
                <div className="sub">(INCLUYE DEFUNCIONES FETALES)</div>
              </div>
              <img src="/assets/images/3-LogoHRO.jpg" alt="HRO" />
              <div className="form-header-rev">Revisión 2016</div>
            </div>
          </div>

          <SB t="I. INFORMACIÓN GENERAL" />
          <div className="row">
            <F l="1. El que informa (nombres y apellidos)" v={data.infoQuienInformaNombres} cls="f-half" />
            <F l="2. Documento de Identificación (CUI)" v={data.infoDocumentoIdentificacion} cls="f-quarter" />
            <F l="3. Quién informa es" v={data.infoQuienInformaTipo ? QUIEN[data.infoQuienInformaTipo] ?? '' : ''} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="3.1 No. de colegiado" v={data.infoNoColegiado} cls="f-quarter" />
            <F l="4. Fecha de la defunción" v={fecha} cls="f-quarter" />
            <F l="A las (hora)" v={data.infoHoraDefuncion} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="5. Lugar y dirección donde ocurrió la defunción" v={data.infoLugarDireccion} cls="f-half" />
            <F l="Municipio" v={data.infoLugarMunicipio} cls="f-third" />
            <F l="Departamento" v={data.infoLugarDepartamento} cls="f-third" />
          </div>

          {/* Sección II: Datos del Fallecido — solo si hay datos */}
          {tieneSeccionFallecido && (
            <>
              <SB t="II. DATOS DEL FALLECIDO (A)" />
              <div className="row"><span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2 }}>FALLECIÓ:</span></div>
              <div className="row">
                <F l="6. Nombre — Nombres y apellidos completos" v={data.fallecidoNombreCompleto} cls="f-full" />
              </div>
              <div className="row">
                <F l="7. Sexo" v={data.fallecidoSexo ? SEXO[data.fallecidoSexo] ?? '' : ''} cls="f-sixth" />
                <F l="8. Edad (años)" v={edadStr} cls="f-sixth" />
                <F l="Horas (menor 1 día)" v={data.fallecidoEdadHoras?.toString()} cls="f-sixth" />
                <F l="Días (menor 1 mes)" v={data.fallecidoEdadDias?.toString()} cls="f-sixth" />
                <F l="Meses (menor 1 año)" v={data.fallecidoEdadMeses?.toString()} cls="f-sixth" />
              </div>
              <div className="row">
                <F l="9. CUI/Cédula" v={data.fallecidoDocNumero} cls="f-quarter" />
                <F l="No. de Libro" v={data.fallecidoDocLibro} cls="f-quarter" />
                <F l="No. de Folio" v={data.fallecidoDocFolio} cls="f-quarter" />
                <F l="No. de Partida" v={data.fallecidoDocPartida} cls="f-quarter" />
              </div>
              <div className="row">
                <F l="10. Lugar nacimiento — País" v={data.fallecidoLugarNacPais} cls="f-quarter" />
                <F l="Departamento" v={data.fallecidoLugarNacDepartamento} cls="f-third" />
                <F l="Municipio" v={data.fallecidoLugarNacMunicipio} cls="f-third" />
              </div>
              <div className="row">
                <F l="11. Nacionalidad" v={data.fallecidoNacionalidad} cls="f-quarter" />
                <F l="12. Ocupación" v={data.fallecidoOcupacion} cls="f-quarter" />
                <F l="13. Estado civil" v={data.fallecidoEstadoCivil ? EC[data.fallecidoEstadoCivil] ?? '' : ''} cls="f-quarter" />
                <F l="16. Escolaridad" v={data.fallecidoEscolaridad != null ? ESCOL[data.fallecidoEscolaridad] ?? '' : ''} cls="f-quarter" />
              </div>
              <div className="row">
                <F l="14. Pueblo de pertenencia" v={data.fallecidoPuebloPertenencia ? PUEBLO[data.fallecidoPuebloPertenencia] ?? '' : ''} cls="f-quarter" />
              </div>
              <div className="row">
                <F l="15. Residencia — Dirección exacta" v={data.fallecidoResidenciaDireccion} cls="f-half" />
                <F l="Municipio" v={data.fallecidoResidenciaMunicipio} cls="f-third" />
                <F l="Departamento" v={data.fallecidoResidenciaDepartamento} cls="f-third" />
              </div>
            </>
          )}

          {/* Sección III: Mujeres Fértiles — solo si fue respondida */}
          {tieneSeccionFertil && (
            <>
              <SB t="III. MUJERES EN EDAD FÉRTIL" />
              <div className="row">
                <F l="17. Si la defunción corresponde a una mujer entre 10 y 54 años, la muerte ocurrió durante"
                  v={data.fertilMuerteDurante ? MUE_DUR[data.fertilMuerteDurante] ?? '' : ''} cls="f-full" />
              </div>
            </>
          )}

          {/* Sección IV: Causa de Defunción — solo si hay causas registradas */}
          {tieneSeccionCausa && (
            <>
              <SB t="IV. CAUSA DE DEFUNCIÓN" />
              <div className="causa-box">
                <div className="causa-lbl">I. Enfermedad o estado patológico que produjo la muerte directamente*</div>
                <div className="causa-lbl">Causas antecedentes. Estados morbosos que produjeron la causa consignada arriba, mencionándose en el último lugar la causa básica</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', marginTop: 2, marginBottom: 3 }}>
                  <span style={{ fontSize: '6pt', fontWeight: 700, width: 80, flexShrink: 0 }}>Causa / Estado</span>
                  <span style={{ flex: 3, fontSize: '6pt', textAlign: 'center' }}>Descripción</span>
                  <span style={{ flex: 1, fontSize: '6pt', textAlign: 'center' }}>Intervalo aprox.</span>
                </div>
                {[
                  ['(a) Causa directa', data.causaIa, data.causaIaIntervalo, data.causaIaCie11],
                  ['(b)', data.causaIb, data.causaIbIntervalo, data.causaIbCie11],
                  ['(c)', data.causaIc, data.causaIcIntervalo, data.causaIcCie11],
                  ['(d) Causa básica', data.causaId, data.causaIdIntervalo, data.causaIdCie11],
                ].map(([k, v, i, c]) => (
                  <div key={String(k)} className="causa-row">
                    <span className="causa-key">{k}</span>
                    <div className="causa-val">{conCie11(v, c)}</div>
                    <div className="causa-int">
                      <div className="causa-int-lbl">Intervalo</div>
                      <div className="causa-int-val">{String(i ?? '')}</div>
                    </div>
                  </div>
                ))}
                <div className="causa-note">
                  * No quiere decirse con esto la manera o modo de morir; significa la enfermedad, traumatismo o complicación que causó la muerte.
                </div>
                <div className="causa-sep">
                  <div className="causa-lbl">II. Otros estados patológicos significativos que contribuyeron a la muerte, pero no relacionados con la enfermedad o estado morboso que la produjo</div>
                  <div className="f-val" style={{ minHeight: 16, marginTop: 2 }}>{conCie11(data.causaIi, data.causaIiCie11)}</div>
                </div>
              </div>
            </>
          )}

          {/* Sección V: Defunciones Accidentales — solo si hay datos */}
          {tieneSeccionAccidental && (
            <>
              <SB t="V. DEFUNCIONES ACCIDENTALES Y VIOLENTAS" />
              <div className="row">
                <F l="19. Fue un presunto" v={data.accidentalFuePresunto ? ['', 'Suicidio', 'Homicidio', 'Accidente'][data.accidentalFuePresunto] ?? 'Ignorado' : ''} cls="f-quarter" />
                <F l="19.1 Lugar donde ocurrió la lesión" v={data.accidentalLugarLesion != null ? LUGAR_LES[data.accidentalLugarLesion] ?? '' : ''} cls="f-half" />
              </div>
              <div className="row">
                <F l="19.2 Ocurrió en el desempeño de su trabajo" v={data.accidentalOcurrioTrabajo ? ['', 'Sí', 'No', '', '', '', '', '', '', 'Ignorado'][data.accidentalOcurrioTrabajo] ?? '' : ''} cls="f-third" />
                <F l="19.3 Fue accidente de tránsito" v={data.accidentalFueTransito ? ['', 'Sí', 'No', '', '', '', '', '', '', 'Ignorado'][data.accidentalFueTransito] ?? '' : ''} cls="f-third" />
                <F l="19.4 Arma que lo produjo" v={data.accidentalArmaProdujo} cls="f-third" />
              </div>
            </>
          )}

          {/* Sección VI: Datos de la Defunción Fetal — solo si hay datos */}
          {tieneSeccionMortinato && (
            <>
              <SB t="VI. DATOS DE LA DEFUNCIÓN FETAL (MORTINATO)" />
              <div className="row"><span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2, fontWeight: 700 }}>DATOS DE LA MADRE</span></div>
              <div className="row">
                <F l="20. Nombre — Nombres y apellidos completos" v={data.mortinatoMadreNombre} cls="f-full" />
              </div>
              <div className="row">
                <F l="21. Documento de Identificación" v={data.mortinatoMadreDocNumero} cls="f-third" />
                <F l="No. Libro" v={data.mortinatoMadreDocLibro} cls="f-third" />
                <F l="No. Folio" v={data.mortinatoMadreDocFolio} cls="f-third" />
              </div>
              <div className="row">
                <F l="22. Lugar nacimiento — País" v={data.mortinatoMadreLugarNacPais} cls="f-third" />
                <F l="Departamento" v={data.mortinatoMadreLugarNacDepartamento} cls="f-third" />
                <F l="Municipio" v={data.mortinatoMadreLugarNacMunicipio} cls="f-third" />
              </div>
              <div className="row">
                <F l="23. Edad" v={data.mortinatoMadreEdad?.toString()} cls="f-quarter" />
                <F l="24. Estado civil" v={data.mortinatoMadreEstadoCivil ? EC[data.mortinatoMadreEstadoCivil] ?? '' : ''} cls="f-quarter" />
                <F l="25. Pueblo de pertenencia" v={data.mortinatoMadrePuebloPertenencia ? PUEBLO[data.mortinatoMadrePuebloPertenencia] ?? '' : ''} cls="f-half" />
              </div>
              <div className="row">
                <F l="26. Residencia — Dirección" v={data.mortinatoMadreResidenciaDireccion} cls="f-half" />
                <F l="Municipio" v={data.mortinatoMadreResidenciaMunicipio} cls="f-third" />
                <F l="Departamento" v={data.mortinatoMadreResidenciaDepartamento} cls="f-third" />
              </div>
              <div className="row">
                <F l="27. Ocupación" v={data.mortinatoMadreOcupacion} cls="f-third" />
                <F l="28. Sabe leer y escribir" v={data.mortinatoMadreSabeLeer ? ['', 'Sí', 'No', '', '', '', '', '', '', 'Ignorado'][data.mortinatoMadreSabeLeer] ?? '' : ''} cls="f-third" />
                <F l="29. Escolaridad" v={data.mortinatoMadreEscolaridad != null ? ESCOL[data.mortinatoMadreEscolaridad] ?? '' : ''} cls="f-third" />
              </div>
              <div className="row">
                <F l="30. Nacionalidad" v={data.mortinatoMadreNacionalidad} cls="f-third" />
                <F l="31. Embarazos anteriores — Nacidos vivos" v={data.mortinatoEmbarazosNacidosVivos?.toString()} cls="f-third" />
                <F l="Nacidos muertos" v={data.mortinatoEmbarazosNacidosMuertos?.toString()} cls="f-third" />
              </div>
              <div className="row"><span className="f-lbl f-full" style={{ display: 'block', marginBottom: 2, fontWeight: 700 }}>DATOS DEL FETO (MORTINATO)</span></div>
              <div className="row">
                <F l="32. Sexo" v={data.mortinatoFetoSexo ? SEXO[data.mortinatoFetoSexo] ?? '' : ''} cls="f-quarter" />
                <F l="33. Murió" v={data.mortinatoFetoMurio ? ['', 'Antes del Parto', 'Durante el Parto'][data.mortinatoFetoMurio] ?? '' : ''} cls="f-quarter" />
                <F l="34. El parto fue" v={data.mortinatoPartoFue ? ['', 'Simple', 'Doble', 'Múltiple'][data.mortinatoPartoFue] ?? '' : ''} cls="f-quarter" />
                <F l="35. Clase de parto" v={data.mortinatoClaseParto ? ['', 'Eutócico', 'Distócico'][data.mortinatoClaseParto] ?? '' : ''} cls="f-quarter" />
              </div>
              <div className="row">
                <F l="36. Vía del parto" v={data.mortinatoViaParto ? ['', 'Vaginal', 'Cesárea'][data.mortinatoViaParto] ?? '' : ''} cls="f-quarter" />
                <F l="37. Semanas de gestación" v={data.mortinatoSemanasGestacion?.toString()} cls="f-quarter" />
              </div>
              <div className="row">
                <F l="38. Causas del mortinato — Fetales" v={data.mortinatoCausasFetales} cls="f-half" />
                <F l="Maternas" v={data.mortinatoCausasMaternas} cls="f-half" />
              </div>
            </>
          )}

          <SB t="VII. OTROS DATOS DE LA DEFUNCIÓN" />
          <div className="row">
            <F l="39. Hubo necropsia" v={data.otrosHuboNecropsia ? ['', 'Sí', 'No'][data.otrosHuboNecropsia] ?? '' : ''} cls="f-quarter" />
            <F l="40. Clase de asistencia recibida" v={data.otrosClaseAsistencia ? ASIST[data.otrosClaseAsistencia] ?? '' : ''} cls="f-third" />
            <F l="41. Lugar donde ocurrió la defunción" v={data.otrosLugarDefuncion ? LUGAR_DEF[data.otrosLugarDefuncion] ?? '' : ''} cls="f-third" />
          </div>

          {/* Cierre */}
          <div className="close-blk">
            <div className="timbre-box">TIMBRE<br />MÉDICO</div>
            <div className="sello-box">SELLO<br />INSTITUCIONAL<br />Y/O PROFESIONAL</div>
            <div className="legal-txt">
              "Y para que se haga la inscripción respectiva en el Registro Nacional de las Personas,
              se emite el presente Informe de defunción, en ________________________________<br /><br />
              a los _______ días del mes de _______________________ del año __________________<br /><br />
              Firma de la persona que extiende el informe: ____________________________________"
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
