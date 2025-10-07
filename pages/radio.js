import Head from 'next/head';
import Layout from "../components/layout";

export default function Radio() {
	return (
		<Layout>
			<Head>
				<title>radio</title>
			</Head>
			<main>
				<h1 className="heading">death car for qt</h1>
				<section className="selfbio mt-8 md:mt-16 w-2/3 lg:w-1/2 md:text-xl">
					<span style={{marginBottom: "1rem", display: "block"}}>
						<p>Welcome to the radio page!! Death Car for QT was inspired by really good production and how many shared sampling and styles there are between genres and artists. I'm a huge fan of Jack Antonoff and I think, in general, there's a lot of skill to pop music that's ignored. Beyond that, I really love jazz, electronic music, r&b, alternative indie, punk/psychdelic rock... and want to play them! <br /><br />Every week, I'll have a "connections" with three songs that have something in common. You can also find the tracklist from my <a className="landing-link" href="https://track-blaster.com/wmbr/?startdt=1984-06-28&enddt=2030-09-23&sort=desc&program=587">WMBR track-blaster</a>. <strong>Listen at 88.1 FM WMBR in Boston or at <a className="landing-link" style={{fontStyle: 'italic'}} href="https://wmbr.org/">wmbr.org</a> at Monday nights (12-1AM EST).</strong></p>
					</span>

					<br /><br />

					<p style={{fontWeight: 'bold', fontSize: '1.8rem'}}>Week 1</p>
					<br></br>

					<iframe data-testid="embed-iframe" style={{"border-radius": "12px"}} src="https://open.spotify.com/embed/playlist/50gCG7CZhe3IiyMoNzuodH?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

					<br /><br />
					<p>The connections here between the songs <em>It's Only Love</em>, <em>Ode to the Mets</em>, and <em>You Don't Own Me</em> is this melody that's sampled in many, many songs. You can find some info about it at <a className="landing-link" href="https://www.reddit.com/r/WhoSampled/comments/nsatby/can_anyone_id_the_source_of_the_melody_in_good/">this reddit post</a>. Some of the songs that have also sampled the melody are <em>Build a Bitch</em> by Bella Poarch, <em>From the Dining Table</em> by Harry Styles, and <em>3 Daqat</em> by Abu. Find a link to a complete-ish playlist <a className="landing-link" href="https://open.spotify.com/playlist/1rDNlpuKpIy7hN20f3Iw3U?si=9f1ace7a45564d70">here</a>.</p>

					<br /><br />

					<p style={{fontWeight: 'bold', fontSize: '1.8rem'}}>Week 2</p>
					<br /><br />
					<iframe data-testid="embed-iframe" style={{"border-radius": "12px"}} src="https://open.spotify.com/embed/playlist/4oBpiIQ1dWxuOXJpUQaBGT?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

					<br /><br />

					<p style={{fontWeight: 'bold', fontSize: '1.8rem'}}>Week 3</p>
					<br /><br />
					<iframe data-testid="embed-iframe" style={{"border-radius": "12px"}} src="https://open.spotify.com/embed/playlist/7IJLBQV3tcVn0yZilTSccl?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
					<p><a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58050">Track Blaster Link / Recording</a></p>

					<br /><br />

					<p>This week, the connections are between Thundercat's Heartbreaks + Setbacks, Esperanza Spalding's I know you know, and willow's b i g f e e l i n g s. They all showcase virtuosic jazz bass playing: not just holding down the low end but actually leading the melody. There is some history to this: thundercat studied at the musician's institute, spalding at berklee, mohini dey (who is on bass in willow's track) trained in indian classical before going full jazz fusion. In addition, flying lotus, a producer on Thundercat's track (and album) cites Miles Davis (on this week's show with Black Satin) as a major influence.</p>

				</section>
			</main>
		</Layout>
	);
}