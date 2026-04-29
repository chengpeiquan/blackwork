# @blackwork/search

<p>
  <a href='https://www.npmjs.com/package/@blackwork/search'>
    <img src="https://img.shields.io/npm/v/@blackwork/search?color=333&label=npm" />
  </a>
  <a href="https://www.npmjs.com/package/@blackwork/search" target="__blank">
    <img src="https://img.shields.io/npm/dt/@blackwork/search?color=333&label=downloads" />
  </a>
  <a href="https://github.com/chengpeiquan/blackwork" target="__blank">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/chengpeiquan/blackwork?style=social" />
  </a>
</p>

`@blackwork/search` provides the Pagefind integration used by Blackwork projects.

It has two entry surfaces:

- `@blackwork/search` for server-side indexing utilities.
- `@blackwork/search/browser` for browser-side search clients.

## Install

```bash
pnpm add @blackwork/search
```

## Index a Static Site

Use `indexSite` after your site has been built to static HTML. By default, the
Pagefind bundle is written to a `pagefind` directory inside the site output.

```ts
import { indexSite } from '@blackwork/search'

const result = await indexSite({
  site: './out',
  glob: '**/*.html',
})

console.log(result.siteRelativeOutputPath)
```

You can write the bundle somewhere else when your framework expects a different
public asset path:

```ts
import { indexSite } from '@blackwork/search'

await indexSite({
  site: './out',
  output: {
    path: './public/pagefind',
  },
})
```

## Index Records

Use `indexRecords` when your content pipeline already has structured records and
does not need to crawl generated HTML.

```ts
import { indexRecords } from '@blackwork/search'

await indexRecords({
  locale: 'en-US',
  records: [
    {
      id: 'guide-intro',
      title: 'Introduction',
      url: '/guide',
      content: 'Blackwork guide introduction.',
      metadata: {
        section: 'guide',
      },
    },
  ],
})
```

Records must define either `language` or a locale that can be used to derive the
language.

## Browser Client

Use `createSearchClient` in client-side code to load the generated Pagefind
bundle and normalize search results.

```ts
import { createSearchClient } from '@blackwork/search/browser'

const client = createSearchClient({
  basePath: '/docs',
})

await client.preload('routing')

const result = await client.search('routing', {
  filters: {
    locale: ['en-US'],
  },
})

console.log(result.items)

await client.destroy()
```

The client loads `/pagefind/pagefind.js` by default. Use `basePath` for nested
deployments, or `bundlePath` when the Pagefind bundle is served from a custom
location.

## Exports

```ts
import { createSearchClient, indexRecords, indexSite } from '@blackwork/search'
import { createSearchClient as createBrowserSearchClient } from '@blackwork/search/browser'
```

The browser subpath only exports `createSearchClient` and browser-safe types.
