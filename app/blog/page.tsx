import Link from 'next/link'
import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'
import '../globals.css'
import BlogCard from '@/components/BlogCard'

export async function getPosts() {
  const { directories } = normalizePages({
    list: await getPageMap('/blog'),
    route: '/blog'
  })

  return directories
    .filter(post => post.name !== 'index')
    .sort((a, b) => {
      const dateA = a.frontMatter?.date
      const dateB = b.frontMatter?.date
      if (!dateA || !dateB) return 0
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
}

export async function getTags() {
  const posts = await getPosts()
  const tags = posts.flatMap(post => post.frontMatter?.tags || [])
  return tags
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <BlogCard
            key={post.route}
            title={post.title as string}
            description={post.frontMatter?.description}
            index={posts.length - index - 1}
            route={post.route}
            date={post.frontMatter?.date}
            tags={post.frontMatter?.tags}
          />
        ))}
      </div>
    </div>
  )
}