/**
 * Dashboard — estilo Vision UI
 *
 * · Banner de bienvenida con degradado animado
 * · Stat cards con ícono en caja de gradiente y delta colorido
 * · Gráfica de área principal con relleno degradado (estilo Vision)
 * · Gráfica de barras semanal
 * · Pie/donut de distribución
 * · Accesos rápidos
 */
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Typography, Button, Stack, Skeleton,
  alpha, useTheme,
} from '@mui/material'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Legend,
} from 'recharts'
import {
  useResumen,
  usePorMes,
  useUltimaSemana,
} from '@/modules/estadisticas/hooks/useEstadisticas'
import { useCurrentUser } from '@/shared/context/UserContext'
import { useKeycloak } from '@/shared/context/KeycloakContext'
import LoadingScreen from '@/shared/components/common/LoadingScreen'
import {
  GRAD_CYAN, GRAD_VIOLET, GRAD_GREEN, GRAD_ORANGE,
} from '@/theme/theme'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')

// ── Colores de gráfica ────────────────────────────────────────────────────────
const C_CYAN = '#0BC5EA'
const C_VIOLET = '#4361EE'

// ── Tooltip personalizado de Recharts ────────────────────────────────────────
// Removido: Los gráficos ahora son solo visualización sin interactividad

// ── StatCard ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string
  value: number | string
  subtitle: string
  icon: React.ReactNode
  gradient: string
  loading?: boolean
}
function StatCard({ title, value, subtitle, icon, gradient, loading }: StatCardProps) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  return (
    <Box sx={{
      bgcolor: isLight ? '#FFFFFF' : '#111C44',
      border: `1px solid ${isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.06)}`,
      borderRadius: '20px',
      p: 2.5,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      boxShadow: isLight
        ? '0 4px 20px rgba(27,37,75,0.06)'
        : '0 4px 24px rgba(0,0,0,0.35)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: isLight
          ? '0 8px 28px rgba(27,37,75,0.10)'
          : '0 10px 32px rgba(0,0,0,0.50)',
      },
    }}>
      {/* Ícono con gradiente */}
      <Box sx={{
        width: 56, height: 56, borderRadius: '16px',
        background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 4px 14px ${alpha(C_CYAN, 0.35)}`,
      }}>
        <Box sx={{ color: '#FFFFFF', display: 'flex' }}>{icon}</Box>
      </Box>

      {/* Texto */}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" fontWeight={700}
          sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
          {title}
        </Typography>
        {loading
          ? <Skeleton width={72} height={40} sx={{ mt: 0.25 }} />
          : (
            <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.15, mt: 0.25, color: 'text.primary' }}>
              {value}
            </Typography>
          )}
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.25, display: 'block' }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}

// ── ChartCard ────────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, loading, action }: {
  title: string
  subtitle?: string
  children: React.ReactNode
  loading?: boolean
  action?: React.ReactNode
}) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  return (
    <Box sx={{
      bgcolor: isLight ? '#FFFFFF' : '#111C44',
      border: `1px solid ${isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.06)}`,
      borderRadius: '20px',
      p: 2.5,
      height: '100%',
      boxShadow: isLight
        ? '0 4px 20px rgba(27,37,75,0.06)'
        : '0 4px 24px rgba(0,0,0,0.35)',
    }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Box>
        {action}
      </Stack>
      {loading
        ? <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
        : children}
    </Box>
  )
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const { usuario } = useCurrentUser()
  const { authenticated } = useKeycloak()
  const today = dayjs()

  const { data: resumen, isLoading: loadingResumen } = useResumen()
  const { data: porMes, isLoading: loadingMes } = usePorMes()
  const { data: semana, isLoading: loadingSemana } = useUltimaSemana()

  // Mostrar loading mientras se autentica o carga el usuario
  if (!authenticated || usuario.cargando) {
    return <LoadingScreen message="Cargando datos del usuario..." />
  }
  
  // NO mostrar loading por las estadísticas — mejor mostrar el dashboard con skeletons
  // El usuario puede ver la estructura mientras cargan los datos

  // Pie data
  const pieData = resumen
    ? [
      { name: 'Nacimientos', value: resumen.totalNacimientos || 1 },
      { name: 'Defunciones', value: resumen.totalDefunciones || 1 },
    ]
    : [{ name: 'Nacimientos', value: 1 }, { name: 'Defunciones', value: 1 }]

  // Nombre corto del usuario
  const firstName = usuario.nombresApellidos?.split(' ')[0] ?? 'Doctor'

  // Colores de ejes y grid según modo
  const axisColor = isLight ? '#A3AED0' : '#4A5568'
  const gridColor = isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.04)
  const legendStyle = { fontSize: 11, color: isLight ? '#707EAE' : '#A3AED0' }

  return (
    <Box sx={{ pb: 4 }}>

      {/* ── Banner de bienvenida ── */}
      <Box sx={{
        borderRadius: '20px',
        mb: 3,
        overflow: 'hidden',
        position: 'relative',
        minHeight: { xs: 140, sm: 160 },
        background: isLight
          ? 'linear-gradient(127deg, #0B1437 0%, #1a237e 55%, #0B8FAC 100%)'
          : 'linear-gradient(127deg, #0B1437 0%, #1a237e 55%, #0BC5EA 100%)',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2.5, sm: 4 },
        py: 3,
      }}>
        {/* Círculos decorativos */}
        <Box sx={{
          position: 'absolute', right: { xs: -40, sm: 80 }, top: -40,
          width: 220, height: 220, borderRadius: '50%',
          background: alpha(C_CYAN, 0.12),
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', right: { xs: 20, sm: 160 }, bottom: -60,
          width: 160, height: 160, borderRadius: '50%',
          background: alpha(C_VIOLET, 0.15),
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', right: { xs: -20, sm: 40 }, top: 10,
          width: 100, height: 100, borderRadius: '50%',
          background: alpha(C_CYAN, 0.08),
          pointerEvents: 'none',
        }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.65), mb: 0.5 }}>
            Bienvenido de nuevo,
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ color: '#FFFFFF', mb: 0.75, lineHeight: 1.1 }}>
            {firstName}
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.55), mb: 2 }}>
            {today.format('dddd, D [de] MMMM [de] YYYY')} · Hospital Regional de Occidente
          </Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap">
            <Button
              size="small"
              startIcon={<AddCircleOutlineIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate('/nacimientos/nuevo')}
              sx={{
                bgcolor: alpha('#FFFFFF', 0.15),
                color: '#FFFFFF',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${alpha('#FFFFFF', 0.20)}`,
                borderRadius: '10px',
                '&:hover': { bgcolor: alpha('#FFFFFF', 0.25), transform: 'none', boxShadow: 'none' },
                background: 'none',
                boxShadow: 'none',
              }}
            >
              Nuevo Nacimiento
            </Button>
            <Button
              size="small"
              startIcon={<AddCircleOutlineIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate('/defunciones/nuevo')}
              sx={{
                bgcolor: alpha(C_CYAN, 0.25),
                color: '#FFFFFF',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${alpha(C_CYAN, 0.35)}`,
                borderRadius: '10px',
                '&:hover': { bgcolor: alpha(C_CYAN, 0.38), transform: 'none', boxShadow: 'none' },
                background: 'none',
                boxShadow: 'none',
              }}
            >
              Nueva Defunción
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* ── Stat cards ── */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Nacimientos"
            value={(resumen?.totalNacimientos ?? 0).toLocaleString()}
            subtitle="Informes registrados"
            gradient={GRAD_CYAN}
            loading={loadingResumen}
            icon={<ChildCareIcon sx={{ fontSize: 26 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Defunciones"
            value={(resumen?.totalDefunciones ?? 0).toLocaleString()}
            subtitle="Informes registrados"
            gradient={GRAD_VIOLET}
            loading={loadingResumen}
            icon={<LocalHospitalIcon sx={{ fontSize: 26 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total General"
            value={(resumen?.totalGeneral ?? 0).toLocaleString()}
            subtitle="Todos los informes"
            gradient={GRAD_GREEN}
            loading={loadingResumen}
            icon={<TrendingUpIcon sx={{ fontSize: 26 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Período actual"
            value={resumen?.mesActual ?? today.format('MMM YYYY')}
            subtitle={`Año ${resumen?.anioActual ?? today.year()}`}
            gradient={GRAD_ORANGE}
            loading={loadingResumen}
            icon={<CalendarTodayIcon sx={{ fontSize: 26 }} />}
          />
        </Grid>
      </Grid>

      {/* ── Fila de gráficas principal ── */}
      <Grid container spacing={2.5} mb={2.5}>

        {/* Área — tendencia anual */}
        <Grid item xs={12} lg={8}>
          <ChartCard
            title={`Nacimientos vs Defunciones — ${resumen?.anioActual ?? today.year()}`}
            subtitle="Registros mensuales del año en curso"
            loading={loadingMes}
            action={
              <Button
                size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                onClick={() => navigate('/nacimientos')}
                sx={{
                  fontSize: '0.75rem', fontWeight: 700,
                  color: C_CYAN, p: '4px 10px',
                  '&:hover': { bgcolor: alpha(C_CYAN, 0.08), transform: 'none', boxShadow: 'none' },
                  background: 'none', boxShadow: 'none',
                }}
              >
                Ver listado
              </Button>
            }
          >
            <Box sx={{ pointerEvents: 'none', userSelect: 'none' }}>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={porMes ?? []} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gNac" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C_CYAN} stopOpacity={0.40} />
                      <stop offset="100%" stopColor={C_CYAN} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gDef" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C_VIOLET} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={C_VIOLET} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
                  <Area
                    type="monotone" dataKey="nacimientos" name="Nacimientos"
                    stroke={C_CYAN} strokeWidth={3} fill="url(#gNac)"
                    dot={false} activeDot={false} isAnimationActive={false}
                  />
                  <Area
                    type="monotone" dataKey="defunciones" name="Defunciones"
                    stroke={C_VIOLET} strokeWidth={3} fill="url(#gDef)"
                    dot={false} activeDot={false} isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        {/* Pie — distribución */}
        <Grid item xs={12} lg={4}>
          <ChartCard
            title="Distribución"
            subtitle="Proporción de informes registrados"
            loading={loadingResumen}
          >
            <Box sx={{ pointerEvents: 'none', userSelect: 'none' }}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <defs>
                    <linearGradient id="pieCyan" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={C_CYAN} />
                      <stop offset="100%" stopColor="#0B8FAC" />
                    </linearGradient>
                    <linearGradient id="pieViolet" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={C_VIOLET} />
                      <stop offset="100%" stopColor="#3A0CA3" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={62} outerRadius={92}
                    paddingAngle={5}
                    dataKey="value"
                    strokeWidth={0}
                    isAnimationActive={false}
                  >
                    <Cell fill="url(#pieCyan)" />
                    <Cell fill="url(#pieViolet)" />
                  </Pie>
                  <Legend
                    wrapperStyle={legendStyle}
                    iconType="circle" iconSize={8}
                    formatter={(value) => (
                      <span style={{ color: isLight ? '#707EAE' : '#A3AED0', fontWeight: 600 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Resumen numérico debajo */}
            {resumen && (
              <Grid container spacing={1} mt={0.5}>
                <Grid item xs={6}>
                  <Box sx={{
                    p: 1.5, borderRadius: '12px',
                    background: alpha(C_CYAN, isLight ? 0.08 : 0.12),
                    textAlign: 'center',
                  }}>
                    <Typography variant="h5" fontWeight={800} sx={{ color: C_CYAN }}>
                      {resumen.totalNacimientos}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Nacimientos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{
                    p: 1.5, borderRadius: '12px',
                    background: alpha(C_VIOLET, isLight ? 0.08 : 0.12),
                    textAlign: 'center',
                  }}>
                    <Typography variant="h5" fontWeight={800} sx={{ color: C_VIOLET }}>
                      {resumen.totalDefunciones}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Defunciones
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* ── Fila inferior ── */}
      <Grid container spacing={2.5}>

        {/* Barras — actividad semanal */}
        <Grid item xs={12} md={7}>
          <ChartCard
            title="Actividad de la semana"
            subtitle="Registros de los últimos 7 días"
            loading={loadingSemana}
          >
            <Box sx={{ pointerEvents: 'none', userSelect: 'none' }}>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={semana ?? []} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bNac" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C_CYAN} stopOpacity={0.90} />
                      <stop offset="100%" stopColor={C_CYAN} stopOpacity={0.50} />
                    </linearGradient>
                    <linearGradient id="bDef" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C_VIOLET} stopOpacity={0.90} />
                      <stop offset="100%" stopColor={C_VIOLET} stopOpacity={0.50} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
                  <Bar dataKey="nacimientos" name="Nacimientos" fill="url(#bNac)" radius={[6, 6, 0, 0]} maxBarSize={22} isAnimationActive={false} />
                  <Bar dataKey="defunciones" name="Defunciones" fill="url(#bDef)" radius={[6, 6, 0, 0]} maxBarSize={22} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Grid>

        {/* Accesos rápidos */}
        <Grid item xs={12} md={5}>
          <ChartCard title="Accesos rápidos" subtitle="Navegación directa">
            <Stack spacing={1.5} mt={1}>
              {[
                {
                  label: 'Registrar nacimiento',
                  sub: 'Nuevo informe de nacimiento',
                  grad: GRAD_CYAN,
                  icon: <ChildCareIcon sx={{ fontSize: 20, color: '#fff' }} />,
                  path: '/nacimientos/nuevo',
                },
                {
                  label: 'Registrar defunción',
                  sub: 'Nuevo informe de defunción',
                  grad: GRAD_VIOLET,
                  icon: <LocalHospitalIcon sx={{ fontSize: 20, color: '#fff' }} />,
                  path: '/defunciones/nuevo',
                },
                {
                  label: 'Ver nacimientos',
                  sub: 'Listado de informes de nacimiento',
                  grad: GRAD_GREEN,
                  icon: <TrendingUpIcon sx={{ fontSize: 20, color: '#fff' }} />,
                  path: '/nacimientos',
                },
                {
                  label: 'Ver defunciones',
                  sub: 'Listado de informes de defunción',
                  grad: GRAD_ORANGE,
                  icon: <CalendarTodayIcon sx={{ fontSize: 20, color: '#fff' }} />,
                  path: '/defunciones',
                },
              ].map((item) => (
                <Box
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    p: 1.5, borderRadius: '14px', cursor: 'pointer',
                    border: `1px solid ${isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.05)}`,
                    bgcolor: isLight ? '#F4F7FE' : alpha('#FFFFFF', 0.03),
                    transition: 'all 0.18s ease',
                    '&:hover': {
                      bgcolor: isLight ? '#EAF0FF' : alpha('#FFFFFF', 0.07),
                      transform: 'translateX(4px)',
                      borderColor: isLight ? alpha(C_CYAN, 0.30) : alpha(C_CYAN, 0.25),
                    },
                  }}
                >
                  <Box sx={{
                    width: 38, height: 38, borderRadius: '10px',
                    background: item.grad, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.icon}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={700} color="text.primary" noWrap>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {item.sub}
                    </Typography>
                  </Box>
                  <ArrowForwardIcon sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }} />
                </Box>
              ))}
            </Stack>
          </ChartCard>
        </Grid>

      </Grid>
    </Box>
  )
}
