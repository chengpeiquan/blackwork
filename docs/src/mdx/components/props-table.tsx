export interface PropRow {
  name: string
  type: string
  defaultValue?: string
  required?: boolean
  description: string
}

export interface PropsTableProps {
  rows: PropRow[]
  title?: string
  description?: string
}

export const PropsTable = ({
  rows,
  title = 'API Reference',
  description,
}: PropsTableProps) => {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Prop</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Default</th>
              <th className="px-4 py-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.name}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3 align-top">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]">
                    {row.name}
                  </code>
                  {row.required ? (
                    <span className="ml-2 text-xs text-amber-700 dark:text-amber-300">
                      required
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top text-muted-foreground">
                  <code className="whitespace-pre-wrap break-words text-[13px]">
                    {row.type}
                  </code>
                </td>
                <td className="px-4 py-3 align-top text-muted-foreground">
                  {row.defaultValue ? (
                    <code className="text-[13px]">{row.defaultValue}</code>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 align-top text-muted-foreground">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
