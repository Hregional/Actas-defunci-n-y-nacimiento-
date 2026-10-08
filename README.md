# Sistema de Informes — Hospital Regional de Occidente (HRO)

Sistema digitalizado para el llenado, registro, visualización e impresión de los formularios oficiales
RENAP de la República de Guatemala: **Informe de Nacimiento** e **Informe de Defunción**.

Desarrollado para el **Hospital Regional de Occidente · Quetzaltenango, Guatemala**.

---

## Requisitos previos

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| **Docker Desktop** | 4.x | https://www.docker.com/products/docker-desktop |
| **Git** | 2.x | https://git-scm.com/downloads |

> Para levantar el sistema completo **solo se necesita Docker Desktop y Git**. Node.js, Java y Maven no son necesarios.

---

## Clonar el repositorio

```bash
git clone https://github.com/Hregional/Actas-defunci-n-y-nacimiento-.git
cd RH-Informes-NacDef
```

---

## Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
copy .env.example .env
```

Editar `.env` y reemplazar los valores de `KEYCLOAK_CLIENT_SECRET` y `DB_PASSWORD` con los reales.
El resto de valores ya tienen defaults funcionales para el entorno del hospital.

> **Nunca subir el `.env` al repositorio** — ya está en `.gitignore`.

---

## Levantar el sistema

### Modo desarrollo (con hot reload)

```bash
docker compose up -d --build
```

El archivo `docker-compose.override.yml` se carga automáticamente y habilita:
- Spring Boot DevTools (hot reload del backend al guardar código Java)
- Vite HMR (hot reload del frontend al guardar código TypeScript/React)

### Modo producción (sin hot reload)

```bash
docker compose -f docker-compose.yml up -d --build
```

### Apagar

```bash
docker compose down
```

### Apagar y borrar datos (BD limpia)

```bash
docker compose down -v
```

### Ver logs

```bash
docker compose logs -f             # todos los servicios
docker compose logs -f backend     # solo backend
docker compose logs -f frontend    # solo frontend
```

---

## URLs del sistema

### Modo desarrollo

| Servicio | URL |
|---|---|
| **Frontend** (Vite dev server) | http://localhost:4200 |
| **Backend API** | http://localhost:9090/api |
| **Health check** | http://localhost:9090/api/actuator/health |
| **MySQL** | localhost:3308 · usuario: `renap_user` · BD: `renap_db` |
| **Debug remoto Java** | localhost:5005 |

### Modo producción

| Servicio | URL |
|---|---|
| **Frontend** (Nginx) | http://localhost:3001 |
| **Backend API** | http://localhost:9090/api |

---

## Arquitectura del proyecto

```
RH-Informes-NacDef/
├── backend/                    # Spring Boot 3.2 — Java 21
│   ├── src/main/java/com/renap/
│   │   ├── modules/
│   │   │   ├── nacimiento/     # Informe de Nacimiento (entity, repo, service, controller, dto, mapper)
│   │   │   ├── defuncion/      # Informe de Defunción
│   │   │   ├── estadisticas/   # Dashboard (resumen, por mes, última semana)
│   │   │   ├── admin/          # Gestión de usuarios vía Keycloak Admin API
│   │   │   └── empleados/      # Proxy hacia API de RH (sistema de asistencia)
│   │   └── shared/
│   │       ├── config/         # SecurityConfig (JWT), WebConfig (CORS)
│   │       ├── integration/    # KeycloakTokenService, RhApiClient
│   │       └── response/       # ApiResponse<T>, PageResponse<T>
│   └── src/main/resources/
│       ├── application.yml
│       └── db/changelog/       # Migraciones Liquibase
│           ├── db.changelog-master.xml
│           ├── 001-create-nacimiento.xml
│           └── 002-create-defuncion.xml
│
├── frontend/                   # React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── modules/
│   │   │   ├── nacimiento/     # Formulario 4 pasos + lista + preview impresión
│   │   │   ├── defuncion/      # Formulario 7 pasos + lista + preview impresión
│   │   │   ├── estadisticas/   # Dashboard con gráficas (Vision UI)
│   │   │   ├── admin/          # Gestión de usuarios (solo rol actas-admin)
│   │   │   └── empleados/      # Hook para autocompletar empleados
│   │   └── shared/
│   │       ├── auth/           # keycloak.ts, logout.ts
│   │       ├── context/        # KeycloakContext, UserContext
│   │       ├── api/            # axios.ts (interceptores JWT, timeout 10s, retry inteligente)
│   │       ├── components/     
│   │       │   ├── common/     # DateWheelField, LoadingScreen, CardOptionGroup, etc.
│   │       │   ├── guards/     # InitializationGuard (producción)
│   │       │   └── errors/     # ErrorBoundary (captura errores React)
│   │       ├── constants/      # institucion.ts (datos fijos del HRO)
│   │       ├── styles/         # printStyles.ts (CSS hoja carta para impresión)
│   │       └── theme/          # theme.ts (Vision UI: cyan #0BC5EA, violet #4361EE)
│   └── .env.local              # Variables para dev (NO subir al repo)
│
├── docker-compose.yml          # Producción: MySQL + Backend + Frontend(Nginx)
├── docker-compose.override.yml # Desarrollo: hot reload backend + Vite HMR
├── .env.example                # Plantilla de variables de entorno
└── .env                        # Variables reales (NO está en el repo)
```

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Backend | Spring Boot | 3.2.5 |
| Lenguaje | Java | 21 |
| Seguridad | Spring Security + OAuth2 JWT (Keycloak) | — |
| Mapeo | MapStruct + Lombok | 1.5.5 / 1.18.32 |
| Frontend | React + Vite + TypeScript | 18 / 5 / 5 |
| UI | Material UI (MUI) + Vision UI Design | v5 |
| Gráficas | Recharts | 3.x |
| Formularios | React Hook Form + Zod | 7 / 3 |
| Estado servidor | TanStack Query (retry inteligente) | v5 |
| HTTP cliente | Axios (timeout 10s, interceptores) | 1.7 |
| Base de datos | MySQL | 8.3 |
| Migraciones | Liquibase | 4.27 |
| Servidor web (prod) | Nginx | 1.27 |
| Contenedores | Docker + Docker Compose | — |

---

## Autenticación — Keycloak

El sistema usa **Keycloak** del hospital (`sso.hro.gob.gt`) para autenticación.

- **Realm**: `Hospital-O`
- **Client frontend**: `sistema-actas-frontend`
- **Client backend**: `sistema-actas`

### Roles disponibles

| Rol | Acceso |
|---|---|
| `actas-admin` | Acceso completo + gestión de usuarios |
| `actas-empleado` | Solo crear y ver informes |

### Configuración requerida en Keycloak (client `sistema-actas-frontend`)

Para desarrollo local, el cliente debe tener registradas estas URIs:

```
Valid redirect URIs:
  http://localhost:4200/*

Valid post logout redirect URIs:
  http://localhost:4200

Web origins:
  http://localhost:4200
```

---

## Base de datos

Las tablas se crean automáticamente con **Liquibase** al primer arranque del backend.
No se requiere ejecutar ningún script SQL manualmente.

Los changelogs están en `backend/src/main/resources/db/changelog/changes/`.

Conexión directa (útil para inspeccionar):
```
Host: localhost
Puerto: 3308
Usuario: renap_user
Contraseña: renap_pass (dev) — ver .env para producción
BD: renap_db
```

---

## Datos institucionales fijos

Centralizados en `frontend/src/shared/constants/institucion.ts`:

| Constante | Valor |
|---|---|
| Departamento | Quetzaltenango |
| Municipio | Quetzaltenango |
| Dirección | 0 Calle 36-40 Zona 8, Quetzaltenango |
| Lugar de nacimiento | Hospital público (código 1) |

---

## API de Recursos Humanos

El sistema consume la API del sistema de asistencia (`asistencia.hro.gob.gt`) para buscar empleados en los formularios.

### Modo mock (desarrollo local)

Cloudflare bloquea peticiones desde fuera de la red del hospital, por lo que en desarrollo se usa modo mock:

```env
RH_API_USE_MOCK=true
```

### Modo real (producción / dentro de la red del hospital)

```env
RH_API_USE_MOCK=false
RH_API_URL=https://asistencia.hro.gob.gt
```

Reiniciar el backend después de cambiar esta variable:
```bash
docker compose restart backend
```

---

## Impresión de actas

- Formato **hoja carta (letter)**, orientación vertical
- Frente (página 1): campos del formulario
- Reverso (página 2): instrucciones de llenado / huellas dactilares
- La sección "Datos del Padre" en nacimiento se omite en la impresión si no tiene datos

---

## Funcionalidades principales

### Dashboard con Vision UI Design
- **Theme profesional**: Colores cyan (#0BC5EA) y violet (#4361EE)
- **Tarjetas estadísticas**: Gradientes, iconos y valores numéricos en tiempo real
- **Gráficas modernas**: Barras por mes, pastel, tendencia acumulada, actividad semanal
- **Resumen inteligente**: Total nacimientos, defunciones, general y mes actual

### Informes de Nacimiento
- Formulario en **4 pasos** con validación por paso
- Datos del suscriptor precargados desde el perfil de Keycloak
- DPI con validación oficial (algoritmo complemento 11)
- Selector encadenado Departamento → Municipio (22 departamentos + todos sus municipios)
- Autocompletado de depto/municipio/nacionalidad al ingresar DPI guatemalteco válido
- **Conversión automática de peso**: kg → libras y onzas (precisión 3 decimales)
- **Talla con decimales**: Acepta valores como 49.5 cm (promedio real de bebés)
- **Selector de fecha optimizado**: Campo de calendario con DateWheelField
- **Estado civil simplificado**: Solo Casado/Soltero, dinámico según sexo
- **Iconos intuitivos**: PersonIcon (soltero), Diversity3Icon (anillos entrelazados para casado)
- **Bloqueo de auto-guardado**: No permite envío hasta completar datos obligatorios del paso actual
- Quién informa predeterminado: **Médico**

### Informes de Defunción
- Formulario en **7 pasos** con validación por paso
- Mismo patrón de validación y navegación que nacimiento
- **Estado civil dinámico**: Casado/Casada o Soltero/Soltera según sexo del fallecido
- **Bloqueo de auto-guardado**: Validación completa antes de permitir envío
- Quién informa predeterminado: **Médico**

### Edición de informes
- Botón **Actualizar** disponible en cada paso (no solo en el último)
- Al guardar: muestra mensaje de éxito y regresa a la lista automáticamente
- **Detección de errores 404**: Si el registro ya no existe, redirige automáticamente con mensaje informativo

### Sistema robusto para producción
- **InitializationGuard**: Garantiza que el sistema esté completamente inicializado antes de mostrar contenido
- **ErrorBoundary**: Captura errores de React con UI de recuperación elegante
- **Retry inteligente**: 3 intentos con delays progresivos (1s, 2s, 4s)
- **Sin retry innecesarios**: Detecta errores 404/403 y no reintenta
- **Timeout optimizado**: 10 segundos para respuestas rápidas
- **Loading optimizado**: Layout con skeletons en lugar de pantallas de bloqueo completas
- **Manejo de errores Docker**: Sistema resiliente ante reinicios del backend

### Administración de usuarios
- Crear, editar y deshabilitar usuarios del sistema
- Integrado con Keycloak Admin API
- Solo accesible con rol `actas-admin`

---

## Mejoras recientes (v2.0)

### Vision UI Design Theme
- **Paleta de colores profesional**: Cyan (#0BC5EA) y Violet (#4361EE)
- **Dashboard moderno**: Tarjetas con gradientes, iconos y estadísticas en tiempo real
- **Gráficas mejoradas**: Visualización clara de datos con colores del theme

### Optimizaciones de formularios
- **Conversión automática de peso**: Kilogramos → Libras y Onzas con precisión de 3 decimales
- **Talla con decimales**: Campo configurado para aceptar valores reales como 49.5 cm
- **Selector de fecha mejorado**: DateWheelField con mejor UX
- **Estado civil simplificado**: Solo 2 opciones (Casado/Soltero), dinámico según sexo
- **Iconos intuitivos**: PersonIcon para soltero, Diversity3Icon (anillos) para casado
- **Validación mejorada**: Bloqueo de envío hasta completar datos obligatorios en ambos modos (crear/editar)

### Sistema robusto para producción
- **InitializationGuard**: Previene errores al cargar el sistema antes de tiempo
- **ErrorBoundary**: Captura y maneja errores de React con UI de recuperación
- **Retry inteligente**: 3 intentos con delays progresivos (1s, 2s, 4s)
- **Detección de errores**: No reintenta en errores 404/403, redirige con mensaje informativo
- **Timeout optimizado**: 10 segundos en lugar de 30 para respuestas más rápidas
- **Loading optimizado**: Skeletons en lugar de pantallas de bloqueo completas
- **Resiliencia Docker**: Sistema estable ante reinicios del backend

### Mejoras técnicas
- **TypeScript 6.0-ready**: Configuración actualizada sin warnings de deprecación
- **React Hooks correctos**: Todos los hooks declarados antes de early returns
- **Axios mejorado**: Interceptores con mejor manejo de errores y timeouts

---

## Ramas del proyecto

| Rama | Descripción |
|---|---|
| `main` | Rama principal estable para producción |
| `feature/vision-ui-improvements` | Vision UI + mejoras de producción (listo para merge) |

Para cambiar de rama:
```bash
git checkout main                              # Cambiar a main
git checkout feature/vision-ui-improvements    # Cambiar a la rama de mejoras
```

Para ver todas las ramas:
```bash
git branch -a
```

---

## Problemas comunes

**Los cambios de código no se reflejan en el navegador:**
```bash
# En el navegador: Ctrl+Shift+R (recarga forzada sin caché)
# Esto es especialmente importante después de cambios en:
# - Theme (colores, estilos globales)
# - Validaciones de formularios
# - Configuración de TypeScript
```

**Si el problema persiste (especialmente en vite.config.ts o .env.local):**
```bash
docker compose restart frontend
```

**El backend no conecta a MySQL al arrancar:**
MySQL tarda ~30 segundos en estar listo. El healthcheck de Docker Compose espera
automáticamente. Si el backend falla, esperar y reintentar:
```bash
docker compose restart backend
```

**Error "Cannot access 'isLoading' before initialization" (React Hooks):**
Este error se resolvió moviendo todos los hooks antes de los early returns en los formularios.
Si aparece de nuevo, verificar que ningún hook se declare después de un `if` o `return` condicional.

**Errores 404 al reiniciar Docker:**
El sistema ahora tiene:
- Retry inteligente con 3 intentos y delays progresivos
- InitializationGuard que espera a que el sistema esté listo
- Detección automática de 404 con redirección informativa
- No debería ser necesario refrescar manualmente

**Sistema lento o carga con errores al iniciar:**
El InitializationGuard garantiza que el sistema esté completamente inicializado antes de
mostrar contenido. Si ves la pantalla de carga más de 30 segundos:
```bash
# Verificar logs del backend
docker compose logs -f backend

# Reiniciar si es necesario
docker compose restart backend
```

**Error "port is already allocated" al levantar:**
```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :4200
# O simplemente reiniciar Docker Desktop
```

**Rebuild completo (cuando hay cambios en dependencias o Dockerfile):**
```bash
docker compose down
docker compose up -d --build
```

**TypeScript warning "baseUrl is deprecated":**
Este warning fue resuelto eliminando `baseUrl` del `tsconfig.json` y usando solo `paths`.
El sistema es compatible con TypeScript 6.0+.

**Talla no acepta decimales:**
El campo ya está configurado como DECIMAL(5,2) en base de datos y acepta valores como 49.5.
Si no funciona, hacer hard refresh (Ctrl+Shift+R) para limpiar caché del navegador.

---

## Configuraciones avanzadas

### Retry Strategy (TanStack Query)

El sistema usa una estrategia de retry inteligente para manejar errores de red y reinicios del backend:

```typescript
// Configuración en todos los hooks (useNacimiento, useDefuncion, useEstadisticas)
{
  retry: (failureCount, error) => {
    // No reintentar en errores 404 o 403 (registro no existe o sin permisos)
    if (error?.message?.includes('404') || error?.message?.includes('403')) {
      return false;
    }
    // Máximo 3 intentos para otros errores
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => {
    // Delays progresivos: 1s, 2s, 4s
    return Math.min(1000 * 2 ** attemptIndex, 5000);
  }
}
```

### Axios Timeout

Timeout de 10 segundos en todas las peticiones HTTP:

```typescript
// frontend/src/shared/api/axios.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10 segundos
});
```

### Conversión de peso

Constantes de conversión usadas en el sistema:

```typescript
// Kilogramos → Libras
const LB_PER_KG = 2.2046226218;

// Kilogramos → Onzas
const OZ_PER_KG = 35.27396195;

// Precisión: 3 decimales
// Ejemplo: 3.5 kg = 7.716 lb = 123.459 oz
```

### Estado civil

Simplificado a 2 opciones, dinámico según sexo:

```typescript
// Para madre/padre/fallecido masculino
['Casado', 'Soltero']

// Para madre/fallecida femenino
['Casada', 'Soltera']
```

---

## Contacto y soporte

Sistema desarrollado para el **Hospital Regional de Occidente**, Quetzaltenango, Guatemala.

Para reportar problemas o solicitar mejoras, contactar al equipo de desarrollo o crear un issue en el repositorio.

---

## Licencia

Este sistema es de uso exclusivo del Hospital Regional de Occidente y el RENAP de Guatemala.
