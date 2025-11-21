import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { useState, useEffect, useRef, useMemo } from 'react'

export function GalleryCard({
    title,
    children,
    href,
    icon: Icon,
    importance = 1 // 1-3, for opacity and visual weight
}) {
    const [isHovered, setIsHovered] = useState(false)
    const [isTapped, setIsTapped] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const hoverTimeoutRef = useRef(null)
    const cardRef = useRef(null)
    const isMobileRef = useRef(false)
    
    useEffect(() => {
        // Mark as mounted to avoid hydration issues
        setIsMounted(true)
        // Detect mobile after mount to avoid hydration issues
        const checkMobile = () => {
            isMobileRef.current = window.innerWidth < 768 || 'ontouchstart' in window
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        return () => {
            window.removeEventListener('resize', checkMobile)
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
        }
    }, [])
    
    const opacityClasses = {
        1: 'opacity-100',
        2: 'opacity-85',
        3: 'opacity-70'
    }

    const handleClick = (e) => {
        // Only handle mobile clicks after mount to avoid hydration issues
        if (!isMounted) return
        
        // On mobile/touch devices, toggle expanded state on click
        if (isMobileRef.current) {
            e.preventDefault()
            e.stopPropagation()
            setIsTapped(prev => !prev)
        }
    }

    const handleLinkClick = (e) => {
        // Only handle after mount
        if (!isMounted) return
        
        // Prevent navigation on mobile when toggling
        if (isMobileRef.current && isTapped) {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    const isExpanded = isHovered || isTapped

    const handleMouseEnter = (e) => {
        // Only handle hover after mount and on desktop
        if (!isMounted) return
        
        // Don't handle hover on mobile - use tap instead
        if (isMobileRef.current) return
        
        // Clear any pending hide timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
        setIsHovered(true)
    }

    const handleMouseLeave = (e) => {
        // Only handle hover after mount and on desktop
        if (!isMounted) return
        
        // Don't handle hover on mobile - use tap instead
        if (isMobileRef.current) return
        
        // Check if mouse actually left the card (not just moved to expanded content)
        if (cardRef.current && e.relatedTarget) {
            // If mouse moved to a child element, don't hide
            if (cardRef.current.contains(e.relatedTarget)) {
                return
            }
        }
        
        // Hide immediately - no delay to prevent overlay issue
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
        setIsHovered(false)
    }

    // Compute className - ensure consistent between server and client
    // On server and initial client render, isMounted is false, so classes are consistent
    // Use array join to ensure consistent spacing
    const cardClassParts = [
        'topster-card',
        opacityClasses[importance]
    ]
    if (isMounted && isTapped) cardClassParts.push('tapped')
    if (href) cardClassParts.push('cursor-pointer')
    else cardClassParts.push('pointer-events-none')
    const cardClassName = cardClassParts.join(' ')
    
    // Only add expanded class after mount to ensure server/client match
    const expandedClassParts = ['topster-card-expanded']
    if (isMounted && isExpanded) expandedClassParts.push('expanded')
    const expandedClassName = expandedClassParts.join(' ')

    // Memoize the markdown components to avoid hydration issues
    // Render links as spans to avoid nested <a> tags inside Link
    const markdownComponents = useMemo(() => {
        return {
            a: ({ href, children, ...props }) => {
                // Extract href and remove link-specific props
                const linkHref = href
                const { node, target, rel, ...restProps } = props
                
                return (
                    <span 
                        {...restProps}
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            if (linkHref && typeof window !== 'undefined') {
                                window.open(linkHref, '_blank', 'noopener,noreferrer')
                            }
                        }}
                        style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', cursor: 'pointer' }}
                    >
                        {children}
                    </span>
                )
            }
        }
    }, [])

    const CardContent = () => (
        <div 
            ref={cardRef}
            className={cardClassName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            suppressHydrationWarning
        >
            <div className="topster-card-compact">
                {Icon && (
                    <div className="topster-icon">
                        <Icon />
                    </div>
                )}
                <div className="topster-title">{title ?? 'Empty Card Title'}</div>
            </div>
            
            <div 
                className={expandedClassName}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                suppressHydrationWarning
            >
                <div className="topster-expanded-content">
                    <h3 className="topster-expanded-title">{title ?? 'Empty Card Title'}</h3>
                    <div className="topster-expanded-text" suppressHydrationWarning>
                        <ReactMarkdown 
                            plugins={[gfm]} 
                            components={markdownComponents}
                        >
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
                <a 
                    onClick={handleLinkClick} 
                    style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                    <CardContent />
                </a>
            </Link>
        )
    }

    return <CardContent />
}