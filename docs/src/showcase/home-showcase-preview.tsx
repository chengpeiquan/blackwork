import { codeToTokensWithThemes } from 'shiki'
import { HomeShowcase } from './home-showcase'
import { HOME_SHOWCASE_CODE } from './home-showcase-code'

export const HomeShowcasePreview = async ({ locale }: { locale: string }) => {
  const highlighted = await codeToTokensWithThemes(HOME_SHOWCASE_CODE, {
    lang: 'tsx',
    themes: { light: 'one-light', dark: 'dark-plus' },
  })
  const codeTokens = highlighted.map((line) =>
    line.map((token) => ({
      content: token.content,
      light: token.variants.light.color ?? '#383A42',
      dark: token.variants.dark.color ?? '#D4D4D4',
    })),
  )

  return <HomeShowcase locale={locale} codeTokens={codeTokens} />
}
