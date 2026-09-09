# 📊 ESTADO ACTUAL DEL SISTEMA

**Fecha:** 7 de Septiembre de 2026  
**Última actualización:** 21:00 hrs

---

## ✅ SERVICIOS ACTIVOS

| Servicio | Estado | URL | Puerto |
|----------|--------|-----|--------|
| **Frontend (Vite)** | ✅ Running | http://localhost:3001 | 3001 |
| **Backend (Spring Boot)** | ✅ Running | http://localhost:9090/api | 9090 |
| **MySQL** | ✅ Running | localhost:3308 | 3308 |
| **Keycloak** | ✅ Externo | https://sso.hro.gob.gt | - |

---

## ⚡ HOT RELOAD CONFIGURADO

- **Frontend**: Cambios instantáneos en archivos `.tsx`, `.ts`, `.css`
- **Backend**: Auto-restart en ~15 segundos al modificar archivos `.java`

---

## 🔧 CONFIGURACIÓN ACTUAL

### **Puerto 3001** (solución al conflicto de puerto 3000)
- El puerto 3000 estaba ocupado por otro proceso en Windows
- Se cambió a puerto 3001 para evitar conflictos
- Configuración en `vite.config.ts` y `docker-compose.override.yml`

### **Proxy Backend**
- Contenedor frontend → contenedor backend: `http://renap-backend:8080/api`
- Host → Backend: `http://localhost:9090/api`

---

## ⚠️ PROBLEMAS CONOCIDOS

### ~~**1. Errores 500 en peticiones API**~~ ✅ **RESUELTO**

**Problema**: Variable de entorno incorrecta en docker-compose

**Solución aplicada**:
- Cambiado `VITE_API_BASE_URL` → `VITE_API_URL`  
- Configurado como `/api` para usar el proxy de Vite
- Proxy de Vite redirige `/api/*` → `http://renap-backend:8080/api/*`

**Archivo modificado**: `docker-compose.override.yml`

### **2. Config.js no encontrado**

**Síntoma**: `config.js no encontrado — usando valores por defecto`

**Causa**: El archivo `public/config.js` se genera en runtime por `docker-entrypoint.sh`

**Impacto**: Bajo - La aplicación usa valores por defecto de las variables de entorno

---

## 📝 CAMBIOS RECIENTES

### **Sesión actual:**

1. ✅ Labels flotantes (`shrink: true`) en 46 campos nacimiento/defunción
2. ✅ Labels optimizados para móvil (15+ acortados)
3. ✅ DatePickers readonly (solo calendario)
4. ✅ Schemas Zod: colegiado opcional, obligatorio solo si tipo=1 (Médico)
5. ✅ DTOs TypeScript actualizados con `| null` en 45 campos opcionales
6. ✅ Datos mock eliminados (RhApiClient, RhApiProperties, application.yml)
7. ✅ Puerto backend cambiado: 8080→8081→9090
8. ✅ docker-compose.override.yml creado para modo desarrollo
9. ✅ spring-boot-devtools agregado a pom.xml
10. ✅ Dockerfile.dev creados (backend y frontend)
11. ✅ vite.config.ts: puerto 3001 configurado

---

## 🧪 PRUEBAS PENDIENTES

- [ ] Verificar validación condicional del colegiado (solo obligatorio si tipo=Médico)
- [ ] Probar labels responsive en dispositivos móviles
- [ ] Verificar hot reload en ambos contenedores
- [ ] Resolver errores 500 en peticiones API
- [ ] Configurar CORS correctamente para desarrollo

---

## 🚀 COMANDOS ÚTILES

```powershell
# Iniciar contenedores
docker-compose up

# Ver logs en tiempo real
docker-compose logs -f frontend
docker-compose logs -f backend

# Reiniciar un servicio específico
docker-compose restart frontend

# Detener todo
docker-compose down

# Ver estado de contenedores
docker ps

# Acceder a un contenedor
docker exec -it renap-frontend sh
docker exec -it renap-backend bash
```

---

## 📚 DOCUMENTACIÓN

- **DESARROLLO.md**: Guía completa de desarrollo con Docker
- **README.md**: Documentación general del proyecto
- **docker-compose.yml**: Configuración de producción
- **docker-compose.override.yml**: Configuración de desarrollo (hot reload)

---

## 👤 USUARIO AUTENTICADO

**Keycloak funcionando correctamente:**
- ✅ Autenticación exitosa
- ✅ Token JWT generado
- ✅ Roles: `admin`, `empleados`, `actas-admin`
- Usuario: `actas` (Edvin Everaldo De León)
- CUI: 3212350020801
