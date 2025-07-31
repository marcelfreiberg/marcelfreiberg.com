import { Footer, Layout, Navbar } from 'nextra-theme-blog'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './globals.css'

export const metadata = {
  title: 'Marcel Freiberg'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head backgroundColor={{ dark: '#0f172a', light: '#fefce8' }} />
      <body>
        <Layout>
          <Navbar pageMap={await getPageMap()}>
            {/* <Search /> */}
          </Navbar>

          {children}

          <Footer>
            {new Date().getFullYear()} © Marcel Freiberg.
          </Footer>
        </Layout>
      </body>
    </html>
  )
}