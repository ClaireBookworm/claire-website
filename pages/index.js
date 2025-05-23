// import Head from '../components/head'
import CustomHead from '../components/customHead';
// import Head from 'next/head';
// console.log('CustomHead:', CustomHead);
import Nav from '../components/nav'

export default function Home() {
  return (
    <div>

      <CustomHead title="claire's corner" description="words, words, words. they're all we have to go on!"></CustomHead>
      {/* <Head>
        <title>Claire's Corner</title>
        <meta property="twitter:url" content="https://clairebookworm.com/" />
        <script defer data-domain="clairebookworm.com" src="https://plausible.io/js/plausible.js"></script>
      </Head> */}
      <Nav active="Home" />
      <main className="mobile mt-6 sm:mt-12 md:mt-16 flex flex-col text-white pl-12 md:pl-20">
        <section className="heading" aria-hidden="true">
          <div>Claire Wang<div className="inline opacity-50">.</div></div>
        </section>
        <section className="selfbio mt-8 md:mt-16 w-2/3 lg:w-1/2 md:text-xl">
          Hey! I'm Claire; thanks for stopping by! I'm fascinated about neuroscience and computer science (& some progress policy work) and have done <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://math.mit.edu/research/highschool/primes/materials/2021/Huang-Wang.pdf">some</a> <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="http://lonn.semel.ucla.edu/">budding</a> <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://math.mit.edu/research/highschool/rsi/">research</a> in these fields, as well as various <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://anomaly-science.com">related</a> <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://drive.google.com/file/d/1cC8jZFIYP95uXqYlMgm38lnGg9uaachC/view?usp=sharing">ventures</a> and <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://angelhacks.org">social</a> <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://sota.phillipian.net/">projects</a>. 
          If you ever see me, I'll probably either be talking about <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://hackclub.com/">Hack Club</a>, expressing my undying love for Bleachers & my Spotify <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://open.spotify.com/user/rsjahryaqu08yocko5k5cfd9s?si=5952a9845b984880">playlists</a>, ranting about <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://bookshelf.website/clairebookworm">books</a>, stuck in the <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://jasanofflab.mit.edu/">lab</a> where I'm currently researching <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://synthneuro.org/">whole brain simulation</a> of C. elegans and connectomics, or writing bad music <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://musicboard.app/clairebookworm">reviews</a> on my <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://clairebookworm.substack.com">blog</a>. I truly believe in the art of making for the betterment of the world while having fun doing so. DFTBA¹!
          <br /><br />

          <span style={{fontSize: '0.9em', lineHeight: '0.7rem'}}><span style={{fontWeight: 'bold'}}>Now</span>: <span style={{fontStyle: 'italic'}}>I'm currently taking a gap semester from MIT in SF working towards building a whole brain connectome of the mouse brain at <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://e11.bio">e11.bio</a>. I'm also working on writing/research at <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://age1.com/">age1</a> and some more in the works (I'd love to meet up if you're in the area)! ♥︎ </span></span>
          {/* directing AI research at <a style={{ "textDecoration": "underline", "textDecorationStyle": 'dotted' }} href="https://www.voltagepark.com/">Voltage Park</a> (I'd love to meet up if you're in the area)! ♥︎ </span></span> */}
          
          <br /><br />
          <span style={{fontSize: '0.9em', lineHeight: '0.7rem'}}><span style={{fontWeight: 'bold'}}>Currently reading</span>: <span style={{fontStyle: 'italic'}}>Argonauts</span> by Maggie Nelson (also recommend reading her Bluets) & <span style={{fontStyle: 'italic'}}>Godel, Escher, Bach</span> by Hofstadter.</span>
          <br /><br />
          <span style={{fontSize: '0.9em', lineHeight: '0.7rem'}}><span style={{fontWeight: 'bold'}}>Current listening</span>: <a style={{fontStyle: 'italic'}} href="https://open.spotify.com/album/3gF9KIynrJaC80HbVayPMx?si=KBXUac8VREuHu01AzrYJqw">Unreal Unearth</a> by Hozier & <a style={{fontStyle: 'italic'}} href="https://open.spotify.com/artist/2eam0iDomRHGBypaDQLwWI?si=jzkiW3-XToqaC0pucylJEQ">Bleachers</a> by Bleachers. (Also, my current playlist on loop: <a style={{textDecoration: "underline", "textDecorationStyle": 'dotted', fontStyle: 'italic'}} href="https://open.spotify.com/playlist/0ougicLNjGgbmIIsvp4Z1L?si=7170355da302401f">dahhling</a>.) More recs for books and music can be found <a style={{textDecoration: "underline", "textDecorationStyle": 'dotted', fontStyle: 'italic'}} href="https://www.clairebookworm.com/notes/recs">here</a>.</span>
        </section>
        <section className="enlarge mt-8 md:mt-8 w-2/3 lg:w-1/2 md:text-xl">
          <div className="icon-bar">

            <a href="https://twitter.com/clairebookworm1"><svg fill="white" height="20px" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Twitter</title>
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
            </a>
            <a href="https://instagram.com/clairebookworm"><svg fill="white" height="20px" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title>
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" /></svg>
            </a>
            <a href="https://github.com/clairebookworm"><svg fill="white" height="20px" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/">
              <title>Github</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg></a>
            <a href="https://open.spotify.com/user/rsjahryaqu08yocko5k5cfd9s?si=d72ea19966304c10"><svg fill="white" height="20px" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Spotify</title><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg></a>
            <a href="https://www.linkedin.com/in/claire-bookworm/"><svg fill="white" height="20px" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="https://www.goodreads.com/clairebookworm"><svg fill="white" height="20px" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Goodreads</title><path d="M.3013 17.6146c-.1299-.3387-.5228-1.5119-.1337-2.4314l9.8273 5.6738a.329.329 0 0 0 .3299 0L24 12.9616v2.3542l-13.8401 7.9906-9.8586-5.6918zM.1911 8.9628c-.2882.8769.0149 2.0581.1236 2.4261l9.8452 5.6841L24 9.0823V6.7275L10.3248 14.623a.329.329 0 0 1-.3299 0L.1911 8.9628zm13.1698-1.9361c-.1819.1113-.4394.0015-.4852-.2064l-.2805-1.1336-2.1254-.1752a.33.33 0 0 1-.1378-.6145l5.5782-3.2207-1.7021-.9826L.6979 8.4935l9.462 5.463 13.5104-7.8004-4.401-2.5407-5.9084 3.4113zm-.1821-1.7286.2321.938 5.1984-3.0014-2.0395-1.1775-4.994 2.8834 1.3099.108a.3302.3302 0 0 1 .2931.2495zM24 9.845l-13.6752 7.8954a.329.329 0 0 1-.3299 0L.1678 12.0667c-.3891.919.003 2.0914.1332 2.4311l9.8589 5.692L24 12.1993V9.845z" /></svg></a>

            <a href="https://www.youtube.com/channel/UCxu_RGPnVSEke61ebevOJPA"><svg fill="white" height="20px" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg></a>

            <a href="https://clairebookworm.substack.com/"><svg role="img" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Substack</title><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" fill="white"></path></svg></a>

            <a href="https://musicboard.app/clairebookworm"><svg fill="white" height="20px" role="img" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><title>MusicBoard</title><path d="M 9.046875 29.996094 C 12.375 30.078125 15.3125 28.917969 16.914062 27.128906 C 17.484375 26.492188 17.851562 25.738281 17.921875 25.589844 C 17.964844 25.5 18 25.40625 18.03125 25.308594 L 22.234375 11.453125 C 22.484375 10.636719 23.164062 10.472656 23.722656 11.121094 C 24.152344 11.621094 24.617188 12.191406 25.089844 12.824219 C 27.027344 15.429688 27.183594 18.855469 26.148438 21.617188 C 25.113281 24.378906 23.160156 25.160156 23.785156 26.035156 C 24.414062 26.910156 26.878906 24.734375 28.484375 22.144531 C 30.085938 19.550781 30.265625 15.21875 28.820312 11.671875 C 27.371094 8.125 25.265625 5.84375 24.863281 3.996094 C 24.839844 3.875 24.8125 3.757812 24.789062 3.644531 C 24.746094 3.453125 24.761719 3.128906 24.828125 2.917969 L 24.941406 2.535156 C 25.257812 1.496094 24.671875 0.398438 23.632812 0.0859375 C 22.597656 -0.230469 21.5 0.355469 21.183594 1.394531 L 16.085938 18.195312 C 15.835938 19.011719 15.074219 19.261719 14.304688 18.890625 C 12.894531 18.210938 11.191406 17.792969 9.347656 17.746094 C 4.375 17.625 0.28125 20.269531 0.199219 23.652344 C 0.113281 27.035156 4.078125 29.875 9.046875 29.996094 Z M 9.046875 29.996094 " fill="white"/></svg></a>

          </div>
        </section>
        <section>
          <img className="mt-8 md:mt-12 w-1/2 sm:w-1/3 lg:w-1/4" src="/signature.png" alt="signature of claire" aria-hidden="true" />
        </section>
      </main>
      <footer className="para mobile text-white mt-8 md:mt-16 pl-12 md:pl-20 mb-5 flex flex-col space-y-4 text-xs sm:text-sm">
        <div id="footnotes" className="font-inter">
          <span style={{"fontWeight": "bold"}}>¹</span>DFTBA: Don’t forget to be awesome!<br />
          <span style={{"fontWeight": "bold"}}>²</span>I'm always happy to chat! You can find me by emailing me at claire (at) angelhacks.org or any way you can find (linked above or otherwise).
        </div>
        <div className="font-gilroy uppercase opacity-40">
          Copyright {new Date().getFullYear()} Claire Wang.
        </div>
      </footer>
    </div>
  )
}