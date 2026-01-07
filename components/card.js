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
        
        // On mobile/touch devices
        if (isMobileRef.current) {
            // If content is already expanded, allow navigation (don't prevent default)
            if (isTapped) {
                // Second tap: navigate to the link
                return // Allow the link to work normally
            }
            // First tap: expand to show content (prevent navigation)
            e.preventDefault()
            e.stopPropagation()
            setIsTapped(true)
        }
    }
    
    // Handle clicking on expanded content - allow navigation on second tap
    const handleExpandedClick = (e) => {
        if (!isMounted) return
        
        if (isMobileRef.current && isTapped) {
            // If clicking on a markdown link (span with pointer cursor), allow it
            const target = e.target.closest('span[style*="cursor: pointer"]')
            if (target) {
                return // Allow markdown link navigation
            }
            // Second tap anywhere else: navigate to main link
            // Don't prevent default - let the link work
            return
        }
    }

    const handleLinkClick = (e) => {
        // Only handle after mount
        if (!isMounted) return
        
        // On mobile, if content is NOT expanded, prevent navigation (first tap)
        // If content IS expanded, allow navigation (second tap)
        if (isMobileRef.current) {
            if (!isTapped) {
                // First tap - prevent navigation, will be handled by handleClick
                e.preventDefault()
                e.stopPropagation()
            }
            // If isTapped is true, allow navigation (don't prevent)
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
    // On server: isMounted=false, isTapped=false, isHovered=false, so isExpanded=false
    // On initial client render: same values, so classes match
    const baseCardClass = `topster-card ${opacityClasses[importance]}`
    const tappedClass = isMounted && isTapped ? ' tapped' : ''
    const pointerClass = href ? ' cursor-pointer' : ' pointer-events-none'
    const cardClassName = `${baseCardClass}${tappedClass}${pointerClass}`.trim()
    
    // Only add expanded class after mount to ensure server/client match
    const baseExpandedClass = 'topster-card-expanded'
    const expandedClass = isMounted && isExpanded ? ' expanded' : ''
    const expandedClassName = `${baseExpandedClass}${expandedClass}`.trim()

    // Memoize the markdown components to avoid hydration issues
    // Render links as spans to avoid nested <a> tags inside Link
    // Make this stable across server and client renders
    const markdownComponents = useMemo(() => {
        const LinkSpan = ({ href, children }) => {
            const linkHref = href
            return (
                <span 
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
        
        return {
            a: LinkSpan
        }
    }, [])

    const CardContent = () => (
        <div 
            ref={cardRef}
            className={cardClassName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
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
                onClick={handleExpandedClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="topster-expanded-content">
                    <h3 className="topster-expanded-title">{title ?? 'Empty Card Title'}</h3>
                    <div className="topster-expanded-text">
                        <ReactMarkdown 
                            plugins={[gfm]} 
                            components={markdownComponents}
                            skipHtml={true}
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