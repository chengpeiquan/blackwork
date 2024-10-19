import type React from 'react'
import { throttle } from '@bassist/utils'

export type UseKeywordEvent =
  | React.FormEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLInputElement>
  | React.KeyboardEvent<HTMLInputElement>

export interface UseKeywordOptions {
  defaultValue?: string

  /**
   * The number of milliseconds to throttle
   *
   * @default 10
   */
  throttleWait?: number
}

export const useKeyword = ({
  defaultValue = '',
  throttleWait = 10,
}: UseKeywordOptions = {}) => {
  const [keyword, setKeyword] = useState(defaultValue)

  const throttledUpdate = useMemo(() => {
    return throttle((value: string) => {
      setKeyword(value)
    }, throttleWait)
  }, [throttleWait])

  const onKeywordUpdate = useCallback(
    (e: UseKeywordEvent) => {
      const { value } = e.target as HTMLInputElement
      throttledUpdate(value)
    },
    [throttledUpdate],
  )

  return {
    keyword,
    onKeywordUpdate,
  }
}
