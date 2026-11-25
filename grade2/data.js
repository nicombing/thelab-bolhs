/* Grade 2 Personal Interactive Worksheet — Starter Content Pack */

window.G2_DATA = {
  defaultProfile: {
    studentName: "Hize",
    mascot: "owl",
    greetingNote:
      "Check off your daily Routines, try a fun interactive Task, and build your step-by-step Projects. Every little step earns bright stars!"
  },

  mascots: {
    owl: {
      name: "Ollie the Wise Owl",
      tip: "Hoo-hoo! Tap a card below to start. Remember, you can click Read Aloud whenever you want to listen!",
      svg: `
        <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <circle cx="40" cy="43" r="24" fill="#0f766e"/>
          <path d="M22 25 L29 14 L34 23 Z" fill="#0d625b"/>
          <path d="M58 25 L51 14 L46 23 Z" fill="#0d625b"/>
          <ellipse cx="40" cy="52" rx="14" ry="12" fill="#ccfbf1"/>
          <circle cx="31" cy="36" r="8" fill="#ffffff"/>
          <circle cx="49" cy="36" r="8" fill="#ffffff"/>
          <circle cx="32" cy="36" r="3.6" fill="#1f2937"/>
          <circle cx="48" cy="36" r="3.6" fill="#1f2937"/>
          <path d="M36 42 L40 48 L44 42 Z" fill="#f59e0b"/>
        </svg>
      `
    },
    fox: {
      name: "Finn the Curious Fox",
      tip: "Let's explore together! Small steps every day make big, awesome discoveries.",
      svg: `
        <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M18 22 L28 12 L34 26 Z" fill="#ea580c"/>
          <path d="M62 22 L52 12 L46 26 Z" fill="#ea580c"/>
          <circle cx="40" cy="44" r="23" fill="#f97316"/>
          <path d="M19 46 Q40 36 61 46 Q54 66 40 67 Q26 66 19 46 Z" fill="#fff7ed"/>
          <circle cx="31" cy="40" r="3.5" fill="#1f2937"/>
          <circle cx="49" cy="40" r="3.5" fill="#1f2937"/>
          <circle cx="40" cy="49" r="4" fill="#1f2937"/>
        </svg>
      `
    },
    bunny: {
      name: "Sunny the Happy Bunny",
      tip: "Hop right in! Check off a morning habit or pick a story task to earn shiny stars.",
      svg: `
        <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <ellipse cx="30" cy="20" rx="6" ry="15" fill="#fef3c7" stroke="#d97706" stroke-width="2.2"/>
          <ellipse cx="50" cy="20" rx="6" ry="15" fill="#fef3c7" stroke="#d97706" stroke-width="2.2"/>
          <circle cx="40" cy="47" r="21" fill="#fffbeb" stroke="#d97706" stroke-width="2.2"/>
          <circle cx="32" cy="44" r="3.4" fill="#1f2937"/>
          <circle cx="48" cy="44" r="3.4" fill="#1f2937"/>
          <ellipse cx="40" cy="51" rx="4" ry="3" fill="#fb7185"/>
          <path d="M35 56 Q40 60 45 56" stroke="#1f2937" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      `
    },
    rocket: {
      name: "Zoom the Learning Rocket",
      tip: "3, 2, 1, Blast Off! Every finished habit and task powers up your star engine.",
      svg: `
        <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M40 10 C52 22 54 42 50 56 H30 C26 42 28 22 40 10 Z" fill="#0f766e"/>
          <circle cx="40" cy="34" r="8" fill="#ccfbf1" stroke="#ffffff" stroke-width="2.5"/>
          <path d="M30 46 L18 58 L28 58 Z" fill="#f59e0b"/>
          <path d="M50 46 L62 58 L52 58 Z" fill="#f59e0b"/>
          <path d="M34 56 L40 70 L46 56 Z" fill="#fbbf24"/>
        </svg>
      `
    }
  },

  moods: [
    { id: "happy", label: "Happy & Bright" },
    { id: "proud", label: "Proud of Myself" },
    { id: "curious", label: "Super Curious" },
    { id: "calm", label: "Calm & Ready" },
    { id: "tired", label: "A Little Sleepy" }
  ],

  stamps: [
    "Super Star!",
    "Awesome Effort!",
    "Creative Thinker!",
    "Neat & Careful!",
    "Proud of You!"
  ],

  routineGroups: [
    { id: "morning", title: "Morning Ready", badge: "Start Bright" },
    { id: "learning", title: "Learning & Reading", badge: "Grow My Brain" },
    { id: "evening", title: "Evening Wind-Down", badge: "Rest Well" }
  ],

  defaultRoutines: [
    { id: "r-teras", group: "morning", title: "Membersihkan teras", active: true },
    { id: "r-bed", group: "morning", title: "Merapikan tempat Tidur", active: true },
    { id: "r-eggs", group: "morning", title: "Memanen Telur Ayam dan mencatat di app", active: true },
    { id: "r-guitar", group: "learning", title: "Learn Guitar for 30 minutes", active: true },
    { id: "r-read-write", group: "learning", title: "Read a book for 30 minutes or write a story at least 2 pages.", active: true },
    { id: "r-taekwondo", group: "learning", title: "Practice Taekwondo Poomsae", active: true },
    { id: "r-tidy-rooms", group: "evening", title: "Merapikan kamar dan ruang tengah", active: true },
    { id: "r-journal", group: "evening", title: "Menulis Journal", active: true }
  ],

  tasks: [
    {
      id: "task-1",
      number: 1,
      title: "How a Tiny Seed Wakes Up",
      subject: "Reading & Nature",
      readTime: "3 min read",
      teaser: "Follow a little bean seed as sunlight and water help it grow roots, a stem, and green leaves!",
      iconSvg: `
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 50h40"/>
          <path d="M32 50V26"/>
          <path d="M32 36c-8 0-12-5-12-11 6 0 12 4 12 11Z"/>
          <path d="M32 31c8 0 12-5 12-11-6 0-12 4-12 11Z"/>
          <circle cx="50" cy="14" r="5"/>
        </svg>
      `,
      sections: [
        {
          heading: "1. A Sleepy Little Seed",
          paragraphs: [
            "Deep inside the soft brown {{soil}}, a tiny bean seed is taking a nap. Inside the seed is a baby plant waiting for the right time to wake up.",
            "A seed needs two special helpers first: cool {{water}} and gentle {{warmth}}. When rain soaks into the soil, the seed coat gets soft and cracks open!"
          ]
        },
        {
          heading: "2. Roots Go Down, Stem Goes Up",
          paragraphs: [
            "First, little white {{roots}} push down into the dirt. Roots hold the plant steady and drink water like tiny straws.",
            "Next, a green {{stem}} stretches up toward the sky to find bright {{sunlight}}. Now the baby plant is called a {{seedling}}!"
          ],
          factBox: {
            title: "Fun Nature Clue!",
            text: "Green leaves are like tiny kitchens. They use sunlight, air, and water to cook food for the whole plant!"
          }
        }
      ],
      glossary: {
        soil: { pos: "noun", def: "The soft brown earth or dirt where plants grow.", ex: "We planted three bean seeds in the soil." },
        water: { pos: "noun", def: "A clear liquid that living things drink to stay healthy.", ex: "Plants drink water through their roots." },
        warmth: { pos: "noun", def: "Gentle, cozy heat from the sun.", ex: "Seeds need water and warmth to wake up." },
        roots: { pos: "noun", def: "The underground parts of a plant that drink water and hold it in place.", ex: "Strong roots keep a tall tree from falling." },
        stem: { pos: "noun", def: "The tall green stalk that carries water up to the leaves.", ex: "The stem grew taller every sunny day." },
        sunlight: { pos: "noun", def: "Bright light that shines down from the sun.", ex: "Green leaves love sunlight." },
        seedling: { pos: "noun", def: "A brand-new baby plant that just sprouted from a seed.", ex: "Our little seedling now has two green leaves!" }
      },
      tipBox: {
        title: "Grade 2 Sentence Helper",
        tip: "Use sequence words like First, Next, and Then to tell the story of how something grows!",
        example: "First, the seed drinks water. Next, roots grow down. Then, a green stem reaches for the sun."
      },
      warmup: [
        {
          question: "What two helpers wake up a sleeping seed in the soil?",
          options: [
            "Water and gentle warmth",
            "Snow and ice cream",
            "Loud music and toys",
            "Darkness and plastic"
          ],
          correctIndex: 0,
          explanation: "Yes! Water softens the seed coat and warmth helps the baby plant start growing."
        },
        {
          question: "Which part of a plant grows DOWN into the soil like tiny drinking straws?",
          options: [
            "Flowers",
            "Roots",
            "Clouds",
            "Bees"
          ],
          correctIndex: 1,
          explanation: "Great job! Roots grow downward to drink water and hold the plant steady."
        },
        {
          question: "What do we call a baby plant that has just sprouted?",
          options: [
            "A pebble",
            "A nest",
            "A seedling",
            "A shell"
          ],
          correctIndex: 2,
          explanation: "Spot on! A young plant that just grew from a seed is called a seedling."
        }
      ],
      activity: {
        type: "fill",
        title: "Word Bank Fill-In Game",
        instruction: "Tap a word from the green Word Bank, then tap the matching blank box!",
        bank: ["roots", "sunlight", "seedling", "soil"],
        items: [
          { before: "1. A tiny seed sleeps inside the brown ", answer: "soil", after: "." },
          { before: "2. The ", answer: "roots", after: " drink water underground." },
          { before: "3. Green leaves stretch up to catch ", answer: "sunlight", after: "." },
          { before: "4. A baby plant with its first leaves is a ", answer: "seedling", after: "." }
        ]
      },
      prompt: "Imagine you planted a magic sunflower seed in a pot on your windowsill. Write 2 to 3 sentences telling how you will care for it and what will grow first!",
      outline: [
        "Tell what you will give your seed (water, soil, sunlight).",
        "Tell which part grows first (roots or stem).",
        "Tell how your plant will look when it grows big!"
      ],
      starters: [
        "First, I will put my seed in soft soil and give it...",
        "Next, little roots will grow down and...",
        "Then, my happy seedling will grow..."
      ],
      powerWords: ["seed", "soil", "water", "roots", "stem", "sunlight", "seedling", "first", "next"]
    },

    {
      id: "task-2",
      number: 2,
      title: "Around My Cozy Home",
      subject: "English & Sentences",
      readTime: "3 min read",
      teaser: "Explore how homes keep families safe and dry, and practice using handy place words like in, on, and under!",
      iconSvg: `
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 30L32 12l22 18"/>
          <path d="M16 26v26h32V26"/>
          <rect x="27" y="36" width="10" height="16"/>
          <rect x="20" y="30" width="6" height="6"/>
        </svg>
      `,
      sections: [
        {
          heading: "1. Why Every Family Needs a Shelter",
          paragraphs: [
            "A home is a special {{shelter}} that keeps us {{safe}} and dry. When heavy rain splashes outside, a strong {{roof}} keeps our heads cozy and dry.",
            "Homes around the world look different! In snowy places, thick walls keep warm air {{inside}}. In rainy tropical places, steep roofs let rainwater slide off fast."
          ]
        },
        {
          heading: "2. Finding Things With Place Words",
          paragraphs: [
            "Inside our home, we use small helper words to tell where things are! A storybook sits {{on}} the desk, cozy slippers rest {{under}} the bed, and clean cups stay {{in}} the cupboard.",
            "When we keep our rooms tidy, it is easy to find our favorite books and toys whenever we want to play or read."
          ],
          factBox: {
            title: "Place Word Trick!",
            text: "Look closely: ON means touching the top, IN means inside a box or room, and UNDER means below something!"
          }
        }
      ],
      glossary: {
        shelter: { pos: "noun", def: "A safe place like a house or nest that protects you from weather.", ex: "Our house is a cozy shelter during a storm." },
        safe: { pos: "adjective", def: "Protected from harm, wind, or heavy rain.", ex: "We feel safe and warm inside." },
        roof: { pos: "noun", def: "The top covering of a house or building.", ex: "Raindrops tapped on the roof." },
        inside: { pos: "adverb", def: "In the inner part of a room or building.", ex: "Let's read inside while it rains." },
        on: { pos: "preposition", def: "Resting on top of a surface.", ex: "My notebook is on the table." },
        under: { pos: "preposition", def: "Directly below or beneath something.", ex: "The playful cat hid under the chair." },
        in: { pos: "preposition", def: "Surrounded by or inside something.", ex: "Put your crayons in the pencil box." }
      },
      tipBox: {
        title: "Sentence Builder Tip",
        tip: "Start every sentence with a CAPITAL letter and finish with a period (.) or exclamation mark (!).",
        example: "My favorite spot is in my bedroom. My teddy bear sits on my pillow."
      },
      warmup: [
        {
          question: "How does a steep roof help a house in a rainy place?",
          options: [
            "It lets heavy rainwater slide off quickly",
            "It turns rain into sand",
            "It makes the house float away",
            "It hides all the windows"
          ],
          correctIndex: 0,
          explanation: "Correct! Steep roofs guide rainwater down and off the house fast."
        },
        {
          question: "Choose the best place word: 'My pencil case is ___ my backpack.'",
          options: [
            "in",
            "between",
            "over",
            "through"
          ],
          correctIndex: 0,
          explanation: "Nice! Because the pencil case is inside the backpack, we use 'in'."
        },
        {
          question: "Choose the best place word: 'The lamp is sitting ___ the desk.'",
          options: [
            "under",
            "in",
            "on",
            "into"
          ],
          correctIndex: 2,
          explanation: "Yes! When something rests on top of a flat surface, we use 'on'."
        }
      ],
      activity: {
        type: "fill",
        title: "Place Words Puzzle",
        instruction: "Tap a place word from the bank, then tap the blank where it fits best!",
        bank: ["on", "in", "under", "roof"],
        items: [
          { before: "1. The strong ", answer: "roof", after: " keeps out the rain." },
          { before: "2. My slippers are hiding ", answer: "under", after: " the bed." },
          { before: "3. I put my storybook ", answer: "on", after: " the wooden table." },
          { before: "4. My sharp pencils live ", answer: "in", after: " my pencil box." }
        ]
      },
      prompt: "Describe your favorite cozy spot at home! Write 2 to 3 sentences telling what is in that room and use at least two place words (in, on, under, next to).",
      outline: [
        "Name your favorite room or spot at home.",
        "Tell one thing that is ON or IN that spot.",
        "Tell why you like spending time there."
      ],
      starters: [
        "My favorite cozy spot at home is...",
        "In this room, my favorite thing is on...",
        "I love this spot because..."
      ],
      powerWords: ["home", "cozy", "safe", "roof", "in", "on", "under", "room", "because"]
    },

    {
      id: "task-3",
      number: 3,
      title: "Feathers, Wings & Beaks",
      subject: "Science & Animals",
      readTime: "3 min read",
      teaser: "Discover the clever body tools that help birds fly high, stay warm, and pick up their favorite snacks!",
      iconSvg: `
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 36c6-12 18-16 28-10 5-5 10-5 14-2-4 5-8 10-16 14-8 4-18 3-26-2Z"/>
          <path d="M52 24l6 2-5 4"/>
          <circle cx="44" cy="24" r="1.8" fill="currentColor"/>
          <path d="M28 40v10M35 40v10"/>
        </svg>
      `,
      sections: [
        {
          heading: "1. Built to Fly Lightly",
          paragraphs: [
            "Have you ever wondered why birds can zoom through the sky while people stay on the ground? Birds have soft, light {{feathers}} and strong {{wings}} that push against the air.",
            "Even a bird's bones are super special! Many bird bones are {{hollow}} inside—like tiny straws—so a bird's body is very light and easy to lift."
          ]
        },
        {
          heading: "2. A Beak for Every Snack",
          paragraphs: [
            "Birds do not have teeth! Instead, every bird has a {{beak}} shaped like a handy tool. A sparrow has a short, strong beak for cracking seeds.",
            "A pelican has a huge stretchy beak for scooping fish, and a hummingbird has a thin beak like a straw for sipping sweet flower {{nectar}}. Birds also lay {{eggs}} in safe nests."
          ],
          factBox: {
            title: "Did You Know?",
            text: "Penguins and ostriches are real birds with feathers and beaks—even though they cannot fly! Penguins use their wings like flippers to swim fast."
          }
        }
      ],
      glossary: {
        feathers: { pos: "noun", def: "Light, soft coverings that keep birds warm and help them fly.", ex: "The blue jay has bright blue feathers." },
        wings: { pos: "noun", def: "The arms of a bird that flap to lift it into the air.", ex: "The eagle spread its wide wings." },
        hollow: { pos: "adjective", def: "Empty on the inside, making something much lighter.", ex: "Hollow bones help birds fly easily." },
        beak: { pos: "noun", def: "A bird's hard mouth used for eating, carrying twigs, and cracking seeds.", ex: "The parrot used its curved beak to open a nut." },
        nectar: { pos: "noun", def: "Sweet liquid made inside flowers.", ex: "Hummingbirds drink nectar from bright flowers." },
        eggs: { pos: "noun", def: "Round shells that baby birds hatch out of.", ex: "Mother robin kept three blue eggs warm in her nest." }
      },
      tipBox: {
        title: "Comparing Tip",
        tip: "Use 'but' to show how two things are different!",
        example: "Birds have feathers and beaks, but humans have skin and teeth."
      },
      warmup: [
        {
          question: "Why do hollow bones help birds fly?",
          options: [
            "They make the bird's body very light",
            "They make the bird super heavy",
            "They turn feathers into rocks",
            "They help birds chew apples with teeth"
          ],
          correctIndex: 0,
          explanation: "Awesome! Hollow bones keep a bird's body light so its wings can lift it up."
        },
        {
          question: "Which bird has a thin beak like a straw for sipping flower nectar?",
          options: [
            "A pelican",
            "A hummingbird",
            "A sparrow",
            "A penguin"
          ],
          correctIndex: 1,
          explanation: "Yes! Hummingbirds have long, thin beaks just right for reaching sweet nectar."
        },
        {
          question: "How do penguins use their wings?",
          options: [
            "To swim fast underwater like flippers",
            "To fly above airplanes",
            "To build brick houses",
            "To hold pencils"
          ],
          correctIndex: 0,
          explanation: "Right! Even though penguins don't fly in the sky, they are amazing swimmers."
        }
      ],
      activity: {
        type: "sort",
        title: "Sort Game: Bird Feature or Human Feature?",
        instruction: "Tap whether each clue belongs to a Bird or a Human!",
        groups: ["Bird", "Human"],
        items: [
          { label: "Has feathers on its body", answer: "Bird" },
          { label: "Has teeth for chewing crunchy apples", answer: "Human" },
          { label: "Has a beak shaped for its food", answer: "Bird" },
          { label: "Has heavy solid bones and walks on two feet", answer: "Human" },
          { label: "Lays eggs in a safe nest", answer: "Bird" }
        ]
      },
      prompt: "If you could be any bird for one day, which bird would you pick? Write 2 to 3 sentences telling what your beak and wings would help you do!",
      outline: [
        "Name the bird you would be (or invent one!).",
        "Tell what your wings or feathers help you do.",
        "Tell what your beak eats for lunch."
      ],
      starters: [
        "If I could be a bird for one day, I would be a...",
        "My wings and feathers would help me...",
        "I would use my beak to eat..."
      ],
      powerWords: ["bird", "feathers", "wings", "beak", "hollow", "fly", "swim", "nest", "but"]
    },

    {
      id: "task-4",
      number: 4,
      title: "Smart Saver at the Market",
      subject: "Life Skills & Math Words",
      readTime: "3 min read",
      teaser: "Join Leo at the Saturday market to sort Needs from Wants and plan how to save shiny coins!",
      iconSvg: `
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="32" cy="32" r="20"/>
          <circle cx="32" cy="32" r="13" stroke-dasharray="4 3"/>
          <path d="M32 23v18M28 27h6a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h6"/>
        </svg>
      `,
      sections: [
        {
          heading: "1. Needs vs. Wants",
          paragraphs: [
            "Every Saturday, families visit the {{market}} to buy things for the week. Before spending {{coins}} or paper bills, smart shoppers ask one helpful question: Is this a {{need}} or a {{want}}?",
            "A need is something we must have to stay healthy and safe—like fresh fruit, clean water, warm clothes, and school notebooks. A want is something fun to have—like a shiny sticker pack or an extra toy robot!"
          ]
        },
        {
          heading: "2. The Magic of Saving",
          paragraphs: [
            "When you get allowance or birthday money, you do not have to {{spend}} all of it right away. You can put part of it in a piggy bank to {{save}} for a bigger goal later!",
            "Even saving 2 coins every week adds up fast. In 5 weeks, 2 + 2 + 2 + 2 + 2 makes 10 coins!"
          ],
          factBox: {
            title: "Mini Math Challenge!",
            text: "If you have 10 coins and spend 4 coins on healthy apples, you still have 6 coins left to save!"
          }
        }
      ],
      glossary: {
        market: { pos: "noun", def: "A busy place where people buy and sell fresh food and goods.", ex: "We bought sweet bananas at the morning market." },
        coins: { pos: "noun", def: "Small round metal pieces of money.", ex: "She dropped three shiny coins into her jar." },
        need: { pos: "noun", def: "Something important we must have to stay healthy and safe.", ex: "Clean drinking water is a daily need." },
        want: { pos: "noun", def: "Something fun we would like to have, even if we can live without it.", ex: "A new superhero toy is a fun want." },
        spend: { pos: "verb", def: "To pay money to buy something.", ex: "I will spend 3 coins on a notebook." },
        save: { pos: "verb", def: "To keep money safely for later instead of spending it now.", ex: "I like to save coins for a special storybook." }
      },
      tipBox: {
        title: "Smart Plan Tip",
        tip: "Use 'because' to explain why you chose to buy or save something!",
        example: "I will buy apples because they are a healthy need, and I will save the rest."
      },
      warmup: [
        {
          question: "Which item below is a NEED for staying healthy?",
          options: [
            "Fresh fruit and clean water",
            "A giant glowing slime bucket",
            "Ten packs of glitter stickers",
            "A remote-control dinosaur"
          ],
          correctIndex: 0,
          explanation: "Yes! Healthy food and clean water are everyday needs."
        },
        {
          question: "If you have 10 coins and spend 4 coins on fruit, how many coins are left?",
          options: [
            "14 coins",
            "6 coins",
            "2 coins",
            "0 coins"
          ],
          correctIndex: 1,
          explanation: "Great math! 10 minus 4 equals 6 coins left."
        },
        {
          question: "Why is it helpful to save some coins in a piggy bank?",
          options: [
            "So your money grows for a bigger goal later",
            "Because coins melt in the sun",
            "So you never eat healthy food",
            "Because shops do not like coins"
          ],
          correctIndex: 0,
          explanation: "Spot on! Saving a little bit at a time helps you reach bigger goals."
        }
      ],
      activity: {
        type: "sort",
        title: "Market Basket Sort: Need or Want?",
        instruction: "Tap whether each market item is a NEED or a WANT!",
        groups: ["Need", "Want"],
        items: [
          { label: "Warm raincoat for stormy days", answer: "Need" },
          { label: "Extra superhero action figure", answer: "Want" },
          { label: "Fresh carrots and apples", answer: "Need" },
          { label: "Sparkly bubble wand", answer: "Want" },
          { label: "Clean drinking water", answer: "Need" }
        ]
      },
      prompt: "Imagine you have 10 gold coins at the market! Write 2 to 3 sentences telling 1 Need you will buy, 1 thing you want to Save for, and why.",
      outline: [
        "Tell 1 healthy or useful NEED you will buy.",
        "Tell how many coins you will SAVE in your jar.",
        "Explain WHY your plan is smart using 'because'."
      ],
      starters: [
        "With my 10 coins, first I will buy...",
        "I will save some of my coins for...",
        "This is a smart plan because..."
      ],
      powerWords: ["coins", "market", "need", "want", "save", "spend", "healthy", "because"]
    }
  ],

  projects: [
    {
      id: "project-1",
      number: 1,
      title: "My Nature Detective Leaf & Plant Log",
      badge: "Nature & Science Project",
      duration: "2–4 short sessions",
      teaser: "Pick one real leaf or plant near your home or school, observe its color and shape, draw it, and make a Show & Tell poster!",
      iconSvg: `
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M16 48C16 26 32 14 50 14c0 18-12 34-34 34Z"/>
          <path d="M14 50l24-24"/>
          <circle cx="44" cy="44" r="8"/>
          <path d="M50 50l6 6"/>
        </svg>
      `,
      step1: {
        title: "Choose Your Plant & Gather Tools",
        materials: [
          "Find 1 real plant, flower, or fallen leaf outside or in a pot",
          "Bring curious eyes (and a ruler or hand span to measure!)",
          "Wash your hands gently after touching soil or leaves"
        ],
        planLabel: "Which plant or leaf did you choose, and where did you find it?",
        planPlaceholder: "I chose a bright green leaf from the pot on our balcony..."
      },
      step2: {
        title: "Be a Nature Detective!",
        desc: "Look closely at your plant and record 3 detective clues below:",
        prompts: [
          { id: "color", label: "1. What colors do you see?", placeholder: "Dark green with light green lines..." },
          { id: "feel", label: "2. How does it feel? (smooth, fuzzy, bumpy?)", placeholder: "Smooth on top and a little bumpy..." },
          { id: "size", label: "3. How big is it? (smaller or bigger than your hand?)", placeholder: "About the size of three fingers..." }
        ]
      },
      step3: {
        title: "Sketch Your Plant on the Drawing Pad",
        desc: "Use the colors below to draw your leaf or plant! Try adding roots, a stem, or sunbeams too."
      },
      step4: {
        title: "My Nature Show & Tell",
        desc: "Write 2 to 3 sentences to introduce your plant on your printable Project Poster!",
        starters: [
          "My nature project is about...",
          "When I looked closely, I noticed that...",
          "To keep this plant healthy, it needs..."
        ]
      }
    },

    {
      id: "project-2",
      number: 2,
      title: "Design a Cozy Animal Shelter",
      badge: "Design & Creativity Project",
      duration: "2–4 short sessions",
      teaser: "Become a junior architect! Choose an animal friend, plan a weather-safe shelter, draw your blueprint, and explain how it works!",
      iconSvg: `
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 32L32 14l24 18"/>
          <path d="M16 26v24h32V26"/>
          <path d="M26 50V37a6 6 0 0 1 12 0v13"/>
          <circle cx="48" cy="14" r="4"/>
        </svg>
      `,
      step1: {
        title: "Pick Your Animal Friend & Materials",
        materials: [
          "Pick 1 animal (puppy, bunny, bird, turtle, or kitten)",
          "Decide what weather the shelter must block (rain, hot sun, or wind)",
          "Choose eco-friendly building ideas (wood, soft straw, leaves, or recycled boxes)"
        ],
        planLabel: "Which animal are you building for, and what is your shelter's name?",
        planPlaceholder: "I am designing the 'Sunny Bunny Hut' for a baby rabbit..."
      },
      step2: {
        title: "Check Your Smart Shelter Features",
        desc: "Answer these 3 architect questions to make sure your animal stays happy and safe:",
        prompts: [
          { id: "roof", label: "1. What shape is the roof so rain or sun stays out?", placeholder: "A steep triangle roof so rainwater slides off..." },
          { id: "materials", label: "2. What safe materials will you use?", placeholder: "Smooth wood, dry straw, and a soft blanket..." },
          { id: "cozy", label: "3. What special fun corner is inside for your animal?", placeholder: "A little carrot snack bowl and a cozy pillow..." }
        ]
      },
      step3: {
        title: "Draw Your Shelter Blueprint!",
        desc: "Sketch your animal shelter on the drawing pad. Don't forget the roof, a doorway, and your happy animal friend!"
      },
      step4: {
        title: "Architect Show & Tell",
        desc: "Write 2 to 3 sentences explaining why your animal will love this shelter!",
        starters: [
          "I designed a cozy shelter for a...",
          "My shelter keeps my animal safe because...",
          "My favorite part inside the shelter is..."
        ]
      }
    }
  ]
};
