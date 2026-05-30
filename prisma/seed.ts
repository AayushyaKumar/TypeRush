import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

interface SeedPassage {
  text: string
  difficulty: string
  category: string
}

const passages: SeedPassage[] = [
  // ═══════════════════════════════════════════════════════════════════
  //  50-WORD PASSAGES (~48–55 words each)
  // ═══════════════════════════════════════════════════════════════════

  // ── Easy · 50 words ───────────────────────────────────────────────
  {
    text: "The morning sun cast golden light across the quiet neighborhood. Birds sang from the treetops while a gentle breeze rustled through the leaves. Children walked to school with backpacks bouncing on their shoulders. A dog barked playfully behind a white picket fence. It was another beautiful, ordinary day.",
    difficulty: "easy",
    category: "general",
  },
  {
    text: "Reading is one of the best habits a person can develop. Books open doors to new worlds and ideas that we might never experience otherwise. Whether you enjoy fiction or nonfiction, there is always something new to learn. Even twenty minutes a day can make a real difference.",
    difficulty: "easy",
    category: "general",
  },
  {
    text: "Cooking at home is a wonderful skill that everyone should learn. It saves money, promotes healthier eating, and can be a fun creative outlet. Start with simple recipes that use just a few ingredients. Over time you will build confidence and learn to experiment with new flavors.",
    difficulty: "easy",
    category: "general",
  },
  {
    text: "Learning to code starts with understanding the basics. Variables store information, loops repeat actions, and conditions let your program make decisions. Every programmer begins with simple programs that print messages to the screen. The best way to learn is by doing and building small projects.",
    difficulty: "easy",
    category: "programming",
  },
  {
    text: "Water is one of the most important substances on Earth. It covers about seventy percent of the planet and is essential for all forms of life. Water exists in three states: solid ice, liquid water, and gas as steam. Conserving water protects our environment for future generations.",
    difficulty: "easy",
    category: "science",
  },
  {
    text: "Stories have been part of human culture for thousands of years. Long before books existed, people gathered around fires to share tales of adventure, love, and mystery. A good story can transport you to another time and place, making you feel emotions deeply and changing how you see life.",
    difficulty: "easy",
    category: "literature",
  },

  // ── Medium · 50 words ─────────────────────────────────────────────
  {
    text: "Effective communication requires more than just speaking clearly. It involves active listening, reading body language, and understanding the emotional context behind someone's words. Many conflicts arise not from disagreement but from miscommunication. Taking time to paraphrase what you have heard ensures mutual understanding in professional and personal settings.",
    difficulty: "medium",
    category: "general",
  },
  {
    text: "Version control systems like Git have fundamentally transformed collaborative software development. Every change is tracked with a commit message explaining the rationale behind modifications. Branches allow developers to work independently without disrupting the stable codebase. Pull requests facilitate code review, enabling team members to catch bugs early.",
    difficulty: "medium",
    category: "programming",
  },
  {
    text: "The human brain contains approximately eighty-six billion neurons, each forming thousands of synaptic connections with neighboring cells. Neuroplasticity, the brain's ability to reorganize itself by forming new neural connections throughout life, challenges the outdated notion that brain structure is permanently fixed after early childhood development.",
    difficulty: "medium",
    category: "science",
  },

  // ── Hard · 50 words ───────────────────────────────────────────────
  {
    text: "Distributed consensus algorithms such as Raft and Paxos solve the fundamental problem of achieving agreement among multiple nodes in a fault-tolerant distributed system. These protocols must handle network partitions, message delays, and node failures while maintaining linearizability guarantees essential for building reliable large-scale production infrastructure.",
    difficulty: "hard",
    category: "programming",
  },
  {
    text: "Quantum entanglement represents one of the most counterintuitive phenomena in modern physics. When two particles become entangled, measuring a property of one instantaneously determines the corresponding property of the other, regardless of spatial separation. This nonlocal phenomenon forms the theoretical foundation for quantum cryptography and teleportation protocols.",
    difficulty: "hard",
    category: "science",
  },
  {
    text: "The philosophical implications of artificial general intelligence encompass fundamental questions about consciousness, moral agency, and the nature of understanding itself. The Chinese Room argument, proposed by philosopher John Searle, challenges computational theories of mind by suggesting that syntactic manipulation of symbols cannot produce genuine semantic comprehension.",
    difficulty: "hard",
    category: "general",
  },

  // ═══════════════════════════════════════════════════════════════════
  //  100-WORD PASSAGES (~95–105 words each)
  // ═══════════════════════════════════════════════════════════════════

  // ── Easy · 100 words ──────────────────────────────────────────────
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

  // ── Hard · 100 words ──────────────────────────────────────────────
  {
    text: "The epistemological foundations of scientific knowledge have been subjected to rigorous philosophical scrutiny since Karl Popper's articulation of falsificationism. Popper argued that the demarcation between science and pseudoscience lies not in the verifiability of hypotheses but in their falsifiability: a genuinely scientific theory must make predictions that could, in principle, be contradicted by empirical observation. Thomas Kuhn subsequently complicated this picture with his concept of paradigm shifts, arguing that scientific progress does not proceed through linear accumulation of knowledge but through revolutionary transformations replacing existing frameworks with fundamentally incompatible alternatives.",
    difficulty: "hard",
    category: "general",
  },
  {
    text: "The lambda calculus, developed by Alonzo Church in the 1930s, provides the theoretical foundation for functional programming languages. In its pure form, lambda calculus consists of only three constructs: variables, function abstraction through lambda expressions, and function application. Despite this minimal syntax, lambda calculus is Turing-complete, capable of expressing any computable function through systematic application of substitution rules known as beta reduction. Church encoding demonstrates this universality by representing natural numbers, boolean values, and data structures as pure functions without any primitive data types.",
    difficulty: "hard",
    category: "programming",
  },
  {
    text: "The standard model of particle physics represents humanity's most comprehensive description of fundamental particles and the forces governing their interactions. It categorizes all known elementary particles into fermions, which constitute matter, and bosons, which mediate forces. Fermions are further divided into quarks, which combine to form protons and neutrons through the strong nuclear force, and leptons, which include electrons and neutrinos. The electromagnetic force is mediated by photons, the weak nuclear force by W and Z bosons, and the strong force by gluons.",
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

  // ── Hard · 150 words ──────────────────────────────────────────────
  {
    text: "The theoretical framework underlying modern cryptographic systems relies on computational complexity theory, specifically the assumed intractability of certain mathematical problems for which no efficient classical algorithm is known. Public-key cryptography, introduced by Diffie and Hellman in 1976 and subsequently implemented through the RSA algorithm, depends on the practical impossibility of factoring the product of two sufficiently large prime numbers. The security guarantee is asymmetric: multiplying two primes is computationally trivial, but reversing this operation requires time that grows exponentially with input size, rendering brute-force approaches infeasible for keys of adequate length. Elliptic curve cryptography provides equivalent security with substantially shorter key lengths by exploiting the difficulty of the discrete logarithm problem on elliptic curves over finite fields. However, the emergence of quantum computing threatens these foundational assumptions. Shor's algorithm demonstrates that a sufficiently powerful quantum computer could factor large integers in polynomial time, breaking current cryptographic protections.",
    difficulty: "hard",
    category: "general",
  },
  {
    text: "Garbage collection algorithms represent a fundamental tradeoff in programming language design between developer productivity and runtime performance predictability. Manual memory management, as practiced in C and C++, provides fine-grained control over allocation and deallocation but introduces entire categories of defects including memory leaks, dangling pointer dereferences, double frees, and buffer overflows. Automatic garbage collection eliminates these errors by periodically identifying and reclaiming memory no longer reachable from the program's root set. Reference counting maintains a counter for each allocated object and deallocates when the count reaches zero, but fails to reclaim circular references. Tracing collectors periodically traverse the object graph from root references, handling cycles naturally but introducing pause times. Generational garbage collection exploits the empirical observation that most objects die young by partitioning the heap and collecting younger generations more frequently, dramatically reducing average collection overhead in practice.",
    difficulty: "hard",
    category: "programming",
  },
  {
    text: "The emergence of antibiotic resistance represents one of the most pressing public health crises of the twenty-first century, threatening to reverse decades of medical progress. Alexander Fleming's discovery of penicillin inaugurated the antibiotic era, providing clinicians with powerful tools against bacterial pathogens. However, evolutionary pressure ensures that bacterial populations exposed to antibiotics inevitably develop resistance through spontaneous mutation and horizontal gene transfer. Mechanisms include enzymatic degradation of the antibiotic molecule, modification of the molecular target, upregulation of efflux pumps, and decreased membrane permeability. The crisis has been exacerbated by inappropriate prescribing for viral infections, patient noncompliance with treatment courses, widespread use of antibiotics as growth promoters in livestock agriculture, and environmental contamination from pharmaceutical manufacturing. Multi-drug resistant organisms now present significant treatment challenges in clinical settings worldwide, while the pharmaceutical pipeline for novel antibiotic classes has simultaneously contracted.",
    difficulty: "hard",
    category: "science",
  },
  {
    text: "The literary movement known as magical realism, while most prominently associated with Latin American fiction, has roots extending across multiple cultural traditions. Distinguished from pure fantasy by its grounding in recognizable reality into which supernatural elements intrude without explanation, magical realism treats the extraordinary as entirely ordinary. Gabriel Garcia Marquez's One Hundred Years of Solitude exemplifies this through its chronicle of the Buendia family, where characters ascend into heaven, prophecies determine destiny, and a rain of yellow flowers accompanies death. These events are narrated with the same matter-of-fact tone applied to mundane domestic activities. Critics have interpreted magical realism as a postcolonial narrative strategy, representing reality as experienced by communities whose worldviews encompass spiritual dimensions that Western rationalism excludes. By refusing to privilege empirical observation over alternative epistemologies, the genre challenges the cultural hegemony of Enlightenment rationality.",
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
