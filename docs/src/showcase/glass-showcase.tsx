'use client'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FluidGlass,
  GlassSurface,
  Input,
  Label,
} from 'blackwork'
import { ArrowUpRight, Layers, MousePointer2 } from 'lucide-react'
import { useId } from 'react'

export const GlassShowcase = ({ locale = 'en' }: { locale?: string }) => {
  const zh = locale.startsWith('zh')
  const inputId = useId()
  const prefix = zh ? '/zh' : ''
  return (
    <div
      data-glass-showcase
      className="relative isolate flex w-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted/30 px-5 py-10 sm:px-10 sm:py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <svg
          viewBox="0 0 1000 440"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full text-foreground/20"
        >
          <defs>
            <linearGradient id={`${inputId}-ink`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="currentColor" stopOpacity="0.05" />
              <stop offset="0.5" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <ellipse
            cx="250"
            cy="280"
            rx="360"
            ry="105"
            transform="rotate(-30 250 280)"
            fill={`url(#${inputId}-ink)`}
          />
          {[0, 24, 48, 72].map((offset) => (
            <ellipse
              key={offset}
              cx="750"
              cy="160"
              rx={260 + offset}
              ry={90 + offset}
              transform="rotate(-35 750 160)"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          <text
            x="-20"
            y="300"
            fill="currentColor"
            fontSize="220"
            fontWeight="700"
            letterSpacing="-16"
          >
            Aa
          </text>
        </svg>
      </div>
      <GlassSurface
        material="regular"
        blur={4}
        className="w-full max-w-md rounded-3xl p-6 text-left sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <Layers className="size-5" aria-hidden="true" />
          <p className="text-lg font-medium">
            {zh ? '让光线停留在界面上' : 'A surface that catches the light'}
          </p>
        </div>
        <nav
          aria-label={zh ? '示例导航' : 'Example navigation'}
          className="mb-6"
        >
          <FluidGlass
            surface={false}
            variant="subtle"
            className="flex flex-wrap gap-1"
          >
            {[
              ['glass', zh ? '材质' : 'Materials'],
              ['layouts', zh ? '布局' : 'Layouts'],
              ['button', zh ? '按钮' : 'Buttons'],
            ].map(([slug, label], index) => (
              <a
                key={slug}
                href={`${prefix}/components/${slug}`}
                data-fluid-glass-item
                aria-current={index === 0 ? 'page' : undefined}
                className="rounded-xl px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {label}
              </a>
            ))}
          </FluidGlass>
        </nav>
        <div className="flex flex-col gap-2">
          <Label htmlFor={inputId}>{zh ? '项目名称' : 'Project name'}</Label>
          <Input
            id={inputId}
            appearance="glass"
            placeholder={zh ? '下一篇故事' : 'The next story'}
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <MousePointer2 className="size-3.5" aria-hidden="true" />
            {zh
              ? '移动鼠标，看看光线变化'
              : 'Move the pointer to catch the light'}
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="glass-primary">
                {zh ? '打开弹窗' : 'Open dialog'}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogContent
              appearance="glass"
              closeLabel={zh ? '关闭' : 'Close'}
            >
              <DialogHeader className="pr-12">
                <DialogTitle>
                  {zh ? '文字清楚，背景柔和' : 'Clear text, a softer backdrop'}
                </DialogTitle>
                <DialogDescription>
                  {zh
                    ? '弹窗使用 panel 材质。背景的光影透过玻璃，标题、说明和操作保持清晰。'
                    : 'The panel material softens the page behind it while keeping the title, description, and controls legible.'}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="glass">
                    {zh ? '返回示例' : 'Back to the example'}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </GlassSurface>
    </div>
  )
}
