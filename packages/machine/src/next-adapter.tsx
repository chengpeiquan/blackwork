import { isString } from '@bassist/utils'
import { type Element, type RootContent } from 'hast'
import React from 'react'
import { defaultComponents } from './runtime/default-components'
import { mergeComponents } from './runtime/merge-components'
import type { CodeBlockProps } from './runtime/code-block'
import type { ComponentMap } from './types'

interface FigureProps extends React.PropsWithChildren {
  title?: string
}

const Figure: React.FC<FigureProps> = ({ title, children }) => {
  return (
    <figure className="3xl:max-w-screen-lg relative mx-auto block w-full max-w-screen-sm text-center md:max-w-screen-md">
      {children}

      {title && (
        <figcaption className="z-10 mt-4 text-sm italic text-gray-400 dark:text-gray-500">
          {title}
        </figcaption>
      )}
    </figure>
  )
}

export interface NextAdapterOptions {
  CodeBlock: React.ComponentType<React.PropsWithChildren<CodeBlockProps>>
  ExternalLink: React.ComponentType<React.PropsWithChildren<{ href: string }>>
  Image: React.ComponentType<Record<string, unknown>>
  Link: React.ComponentType<React.PropsWithChildren<{ href: string }>>
}

const isElement = (node: RootContent | undefined): node is Element =>
  node?.type === 'element'

const getTextContent = (node: RootContent | undefined): string => {
  if (!node) return ''
  if (node.type === 'text') return node.value
  if (!isElement(node)) return ''

  return node.children.map(getTextContent).join('')
}

const getCodeElement = (preNode?: Element) => {
  return preNode?.children.find(
    (child): child is Element => isElement(child) && child.tagName === 'code',
  )
}

const getClassNames = (node?: Element) => {
  const classValue = node?.properties?.class ?? node?.properties?.className

  return Array.isArray(classValue)
    ? classValue
    : isString(classValue)
      ? classValue.split(' ')
      : []
}

const getLanguage = (codeNode?: Element) => {
  const classNames = getClassNames(codeNode)

  const languageClass = classNames.find(
    (item): item is string => isString(item) && item.startsWith('language-'),
  )

  return languageClass?.slice('language-'.length) ?? ''
}

const getRawCode = (codeNode?: Element) => {
  if (!codeNode) return ''

  const lineNodes = codeNode.children.filter(
    (child): child is Element =>
      isElement(child) &&
      child.tagName === 'span' &&
      getClassNames(child).includes('line'),
  )

  if (lineNodes.length > 0) {
    return lineNodes.map(getTextContent).join('\n')
  }

  return codeNode.children.map(getTextContent).join('')
}

const getFileName = (preNode?: Element) => {
  const title =
    preNode?.properties?.['data-title'] ?? preNode?.properties?.dataTitle

  return isString(title) ? title : ''
}

export const createNextComponentOverrides = ({
  CodeBlock,
  ExternalLink,
  Image,
  Link,
}: NextAdapterOptions): ComponentMap => {
  const a = async ({
    href,
    children,
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http')
    const Comp = isExternal ? ExternalLink : Link

    if (!href) return children
    return <Comp href={href}>{children}</Comp>
  }

  const img = async ({
    src = '',
    alt = '',
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!isString(src) || !src) return null

    return (
      <Figure title={alt}>
        <Image
          className="mx-auto rounded-lg"
          src={src}
          alt={alt}
          fill={false}
          width={0}
          height={0}
          sizes="100%"
          style={{ width: '100%', height: 'auto' }}
          priority
        />
      </Figure>
    )
  }

  const video = ({
    title,
    ...rest
  }: React.VideoHTMLAttributes<HTMLVideoElement>) => (
    <Figure title={title}>
      <video title={title} {...rest} />
    </Figure>
  )

  const pre = ({
    node,
    children,
    ...rest
  }: React.HTMLAttributes<HTMLPreElement> & { node?: Element }) => {
    const codeNode = getCodeElement(node)
    const fileName = getFileName(node)
    const language = getLanguage(codeNode)
    const rawCode = getRawCode(codeNode)

    return (
      <CodeBlock
        {...rest}
        fileName={fileName}
        language={language}
        rawCode={rawCode}
      >
        {children}
      </CodeBlock>
    )
  }

  return {
    a,
    img,
    pre,
    video,
  }
}

export const createNextComponents = (options: NextAdapterOptions) => {
  return mergeComponents(
    defaultComponents,
    createNextComponentOverrides(options),
  )
}
