import { GalleryCard } from "../components/card";
import Layout from "../components/layout";

export default function Gallery() {
  return (
    <Layout active="Gallery">
      <h1 className="heading">
        Projects<div className="inline opacity-50">.</div>
      </h1>

      <h2 className="gallerySubhead">Major Projects</h2>
      <div className="mt-12 mr-16 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <GalleryCard
          href="https://angelhacks.org"
          title="AngelHacks"
          children="I founded AngelHacks 1.0 in 2018 and this grew to be an event hosted at Snapchat HQ with 150+ mentors and amazing prizes and workshops! AngelHacks 2.0 (in 2020) had 1000+ attendees and we were able to run many workshops and have awesome people talk. I have raised up to $10k+ in donations and much more in in-kind sponsorships."
        />
        <GalleryCard
          href="http://lonn.semel.ucla.edu/"
          title="UCLA LONN Lab Intern"
          children="I analyze brain imaging data and assist programmers on the development of virtual and augmented reality experiments to be used in participates with implanted neural electrodes, as well as am spearheading my own project!"
        />
        <GalleryCard
          title="MIT PRIMES CS (2021)"
          children="Work on creating an efficient algorithm for bi-core decomposition of graphs. We achieved a higher speedup and an improvement of theoretical work and span based on previous work. This won the S.T.-Yau Global Science Award and Best CS Project. You can find the github **[here](https://github.com/ClaireBookworm/gbbs)** or click for the paper."
          href="https://math.mit.edu/research/highschool/primes/materials/2021/Huang-Wang.pdf"
        />
        <GalleryCard
          href="zephyr.hackclub.com"
          title="Intern @ Hack Club"
          children="Over summer of 2021, I intern at Hack Club HQ at Vermont working mainly on the Zephyr (linked) to improve hacker and technical experience as well as some fundraising efforts. The zephyr was one of the most life changing events I've ever been at."
        />
        <GalleryCard
          title="DeepAI Intern"
          href="https://deepai.org"
          children="After working on a project with DeepAI in 2019, I started to intern for them. I worked in content development, doing research on data science, writing articles, and marketing/outreach."
        />
        <GalleryCard
          href="https://hackclub.com"
          title="Hack Club Community Team"
          children="I am employed as a community team member at Hack Club to encourage engagement and retention for new members whilst also keeping the environment both wholesome and technical for club members and leaders worldwide."
        />
        <GalleryCard
          href="https://anomaly-science.com"
          title="Anomaly Science Board / Executive"
          children="I'm on the board and am CMO of Anomaly Science, which focuses on honing the art of the artisans through legal aid, engagement, the particle system, and the community. Currently in Series A."
        />
        <GalleryCard
          title="Supersingular Ratio of Elliptic Curves"
          children="This paper starts with an overview of elliptic curves and then summarizes the Lang-Trotter conjecture. It aims to show that the ratio of Supersingular primes that are 2 (mod 3) to those that are 1 (mod 3) approaches 2."
          href="https://deepai.org/publication/supersingular-ratio-of-elliptic-curves"
        />
        <GalleryCard
          href="https://deepai.org/machine-learning-model/mri-brain-tumor-detection"
          title="MIRAI"
          children="MIRAI is a neural network that detects and outlines brain tumors in MRI brain scans. This model utilizes **metalearning and a MASK R-CNN** to be able to detect brain tumors with an accuracy that rivals that of a professional. MIRAI takes in a MRI head scan and spits out a labeled one, as well as a precise outline of the tumor. Upload an image and try it out! *Disclaimer: this model is for research purchases only and not approved for medical use or diagnosis."
        />
        <GalleryCard
          href="https://www.notion.so/nerdfighteria/Mind-Over-Matter-Neuroethical-Considerations-of-Neurotechnology-e54d1c520b5d419ba4fed84cec5a24be"
          title="Mind Over Matter"
          children="I submitted this essay for a NIH neuroethics essay contest and  won a Gold Key at the Scholastic Writing Award. I talk about BCIs and the moral implications involved in such invasive techniques."
        />
        <GalleryCard
          title="Nujjet (prev. TARDIS)"
          children="NUJJET is our response to the widespread pandemic of high school stress of today. By creating a low cost neuro headset to monitor and modulate your brain, we can help you study more effectively, and make long term changes. *(Participated in Conrad, Gatsvi, and Hack Club)*"
          href="https://nujjet.us/"
        />
      </div>
      <br />
      <h2 className="gallerySubhead">Also, these!</h2>
      <div className="mt-12 mr-16 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <GalleryCard 
          title="MIDI Lab"
          href="https://midilab.netlify.app/"
          children="My final project for *CS 630B Data Visualization* (you can find my portfolio for it **[here](https://dont-break-things.vercel.app/)**). Feel free to upload your own mp3 files or use the preloaded ones. MIDI support not fully implemented yet, but I just love the vaporwave style."
        />
        <GalleryCard
          title="Sigmoid Hacks – Co-Exec, Marketing & Webdev"
          children="The hackathon for normalizing the word *'machine learning'* — it really doesn't have to be a buzzword, I swear. The event was very successful, it was Jan 17-19, 2021!"
          href="https://sigmoidhacks.ml/"
        />
        <GalleryCard
          title="Hack Club AMA Hosting"
          href="https://hackclub.com/amas/"
          children="I've hosted many AMAs with Hack Club (for Simone Giertz, Tom Preston-Werner, Chris Cox, Nicky Case, Gwynne Shotwell) after initially proposing the idea! I've reached out to many of our guests as well as have hosted the calls. It's always amazing to be able to meet your role models."
        />
        <GalleryCard
          title="Arena of Memory Streaming"
          href="https://www.twitch.tv/memorysportstv"
          children="I do a lot of memory sports, and recently have been commentating on matches (and appearing on others) between memory athletes, and most notably, the arena of memory, which is on twitch @ memorysportstv!"
        />
        <GalleryCard
          title="Halo Charity"
          href="https://halo.angelhacks.org/"
          children="AngelHacks had remaining funds and we hoped to be able to donate a portion of it towards getting masks to those in need. While we were unable to get government-mandated and medically-approved N95 masks, we were able to donate a lot of K-N95 masks to non-medical yet essential public service workers."
        />
        <GalleryCard 
            title="Phillipian Digital Editor"
            href="https://phillipian.net"
            children="Digital Editor of the Phillipian CXLV (previously associate digital)."
        />
      </div>
    </Layout>
  );
}
