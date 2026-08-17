import { DocsRootLayout } from '@blackwork/docs'
import { docsConfig } from '../../docs.config'
import './globals.css'

type RootLayoutProps = React.PropsWithChildren<{
  params: Promise<{ slug?: string[] }>
}>

const RootLayout = ({ children, params }: RootLayoutProps) => {
  return (
    <DocsRootLayout config={docsConfig} params={params}>
      {children}
    </DocsRootLayout>
  )
}

export default RootLayout
