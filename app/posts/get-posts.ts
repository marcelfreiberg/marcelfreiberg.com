import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'

export async function getPosts() {
    const { directories } = normalizePages({
        list: await getPageMap('/posts'),
        route: '/posts'
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