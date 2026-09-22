'use client'

import { Button, TopProgress } from 'blackwork'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Example } from '../components/example'

const code = `import { TopProgress } from 'blackwork'

// Mount once in a persistent layout, outside transformed containers.
// Clear pending on success, failure, or cancellation.
<TopProgress pending={pending} label="Loading page" />`

export const TopProgressExample = () => {
  const isZh = usePathname().startsWith('/zh')
  const [pending, setPending] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const start = (duration: number) => {
    clearTimeout(timer.current)
    setPending(true)
    timer.current = setTimeout(() => setPending(false), duration)
  }

  const finish = () => {
    clearTimeout(timer.current)
    setPending(false)
  }

  return (
    <Example title="Page feedback" titleZh="页面反馈" code={code}>
      <TopProgress
        pending={pending}
        label={isZh ? '正在加载页面' : 'Loading page'}
      />
      <Button onClick={() => start(4000)}>
        {isZh ? '模拟慢速加载' : 'Simulate slow loading'}
      </Button>
      <Button variant="outline" onClick={() => start(50)}>
        {isZh ? '模拟快速加载' : 'Simulate fast loading'}
      </Button>
      <Button variant="ghost" disabled={!pending} onClick={finish}>
        {isZh ? '结束加载' : 'Finish loading'}
      </Button>
      <p className="w-full text-sm text-muted-foreground" role="status">
        {pending
          ? isZh
            ? '正在加载，请留意页面顶部。'
            : 'Loading. Watch the top edge of the page.'
          : isZh
            ? '就绪。快速加载不会显示进度条。'
            : 'Ready. Fast loading skips the bar.'}
      </p>
    </Example>
  )
}
