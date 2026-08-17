import {
  defaultComponents,
  mergeComponents,
  type ComponentMap,
} from '@blackwork/machine'
import { CodeBlock } from '@blackwork/machine/runtime'
import {
  createElement,
  isValidElement,
  type FC,
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
} from 'react'

type DocsTableProps = PropsWithChildren<
  HTMLAttributes<HTMLTableElement> & { node?: unknown }
>

type HastNode = {
  type?: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

type DocsPreProps = PropsWithChildren<
  HTMLAttributes<HTMLPreElement> & {
    node?: unknown
    'data-title'?: string
  }
>

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isHastNode = (value: unknown): value is HastNode => {
  return isRecord(value) && typeof value.type === 'string'
}

const isHastElement = (
  value: unknown,
): value is HastNode & { type: 'element' } => {
  return isHastNode(value) && value.type === 'element'
}

const getTextContent = (node: HastNode | undefined): string => {
  if (!node) {
    return ''
  }

  if (node.type === 'text') {
    return node.value ?? ''
  }

  if (!isHastElement(node)) {
    return ''
  }

  return (node.children ?? []).map((child) => getTextContent(child)).join('')
}

const getClassNames = (node?: HastNode) => {
  const classValue = node?.properties?.class ?? node?.properties?.className

  if (Array.isArray(classValue)) {
    return classValue.filter((item): item is string => typeof item === 'string')
  }

  return typeof classValue === 'string' ? classValue.split(' ') : []
}

const getCodeElement = (preNode?: HastNode) => {
  return (preNode?.children ?? []).find((child): child is HastNode => {
    return isHastElement(child) && child.tagName === 'code'
  })
}

const getLanguage = (codeNode?: HastNode) => {
  const languageClass = getClassNames(codeNode).find((item) => {
    return item.startsWith('language-')
  })

  return languageClass?.slice('language-'.length) ?? ''
}

const getRawCode = (codeNode?: HastNode) => {
  if (!codeNode) {
    return ''
  }

  const lineNodes = (codeNode.children ?? []).filter(
    (child): child is HastNode => {
      return (
        isHastElement(child) &&
        child.tagName === 'span' &&
        getClassNames(child).includes('line')
      )
    },
  )

  if (lineNodes.length > 0) {
    return lineNodes.map((line) => getTextContent(line)).join('\n')
  }

  return (codeNode.children ?? [])
    .map((child) => getTextContent(child))
    .join('')
}

const getFileName = (preNode?: HastNode, dataTitle?: string) => {
  const title =
    preNode?.properties?.['data-title'] ?? preNode?.properties?.dataTitle

  if (typeof title === 'string' && title.length > 0) {
    return title
  }

  return dataTitle ?? ''
}

const getReactText = (value: ReactNode): string => {
  if (value === null || value === undefined || typeof value === 'boolean') {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map((child) => getReactText(child)).join('')
  }

  if (isValidElement<{ children?: ReactNode }>(value)) {
    return getReactText(value.props.children)
  }

  return ''
}

const getReactLanguage = (value: ReactNode): string => {
  if (Array.isArray(value)) {
    return value.map((child) => getReactLanguage(child)).find(Boolean) ?? ''
  }

  if (!isValidElement<{ children?: ReactNode; className?: unknown }>(value)) {
    return ''
  }

  const className = value.props.className
  const classNames = Array.isArray(className)
    ? className.filter((item): item is string => typeof item === 'string')
    : typeof className === 'string'
      ? className.split(' ')
      : []
  const languageClass = classNames.find((item) => item.startsWith('language-'))

  if (languageClass) {
    return languageClass.slice('language-'.length)
  }

  return getReactLanguage(value.props.children)
}

const table: FC<DocsTableProps> = ({ children, node: _node, ...props }) => {
  return createElement(
    'div',
    { className: 'my-6 w-full overflow-x-auto' },
    createElement('table', props, children),
  )
}

const pre: FC<DocsPreProps> = ({
  children,
  node,
  'data-title': dataTitle,
  ...props
}) => {
  const preNode = isHastElement(node) ? node : undefined
  const codeNode = getCodeElement(preNode)
  const fileName = getFileName(preNode, dataTitle)
  const language = getLanguage(codeNode) || getReactLanguage(children)
  const rawCode = getRawCode(codeNode) || getReactText(children)

  return (
    <CodeBlock
      {...props}
      fileName={fileName}
      language={language}
      rawCode={rawCode}
    >
      {children}
    </CodeBlock>
  )
}

export const defaultDocsComponents = mergeComponents(defaultComponents, {
  pre,
  table,
}) satisfies ComponentMap
