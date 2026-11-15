/**
 * Color calculator utility for county activity visualization.
 *
 * The map should read as a clean progression from neutral/empty to blue
 * to purple to red as activity increases, with a gray fallback for missing
 * or zero data so the map remains legible.
 */

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function interpolateColor(
  start: [number, number, number],
  end: [number, number, number],
  ratio: number,
): [number, number, number] {
  const t = clamp(ratio, 0, 1)
  return [
    Math.round(start[0] + (end[0] - start[0]) * t),
    Math.round(start[1] + (end[1] - start[1]) * t),
    Math.round(start[2] + (end[2] - start[2]) * t),
  ]
}

function colorFromScore(score: number): [number, number, number] {
  const safeScore = Number.isFinite(score) ? score : 0
  if (safeScore <= 0) return [229, 231, 235]

  const ratio = clamp(safeScore / 255, 0, 1)

  const stops: Array<{ threshold: number; color: [number, number, number] }> = [
    { threshold: 0, color: [229, 231, 235] },
    { threshold: 0.25, color: [59, 130, 246] },
    { threshold: 0.6, color: [147, 51, 234] },
    { threshold: 1, color: [220, 38, 38] },
  ]

  for (let i = 1; i < stops.length; i += 1) {
    const prev = stops[i - 1]
    const next = stops[i]
    if (ratio <= next.threshold) {
      const span = next.threshold - prev.threshold || 1
      const localRatio = (ratio - prev.threshold) / span
      return interpolateColor(prev.color, next.color, localRatio)
    }
  }

  return stops[stops.length - 1].color
}

/**
 * Calculate the RGB color based on activity score.
 * - 0 / no data: gray
 * - low activity: blue
 * - mid activity: purple
 * - high activity: red
 */
export function getCountyColor(activityScore: number): string {
  const [r, g, b] = colorFromScore(activityScore)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Get RGBA color with optional opacity.
 * @param activityScore - The activity score for the county
 * @param opacity - Opacity value 0-1 (default 1)
 * @returns RGBA string like "rgba(255, 0, 0, 1)"
 */
export function getCountyColorWithOpacity(
  activityScore: number,
  opacity: number = 1,
): string {
  const [r, g, b] = colorFromScore(activityScore)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Convert hex color to RGB
 * @param hex - Hex color string like "#FF0000" or "FF0000"
 * @returns Object with r, g, b values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Convert RGB to hex color
 * @param r - Red value 0-255
 * @param g - Green value 0-255
 * @param b - Blue value 0-255
 * @returns Hex string like "#FF0000"
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
      .toUpperCase()
  )
}

/**
 * Get intensity value from activity score
 * @param activityScore - The activity score
 * @returns Intensity value 0-255
 */
export function getIntensity(activityScore: number): number {
  return Math.min(activityScore, 255)
}
