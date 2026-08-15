import { isNull, isUndefined } from '@bassist/utils'
import * as React from 'react'

export interface AsChildProps {
  asChild?: boolean
}

export interface SplitAsChildOptions {
  /**
   * Force `nativeButton={false}` when composing onto a custom child.
   * Use for menu items and other non-button parts that commonly wrap links.
   */
  nonButton?: boolean
}

const inferNativeButton = (
  element: React.ReactElement,
): boolean | undefined => {
  if (typeof element.type === 'string') {
    return element.type === 'button'
  }

  return undefined
}

export const splitAsChild = <P extends object>(
  props: P & AsChildProps,
  options: SplitAsChildOptions = {},
): P => {
  const { asChild, children, render, nativeButton, ...rest } = props as P &
    AsChildProps & {
      children?: React.ReactNode
      render?: unknown
      nativeButton?: boolean
    }

  if (!isNull(render) && !isUndefined(render)) {
    return { ...(rest as P), render, children, nativeButton } as P
  }

  if (asChild && React.isValidElement(children)) {
    const inferred =
      nativeButton ?? (options.nonButton ? false : inferNativeButton(children))
    const childType = children.type

    // Base UI SSR still emits a <button> when `render` targets a non-button.
    // Flatten intrinsic non-buttons onto the trigger so server and client match.
    if (typeof childType === 'string' && childType !== 'button') {
      const childProps = children.props as Record<string, unknown> & {
        className?: string
        children?: React.ReactNode
      }
      const {
        children: childChildren,
        className: childClassName,
        ...restChild
      } = childProps
      const parentClassName = (rest as { className?: string }).className

      return {
        ...(rest as P),
        ...restChild,
        className: [childClassName, parentClassName].filter(Boolean).join(' '),
        children: childChildren,
      } as P
    }

    return {
      ...(rest as P),
      render: (props: Record<string, unknown>) => {
        const childProps = children.props as { className?: string }
        const { nativeButton: _nativeButton, ...restProps } = props
        return React.cloneElement(
          children as React.ReactElement<Record<string, unknown>>,
          {
            ...restProps,
            className: [childProps.className, restProps.className]
              .filter(Boolean)
              .join(' '),
          },
        )
      },
      ...(isUndefined(inferred) ? {} : { nativeButton: inferred }),
    } as P
  }

  return { ...(rest as P), children, nativeButton } as P
}
