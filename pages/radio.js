import Head from 'next/head';
import Layout from "../components/layout";

export default function Radio() {
	return (
		<Layout>
			<Head>
				<title>radio</title>
				<link rel="preconnect" href="https://fonts.googleapis.com"></link>
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
				<link href="https://fonts.googleapis.com/css2?family=Limelight&display=swap" rel="stylesheet"></link>
				<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap" rel="stylesheet"></link>
			</Head>
			<main>
				<h1 className="heading" style={{fontFamily: 'Limelight'}}>death car for qt</h1>
				<section className="selfbio mt-8 md:mt-16 w-2/3 lg:w-1/2 md:text-xl" style={{lineHeight: '1.9rem'}}>
					<span style={{marginBottom: "1rem", display: "block"}}>
						<p className="radio-content">Welcome to the radio page! Death Car for QT was inspired by really good production and how many shared sampling and styles there are between genres and artists. I'm a huge fan of Jack Antonoff and I think, in general, there's a lot of skill to pop music that's ignored. Beyond that, I really love jazz, electronic music, r&b, alternative indie, punk/psychdelic rock... and want to play them! 
							
							<br /><br />
						
						Every week, I'll have a "connections" with three songs that have something in common. You can also find the tracklist from my <a className="landing-link" href="https://track-blaster.com/wmbr/?startdt=1984-06-28&enddt=2030-09-23&sort=desc&program=587">WMBR track-blaster</a>. Recordings are available for the 2 most recent weeks. <strong>Listen at 88.1 FM WMBR in Boston or at <a className="landing-link" style={{fontStyle: 'italic'}} href="https://wmbr.org/">wmbr.org</a> at Monday nights (12-1AM EST).</strong>
						
						<br /> <br />
						
						This page is slightly out of date, will update soon!
						</p>
					</span>

					<br />

					<div style={{width: '100%', marginBottom: '2rem', padding: '1.5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.2)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)'}}>
						<div style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-start', alignItems: 'center', fontFamily: "'Courier New', 'Courier', monospace"}}>
							<span style={{opacity: 0.5}}>Week:</span>
							<a href="#week-1" className="landing-link" style={{textDecoration: 'none', opacity: 0.5, transition: 'opacity 0.2s ease'}} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.5'}>one</a>
							<a href="#week-2" className="landing-link" style={{textDecoration: 'none', opacity: 0.5, transition: 'opacity 0.2s ease'}} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.5'}>two</a>
							<a href="#week-3" className="landing-link" style={{textDecoration: 'none', opacity: 0.5, transition: 'opacity 0.2s ease'}} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.5'}>three</a>
							<a href="#week-4" className="landing-link" style={{textDecoration: 'none', opacity: 0.5, transition: 'opacity 0.2s ease'}} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.5'}>four</a>
							<a href="#week-5" className="landing-link" style={{textDecoration: 'none', opacity: 0.5, transition: 'opacity 0.2s ease'}} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.5'}>five</a>
							<a href="#week-6" className="landing-link" style={{textDecoration: 'none', opacity: 0.5, transition: 'opacity 0.2s ease'}} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.5'}>six</a>
						</div>
					</div>

					<br />

					<p className="radio-heading" id="week-1">Week 1: Sep 22</p>
					<br></br>

					<iframe data-testid="embed-iframe" style={{borderRadius: "12px"}} src="https://open.spotify.com/embed/playlist/50gCG7CZhe3IiyMoNzuodH?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

					<br />
					<p className="radio-content">The connections here between the songs <em>It's Only Love</em>, <em>Ode to the Mets</em>, and <em>You Don't Own Me</em> is this melody that's sampled in many, many songs. You can find some info about it at <a className="landing-link" href="https://www.reddit.com/r/WhoSampled/comments/nsatby/can_anyone_id_the_source_of_the_melody_in_good/">this reddit post</a>. Some of the songs that have also sampled the melody are <em>Build a Bitch</em> by Bella Poarch, <em>From the Dining Table</em> by Harry Styles, and <em>3 Daqat</em> by Abu. Find a link to a complete-ish playlist <a className="landing-link" href="https://open.spotify.com/playlist/1rDNlpuKpIy7hN20f3Iw3U?si=9f1ace7a45564d70">here</a>.</p>

					<br />

					<p className="radio-heading" id="week-2">Week 2: Sep 29</p>
					<br />
					<iframe data-testid="embed-iframe" style={{borderRadius: "12px"}} src="https://open.spotify.com/embed/playlist/4oBpiIQ1dWxuOXJpUQaBGT?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

					<br />

					<p className="radio-content">Honestly, I kind of forgot to talk about the connections this week on the actual radio segment, but it just so conveniently happens that there are 3 <strong>Jack Antonoff</strong> produced songs in this tracklist! <em>The Whole of the Moon (Live at Radio City Hall)</em> is a cover by Bleachers of the original The Waterboys track and might be one of my favorite live tracks ever. Then, <em>Comeback</em> by Carly Rae Jepson & Bleachers is what I consider to be the perfect culmination of "real" pop: catchy, joyful, clean blend of production and lyrics, and doesn't try too hard what it isn't. That song and <em>I'm In Love With You</em> by the 1975 are produced by Jack Antonoff, but have very different interpretations of what 'pop' means. Finally, just on a personal anecdote, Turnstile and Remi Wolf performed at the most recent (2024) <a className="landing-link" href="https://theallycoalition.org/">The Ally Coalition</a> Talent Show in New York, which I was at, as they are good friends with the foundation that was founded by Jack and Rachel Antonoff.</p>

					<br /><br />

					<p className="radio-heading" id="week-3">Week 3: Oct 6</p>
					<br />
					<iframe data-testid="embed-iframe" style={{borderRadius: "12px"}} src="https://open.spotify.com/embed/playlist/7IJLBQV3tcVn0yZilTSccl?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
					<p className="radio-content"><a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58050">link to recording + track blaster list</a></p>

					<br />
					<p className="radio-content">This week, the connections are between Thundercat's <em>Heartbreaks + Setbacks</em>, Esperanza Spalding's <em>I Know You Know</em>, and willow's <em>b i g f e e l i n g s</em>. They all showcase virtuosic jazz bass playing: not just holding down the low end but actually leading the melody. There is some history to this: thundercat studied at the musician's institute, spalding at berklee, mohini dey (who is on bass in willow's track) trained in indian classical before going full jazz fusion. In addition, flying lotus, a producer on Thundercat's track (and album) cites Miles Davis (on this week's show with <em>Black Satin</em>) as a major influence.</p>

					<br /><br />

					<p className="radio-heading" id="week-4">Week 4: Oct 13</p>
					<br />
					<iframe data-testid="embed-iframe" style={{borderRadius:"12px"}} src="https://open.spotify.com/embed/playlist/5gnTTA2L0LPSqXQknG9bn5?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
					<p className="radio-content"><a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58135">link to recording + track blaster list</a></p>

					<br />
					<p className="radio-content">This week had a lot more songs with a long instrumental middle. <em>Posing for Cars</em> by Japanese Breakfast has an insane 3-minute guitar riff that I can never get enough of. <em>Starlings</em> by Elbow ends with this beautiful instrumental section after 'Darling is this love?'. Underrated artist of this week is Metal Bubble Trio, they're so amazing. I'm also really proud of the transition between <em>November</em> and <em>Hello?</em>, they end and start on the same dial tone! Didn't really have a connections beyong the long instrumental songs.</p>

					<br /><br />
					
					<p className="radio-heading" id="week-5">Week 5: Oct 20</p>
					<br />
					<iframe data-testid="embed-iframe" style={{borderRadius: "12px"}} src="https://open.spotify.com/embed/playlist/5qAry5JctJsbTA6grgWJBJ?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
					<p className="radio-content"><a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58314">link to recording + track blaster list</a></p>

					<br />
					<p className="radio-content">Definitely focused a lot on some "world ending"-vibe songs. EDEN's <em>A Call</em> is a beautiful (spoken word?) track. I'm really proud of the songs this week because I feel like it kind of tells of sto </p>

					<br /><br />
					
										<p className="radio-heading" id="week-6">Week 6</p>
					<br />
					<iframe data-testid="embed-iframe" style={{borderRadius: "12px"}} src="https://open.spotify.com/embed/playlist/6AALFISH5Dcm9xGjmqcHRd?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
					<p className="radio-content"><a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58224">link to recording + track blaster list</a></p>

					<br />
					<p className="radio-content">This week, the connections are between <em>Vermillion</em> by Mitski, <em>Supalonely</em> by BENEE ft. Gus Dapperton, and <em>i wanna be your girlfriend</em> by girl in red. All three songs explore themes of loneliness and longing in the context of relationships. Mitski's <em>Vermillion</em> delves into the complexities of desire and emotional vulnerability, while BENEE's <em>Supalonely</em> captures the feeling of isolation despite being surrounded</p>

					<br /><br />
{/* 
					<p className="radio-heading" id="week-5">Week 5</p>
					<br />
					<iframe data-testid="embed-iframe" style={{borderRadius: "12px"}} src="https://open.spotify.com/embed/playlist/5qAry5JctJsbTA6grgWJBJ?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
					<p className="radio-content"><a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58224">link to recording + track blaster list</a></p>

					<br />
					<p className="radio-content">This week, the connections are between <em>Vermillion</em> by Mitski, <em>Supalonely</em> by BENEE ft. Gus Dapperton, and <em>i wanna be your girlfriend</em> by girl in red. All three songs explore themes of loneliness and longing in the context of relationships. Mitski's <em>Vermillion</em> delves into the complexities of desire and emotional vulnerability, while BENEE's <em>Supalonely</em> captures the feeling of isolation despite being surrounded</p>

					<br /><br />

										<p className="radio-heading" id="week-5">Week 5</p>
					<br />
					<iframe data-testid="embed-iframe" style={{borderRadius: "12px"}} src="https://open.spotify.com/embed/playlist/5qAry5JctJsbTA6grgWJBJ?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
					<p className="radio-content"><a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58224">link to recording + track blaster list</a></p>

					<br />
					<p className="radio-content">This week, the connections are between <em>Vermillion</em> by Mitski, <em>Supalonely</em> by BENEE ft. Gus Dapperton, and <em>i wanna be your girlfriend</em> by girl in red. All three songs explore themes of loneliness and longing in the context of relationships. Mitski's <em>Vermillion</em> delves into the complexities of desire and emotional vulnerability, while BENEE's <em>Supalonely</em> captures the feeling of isolation despite being surrounded</p>

					<br /><br />


					<p className="radio-heading" id="week-5">Week 5</p>
					<br />
					<iframe data-testid="embed-iframe" style={{borderRadius: "12px"}} src="https://open.spotify.com/embed/playlist/5qAry5JctJsbTA6grgWJBJ?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
					<p className="radio-content"><a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58224">link to recording + track blaster list</a></p>

					<br />
					<p className="radio-content">This week, the connections are between <em>Vermillion</em> by Mitski, <em>Supalonely</em> by BENEE ft. Gus Dapperton, and <em>i wanna be your girlfriend</em> by girl in red. All three songs explore themes of loneliness and longing in the context of relationships. Mitski's <em>Vermillion</em> delves into the complexities of desire and emotional vulnerability, while BENEE's <em>Supalonely</em> captures the feeling of isolation despite being surrounded</p>

					<br /><br /> */}

				</section>
			</main>
		</Layout>
	);
}