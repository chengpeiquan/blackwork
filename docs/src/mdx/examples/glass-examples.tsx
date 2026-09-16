'use client'

import { Button, FluidGlass, Input, Label } from 'blackwork'
import { Heart } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useId, useState } from 'react'
import { GlassShowcase } from '../../showcase/glass-showcase'
import { Example } from '../components/example'

const controlsCode = `'use client'

import { Button, Input, Label } from 'blackwork'
import { Heart } from 'lucide-react'
import { useId, useState } from 'react'

export const GlassControls = () => {
  const id = useId()
  const [saved, setSaved] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor={id}>Project name</Label>
      <Input id={id} appearance="glass" placeholder="The next story" />
      <Button variant="glass" aria-pressed={saved}
        onClick={() => setSaved(!saved)}>
        <Heart aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
        {saved ? 'Saved' : 'Save example'}
      </Button>
    </div>
  )
}`

export const GlassControlsExample = () => {
  const id = useId()
  const [saved, setSaved] = useState(false)
  const zh = usePathname().startsWith('/zh')
  return (
    <Example title="Controls" titleZh="从一个控件开始" code={controlsCode}>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Label htmlFor={id}>{zh ? '项目名称' : 'Project name'}</Label>
        <Input
          id={id}
          appearance="glass"
          placeholder={zh ? '下一篇故事' : 'The next story'}
        />
        <Button
          variant="glass"
          aria-pressed={saved}
          onClick={() => setSaved(!saved)}
        >
          <Heart aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
          {zh
            ? saved
              ? '已收藏'
              : '收藏示例'
            : saved
              ? 'Saved'
              : 'Save example'}
        </Button>
      </div>
    </Example>
  )
}

const navigationCode = `import { FluidGlass } from 'blackwork'

export const Navigation = () => (
  <nav aria-label="Components">
    <FluidGlass surface={false} variant="subtle" className="flex flex-wrap gap-1">
      <a href="/components/glass" data-fluid-glass-item
        aria-current="page" className="rounded-xl px-4 py-2">Glass</a>
      <a href="/components/button" data-fluid-glass-item
        className="rounded-xl px-4 py-2">Button</a>
      <a href="/components/dialog" data-fluid-glass-item
        className="rounded-xl px-4 py-2">Dialog</a>
    </FluidGlass>
  </nav>
)`

export const GlassNavigationExample = () => {
  const zh = usePathname().startsWith('/zh')
  const prefix = zh ? '/zh' : ''
  return (
    <Example
      title="A shared hover highlight"
      titleZh="连续移动的悬停高光"
      code={navigationCode}
    >
      <nav aria-label={zh ? '组件示例导航' : 'Component example navigation'}>
        <FluidGlass
          surface={false}
          variant="subtle"
          className="flex flex-wrap gap-1"
        >
          {['glass', 'button', 'dialog'].map((name, index) => (
            <a
              key={name}
              href={`${prefix}/components/${name}`}
              data-fluid-glass-item
              aria-current={index === 0 ? 'page' : undefined}
              className="rounded-xl px-4 py-2"
            >
              {index === 0
                ? zh
                  ? '液态玻璃'
                  : 'Glass'
                : name === 'button'
                  ? 'Button'
                  : 'Dialog'}
            </a>
          ))}
        </FluidGlass>
      </nav>
    </Example>
  )
}

export const GlassPlayground = () => {
  const zh = usePathname().startsWith('/zh')
  return (
    <div className="not-prose my-8">
      <GlassShowcase locale={zh ? 'zh' : 'en'} />
    </div>
  )
}
