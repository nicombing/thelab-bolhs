/* Interactive SVG Motion Scenes & Living Routine Garden for Grade 2 Worksheet */

(function () {
  "use strict";

  const SCENES = {
    "task-1": {
      badge: "Interactive Picture • Seed to Seedling",
      modes: [
        {
          id: "a",
          label: "1. Sleeping Seed",
          caption: "The little bean seed rests inside soft brown soil. Raindrops and gentle warmth are arriving to wake it up!"
        },
        {
          id: "b",
          label: "2. Growing Seedling!",
          caption: "Hooray! Roots push down into the soil to drink water, and a green stem lifts two bright leaves up toward the sunshine!"
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg" viewBox="0 0 720 240" role="img" aria-label="Animated bean seed waking up and growing into a sunny seedling">
            <rect x="0" y="0" width="720" height="240" rx="14" fill="#ecfeff"/>
            <circle cx="620" cy="48" r="28" fill="#fbbf24" class="anim-pulse-soft"/>
            <g stroke="#f59e0b" stroke-width="3" stroke-linecap="round" opacity="0.65">
              <line x1="576" y1="48" x2="554" y2="48"/>
              <line x1="588" y1="78" x2="568" y2="92"/>
              <line x1="620" y1="90" x2="620" y2="108"/>
            </g>

            <!-- Fluffy cloud -->
            <g class="anim-float-slow">
              <ellipse cx="170" cy="54" rx="46" ry="22" fill="#ffffff"/>
              <ellipse cx="204" cy="58" rx="34" ry="18" fill="#ffffff"/>
              <ellipse cx="140" cy="60" rx="28" ry="15" fill="#ffffff"/>
            </g>

            <!-- Raindrops (Mode A) -->
            <g class="scene-toggle-group mode-a-only" fill="#0ea5e9">
              <ellipse cx="155" cy="96" rx="4" ry="8" class="anim-rain"/>
              <ellipse cx="188" cy="108" rx="4" ry="8" class="anim-rain"/>
              <ellipse cx="220" cy="94" rx="4" ry="8" class="anim-rain"/>
              <ellipse cx="355" cy="102" rx="4" ry="8" class="anim-rain"/>
            </g>

            <!-- Soil & Grass -->
            <rect x="0" y="162" width="720" height="78" fill="#92400e"/>
            <rect x="0" y="154" width="720" height="14" fill="#22c55e"/>

            <!-- Sleeping Seed (Mode A) -->
            <g class="scene-toggle-group mode-a-only">
              <ellipse cx="360" cy="194" rx="22" ry="15" fill="#d97706" stroke="#78350f" stroke-width="2.5"/>
              <path d="M352 192 Q356 189 360 192 M364 192 Q368 189 372 192" stroke="#78350f" stroke-width="2" fill="none" stroke-linecap="round"/>
              <text x="394" y="186" font-size="14" font-weight="800" fill="#fef3c7">Zzz...</text>
              <rect x="275" y="114" width="170" height="28" rx="14" fill="#ffffff" stroke="#0f766e" stroke-width="1.5"/>
              <text x="360" y="133" text-anchor="middle" font-size="13" font-weight="700" fill="#0f766e">Waiting for water!</text>
            </g>

            <!-- Growing Seedling (Mode B) -->
            <g class="scene-toggle-group mode-b-only">
              <!-- Roots underground -->
              <g stroke="#fde68a" stroke-width="3.5" fill="none" stroke-linecap="round">
                <path d="M360 166 Q356 190 332 214"/>
                <path d="M360 166 Q364 194 388 216"/>
                <path d="M360 174 Q360 202 360 226"/>
              </g>
              <text x="415" y="208" font-size="13" font-weight="700" fill="#fef3c7">Roots drink water!</text>

              <!-- Stem & Leaves -->
              <g class="anim-sway-slow" style="transform-origin: 360px 158px;">
                <path d="M360 160 V76" stroke="#15803d" stroke-width="7" stroke-linecap="round"/>
                <ellipse cx="330" cy="108" rx="26" ry="14" transform="rotate(-24 330 108)" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
                <ellipse cx="390" cy="96" rx="26" ry="14" transform="rotate(22 390 96)" fill="#4ade80" stroke="#15803d" stroke-width="2"/>
                <circle cx="360" cy="68" r="14" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
              </g>

              <rect x="442" y="72" width="136" height="28" rx="14" fill="#ffffff" stroke="#15803d" stroke-width="1.5"/>
              <text x="510" y="91" text-anchor="middle" font-size="13" font-weight="700" fill="#15803d">Hello, Sunlight!</text>
            </g>
          </svg>
        `;
      }
    },

    "task-2": {
      badge: "Interactive Picture • Cozy Home & Place Words",
      modes: [
        {
          id: "a",
          label: "1. Rainy Day Outside",
          caption: "A steep strong roof guides falling raindrops right off the house so the family stays cozy and dry inside!"
        },
        {
          id: "b",
          label: "2. Peek Inside My Room",
          caption: "Look for place words! The book is ON the desk, pencils are IN the cup, and cozy slippers are UNDER the bed."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg" viewBox="0 0 720 240" role="img" aria-label="Cozy home showing roof in rain and room items with place words">
            <!-- Mode A: Rainy Exterior -->
            <g class="scene-toggle-group mode-a-only">
              <rect x="0" y="0" width="720" height="240" rx="14" fill="#dbeafe"/>
              <rect x="0" y="196" width="720" height="44" fill="#4ade80"/>
              <g stroke="#0284c7" stroke-width="3" stroke-linecap="round">
                <line x1="120" y1="30" x2="112" y2="54" class="anim-rain"/>
                <line x1="210" y1="20" x2="202" y2="44" class="anim-rain"/>
                <line x1="510" y1="24" x2="502" y2="48" class="anim-rain"/>
                <line x1="600" y1="36" x2="592" y2="60" class="anim-rain"/>
              </g>
              <!-- House -->
              <rect x="255" y="106" width="210" height="94" rx="6" fill="#fef3c7" stroke="#92400e" stroke-width="3"/>
              <polygon points="232,110 360,34 488,110" fill="#0f766e" stroke="#115e59" stroke-width="3"/>
              <rect x="336" y="144" width="48" height="56" rx="4" fill="#b45309"/>
              <rect x="278" y="128" width="42" height="36" rx="4" fill="#fde047" stroke="#92400e" stroke-width="2.5"/>
              <rect x="400" y="128" width="42" height="36" rx="4" fill="#fde047" stroke="#92400e" stroke-width="2.5"/>
              <rect x="260" y="14" width="200" height="26" rx="13" fill="#ffffff"/>
              <text x="360" y="32" text-anchor="middle" font-size="13" font-weight="800" fill="#0f766e">Steep roof = Dry &amp; Safe!</text>
            </g>

            <!-- Mode B: Inside Room Place Words -->
            <g class="scene-toggle-group mode-b-only">
              <rect x="0" y="0" width="720" height="240" rx="14" fill="#fffbeb"/>
              <rect x="0" y="188" width="720" height="52" fill="#e6decb"/>
              <!-- Desk -->
              <rect x="110" y="124" width="180" height="16" rx="4" fill="#b45309"/>
              <rect x="122" y="140" width="12" height="54" fill="#92400e"/>
              <rect x="266" y="140" width="12" height="54" fill="#92400e"/>
              <!-- Book ON desk -->
              <rect x="140" y="106" width="66" height="18" rx="3" fill="#0f766e"/>
              <text x="173" y="96" text-anchor="middle" font-size="13" font-weight="800" fill="#0f766e">Book ON desk</text>
              <!-- Cup with pencils IN -->
              <rect x="230" y="96" width="28" height="28" rx="4" fill="#f59e0b"/>
              <line x1="238" y1="96" x2="235" y2="76" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
              <line x1="248" y1="96" x2="252" y2="74" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>
              <text x="255" y="64" text-anchor="middle" font-size="13" font-weight="800" fill="#b45309">Pencils IN cup</text>

              <!-- Bed + Slippers UNDER -->
              <rect x="410" y="126" width="210" height="36" rx="8" fill="#ccfbf1" stroke="#0f766e" stroke-width="2.5"/>
              <rect x="410" y="104" width="18" height="88" rx="4" fill="#92400e"/>
              <rect x="602" y="122" width="18" height="70" rx="4" fill="#92400e"/>
              <rect x="434" y="114" width="44" height="16" rx="8" fill="#ffffff" stroke="#5eead4" stroke-width="2"/>
              <ellipse cx="496" cy="184" rx="16" ry="8" fill="#fb7185"/>
              <ellipse cx="536" cy="184" rx="16" ry="8" fill="#fb7185"/>
              <text x="516" y="216" text-anchor="middle" font-size="13" font-weight="800" fill="#be123c">Slippers UNDER bed</text>
            </g>
          </svg>
        `;
      }
    },

    "task-3": {
      badge: "Interactive Picture • Amazing Bird Tools",
      modes: [
        {
          id: "a",
          label: "1. Sky Flyer (Hummingbird)",
          caption: "Light hollow bones, flapping wings, and a thin straw-like beak let the hummingbird sip sweet nectar from flowers!"
        },
        {
          id: "b",
          label: "2. Ocean Swimmer (Penguin)",
          caption: "Penguins are real birds too! Their strong wings work like flippers to zoom underwater and catch fish."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg" viewBox="0 0 720 240" role="img" aria-label="Comparing a flying hummingbird and a swimming penguin">
            <!-- Mode A: Hummingbird & Flower -->
            <g class="scene-toggle-group mode-a-only">
              <rect x="0" y="0" width="720" height="240" rx="14" fill="#f0fdf4"/>
              <circle cx="96" cy="48" r="24" fill="#fde047" class="anim-pulse-soft"/>
              <!-- Flower -->
              <path d="M510 240 V128" stroke="#15803d" stroke-width="7" stroke-linecap="round"/>
              <circle cx="510" cy="116" r="22" fill="#fb7185"/>
              <circle cx="490" cy="106" r="14" fill="#fda4af"/>
              <circle cx="530" cy="106" r="14" fill="#fda4af"/>
              <circle cx="510" cy="116" r="9" fill="#fde047"/>
              <!-- Hummingbird -->
              <g class="anim-float-slow">
                <ellipse cx="360" cy="118" rx="34" ry="20" fill="#0d9488"/>
                <circle cx="394" cy="108" r="14" fill="#14b8a6"/>
                <circle cx="398" cy="105" r="3" fill="#1f2937"/>
                <line x1="406" y1="110" x2="478" y2="115" stroke="#1f2937" stroke-width="4" stroke-linecap="round"/>
                <path d="M352 106 L312 66 L368 96 Z" fill="#5eead4" class="anim-wing-flap"/>
                <path d="M328 122 L292 138 L322 136 Z" fill="#0f766e"/>
              </g>
              <rect x="210" y="182" width="300" height="32" rx="16" fill="#ffffff" stroke="#0f766e" stroke-width="1.5"/>
              <text x="360" y="203" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0f766e">Thin beak = Straw for sweet nectar!</text>
            </g>

            <!-- Mode B: Swimming Penguin -->
            <g class="scene-toggle-group mode-b-only">
              <rect x="0" y="0" width="720" height="240" rx="14" fill="#e0f2fe"/>
              <path d="M0 90 Q180 72 360 90 T720 90 L720 240 L0 240 Z" fill="#38bdf8" opacity="0.5"/>
              <!-- Penguin -->
              <g class="anim-float-slow">
                <ellipse cx="320" cy="145" rx="46" ry="26" fill="#1e293b"/>
                <ellipse cx="324" cy="153" rx="32" ry="15" fill="#ffffff"/>
                <circle cx="364" cy="138" r="16" fill="#1e293b"/>
                <circle cx="368" cy="134" r="3.2" fill="#ffffff"/>
                <polygon points="378,136 398,142 378,146" fill="#f97316"/>
                <ellipse cx="320" cy="144" rx="22" ry="9" transform="rotate(24 320 144)" fill="#334155" class="anim-wing-flap"/>
              </g>
              <!-- Little fish -->
              <g class="anim-float-slow">
                <ellipse cx="520" cy="142" rx="18" ry="10" fill="#fbbf24"/>
                <polygon points="536,142 552,132 552,152" fill="#f59e0b"/>
              </g>
              <rect x="190" y="22" width="340" height="32" rx="16" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
              <text x="360" y="43" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0369a1">Flipper wings = Fast ocean swimmer!</text>
            </g>
          </svg>
        `;
      }
    },

    "task-4": {
      badge: "Interactive Picture • Smart Saver Market",
      modes: [
        {
          id: "a",
          label: "1. Shop for Needs First",
          caption: "First, buy healthy Needs like crisp apples and clean water—4 coins spent, 6 shiny coins still left!"
        },
        {
          id: "b",
          label: "2. Drop Coins in Piggy Bank!",
          caption: "Saving leftover coins in a piggy bank helps your money grow every week for a special future goal!"
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg" viewBox="0 0 720 240" role="img" aria-label="Market stall with healthy needs and piggy bank for saving coins">
            <rect x="0" y="0" width="720" height="240" rx="14" fill="#fffbeb"/>
            <rect x="0" y="190" width="720" height="50" fill="#f4efe6"/>

            <!-- Mode A: Market Stall -->
            <g class="scene-toggle-group mode-a-only">
              <rect x="170" y="74" width="380" height="122" rx="12" fill="#ffffff" stroke="#d97706" stroke-width="3"/>
              <path d="M156 78 H564 L544 40 H176 Z" fill="#0f766e"/>
              <text x="360" y="65" text-anchor="middle" font-size="16" font-weight="800" fill="#ffffff">SATURDAY HEALTHY MARKET</text>
              <!-- Apples -->
              <circle cx="245" cy="138" r="18" fill="#ef4444"/>
              <circle cx="282" cy="138" r="18" fill="#dc2626"/>
              <text x="263" y="176" text-anchor="middle" font-size="13" font-weight="800" fill="#991b1b">Apples (Need)</text>
              <!-- Water -->
              <rect x="360" y="112" width="32" height="44" rx="6" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
              <text x="376" y="176" text-anchor="middle" font-size="13" font-weight="800" fill="#0369a1">Water (Need)</text>
              <!-- Coins left badge -->
              <circle cx="482" cy="134" r="24" fill="#fbbf24" stroke="#b45309" stroke-width="2.5" class="anim-pulse-soft"/>
              <text x="482" y="139" text-anchor="middle" font-size="14" font-weight="800" fill="#78350f">10-4=6</text>
            </g>

            <!-- Mode B: Piggy Bank -->
            <g class="scene-toggle-group mode-b-only">
              <!-- Floating coins dropping in -->
              <g class="anim-float-slow">
                <circle cx="360" cy="46" r="16" fill="#fbbf24" stroke="#b45309" stroke-width="2.5"/>
                <text x="360" y="51" text-anchor="middle" font-size="13" font-weight="800" fill="#78350f">$1</text>
              </g>
              <!-- Piggy Bank -->
              <ellipse cx="360" cy="144" rx="82" ry="52" fill="#fda4af" stroke="#e11d48" stroke-width="3"/>
              <rect x="336" y="96" width="48" height="8" rx="4" fill="#9f1239"/>
              <circle cx="412" cy="132" r="5" fill="#1f2937"/>
              <ellipse cx="442" cy="146" rx="14" ry="18" fill="#fb7185" stroke="#e11d48" stroke-width="2.5"/>
              <rect x="312" y="186" width="18" height="22" rx="6" fill="#fb7185"/>
              <rect x="392" y="186" width="18" height="22" rx="6" fill="#fb7185"/>
              <rect x="190" y="14" width="340" height="28" rx="14" fill="#ffffff" stroke="#0f766e" stroke-width="1.5"/>
              <text x="360" y="33" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0f766e">Save a little each week = Big Goals!</text>
            </g>
          </svg>
        `;
      }
    },

    "project-1": {
      badge: "Project Inspiration • Nature Detective",
      modes: [
        {
          id: "a",
          label: "Look Closer",
          caption: "Use your detective eyes to check a leaf's color, veins, smooth or bumpy edges, and size!"
        },
        {
          id: "b",
          label: "Draw & Share",
          caption: "Sketch what you see on the Drawing Pad below and share your findings on your Project Poster."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg" viewBox="0 0 720 200" role="img" aria-label="Magnifying glass inspecting a green leaf">
            <rect x="0" y="0" width="720" height="200" rx="14" fill="#f0fdf4"/>
            <g class="anim-sway-slow" style="transform-origin: 290px 150px;">
              <path d="M260 155 C260 72 330 42 420 42 C420 112 360 155 260 155 Z" fill="#22c55e" stroke="#15803d" stroke-width="3"/>
              <path d="M255 158 L402 56" stroke="#dcfce7" stroke-width="4" stroke-linecap="round"/>
              <path d="M312 118 L302 86 M348 94 L338 66 M336 102 L368 106" stroke="#dcfce7" stroke-width="3" stroke-linecap="round"/>
            </g>
            <g class="scene-toggle-group mode-a-only anim-float-slow">
              <circle cx="366" cy="96" r="36" fill="#ffffff" fill-opacity="0.35" stroke="#0f766e" stroke-width="5"/>
              <line x1="392" y1="122" x2="432" y2="162" stroke="#0f766e" stroke-width="9" stroke-linecap="round"/>
            </g>
            <g class="scene-toggle-group mode-b-only">
              <rect x="466" y="42" width="180" height="114" rx="12" fill="#ffffff" stroke="#d97706" stroke-width="3"/>
              <text x="556" y="72" text-anchor="middle" font-size="14" font-weight="800" fill="#0f766e">MY LEAF POSTER</text>
              <line x1="490" y1="96" x2="622" y2="96" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
              <line x1="490" y1="116" x2="600" y2="116" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
              <line x1="490" y1="136" x2="574" y2="136" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
            </g>
          </svg>
        `;
      }
    },

    "project-2": {
      badge: "Project Inspiration • Cozy Animal Shelter",
      modes: [
        {
          id: "a",
          label: "Sunny Day Hut",
          caption: "Shaded porch, fresh water bowl, and a breezy doorway keep your animal friend cool and happy!"
        },
        {
          id: "b",
          label: "Rainy Day Safe!",
          caption: "A strong triangle roof and raised floor keep cozy bedding dry when raindrops fall outside."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg" viewBox="0 0 720 200" role="img" aria-label="Cozy wooden animal shelter in sun and rain">
            <rect x="0" y="0" width="720" height="200" rx="14" fill="#ecfeff"/>
            <rect x="0" y="160" width="720" height="40" fill="#86efac"/>
            <g class="scene-toggle-group mode-a-only">
              <circle cx="610" cy="44" r="22" fill="#fbbf24" class="anim-pulse-soft"/>
            </g>
            <g class="scene-toggle-group mode-b-only" stroke="#0284c7" stroke-width="3" stroke-linecap="round">
              <line x1="160" y1="24" x2="152" y2="46" class="anim-rain"/>
              <line x1="250" y1="18" x2="242" y2="40" class="anim-rain"/>
              <line x1="480" y1="22" x2="472" y2="44" class="anim-rain"/>
              <line x1="560" y1="30" x2="552" y2="52" class="anim-rain"/>
            </g>
            <!-- Cozy Shelter -->
            <rect x="275" y="92" width="170" height="74" rx="8" fill="#fef3c7" stroke="#92400e" stroke-width="3"/>
            <polygon points="252,96 360,34 468,96" fill="#0f766e" stroke="#115e59" stroke-width="3"/>
            <path d="M332 166 V126 A28 28 0 0 1 388 126 V166 Z" fill="#78350f"/>
            <!-- Cute bunny peeking -->
            <ellipse cx="354" cy="134" rx="4" ry="10" fill="#ffffff"/>
            <ellipse cx="366" cy="134" rx="4" ry="10" fill="#ffffff"/>
            <circle cx="360" cy="148" r="12" fill="#ffffff"/>
            <circle cx="356" cy="146" r="2" fill="#1f2937"/>
            <circle cx="364" cy="146" r="2" fill="#1f2937"/>
          </svg>
        `;
      }
    }
  };

  function renderGarden(container, pct, checkedCount, totalCount) {
    if (!container) return;
    let level = 0;
    let statusTitle = "Ready to Grow!";
    let caption = "Check off your first habit below to wake up your garden!";

    if (pct >= 100) {
      level = 4;
      statusTitle = "Full Rainbow Bloom! (100%)";
      caption = `Amazing job! You finished all ${totalCount} habits today—your garden is blooming with butterflies!`;
    } else if (pct >= 70) {
      level = 3;
      statusTitle = "Flower Buds Opening!";
      caption = `Woohoo! ${checkedCount} of ${totalCount} habits done! Just a little more to reach full bloom!`;
    } else if (pct >= 40) {
      level = 2;
      statusTitle = "Strong Green Leaves!";
      caption = `Nice rhythm! ${checkedCount} of ${totalCount} habits checked—your sunny garden is growing tall!`;
    } else if (checkedCount > 0) {
      level = 1;
      statusTitle = "Tiny Sprout Awake!";
      caption = `Great start! ${checkedCount} of ${totalCount} habits checked—your first little sprout popped out!`;
    }

    container.dataset.level = String(level);
    container.innerHTML = `
      <div class="motion-stage-head">
        <span class="motion-stage-badge">
          <span class="motion-live-dot" aria-hidden="true"></span>
          <span>My Habit Garden • ${statusTitle}</span>
        </span>
        <span class="meta-pill">${checkedCount} / ${totalCount} Habits Done</span>
      </div>
      <svg class="scene-svg" viewBox="0 0 720 190" role="img" aria-label="Living habit garden growing as daily routines are completed">
        <rect x="0" y="0" width="720" height="190" rx="14" fill="#f0f9ff"/>
        <!-- Rainbow (Level 4) -->
        <g class="garden-stage-4" fill="none" stroke-width="8" stroke-linecap="round" opacity="0.72">
          <path d="M160 154 A200 130 0 0 1 560 154" stroke="#fca5a5"/>
          <path d="M174 154 A186 118 0 0 1 546 154" stroke="#fcd34d"/>
          <path d="M188 154 A172 106 0 0 1 532 154" stroke="#6ee7b7"/>
          <path d="M202 154 A158 94 0 0 1 518 154" stroke="#93c5fd"/>
        </g>

        <!-- Sun -->
        <circle cx="628" cy="42" r="24" fill="#fbbf24" class="anim-pulse-soft"/>

        <!-- Ground -->
        <rect x="0" y="150" width="720" height="40" fill="#86efac"/>
        <rect x="0" y="160" width="720" height="30" fill="#92400e"/>

        <!-- Seed mound (Always visible) -->
        <ellipse cx="360" cy="156" rx="34" ry="10" fill="#78350f"/>

        <!-- Level 1: Tiny Sprout -->
        <g class="garden-stage-1 anim-sway-slow" style="transform-origin: 360px 154px;">
          <path d="M360 154 V120" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="348" cy="128" rx="13" ry="7" transform="rotate(-24 348 128)" fill="#22c55e"/>
          <ellipse cx="372" cy="126" rx="13" ry="7" transform="rotate(24 372 126)" fill="#4ade80"/>
        </g>

        <!-- Level 2: Taller Leaves & Side Sprouts -->
        <g class="garden-stage-2">
          <path d="M360 122 V82" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>
          <ellipse cx="336" cy="102" rx="20" ry="10" transform="rotate(-22 336 102)" fill="#22c55e"/>
          <ellipse cx="384" cy="98" rx="20" ry="10" transform="rotate(22 384 98)" fill="#16a34a"/>
          <path d="M230 154 V116" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
          <circle cx="230" cy="112" r="10" fill="#4ade80"/>
          <path d="M490 154 V116" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
          <circle cx="490" cy="112" r="10" fill="#4ade80"/>
        </g>

        <!-- Level 3: Bright Flowers -->
        <g class="garden-stage-3">
          <circle cx="360" cy="70" r="18" fill="#fb7185"/>
          <circle cx="360" cy="70" r="9" fill="#fde047"/>
          <circle cx="230" cy="104" r="14" fill="#fbbf24"/>
          <circle cx="230" cy="104" r="6" fill="#ffffff"/>
          <circle cx="490" cy="104" r="14" fill="#a78bfa"/>
          <circle cx="490" cy="104" r="6" fill="#fef08a"/>
        </g>

        <!-- Level 4: Celebration Butterflies -->
        <g class="garden-stage-4 anim-float-slow">
          <g transform="translate(275, 62)">
            <ellipse cx="-8" cy="0" rx="9" ry="6" fill="#38bdf8"/>
            <ellipse cx="8" cy="0" rx="9" ry="6" fill="#38bdf8"/>
            <line x1="0" y1="-6" x2="0" y2="8" stroke="#1e293b" stroke-width="2.5"/>
          </g>
          <g transform="translate(450, 56)">
            <ellipse cx="-8" cy="0" rx="9" ry="6" fill="#f472b6"/>
            <ellipse cx="8" cy="0" rx="9" ry="6" fill="#f472b6"/>
            <line x1="0" y1="-6" x2="0" y2="8" stroke="#1e293b" stroke-width="2.5"/>
          </g>
        </g>
      </svg>
      <p class="motion-caption">${caption}</p>
    `;
  }

  function renderScene(container, sceneId) {
    if (!container) return;
    const cfg = SCENES[sceneId];
    if (!cfg) {
      container.innerHTML = "";
      return;
    }

    const defaultMode = cfg.modes[0].id;
    container.dataset.scene = sceneId;
    container.dataset.mode = defaultMode;

    const tabsHtml = cfg.modes
      .map((m, idx) => {
        return `<button type="button" class="motion-mode-btn ${idx === 0 ? "is-active" : ""}" data-scene-mode="${m.id}">${m.label}</button>`;
      })
      .join("");

    container.innerHTML = `
      <div class="motion-stage-head">
        <span class="motion-stage-badge">
          <span class="motion-live-dot" aria-hidden="true"></span>
          <span>${cfg.badge}</span>
        </span>
        <div class="motion-mode-tabs">${tabsHtml}</div>
      </div>
      ${cfg.renderSvg()}
      <p class="motion-caption" data-motion-caption>${cfg.modes[0].caption}</p>
    `;

    const captionEl = container.querySelector("[data-motion-caption]");
    container.querySelectorAll(".motion-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const modeId = btn.dataset.sceneMode;
        container.dataset.mode = modeId;
        container.querySelectorAll(".motion-mode-btn").forEach((b) => {
          b.classList.toggle("is-active", b.dataset.sceneMode === modeId);
        });
        const found = cfg.modes.find((m) => m.id === modeId);
        if (found && captionEl) {
          captionEl.textContent = found.caption;
        }
      });
    });
  }

  window.G2_MOTION = {
    renderGarden,
    renderScene
  };
})();
