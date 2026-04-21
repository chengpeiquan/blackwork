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

      const data = (node.data ?? (node.data = {})) as HyperScriptData
      data.hName = 'video'
      data.hProperties = {
        src,
        poster,
        title,
        controls: true,
        preload: 'metadata',
        className: 'w-full aspect-video rounded-lg',
      }
    })
  }
}

export default remarkVideo
