import DraggableTerminalWindow from './DraggableTerminalWindow'
import Link from 'next/link'

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

export default function BlogCard({
    title,
    description,
    index,
    route,
    date,
    tags
}: {
    title: string
    description?: string
    index: number
    route: string
    date?: string
    tags?: string[]
}) {
    return (
        <DraggableTerminalWindow
            title={`${(index + 1).toString().padStart(3, '0')}_blog_post.md`}
            className="group"
        >
            <Link href={route} className="space-y-3 block">
                <h2 className="text-lg font-bold text-neural-light group-hover:text-neural-blue transition-colors">{title}</h2>
                {description && <div className="text-neural-gray text-sm leading-relaxed">{description}</div>}
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-neural-border/40">
                    <div className="flex items-center gap-4 text-xs text-neural-gray">
                        {date && <span>📅 {formatDate(date)}</span>}
                        {/* <span>⏱️ 12 min</span> */}
                    </div>
                </div>
                {/* {tags && tags.length > 0 && <div>{tags.join(', ')}</div>} */}
            </Link>
        </DraggableTerminalWindow>
    )
}