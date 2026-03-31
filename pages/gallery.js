import { useMemo, useState } from 'react';
import { GalleryCard } from "../components/card";
import Head from 'next/head';
import Layout from "../components/layout";
import { TAG_FILTER_ORDER, TAG_LABELS } from '../lib/gallery-tags';
import {
  FaBrain, FaFlask, FaMicroscope, FaChartLine, FaGraduationCap,
  FaCode, FaGamepad, FaBook, FaLaptopCode, FaTrophy, FaNewspaper,
  FaBriefcase, FaMemory, FaTheaterMasks, FaPencilAlt, FaStream,
  FaHeart, FaRocket, FaApple, FaHammer
} from 'react-icons/fa';
import { GiSpiderWeb } from 'react-icons/gi';
import { SiHackclub } from "react-icons/si";

const GALLERY_ITEMS = [
  { id: 'boyden', title: "Boyden Lab @ MIT McGovern (2023-)", href: "https://synthneuro.org/projects/understanding-normal-and-pathological-brain-computations/", icon: FaBrain, importance: 1, tags: ['research', 'neuro'], children: `*Towards Whole Nervous System Emulation*, on reverse-engineering a C. elegans nervous system through building custom state-of-the-art microscopes such as the DISPIM and SCAPE, mapping with deep learning models (i.e. RNNs) to emulate biological agents, embodied physical models, designing voltage indicators, expansion sequencing, 3d design, and miscellaneous tasks for "brain uploading," under Davy Deng. Overall emulation project in collaboration with other labs.` },
  { id: 'aal', title: "Algorithmic Alignment Lab @ MIT CSAIL (2025-)", href: "https://algorithmicalignment.csail.mit.edu/", icon: FaFlask, importance: 1, tags: ['research'], children: "*Open Task and Motion Planning*, development of an open-source symbolic planning formalism for better decision-making RL/robotics agents, leading to effective online belief-space planning and interpretable goals. Working under Phillip Christoffersen (in Dylan Hadfield-Menell's Lab), contributing to experiments, applications to realistic environments, and expanded applications of the formalism." },
  { id: 'jasanoff', title: "Jasanoff Lab @ MIT Bio (2023-24)", href: "https://jasanofflab.mit.edu/", icon: FaMicroscope, importance: 1, tags: ['research', 'neuro'], children: "Learning to build RF phase-array circuits for rat & marmoset MRI imaging, under Kevin Chung. Worked extensively with 3D fabrication, NMR spectroscopy, MRI imaging, circuit design/operation, and general signal processing." },
  { id: 'primes-cs', title: "MIT PRIMES CS (2021-22)", href: "https://epubs.siam.org/doi/abs/10.1137/1.9781611977578.ch2", icon: FaTrophy, importance: 1, tags: ['research'], children: "Work on creating an efficient algorithm for bi-core decomposition of graphs and achieved a higher speedup and an improvement of theoretical work and span based on previous work. Won the S.T.-Yau Global Science Award and Best CS Project and was presented at AMS-PME JMM 2022 & ACM-SIAM SODA APOCS 2023. You can find the github **[here](https://github.com/ClaireBookworm/gbbs)**, our poster, initial **[PRIMES paper](https://math.mit.edu/research/highschool/primes/materials/2021/Huang-Wang.pdf)**, or click for the published paper." },
  { id: 'e11', title: "E11 Bio (2025)", href: "https://e11.bio/", icon: GiSpiderWeb, importance: 1, tags: ['work exp', 'neuro', 'research'], children: "Built CV/spatial reasoning pipeline for cross-slice barcode matching in brain tissue, demonstrating 82.1% accuracy rate on a simplified motor-neuron dataset and specific pipeline improvements (work contributed to a larger Google Connectomics effort). In addition, contributed research analysis and visualizations for PRISM paper [*Combinatorial protein barcodes enable self-correcting neuron tracing with nanoscale molecular context*](https://www.biorxiv.org/content/10.1101/2025.09.26.678648v1) (biorxiv 2025.09.26.678648). (Took a gap semester, Winter/Spring 2025.)" },
  { id: 'apple', title: "Apple CoreOS (Summer 2025)", href: "https://developer.apple.com/forums/topics/app-and-system-services/app-and-system-services-core-os", icon: FaApple, importance: 1, tags: ['work exp'], children: "Developed consumer-facing OS features for Apple's ecosystem, shipping production code in Objective-C, Swift, and Python. Designed system architecture for new feature handling encrypted data transfer across CloudKit/CryptoKit, accounting for edge cases in user and retail workflows. In addition,assisted in integrating ML models and pipelines into existing systems." },
  { id: 'contrary', title: "Contrary Venture Partner (2023-)", href: "https://contrary.com/", icon: FaChartLine, importance: 1, tags: ['work exp'], children: "Part of the venture partner program at Contrary Capital, where I help source and evaluate deals.Some of the coolest communities I've been a part of." },
  { id: 'hackclub', title: "Hack Club (2018-2022)", href: "https://hackclub.com", icon: SiHackclub, importance: 2, tags: ['friends', 'hacks'], children: "Various roles all through-out high school, such as community team, intern, organizer, fundraiser, etc. Lead producer of a web-based game exploring function composition through love & skiing. Public beta launched May 2023 & reached 2nd on HackerNews. [SineRider](https://sinerider.com) Also, helped create/hosted AMA program, with speakers like Elon Musk, Nicky Case, Sal Khan. Organized the HackerZephyr: a cross-country hackathon from Vermont to California. [Zephyr](zephyr.hackclub.com) [Hack Club](hackclub.com)" },
  { id: 'sota', title: "Phillipian State Of The Academy 2023", href: "https://sota.phillipian.net/", icon: FaNewspaper, importance: 2, tags: ['creative', 'writing'], children: "As digital editor of Phillips Academy's newspaper, *The Phillipian*, I developed the annual State of the Academy (SOTA), a report based on data collected from the majority of the student body (the survey is completely anonymous and specific data is kept private). This publication is referenced to by faculty, alumni, students, and so on. SOTA won the 2022 NSPA Digital Story of the Year interactive graphic award." },
  { id: 'angelhacks', title: "AngelHacks (2018-2023)", href: "https://angelhacks.org", icon: FaRocket, importance: 1, tags: ['friends', 'hacks'], children: "I founded **[AngelHacks 1.0](https://2019.angelhacks.org/)** in 2018 into a hackathon hosted at Snapchat HQ with 150+ mentors and amazing prizes and workshops! **[AngelHacks 2.0](https://2021.angelhacks.org/)** (in 2021) had 1000+ attendees and we were able to run many workshops and have awesome people talk. I have raised up to $10k+ in donations and much more in in-kind sponsorships. AngelHacks 3.0 (& we partnered w/ Hack Club to make it the official HC Spring Event) was a 24-hour game jam in Boston in 2023, where people came together to make rhythm games, lambda calculus explorers, puzzle games, text-based quizzes, and more!" },
  { id: 'sinerider', title: "SineRider (Summer 2022)", href: "https://sinerider.com", icon: FaGamepad, importance: 1, tags: ['hacks', 'creative'], children: "A game of love, math, and graphing <3. I helped lead a team of Hack Club teenagers to create a game with Polytroper (Chris Walker) to teach players the wonders of function composition through a beautiful game of skiing and love. Our prototype launch reached #2 on the front page of HackerNews and got lots of feedback from amazing people like Nicky Case and Grant Sanderson! **Public beta launched**, find the link to the trailer **[here](https://www.youtube.com/watch?v=35nDYoIwiA8)**." },
  { id: 'excstential', title: "ExCStential Ethics", href: "https://excstential.substack.com/", icon: FaBook, importance: 2, tags: ['writing', 'research'], children: "An independent project with Dr. Kiran Bhardwaj & Olha @ Andover on Tech Ethics (something I've been interested in for a while)! We researched/read papers on privacy, EA/AI, competition, and design ethics. A list of readings we've done is **[linked here](https://bit.ly/excstential-readings)**, you should check it out! In addition, click on this card to see some of the essays we wrote & find our final presentation on privacy policy **[here](https://cloud-qg99kx646-hack-club-bot.vercel.app/0excstential-presentation.pdf)**." },
  { id: 'htmaa', title: "How To Make (almost) Anything", href: "https://fab.cba.mit.edu/classes/863.25/people/ClaireWang/", icon: FaHammer, importance: 1, tags: ['hacks', 'creative'], children: "I'm taking MIT's How To Make (almost) Anything course, and you can find my project and work updates by clicking this card. Final project is a physical DAW/Looper with samples as modules and stacking blocks create synths. Also built a robot with my team that follows you around and scrolls reels, the [BRAINROTBOT 9000](https://fab.cba.mit.edu/classes/MAS.863/EECS/Machine/Machine.html)." },
  { id: 'rsi', title: "Research Science Institute (Summer 2022, 2023)", href: "https://math.mit.edu/research/highschool/rsi/", icon: FaGraduationCap, importance: 1, tags: ['research', 'neuro'], children: "As part of the **[Visual Attention Lab](https://search.bwh.harvard.edu/new/index.html)** at Harvard Medical School under Prof. Jeremy Wolfe and a student at RSI (Research Science Institute), I did research on Spatial and Temporal Massive Memory and the extent of their correlation, in addition to developing a platform for human experimentation for such massive memory experiments. [Update: I will be an RSI 2023 counselor as well & working at the Computational Cognitive Neuroscience Lab!]" },
  { id: 'ucla-lonn', title: "UCLA LONN Lab Intern (2018-2023)", href: "http://lonn.semel.ucla.edu/", icon: FaBrain, importance: 2, tags: ['research', 'neuro'], children: "I analyze brain imaging data and assist programmers on the development of virtual and augmented reality experiments to be used in participates with implanted neural electrodes, as well as am spearheading my own project!" },
  { id: 'deepai', title: "DeepAI Intern (2019-2021)", href: "https://deepai.org", icon: FaCode, importance: 2, tags: ['work exp', 'writing'], children: "After working on a project with DeepAI in 2019, I started to intern for them. I worked in content development, doing research on data science, writing articles, and marketing/outreach." },
  { id: 'memory', title: "Memory Sports", href: "https://artofmemory.com/start/", icon: FaMemory, importance: 2, tags: ['creative', 'neuro'], children: "I'm a memory athlete (which sounds peculiar, but click this card to get started) and I was the longest reigning Words champion in the world on Memory League, 3rd place nationally at USAMC held at MIT (in which I was the youngest competitor out of various adults and older students), and the Youth Champion at the Taiwan International Championship. In addition, I was the 2021 World Speed Reading Champion at MSO. In fact, doing memory sports was what got me interested in neuroscience and especially memory!" },
  { id: 'primes-broad', title: "MIT PRIMES (2022)", href: "https://www.broadinstitute.org/klarman-cell-observatory", icon: FaFlask, importance: 2, tags: ['research', 'neuro'], children: "Worked with the Broad Institute on scRNA-sequencing for cross-tissue analysis of senescent cells. (Hiatus)" },
  { id: 'acting', title: "Acting/Theater", href: "https://www.imdb.com/name/nm7980879/", icon: FaTheaterMasks, importance: 2, tags: ['creative'], children: "Theater kid? Played: Oberon in A Midsummer Night's Dream, Cannibal Queen in Airness, Benedick in Much Ado About Nothing. Previously did on-screen acting under the [Clear Talent Group](https://www.cleartalentgroup.com/) agency." },
  { id: 'phillipian-ed', title: "Phillipian Digital Editor", href: "https://phillipian.net", icon: FaNewspaper, importance: 3, tags: ['writing', 'creative'], children: "Digital Editor of Phillips Academy's *The Phillipian* CXLV (previously an associate editor). Working on exploring *[data journalism](https://sota.phillipian.net)*, amplifying **[voices to marginalized communities on campus](https://latinelegacy.phillipian.net)**, and so on. :)" },
  { id: 'nujjet', title: "Nujjet (prev. TARDIS) (2021-Present)", href: "https://nujjet.us/", icon: FaBrain, importance: 3, tags: ['hacks', 'neuro'], children: "NUJJET is our response to the widespread pandemic of high school stress of today. By creating a low cost neuroscience headset to monitor and modulate your brain (EEG/tDCS cap), we can help you study more effectively, and make long term changes. *(Participated/won in Conrad Challenge, GATSVI, and Hack Club)* (Hiatus)" },
  { id: 'mirai', title: "MIRAI (2018-2019)", href: "https://deepai.org/machine-learning-model/mri-brain-tumor-detection", icon: FaMicroscope, importance: 3, tags: ['research', 'neuro'], children: "MIRAI is a neural network that detects and outlines brain tumors in MRI brain scans. This model utilizes **meta-learning and a MASK R-CNN** to be able to detect brain tumors with an accuracy that rivals that of a professional. MIRAI takes in a MRI head scan and spits out a labeled one, as well as a precise outline of the tumor. *Disclaimer: this model is for practice purposes only.*" },
  { id: 'mind-over', title: "Mind Over Matter", href: "https://www.notion.so/nerdfighteria/Mind-Over-Matter-Neuroethical-Considerations-of-Neurotechnology-e54d1c520b5d419ba4fed84cec5a24be", icon: FaBook, importance: 3, tags: ['writing', 'neuro'], children: "Neuroscientists are driven to understand a three-pound mass of neurons and glia pondering the morality and risks of studying themselves. Neuro-ethics is a broad field, yet evaluating the risks and benefits of brain-computer interfaces (BCIs) is a timely and critical topic due to the rapid development of technologies, including implants and wearables electronics. " },
  { id: 'supersingular', title: "Supersingular Ratio of Elliptic Curves (2018-2019)", href: "https://www.dropbox.com/scl/fi/dlf7ovuytvkbj3hhshxdr/Supersingular-claire.pdf?rlkey=b4q84zxvqv1gz29gk21xgjpqi&st=0a6igrkz&dl=0", icon: FaPencilAlt, importance: 3, tags: ['research', 'writing'], children: "This paper starts with an overview of elliptic curves and then summarizes the Lang-Trotter conjecture. It aims to show that the ratio of Supersingular primes that are 2 (mod 3) to those that are 1 (mod 3) approaches 2." },
  { id: 'midilab', title: "MIDI Lab", href: "https://midilab.netlify.app/", icon: FaLaptopCode, importance: 3, tags: ['hacks', 'creative'], children: "My final project for *CS 630B Data Visualization* (you can find **[my portfolio for it here](https://dont-break-things.vercel.app/)**). Feel free to upload your own mp3 files or use the preloaded ones!" },
  { id: 'iq', title: "IQ and Misleading Data", href: "https://observablehq.com/@clairebookworm/iq", icon: FaChartLine, importance: 3, tags: ['writing', 'creative'], children: "Is IQ a thing? We think no, and prove it by showing how easily we can create misleading graphs and data from some simple finagling and tricks." },
  { id: 'anomaly', title: "Anomaly Science Board / Executive (2019-Present)", href: "https://anomaly-science.com", icon: FaBriefcase, importance: 3, tags: ['friends', 'work exp'], children: "I'm on the board and am CMO of Anomaly Science, which focuses on honing the art of the artisans through legal aid, engagement, the particle system, and the community. Currently raising our Series A round." },
  { id: 'arena', title: "Arena of Memory Streaming", href: "https://www.twitch.tv/memorysportstv", icon: FaStream, importance: 3, tags: ['creative', 'neuro'], children: "I do a lot of memory sports, and recently have been commentating on matches (and appearing on others), and most notably, the arena of memory, which is on twitch @ memorysportstv!" },
  { id: 'halo', title: "Halo Charity", href: "https://halo.angelhacks.org/", icon: FaHeart, importance: 3, tags: ['friends'], children: "AngelHacks had remaining funds and we hoped to be able to donate a portion of it towards getting masks to those in need. We were able to donate a many K-N95 masks to non-medical yet essential public service workers." },
];

const TAG_SLUGS_IN_USE = [...new Set(GALLERY_ITEMS.flatMap((item) => item.tags))];
const FILTER_CHIPS_ORDERED = [
  ...TAG_FILTER_ORDER.filter((s) => TAG_SLUGS_IN_USE.includes(s)),
  ...TAG_SLUGS_IN_USE.filter((s) => !TAG_FILTER_ORDER.includes(s)).sort(),
];

export default function Gallery() {
  const [activeTags, setActiveTags] = useState(() => new Set());

  const filteredItems = useMemo(() => {
    if (activeTags.size === 0) return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.tags.some((t) => activeTags.has(t)));
  }, [activeTags]);


  function selectTag(slug) {
    setActiveTags((prev) => {
      if (prev.size === 1 && prev.has(slug)) return new Set();
      return new Set([slug]);
    });
  }

  function clearFilters() {
    setActiveTags(new Set());
  }

  return (
    <Layout active="Projects">
      <Head>
        <title>projects, claire wang</title>
        <meta property="og:title" content="projects & portfolio" />
      </Head>
      <h1 className="heading">
        Projects <div className="inline opacity-50">&</div> Portfolio<div className="inline opacity-50">.</div>
      </h1>
      <p className="gallery-intro">
        what i'm up to, and some of what i've been up to in the past </p>

      <div className="gallery-filter-bar galleryMobile mt-10 mr-16" role="region" aria-label="Filter projects by tag">
        <span className="gallery-filter-bar__label">Filter</span>
        <button
          type="button"
          className={`gallery-filter-chip ${activeTags.size === 0 ? 'gallery-filter-chip--active' : ''}`}
          onClick={clearFilters}
        >
          All
        </button>
        {FILTER_CHIPS_ORDERED.map((slug) => {
          const on = activeTags.has(slug);
          return (
            <button
              key={slug}
              type="button"
              className={`gallery-filter-chip ${on ? 'gallery-filter-chip--active' : ''}`}
              onClick={() => selectTag(slug)}
              aria-pressed={on}
            >
              {TAG_LABELS[slug] ?? slug}
            </button>
          );
        })}
      </div>
      {filteredItems.length === 0 ? (
        <p className="gallery-empty galleryMobile mt-8 mr-16 opacity-80">No projects match these tags — try clearing or picking different ones.</p>
      ) : (
        <div className="gallery-section galleryMobile mt-8 mr-16">
          <div className="gallery-all-grid">
            {filteredItems.map((item) => (
              <GalleryCard
                key={item.id}
                title={item.title}
                href={item.href}
                icon={item.icon}
                importance={item.importance}
                tags={item.tags}
              >
                {item.children}
              </GalleryCard>
            ))}
          </div>
        </div>
      )}

    </Layout>
  );
}
