import { useRef, useCallback } from 'react'
import { PRINT_CSS } from '@/shared/styles/printStyles'

/**
 * Hook reutilizable para imprimir cualquier elemento del DOM.
 * Abre una ventana nueva con el CSS de impresión para que el formato
 * sea fiel al diseño. El tamaño @page está fijado (oficio 8.5"×14"),
 * lo que bloquea el selector de escala en el diálogo de Chrome/Edge.
 *
 * @param title  Título de la ventana/pestaña de impresión
 * @param css    CSS a inyectar (por defecto PRINT_CSS). Pasa el específico
 *               del acta (PRINT_CSS_NACIMIENTO / PRINT_CSS_DEFUNCION) para
 *               asegurarte de que el @page correcto viaje con el contenido.
 */
export function usePrint(title = 'Informe HRO', css?: string) {
  const printRef = useRef<HTMLDivElement>(null)
  const printCss = css ?? PRINT_CSS

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
  <style>${printCss}</style>
</head>
<body>${content.innerHTML}</body>
</html>`)

    win.document.close()
    win.focus()
    setTimeout(() => {
      win.print()
      win.close()
    }, 800)
  }, [title, printCss])

  return { printRef, print }
}
