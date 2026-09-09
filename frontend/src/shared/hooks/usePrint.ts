import { useRef, useCallback } from 'react'
import { PRINT_CSS } from '@/shared/styles/printStyles'

/**
 * Hook reutilizable para imprimir cualquier elemento del DOM.
 * Usa el CSS unificado de PRINT_CSS para garantizar que el formato
 * sea idéntico entre la vista previa en pantalla y la impresión.
 */
export function usePrint(title = 'Informe HRO') {
  const printRef = useRef<HTMLDivElement>(null)

  const print = useCallback(() => {
    const content = printRef.current
    if (!content) return

    const win = window.open('', '_blank', 'width=960,height=700')
    if (!win) {
      alert('Por favor permita las ventanas emergentes para imprimir.')
      return
    }

    win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>${PRINT_CSS}</style>
</head>
<body>${content.innerHTML}</body>
</html>`)

    win.document.close()
    win.focus()
    setTimeout(() => {
      win.print()
      win.close()
    }, 800)
  }, [title])

  return { printRef, print }
}
