# SOLUCIÓN: Problemas de Mapeo FHIR

## Problemas Identificados:

1. **Búsqueda por DPI no funciona**: ✅ FALSO - Funciona correctamente, el backend tiene el endpoint /buscar-por-cui/{cui}
2. **Mapeo incorrecto de ubicaciones**: ❌ REAL - FHIR devuelve valores que no coinciden con opciones de frontend
3. **Nacionalidad no automática para DPI**: ❌ REAL - No se está asignando "Guatemalteca" consistentemente

## Causa Raíz:
El mapeo directo de valores FHIR a campos del frontend sin validar que existan en las opciones.

## Solución:

### 1. Mapeo Inteligente de Ubicaciones
Crear función que mapee valores de FHIR a opciones válidas del frontend.

### 2. Nacionalidad Automática 
Cuando el CUI es guatemalteco válido (13 dígitos), asignar automáticamente "Guatemalteca".

### 3. Manejo de Errores de Mapeo
Mostrar advertencia cuando los datos FHIR no coincidan con opciones locales.

### 4. Logging Mejorado
Para diagnosticar problemas de mapeo en producción.