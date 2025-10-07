import Head from 'next/head';
import Layout from "../components/layout";

export default function Radio() {
	return (
		<Layout>
			<Head>
				<title>radio</title>
				<link rel="preconnect" href="https://fonts.googleapis.com"></link>
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
				<link href="https://fonts.googleapis.com/css2?family=Limelight&display=swap" rel="stylesheet"></link>
				<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap" rel="stylesheet"></link>
			</Head>
			<main>
				<h1 className="heading" style={{fontFamily: 'Limelight'}}>death car for qt</h1>
				<section className="selfbio mt-8 md:mt-16 w-2/3 lg:w-1/2 md:text-xl" style={{lineHeight: '1.9rem'}}>
					<span style={{marginBottom: "1rem", display: "block"}}>
						<p className="radio-content">Welcome to the radio page! Death Car for QT was inspired by really good production and how many shared sampling and styles there are between genres and artists. I'm a huge fan of Jack Antonoff and I think, in general, there's a lot of skill to pop music that's ignored. Beyond that, I really love jazz, electronic music, r&b, alternative indie, punk/psychdelic rock... and want to play them! <br /><br />Every week, I'll have a "connections" with three songs that have something in common. You can also find the tracklist from my <a className="landing-link" href="https://track-blaster.com/wmbr/?startdt=1984-06-28&enddt=2030-09-23&sort=desc&program=587">WMBR track-blaster</a>. <strong>Listen at 88.1 FM WMBR in Boston or at <a className="landing-link" style={{fontStyle: 'italic'}} href="https://wmbr.org/">wmbr.org</a> at Monday nights (12-1AM EST).</strong></p>
					</span>

					<br />

					<p className="radio-heading">Week 1</p>
					<br></br>

					<iframe data-testid="embed-iframe" style={{"border-radius": "12px"}} src="https://open.spotify.com/embed/playlist/50gCG7CZhe3IiyMoNzuodH?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

					<br />
					<p className="radio-content">The connections here between the songs <em>It's Only Love</em>, <em>Ode to the Mets</em>, and <em>You Don't Own Me</em> is this melody that's sampled in many, many songs. You can find some info about it at <a className="landing-link" href="https://www.reddit.com/r/WhoSampled/comments/nsatby/can_anyone_id_the_source_of_the_melody_in_good/">this reddit post</a>. Some of the songs that have also sampled the melody are <em>Build a Bitch</em> by Bella Poarch, <em>From the Dining Table</em> by Harry Styles, and <em>3 Daqat</em> by Abu. Find a link to a complete-ish playlist <a className="landing-link" href="https://open.spotify.com/playlist/1rDNlpuKpIy7hN20f3Iw3U?si=9f1ace7a45564d70">here</a>.</p>

					<br />

					<p className="radio-heading">Week 2</p>
					<br />
					<iframe data-testid="embed-iframe" style={{"border-radius": "12px"}} src="https://open.spotify.com/embed/playlist/4oBpiIQ1dWxuOXJpUQaBGT?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

					<br />

					<p className="radio-content">Honestly, I kind of forgot to talk about the connections this week on the actual radio segment, but it just so conveniently happens that there are 3 <strong>Jack Antonoff</strong> produced songs in this tracklist! <em>The Whole of the Moon (Live at Radio City Hall)</em> is a cover by Bleachers of the original The Waterboys track and might be one of my favorite live tracks ever. Then, <em>Comeback</em> by Carly Rae Jepson & Bleachers is what I consider to be the perfect culmination of "real" pop: catchy, joyful, clean blend of production and lyrics, and doesn't try too hard what it isn't. That song and <em>I'm In Love With You</em> by the 1975 are produced by Jack Antonoff, but have very different interpretations of what 'pop' means. Finally, just on a personal anecdote, Turnstile and Remi Wolf performed at the most recent (2024) <a className="landing-link" href="https://theallycoalition.org/">The Ally Coalition</a> Talent Show in New York, which I was at, as they are good friends with the foundation that was founded by Jack and Rachel Antonoff.</p>

					<br /><br />

					<p className="radio-heading">Week 3</p>
					<br />
					<iframe data-testid="embed-iframe" style={{"border-radius": "12px"}} src="https://open.spotify.com/embed/playlist/7IJLBQV3tcVn0yZilTSccl?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
					<p className="radio-content"><a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58050">link to recording + track blaster list</a></p>

					<br />
					<p className="radio-content">This week, the connections are between Thundercat's <em>Heartbreaks + Setbacks</em>, Esperanza Spalding's <em>I Know You Know</em>, and willow's <em>b i g f e e l i n g s</em>. They all showcase virtuosic jazz bass playing: not just holding down the low end but actually leading the melody. There is some history to this: thundercat studied at the musician's institute, spalding at berklee, mohini dey (who is on bass in willow's track) trained in indian classical before going full jazz fusion. In addition, flying lotus, a producer on Thundercat's track (and album) cites Miles Davis (on this week's show with <em>Black Satin</em>) as a major influence.</p>

				</section>
			</main>
		</Layout>
	);
}