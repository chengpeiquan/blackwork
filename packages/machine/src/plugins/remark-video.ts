import { isArray, isObject, isString } from '@bassist/utils'
import { type Root } from 'mdast'
import { visit } from 'unist-util-visit'

interface LinkNode {
  type: 'link'
  url: string
  children?: unknown[]
  [key: string]: unknown
}

interface TextNode {
  type: 'text'
  value: string
  [key: string]: unknown
}

interface VideoDirectiveNodeChildren {
  children: (TextNode | LinkNode)[]
}

interface VideoDirectiveNode {
  type: 'containerDirective'
  name: 'video'
  attributes?: Record<string, unknown>
  children: VideoDirectiveNodeChildren[]
  [key: string]: unknown
}

interface HyperScriptData {
  hName?: string
  hProperties?: Record<string, unknown>
}

const isVideoNode = (value: unknown): value is VideoDirectiveNode => {
  if (!isObject(value)) return false
  const children = value?.children?.[0]?.children

  return (
    value.type === 'containerDirective' &&
    value.name === 'video' &&
    isArray(children) &&
    children.length > 0
  )
}

const isLinkNode = (value: unknown): value is LinkNode => {
  return (
    isObject(value) &&
    value.type === 'link' &&
    isString(value.url) &&
    !!value.url
  )
}

const isTextNode = (value: unknown): value is TextNode => {
  return (
    isObject(value) &&
    value.type === 'text' &&
    isString(value.value) &&
    !!value.value
  )
}

const isValidChildNode = (value: unknown) =>
  isLinkNode(value) || isTextNode(value)

const DEFAULT_VIDEO_CLASS_NAME =
  'w-full aspect-video rounded-lg bg-black object-contain'

const CUSTOM_ASPECT_VIDEO_CLASS_NAME =
  'w-full rounded-lg bg-black object-contain'

const parseAspectRatio = (value: unknown): string | undefined => {
  if (!isString(value)) return undefined

  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/)
  if (!match?.[1] || !match[2] || match[1] === '0' || match[2] === '0') {
    return undefined
  }

  return `${match[1]} / ${match[2]}`
}

const getExtraClassName = (value: unknown): string => {
  return isString(value) ? value.trim() : ''
}

const remarkVideo = () => {
  return (tree: Root) => {
    visit(tree, (node: unknown) => {
      if (!isVideoNode(node)) return

      const [srcNode, posterNode, titleNode] = node.children[0].children
        .map((value) => {
          if (isLinkNode(value)) return value
          if (isTextNode(value)) {
            value.value = value.value.replace(/\n/g, '').trim()
            if (value.value) return value
          }

          return undefined
        })
        .filter(isValidChildNode)

      const src = srcNode?.url
      const poster = posterNode?.url
      const title = titleNode?.value
      const aspectRatio = parseAspectRatio(node.attributes?.aspect)
      const extraClassName = getExtraClassName(
        node.attributes?.class ?? node.attributes?.className,
      )
      const className = [
        aspectRatio ? CUSTOM_ASPECT_VIDEO_CLASS_NAME : DEFAULT_VIDEO_CLASS_NAME,
        extraClassName,
      ]
        .filter(Boolean)
        .join(' ')

      const data = (node.data ?? (node.data = {})) as HyperScriptData
      data.hName = 'video'
      data.hProperties = {
        src,
        poster,
        title,
        controls: true,
        preload: 'metadata',
        className,
        ...(aspectRatio ? { style: `aspect-ratio: ${aspectRatio}` } : {}),
      }
    })
  }
}

export default remarkVideo
