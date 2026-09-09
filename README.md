# Sistema de Informes — Hospital Regional de Occidente (HRO)

Sistema digitalizado para el llenado, registro, visualización e impresión de los formularios oficiales
RENAP de la República de Guatemala: **Informe de Nacimiento** e **Informe de Defunción**.

Desarrollado para el **Hospital Regional de Occidente · Quetzaltenango, Guatemala**.

---

## Requisitos previos

Antes de clonar y levantar el proyecto, cada integrante del equipo necesita tener instalado:

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|---------|
| **Docker Desktop** | 4.x o superior | https://www.docker.com/products/docker-desktop |
| **Git** | 2.x | https://git-scm.com/downloads |
| **Node.js** *(solo dev local sin Docker)* | 20 LTS | https://nodejs.org |
| **Java JDK** *(solo dev local sin Docker)* | 21 | https://adoptium.net |
| **Maven** *(solo dev local sin Docker)* | 3.9.x | https://maven.apache.org/download.cgi |

> Para levantar con Docker **solo se necesita Docker Desktop y Git**.

---

## Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd RH-Informes-NacDef
```

---

## Instalación de dependencias (primera vez — desarrollo local)

> Con Docker no necesitas instalar nada manualmente. Estos pasos son solo para desarrollo local sin Docker.

### Frontend — instalar dependencias

```bash
cd frontend
npm install
```

### Dependencias del frontend instaladas

```bash
# Todas las dependencias ya están en package.json y se instalan con npm install
# Si necesitas reinstalar alguna en específico:

# Recharts (gráficas del Dashboard)
npm install recharts@3.0.2 --save-exact

# Material UI
npm install @mui/material@5.16.7 @mui/icons-material@5.16.7 @emotion/react @emotion/styled

# MUI Date/Time Pickers
npm install @mui/x-date-pickers@7.17.0

# React Hook Form + Zod
npm install react-hook-form@7.53.0 zod@3.23.8 @hookform/resolvers@3.9.0

# TanStack Query
npm install @tanstack/react-query@5.56.2

# Axios
npm install axios@1.7.7

# DayJS (fechas)
npm install dayjs@1.11.13

# Zustand (estado global)
npm install zustand@5.0.0

# React Router
npm install react-router-dom@6.26.2
```

### Backend — no requiere instalación manual

El backend usa Maven. Las dependencias se descargan automáticamente:

```bash
cd backend
mvn install      # descarga todas las dependencias
# o directamente:
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Raíz del proyecto — no requiere instalación

No hay `package.json` en la raíz. Todo se maneja por separado en `frontend/` y `backend/`.

---

## Levantar el sistema con Docker

### Primera vez (BD limpia)

```bash
docker-compose down -v
docker-compose up --build
```

### Actualizaciones de código (conserva datos)

```bash
docker-compose down
docker-compose up --build
```

### Levantar en segundo plano

```bash
docker-compose up -d --build
```

### Ver logs

```bash
docker-compose logs -f           # todos
docker-compose logs -f backend   # solo backend
docker-compose logs -f frontend  # solo frontend
```

### Apagar

```bash
docker-compose down
```

---

## URLs del sistema

| Servicio | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:8080/api |
| **Health** | http://localhost:8080/api/actuator/health |
| **MySQL** | localhost:**3308** · usuario: `renap_user` · pass: `renap_pass` · BD: `renap_db` |

---

## Vista móvil en desarrollo

1. Abre `http://localhost:3000` en Chrome o Edge
2. **F12** → ícono del teléfono (o `Ctrl+Shift+M`)
3. Selecciona: `iPhone SE`, `iPhone 14 Pro`, `Samsung Galaxy S20`, etc.

---

## Desarrollo local sin Docker

### Backend

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173 — el proxy al backend ya está configurado en `vite.config.ts`.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|--------|
| Backend | Spring Boot | 3.2.5 |
| Lenguaje | Java | 21 |
| Mapeo objetos | MapStruct | 1.5.5 |
| Lombok | Lombok | 1.18.32 |
| Frontend | React + Vite + TypeScript | 18 / 5 / 5 |
| UI | Material UI (MUI) | v5 |
| Gráficas | Recharts | 3.0.2 |
| Formularios | React Hook Form + Zod | 7 / 3 |
| Estado servidor | TanStack Query | v5 |
| HTTP cliente | Axios | 1.7 |
| Base de datos | MySQL | 8.3 |
| Migraciones | Liquibase | 4.27 |
| Contenedores | Docker + Docker Compose | — |
| Servidor web | Nginx | 1.27 |

---



## Funcionalidades implementadas

### Dashboard
- Tarjetas de estadísticas: total nacimientos, total defunciones, total general, mes actual
- Gráfica de barras: Nacimientos vs Defunciones por mes
- Gráfica de pastel: Distribución de informes
- Gráfica de área: Tendencia acumulada del año
- Gráfica de línea: Actividad de la semana actual

### Formularios
Ambos formularios siguen el formato oficial RENAP tal cual el PDF, sin agregar ni quitar campos.

**Informe de Nacimiento** — 4 pasos:
1. Datos del que suscribe *(precargados del usuario activo)*
2. Datos del niño(a) y del nacimiento *(TimePicker 24h para hora)*
3. Datos de la madre *(DPI con validación oficial + selector Depto/Municipio)*
4. Datos del padre *(todo opcional)*

**Informe de Defunción** — 7 pasos:
1. Información general *(usuario precargado, fecha/hora actual, selector Depto/Municipio)*
2. Datos del fallecido(a) *(DPI validado, selector Depto/Municipio)*
3. Mujeres en edad fértil
4. Causa de defunción *(partes I y II)*
5. Defunciones accidentales y violentas
6. Defunción fetal (Mortinato) *(condicional)*
7. Otros datos *(requeridos)*

### Validaciones de campos
| Tipo | Comportamiento |
|------|---------------|
| DPI/CUI | Solo dígitos, máx 13, validación oficial algoritmo complemento 11 (depto, muni, dígito verificador) |
| Nombres/apellidos | Solo letras y espacios — bloquea números y símbolos |
| Edad, conteos | Solo dígitos enteros |
| Peso, talla | Números decimales con punto (ej: `6.5`, `50.5`) |
| Hora | TimePicker visual 24h |
| Departamento/Municipio | Selector encadenado con los 22 departamentos y todos sus municipios |

### Preview e Impresión
- **Vista previa** disponible en el último paso del formulario
- **Clic en una fila** de la lista abre la vista previa del registro
- **Ícono de impresora** en acciones de cada fila
- Impresión en hoja oficio (legal), **frente y reverso**:
  - Nacimiento: frente (secciones I-V + bloque legal) + reverso (3 recuadros de huellas)
  - Defunción: frente (secciones I-VII + timbre) + reverso (instrucciones completas de llenado)
- Formato negro, logos a color

### Datos institucionales fijos
Centralizados en `frontend/src/shared/constants/institucion.ts`:
- Departamento: `Quetzaltenango`
- Municipio: `Quetzaltenango`
- Dirección: `0 Calle 36-40 Zona 8, Quetzaltenango, Guatemala`
- Lugar de nacimiento: `Hospital público`

---

## Notas técnicas

- **Usuario activo** (mock): `frontend/src/shared/context/UserContext.tsx`.
  Cuando exista módulo de login, solo se reemplaza el contexto.
- **Imágenes** en `frontend/public/assets/images/` — escalable para obtenerlas de BD en el futuro.
- **Liquibase** configurado pero desactivado por defecto (`LIQUIBASE_ENABLED=false`).
  Las tablas las crea `docker/mysql/init.sql` al primer arranque.
- **BD** inicializada con `docker/mysql/init.sql` al levantar el contenedor MySQL por primera vez.

---

## Problemas comunes

**Los cambios de código no se reflejan:**
```bash
docker-compose down -v
docker-compose up --build
```
Luego en el navegador: **Ctrl+Shift+R** (hard refresh).

**El backend no conecta a MySQL:**
El `docker-compose.yml` tiene `depends_on` con healthcheck de MySQL.
Si falla, esperar unos segundos y reintentar.

**Puerto 3308 ocupado:**
Detener MySQL local antes de levantar Docker.


## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (opcional):

```bash
# Keycloak
KEYCLOAK_URL=https://sso.hro.gob.gt
KEYCLOAK_REALM=Hospital-O
KEYCLOAK_CLIENT_ID=sistema-actas
KEYCLOAK_CLIENT_SECRET=tu-secret-aqui
KEYCLOAK_FRONTEND_CLIENT_UUID=d670e581-567a-4bba-afdc-43a6b0f94590
VITE_KEYCLOAK_CLIENT=sistema-actas-frontend

# API de RH (asistencia)
RH_API_URL=https://asistencia.hro.gob.gt
# En desarrollo local, usar datos mock (Cloudflare bloquea peticiones externas)
# En producción (dentro de la red del hospital), cambiar a false
RH_API_USE_MOCK=true

# Base de datos
DB_USERNAME=renap_user
DB_PASSWORD=renap_pass
```

**Nota importante sobre `RH_API_USE_MOCK`:**
- En **desarrollo local**: `true` (datos mock, porque Cloudflare bloquea peticiones desde fuera de la red)
- En **producción**: `false` (datos reales, el servidor está dentro de la red del hospital)

## Modo mock vs. API real

### Desarrollo local (mock)
El sistema usa datos de prueba para la búsqueda de empleados porque Cloudflare bloquea peticiones desde fuera de la red del hospital.

### Producción (API real)
Cuando el sistema esté desplegado en un servidor dentro de la red del hospital:

1. En el archivo `.env` o en las variables de entorno del servidor, configura:
   ```bash
   RH_API_USE_MOCK=false
   RH_API_URL=https://asistencia.hro.gob.gt
   ```

2. Reinicia el backend:
   ```bash
   docker compose restart backend
   ```

3. Ahora la búsqueda de empleados consultará la API real del sistema de asistencia.

### Acceso desde desarrollo local a la API real (opcional)

Si necesitas probar con la API real desde tu máquina local, solicita al equipo de infraestructura que agregue tu IP pública a la whitelist de Cloudflare del sistema de asistencia.
