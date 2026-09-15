export interface FluidRect {
  x: number
  y: number
  width: number
  height: number
}

/** Keep the highlight continuous across gaps without forwarding clicks. */
export const nearestRect = (rects: FluidRect[], x: number, y: number) => {
  let index = -1
  let distance = Infinity
  rects.forEach((rect, i) => {
    const dx = Math.max(rect.x - x, 0, x - rect.x - rect.width)
    const dy = Math.max(rect.y - y, 0, y - rect.y - rect.height)
    const next = Math.hypot(dx, dy)
    if (next < distance) {
      index = i
      distance = next
    }
  })
  return index
}

/** A damped spring that preserves velocity when its target changes. */
export const springStep = (
  value: number,
  velocity: number,
  target: number,
  dt: number,
) => {
  const nextVelocity = velocity + ((target - value) * 420 - velocity * 34) * dt
  return { value: value + nextVelocity * dt, velocity: nextVelocity }
}

/** A rounded rectangle lens measured in CSS pixels, including straight edges. */
export const lensPixel = (
  x: number,
  y: number,
  width: number,
  height: number,
  cornerRadius = Math.min(width, height) / 2,
) => {
  const radius = Math.max(0, Math.min(cornerRadius, width / 2, height / 2))
  const px = x - width / 2
  const py = y - height / 2
  const qx = Math.abs(px) - width / 2 + radius
  const qy = Math.abs(py) - height / 2 + radius
  const ox = Math.max(qx, 0)
  const oy = Math.max(qy, 0)
  const outside = Math.hypot(ox, oy)
  const distance = outside + Math.min(Math.max(qx, qy), 0) - radius
  const band = Math.min(28, Math.max(10, radius * 0.8), width / 2, height / 2)
  const edge = Math.max(0, Math.min(1, 1 + distance / band))
  const bend = edge * edge * (3 - 2 * edge) * 120
  const nx = outside > 0 ? ox / outside : qx > qy ? 1 : 0
  const ny = outside > 0 ? oy / outside : qx > qy ? 0 : 1
  // Sample toward the center near the perimeter: the background swells at the rim.
  return [128 - Math.sign(px) * nx * bend, 128 - Math.sign(py) * ny * bend]
}
