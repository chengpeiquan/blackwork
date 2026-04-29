import { isString } from '@bassist/utils'
import { ExternalLink } from 'blackwork'
import { type Element, type RootContent } from 'hast'
import React from 'react'
import { CodeBlock } from './code-block'
import type { ComponentMap } from '../types'

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

export const a = ({
  href,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) => {
  const anchorProps = { ...rest } as typeof rest & { node?: unknown }
  delete anchorProps.node

  if (!href) return children

  if (href.startsWith('http')) {
    return (
      <ExternalLink href={href} {...anchorProps}>
        {children}
      </ExternalLink>
    )
  }

  return (
    <a href={href} {...anchorProps}>
      {children}
    </a>
  )
}

export const img = ({
  src = '',
  alt = '',
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & { node?: unknown }) => {
  const imageProps = { ...rest } as typeof rest & { node?: unknown }
  delete imageProps.node

  if (!isString(src) || !src) return null

  return (
    <Figure title={alt}>
      <img className="mx-auto rounded-lg" src={src} alt={alt} {...imageProps} />
    </Figure>
  )
}

export const video = ({
  title,
  ...rest
}: React.VideoHTMLAttributes<HTMLVideoElement> & { node?: unknown }) => {
  const videoProps = { ...rest } as typeof rest & { node?: unknown }
  delete videoProps.node

  return (
    <Figure title={title}>
      <video title={title} {...videoProps} />
    </Figure>
  )
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

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
  node?: Element
}

export const pre = ({ node, children, ...rest }: PreProps) => {
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

export const defaultComponents = {
  a,
  img,
  pre,
  video,
} satisfies ComponentMap
