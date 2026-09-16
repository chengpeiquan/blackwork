'use client'

import { CodeBlock } from '@blackwork/machine/runtime'
import {
  Badge,
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
  GlassMaterial,
  Input,
  Label,
  Switch,
} from 'blackwork'
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  Copy,
  SlidersHorizontal,
} from 'lucide-react'
import Link from 'next/link'
import { type CSSProperties, useId, useState } from 'react'
import { HOME_SHOWCASE_CODE } from './home-showcase-code'

interface HighlightToken {
  content: string
  light: string
  dark: string
}

export const HomeShowcase = ({
  locale,
  codeTokens,
}: {
  locale: string
  codeTokens: HighlightToken[][]
}) => {
  const zh = locale.startsWith('zh')
  const prefix = zh ? '/zh' : ''
  const id = useId()
  const [saved, setSaved] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [summary, setSummary] = useState(true)
  const [collection, setCollection] = useState(
    zh ? '设计灵感' : 'Design inspiration',
  )
  const [draft, setDraft] = useState(collection)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText('pnpm add blackwork')
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
    }
  }
  const saveLabel = zh
    ? saved
      ? '已收藏'
      : '收藏文章'
    : saved
      ? 'Saved'
      : 'Save article'
  return (
    <div className="w-full text-left" data-home-showcase>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <p className="text-sm font-medium">
          {zh
            ? '组件组合，真实交互。'
            : 'Composed components. Working interactions.'}
        </p>
        <span className="text-xs text-muted-foreground">
          {zh
            ? '内容站点示例 · 可直接操作'
            : 'Content site example · Try the controls'}
        </span>
      </div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative isolate overflow-hidden bg-neutral-950 text-white">
            <svg
              aria-hidden="true"
              viewBox="0 0 900 430"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#0a0a0a" />
                  <stop offset=".44" stopColor="#353535" />
                  <stop offset=".53" stopColor="#c0c0bb" />
                  <stop offset=".64" stopColor="#484846" />
                  <stop offset="1" stopColor="#101010" />
                </linearGradient>
              </defs>
              <rect width="900" height="430" fill="#111" />
              <g transform="translate(600 240) rotate(-32)">
                {Array.from({ length: 16 }, (_, i) => (
                  <ellipse
                    key={i}
                    cx={i * 8}
                    cy={i * 3}
                    rx={110 + i * 8}
                    ry={180 - i * 3}
                    fill="none"
                    stroke={`url(#${id}-metal)`}
                    strokeWidth="12"
                  />
                ))}
              </g>
            </svg>
            <div className="relative flex min-h-80 flex-col justify-between p-6 sm:min-h-96 sm:p-8">
              <div className="dark relative flex flex-wrap items-center justify-between gap-2 rounded-2xl px-4 py-3">
                <GlassMaterial material="regular" blur={3} />
                <span className="relative text-sm font-semibold tracking-widest">
                  JOURNAL
                </span>
                <nav
                  className="relative"
                  aria-label={zh ? '站点示例导航' : 'Site example navigation'}
                >
                  <FluidGlass
                    surface={false}
                    variant="subtle"
                    className="flex flex-wrap gap-1"
                  >
                    {[
                      [zh ? '文章' : 'Articles', 'layouts'],
                      [zh ? '归档' : 'Archive', 'widgets'],
                      [zh ? '关于' : 'About', 'theme'],
                    ].map(([label, slug], i) => (
                      <Link
                        key={slug}
                        href={`${prefix}/components/${slug}`}
                        data-fluid-glass-item
                        aria-current={i === 0 ? 'page' : undefined}
                        className="rounded-lg px-3 py-1.5 text-xs text-white/90"
                      >
                        {label}
                      </Link>
                    ))}
                  </FluidGlass>
                </nav>
              </div>
              <div className="relative mt-14 max-w-sm">
                <span className="text-xs tracking-widest text-white/60">
                  FORM / 001
                </span>
                <p className="mt-3 text-5xl font-medium leading-none tracking-tight sm:text-6xl">
                  Less noise.
                  <br />
                  More story.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Badge variant="secondary">
                {zh ? '设计手记' : 'Design notes'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {zh ? '排版 · 空间 · 材质' : 'Type · Space · Material'}
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {zh
                ? '给内容一个安静的空间。'
                : 'Give the story room to breathe.'}
            </h2>
            {summary && (
              <p
                data-reading-summary
                className="mt-4 max-w-xl leading-relaxed text-muted-foreground"
                style={{ fontSize }}
              >
                {zh
                  ? '用留白组织阅读节奏，用排版呈现内容层次。导航轻轻浮在画面上，必要的操作始终触手可及。'
                  : 'Space sets the reading pace. Typography gives each idea its place. Navigation floats above the image, keeping useful actions close to the story.'}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <Button variant="link" asChild className="h-auto px-0">
                <Link href={`${prefix}/components/layouts`}>
                  {zh ? '查看布局组件' : 'Explore layouts'}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                variant="glass"
                aria-pressed={saved}
                onClick={() => setSaved(!saved)}
              >
                <Bookmark
                  className="size-4"
                  aria-hidden="true"
                  fill={saved ? 'currentColor' : 'none'}
                />
                {saveLabel}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <section
            className="rounded-2xl border border-border bg-card p-6"
            aria-labelledby={`${id}-reading`}
          >
            <div className="mb-6 flex items-center gap-2">
              <SlidersHorizontal
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 id={`${id}-reading`} className="text-base font-semibold">
                {zh ? '阅读偏好' : 'Reading preferences'}
              </h2>
            </div>
            <p id={`${id}-size`} className="mb-3 text-sm">
              {zh ? '字号' : 'Text size'}
            </p>
            <div
              role="group"
              aria-labelledby={`${id}-size`}
              className="grid grid-cols-3 gap-2"
            >
              {[14, 16, 18].map((value, i) => (
                <Button
                  key={value}
                  size="sm"
                  variant={fontSize === value ? 'glass-primary' : 'glass'}
                  aria-pressed={fontSize === value}
                  onClick={() => setFontSize(value)}
                >
                  {zh
                    ? ['小', '标准', '大'][i]
                    : ['Small', 'Default', 'Large'][i]}
                </Button>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
              <Label htmlFor={`${id}-summary`}>
                {zh ? '显示文章摘要' : 'Show summary'}
              </Label>
              <Switch
                id={`${id}-summary`}
                checked={summary}
                onCheckedChange={setSummary}
              />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {zh
                ? '调整后，文章预览会即时变化。'
                : 'Changes apply to the article preview.'}
            </p>
          </section>
          <section
            className="flex flex-1 flex-col rounded-2xl border border-border bg-card p-6"
            aria-labelledby={`${id}-saved`}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 id={`${id}-saved`} className="text-base font-semibold">
                {collection}
              </h2>
              <Bookmark
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div
              className="my-6 flex flex-1 items-center border-y border-border py-6"
              aria-live="polite"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {saved
                  ? zh
                    ? '已收藏「给内容一个安静的空间」。'
                    : 'Saved “Give the story room to breathe.”'
                  : zh
                    ? '值得留住的灵感，从一篇文章开始。点击文章下方的收藏按钮，试试状态变化。'
                    : 'A reading list starts with one story. Save the article to try the interaction.'}
              </p>
            </div>
            <Dialog
              onOpenChange={(open) => {
                if (open) setDraft(collection)
              }}
            >
              <DialogTrigger asChild>
                <Button variant="glass" className="w-full">
                  {zh ? '管理收藏夹' : 'Manage collection'}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent
                appearance="glass"
                closeLabel={zh ? '关闭' : 'Close'}
                className="max-w-[calc(100vw-2rem)] sm:max-w-lg"
              >
                <DialogHeader className="pr-12">
                  <DialogTitle>
                    {zh ? '收藏夹设置' : 'Collection settings'}
                  </DialogTitle>
                  <DialogDescription>
                    {zh
                      ? '为收藏夹换个名字，留住下一次想重读的内容。'
                      : 'Choose a name for the stories worth returning to.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <Label htmlFor={`${id}-collection`}>
                    {zh ? '收藏夹名称' : 'Collection name'}
                  </Label>
                  <Input
                    id={`${id}-collection`}
                    appearance="glass"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={40}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="glass">{zh ? '取消' : 'Cancel'}</Button>
                  </DialogClose>
                  <DialogClose
                    asChild
                    disabled={!draft.trim()}
                    onClick={() => setCollection(draft.trim())}
                  >
                    <Button variant="glass-primary">
                      {zh ? '保存修改' : 'Save changes'}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
          <Link
            href={`${prefix}/components/glass`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border p-5 text-sm transition-colors hover:bg-accent"
          >
            <span>
              <span className="block font-medium">
                {zh ? '液态玻璃' : 'Liquid glass'}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {zh
                  ? '透光材质，连续高光。'
                  : 'Translucent surfaces. Fluid highlights.'}
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <section className="grid gap-10 border-b border-border py-16 md:grid-cols-2 md:items-center lg:gap-20">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {zh ? '从一个组件开始' : 'Start with one component'}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {zh
              ? '熟悉的 API，\n自己的风格。'
              : 'Familiar APIs.\nA distinct point of view.'}
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            {zh
              ? '用 React 组合布局、主题和表单，再为需要强调的操作加上玻璃外观。组件负责交互细节，页面保留自己的内容与节奏。'
              : 'Compose layouts, themes, and forms with React. Add glass where controls need emphasis, with room for the content and rhythm of each site.'}
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-muted/30 py-2 pl-4 pr-2">
            <code className="min-w-0 flex-1 text-sm">pnpm add blackwork</code>
            <Button
              size="icon"
              variant="ghost"
              title={zh ? '复制安装命令' : 'Copy install command'}
              aria-label={zh ? '复制安装命令' : 'Copy install command'}
              onClick={copyInstall}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          <p
            role="status"
            className="mt-2 min-h-5 text-xs text-muted-foreground"
          >
            {copyError
              ? zh
                ? '可选中上方命令手动复制。'
                : 'Select the command above to copy it manually.'
              : copied
                ? zh
                  ? '安装命令已复制。'
                  : 'Install command copied.'
                : zh
                  ? '玻璃 API 为待发布预览，接入前请查看版本说明。'
                  : 'Glass APIs are a prerelease preview. Check availability before installing.'}
          </p>
          <Button asChild variant="link" className="mt-3 px-0">
            <Link href={`${prefix}/guide/getting-started`}>
              {zh ? '阅读接入指南' : 'Read the getting started guide'}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="min-w-0">
          <div className="[&_.not-prose]:my-0">
            <CodeBlock
              fileName="header.tsx"
              language="tsx"
              rawCode={HOME_SHOWCASE_CODE}
              copyLabel={zh ? '复制代码' : 'Copy code'}
              copiedLabel={zh ? '已复制' : 'Copied'}
              className="shiki"
            >
              <code className="language-tsx">
                {codeTokens.map((line, lineIndex) => (
                  <span className="line" key={lineIndex}>
                    {line.map((token, tokenIndex) => (
                      <span
                        key={`${lineIndex}-${tokenIndex}`}
                        style={
                          {
                            color: token.light,
                            '--shiki-dark': token.dark,
                          } as CSSProperties
                        }
                      >
                        {token.content}
                      </span>
                    ))}
                    {lineIndex < codeTokens.length - 1 ? '\n' : null}
                  </span>
                ))}
              </code>
            </CodeBlock>
          </div>
        </div>
      </section>
      <nav
        aria-label={zh ? '开始构建' : 'Start building'}
        className="grid gap-8 py-12 sm:grid-cols-3"
      >
        {[
          [
            'layouts',
            zh ? '搭建页面' : 'Compose a page',
            zh
              ? '页头、正文、侧栏与页脚，共用一套布局节奏。'
              : 'Headers, content, sidebars, and footers with consistent spacing.',
          ],
          [
            'form',
            zh ? '连接交互' : 'Connect interactions',
            zh
              ? '从输入和校验到提交，通过 TanStack Form 管理表单。'
              : 'Connect fields, validation, and submission with TanStack Form.',
          ],
          [
            'theme',
            zh ? '调整外观' : 'Set the appearance',
            zh
              ? '语义化颜色、深浅主题与可选玻璃材质。'
              : 'Semantic colors, light and dark themes, and optional glass materials.',
          ],
        ].map(([slug, title, description]) => (
          <Link
            key={slug}
            href={`${prefix}/components/${slug}`}
            className="group block"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold">{title}</h2>
              <ArrowUpRight
                className="size-4 text-muted-foreground group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </Link>
        ))}
      </nav>
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
        <span>Blackwork · React UI</span>
        <a
          href="https://github.com/chengpeiquan/blackwork"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          {zh
            ? '开源于 GitHub · MIT 许可'
            : 'Open source on GitHub · MIT license'}
        </a>
      </footer>
    </div>
  )
}
