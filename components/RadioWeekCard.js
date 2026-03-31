'use client'

import { useId, useState } from 'react'

const spotifyEmbed = (playlistId) =>
	`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`

export default function RadioWeekCard({ id, title, playlistId, children }) {
	const [open, setOpen] = useState(false)
	const panelId = useId()
	const titleId = useId()

	return (
		<article className="radio-week-card" id={id}>
			<button
				type="button"
				className="radio-week-card__toggle"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls={panelId}
			>
				<span id={titleId} className="radio-week-card__title-text">
					{title}
				</span>
				<span className="radio-week-card__toggle-meta" aria-hidden>
					<span className="radio-week-card__toggle-hint">{open ? 'Hide' : 'Notes'}</span>
					<span className={`radio-week-card__chevron ${open ? 'is-open' : ''}`} />
				</span>
			</button>

			<div className="radio-week-card__embed">
				<iframe
					title={`Spotify — ${title}`}
					className="radio-spotify-iframe"
					src={spotifyEmbed(playlistId)}
					width="100%"
					height={480}
					frameBorder="0"
					allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
					loading="lazy"
				/>
			</div>

			<div
				id={panelId}
				className={`radio-week-card__body ${open ? 'is-open' : ''}`}
				aria-hidden={!open}
				role="region"
				aria-labelledby={titleId}
			>
				{children}
			</div>
		</article>
	)
}
