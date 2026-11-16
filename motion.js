/* Interactive Motion Graphics & Story Scenes for Elfin 5 Reading Materials */

(function () {
  "use strict";

  const SCENES = {
    "mission-1": {
      badge: "Interactive Motion Scene • Dome City Matter & Plants",
      modes: [
        {
          id: "sun",
          label: "Sunlight ON (Healthy Dome)",
          caption: "Sunlight powers green leaves to make food and release fresh oxygen (gas). Liquid water cycles smoothly and plant roots keep the solid soil rich and strong."
        },
        {
          id: "blocked",
          label: "Sunlight BLOCKED (Crisis!)",
          caption: "Dark dome shields block sunlight! Plants wilt and stop making oxygen, CO2 builds up in the air, soil dries and crumbles, and scientists must turn on emergency grow lights & oxygen tanks."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg scene-m1" viewBox="0 0 720 260" role="img" aria-label="Animated futuristic dome city with plants, sunbeams, oxygen bubbles, water cycle, and soil">
            <defs>
              <linearGradient id="m1-sky-day" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#e0f2fe"/>
                <stop offset="100%" stop-color="#f0fdf4"/>
              </linearGradient>
              <linearGradient id="m1-sky-dark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#1e293b"/>
                <stop offset="100%" stop-color="#334155"/>
              </linearGradient>
              <clipPath id="m1-dome-clip">
                <path d="M90 210 A270 185 0 0 1 630 210 Z"/>
              </clipPath>
            </defs>

            <!-- Outer Sky -->
            <rect x="0" y="0" width="720" height="260" rx="14" fill="#f8fafc"/>
            <g class="m1-sky-bright">
              <rect x="0" y="0" width="720" height="260" rx="14" fill="url(#m1-sky-day)"/>
              <circle cx="620" cy="46" r="24" fill="#fbbf24" class="anim-pulse-soft"/>
              <g class="m1-sunbeams" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" opacity="0.55">
                <line x1="590" y1="68" x2="430" y2="165"/>
                <line x1="612" y1="76" x2="505" y2="178"/>
                <line x1="566" y1="54" x2="345" y2="150"/>
              </g>
            </g>

            <g class="m1-sky-night">
              <rect x="0" y="0" width="720" height="260" rx="14" fill="url(#m1-sky-dark)"/>
              <circle cx="110" cy="42" r="2" fill="#cbd5e1"/>
              <circle cx="195" cy="28" r="1.5" fill="#cbd5e1"/>
              <circle cx="645" cy="45" r="2" fill="#cbd5e1"/>
            </g>

            <!-- Dome Base & Glass -->
            <g clip-path="url(#m1-dome-clip)">
              <!-- City Silhouette -->
              <g class="m1-city" fill="#94a3b8" opacity="0.42">
                <rect x="145" y="132" width="28" height="78" rx="3"/>
                <rect x="182" y="112" width="34" height="98" rx="3"/>
                <rect x="498" y="124" width="32" height="86" rx="3"/>
                <rect x="538" y="142" width="26" height="68" rx="3"/>
              </g>

              <!-- Soil Layer (Solid) -->
              <rect class="m1-soil" x="90" y="192" width="540" height="32" fill="#78350f"/>
              <rect class="m1-grass" x="90" y="186" width="540" height="10" fill="#16a34a"/>

              <!-- Liquid Stream / Pond -->
              <path class="m1-water" d="M235 192 Q290 183 345 193 T460 192 L460 214 L235 214 Z" fill="#0ea5e9" opacity="0.82"/>
              <path class="m1-water-ripple" d="M255 198 Q290 194 325 198 M365 199 Q400 195 435 199" stroke="#e0f2fe" stroke-width="2" fill="none" stroke-linecap="round"/>

              <!-- Healthy Plants (swaying) -->
              <g class="m1-plants-healthy">
                <g class="anim-sway-slow" style="transform-origin: 205px 186px;">
                  <path d="M205 186 V142" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>
                  <ellipse cx="191" cy="154" rx="14" ry="8" transform="rotate(-25 191 154)" fill="#22c55e"/>
                  <ellipse cx="219" cy="148" rx="14" ry="8" transform="rotate(25 219 148)" fill="#22c55e"/>
                  <circle cx="205" cy="133" r="11" fill="#4ade80"/>
                </g>
                <g class="anim-sway-med" style="transform-origin: 360px 186px;">
                  <path d="M360 186 V120" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>
                  <circle cx="360" cy="112" r="24" fill="#16a34a"/>
                  <circle cx="342" cy="122" r="16" fill="#22c55e"/>
                  <circle cx="378" cy="122" r="16" fill="#22c55e"/>
                </g>
                <g class="anim-sway-slow" style="transform-origin: 490px 186px;">
                  <path d="M490 186 V144" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>
                  <ellipse cx="476" cy="156" rx="14" ry="8" transform="rotate(-20 476 156)" fill="#22c55e"/>
                  <ellipse cx="504" cy="150" rx="14" ry="8" transform="rotate(20 504 150)" fill="#22c55e"/>
                  <circle cx="490" cy="136" r="10" fill="#86efac"/>
                </g>
              </g>

              <!-- Wilted Plants + Emergency Lab Tech (shown in Blocked mode) -->
              <g class="m1-plants-wilted">
                <g opacity="0.85">
                  <path d="M205 186 Q200 165 186 160" stroke="#713f12" stroke-width="4" fill="none" stroke-linecap="round"/>
                  <ellipse cx="182" cy="166" rx="10" ry="5" fill="#a16207"/>
                  <path d="M360 186 Q372 150 390 156" stroke="#713f12" stroke-width="5" fill="none" stroke-linecap="round"/>
                  <ellipse cx="395" cy="162" rx="14" ry="7" fill="#a16207"/>
                  <path d="M490 186 Q482 166 470 164" stroke="#713f12" stroke-width="4" fill="none" stroke-linecap="round"/>
                </g>
                <!-- Scientist Emergency Algae Oxygen Pod + Grow Lamp -->
                <g class="m1-scientist-tech">
                  <rect x="268" y="138" width="46" height="48" rx="8" fill="#0f766e" stroke="#5eead4" stroke-width="2"/>
                  <rect x="275" y="145" width="32" height="24" rx="4" fill="#14b8a6" class="anim-pulse-soft"/>
                  <text x="291" y="161" text-anchor="middle" font-size="10" font-weight="700" fill="#ffffff">O2 LAB</text>
                  <path d="M291 124 L274 138 H308 Z" fill="#fde047" opacity="0.85"/>
                </g>
              </g>

              <!-- Floating Gas Particles -->
              <g class="m1-o2-bubbles">
                <g class="anim-float-up-1">
                  <circle cx="220" cy="130" r="11" fill="#ccfbf1" stroke="#0d9488" stroke-width="1.5"/>
                  <text x="220" y="134" text-anchor="middle" font-size="9" font-weight="700" fill="#0f766e">O2</text>
                </g>
                <g class="anim-float-up-2">
                  <circle cx="385" cy="105" r="12" fill="#ccfbf1" stroke="#0d9488" stroke-width="1.5"/>
                  <text x="385" y="109" text-anchor="middle" font-size="9" font-weight="700" fill="#0f766e">O2</text>
                </g>
                <g class="anim-float-up-3">
                  <circle cx="505" cy="126" r="11" fill="#ccfbf1" stroke="#0d9488" stroke-width="1.5"/>
                  <text x="505" y="130" text-anchor="middle" font-size="9" font-weight="700" fill="#0f766e">O2</text>
                </g>
              </g>

              <g class="m1-co2-bubbles">
                <g class="anim-float-slow-1">
                  <circle cx="190" cy="105" r="13" fill="#fee2e2" stroke="#e11d48" stroke-width="1.5"/>
                  <text x="190" y="109" text-anchor="middle" font-size="8.5" font-weight="700" fill="#9f1239">CO2</text>
                </g>
                <g class="anim-float-slow-2">
                  <circle cx="345" cy="90" r="14" fill="#fee2e2" stroke="#e11d48" stroke-width="1.5"/>
                  <text x="345" y="94" text-anchor="middle" font-size="8.5" font-weight="700" fill="#9f1239">CO2</text>
                </g>
                <g class="anim-float-slow-3">
                  <circle cx="470" cy="106" r="13" fill="#fee2e2" stroke="#e11d48" stroke-width="1.5"/>
                  <text x="470" y="110" text-anchor="middle" font-size="8.5" font-weight="700" fill="#9f1239">CO2</text>
                </g>
              </g>

              <!-- Dark Shield Curtain -->
              <path class="m1-dark-shield" d="M90 210 A270 185 0 0 1 630 210 Z" fill="#0f172a" opacity="0.34"/>
            </g>

            <!-- Dome Glass Rim & Platform -->
            <path d="M90 210 A270 185 0 0 1 630 210" fill="none" stroke="#0f766e" stroke-width="4"/>
            <rect x="74" y="210" width="572" height="16" rx="8" fill="#334155"/>

            <!-- Matter State Labels -->
            <g font-size="11" font-weight="700" font-family="Plus Jakarta Sans, sans-serif">
              <rect x="108" y="232" width="142" height="22" rx="11" fill="#ffffff" stroke="#cbd5e1"/>
              <text x="179" y="247" text-anchor="middle" fill="#1e293b">Gas: Air (O2 / CO2)</text>
              <rect x="289" y="232" width="142" height="22" rx="11" fill="#ffffff" stroke="#cbd5e1"/>
              <text x="360" y="247" text-anchor="middle" fill="#0369a1">Liquid: Water Flow</text>
              <rect x="470" y="232" width="142" height="22" rx="11" fill="#ffffff" stroke="#cbd5e1"/>
              <text x="541" y="247" text-anchor="middle" fill="#78350f">Solid: Soil &amp; Roots</text>
            </g>
          </svg>
        `;
      }
    },

    "mission-2": {
      badge: "Interactive Motion Scene • Heritage Weather & Architecture",
      modes: [
        {
          id: "desert",
          label: "Desert Heat (Pyramids)",
          caption: "Near the Pyramids of Egypt: light-colored thick eco-walls, shaded pergolas, and solar roofs block scorching heat while keeping ancient desert ruins untouched."
        },
        {
          id: "rain",
          label: "Tropical Heavy Rain (Borobudur)",
          caption: "Near Borobudur in Indonesia: steep upward bamboo & grass roofs shed heavy tropical rain into collection tanks on raised pillars, preventing flooding around temple stones."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg scene-m2" viewBox="0 0 720 260" role="img" aria-label="Animated eco-friendly visitor center protecting an ancient World Heritage monument under heat or heavy rain">
            <defs>
              <linearGradient id="m2-heat-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#fef3c7"/>
                <stop offset="100%" stop-color="#fde68a"/>
              </linearGradient>
              <linearGradient id="m2-rain-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#cbd5e1"/>
                <stop offset="100%" stop-color="#e2e8f0"/>
              </linearGradient>
            </defs>

            <rect class="m2-bg-desert" x="0" y="0" width="720" height="260" rx="14" fill="url(#m2-heat-bg)"/>
            <rect class="m2-bg-rain" x="0" y="0" width="720" height="260" rx="14" fill="url(#m2-rain-bg)"/>

            <!-- Distant Heritage Silhouettes -->
            <g class="m2-desert-scene">
              <circle cx="110" cy="54" r="24" fill="#f59e0b" class="anim-pulse-soft"/>
              <!-- Pyramids -->
              <polygon points="75,204 170,76 265,204" fill="#d97706" opacity="0.88"/>
              <polygon points="170,76 265,204 210,204" fill="#b45309" opacity="0.72"/>
              <polygon points="215,204 282,118 350,204" fill="#f59e0b" opacity="0.85"/>
              <!-- Rising Heat Shimmer -->
              <g class="anim-float-up-1" stroke="#b45309" stroke-width="2" fill="none" opacity="0.45">
                <path d="M90 185 q6 -8 0 -16 t0 -16"/>
                <path d="M290 175 q6 -8 0 -16 t0 -16"/>
              </g>
              <rect x="0" y="204" width="720" height="56" fill="#eab308" opacity="0.35"/>
            </g>

            <g class="m2-rain-scene">
              <!-- Clouds -->
              <g fill="#64748b" opacity="0.85">
                <circle cx="130" cy="48" r="24"/><circle cx="165" cy="44" r="28"/><circle cx="202" cy="50" r="22"/>
                <circle cx="480" cy="44" r="24"/><circle cx="515" cy="40" r="28"/><circle cx="552" cy="46" r="22"/>
              </g>
              <!-- Stepped Temple Silhouette (Borobudur style) -->
              <g fill="#475569" opacity="0.88">
                <rect x="85" y="182" width="180" height="22" rx="2"/>
                <rect x="110" y="160" width="130" height="22" rx="2"/>
                <rect x="135" y="138" width="80" height="22" rx="2"/>
                <path d="M160 138 L175 104 L190 138 Z"/>
              </g>
              <rect x="0" y="204" width="720" height="56" fill="#15803d" opacity="0.28"/>
            </g>

            <!-- Safe Distance Marker -->
            <g>
              <line x1="278" y1="222" x2="380" y2="222" stroke="#0f766e" stroke-width="2" stroke-dasharray="5 4"/>
              <rect x="282" y="226" width="96" height="20" rx="10" fill="#ffffff" stroke="#0f766e"/>
              <text x="330" y="240" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">Safe Buffer Zone</text>
            </g>

            <!-- Eco Visitor Center -->
            <g transform="translate(390, 0)">
              <!-- Raised Eco Pillars (no deep digging!) -->
              <rect x="35" y="186" width="10" height="20" fill="#78350f"/>
              <rect x="125" y="186" width="10" height="20" fill="#78350f"/>
              <rect x="215" y="186" width="10" height="20" fill="#78350f"/>
              <!-- Main Eco Building -->
              <rect x="24" y="124" width="212" height="64" rx="6" fill="#fffbeb" stroke="#92400e" stroke-width="2.5"/>
              <!-- Cool Shaded Windows & Door -->
              <rect x="44" y="142" width="40" height="28" rx="4" fill="#99f6e4" stroke="#0f766e" stroke-width="2"/>
              <rect x="108" y="138" width="38" height="50" rx="4" fill="#0f766e"/>
              <rect x="168" y="142" width="44" height="28" rx="4" fill="#99f6e4" stroke="#0f766e" stroke-width="2"/>

              <!-- Desert Flat Solar Overhang Roof -->
              <g class="m2-roof-desert">
                <rect x="8" y="110" width="244" height="14" rx="5" fill="#0f766e"/>
                <rect x="52" y="96" width="156" height="14" rx="3" fill="#0284c7" stroke="#bae6fd" stroke-width="1.5"/>
                <!-- Cool Breeze Arrows -->
                <path class="anim-slide-right" d="M-20 156 H14 m-6 -5 l6 5 l-6 5" stroke="#0284c7" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path class="anim-slide-right" d="M235 156 H270 m-6 -5 l6 5 l-6 5" stroke="#0284c7" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              </g>

              <!-- Tropical Steep Pointed Upwards Roof + Rain Tank -->
              <g class="m2-roof-rain">
                <polygon points="4,126 130,52 256,126" fill="#b45309" stroke="#78350f" stroke-width="3"/>
                <line x1="130" y1="52" x2="130" y2="126" stroke="#fde68a" stroke-width="2" opacity="0.6"/>
                <!-- Rainwater Barrel -->
                <rect x="248" y="144" width="28" height="44" rx="5" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
                <text x="262" y="170" text-anchor="middle" font-size="8.5" font-weight="700" fill="#ffffff">H2O</text>
              </g>
            </g>

            <!-- Animated Rain Streaks (Rain mode only) -->
            <g class="m2-rain-drops" stroke="#0284c7" stroke-width="2" stroke-linecap="round" opacity="0.65">
              <line class="anim-rain-1" x1="140" y1="60" x2="130" y2="85"/>
              <line class="anim-rain-2" x1="250" y1="50" x2="240" y2="75"/>
              <line class="anim-rain-3" x1="360" y1="65" x2="350" y2="90"/>
              <line class="anim-rain-1" x1="480" y1="45" x2="470" y2="70"/>
              <line class="anim-rain-2" x1="590" y1="60" x2="580" y2="85"/>
              <line class="anim-rain-3" x1="665" y1="52" x2="655" y2="77"/>
            </g>
          </svg>
        `;
      }
    },

    "mission-3": {
      badge: "Interactive Motion Scene • Bird Flight vs. Human Body",
      modes: [
        {
          id: "natural",
          label: "Natural Design (Fly vs. Run)",
          caption: "Birds stay lightweight with hollow bones, feathers, and air sacs that feed nonstop oxygen. Humans have dense bones, strong legs, and a pumping heart built for running on land."
        },
        {
          id: "wings",
          label: "Human + Artificial Wings?",
          caption: "Even with giant strap-on wings, dense human bones are too heavy, chest muscles aren't strong enough to flap against gravity, and two lungs without air sacs cannot supply enough flight oxygen."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg scene-m3" viewBox="0 0 720 260" role="img" aria-label="Animated side-by-side comparison of bird flight anatomy and human land physiology">
            <rect x="0" y="0" width="720" height="260" rx="14" fill="#f0fdfa"/>
            <!-- Divider -->
            <line x1="360" y1="18" x2="360" y2="242" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6 5"/>

            <!-- LEFT: Bird in Flight -->
            <g>
              <rect x="22" y="18" width="170" height="26" rx="13" fill="#ccfbf1"/>
              <text x="107" y="35" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0f766e">BIRD: Built for the Sky</text>

              <!-- Cloud -->
              <g class="anim-float-slow-1" fill="#ffffff" opacity="0.9">
                <circle cx="80" cy="82" r="16"/><circle cx="102" cy="78" r="20"/><circle cx="124" cy="84" r="15"/>
              </g>

              <!-- Animated Bird -->
              <g transform="translate(175, 118)">
                <g class="anim-bird-bob">
                  <!-- Flapping Wings -->
                  <path class="anim-wing-flap" d="M-10 -6 Q-55 -68 -92 -34 Q-52 -12 -18 4 Z" fill="#0f766e"/>
                  <path d="M-24 0 Q0 -14 38 -4 Q54 0 64 6 Q40 14 14 14 Q-16 14 -34 4 Z" fill="#14b8a6"/>
                  <!-- Beak & Eye -->
                  <polygon points="62,2 78,7 62,11" fill="#f59e0b"/>
                  <circle cx="48" cy="3" r="3" fill="#1e293b"/>
                  <!-- Glowing Air Sacs & Hollow Bone Path -->
                  <ellipse cx="4" cy="4" rx="11" ry="6" fill="#fef3c7" class="anim-pulse-soft"/>
                  <circle cx="22" cy="4" r="6" fill="#fb7185" class="anim-heartbeat"/>
                </g>
              </g>

              <!-- Bird Callout Pills -->
              <g font-size="10.5" font-weight="600" fill="#1e293b">
                <rect x="26" y="188" width="144" height="24" rx="8" fill="#ffffff" stroke="#99f6e4"/>
                <text x="98" y="204" text-anchor="middle">Hollow, light bones</text>
                <rect x="182" y="188" width="154" height="24" rx="8" fill="#ffffff" stroke="#99f6e4"/>
                <text x="259" y="204" text-anchor="middle">Air sacs = steady O2</text>
              </g>
            </g>

            <!-- RIGHT: Human Body -->
            <g>
              <rect x="382" y="18" width="190" height="26" rx="13" fill="#fef3c7"/>
              <text x="477" y="35" text-anchor="middle" font-size="11.5" font-weight="700" fill="#92400e">HUMAN: Built for Land</text>

              <!-- Ground Line -->
              <line x1="382" y1="210" x2="695" y2="210" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

              <!-- Human Figure -->
              <g transform="translate(530, 62)">
                <!-- Artificial Wings (Visible only in wings mode) -->
                <g class="m3-fake-wings">
                  <path d="M-8 32 Q-78 4 -105 44 Q-62 56 -12 52 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3"/>
                  <path d="M8 32 Q78 4 105 44 Q62 56 12 52 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3"/>
                  <!-- Gravity Down Arrows -->
                  <g class="anim-gravity-pull" stroke="#be123c" stroke-width="3" stroke-linecap="round" fill="none">
                    <line x1="-58" y1="68" x2="-58" y2="104"/>
                    <path d="M-65 96 l7 8 l7 -8"/>
                    <line x1="58" y1="68" x2="58" y2="104"/>
                    <path d="M51 96 l7 8 l7 -8"/>
                  </g>
                </g>

                <!-- Head & Torso -->
                <circle cx="0" cy="14" r="14" fill="#fde68a" stroke="#92400e" stroke-width="2"/>
                <rect x="-18" y="30" width="36" height="58" rx="12" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>

                <!-- Lungs & Heart Inside Chest -->
                <ellipse cx="-8" cy="48" rx="6" ry="10" fill="#fda4af" class="anim-lung-breathe"/>
                <ellipse cx="8" cy="48" rx="6" ry="10" fill="#fda4af" class="anim-lung-breathe"/>
                <circle cx="0" cy="52" r="6" fill="#e11d48" class="anim-heartbeat"/>

                <!-- Dense Legs -->
                <line x1="-9" y1="88" x2="-18" y2="146" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
                <line x1="9" y1="88" x2="22" y2="146" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
              </g>

              <!-- Human Callouts -->
              <g font-size="10.5" font-weight="600">
                <rect x="382" y="218" width="150" height="24" rx="8" fill="#ffffff" stroke="#fde68a"/>
                <text x="457" y="234" text-anchor="middle" fill="#92400e">Dense, heavy bones</text>
                <rect x="542" y="218" width="158" height="24" rx="8" fill="#ffffff" stroke="#fde68a"/>
                <text x="621" y="234" text-anchor="middle" fill="#be123c" class="m3-label-natural">Heart pumps to strong legs</text>
                <text x="621" y="234" text-anchor="middle" fill="#be123c" class="m3-label-wings">Too heavy to lift off!</text>
              </g>
            </g>
          </svg>
        `;
      }
    },

    "mission-4": {
      badge: "Interactive Motion Scene • Barter Friction vs. Modern Money",
      modes: [
        {
          id: "barter",
          label: "Barter Ban Day (Hard!)",
          caption: "Without coins or cards, you must haul heavy items like sacks of grain or cows and hunt for someone who actually wants them. Even buying one pencil is messy!"
        },
        {
          id: "money",
          label: "Modern Money (Efficient!)",
          caption: "Money evolved from shells and holed metal coins to light paper bills and credit cards—making buying food, clothes, and school supplies quick, fair, and easy to save in a bank."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg scene-m4" viewBox="0 0 720 260" role="img" aria-label="Animated comparison between heavy uneven barter trading and smooth modern money">
            <rect x="0" y="0" width="720" height="260" rx="14" fill="#fffbeb"/>

            <!-- BARTER MODE -->
            <g class="m4-barter-view">
              <!-- Tilting Balance Scale -->
              <g transform="translate(185, 130)">
                <line x1="0" y1="-55" x2="0" y2="68" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
                <rect x="-42" y="64" width="84" height="10" rx="5" fill="#78350f"/>
                <g class="anim-scale-rock" style="transform-origin: 0px -44px;">
                  <line x1="-105" y1="-44" x2="105" y2="-44" stroke="#b45309" stroke-width="5" stroke-linecap="round"/>
                  <!-- Left Heavy Sack -->
                  <line x1="-105" y1="-44" x2="-105" y2="-8" stroke="#92400e" stroke-width="2"/>
                  <ellipse cx="-105" cy="10" rx="34" ry="22" fill="#d97706"/>
                  <text x="-105" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="#ffffff">HEAVY GRAIN</text>
                  <!-- Right Tiny Pencil -->
                  <line x1="105" y1="-44" x2="105" y2="-8" stroke="#92400e" stroke-width="2"/>
                  <rect x="76" y="-8" width="58" height="12" rx="4" fill="#fde047" stroke="#ca8a04"/>
                  <text x="105" y="1" text-anchor="middle" font-size="8.5" font-weight="700" fill="#713f12">1 Pencil?</text>
                </g>
              </g>

              <!-- 3 Shopkeeper Stalls Rejecting / Confused -->
              <g transform="translate(380, 36)">
                <rect x="0" y="0" width="305" height="186" rx="14" fill="#ffffff" stroke="#fde68a" stroke-width="2"/>
                <text x="152" y="26" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">Trying to Trade Around Town</text>

                <g transform="translate(18, 46)">
                  <rect x="0" y="0" width="268" height="36" rx="10" fill="#fff1f2" stroke="#fda4af"/>
                  <text x="14" y="22" font-size="11" font-weight="700" fill="#9f1239">Bakery: "No thanks, I don't need old books!"</text>
                </g>
                <g transform="translate(18, 92)">
                  <rect x="0" y="0" width="268" height="36" rx="10" fill="#fff1f2" stroke="#fda4af"/>
                  <text x="14" y="22" font-size="11" font-weight="700" fill="#9f1239">Clothes Shop: "You can't split half a cow!"</text>
                </g>
                <g transform="translate(18, 138)">
                  <rect x="0" y="0" width="268" height="36" rx="10" fill="#fef3c7" stroke="#fcd34d"/>
                  <text x="14" y="22" font-size="11" font-weight="700" fill="#92400e">School Store: Still searching for a fair swap...</text>
                </g>
              </g>
            </g>

            <!-- MODERN MONEY MODE -->
            <g class="m4-money-view">
              <text x="360" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#0f766e">Evolution of Fast, Light Money</text>

              <!-- Flowing Timeline Connector -->
              <path d="M90 105 H630" stroke="#5eead4" stroke-width="4" stroke-dasharray="10 6" class="anim-dash-flow"/>

              <!-- Step 1: Seashell -->
              <g transform="translate(95, 105)">
                <g class="anim-float-slow-1">
                  <circle r="30" fill="#ffffff" stroke="#fcd34d" stroke-width="2.5"/>
                  <path d="M-12 8 Q0 -16 12 8 Z" fill="#f59e0b"/>
                  <text x="0" y="48" text-anchor="middle" font-size="10.5" font-weight="700" fill="#78350f">Seashells</text>
                </g>
              </g>

              <!-- Step 2: Chinese Coin with Hole -->
              <g transform="translate(265, 105)">
                <g class="anim-float-slow-2">
                  <circle r="30" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
                  <rect x="-8" y="-8" width="16" height="16" fill="#fffbeb" stroke="#ca8a04" stroke-width="2"/>
                  <text x="0" y="48" text-anchor="middle" font-size="10.5" font-weight="700" fill="#78350f">Metal Coins</text>
                </g>
              </g>

              <!-- Step 3: Paper Bill (1024) -->
              <g transform="translate(445, 105)">
                <g class="anim-float-slow-3">
                  <rect x="-36" y="-22" width="72" height="44" rx="7" fill="#d1fae5" stroke="#059669" stroke-width="2.5"/>
                  <circle cx="0" cy="0" r="10" fill="#059669" opacity="0.25"/>
                  <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="700" fill="#065f46">$10</text>
                  <text x="0" y="48" text-anchor="middle" font-size="10.5" font-weight="700" fill="#065f46">Paper Money</text>
                </g>
              </g>

              <!-- Step 4: Credit Card / Bank -->
              <g transform="translate(615, 105)">
                <g class="anim-pulse-soft">
                  <rect x="-36" y="-22" width="72" height="44" rx="7" fill="#0f766e"/>
                  <rect x="-26" y="-10" width="18" height="12" rx="2" fill="#fde047"/>
                  <line x1="-26" y1="12" x2="20" y2="12" stroke="#99f6e4" stroke-width="3" stroke-linecap="round"/>
                  <text x="0" y="48" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f766e">Card &amp; Bank</text>
                </g>
              </g>

              <!-- Smooth Shop Checkout Pills -->
              <g transform="translate(115, 188)" font-size="11" font-weight="700" fill="#065f46">
                <rect x="0" y="0" width="145" height="32" rx="10" fill="#d1fae5" stroke="#34d399"/>
                <text x="72" y="20" text-anchor="middle">Food: Paid in seconds</text>
                <rect x="172" y="0" width="145" height="32" rx="10" fill="#d1fae5" stroke="#34d399"/>
                <text x="244" y="20" text-anchor="middle">Clothes: Exact change</text>
                <rect x="344" y="0" width="155" height="32" rx="10" fill="#d1fae5" stroke="#34d399"/>
                <text x="421" y="20" text-anchor="middle">Save for big goals</text>
              </g>
            </g>
          </svg>
        `;
      }
    },

    "mission-5": {
      badge: "Interactive Motion Scene • Respiratory Defense Team",
      modes: [
        {
          id: "battle",
          label: "Inside Body Battle",
          caption: "Tiny viruses enter through the nose and throat toward the lungs. Your heart pumps faster so defender blood cells are carried through blood vessels to fight the germs!"
        },
        {
          id: "shield",
          label: "With Mask & Hygiene Shield",
          caption: "Good habits outside—wearing a mask, frequent handwashing with soap, and keeping a safe distance—block most viruses before they even enter your airway."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg scene-m5" viewBox="0 0 720 260" role="img" aria-label="Animated cross-section of respiratory airway, lungs, heart, blood vessels, and hygiene mask shield">
            <rect x="0" y="0" width="720" height="260" rx="14" fill="#f8fafc"/>

            <!-- Left Entry Zone: Airway & Mask Shield -->
            <g transform="translate(26, 20)">
              <rect x="0" y="0" width="210" height="220" rx="14" fill="#fff1f2" stroke="#fecdd3" stroke-width="1.5"/>
              <text x="105" y="24" text-anchor="middle" font-size="11.5" font-weight="700" fill="#9f1239">1. Airway Entry</text>

              <!-- Head Profile & Throat Tube -->
              <path d="M126 56 C100 56 88 78 96 102 L98 118 C98 128 114 134 128 134 L128 198 L158 198 L158 120 C172 108 176 70 148 56 Z" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
              <path d="M104 94 H140 V198" fill="none" stroke="#be123c" stroke-width="10" stroke-linecap="round" opacity="0.32"/>

              <!-- Mask + Soap Shield (Shown in shield mode) -->
              <g class="m5-hygiene-shield">
                <path d="M78 80 Q106 94 114 114 Q88 122 72 104 Z" fill="#ccfbf1" stroke="#0f766e" stroke-width="2.5"/>
                <circle cx="48" cy="70" r="8" fill="#bae6fd" stroke="#0284c7" class="anim-float-up-1"/>
                <circle cx="56" cy="128" r="6" fill="#bae6fd" stroke="#0284c7" class="anim-float-up-2"/>
                <text x="105" y="210" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">Mask &amp; Soap Block Germs!</text>
              </g>

              <!-- Incoming Viruses -->
              <g class="m5-viruses-unblocked">
                <g class="anim-virus-enter-1">
                  <circle cx="38" cy="94" r="7" fill="#e11d48"/>
                  <circle cx="38" cy="94" r="10" fill="none" stroke="#e11d48" stroke-width="2" stroke-dasharray="2 3"/>
                </g>
                <g class="anim-virus-enter-2">
                  <circle cx="58" cy="108" r="6" fill="#e11d48"/>
                  <circle cx="58" cy="108" r="9" fill="none" stroke="#e11d48" stroke-width="2" stroke-dasharray="2 3"/>
                </g>
              </g>

              <g class="m5-viruses-blocked">
                <g class="anim-bounce-back">
                  <circle cx="44" cy="96" r="7" fill="#e11d48"/>
                  <line x1="56" y1="86" x2="66" y2="106" stroke="#0f766e" stroke-width="2.5" stroke-linecap="round"/>
                </g>
              </g>
            </g>

            <!-- Connection Arrow -->
            <path d="M244 130 H282 m-6 -6 l8 6 l-8 6" stroke="#0f766e" stroke-width="3" fill="none" stroke-linecap="round"/>

            <!-- Right Zone: Lungs, Heart & Blood Vessels Defense -->
            <g transform="translate(290, 20)">
              <rect x="0" y="0" width="404" height="220" rx="14" fill="#f0fdfa" stroke="#99f6e4" stroke-width="1.5"/>
              <text x="202" y="24" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0f766e">2. Inside Defense Team: Lungs + Heart + Blood Vessels</text>

              <!-- Trachea & Lungs -->
              <line x1="120" y1="54" x2="120" y2="92" stroke="#0f766e" stroke-width="7" stroke-linecap="round"/>
              <path d="M120 92 L92 110 M120 92 L148 110" stroke="#0f766e" stroke-width="5" stroke-linecap="round"/>
              <g class="anim-lung-breathe" style="transform-origin: 120px 132px;">
                <ellipse cx="86" cy="134" rx="28" ry="44" fill="#fda4af" stroke="#e11d48" stroke-width="2"/>
                <ellipse cx="154" cy="134" rx="28" ry="44" fill="#fda4af" stroke="#e11d48" stroke-width="2"/>
              </g>

              <!-- Blood Vessel Loop (Heart -> Lungs) -->
              <path d="M292 132 C265 70 198 76 164 114" fill="none" stroke="#e11d48" stroke-width="5" stroke-dasharray="10 8" class="anim-dash-flow"/>
              <path d="M164 152 C200 186 265 186 292 146" fill="none" stroke="#0284c7" stroke-width="5" stroke-dasharray="10 8" class="anim-dash-flow"/>

              <!-- Pumping Heart -->
              <g transform="translate(314, 134)">
                <g class="anim-heartbeat">
                  <path d="M0 -14 C-14 -30 -34 -16 -34 2 C-34 20 0 36 0 36 C0 36 34 20 34 2 C34 -16 14 -30 0 -14 Z" fill="#e11d48"/>
                  <text x="0" y="6" text-anchor="middle" font-size="10" font-weight="700" fill="#ffffff">HEART</text>
                </g>
              </g>

              <!-- Defender White Cell & Oxygen Badges -->
              <g font-size="9.5" font-weight="700">
                <rect x="178" y="54" width="112" height="22" rx="11" fill="#ffffff" stroke="#e11d48"/>
                <text x="234" y="69" text-anchor="middle" fill="#be123c">Defender cells sent</text>
                <rect x="178" y="182" width="112" height="22" rx="11" fill="#ffffff" stroke="#0284c7"/>
                <text x="234" y="197" text-anchor="middle" fill="#0369a1">O2 carried in blood</text>
              </g>
            </g>
          </svg>
        `;
      }
    },

    "mission-6": {
      badge: "Interactive Motion Scene • Rainforest Highway Debate",
      modes: [
        {
          id: "highway",
          label: "Highway Through Forest",
          caption: "Cutting a major highway straight through Sumatra's rainforest splits habitats apart, endangers rare animals, harms natural beauty, and puts the site at risk on UNESCO's 'In Danger' list."
        },
        {
          id: "bypass",
          label: "Smart Edge Bypass",
          caption: "Building trade roads around the outer border protects endangered wildlife, preserves unbroken rainforest beauty, and lets trees keep producing oxygen for the entire planet!"
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg scene-m6" viewBox="0 0 720 260" role="img" aria-label="Animated tropical rainforest showing habitat impact of a center highway versus an outer bypass road">
            <defs>
              <linearGradient id="m6-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#dcfce7"/>
                <stop offset="100%" stop-color="#f0fdf4"/>
              </linearGradient>
            </defs>

            <rect x="0" y="0" width="720" height="260" rx="14" fill="url(#m6-sky)"/>

            <!-- Rainforest Canopy Background -->
            <path d="M0 175 Q140 135 280 165 T560 155 T720 172 L720 260 L0 260 Z" fill="#86efac" opacity="0.6"/>
            <path d="M0 198 Q180 172 360 194 T720 186 L720 260 L0 260 Z" fill="#4ade80" opacity="0.5"/>

            <!-- Left Forest Cluster -->
            <g class="anim-sway-slow" style="transform-origin: 120px 185px;">
              <rect x="114" y="128" width="12" height="58" fill="#78350f"/>
              <circle cx="120" cy="112" r="34" fill="#15803d"/>
              <circle cx="94" cy="126" r="24" fill="#16a34a"/>
              <circle cx="146" cy="124" r="24" fill="#22c55e"/>
            </g>
            <g class="anim-sway-med" style="transform-origin: 215px 190px;">
              <rect x="210" y="142" width="10" height="48" fill="#78350f"/>
              <circle cx="215" cy="128" r="26" fill="#16a34a"/>
            </g>

            <!-- Right Forest Cluster -->
            <g class="anim-sway-slow" style="transform-origin: 585px 185px;">
              <rect x="579" y="126" width="12" height="60" fill="#78350f"/>
              <circle cx="585" cy="110" r="34" fill="#15803d"/>
              <circle cx="558" cy="124" r="24" fill="#16a34a"/>
              <circle cx="612" cy="122" r="24" fill="#22c55e"/>
            </g>
            <g class="anim-sway-med" style="transform-origin: 490px 190px;">
              <rect x="485" y="142" width="10" height="48" fill="#78350f"/>
              <circle cx="490" cy="128" r="26" fill="#16a34a"/>
            </g>

            <!-- Center Forest Trees (Visible in Bypass mode, cut down in Highway mode!) -->
            <g class="m6-center-forest">
              <g class="anim-sway-slow" style="transform-origin: 356px 190px;">
                <rect x="349" y="114" width="14" height="76" fill="#78350f"/>
                <circle cx="356" cy="96" r="40" fill="#15803d"/>
                <circle cx="322" cy="114" r="26" fill="#16a34a"/>
                <circle cx="390" cy="114" r="26" fill="#22c55e"/>
              </g>
              <!-- Wildlife Corridor Path + Gliding Bird -->
              <path d="M165 204 Q360 184 540 204" fill="none" stroke="#fde047" stroke-width="3" stroke-dasharray="6 5"/>
              <path class="anim-bird-glide" d="M270 68 Q284 54 298 68 Q312 54 326 68" fill="none" stroke="#0f766e" stroke-width="3" stroke-linecap="round"/>
              <!-- O2 Sparkles -->
              <g class="anim-float-up-1">
                <circle cx="356" cy="48" r="11" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
                <text x="356" y="52" text-anchor="middle" font-size="9" font-weight="700" fill="#0f766e">O2</text>
              </g>
            </g>

            <!-- Center Highway Cut (Visible in Highway mode) -->
            <g class="m6-center-road">
              <!-- Asphalt Strip -->
              <polygon points="315,155 405,155 445,256 275,256" fill="#334155"/>
              <line x1="360" y1="162" x2="360" y2="252" stroke="#fde047" stroke-width="3" stroke-dasharray="10 8"/>
              <!-- Moving Truck -->
              <g class="anim-truck-drive">
                <rect x="336" y="184" width="48" height="24" rx="5" fill="#f97316"/>
                <rect x="344" y="188" width="16" height="10" rx="2" fill="#e0f2fe"/>
                <circle cx="346" cy="210" r="4.5" fill="#0f172a"/>
                <circle cx="374" cy="210" r="4.5" fill="#0f172a"/>
              </g>
              <!-- Warning Badge -->
              <g class="anim-pulse-soft">
                <rect x="255" y="42" width="210" height="30" rx="15" fill="#ffe4e6" stroke="#e11d48" stroke-width="2"/>
                <text x="360" y="61" text-anchor="middle" font-size="11" font-weight="700" fill="#9f1239">UNESCO Alert: Habitat Split!</text>
              </g>
            </g>

            <!-- Outer Smart Bypass Road (Visible in Bypass mode) -->
            <g class="m6-bypass-road">
              <path d="M24 236 Q360 226 696 236" fill="none" stroke="#475569" stroke-width="14" stroke-linecap="round"/>
              <path d="M24 236 Q360 226 696 236" fill="none" stroke="#fde047" stroke-width="2" stroke-dasharray="8 8"/>
              <rect x="242" y="220" width="236" height="24" rx="12" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
              <text x="360" y="236" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f766e">Bypass Road Outside + Safe Forest Inside</text>
            </g>
          </svg>
        `;
      }
    }
  };

  let sectionObserver = null;

  function renderMotionStage(missionId, containerEl) {
    if (!containerEl) return;
    const scene = SCENES[missionId];
    if (!scene) {
      containerEl.innerHTML = "";
      containerEl.classList.add("hidden");
      return;
    }

    containerEl.classList.remove("hidden");
    let activeMode = scene.modes[0].id;

    function updateMode(modeId) {
      activeMode = modeId;
      containerEl.setAttribute("data-scene", missionId);
      containerEl.setAttribute("data-mode", activeMode);

      containerEl.querySelectorAll(".motion-mode-btn").forEach((btn) => {
        const isCurrent = btn.dataset.mode === activeMode;
        btn.classList.toggle("is-active", isCurrent);
        btn.setAttribute("aria-pressed", String(isCurrent));
      });

      const modeObj = scene.modes.find((m) => m.id === activeMode) || scene.modes[0];
      const captionEl = containerEl.querySelector(".motion-caption");
      if (captionEl) {
        captionEl.textContent = modeObj.caption;
      }
    }

    const buttonsHtml = scene.modes
      .map(
        (m, idx) => `
          <button type="button" class="motion-mode-btn ${idx === 0 ? "is-active" : ""}" data-mode="${m.id}" aria-pressed="${idx === 0}">
            ${m.label}
          </button>
        `
      )
      .join("");

    containerEl.innerHTML = `
      <div class="motion-stage-head">
        <div class="motion-stage-title">
          <span class="motion-live-dot" aria-hidden="true"></span>
          <span>${scene.badge}</span>
        </div>
        <div class="motion-mode-group" role="group" aria-label="Change story visual scene">
          ${buttonsHtml}
        </div>
      </div>
      <div class="motion-canvas-wrap">
        ${scene.renderSvg()}
      </div>
      <p class="motion-caption"></p>
    `;

    containerEl.querySelectorAll(".motion-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => updateMode(btn.dataset.mode));
    });

    updateMode(activeMode);
  }

  function observeReadingReveals(rootEl) {
    if (!rootEl) return;
    const targets = Array.from(rootEl.querySelectorAll(".reading-section-block"));
    if (!targets.length) return;

    if (sectionObserver) {
      sectionObserver.disconnect();
    }

    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    targets.forEach((el, idx) => {
      el.classList.add("reveal-ready");
      el.style.transitionDelay = `${Math.min(idx * 65, 220)}ms`;
    });

    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    targets.forEach((el) => sectionObserver.observe(el));
  }

  window.ElfinMotion = {
    renderMotionStage: renderMotionStage,
    observeReadingReveals: observeReadingReveals
  };
})();
