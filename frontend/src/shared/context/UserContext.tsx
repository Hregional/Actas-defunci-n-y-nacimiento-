import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useKeycloak } from './KeycloakContext'

const CLIENT_ID = 'sistema-actas-frontend'

export interface UsuarioSuscriptor {
  nombresApellidos:    string
  cui:                 string
  numeroEmpleado:      string
  renglon:             string
  noColegiado:         string
  noRegistroComadrona: string
  /** 1=Médico  2=Enfermería  3=Personal  4=Comadrona  5=Autoridad */
  tipoInformante:      number
  /** true si tiene client role actas-admin */
  esAdmin:             boolean
  cargando:            boolean
  advertencia:         string | null
}

interface UserContextValue {
  usuario:                 UsuarioSuscriptor
  actualizarCampoEditable: (campo: 'noColegiado' | 'noRegistroComadrona', valor: string) => void
}

const ESTADO_INICIAL: UsuarioSuscriptor = {
  nombresApellidos: '', cui: '', numeroEmpleado: '',
  renglon: '', noColegiado: '', noRegistroComadrona: '',
  tipoInformante: 1, esAdmin: false, cargando: true, advertencia: null,
}

function inferirTipo(renglon: string): number {
  if (renglon === '011') return 1
  if (renglon === '021' || renglon === '022') return 2
  return 3
}

function str(v: unknown): string {
  return v ? String(v) : ''
}

/** Extrae los client roles de resource_access.{clientId}.roles del token */
function extraerClientRoles(tokenParsed: Record<string, unknown>): string[] {
  // VALIDACIÓN CRÍTICA: Verificar que el token fue emitido para este cliente
  const azp = tokenParsed['azp'] as string | undefined  // authorized party
  const aud = tokenParsed['aud'] as string | string[] | undefined  // audience
  
  const esParaEsteCliente = azp === CLIENT_ID || 
                           (Array.isArray(aud) && aud.includes(CLIENT_ID)) ||
                           aud === CLIENT_ID
  
  if (!esParaEsteCliente) {
    console.warn(
      `[UserContext] Token NO emitido para ${CLIENT_ID}. ` +
      `azp=${azp}, aud=${JSON.stringify(aud)}. Acceso denegado.`
    )
    return []  // No otorgar ningún rol
  }

  const resourceAccess = tokenParsed['resource_access'] as Record<string, unknown> | undefined
  if (!resourceAccess) return []
  const clientAccess = resourceAccess[CLIENT_ID] as { roles?: string[] } | undefined
  return clientAccess?.roles ?? []
}

const UserContext = createContext<UserContextValue>({
  usuario: ESTADO_INICIAL,
  actualizarCampoEditable: () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const { authenticated, tokenParsed } = useKeycloak()
  const [usuario, setUsuario] = useState<UsuarioSuscriptor>(ESTADO_INICIAL)

  useEffect(() => {
    if (!authenticated || !tokenParsed) {
      setUsuario((p) => ({ ...p, cargando: false }))
      return
    }

    // VALIDACIÓN: Verificar que el token es para este cliente
    const azp = tokenParsed['azp'] as string | undefined
    const aud = tokenParsed['aud'] as string | string[] | undefined
    const esParaEsteCliente = azp === CLIENT_ID || 
                             (Array.isArray(aud) && aud.includes(CLIENT_ID)) ||
                             aud === CLIENT_ID

    if (!esParaEsteCliente) {
      setUsuario((p) => ({
        ...p,
        cargando: false,
        advertencia: `Acceso denegado: Este token fue emitido para "${azp || 'desconocido'}", no para sistema-actas. Por favor, cierra sesión e ingresa con las credenciales correctas.`,
      }))
      return
    }

    const nombre   = str(tokenParsed['nombre_completo']) || str(tokenParsed['name'])
    const cui      = str(tokenParsed['cui'] ?? tokenParsed['documento'] ?? tokenParsed['dpi'])
    const numEmp   = str(tokenParsed['numero_empleado'])
    const renglon  = str(tokenParsed['renglon'])
    const roles    = extraerClientRoles(tokenParsed as Record<string, unknown>)
    const esAdmin  = roles.includes('actas-admin')
    
    // Leer tipo_informante del token si existe, sino inferir desde renglón
    const tipoToken = tokenParsed['tipo_informante'] as number | undefined
    const tipoInformante = tipoToken || inferirTipo(renglon)
    
    // Leer noColegiado y noRegistroComadrona del token si existen
    const noColegiado = str(tokenParsed['no_colegiado'])
    const noRegistroComadrona = str(tokenParsed['no_registro_comadrona'])

    const advertencia = !nombre
      ? 'Este usuario no tiene nombre_completo asignado. Un admin debe completar su perfil.'
      : null

    setUsuario((p) => ({
      ...p,
      nombresApellidos: nombre,
      cui,
      numeroEmpleado:   numEmp,
      renglon,
      tipoInformante,
      noColegiado,
      noRegistroComadrona,
      esAdmin,
      cargando:         false,
      advertencia,
    }))
  }, [authenticated, tokenParsed])

  const actualizarCampoEditable = (
    campo: 'noColegiado' | 'noRegistroComadrona',
    valor: string,
  ) => setUsuario((p) => ({ ...p, [campo]: valor }))

  return (
    <UserContext.Provider value={{ usuario, actualizarCampoEditable }}>
      {children}
    </UserContext.Provider>
  )
}

export const useCurrentUser = () => useContext(UserContext)
