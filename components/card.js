import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { useState } from 'react'

export function GalleryCard({
    title,
    children,
    href,
    icon: Icon,
    importance = 1 // 1-3, for opacity and visual weight
}) {
    const [isHovered, setIsHovered] = useState(false)
    
    const opacityClasses = {
        1: 'opacity-100',
        2: 'opacity-85',
        3: 'opacity-70'
    }

    const CardContent = () => (
        <div 
            className={`topster-card ${opacityClasses[importance]} ${href ? 'cursor-pointer' : 'pointer-events-none'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="topster-card-compact">
                {Icon && (
                    <div className="topster-icon">
                        <Icon />
                    </div>
                )}
                <div className="topster-title">{title ?? 'Empty Card Title'}</div>
            </div>
            
            <div className={`topster-card-expanded ${isHovered ? 'expanded' : ''}`}>
                <div className="topster-expanded-content">
                    <h3 className="topster-expanded-title">{title ?? 'Empty Card Title'}</h3>
                    <div className="topster-expanded-text">
                        <ReactMarkdown plugins={[gfm]} bullet={true}>
                            {children ?? '**Lorem ipsum dolor sit amet.** Empty card description.'}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    )

    if (href) {
        return (
            <Link href={href} className="topster-link">
                <CardContent />
            </Link>
        )
    }

    return <CardContent />
}