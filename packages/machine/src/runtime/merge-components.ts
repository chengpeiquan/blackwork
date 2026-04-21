import type { ComponentMap } from '../types'

export const mergeComponents = (...layers: Array<ComponentMap | undefined>) => {
  return layers.reduce<ComponentMap>((result, layer) => {
    if (!layer) return result

    for (const [key, value] of Object.entries(layer)) {
      if (value) {
        result[key] = value
      }
    }

    return result
  }, {})
}
