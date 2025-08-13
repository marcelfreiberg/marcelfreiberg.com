import type { Metadata } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import 'katex/dist/katex.min.css'
import './blog-theme.css'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: { params: Promise<{ mdxPath: string[] }> }): Promise<Metadata> {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata as Metadata
}

export default async function Page(props: { params: Promise<{ mdxPath: string[] }> }) {
  const params = await props.params
  const { default: MDXContent, metadata } = await importPage(params.mdxPath)

  type BlogMeta = { title?: string; date?: string | Date; abstract?: string }
  const { title, date: rawDate, abstract } = metadata as BlogMeta

  const formattedDate = (() => {
    if (!rawDate) return null
    try {
      if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
        const [y, m, d] = rawDate.split('-').map(Number)
        const dt = new Date(Date.UTC(y, m - 1, d))
        return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      }
      const dt = new Date(rawDate as any)
      return Number.isNaN(dt.getTime()) ? String(rawDate) : dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return String(rawDate)
    }
  })()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 blog-theme">
      {title ? <h1>{title}</h1> : null}
      {formattedDate ? <div className="post-date">{formattedDate}</div> : null}
      {abstract ? (
        <div className="abstract">
          <div className="abstract-label">Abstract</div>
          <div className="abstract-text">{abstract}</div>
        </div>
      ) : null}
      <MDXContent />
    </div>
  )
}
