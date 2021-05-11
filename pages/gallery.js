import { GalleryCard } from '../components/card'
import Layout from '../components/layout'

export default function Gallery() {
    return (
        <Layout active="Gallery">
            <h1 className="heading">Projects<div className="inline opacity-50">.</div></h1>

            <h2 className="gallerySubhead">Major Projects</h2>
            <div className="mt-12 mr-16 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <GalleryCard href="https://angelhacks.org" title="AngelHacks" children="I founded AngelHacks 1.0 in 2018 and this grew to be an event hosted at Snapchat HQ with 150+ mentors and amazing prizes and workshops! AngelHacks 2.0 (in 2020) had 1000+ attendees and we were able to run many workshops and have awesome people talk. I have raised up to $10k+ in donations and much more in in-kind sponsorships."/>                
                <GalleryCard href="http://lonn.semel.ucla.edu/" title="UCLA LONN Lab Intern" children="I analyze brain imaging data and assist programmers on the development of virtual and augmented reality experiments to be used in participates with implanted neural electrodes, as well as am spearheading my own project!"/>
                <GalleryCard title="MIT PRIMES CS" children="I'm in the 2021 cohort for MIT PRIMES in the CS track, doing research and learning about parallel computing and graph decomposition." href="https://math.mit.edu/research/highschool/primes/"/>
                <GalleryCard title="DeepAI Intern" href="https://deepai.org" children="After developing MIRAI ([check it out!](https://deepai.org/machine-learning-model/mri-brain-tumor-detection)) with DeepAI for a 2019 Symposium at UCLA, I interned with them. I work in content development, doing research on data science and writing articles, and marketing/outreach."/>
                <GalleryCard href="hackclub.com" title="Hack Club Community Team" children="I am employed as a community team member at Hack Club to encourage engagement and retention for new members whilst also keeping the environment both wholesome and technical for club members and leaders worldwide."/>
                <GalleryCard title = "Supersingular Ratio of Elliptic Curves" children="This paper starts with an overview of elliptic curves and then summarizes the Lang-Trotter conjecture. It aims to show that the ratio of Supersingular primes that are 2 (mod 3) to those that are 1 (mod 3) approaches 2." href="https://deepai.org/publication/supersingular-ratio-of-elliptic-curves" />
                <GalleryCard href="https://deepai.org/machine-learning-model/mri-brain-tumor-detection" title="MIRAI" children="MIRAI is a neural network that detects and outlines brain tumors in MRI brain scans. This model utilizes **metalearning and a MASK R-CNN** to be able to detect brain tumors with an accuracy that rivals that of a professional. MIRAI takes in a MRI head scan and spits out a labeled one, as well as a precise outline of the tumor. Upload an image and try it out! *Disclaimer: this model is for research purchases only and not approved for medical use or diagnosis."/>
                <GalleryCard href="https://www.notion.so/nerdfighteria/Mind-Over-Matter-Neuroethical-Considerations-of-Neurotechnology-e54d1c520b5d419ba4fed84cec5a24be" title="Mind Over Matter" children="I submitted this essay for a NIH neuroethics essay contest and  won a Gold Key at the Scholastic Writing Award. I talk about BCIs and the moral implications involved in such invasive techniques."/>
                <GalleryCard title="Halo Charity" href="https://halo.angelhacks.org/" children="AngelHacks had remaining funds and we hoped to be able to donate a portion of it towards getting masks to those in need. While we were unable to get government-mandated and medically-approved N95 masks, we were able to donate a lot of K-N95 masks to non-medical yet essential public service workers."/>
            </div>
            <br />
            <h2 className="gallerySubhead">Also, these!</h2>
            <div className="mt-12 mr-16 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <GalleryCard title="TARDIS" children="The TARDIS *(transcranial applicable repeating deep interchanging stimulation)* is a extra-cranial BCI technology we developed which won us the grand Pete Conrad Scholar at the Conrad Challenge. The team is me, Neel, Charlie, and Andrew. We've been chosen as Conrad Finalists! And yes, the name is a Dr. Who reference." href="https://tardisapp.us" />
                <GalleryCard title="Sigmoid Hacks – Co-Exec, Marketing, Website Development" children="The hackathon for normalizing the word *'machine learning'* — it really doesn't have to be a buzzword, I swear. The event was very successful, it was Jan 17-19, 2021!" href="https://sigmoidhacks.ml/"/>
                <GalleryCard />
                <GalleryCard />
                <GalleryCard />
                <GalleryCard />
                <GalleryCard />
            </div>
        </Layout>
    )
}