import Head from 'next/head';
import Layout from "../components/layout";
import RadioWeekCard from "../components/RadioWeekCard";

const SEASON_1_WEEK_LINKS = [
	["#week-1", "1"],
	["#week-2", "2"],
	["#week-3", "3"],
	["#week-4", "4"],
	["#week-5", "5"],
	["#week-6", "6"],
	["#week-7", "7"],
	["#week-8", "8"],
	["#week-9", "9"],
	["#week-10", "10"],
	["#week-11", "11"],
	["#week-12", "12"],
	["#week-13", "13"],
	["#week-14", "14"],
	["#week-15", "15"],
	["#week-16", "16"],
	["#week-18", "18"],
	["#week-20", "20"],
	["#week-21", "21"],
];

export default function Radio() {
	return (
		<Layout active="Radio">
			<Head>
				<title>radio</title>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Limelight&display=swap" rel="stylesheet" />
				<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap" rel="stylesheet" />
			</Head>
			<div className="radio-page">
				<h1 className="radio-page__hero heading">death car for qt</h1>

				<section className="radio-page__intro selfbio mt-8 md:mt-12 w-full max-w-3xl md:text-xl" style={{ lineHeight: "1.9rem" }}>
					<p className="radio-content">
						Welcome to the radio page! Death Car for QT was inspired by really good production and how many shared sampling and styles there are between genres and artists.
						I&apos;m a huge fan of Jack Antonoff and I think, in general, there&apos;s a lot of skill to pop music that&apos;s ignored. Beyond that, I really love jazz, electronic
						music, r&amp;b, alternative indie, punk/psychdelic rock... and want to play them!
					</p>
					<p className="radio-content mt-6">
						Every week, I&apos;ll have a &quot;connections&quot; with three songs that have something in common. You can also find the tracklist from my{" "}
						<a className="landing-link" href="https://track-blaster.com/wmbr/?startdt=1984-06-28&enddt=2030-09-23&sort=desc&program=587">WMBR track-blaster</a>.
						Recordings are available for the 2 most recent weeks. Listen at{" "}
						<span className="radio-intro-highlight">
							88.1 FM WMBR in Boston or at{" "}
							<a className="radio-intro-highlight__link" href="https://wmbr.org/">wmbr.org</a> at Tuesday nights (12-1AM EST, 9-10 PM PST).
						</span>
					</p>
					<p className="radio-content mt-6 opacity-80">This page is slightly out of date, will update soon!</p>
				</section>

				<nav className="radio-week-nav" aria-label="Season 1 — jump to week">
					<span className="radio-week-nav__season">Season 1</span>
					<span className="radio-week-nav__label">Week</span>
					{SEASON_1_WEEK_LINKS.map(([href, label]) => (
						<a key={href} href={href} className="radio-week-nav__link">
							{label}
						</a>
					))}
				</nav>

				<div className="radio-week-stack">
					<RadioWeekCard id="week-1" title="Week 1: Sep 22" playlistId="50gCG7CZhe3IiyMoNzuodH">
						<p className="radio-content">
							The connections here between the songs <em>It&apos;s Only Love</em>, <em>Ode to the Mets</em>, and <em>You Don&apos;t Own Me</em> is this melody that&apos;s
							sampled in many, many songs. You can find some info about it at{" "}
							<a className="landing-link" href="https://www.reddit.com/r/WhoSampled/comments/nsatby/can_anyone_id_the_source_of_the_melody_in_good/">this reddit post</a>.
							Some of the songs that have also sampled the melody are <em>Build a Bitch</em> by Bella Poarch, <em>From the Dining Table</em> by Harry Styles, and{" "}
							<em>3 Daqat</em> by Abu. Find a link to a complete-ish playlist{" "}
							<a className="landing-link" href="https://open.spotify.com/playlist/1rDNlpuKpIy7hN20f3Iw3U?si=9f1ace7a45564d70">here</a>.
						</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-2" title="Week 2: Sep 29" playlistId="4oBpiIQ1dWxuOXJpUQaBGT">
						<p className="radio-content">
							Honestly, I kind of forgot to talk about the connections this week on the actual radio segment, but it just so conveniently happens that there are 3{" "}
							<strong>Jack Antonoff</strong> produced songs in this tracklist! <em>The Whole of the Moon (Live at Radio City Hall)</em> is a cover by Bleachers of the
							original The Waterboys track and might be one of my favorite live tracks ever. Then, <em>Comeback</em> by Carly Rae Jepson &amp; Bleachers is what I
							consider to be the perfect culmination of &quot;real&quot; pop: catchy, joyful, clean blend of production and lyrics, and doesn&apos;t try too hard what it
							isn&apos;t. That song and <em>I&apos;m In Love With You</em> by the 1975 are produced by Jack Antonoff, but have very different interpretations of what
							&apos;pop&apos; means. Finally, just on a personal anecdote, Turnstile and Remi Wolf performed at the most recent (2024){" "}
							<a className="landing-link" href="https://theallycoalition.org/">The Ally Coalition</a> Talent Show in New York, which I was at, as they are good friends
							with the foundation that was founded by Jack and Rachel Antonoff.
						</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-3" title="Week 3: Oct 6" playlistId="7IJLBQV3tcVn0yZilTSccl">
						<p className="radio-content">
							<a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58050">link to recording + track blaster list</a>
						</p>
						<p className="radio-content">
							This week, the connections are between Thundercat&apos;s <em>Heartbreaks + Setbacks</em>, Esperanza Spalding&apos;s <em>I Know You Know</em>, and
							willow&apos;s <em>b i g f e e l i n g s</em>. They all showcase virtuosic jazz bass playing: not just holding down the low end but actually leading the
							melody. There is some history to this: thundercat studied at the musician&apos;s institute, spalding at berklee, mohini dey (who is on bass in willow&apos;s
							track) trained in indian classical before going full jazz fusion. In addition, flying lotus, a producer on Thundercat&apos;s track (and album) cites Miles
							Davis (on this week&apos;s show with <em>Black Satin</em>) as a major influence.
						</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-4" title="Week 4: Oct 13" playlistId="5gnTTA2L0LPSqXQknG9bn5">
						<p className="radio-content">
							<a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58135">link to recording + track blaster list</a>
						</p>
						<p className="radio-content">
							This week had a lot more songs with a long instrumental middle. <em>Posing for Cars</em> by Japanese Breakfast has an insane 3-minute guitar riff that I can
							never get enough of. <em>Starlings</em> by Elbow ends with this beautiful instrumental section after &apos;Darling is this love?&apos;. Underrated artist of
							this week is Metal Bubble Trio, they&apos;re so amazing. I&apos;m also really proud of the transition between <em>November</em> and <em>Hello?</em>, they end
							and start on the same dial tone! Didn&apos;t really have a connections beyong the long instrumental songs.
						</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-5" title="Week 5: Oct 20" playlistId="5qAry5JctJsbTA6grgWJBJ">
						<p className="radio-content">
							<a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58314">link to recording + track blaster list</a>
						</p>
						<p className="radio-content">
							Definitely focused a lot on some &quot;world ending&quot;-vibe songs. EDEN&apos;s <em>A Call</em> is a beautiful (spoken word?) track. I&apos;m really proud of
							the songs this week because I feel like it kind of tells of sto{" "}
						</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-6" title="Week 6: Oct 27" playlistId="6AALFISH5Dcm9xGjmqcHRd">
						<p className="radio-content">
							<a className="landing-link" href="https://track-blaster.com/wmbr/playlist.php?id=58224">link to recording + track blaster list</a>
						</p>
						<p className="radio-content">
							This week, the connections are between <em>Vermillion</em> by Mitski, <em>Supalonely</em> by BENEE ft. Gus Dapperton, and <em>i wanna be your girlfriend</em>{" "}
							by girl in red. All three songs explore themes of loneliness and longing in the context of relationships. Mitski&apos;s <em>Vermillion</em> delves into the
							complexities of desire and emotional vulnerability, while BENEE&apos;s <em>Supalonely</em> captures the feeling of isolation despite being surrounded
						</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-7" title="Week 7: Nov 3" playlistId="7Aq5Ryvj2vyQz51DK086uw">
						<p className="radio-content opacity-90">
							<em>Note:</em> mistake with the file — songs 1–5 weren&apos;t played on air (per the playlist description on{" "}
							<a className="landing-link" href="https://open.spotify.com/playlist/7Aq5Ryvj2vyQz51DK086uw">Spotify</a>).
						</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-8" title="Week 8: Nov 10" playlistId="325q6sCzGPrC2nLLIyF2fe">
						<p className="radio-content">Notes coming soon.</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-9" title="Week 9: Nov 17" playlistId="0fXtW7DCjVDUTul9nRMEAI">
						<p className="radio-content">Notes coming soon.</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-10" title="Week 10: Nov 24" playlistId="1Mff0tchlOqU7XbGpmqK0R">
						<p className="radio-content">Notes coming soon.</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-11" title="Week 11: Dec 1" playlistId="4szTjB6SHPlSMr4hyDGdKR">
						<p className="radio-content">Notes coming soon.</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-12" title="Week 12: Dec 8" playlistId="0YmCe0bcumrgeY8OQNk1B6">
						<p className="radio-content">Notes coming soon.</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-13" title="Week 13: Dec 15" playlistId="46s7QvdQFWqwMqaYmp6Fr6">
						<p className="radio-content">Notes coming soon.</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-14" title="Week 14: Dec 22" playlistId="6VUoeZ4fEf5qpeWesIaSH3">
						<p className="radio-content">Notes coming soon.</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-15" title="Week 15: Dec 29" playlistId="08XimTLzCTQD4I95lQag3G">
						<p className="radio-content">Notes coming soon.</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-16" title="Week 16: Jan 5" playlistId="0K5FGCnTJcDaK0wOFxV2Ro">
						<p className="radio-content">Notes coming soon.</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-18" title="Week 18: Jan 19" playlistId="4xDBD1t4nRqec3XdkeToqc">
						<p className="radio-content opacity-90">
							<em>From the playlist:</em> unique mix of DJ mixes + songs.
						</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-20" title="Week 20: Feb 9" playlistId="3tq1MXQJ2rSUPRXrf2CuUk">
						<p className="radio-content opacity-90">
							<em>From the playlist:</em> rly proud and happy to be back.
						</p>
					</RadioWeekCard>

					<RadioWeekCard id="week-21" title="Week 21: Feb 16" playlistId="4l8QnFgNYJGoSpifVKX3lf">
						<p className="radio-content opacity-90">
							<em>From the playlist:</em> last show of the season :&apos;)
						</p>
					</RadioWeekCard>
				</div>
			</div>
		</Layout>
	);
}
