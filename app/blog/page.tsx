import Link from 'next/link'
import { PostCard } from 'nextra-theme-blog'
import { getPosts, getTags } from './get-posts'
import 'nextra-theme-blog/style.css'

export const metadata = {
  title: 'Posts'
}

export default async function PostsPage() {
  const tags = await getTags()
  const posts = await getPosts()
  const allTags: Record<string, number> = Object.create(null)

  for (const tag of tags) {
    allTags[tag] ??= 0
    allTags[tag] += 1
  }

  return (
    <div data-pagefind-ignore="all" className="max-w-4xl mx-auto px-4 py-8">
      {/* <h1>{metadata.title}</h1> */}
      <div
        className="not-prose"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}
      >
        {Object.entries(allTags).map(([tag, count]) => (
          <Link key={tag} href={`/tags/${tag}`} className="nextra-tag">
            {tag} ({count})
          </Link>
        ))}
      </div>
      {posts.map(post => (
        <PostCard key={post.route} post={post} />
      ))}
    </div>
  )
}