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
        
        // Cancel hover timeout on scroll to prevent greying out during scroll
        const handleScroll = () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current)
                hoverTimeoutRef.current = null
            }
        }
        window.addEventListener('scroll', handleScroll, true) // Use capture phase
        
        return () => {
            window.removeEventListener('resize', checkMobile)
            window.removeEventListener('scroll', handleScroll, true)
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
        if (!isMounted || isMobileRef.current) return
        
        // Clear any pending hide timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
        setIsHovered(true)
    }

    const handleMouseLeave = (e) => {
        // Only handle hover after mount and on desktop
        if (!isMounted || isMobileRef.current) return
        
        // Check if mouse actually left the card (not just moved to expanded content)
        if (cardRef.current && e.relatedTarget) {
            // If mouse moved to a child element, don't hide
            if (cardRef.current.contains(e.relatedTarget)) {
                return
            }
        }
        
        // Add a longer delay before hiding to prevent flicker during scrolling
        hoverTimeoutRef.current = setTimeout(() => {
            // Double-check that we're still not hovering before hiding
            // The scroll handler will cancel this if user is scrolling
            if (cardRef.current && document.contains(cardRef.current)) {
                setIsHovered(false)
            }
            hoverTimeoutRef.current = null
        }, 300) // Increased delay to prevent flicker during scroll
    }

    // Compute className - only apply interactive classes after mount to avoid hydration issues
    const cardClassName = `topster-card ${opacityClasses[importance]}${isMounted && isTapped ? ' tapped' : ''}${href ? ' cursor-pointer' : ' pointer-events-none'}`.trim()
    const expandedClassName = `topster-card-expanded${isMounted && isExpanded ? ' expanded' : ''}`.trim()

    // Memoize the markdown components to avoid hydration issues
    // Render links as spans to avoid nested <a> tags inside Link
    const markdownComponents = useMemo(() => ({
        a: ({ href, children, ...props }) => {
            // Remove href and other link-specific props to avoid issues
            const { href: _, node, ...spanProps } = props
            return (
                <span 
                    {...spanProps}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        if (href && typeof window !== 'undefined') {
                            window.open(href, '_blank', 'noopener,noreferrer')
                        }
                    }}
                    style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', cursor: 'pointer' }}
                >
                    {children}
                </span>
            )
        }
    }), [])

    const CardContent = () => (
        <div 
            ref={cardRef}
            className={cardClassName}
            onMouseEnter={isMounted ? handleMouseEnter : undefined}
            onMouseLeave={isMounted ? handleMouseLeave : undefined}
            onClick={isMounted ? handleClick : undefined}
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
                onClick={isMounted ? handleClick : undefined}
                onMouseEnter={isMounted ? handleMouseEnter : undefined}
                onMouseLeave={isMounted ? handleMouseLeave : undefined}
            >
                <div className="topster-expanded-content">
                    <h3 className="topster-expanded-title">{title ?? 'Empty Card Title'}</h3>
                    <div className="topster-expanded-text">
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
                    onClick={isMounted ? handleLinkClick : undefined} 
                    style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                    <CardContent />
                </a>
            </Link>
        )
    }

    return <CardContent />
}