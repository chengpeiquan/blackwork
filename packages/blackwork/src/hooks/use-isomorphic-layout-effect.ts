// https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
import { isBrowser } from '@bassist/utils'
import { useEffect, useLayoutEffect } from 'react'

/**
 * Custom hook that uses either `useLayoutEffect` or `useEffect` based on the
 * environment (client-side or server-side).
 *
 * @example
 *   ;```tsx
 *   useIsomorphicLayoutEffect(() => {
 *     // Code to be executed during the layout phase on the client side
 *   }, [dependency1, dependency2]);
 *   ```
 *
 * @param {Function} effect - The effect function to be executed.
 * @param {any[]} [dependencies] - An array of dependencies for the effect
 *   (optional).
 * @public
 *
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect)
 */
export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect
