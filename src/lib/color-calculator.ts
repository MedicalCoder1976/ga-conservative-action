/**
 * Color calculator utility for county activity visualization
 * Formula: rgb(intensity, 0, 255-intensity) where intensity = min(activity_score, 255)
 * - 0 activity: rgb(0, 0, 255) = pure blue
 * - 50 activity: rgb(50, 0, 205) = mostly blue
 * - 255 activity: rgb(255, 0, 0) = pure red
 * Note: Every point of activity adds 1 to the intensity (red component), up to 255
 */

/**
 * Calculate the RGB color based on activity score
 * @param activityScore - The activity score for the county
 * @returns RGB string like "rgb(255, 0, 0)"
 */
export function getCountyColor(activityScore: number): string {
  const intensity = Math.min(activityScore, 255)
  const blue = 255 - intensity
  return `rgb(${intensity}, 0, ${blue})`
}

/**
 * Get RGBA color with optional opacity
 * @param activityScore - The activity score for the county
 * @param opacity - Opacity value 0-1 (default 1)
 * @returns RGBA string like "rgba(255, 0, 0, 1)"
 */
export function getCountyColorWithOpacity(
  activityScore: number,
  opacity: number = 1,
): string {
  const intensity = Math.min(Math.floor(activityScore / 50), 255)
  const blue = 255 - intensity
  return `rgba(${intensity}, 0, ${blue}, ${opacity})`
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
