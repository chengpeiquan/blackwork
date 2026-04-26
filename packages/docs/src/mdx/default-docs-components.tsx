import {
  defaultComponents,
  mergeComponents,
  type ComponentMap,
} from '@blackwork/machine'
import {
  createElement,
  type FC,
  type HTMLAttributes,
  type PropsWithChildren,
} from 'react'

type DocsTableProps = PropsWithChildren<
  HTMLAttributes<HTMLTableElement> & { node?: unknown }
>

const table: FC<DocsTableProps> = ({ children, node: _node, ...props }) => {
  return createElement(
    'div',
    { className: 'my-6 w-full overflow-x-auto' },
    createElement('table', props, children),
  )
}

export const defaultDocsComponents = mergeComponents(defaultComponents, {
  table,
}) satisfies ComponentMap
