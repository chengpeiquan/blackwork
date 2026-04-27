import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'

const fixtures = new Set<string>()

const createFixture = () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-exported-html-'))
  fixtures.add(rootDir)

  const write = (relativePath: string, source: string) => {
    const filePath = join(rootDir, relativePath)
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, source)
  }

  const read = (relativePath: string) =>
    readFileSync(join(rootDir, relativePath), 'utf8')

  return {
    read,
    rootDir,
    write,
  }
}

afterEach(() => {
  for (const fixture of fixtures) {
    rmSync(fixture, { recursive: true, force: true })
  }

  fixtures.clear()
})

describe('processExportedDocs', () => {
  test('rewrites exported html lang attributes from docs locale definitions', async () => {
    const fixture = createFixture()

    fixture.write(
      'out/index.html',
      '<!DOCTYPE html><html lang="en"><body /></html>',
    )
    fixture.write(
      'out/guide/getting-started/index.html',
      '<!DOCTYPE html><html lang="en"><body /></html>',
    )
    fixture.write(
      'out/zh/index.html',
      '<!DOCTYPE html><html lang="en"><body /></html>',
    )
    fixture.write(
      'out/zh/guide/getting-started/index.html',
      '<!DOCTYPE html><html lang="en"><body /></html>',
    )

    const { defineConfig, processExportedDocs } =
      await import('@blackwork/docs')

    await processExportedDocs({
      config: defineConfig({
        content: {
          defaultLocale: 'en',
          locales: {
            en: {
              code: 'en',
              lang: 'en-US',
              label: 'English',
            },
            zh: {
              code: 'zh',
              lang: 'zh-CN',
              label: '简体中文',
            },
          },
        },
      }),
      outDir: 'out',
      rootDir: fixture.rootDir,
    })

    expect(fixture.read('out/index.html')).toContain('<html lang="en-US">')
    expect(fixture.read('out/guide/getting-started/index.html')).toContain(
      '<html lang="en-US">',
    )
    expect(fixture.read('out/zh/index.html')).toContain('<html lang="zh-CN">')
    expect(fixture.read('out/zh/guide/getting-started/index.html')).toContain(
      '<html lang="zh-CN">',
    )
  })

  test('auto-discovers content.config locale lang metadata when config is omitted', async () => {
    const fixture = createFixture()

    fixture.write(
      'content.config.ts',
      `export const docsContentConfig = {
  defaultLocale: 'en',
  locales: {
    en: { code: 'en', lang: 'en-US', label: 'English' },
    zh: { code: 'zh', lang: 'zh-CN', label: '简体中文' },
  },
}
`,
    )
    fixture.write(
      'out/index.html',
      '<!DOCTYPE html><html lang="en"><body /></html>',
    )
    fixture.write(
      'out/zh/index.html',
      '<!DOCTYPE html><html lang="en"><body /></html>',
    )

    const { processExportedDocs } = await import('@blackwork/docs')

    await processExportedDocs({
      outDir: 'out',
      rootDir: fixture.rootDir,
    })

    expect(fixture.read('out/index.html')).toContain('<html lang="en-US">')
    expect(fixture.read('out/zh/index.html')).toContain('<html lang="zh-CN">')
  })
})
