import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

export function GalleryCard({
    title,
    children,
    href
}) {
    return (
        <Link href={href ?? '/'}>
            <a className={`rounded border border-white max-w-sm p-5 ${href ? 'hover:bg-white hover:text-black transition duration-200' : 'pointer-events-none'}`}>
                <h1 className="text-2xl font-bold cardTitle">{title ?? 'Empty Card Title'}</h1>
                <p className="">
                    <ReactMarkdown plugins={[gfm]} bullet={true}>
                        {children ?? '**Lorem ipsum dolor sit amet.** Empty card description.'}
                    </ReactMarkdown>
                </p>
            </a>
        </Link>
    )
}