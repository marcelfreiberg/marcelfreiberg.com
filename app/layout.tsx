import './globals.css'
import Navigation from '@/components/Navigation'
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata = {
  title: 'Marcel Freiberg'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="min-h-screen">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}