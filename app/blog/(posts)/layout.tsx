import 'katex/dist/katex.min.css'

export default function BlogPostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          {/* Header gradient */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mb-8 prose-h1:bg-gradient-to-r prose-h1:from-slate-900 prose-h1:to-slate-600 prose-h1:bg-clip-text prose-h1:text-transparent dark:prose-h1:from-slate-100 dark:prose-h1:to-slate-300
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-slate-800 dark:prose-h2:text-slate-200 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-4
              prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-strong:font-semibold
              prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-700/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              [&_.katex-display]:my-8 [&_.katex-display]:p-6 [&_.katex-display]:bg-slate-50 dark:[&_.katex-display]:bg-slate-700/30 [&_.katex-display]:rounded-xl [&_.katex-display]:border [&_.katex-display]:border-slate-200 dark:[&_.katex-display]:border-slate-600/50 [&_.katex-display]:shadow-sm
              [&_.katex]:text-slate-800 dark:[&_.katex]:text-slate-200
              [&_span.katex]:bg-slate-100/50 dark:[&_span.katex]:bg-slate-700/20 [&_span.katex]:px-2 [&_span.katex]:py-1 [&_span.katex]:rounded [&_span.katex]:mx-1">
              {children}
            </div>
          </div>
          
          {/* Footer gradient */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
        </article>
      </div>
    </div>
  )
}
