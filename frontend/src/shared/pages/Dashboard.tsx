import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Divider, Stack, Paper, Skeleton,
} from '@mui/material'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, Legend,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts'
import {
  useResumen,
  usePorMes,
  useUltimaSemana,
} from '@/modules/estadisticas/hooks/useEstadisticas'
import dayjs from 'dayjs'

/* ── Paleta ─────────────────────────────────────────────── */
const BLUE  = '#003087'
const TEAL  = '#00897B'
const AMBER = '#F57C00'
const SLATE = '#546E7A'
const PIE_COLORS = [BLUE, TEAL]

/* ── Tarjeta de estadística ─────────────────────────────── */
function StatCard({
  title, value, subtitle, icon, color, loading,
}: {
  title: string; value: number | string; subtitle: string
  icon: React.ReactNode; color: string; loading?: boolean
}) {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}
              textTransform="uppercase" sx={{ letterSpacing: '0.06em', fontSize: '0.7rem' }}>
              {title}
            </Typography>
            {loading
              ? <Skeleton width={80} height={52} />
              : (
                <Typography variant="h3" fontWeight={800} color={color} sx={{ lineHeight: 1.1, mt: 0.5 }}>
                  {value}
                </Typography>
              )}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {subtitle}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}18` }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

/* ── Contenedor de gráfica ──────────────────────────────── */
function ChartCard({ title, children, loading }: {
  title: string; children: React.ReactNode; loading?: boolean
}) {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5, height: '100%' }}>
      <Typography variant="subtitle1" fontWeight={700} color="text.primary" mb={2}>
        {title}
      </Typography>
      {loading
        ? <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
        : children}
    </Paper>
  )
}

/* ── Tooltip personalizado ──────────────────────────────── */
const tooltipStyle = {
  contentStyle: { borderRadius: 8, fontSize: 12, border: '1px solid #e0e0e0' },
}

/* ── Dashboard ──────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate()
  const today    = dayjs()

  const { data: resumen, isLoading: loadingResumen } = useResumen()
  const { data: porMes,  isLoading: loadingMes }     = usePorMes()
  const { data: semana,  isLoading: loadingSemana }   = useUltimaSemana()

  // Datos para el pie chart (usa resumen real)
  const pieData = resumen
    ? [
        { name: 'Nacimientos', value: resumen.totalNacimientos || 1 },
        { name: 'Defunciones', value: resumen.totalDefunciones || 1 },
      ]
    : [{ name: 'Nacimientos', value: 1 }, { name: 'Defunciones', value: 1 }]

  // Datos acumulados para área chart (acumula los datos mensuales reales)
  const areaData = porMes?.reduce<{ mes: string; Nacimientos: number; Defunciones: number }[]>(
    (acc, cur) => {
      const prev = acc[acc.length - 1]
      acc.push({
        mes: cur.periodo,
        Nacimientos: (prev?.Nacimientos ?? 0) + cur.nacimientos,
        Defunciones: (prev?.Defunciones ?? 0) + cur.defunciones,
      })
      return acc
    },
    []
  ) ?? []

  return (
    <Box>
      {/* Encabezado */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}
        justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary.main">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hospital Regional de Occidente · {today.format('dddd, D [de] MMMM [de] YYYY')}
          </Typography>
        </Box>
        <Stack direction="row" gap={1.5} mt={{ xs: 2, sm: 0 }}>
          <Button variant="outlined" startIcon={<ChildCareIcon />}
            onClick={() => navigate('/nacimientos/nuevo')}>
            Nuevo Nacimiento
          </Button>
          <Button variant="contained" startIcon={<LocalHospitalIcon />}
            onClick={() => navigate('/defunciones/nuevo')}>
            Nueva Defunción
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Tarjetas de estadísticas — datos REALES del API */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Nacimientos"
            value={(resumen?.totalNacimientos ?? 0).toLocaleString()}
            subtitle="Informes registrados"
            color={BLUE} loading={loadingResumen}
            icon={<ChildCareIcon sx={{ color: BLUE, fontSize: 28 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Defunciones"
            value={(resumen?.totalDefunciones ?? 0).toLocaleString()}
            subtitle="Informes registrados"
            color={TEAL} loading={loadingResumen}
            icon={<LocalHospitalIcon sx={{ color: TEAL, fontSize: 28 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total General"
            value={(resumen?.totalGeneral ?? 0).toLocaleString()}
            subtitle="Todos los informes"
            color={AMBER} loading={loadingResumen}
            icon={<TrendingUpIcon sx={{ color: AMBER, fontSize: 28 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Período actual"
            value={resumen?.mesActual ?? today.format('MMMM YYYY')}
            subtitle={`Año ${resumen?.anioActual ?? today.year()}`}
            color={SLATE} loading={loadingResumen}
            icon={<CalendarTodayIcon sx={{ color: SLATE, fontSize: 28 }} />}
          />
        </Grid>
      </Grid>

      {/* Gráficas — fila 1 */}
      <Grid container spacing={2.5} mb={2.5}>
        {/* Barras — datos reales por mes */}
        <Grid item xs={12} md={8}>
          <ChartCard title={`Nacimientos vs Defunciones — ${resumen?.anioActual ?? today.year()}`}
            loading={loadingMes}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={porMes ?? []} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <RTooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="nacimientos" name="Nacimientos" fill={BLUE} radius={[4,4,0,0]} maxBarSize={28} />
                <Bar dataKey="defunciones" name="Defunciones" fill={TEAL} radius={[4,4,0,0]} maxBarSize={28} />              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Pie — distribución real */}
        <Grid item xs={12} md={4}>
          <ChartCard title="Distribución de informes" loading={loadingResumen}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  paddingAngle={4} dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Gráficas — fila 2 */}
      <Grid container spacing={2.5}>
        {/* Área — tendencia acumulada real */}
        <Grid item xs={12} md={7}>
          <ChartCard title="Tendencia acumulada del año" loading={loadingMes}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradNac" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BLUE} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDef" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <RTooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="Nacimientos" stroke={BLUE} strokeWidth={2} fill="url(#gradNac)" />
                <Area type="monotone" dataKey="Defunciones" stroke={TEAL} strokeWidth={2} fill="url(#gradDef)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Línea — actividad real de la semana */}
        <Grid item xs={12} md={5}>
          <ChartCard title="Actividad de la semana actual" loading={loadingSemana}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={semana ?? []} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <RTooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="nacimientos" name="Nacimientos" stroke={BLUE}
                  strokeWidth={2.5} dot={{ r: 4, fill: BLUE }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="defunciones" name="Defunciones" stroke={TEAL}
                  strokeWidth={2.5} dot={{ r: 4, fill: TEAL }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  )
}
