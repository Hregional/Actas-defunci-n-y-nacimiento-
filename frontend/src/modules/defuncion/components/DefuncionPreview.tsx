import {
  Dialog, DialogContent, DialogActions, Button, Box,
  Typography, IconButton,
} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'
import { usePrint } from '@/shared/hooks/usePrint'
import { PRINT_CSS } from '@/shared/styles/printStyles'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

/* ── Catálogos ─────────────────────────────────────────── */
const SEXO: Record<number,string>      = {1:'Hombre',2:'Mujer',9:'Ignorado'}
const EC: Record<number,string>        = {1:'Soltero(a)',2:'Casado(a)',3:'Unido(a)',9:'Ignorado'}
const PUEBLO: Record<number,string>    = {1:'Maya',2:'Garífuna',3:'Xinka',4:'Mestizo, Ladino',5:'Ninguno',9:'Ignorado'}
const ESCOL: Record<number,string>     = {
  0:'Ninguna',1:'Primaria incompleta',2:'Primaria completa',
  3:'Básico incompleto',4:'Básico completo',5:'Diversificado incompleto',
  6:'Diversificado completo',7:'Universitario incompleto',8:'Universitario completo',9:'Ignorado'
}
const ASIST: Record<number,string>     = {1:'Médica',2:'Paramédica',3:'Comadrona',4:'Empírica',5:'Ninguna',9:'Ignorado'}
const LUGAR_DEF: Record<number,string> = {
  1:'Hospital Público',2:'Hospital Privado',3:'Otros servicios de salud pública',
  4:'IGSS',5:'Vía Pública',6:'Domicilio',7:'Lugar de trabajo',8:'Otro',9:'Ignorado'
}
const LUGAR_LES: Record<number,string> = {
  0:'Vivienda',1:'Institución residencial',2:'Escuela u oficina pública',3:'Áreas deportivas',
  4:'Calle o carretera (vía pública)',5:'Área comercial o de servicios',
  6:'Área industrial (taller, fábrica u obra)',7:'Granja (rancho o parcela)',8:'Otro',9:'Ignorado'
}
const MUE_DUR: Record<number,string>   = {
  1:'El embarazo',2:'El parto',
  3:'El puerperio (Dentro de los 42 días siguientes a la terminación del embarazo)',
  4:'De 43 días a 11 meses, después del parto o aborto',
  5:'No estuvo embarazada durante los 11 meses previos a la muerte',9:'Ignorado'
}
const QUIEN: Record<number,string>     = {1:'Médico',2:'Paramédico',3:'Autoridad'}

/* ── Subcomponentes ────────────────────────────────────── */
function F({ l, v, cls='f' }: { l:string; v?:string|number|null; cls?:string }) {
  return (
    <div className={cls}>
      <span className="f-lbl">{l}</span>
      <div className="f-val">{v ?? ''}</div>
    </div>
  )
}
function SB({ t }: { t:string }) { return <div className="sec-bar">{t}</div> }

interface Props { open:boolean; onClose:()=>void; data:Partial<DefuncionFormValues> }

export default function DefuncionPreview({ open, onClose, data }: Props) {
  const { printRef, print } = usePrint('Informe de Defunción — HRO')

  const fecha    = data.infoFechaDefuncion ? dayjs(data.infoFechaDefuncion).format('DD/MM/YYYY') : ''
  const edadStr  = (() => {
    if (data.fallecidoEdadAnos)  return `${data.fallecidoEdadAnos} años`
    if (data.fallecidoEdadMeses) return `${data.fallecidoEdadMeses} meses`
    if (data.fallecidoEdadDias)  return `${data.fallecidoEdadDias} días`
    if (data.fallecidoEdadHoras) return `${data.fallecidoEdadHoras} horas`
    return ''
  })()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <Box sx={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        px:2, py:1.5, borderBottom:1, borderColor:'divider', bgcolor:'#1a1a1a',
      }}>
        <Typography variant="h6" fontWeight={700} color="white">
          Vista previa — Informe de Defunción
        </Typography>
        <Box display="flex" gap={1}>
          <Button variant="contained" startIcon={<PrintIcon />} onClick={print} size="small"
            sx={{ bgcolor:'white', color:'#1a1a1a', '&:hover':{ bgcolor:'#f0f0f0' } }}>
            Imprimir / PDF
          </Button>
          <IconButton onClick={onClose} size="small" sx={{ color:'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p:2, bgcolor:'#e8e8e8' }}>
        <style>{PRINT_CSS}</style>
        <Box ref={printRef} sx={{
          bgcolor:'white', p:1.5, border:'1px solid #ccc',
          maxWidth:740, mx:'auto', fontFamily:'Arial,sans-serif', fontSize:'0.72rem',
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
            <F l="3. Quién informa es" v={data.infoQuienInformaTipo ? `${data.infoQuienInformaTipo}. ${QUIEN[data.infoQuienInformaTipo]??''}` : ''} cls="f-quarter" />
            <F l="3.1 No. de colegiado" v={data.infoNoColegiado} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="2. Documento de Identificación (CUI)" v={data.infoDocumentoIdentificacion} cls="f-half" />
            <F l="4. Fecha de la defunción (DD/MM/YYYY)" v={fecha} cls="f-quarter" />
            <F l="A las (hora)" v={data.infoHoraDefuncion} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="5. Lugar y dirección donde ocurrió la defunción — Dirección exacta" v={data.infoLugarDireccion} cls="f-half" />
            <F l="Municipio" v={data.infoLugarMunicipio} cls="f-quarter" />
            <F l="Departamento" v={data.infoLugarDepartamento} cls="f-quarter" />
          </div>

          <div className="aviso">SI LA MUERTE ES FETAL, INICIE EN EL APARTADO VI. DATOS DE LA DEFUNCIÓN FETAL (MORTINATO)</div>

          <SB t="II. DATOS DEL FALLECIDO (A)" />
          <div className="row"><span className="f-lbl f-full" style={{display:'block',marginBottom:2}}>FALLECIÓ:</span></div>
          <div className="row">
            <F l="6. Nombre — Nombres y apellidos completos" v={data.fallecidoNombreCompleto} cls="f-full" />
          </div>
          <div className="row">
            <F l="7. Sexo" v={data.fallecidoSexo ? `${data.fallecidoSexo}. ${SEXO[data.fallecidoSexo]??''}`:''} cls="f-quarter" />
            <F l="8. Edad cumplida" v={edadStr} cls="f-quarter" />
            <F l="Horas (menor de 1 día)" v={data.fallecidoEdadHoras?.toString()} cls="f-quarter" />
            <F l="Días (menor de 1 mes)" v={data.fallecidoEdadDias?.toString()} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="9. Documento de Identificación — No. CUI/Cédula" v={data.fallecidoDocNumero} cls="f-third" />
            <F l="No. de Libro" v={data.fallecidoDocLibro} cls="f-third" />
            <F l="No. de Folio" v={data.fallecidoDocFolio} cls="f-third" />
          </div>
          <div className="row">
            <F l="10. Lugar de nacimiento — País" v={data.fallecidoLugarNacPais} cls="f-third" />
            <F l="Departamento" v={data.fallecidoLugarNacDepartamento} cls="f-third" />
            <F l="Municipio" v={data.fallecidoLugarNacMunicipio} cls="f-third" />
          </div>
          <div className="row">
            <F l="11. Nacionalidad" v={data.fallecidoNacionalidad} cls="f-half" />
            <F l="12. Ocupación" v={data.fallecidoOcupacion} cls="f-half" />
          </div>
          <div className="row">
            <F l="13. Estado civil" v={data.fallecidoEstadoCivil ? `${data.fallecidoEstadoCivil}. ${EC[data.fallecidoEstadoCivil]??''}`:''} cls="f-third" />
            <F l="14. Pueblo de pertenencia" v={data.fallecidoPuebloPertenencia ? `${data.fallecidoPuebloPertenencia}. ${PUEBLO[data.fallecidoPuebloPertenencia]??''}`:''} cls="f-third" />
            <F l="16. Escolaridad" v={data.fallecidoEscolaridad!=null ? `${data.fallecidoEscolaridad}. ${ESCOL[data.fallecidoEscolaridad]??''}`:''} cls="f-third" />
          </div>
          <div className="row">
            <F l="15. Residencia — Dirección exacta" v={data.fallecidoResidenciaDireccion} cls="f-half" />
            <F l="Municipio" v={data.fallecidoResidenciaMunicipio} cls="f-quarter" />
            <F l="Departamento" v={data.fallecidoResidenciaDepartamento} cls="f-quarter" />
          </div>

          <SB t="III. MUJERES EN EDAD FÉRTIL" />
          <div className="row">
            <F l="17. Si la defunción corresponde a una mujer entre 10 y 54 años, la muerte ocurrió durante"
              v={data.fertilMuerteDurante ? `${data.fertilMuerteDurante}. ${MUE_DUR[data.fertilMuerteDurante]??''}`:''} cls="f-full" />
          </div>

          <SB t="IV. CAUSA DE DEFUNCIÓN" />
          <div className="causa-box">
            <div className="causa-lbl">I. Enfermedad o estado patológico que produjo la muerte directamente*</div>
            <div className="causa-lbl">Causas antecedentes. Estados morbosos que produjeron la causa consignada arriba, mencionándose en el último lugar la causa básica</div>
            <div style={{display:'flex',gap:6,alignItems:'flex-end',marginTop:2,marginBottom:3}}>
              <span style={{fontSize:'6pt',fontWeight:700,width:80,flexShrink:0}}>Causa / Estado</span>
              <span style={{flex:3,fontSize:'6pt',textAlign:'center'}}>Descripción</span>
              <span style={{flex:1,fontSize:'6pt',textAlign:'center'}}>Intervalo aprox.</span>
            </div>
            {[
              ['(a) Causa directa', data.causaIa, data.causaIaIntervalo],
              ['(b)', data.causaIb, data.causaIbIntervalo],
              ['(c)', data.causaIc, data.causaIcIntervalo],
              ['(d) Causa básica', data.causaId, data.causaIdIntervalo],
            ].map(([k,v,i]) => (
              <div key={String(k)} className="causa-row">
                <span className="causa-key">{k}</span>
                <div className="causa-val">{String(v ?? '')}</div>
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
              <div className="f-val" style={{minHeight:16,marginTop:2}}>{data.causaIi ?? ''}</div>
            </div>
          </div>

          <SB t="V. DEFUNCIONES ACCIDENTALES Y VIOLENTAS" />
          <div className="row">
            <F l="19. Fue un presunto" v={data.accidentalFuePresunto ? `${data.accidentalFuePresunto}. ${['','Suicidio','Homicidio','Accidente'][data.accidentalFuePresunto]??'Ignorado'}`:''} cls="f-quarter" />
            <F l="19.1 Lugar donde ocurrió la lesión" v={data.accidentalLugarLesion!=null ? `${data.accidentalLugarLesion}. ${LUGAR_LES[data.accidentalLugarLesion]??''}`:''} cls="f-half" />
          </div>
          <div className="row">
            <F l="19.2 Ocurrió en el desempeño de su trabajo" v={data.accidentalOcurrioTrabajo ? ['','Sí','No','','','','','','','Ignorado'][data.accidentalOcurrioTrabajo]??'':''} cls="f-third" />
            <F l="19.3 Fue accidente de tránsito" v={data.accidentalFueTransito ? ['','Sí','No','','','','','','','Ignorado'][data.accidentalFueTransito]??'':''} cls="f-third" />
            <F l="19.4 Arma que lo produjo" v={data.accidentalArmaProdujo} cls="f-third" />
          </div>

          <SB t="VI. DATOS DE LA DEFUNCIÓN FETAL (MORTINATO)" />
          <div className="row"><span className="f-lbl f-full" style={{display:'block',marginBottom:2,fontWeight:700}}>DATOS DE LA MADRE</span></div>
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
            <F l="24. Estado civil" v={data.mortinatoMadreEstadoCivil ? `${data.mortinatoMadreEstadoCivil}. ${EC[data.mortinatoMadreEstadoCivil]??''}`:''} cls="f-quarter" />
            <F l="25. Pueblo de pertenencia" v={data.mortinatoMadrePuebloPertenencia ? `${data.mortinatoMadrePuebloPertenencia}. ${PUEBLO[data.mortinatoMadrePuebloPertenencia]??''}`:''} cls="f-half" />
          </div>
          <div className="row">
            <F l="26. Residencia — Dirección" v={data.mortinatoMadreResidenciaDireccion} cls="f-half" />
            <F l="Municipio" v={data.mortinatoMadreResidenciaMunicipio} cls="f-quarter" />
            <F l="Departamento" v={data.mortinatoMadreResidenciaDepartamento} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="27. Ocupación" v={data.mortinatoMadreOcupacion} cls="f-third" />
            <F l="28. Sabe leer y escribir" v={data.mortinatoMadreSabeLeer ? ['','Sí','No','','','','','','','Ignorado'][data.mortinatoMadreSabeLeer]??'':''} cls="f-third" />
            <F l="29. Escolaridad" v={data.mortinatoMadreEscolaridad!=null ? `${data.mortinatoMadreEscolaridad}. ${ESCOL[data.mortinatoMadreEscolaridad]??''}`:''} cls="f-third" />
          </div>
          <div className="row">
            <F l="30. Nacionalidad" v={data.mortinatoMadreNacionalidad} cls="f-third" />
            <F l="31. Embarazos anteriores — Nacidos vivos" v={data.mortinatoEmbarazosNacidosVivos?.toString()} cls="f-third" />
            <F l="Nacidos muertos" v={data.mortinatoEmbarazosNacidosMuertos?.toString()} cls="f-third" />
          </div>
          <div className="row"><span className="f-lbl f-full" style={{display:'block',marginBottom:2,fontWeight:700}}>DATOS DEL FETO (MORTINATO)</span></div>
          <div className="row">
            <F l="32. Sexo" v={data.mortinatoFetoSexo ? `${data.mortinatoFetoSexo}. ${SEXO[data.mortinatoFetoSexo]??''}`:''} cls="f-quarter" />
            <F l="33. Murió" v={data.mortinatoFetoMurio ? ['','Antes del Parto','Durante el Parto'][data.mortinatoFetoMurio]??'':''} cls="f-quarter" />
            <F l="34. El parto fue" v={data.mortinatoPartoFue ? ['','Simple','Doble','Múltiple'][data.mortinatoPartoFue]??'':''} cls="f-quarter" />
            <F l="35. Clase de parto" v={data.mortinatoClaseParto ? ['','Eutócico','Distócico'][data.mortinatoClaseParto]??'':''} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="36. Vía del parto" v={data.mortinatoViaParto ? ['','Vaginal','Cesárea'][data.mortinatoViaParto]??'':''} cls="f-quarter" />
            <F l="37. Semanas de gestación" v={data.mortinatoSemanasGestacion?.toString()} cls="f-quarter" />
          </div>
          <div className="row">
            <F l="38. Causas del mortinato — Fetales" v={data.mortinatoCausasFetales} cls="f-half" />
            <F l="Maternas" v={data.mortinatoCausasMaternas} cls="f-half" />
          </div>

          <SB t="VII. OTROS DATOS DE LA DEFUNCIÓN" />
          <div className="row">
            <F l="39. Hubo necropsia" v={data.otrosHuboNecropsia ? ['','Sí','No'][data.otrosHuboNecropsia]??'':''} cls="f-quarter" />
            <F l="40. Clase de asistencia recibida" v={data.otrosClaseAsistencia ? `${data.otrosClaseAsistencia}. ${ASIST[data.otrosClaseAsistencia]??''}`:''} cls="f-third" />
            <F l="41. Lugar donde ocurrió la defunción" v={data.otrosLugarDefuncion ? `${data.otrosLugarDefuncion}. ${LUGAR_DEF[data.otrosLugarDefuncion]??''}`:''} cls="f-third" />
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
          <p className="continua">/ CONTINÚA AL REVERSO</p>

          {/* ════════════ REVERSO — PÁGINA 2 ════════════ */}
          <div className="page-break" />

          <div className="form-header">
            <div className="form-header-top">
              <img src="/assets/images/1-LogoINE.png" alt="INE" />
              <img src="/assets/images/2-LogoRENAP.jpg" alt="RENAP" />
              <div className="form-header-center">
                <h1>INSTRUCCIONES PARA EL LLENADO DEL INFORME DE DEFUNCIÓN</h1>
              </div>
              <img src="/assets/images/3-LogoHRO.jpg" alt="HRO" />
            </div>
          </div>

          <div className="rev-wrap" style={{ borderTop: 'none', paddingTop: 4 }}>
            <div className="rev-section">
              <div className="rev-sec-title">INSTRUCCIONES GENERALES:</div>
              <div className="rev-body">
                <div className="rev-item">• Este informe debe llenarse en forma clara con letra de molde y tinta firme o a máquina. No se aceptará con tachones, borrones, sobre escritura o cualquier tipo de alteración.</div>
                <div className="rev-item">• No use abreviaturas.</div>
                <div className="rev-item">• Para las preguntas de opción, anote el número que corresponde con la respuesta correcta.</div>
                <div className="rev-item">• Para las respuestas en las que se deben anotar números (fecha, hora, colegiado, edad, CUI, etcétera), use números arábigos (1,2,3…9).</div>
                <div className="rev-item">• Debe colocarse el timbre médico en el espacio correspondiente cuando aplique.</div>
              </div>
            </div>

            <div className="rev-section">
              <div className="rev-sec-title">INSTRUCCIONES ESPECÍFICAS:</div>
              <div className="rev-body">
                <div className="rev-item"><strong>2 DOCUMENTO DE IDENTIFICACIÓN:</strong> Los guatemaltecos y extranjeros domiciliados podrán identificarse con DPI o Cédula de vecindad acompañada de constancia RENAP. En caso que no sea posible la identificación mediante el DPI por robo, pérdida o deterioro, se aceptará certificación del DPI (consignar CUI). Los extranjeros se identificarán con pasaporte vigente; los centroamericanos también con el documento de identificación de su país. Los refugiados con la cédula de identidad de refugiado.</div>
                <div className="rev-item"><strong>3.1 NÚMERO DE COLEGIADO:</strong> Anote el número de colegiado (si es médico(a) o enfermero(a) graduado(a)).</div>
                <div className="rev-item"><strong>6 NOMBRE DEL FALLECIDO(A):</strong> Escriba los nombres y apellidos completos. Si se trata de un homicidio, accidente, suicidio u otra causa que impida la identificación del cadáver, anote la palabra <em>desconocido</em>. En el caso de que el fallecido(a) sea un recién nacido, anote al menos los apellidos paternos y/o maternos.</div>
                <div className="rev-item"><strong>8 EDAD CUMPLIDA:</strong> Para menores de un día, anote la edad en horas (entre 0 y 23). Para menores de un mes, en días (entre 1 y 29). Para menores de un año, en meses (entre 1 y 11). Para los que tenían más de un año, anote solamente los años cumplidos.</div>
                <div className="rev-item"><strong>9 DOCUMENTO DE IDENTIFICACIÓN (fallecido):</strong> La persona fallecida podrá identificarse con DPI, Cédula de vecindad o certificación de inscripción de nacimiento (consignar número de libro, folio y partida o número de CUI).</div>
                <div className="rev-item"><strong>12 y 27 OCUPACIÓN:</strong> Anote el último oficio o trabajo. Si no trabajaba por remuneración, mencione a qué se dedicaba (rentista, jubilado, estudiante, ama de casa, etc.).</div>
                <div className="rev-item"><strong>15 y 26 RESIDENCIA:</strong> Anote la dirección exacta (número de casa, calle, avenida, zona, nombre de ciudad/pueblo/colonia/aldea/caserío/finca/paraje), municipio y departamento de residencia durante los últimos seis meses, exceptuando períodos largos de hospitalización.</div>
                <div className="rev-item"><strong>17 SI LA DEFUNCIÓN CORRESPONDE A UNA MUJER ENTRE 10 Y 54 AÑOS:</strong> No omita responder la pregunta.</div>
              </div>
            </div>

            <div className="rev-section">
              <div className="rev-sec-title">IV CAUSA DE DEFUNCIÓN:</div>
              <div className="rev-body">
                <div className="rev-item"><strong>18 CAUSA DE DEFUNCIÓN:</strong> El informe está diseñado para obtener información que facilitará la selección de la causa básica de la defunción. El modelo consiste de dos partes (I y II).</div>
                <div className="rev-item">En la parte I se inscribe la causa que condujo directamente a la muerte en la línea (a) y los estados patológicos antecedentes en las líneas (b), (c) y (d). Indique la causa básica en la última línea de la secuencia.</div>
                <div className="rev-item">En la parte II se incluye cualquier otra entidad morbosa significativa que hubiera influido desfavorablemente en el curso del proceso patológico.</div>
              </div>

              <div className="rev-example">
                <div className="rev-ex-title">Ejemplo (Fallecido de 40 años):</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 3 }}>
                    {[['(a)','Peritonitis','1 día'],['(b)','Absceso hepático amebiano roto a cavidad abdominal','2 días'],['(c)','Colitis amebiana','2 meses'],['(d)','','']].map(([k,v,i])=>(
                      <div key={String(k)} className="rev-ex-row">
                        <span className="rev-ex-key">{k}</span>
                        <div className="rev-ex-val">{String(v)}</div>
                        <div className="rev-ex-int">{String(i)}</div>
                      </div>
                    ))}
                    <div style={{ fontSize: '5.5pt', marginTop: 3, fontStyle: 'italic' }}>II. Otros estados: Enfermedad vascular cerebral (5 años) / Cardiopatía hipertensiva (10 años)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rev-section">
              <div className="rev-body">
                <div className="rev-item"><strong>19 FUE UN PRESUNTO:</strong> Este apartado es para especificar la intencionalidad de la muerte. Estos datos no prejuzgan sobre la calificación del hecho que en definitiva hicieren los tribunales, es únicamente para fines estadísticos.</div>
                <div className="rev-item"><strong>19.1 LUGAR DONDE OCURRIÓ LA LESIÓN:</strong> Especifique la opción correspondiente dado que ésta puede ser diferente a la del sitio donde ocurrió la defunción.</div>
                <div className="rev-item"><strong>VI DATOS DE LA DEFUNCIÓN FETAL (MORTINATO):</strong> Se entiende por defunción fetal la muerte de un producto de la concepción, antes de su expulsión o extracción completa del cuerpo de su madre; la muerte está indicada por el hecho de que después de la separación el feto no respira ni da ninguna otra señal de vida (latidos del corazón, pulsación del cordón umbilical, etc.).</div>
                <div className="rev-item"><strong>21 MADRE GUATEMALTECA MENOR DE EDAD:</strong> Podrá identificarse con certificación de nacimiento (número de libro, folio y partida o número de CUI).</div>
                <div className="rev-item"><strong>31 EN LOS EMBARAZOS ANTERIORES A ÉSTE TUVO:</strong> Del total de embarazos tenidos por la madre, anote cuántos hijos nacieron vivos (independientemente si a la fecha están vivos o no) y cuántos nacieron muertos.</div>
                <div className="rev-item"><strong>37 SEMANAS DE GESTACIÓN:</strong> Anote la duración del embarazo en semanas completas, contando a partir de la última menstruación hasta el momento de la extracción o expulsión del producto.</div>
                <div className="rev-item"><strong>38 CAUSAS DEL MORTINATO:</strong> Se entiende por causa fetal la muerte relacionada directamente con el feto (Ej: Asfixia perinatal, circular del cordón). Por causa maternal, la muerte fetal relacionada directamente con la madre (Ej: Eclampsia).</div>
              </div>
            </div>
          </div>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px:2, pb:2, gap:1 }}>
        <Button onClick={onClose} variant="outlined">Cerrar</Button>
        <Button onClick={print} variant="contained" startIcon={<PrintIcon />}>
          Imprimir / Generar PDF
        </Button>
      </DialogActions>
    </Dialog>
  )
}
