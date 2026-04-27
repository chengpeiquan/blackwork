export interface PagefindIndexingResponse {
  errors: string[]
  page_count: number
}

export interface PagefindCustomRecord {
  content: string
  filters?: Record<string, string[]>
  language: string
  meta?: Record<string, string>
  sort?: Record<string, string>
  url: string
}

export interface PagefindCreateIndexResponse {
  errors: string[]
  index?: PagefindDirectoryIndex
}

export interface PagefindNewFile {
  meta: Record<string, string>
  uniqueWords: number
  url: string
}

export interface PagefindNewFileResponse {
  errors: string[]
  file: PagefindNewFile
}

export interface PagefindWriteFilesResponse {
  errors: string[]
  outputPath: string
}

export interface PagefindDirectoryIndex {
  addCustomRecord(
    record: PagefindCustomRecord,
  ): Promise<PagefindNewFileResponse>
  addDirectory(options: {
    glob?: string
    path: string
  }): Promise<PagefindIndexingResponse>
  writeFiles(options: {
    outputPath: string
  }): Promise<PagefindWriteFilesResponse>
}

export interface PagefindModule {
  close(): Promise<null | void>
  createIndex(): Promise<PagefindCreateIndexResponse>
}

export const loadPagefind = async (): Promise<PagefindModule> =>
  (await import('pagefind')) as unknown as PagefindModule
