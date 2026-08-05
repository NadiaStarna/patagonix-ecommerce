// Paleta de colores de muestra — decorativa, no representa datos reales de
// variantes salvo que el producto tenga colors[] cargado desde el admin.
// Se elige un set de 3 de forma determinística según el id del producto,
// así siempre se ven los mismos para ese producto (no cambian en cada
// render) pero varían entre productos distintos, y coinciden entre la
// card del catálogo y la pantalla de detalle.
const SAMPLE_COLOR_PALETTE = [
  '#2B2E33', '#4A7C8C', '#C9763A', '#5C6B4F', '#4A2E4A',
  '#0E2438', '#B05A3A', '#8C4A4A', '#3A5C6B', '#6B5C3A',
]

export const getSampleColors = (productId: string): string[] => {
  let hash = 0
  for (let i = 0; i < productId.length; i++) {
    hash = (hash * 31 + productId.charCodeAt(i)) >>> 0
  }
  const colors: string[] = []
  for (let i = 0; i < 3; i++) {
    const index = (hash + i * 7) % SAMPLE_COLOR_PALETTE.length
    colors.push(SAMPLE_COLOR_PALETTE[index])
  }
  return colors
}