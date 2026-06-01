// Load env vars first — ts-node does NOT auto-load .env or .env.local
// Must be at the very top before any other import that reads process.env
import * as dotenv from "dotenv"
import * as path from "path"
import * as fs from "fs"

const localEnv = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(localEnv)) dotenv.config({ path: localEnv })
dotenv.config() // fallback: loads .env (won't overwrite already-set vars)

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local or .env before running the seed.")
}

// For seeding via pooler: add connection_limit=1 to avoid pool exhaustion
const rawUrl = process.env.DATABASE_URL
const connectionString = rawUrl.includes("?")
  ? `${rawUrl}&connection_limit=1`
  : `${rawUrl}?connection_limit=1`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })


interface SeedPassage {
  text: string
  difficulty: string
  category: string
}

const passages: SeedPassage[] = [
 

  // ═══════════════════════════════════════════════════════════════════
  //  100-WORD PASSAGES (~95–105 words each)
  // ═══════════════════════════════════════════════════════════════════


  {
    text: "Traveling to new places is one of the most rewarding experiences in life. When you visit a different city or country, you get to see how other people live, what they eat, and how they celebrate. Even small trips can teach you something new about the world and about yourself. Packing for a trip is part of the fun. You think about what you will need, check the weather, and make a list. When you arrive somewhere new, everything feels exciting. The streets look different, the food smells different, and the sounds are unfamiliar.",
    difficulty: "easy",
    category: "general",
  },
  {
    text: "Building your first website is an exciting milestone in learning to code. You start with HTML, which provides the structure of your page. Think of it as the skeleton that holds everything together. You use tags to create headings, paragraphs, images, and links. Next comes CSS, which controls how your page looks. With CSS you can change colors, adjust spacing, pick fonts, and create layouts that look great on any screen size. It turns a plain document into something visually appealing. JavaScript adds interactivity to your website.",
    difficulty: "easy",
    category: "programming",
  },
  {
    text : "The universe is a vast and mysterious expanse filled with billions of galaxies, stars, planets, and cosmic phenomena. Scientists believe it began nearly 13.8 billion years ago with the Big Bang, an event that caused space and time to expand rapidly. Our solar system is located in the Milky Way galaxy and includes the Sun, eight planets, moons, asteroids, and comets. Space exploration has allowed humans to learn more about black holes, distant exoplanets, and the possibility of extraterrestrial life. Powerful telescopes and spacecraft continue to reveal new discoveries, helping humanity understand the origins, structure, and future of the universe.",
    difficulty: "easy",
    category: "science",
  },
  {
    text: "Poetry is one of the oldest forms of literary expression, stretching back thousands of years to ancient civilizations. Unlike prose, poetry uses rhythm, meter, and carefully chosen words to create meaning that goes beyond the literal. A poem can capture a feeling in just a few lines that a novel might take chapters to express. Reading poetry aloud reveals its musical quality. The sounds of words matter as much as their meanings, creating patterns that echo in the mind long after the reading is done.",
    difficulty: "easy",
    category: "literature",
  },

  // ── Medium · 100 words ────────────────────────────────────────────
  {
    text: "The concept of deep work, popularized by computer science professor Cal Newport, argues that the ability to concentrate without distraction on cognitively demanding tasks is becoming increasingly rare and correspondingly valuable in our modern economy. In an era saturated with notifications, social media feeds, and open-plan offices, sustained focus has become a competitive advantage rather than a default state. Newport distinguishes between deep work and shallow work, the latter encompassing logistical tasks that can be performed while distracted. Most knowledge workers spend their days switching between email, meetings, and messaging platforms.",
    difficulty: "medium",
    category: "general",
  },
  {
    text: "Database indexing is one of the most impactful performance optimizations available to software engineers, yet it remains poorly understood by many developers who treat databases as opaque storage engines. An index is a data structure, typically a B-tree or hash table, that allows the database engine to locate rows matching a query predicate without scanning every row in the table. Without appropriate indexes, a query against a million-row table must examine each record sequentially, resulting in response times that degrade linearly with data volume.",
    difficulty: "medium",
    category: "programming",
  },
  {
    text: "The discovery of CRISPR-Cas9 gene editing technology has fundamentally altered the landscape of molecular biology. Originally identified as a bacterial immune defense mechanism against viral infections, CRISPR systems use guide RNA molecules to direct the Cas9 enzyme to specific DNA sequences where it creates precise double-strand breaks. Researchers can exploit this mechanism to delete, modify, or insert genetic material at targeted locations within an organism's genome with unprecedented accuracy and efficiency. The implications span multiple domains of science and medicine.",
    difficulty: "medium",
    category: "science",
  },
  {
    text: "The unreliable narrator has become one of the most compelling literary devices in modern fiction, challenging readers to question the truthfulness of the voice guiding them through a story. Unlike omniscient narration, which provides objective insight into events and characters, an unreliable narrator filters reality through personal biases, mental instability, or deliberate deception. This technique forces readers to become active participants in constructing meaning rather than passive recipients of a predetermined narrative shaped entirely by the author's intention.",
    difficulty: "medium",
    category: "literature",
  },

  // ── Hard · ~185 words ─────────────────────────────────────────────
  {
    text: "The hard problem of consciousness, as formulated by philosopher David Chalmers, draws a crucial distinction between explaining the functional and behavioral correlates of mental states and explaining why those processes are accompanied by subjective experience at all. Neuroscience has made remarkable progress characterizing the neural correlates of consciousness, identifying the brain regions and network dynamics associated with different states of awareness. Yet this scientific progress, according to Chalmers, addresses only what he calls the easy problems: explaining how the brain integrates information, discriminates stimuli, and generates reports about its own internal states. The genuinely hard problem is explaining why any of these computational processes feel like something from the inside, why there is subjective experience accompanying neural activity rather than information processing occurring in the dark without any experiential quality whatsoever. Physicalist responses range from eliminativism, which denies that phenomenal consciousness exists as commonly conceived, to functionalism, which argues that mental states are entirely defined by their causal and functional roles. Panpsychist alternatives propose that experiential properties are fundamental features of physical reality rather than emergent products of sufficiently complex neural information processing systems.",
    difficulty: "hard",
    category: "general",
  },
  {
    text: "Type systems serve as formal frameworks for reasoning about the correctness of programs before they execute, catching entire categories of errors that would otherwise surface only at runtime in production environments. The Hindley-Milner type inference algorithm, foundational to languages like Haskell, OCaml, and Rust, infers the most general type of an expression without requiring explicit annotations from the programmer. This algorithm exploits the structure of lambda calculus to derive type constraints and resolve them through unification, producing principal types that capture all possible valid instantiations. Parametric polymorphism, commonly known as generics, allows functions and data structures to operate over type variables that are instantiated differently at each call site while maintaining strong type safety guarantees. Dependent types, as implemented in Idris and Coq, extend this further by allowing types to depend on runtime values, enabling programmers to express properties such as vector length invariants directly within the type system. The Curry-Howard correspondence reveals a profound theoretical connection, establishing a bijection between type-theoretic proofs and functional programs, such that writing a well-typed function is equivalent to constructing a constructive mathematical proof of its type signature.",
    difficulty: "hard",
    category: "programming",
  },
  {
    text: "Einstein's general theory of relativity revolutionized our understanding of gravity by reconceptualizing it not as a force transmitted between massive objects but as a curvature of spacetime geometry caused by the presence of mass and energy. The field equations relating spacetime curvature to energy-momentum distribution are nonlinear partial differential equations whose solutions describe everything from the expansion of the universe to the interior structure of black holes. Schwarzschild derived the first exact solution shortly after Einstein published his equations, describing the spacetime geometry surrounding a non-rotating spherically symmetric mass and predicting the existence of a region from which no information can escape: what we now call the event horizon. Gravitational waves, oscillations propagating through the fabric of spacetime at the speed of light, were predicted by general relativity but considered unmeasurable for decades due to their extraordinarily small amplitude. The LIGO detector's first direct observation in 2015, detecting spacetime distortions smaller than a thousandth the diameter of a proton produced by two merging black holes over a billion light-years distant, constituted one of the most remarkable experimental achievements in the history of physics.",
    difficulty: "hard",
    category: "science",
  },

  // ═══════════════════════════════════════════════════════════════════
  //  150-WORD PASSAGES (~145–155 words each)
  // ═══════════════════════════════════════════════════════════════════

  // ── Easy · 150 words ──────────────────────────────────────────────
  {
    text: "Growing a garden can be one of the most satisfying hobbies you will ever try. It does not matter if you have a large backyard or just a small balcony with a few pots. Anyone can grow something green with a little effort and patience. The first step is choosing what you want to grow. Herbs like basil, mint, and parsley are great for beginners because they grow quickly. If you want flowers, marigolds and sunflowers are easy to start from seed. Vegetables like tomatoes, lettuce, and peppers do well in containers. Once you have picked your plants, think about sunlight and water. Most plants need at least six hours of direct sunlight each day. Watering should be consistent but not excessive. The soil should be moist but not soggy. Watching your plants grow from tiny seeds into full, healthy plants is deeply rewarding.",
    difficulty: "easy",
    category: "general",
  },
  {
    text: "When you first start learning to program, it can feel like learning a foreign language. The screen is filled with words and symbols that do not make sense yet, and every small mistake causes an error. But just like learning any new skill, programming gets easier with practice and patience. The key is to start small and build up gradually. Begin by learning what variables are and how they store information. Think of a variable as a labeled box where you keep a value. Next, learn about loops, which let your program repeat an action many times. A loop can print the numbers from one to one hundred in just a few lines of code. Conditions let your program make decisions. If a certain condition is true, do one thing. Otherwise, do something else. This is how programs react to different situations and inputs from the user.",
    difficulty: "easy",
    category: "programming",
  },
  {
    text: "The ocean covers more than seventy percent of the surface of our planet, yet we have explored less of it than the surface of the Moon. The deep sea remains one of the greatest mysteries on Earth. Beneath the waves lies a world of incredible diversity, from colorful coral reefs teeming with fish to the dark, cold depths where strange creatures glow with their own light. Ocean currents act like giant conveyor belts, moving warm water from the tropics toward the poles and cold water back again. These currents affect weather patterns, climate, and the distribution of marine life around the globe. The ocean also plays a critical role in absorbing carbon dioxide from the atmosphere, helping to regulate the temperature of our planet. Protecting the health of our oceans is essential for the well-being of every living thing on Earth.",
    difficulty: "easy",
    category: "science",
  },

  // ── Medium · 150 words ────────────────────────────────────────────
  {
    text: "The relationship between sleep quality and cognitive performance has been extensively documented in neuroscience research, yet modern society continues to treat sleep deprivation as a badge of productivity rather than the significant health risk it represents. Adults require between seven and nine hours of sleep per night for optimal functioning, yet surveys consistently show that a substantial portion of the working population regularly sleeps fewer than six hours. During sleep, the brain engages in critical maintenance processes that cannot occur during waking hours. The glymphatic system, a waste clearance pathway discovered relatively recently, becomes dramatically more active during deep sleep, flushing out metabolic waste products including beta-amyloid proteins associated with Alzheimer's disease. Memory consolidation, the process by which short-term memories are transferred to long-term storage, depends heavily on specific sleep stages. Slow-wave sleep appears particularly important for declarative memories while REM sleep plays a crucial role in procedural memory.",
    difficulty: "medium",
    category: "general",
  },
  {
    text: "The evolution of software testing methodologies reflects the industry's growing understanding that quality assurance must be integrated throughout the development lifecycle rather than treated as a separate phase. Traditional waterfall approaches confined testing to a distinct period after implementation was complete, often resulting in the discovery of fundamental design flaws when correction was prohibitively expensive. Test-driven development inverted this sequence, requiring developers to write failing tests before implementing the code that satisfies them. Tests serve as executable documentation, precisely specifying the expected behavior of each component. They provide a safety net enabling confident refactoring. The testing pyramid recommends organizing tests into three layers based on scope and execution speed. Unit tests form the broad base, testing individual functions in isolation. Integration tests verify that components interact correctly when combined. End-to-end tests sit at the narrow apex, validating complete user workflows through the full application stack.",
    difficulty: "medium",
    category: "programming",
  },
  {
    text: "Climate change represents one of the most complex challenges facing humanity in the twenty-first century. The overwhelming scientific consensus, supported by decades of observational data and sophisticated computer modeling, confirms that human activities, particularly the burning of fossil fuels and deforestation, are driving unprecedented changes in the global climate system. Rising concentrations of greenhouse gases trap additional thermal radiation in the atmosphere, leading to increases in average global temperature, shifts in precipitation patterns, and more frequent extreme weather events. The consequences extend across interconnected systems: melting polar ice raises sea levels threatening coastal communities, changing temperature regimes disrupt agricultural productivity, and ocean acidification endangers marine ecosystems. Addressing this challenge requires coordinated action at international, national, and individual levels, combining policy interventions, technological innovation, and behavioral change to reduce emissions while building resilience against impacts already underway.",
    difficulty: "medium",
    category: "science",
  },

  // ── Hard · ~185 words ─────────────────────────────────────────────
  {
    text: "Cognitive biases represent systematic errors in human judgment that arise from the mental shortcuts, known as heuristics, which our brains rely upon to navigate an overwhelming volume of daily information. While these heuristics generally serve us well, allowing rapid decisions without exhaustive deliberation, they produce predictable distortions in reasoning under specific conditions. Confirmation bias leads individuals to disproportionately seek and interpret information that confirms their existing beliefs while discounting contradictory evidence. The availability heuristic causes people to estimate the probability of events based on how easily examples come to mind, inflating perceived risk for vivid occurrences and underestimating statistically more common hazards. Anchoring bias demonstrates that initial numerical information, even when irrelevant, exerts disproportionate influence on subsequent quantitative judgments. Daniel Kahneman's framework of System One and System Two thinking provides a theoretical structure for understanding these phenomena, distinguishing between fast automatic associative cognition and slow deliberate rule-governed reasoning. Effective decision-making in high-stakes environments requires cultivating awareness of these biases, implementing structured decision processes, seeking disconfirming evidence deliberately, and engaging reflective cognition precisely when intuitive answers arrive with the greatest subjective confidence.",
    difficulty: "hard",
    category: "general",
  },
  {
    text: "Distributed consensus algorithms such as Raft and Paxos address one of the most fundamental challenges in computer science: achieving agreement among multiple nodes in a system where any participant may fail or become unreachable at any time. The CAP theorem, formulated by Eric Brewer, establishes a theoretical ceiling on what distributed systems can guarantee, proving that no system can simultaneously provide consistency, availability, and partition tolerance. When network partitions occur, engineers must choose between returning potentially stale data and refusing to respond entirely. Raft was designed explicitly to be more understandable than Paxos while providing equivalent correctness guarantees. It decomposes consensus into leader election, log replication, and safety, ensuring that committed log entries are never overwritten. A leader is elected by obtaining votes from a majority of nodes, guaranteeing that only one leader exists per term. All client requests are routed through the leader, which replicates entries to followers before acknowledging success. This majority-quorum requirement ensures that any two successful operations share at least one common node, preserving linearizability even across leader transitions, network partitions, and complete node recoveries in large production deployments.",
    difficulty: "hard",
    category: "programming",
  },
  {
    text: "The second law of thermodynamics, perhaps the most profound and far-reaching principle in all of physics, states that the total entropy of an isolated system never decreases over time. Entropy, loosely understood as a measure of disorder or the number of microstates compatible with a given macrostate, increases inexorably in all spontaneous processes. This asymmetry defines the thermodynamic arrow of time, distinguishing past from future in a universe whose fundamental microscopic laws are time-symmetric. The statistical mechanics interpretation developed by Ludwig Boltzmann provided a molecular basis for thermodynamic phenomena, expressing entropy as the logarithm of the number of accessible microstates. Boltzmann's H-theorem demonstrated how irreversible macroscopic behavior emerges from reversible microscopic dynamics through the action of overwhelming probability. The apparent contradiction between microscopic reversibility and macroscopic irreversibility was reconciled by recognizing that the enormously greater number of high-entropy states makes entropy-decreasing fluctuations vanishingly improbable for any macroscopic system. Maxwell's Demon thought experiment revealed deep connections between information, measurement, and thermodynamic work, while Landauer's principle ultimately established that erasing a single bit of information necessarily dissipates a minimum quantity of energy as heat into the surrounding environment.",
    difficulty: "hard",
    category: "science",
  },
  {
    text: "James Joyce's Ulysses represents perhaps the most ambitious and technically complex novel in the English literary tradition, transplanting Homer's Odyssey to a single day in Dublin in 1904. The novel follows Leopold Bloom, an advertising canvasser, through eighteen episodes corresponding loosely to episodes in the Homeric epic. Each episode employs a distinct narrative style, shifting between interior monologue, dramatic dialogue, journalistic prose, and an elaborate parody of English literary history that spans several centuries. The stream of consciousness technique reaches its fullest expression in Molly Bloom's unpunctuated soliloquy, which concludes the novel in a torrent of associative thought spanning forty-five pages without a single period. Joyce's use of the epiphany, a sudden crystallization of meaning in ordinary moments, reflects his belief that genuine insight emerges not through extraordinary events but through heightened attention to the textures of daily experience. The novel's notorious difficulty has generated an entire scholarly industry devoted to annotation and interpretation. Critics remain divided on whether this difficulty is productive, forcing readers into an active role that enriches meaning, or merely self-indulgent obscurantism unnecessarily excluding casual readers.",
    difficulty: "hard",
    category: "literature",
  },
]

async function main() {
  console.log("Seeding passages...")

  // First, deactivate any old short passages (under 40 words) that are still active
  const deactivated = await prisma.passage.updateMany({
    where: {
      wordCount: { lt: 40 },
      isActive: true,
    },
    data: { isActive: false },
  })
  if (deactivated.count > 0) {
    console.log(`Deactivated ${deactivated.count} short passages (< 40 words).`)
  }

  // Check for existing passages to avoid duplicates on re-runs
  const existing = await prisma.passage.findMany({ select: { text: true } })
  const existingTexts = new Set(existing.map((e) => e.text))

  const toCreate = passages
    .filter((p) => !existingTexts.has(p.text))
    .map((p) => ({
      text: p.text,
      wordCount: p.text.split(/\s+/).length,
      difficulty: p.difficulty,
      category: p.category,
    }))

  if (toCreate.length > 0) {
    const result = await prisma.passage.createMany({ data: toCreate })
    console.log(`Created ${result.count} passages.`)
  } else {
    console.log("All passages already exist, nothing to seed.")
  }

  const total = await prisma.passage.count({ where: { isActive: true } })
  console.log(`Total active passages in database: ${total}`)
}


main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
