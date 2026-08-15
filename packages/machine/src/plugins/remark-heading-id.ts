import {
  isArray,
  isFinite,
  isFunction,
  isMap,
  isNull,
  isObject,
  isSet,
  isString,
  isUndefined,
  kebabCase,
} from '@bassist/utils'
import { type Heading, type PhrasingContent, type Root } from 'mdast'
import { visit } from 'unist-util-visit'

const isEmpty = (value: any) => {
  if (isNull(value) || isUndefined(value)) {
    return true
  }
  if (isArray(value) || isString(value)) {
    return !value.length
  }
  if (!isFunction(value) && isFinite(value?.length)) {
    return !value.length
  }
  if (isMap(value) || isSet(value)) {
    return !value.size
  }
  if (isObject(value) && Object.keys(value).length > 0) {
    return false
  }
  return true
}

const extractText = (children: any): string => {
  return children
    .map((child: any) => {
      if (!isEmpty(child?.value)) {
        return child?.value
      }
      if (child?.children && child.children.length > 0) {
        return extractText(child.children)
      }

      return ''
    })
    .join(' ')
}

const formatDefaultId = (value: string) => {
  return kebabCase(value.replace(/\s+/gu, ' ').trim())
}

const getDefaultId = (children: PhrasingContent[]) => {
  return formatDefaultId(extractText(children))
}

const setNodeId = (node: Heading, id: string) => {
  node.data ??= {}
  node.data.hProperties ??= {}
  // @ts-expect-error mdast data typing is intentionally loose here
  node.data.id = node.data.hProperties.id = id
}

interface RemarkHeadingIdOptions {
  defaults?: boolean
  uniqueDefaults?: boolean
}

const remarkHeadingId = (
  options: RemarkHeadingIdOptions = { defaults: false, uniqueDefaults: true },
) => {
  return (tree: Root) => {
    const uniqueDefaultIdsCounters: Record<string, number> = {}

    visit(tree, 'heading', (headingNode: Heading) => {
      const lastChild = headingNode.children[headingNode.children.length - 1]
      if (lastChild && lastChild.type === 'text') {
        let string = lastChild.value.replace(/ +$/u, '')
        const matched = string.match(/ \{#([\s\S]+?)\}$/u)

        if (matched) {
          const id = matched[1]
          if (id.length) {
            setNodeId(headingNode, id)

            string = string.substring(0, matched.index)
            lastChild.value = string
            return
          }
        }
      }

      if (!options.defaults) return

      let defaultIdCandidate = getDefaultId(headingNode.children)
      if (options.uniqueDefaults) {
        if (uniqueDefaultIdsCounters[defaultIdCandidate] === undefined) {
          uniqueDefaultIdsCounters[defaultIdCandidate] = 0
        } else {
          uniqueDefaultIdsCounters[defaultIdCandidate]++
          defaultIdCandidate += `-${uniqueDefaultIdsCounters[defaultIdCandidate]}`
        }
      }

      setNodeId(headingNode, defaultIdCandidate)
    })
  }
}

export default remarkHeadingId
