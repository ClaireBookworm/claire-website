import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { useMemo } from 'react'
import { TAG_LABELS } from '../lib/gallery-tags'

export function GalleryCard({
    title,
    children,
    href,
    icon: Icon,
    importance = 1,
    tags = [],
}) {
    const markdownComponents = useMemo(() => {
        const LinkSpan = ({ href: linkHref, children: mdChildren }) => (
            <span
                role="link"
                tabIndex={0}
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (linkHref && typeof window !== 'undefined') {
                        window.open(linkHref, '_blank', 'noopener,noreferrer')
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        if (linkHref && typeof window !== 'undefined') {
                            window.open(linkHref, '_blank', 'noopener,noreferrer')
                        }
                    }
                }}
                style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', cursor: 'pointer' }}
            >
                {mdChildren}
            </span>
        )
        return { a: LinkSpan }
    }, [])

    const importanceClass =
        importance === 1 ? 'project-card--loud' :
        importance === 2 ? 'project-card--medium' :
        'project-card--soft'

    const inner = (
        <>
            {tags.length > 0 && (
                <div className="project-card-tags" aria-label="Tags">
                    {tags.map((slug) => (
                        <span key={slug} className="project-card-tag">
                            #{TAG_LABELS[slug] ?? slug}
                        </span>
                    ))}
                </div>
            )}
            <div className="project-card-top">
                {Icon && (
                    <div className="project-card-icon-wrap" aria-hidden>
                        <Icon className="project-card-icon" />
                    </div>
                )}
                <div className="project-card-heading">
                    <h3 className="project-card-title">{title ?? 'Empty Card Title'}</h3>
                    {href && (
                        <span className="project-card-chip" aria-hidden>
                            ↗
                        </span>
                    )}
                </div>
            </div>
            <div className="project-card-desc">
                <ReactMarkdown plugins={[gfm]} components={markdownComponents} skipHtml={true}>
                    {children ?? ''}
                </ReactMarkdown>
            </div>
        </>
    )

    if (href) {
        const external = /^https?:\/\//.test(href)
        return (
            <article className={`project-card ${importanceClass}`}>
                <Link
                    href={href}
                    className="project-card-link"
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                    {inner}
                </Link>
            </article>
        )
    }

    return (
        <article className={`project-card ${importanceClass}`}>
            <div className="project-card-link project-card-link--static">{inner}</div>
        </article>
    )
}
