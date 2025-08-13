import 'katex/dist/katex.min.css'
import './blog-theme.css'

export default function BlogPostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 blog-theme">
      {children}
    </div>
  )
}
