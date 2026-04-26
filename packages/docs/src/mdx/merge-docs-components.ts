import { mergeComponents, type ComponentMap } from '@blackwork/machine'
import { defaultDocsComponents } from './default-docs-components'

export const mergeDocsComponents = (
  ...layers: Array<ComponentMap | undefined>
) => {
  return mergeComponents(defaultDocsComponents, ...layers)
}
