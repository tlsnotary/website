---
title: do not pass "Go"
authors: [sinu]
description: "To solve problems at scale, humans design systems which both encapsulate complexity and leverage specialization to achieve efficiency and predictability. This reduces the need for interpersonal trust by replacing it with systemic trust — that is, trusting the behavior of a system and not an individual. Much of societal progress can be attributed to this process of systematization, but much can also be said about the damage that is caused when the goals of these systems become misaligned, or simply when they fail to adapt to new circumstances. The modern world is increasingly characterized by both failure modes."
---

import Figure from '@site/src/components/Figure';
import Callout from '@site/src/components/Callout';

# do not pass "Go"

The following article is a bit meaty, so for those who just want the key points, feel free to skip to the [last section](#you-may-now-pass-go).

## scale

To solve problems at scale, humans design systems which both encapsulate complexity and leverage specialization to achieve efficiency and predictability. This reduces the need for interpersonal trust by replacing it with systemic trust — that is, trusting the behavior of a system and not an individual. Much of societal progress can be attributed to this process of systematization, but much can also be said about the damage that is caused when the goals of these systems become misaligned, or simply when they fail to adapt to new circumstances. The modern world is increasingly characterized by both failure modes.

<Figure
  src={require('./institutions.svg').default}
  caption="Institutions are trusted to provide reliable evidence about the world to facilitate cooperation between untrusting parties."
  width={500}
/>

<!-- truncate -->

Of course, that is the impetus for the various efforts centered around building _new_ systems which apply technological innovation to decrease fragility and solve modern problems. The promise being that these new systems will be more resilient to undue influence, more efficient, and will ultimately shift power back to individuals. Certainly, the faster that future arrives the better, but _how_ such transitions will occur is not always clear.

Today, it is the case that the majority of digital systems which we rely on as a basis for our collective reality are owned, and operated, by a relatively small number of corporate and state institutions. This existing infrastructure is the product of enormous amounts of capital investment and was built over the course of decades. Further, in terms of data _volume_, any newer contending systems pale in comparison.

<Figure
  src={require('./data-volume.svg').default}
  caption="Existing digital systems contain vast quantities of valuable data, including historical records."
  width={400}
/>

Individuals rely on these systems every day to connect with their peers and to be able to interact at great distance with people they do not know nor trust. Identity, finance, commerce, news, social media — vast portions of all human activity are intermediated through them. It is through this intermediation that privileged actors pervasively surveil, censor, manipulate and extract rents.

One may ask how such a situation could persist unchecked, and there are surely many answers, but a common thread is the steady erosion of individuals' ability to exit — to choose better alternatives.

## walls

It has been pointed out by many that the reason existing systems are failing in the first place is due to the predictable outcomes of underlying incentives. In the context of digital systems, this phenomenon has recently been popularly coined as ["enshittification" by Cory Doctorow](https://pluralistic.net/2022/11/28/enshittification/#relentless-payola). In short, it pertains to a situation where, after achieving sufficient scale, privileged actors in a system begin to alter it in order to extract as much value as possible while simultaneously degrading it and restricting the ability of others to exit.

The "_restricting the ability of others to exit_" part is of critical importance. After all, one would hope competitive forces in the market would apply corrective pressure when service degrades. But incumbents can and will do everything they can to stifle competition and entrench their power. This is done in numerous ways, but we will focus specifically on one: **data access control**.

If users were simply showing up and obtaining fungible services then the cost associated with switching between systems would be low. But in many cases users have a stake in a particular system due to the accrual of data that is valuable to them, such as identity information, financial records, and social graphs. If they wish to switch to a competitor this usually requires leaving all that behind. For example, on a ride sharing platform, drivers can spend years building up a history which is the basis for their reputation. Switching to a new platform which offers them a larger proportion of margins may not be worth it simply because they would have to incur significant losses in revenue while rebuilding their reputation again.

<Figure 
    src={require('./access-control.svg').default}
    caption="Retention strategy: <s>useful product</s> deny interoperability."
    width={600}>
</Figure>

Conversely, as the creator of a new ride sharing platform you are faced with significant disadvantage because you have no way of discerning what quality of service to expect from a new driver who just signed up. This in turn will result in inferior user experience and ultimately an uncompetitive product. The situation would be different if they could interoperate with the incumbent platform, but the reality is: incumbent systems have no incentive to interoperate with competitors, and thus they refuse to.

<Figure
  src={require('./myapp-small.png').default}
  caption="An application without any existing data or infrastructure."
  width={600}
/>

In some cases an incumbent system will voluntarily provide some limited degree of interoperability for uses which facilitate additional value extraction. For example, OpenID is a digital identity standard which provides centralized management of user accounts across different systems. This works by introducing the notion of an Identity Provider which is a system that manages user accounts and can be integrated with by "relying parties" instead of each having their own authentication system. Most readers will likely be familiar with the option of "Sign in with \_\_\_" available on many websites, that is OpenID. A system acting as an Identity Provider has the privilege of being able to see exactly what a user is logging in to, when, and can shut off that integration at any time. This is a design that would make even Sauron blush, as it enables mass surveillance of users across the internet. Unsurprisingly, you will not find OpenID support between systems which are competing in the same market verticals.

There have been policy efforts to _force_ incumbents to support integrations with their competitors, such as initiatives in Open Banking. Predictably, every means available is used to resist these measures. This may include things such as applying tactics straight out of the Simple Sabotage Field Manual in standardization initiatives, or just providing an undocumented, arduous and bare-minimum API that works half the time. The issue is that these policies attempt to do something much more than simply dictating "your device must support third-party headphones". They require incumbents to be active and _knowing_ intermediaries between their users and their competitors. This provides them ample opportunity for subversion.

It should be noted that the focus of this section has primarily been regarding the incentive structures of privately owned systems, but public (state) systems also commonly have interoperability issues, albeit for different reasons (bureaucracy, red tape, underfunded). Public systems carry significant authority and credibility, but their failure to meet the needs of the modern digital era has resulted in many critical functions being handled by the private sector instead.

If we want new systems to have a chance of reaching scale and competing with those that already exist, interoperability will need to play a crucial role. Further, interoperability should not be contingent upon blessing from incumbents, nor should it require their knowing involvement.

## scaling walls

The explosive emergence of new AI products serves as an interesting example of the kind of scaling that can be achieved when existing data is available. These products, specifically the underlying models, were developed by dragnetting the internet for training data. This never would have been possible at such a pace had the data these models needed been locked off behind access control systems, but instead much of it was scraped from "public" sources such as message boards, software repositories, books, and encyclopedias (no comment on the ethics of this). By tapping in to vast reserves of existing data, and of course a bunch of compute resources, these products reached scale remarkably quickly.

However, most personal data is, rightly, not publicly accessible. Sensitive private information requires strict access controls, and this poses a core issue: users have very limited options when it comes to utilizing their private data in new products in a manner which preserves _provenance_.

For example, a new driver signing up on a ridesharing platform may claim they have 4000 hours of experience. But, says who? Perhaps they even provide a screenshot of their profile from another platform as evidence. It's well understood that screenshots can be easily forged and thus this is not credible evidence. The point of interoperability isn't simply copying data from one system to another, a user could download and reupload it if that were the goal. The goal is _securely_ exchanging data between the systems such that the provenance remains intact.

If one searches online for "data provenance" they will find an abundance of content which could rapidly put anyone to sleep. Enterprise database management, compliance practices, data governance: these words do not typically induce enthusiasm. However, if scaling over the artificial walls of monopolies is exciting, then understanding that provenance is a key component of that should make provenance exciting as well. Fortunately, we're not going to look at any of those aforementioned topics. But we will introduce the notion.

Data provenance is the notion that all data has an implicit history which is comprised of a causal chain of processes including generation, transmission and transformation.

Provenance is concerned with questions such as:

- Where did the data come from? (origin)
- Has it been handled correctly? (integrity)
- How has it been transformed? (lineage)

The answers to these questions are themselves data, often referred to as metadata.

<Figure
  src={require('./chain.svg').default}
  caption="A causal chain of processes applied to data from its origin to the present."
  width={600}
/>

The primary reason a competing system would need to _directly_ query an incumbent system would be to do data exchange securely without requiring the incumbent to change anything. One way this has been tried is to have a user send their password to the new system which subsequently uses the user's device as a proxy to login on their behalf. This "credential-sharing" approach has two fatal issues. First, it is a security and privacy disaster. Sharing passwords is considered a cardinal sin amongst infosec experts for good reason: it greatly increases the chance of a user's account getting hacked. Additionally, even if the password isn't widely leaked, the party it is being shared with has full access to all the user's private information, which is often well in excess of what the user wishes to share. Second, credential-sharing has been contested in court and argued to be in violation of US CFAA law as a form of nebulously defined "unauthorized access". The legal uncertainty around this method is sufficient to deter its use given the prospect of being buried by armies of lawyers.

Now, this is usually where the hordes of cryptographers come piling in screaming "use digital signatures!". And they are right to point out that digital signatures are meant to address this exact problem, as they allow a recipient to verify the origin and authenticity of the data that is signed. The old system _could_ simply provide a signature on the hypothetical rideshare driver's profile so that a new system could verify its authenticity without having to connect them directly. This would indeed be the ideal solution, if not for one inconvenient truth: this requires the old system to do that, and it won't.

<Figure
  src={require('./actually-no.png').default}
  caption="Do digital signatures solve this problem?"
  width={500}
/>

To truly unlock interoperability between competing systems a solution is needed which satisfies all of the constraints that were just identified. Namely, a solution must:

- Provide verifiable provenance so that data can be trusted by a new system.
- Be secure in regards to preserving a user's privacy, not exposing excess information and not encouraging poor practices such as password sharing.
- Be driven by a user exercising their existing authorization within fair use such as downloading their own profile data.
- Not require an incumbent system to be updated.

In the past, such a solution could not exist for technical reasons which we won't dive deeply into for the sake of keeping this piece accessible. However, this is where we have to let the cryptographers back into the room.

## proofs

If one asks a random person on the street whether they know what cryptography is, many would answer "no", or they may even say "yes, you mean crypto like Bitcoin and NFTs right?". Both responses are likely to induce a sense of dismay in cryptographers. If instead one asks if they have heard of encryption, the response is much more likely to be in the affirmative. However, it remains unknown to the average person just how essential, even necessary, cryptography has been for the development of the modern economy and just about everything digital that we take for granted every day.

Without encryption it would not be feasible to securely communicate across large distances: that means no keeping passwords secret when logging in to a website. Without digital signatures one could not be sure who they are communicating with online: that means not knowing if the website one is connected to is real or a fake. Online commerce, social media, banking, chat apps, government services, none of these could securely exist on the internet if not for cryptography. If it weren't for digital signatures and encryption, encyclopedias may have been the most exciting app available on the internet.

Well, cryptographers have been cooking up a new fundamental technology which promises similar levels of impact. To keep things at a high level, we will refer to it generally as "verifiable computation". Digital signatures provide a means to verify the origin and integrity of a piece of data: the first two components of data provenance. But the third component, transformation, has not previously been verifiable — until recently.

Verifiable computation consists of techniques which allow one to take a piece of data and perform some computation on it, computing an output, and at the same time creating a "proof" that the computation was performed correctly. This is a very powerful tool as one can send an output along with a proof to another party, and they can verify the data was transformed correctly without having to run that computation themselves. A mind bender is that it is possible to verify an output without knowing _anything_ about the input data, just ensuring that the output is correct — this is called a zero-knowledge proof.

<Figure
  src={require('./proof.svg').default}
  caption="Verifiable computation is the missing piece for fully verifiable data provenance."
  width={600}
/>

By combining digital signatures, encryption and verifiable computation it becomes possible to design a protocol which meets the constraints that we laid out in the previous section. A user can connect to one system, query some data they are authorized to access, such as their profile, and then _prove_ this data to another system in a secure and private way.

In fact, the user gets very precise control over exactly what they share. For instance, they don't have to reveal their entire profile which may contain extra information like their home address. Instead, they can select a subset of information in their profile and share only that with a new system. This is called "selective disclosure" and this ability is very powerful to have in a modern era full of private data breaches.

This entire process of data sharing is done without the knowing of the system which stores the data, and critically, it does not need to update anything in order for this to work. **It works today, with virtually every digital system that exists on the internet**.

<Figure
  src={require('./magic.svg').default}
  caption="Cryptography enables a user to securely exchange data between applications without sharing credentials."
  width={600}
/>

Having such a tool widely available for anyone to use, for free, has interesting implications. It empowers individuals to freely move between systems and take their valuable data along with them without asking for permission or being surveilled while doing so.

Preventing users from leaving is a key part of a monopolist's strategy, so it would follow that such a tool could play a significant role in restoring market competition online. The tool can act as a sort of uncensorable, private and universal interoperability software for the internet — without requiring new intermediaries, the user is in control.

It also becomes possible to leverage and express personal data in new powerful ways. One could query a multitude of different data sources, such as government identity systems, financial systems, and social platforms, then prove complex things about themselves to others. For example, they could prove a compound statement such as:

<Callout>
I am a citizen of one of these 10 countries, and I have a bank account with one of these 4 banking institutions, and on this other social platform I have 4000 followers.
</Callout>

Proving such a statement could go a long way in providing credibility to something they are trying to do online, as this would become difficult to do at scale as a bot. In fact, the proliferation of bots online is largely a consequence of how antiquated identity systems are. Creating fake accounts and launching bot campaigns is effectively free because many systems only require having an email address and being able to solve CAPTCHAs. Of course, having the ability to prove richer identity information does not come without censorship and privacy risks as well: the rise of state-mandated age gating on websites being a recent example. That is a separate battle.

## you may now pass "Go"

Our project, TLSNotary, provides free open-source software (FOSS) which enables universal data portability and selective disclosure for the internet. With TLSNotary, users can export their data anywhere in a fully verifiable and privacy-preserving way.

Our ambition is for our software to promote people's digital sovereignty and to enhance their privacy online. We feel that unlocking universal interoperability between digital systems could play a meaningful role in that by enabling people to opt-in to using systems which treat them with dignity and respect, and opt-out of systems which seek to coerce and infringe.

The ability to selectively disclose information, using zero-knowledge proofs, will help alleviate the endemic oversharing and replication of personal information across systems which is invariably leaked widely without care and without consequence.

The history of technology is a story of inertia, where each increment forward is compounding upon the last. For new systems to reach scale, they must not, and need not, ask users to start their digital lives from scratch. That being said, we also recognize the risk of creating dependencies on old systems which have proven to be adversarial. Cautious and deliberate design is warranted to ensure new systems are not vulnerable to undue influence.

As existing systems continue their trend of extracting, degrading and failing to adapt, the world is beginning to demand alternatives. Feeds littered with ads, poor search results, outlandish fees, data breaches and unmitigated bot campaigns — better online experiences are desired, and they are possible.

---

<p style={{fontSize: "10pt"}}>
    Disclaimer: TLSNotary is intended to enable users to privately process and selectively disclose data that they are lawfully entitled to access, using standard cryptographic methods. It is not designed to bypass paywalls, access controls, technical protection measures, or other safeguards, nor to enable access to data that a user is not otherwise authorised to receive.
</p>