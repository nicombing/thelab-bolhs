/* Interactive Motion Graphics & Visual Diagrams for IPS Kelas 7 Reading Materials */

(function () {
  "use strict";

  const SCENES = {
    "ips7-mission-1": {
      badge: "Visual Interaktif • Dinamika Sosial & Akulturasi Budaya",
      modes: [
        {
          id: "teknologi",
          label: "Perubahan Teknologi & Difusi",
          caption: "Teknologi terus bergerak dinamis—dari TV tabung hitam-putih menuju Smart TV jernih—mempercepat difusi unsur budaya dan interaksi manusia."
        },
        {
          id: "budaya",
          label: "Akulturasi vs Asimilasi",
          caption: "Akulturasi memadukan dua budaya dengan tetap menjaga ciri asli (seperti Masjid Menara Kudus), sedangkan asimilasi melebur hingga ciri asli hilang membentuk budaya baru."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg scene-ips1" viewBox="0 0 720 260" role="img" aria-label="Diagram interaktif perubahan teknologi dan perbandingan akulturasi serta asimilasi budaya">
            <rect x="0" y="0" width="720" height="260" rx="14" fill="#f8fafc"/>

            <!-- MODE 1: Teknologi & Difusi -->
            <g class="ips1-tech-view">
              <rect x="26" y="20" width="668" height="220" rx="14" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5"/>
              <text x="360" y="46" text-anchor="middle" font-size="13" font-weight="700" fill="#92400e">Perubahan Alat Penunjang Kehidupan &amp; Difusi Budaya</text>

              <!-- Old CRT TV -->
              <g transform="translate(135, 130)">
                <rect x="-56" y="-44" width="112" height="84" rx="12" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
                <rect x="-44" y="-32" width="68" height="58" rx="8" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
                <line x1="-18" y1="-44" x2="-34" y2="-66" stroke="#451a03" stroke-width="3" stroke-linecap="round"/>
                <line x1="12" y1="-44" x2="28" y2="-66" stroke="#451a03" stroke-width="3" stroke-linecap="round"/>
                <circle cx="38" cy="-16" r="6" fill="#d97706"/>
                <circle cx="38" cy="4" r="6" fill="#d97706"/>
                <text x="-10" y="2" text-anchor="middle" font-size="10" font-weight="700" fill="#334155">TV Tabung</text>
                <text x="0" y="62" text-anchor="middle" font-size="11" font-weight="700" fill="#78350f">Masa Lalu (Hitam-Putih)</text>
              </g>

              <!-- Animated Transition Flow -->
              <g>
                <path d="M225 130 H455" stroke="#0f766e" stroke-width="4" stroke-dasharray="10 7" class="anim-dash-flow"/>
                <polygon points="452,122 470,130 452,138" fill="#0f766e"/>
                <g class="anim-pulse-soft">
                  <rect x="275" y="92" width="134" height="26" rx="13" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
                  <text x="342" y="109" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f766e">Dinamis + Interaksi</text>
                </g>
                <text x="342" y="156" text-anchor="middle" font-size="10" font-weight="600" fill="#475569">Faktor Internal &amp; Eksternal</text>
              </g>

              <!-- Modern Smart TV + Diffusion Waves -->
              <g transform="translate(565, 128)">
                <rect x="-70" y="-44" width="140" height="82" rx="8" fill="#0f172a" stroke="#0f766e" stroke-width="3"/>
                <rect x="-62" y="-36" width="124" height="66" rx="4" fill="#ccfbf1"/>
                <rect x="-24" y="38" width="48" height="8" rx="3" fill="#334155"/>
                <circle cx="0" cy="-3" r="16" fill="#0f766e" opacity="0.2" class="anim-pulse-soft"/>
                <text x="0" y="-6" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f766e">Smart TV</text>
                <text x="0" y="9" text-anchor="middle" font-size="9" font-weight="600" fill="#0f766e">Terhubung Internet</text>
                <text x="0" y="64" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">Masa Kini (Difusi Global)</text>
              </g>
            </g>

            <!-- MODE 2: Akulturasi vs Asimilasi -->
            <g class="ips1-culture-view">
              <!-- Left: Akulturasi -->
              <g transform="translate(24, 20)">
                <rect x="0" y="0" width="324" height="220" rx="14" fill="#ecfdf5" stroke="#5eead4" stroke-width="1.5"/>
                <text x="162" y="28" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0f766e">AKULTURASI (Unsur Asli Tetap Ada)</text>

                <g class="anim-float-slow-1">
                  <circle cx="88" cy="86" r="28" fill="#fde68a" stroke="#d97706" stroke-width="2.5"/>
                  <text x="88" y="90" text-anchor="middle" font-size="10.5" font-weight="700" fill="#92400e">Budaya A</text>
                </g>
                <text x="162" y="91" text-anchor="middle" font-size="18" font-weight="800" fill="#0f766e">+</text>
                <g class="anim-float-slow-2">
                  <rect x="208" y="58" width="56" height="56" rx="10" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5"/>
                  <text x="236" y="90" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0369a1">Budaya B</text>
                </g>

                <path d="M162 120 v16" stroke="#0f766e" stroke-width="2.5"/>
                <!-- Blended shape preserving both circle + square -->
                <rect x="82" y="142" width="160" height="44" rx="12" fill="#ffffff" stroke="#0f766e" stroke-width="2"/>
                <circle cx="110" cy="164" r="12" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
                <rect x="132" y="152" width="24" height="24" rx="4" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
                <text x="200" y="160" text-anchor="middle" font-size="9.5" font-weight="700" fill="#0f766e">Menara Kudus</text>
                <text x="200" y="173" text-anchor="middle" font-size="9" font-weight="600" fill="#475569">Cheng-Ho</text>
                <text x="162" y="206" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">A + B berpadu, ciri lama masih terlihat</text>
              </g>

              <!-- Right: Asimilasi -->
              <g transform="translate(372, 20)">
                <rect x="0" y="0" width="324" height="220" rx="14" fill="#fff1f2" stroke="#fda4af" stroke-width="1.5"/>
                <text x="162" y="28" text-anchor="middle" font-size="12.5" font-weight="700" fill="#9f1239">ASIMILASI (Melebur Jadi Baru)</text>

                <g class="anim-float-slow-2">
                  <circle cx="88" cy="86" r="28" fill="#fde68a" stroke="#d97706" stroke-width="2.5"/>
                  <text x="88" y="90" text-anchor="middle" font-size="10.5" font-weight="700" fill="#92400e">Budaya A</text>
                </g>
                <text x="162" y="91" text-anchor="middle" font-size="18" font-weight="800" fill="#be123c">+</text>
                <g class="anim-float-slow-1">
                  <rect x="208" y="58" width="56" height="56" rx="10" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5"/>
                  <text x="236" y="90" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0369a1">Budaya B</text>
                </g>

                <path d="M162 120 v16" stroke="#be123c" stroke-width="2.5"/>
                <!-- Completely new polygon C -->
                <g class="anim-pulse-soft">
                  <polygon points="162,138 228,164 162,190 96,164" fill="#e11d48" stroke="#9f1239" stroke-width="2"/>
                  <text x="162" y="168" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">Budaya Baru C</text>
                </g>
                <text x="162" y="206" text-anchor="middle" font-size="10" font-weight="700" fill="#9f1239">Ciri khas lama hilang, lahir bentuk baru</text>
              </g>
            </g>
          </svg>
        `;
      }
    },

    "ips7-mission-2": {
      badge: "Visual Interaktif • Pelestarian Udara, Air & Tanah",
      modes: [
        {
          id: "tercemar",
          label: "Lingkungan Tercemar (Risiko)",
          caption: "Emisi kendaraan & asap sampah mencemari udara; limbah detergen memicu eutrofikasi (blooming algae) yang menghabiskan oksigen sungai; plastik & kimia merusak unsur hara tanah."
        },
        {
          id: "lestari",
          label: "Lingkungan Lestari (Solusi)",
          caption: "Kendaraan listrik & pohon menyegarkan udara; sumur resapan & Prokasih memulihkan air bersih; barang reusable, pupuk organik, dan bakteri bioremediasi menyehatkan tanah."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg scene-ips2" viewBox="0 0 720 260" role="img" aria-label="Perbandingan ekosistem udara, air, dan tanah yang tercemar versus dipulihkan dengan sumur resapan dan bioremediasi">
            <rect x="0" y="0" width="720" height="260" rx="14" fill="#f8fafc"/>

            <!-- Background Sky -->
            <rect class="ips2-sky-bad" x="0" y="0" width="720" height="145" rx="14" fill="#e2e8f0"/>
            <rect class="ips2-sky-good" x="0" y="0" width="720" height="145" rx="14" fill="#e0f2fe"/>

            <!-- Ground / Soil Layer -->
            <rect x="0" y="145" width="720" height="115" fill="#78350f"/>
            <rect class="ips2-grass-bad" x="0" y="138" width="720" height="12" fill="#a16207"/>
            <rect class="ips2-grass-good" x="0" y="138" width="720" height="12" fill="#16a34a"/>

            <!-- River Section (Center-Right) -->
            <path d="M295 145 Q395 138 495 146 T720 145 L720 220 L295 220 Z" fill="#0284c7" opacity="0.85"/>

            <!-- POLLUTED LAYER -->
            <g class="ips2-bad-layer">
              <!-- Smoke / Fossil Emissions -->
              <g class="anim-float-up-1" fill="#64748b" opacity="0.72">
                <circle cx="95" cy="78" r="18"/><circle cx="122" cy="68" r="22"/><circle cx="152" cy="76" r="16"/>
              </g>
              <rect x="42" y="112" width="120" height="28" rx="6" fill="#475569"/>
              <text x="102" y="130" text-anchor="middle" font-size="9.5" font-weight="700" fill="#ffffff">Asap &amp; Emisi Fosil</text>

              <!-- Blooming Algae (Eutrophication) -->
              <ellipse cx="470" cy="152" rx="135" ry="12" fill="#65a30d"/>
              <ellipse cx="560" cy="158" rx="95" ry="9" fill="#84cc16"/>
              <rect x="405" y="168" width="175" height="24" rx="12" fill="#fff1f2" stroke="#e11d48"/>
              <text x="492" y="184" text-anchor="middle" font-size="9.5" font-weight="700" fill="#9f1239">Eutrofikasi (O2 Rendah!)</text>

              <!-- Plastic & Chemical Pollution in Soil -->
              <rect x="52" y="170" width="26" height="18" rx="3" fill="#f43f5e" transform="rotate(-12 65 179)"/>
              <rect x="112" y="182" width="24" height="14" rx="3" fill="#fbbf24" transform="rotate(14 124 189)"/>
              <text x="115" y="218" text-anchor="middle" font-size="10" font-weight="700" fill="#fef3c7">Tanah Rusak &amp; Plastik</text>
            </g>

            <!-- SUSTAINABLE SOLUTION LAYER -->
            <g class="ips2-good-layer">
              <!-- Trees & Oxygen -->
              <g class="anim-sway-slow" style="transform-origin: 76px 138px;">
                <rect x="71" y="92" width="10" height="46" fill="#78350f"/>
                <circle cx="76" cy="76" r="24" fill="#16a34a"/>
                <circle cx="58" cy="88" r="16" fill="#22c55e"/>
                <circle cx="94" cy="88" r="16" fill="#22c55e"/>
              </g>
              <g class="anim-float-up-2">
                <circle cx="118" cy="54" r="12" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
                <text x="118" y="58" text-anchor="middle" font-size="9" font-weight="700" fill="#0f766e">O2</text>
              </g>

              <!-- Electric Bus / Bike Badge -->
              <rect x="132" y="106" width="136" height="30" rx="8" fill="#0f766e"/>
              <text x="200" y="125" text-anchor="middle" font-size="10" font-weight="700" fill="#ffffff">Transportasi Listrik</text>

              <!-- Sumur Resapan in Soil -->
              <g transform="translate(215, 146)">
                <rect x="0" y="0" width="52" height="58" rx="4" fill="#bae6fd" stroke="#0369a1" stroke-width="2.5"/>
                <line x1="12" y1="12" x2="12" y2="44" stroke="#0284c7" stroke-width="2" stroke-dasharray="4 3" class="anim-rain-1"/>
                <line x1="26" y1="8" x2="26" y2="48" stroke="#0284c7" stroke-width="2" stroke-dasharray="4 3" class="anim-rain-2"/>
                <line x1="40" y1="12" x2="40" y2="44" stroke="#0284c7" stroke-width="2" stroke-dasharray="4 3" class="anim-rain-3"/>
                <text x="26" y="74" text-anchor="middle" font-size="9.5" font-weight="700" fill="#e0f2fe">Sumur Resapan</text>
              </g>

              <!-- Bioremediation Microorganisms in Soil -->
              <g transform="translate(88, 184)">
                <g class="anim-pulse-soft">
                  <circle cx="-26" cy="0" r="10" fill="#86efac" stroke="#15803d" stroke-width="1.5"/>
                  <circle cx="0" cy="-6" r="11" fill="#86efac" stroke="#15803d" stroke-width="1.5"/>
                  <circle cx="28" cy="2" r="9" fill="#86efac" stroke="#15803d" stroke-width="1.5"/>
                </g>
                <text x="2" y="28" text-anchor="middle" font-size="9.5" font-weight="700" fill="#dcfce7">Bioremediasi (Bakteri)</text>
              </g>

              <!-- Prokasih Clean River -->
              <path d="M335 168 Q390 162 445 168 M485 174 Q545 168 605 174" stroke="#e0f2fe" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <rect x="410" y="182" width="185" height="26" rx="13" fill="#ccfbf1" stroke="#0f766e"/>
              <text x="502" y="199" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">Prokasih: Air Bersih &amp; Sehat</text>
            </g>

            <!-- Labels Footer -->
            <g font-size="10.5" font-weight="700">
              <rect x="24" y="230" width="210" height="22" rx="11" fill="#ffffff"/>
              <text x="129" y="245" text-anchor="middle" fill="#0f766e">Udara: Emisi vs. Pohon &amp; EV</text>
              <rect x="255" y="230" width="210" height="22" rx="11" fill="#ffffff"/>
              <text x="360" y="245" text-anchor="middle" fill="#0369a1">Air: Sumur Resapan &amp; Prokasih</text>
              <rect x="486" y="230" width="210" height="22" rx="11" fill="#ffffff"/>
              <text x="591" y="245" text-anchor="middle" fill="#78350f">Tanah: Reusable &amp; Bioremediasi</text>
            </g>
          </svg>
        `;
      }
    },

    "ips7-mission-3": {
      badge: "Visual Interaktif • 4 Pilar SDGs & Masalah Ekonomi Modern",
      modes: [
        {
          id: "ekonomi",
          label: "3 Masalah Pokok Ekonomi",
          caption: "Karena sumber daya mengalami kelangkaan (scarcity), setiap produsen harus menentukan What (apa dibuat), How (cara/mesin produksi), dan For Whom (untuk siapa)."
        },
        {
          id: "sdgs",
          label: "4 Pilar SDGs (2015)",
          caption: "Pembangunan Berkelanjutan menopang kebutuhan generasi kini dan masa depan melalui 4 Pilar: Sosial, Ekonomi, Lingkungan, dan Tata Kelola."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg scene-ips3" viewBox="0 0 720 260" role="img" aria-label="Diagram alur What How For Whom untuk mengatasi kelangkaan dan empat pilar SDGs">
            <rect x="0" y="0" width="720" height="260" rx="14" fill="#f0fdfa"/>

            <!-- MODE 1: 3 Masalah Pokok Ekonomi -->
            <g class="ips3-econ-view">
              <!-- Scarcity Banner -->
              <rect x="140" y="18" width="440" height="36" rx="18" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
              <text x="360" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">KELANGKAAN (SCARCITY): Kebutuhan Tak Terbatas vs. Sumber Terbatas</text>

              <!-- Connector Lines -->
              <path d="M360 54 V78 M140 78 H580 M140 78 V96 M360 78 V96 M580 78 V96" stroke="#0f766e" stroke-width="2.5" fill="none"/>

              <!-- Card 1: WHAT -->
              <g transform="translate(36, 96)">
                <rect x="0" y="0" width="204" height="138" rx="14" fill="#ffffff" stroke="#5eead4" stroke-width="2"/>
                <rect x="16" y="14" width="74" height="24" rx="12" fill="#0f766e"/>
                <text x="53" y="30" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">WHAT?</text>
                <text x="16" y="58" font-size="12" font-weight="700" fill="#1f2937">Apa yang Diproduksi</text>
                <text x="16" y="78" font-size="10.5" fill="#4b5563">Menentukan jenis &amp; jumlah</text>
                <text x="16" y="94" font-size="10.5" fill="#4b5563">barang atau jasa yang paling</text>
                <text x="16" y="110" font-size="10.5" fill="#4b5563">dibutuhkan masyarakat.</text>
              </g>

              <!-- Card 2: HOW -->
              <g transform="translate(258, 96)">
                <rect x="0" y="0" width="204" height="138" rx="14" fill="#ffffff" stroke="#fcd34d" stroke-width="2"/>
                <rect x="16" y="14" width="74" height="24" rx="12" fill="#d97706"/>
                <text x="53" y="30" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">HOW?</text>
                <text x="16" y="58" font-size="12" font-weight="700" fill="#1f2937">Bagaimana Caranya</text>
                <text x="16" y="78" font-size="10.5" fill="#4b5563">Memilih tenaga manusia vs.</text>
                <text x="16" y="94" font-size="10.5" fill="#4b5563">mesin otomatis dan teknik</text>
                <text x="16" y="110" font-size="10.5" fill="#4b5563">produksi ramah lingkungan.</text>
              </g>

              <!-- Card 3: FOR WHOM -->
              <g transform="translate(480, 96)">
                <rect x="0" y="0" width="204" height="138" rx="14" fill="#ffffff" stroke="#93c5fd" stroke-width="2"/>
                <rect x="16" y="14" width="96" height="24" rx="12" fill="#0284c7"/>
                <text x="64" y="30" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">FOR WHOM?</text>
                <text x="16" y="58" font-size="12" font-weight="700" fill="#1f2937">Untuk Siapa Produknya</text>
                <text x="16" y="78" font-size="10.5" fill="#4b5563">Menetapkan segmentasi</text>
                <text x="16" y="94" font-size="10.5" fill="#4b5563">pasar serta konsumen yang</text>
                <text x="16" y="110" font-size="10.5" fill="#4b5563">menikmati hasil produksi.</text>
              </g>
            </g>

            <!-- MODE 2: 4 Pilar SDGs -->
            <g class="ips3-sdgs-view">
              <!-- Roof: Pembangunan Berkelanjutan -->
              <polygon points="360,18 665,68 55,68" fill="#0f766e"/>
              <text x="360" y="54" text-anchor="middle" font-size="12.5" font-weight="700" fill="#ffffff">PEMBANGUNAN BERKELANJUTAN (17 TUJUAN SDGs 2015)</text>

              <!-- 4 Pillars -->
              <g transform="translate(55, 78)">
                <rect x="0" y="0" width="138" height="130" rx="10" fill="#fff1f2" stroke="#f43f5e" stroke-width="2"/>
                <text x="69" y="28" text-anchor="middle" font-size="11.5" font-weight="700" fill="#9f1239">1. Pilar Sosial</text>
                <text x="69" y="54" text-anchor="middle" font-size="10" fill="#4b5563">Tanpa Kemiskinan</text>
                <text x="69" y="72" text-anchor="middle" font-size="10" fill="#4b5563">Tanpa Kelaparan</text>
                <text x="69" y="90" text-anchor="middle" font-size="10" fill="#4b5563">Pendidikan Bermutu</text>
                <text x="69" y="108" text-anchor="middle" font-size="10" fill="#4b5563">Kesetaraan Gender</text>
              </g>

              <g transform="translate(212, 78)">
                <rect x="0" y="0" width="138" height="130" rx="10" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
                <text x="69" y="28" text-anchor="middle" font-size="11.5" font-weight="700" fill="#92400e">2. Pilar Ekonomi</text>
                <text x="69" y="54" text-anchor="middle" font-size="10" fill="#4b5563">Pertumbuhan Inklusif</text>
                <text x="69" y="72" text-anchor="middle" font-size="10" fill="#4b5563">Pekerjaan Layak</text>
                <text x="69" y="90" text-anchor="middle" font-size="10" fill="#4b5563">Industri Inovatif</text>
                <text x="69" y="108" text-anchor="middle" font-size="10" fill="#4b5563">Energi Bersih</text>
              </g>

              <g transform="translate(369, 78)">
                <rect x="0" y="0" width="138" height="130" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
                <text x="69" y="28" text-anchor="middle" font-size="11.5" font-weight="700" fill="#166534">3. Pilar Lingkungan</text>
                <text x="69" y="54" text-anchor="middle" font-size="10" fill="#4b5563">Ekosistem Darat</text>
                <text x="69" y="72" text-anchor="middle" font-size="10" fill="#4b5563">Ekosistem Laut</text>
                <text x="69" y="90" text-anchor="middle" font-size="10" fill="#4b5563">Air Bersih &amp; Sanitasi</text>
                <text x="69" y="108" text-anchor="middle" font-size="10" fill="#4b5563">Penanganan Iklim</text>
              </g>

              <g transform="translate(526, 78)">
                <rect x="0" y="0" width="138" height="130" rx="10" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
                <text x="69" y="28" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0369a1">4. Tata Kelola</text>
                <text x="69" y="54" text-anchor="middle" font-size="10" fill="#4b5563">Penegakan Hukum</text>
                <text x="69" y="72" text-anchor="middle" font-size="10" fill="#4b5563">Keadilan Sosial</text>
                <text x="69" y="90" text-anchor="middle" font-size="10" fill="#4b5563">Perdamaian</text>
                <text x="69" y="108" text-anchor="middle" font-size="10" fill="#4b5563">Lembaga Tangguh</text>
              </g>

              <!-- Base -->
              <rect x="44" y="216" width="632" height="24" rx="8" fill="#1e293b"/>
              <text x="360" y="232" text-anchor="middle" font-size="10.5" font-weight="700" fill="#ffffff">Generasi Kini Sejahtera • Hak Generasi Masa Depan Terjaga</text>
            </g>
          </svg>
        `;
      }
    },

    "ips7-mission-4": {
      badge: "Visual Interaktif • Bonus Demografi & Energi Hijau 2045",
      modes: [
        {
          id: "demografi",
          label: "Bonus Demografi (15–64 Th)",
          caption: "Melimpahnya penduduk usia produktif menjadi peluang besar menuju 4 besar ekonomi dunia 2045 (proyeksi OECD)—jika didukung pendidikan, literasi digital, dan keahlian vokasi!"
        },
        {
          id: "energi",
          label: "Energi Hijau & SDA (EBT)",
          caption: "Transisi Indonesia Maju 2045 ditopang nikel untuk baterai, sawit untuk biodiesel, serta Energi Baru Terbarukan (EBT): geotermal, tenaga surya (PLTS), air, dan angin."
        }
      ],
      renderSvg: function () {
        return `
          <svg class="scene-svg scene-ips4" viewBox="0 0 720 260" role="img" aria-label="Grafik Bonus Demografi menuju Indonesia 2045 dan potensi Energi Baru Terbarukan">
            <rect x="0" y="0" width="720" height="260" rx="14" fill="#fffbeb"/>

            <!-- MODE 1: Bonus Demografi -->
            <g class="ips4-demo-view">
              <rect x="24" y="20" width="320" height="220" rx="14" fill="#ffffff" stroke="#fde68a" stroke-width="2"/>
              <text x="184" y="46" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">Struktur Penduduk Indonesia</text>

              <!-- Bar Chart -->
              <rect x="64" y="138" width="54" height="64" rx="6" fill="#cbd5e1"/>
              <text x="91" y="130" text-anchor="middle" font-size="10" font-weight="700" fill="#64748b">0–14 Th</text>
              <text x="91" y="218" text-anchor="middle" font-size="9.5" font-weight="600" fill="#64748b">Nonproduktif</text>

              <g class="anim-pulse-soft">
                <rect x="150" y="68" width="68" height="134" rx="8" fill="#0f766e"/>
                <text x="184" y="102" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">15–64</text>
                <text x="184" y="117" text-anchor="middle" font-size="10" font-weight="700" fill="#ccfbf1">Tahun</text>
                <text x="184" y="218" text-anchor="middle" font-size="9.5" font-weight="700" fill="#0f766e">Usia Produktif</text>
              </g>

              <rect x="250" y="156" width="54" height="46" rx="6" fill="#cbd5e1"/>
              <text x="277" y="148" text-anchor="middle" font-size="10" font-weight="700" fill="#64748b">65+ Th</text>
              <text x="277" y="218" text-anchor="middle" font-size="9.5" font-weight="600" fill="#64748b">Nonproduktif</text>

              <!-- Right: Peluang vs Tantangan -->
              <g transform="translate(364, 20)">
                <rect x="0" y="0" width="332" height="104" rx="14" fill="#ecfdf5" stroke="#34d399" stroke-width="2"/>
                <text x="16" y="26" font-size="12" font-weight="700" fill="#065f46">Peluang Emas 2045 (Target 4 Besar OECD)</text>
                <text x="16" y="48" font-size="10.5" fill="#1f2937">• Produktivitas tinggi &amp; pasar domestik kuat</text>
                <text x="16" y="67" font-size="10.5" fill="#1f2937">• Lonjakan inovasi teknologi &amp; investasi</text>
                <text x="16" y="86" font-size="10.5" fill="#1f2937">• Kunci sukses: Pendidikan, Digital &amp; Vokasi</text>
              </g>

              <g transform="translate(364, 136)">
                <rect x="0" y="0" width="332" height="104" rx="14" fill="#fff1f2" stroke="#fda4af" stroke-width="2"/>
                <text x="16" y="26" font-size="12" font-weight="700" fill="#9f1239">Tantangan Jika SDM Tertinggal</text>
                <text x="16" y="48" font-size="10.5" fill="#1f2937">• Literasi digital &amp; keterampilan kerja rendah</text>
                <text x="16" y="67" font-size="10.5" fill="#1f2937">• Ketersediaan lapangan kerja tidak seimbang</text>
                <text x="16" y="86" font-size="10.5" font-weight="700" fill="#be123c">• Risiko: Bonus berubah menjadi pengangguran</text>
              </g>
            </g>

            <!-- MODE 2: Energi Hijau & EBT -->
            <g class="ips4-energy-view">
              <text x="360" y="34" text-anchor="middle" font-size="13" font-weight="700" fill="#0f766e">Pilar Kekayaan Sumber Daya Alam &amp; Energi Terbarukan (EBT)</text>

              <!-- Nickel Battery -->
              <g transform="translate(34, 56)">
                <rect x="0" y="0" width="150" height="162" rx="14" fill="#ffffff" stroke="#5eead4" stroke-width="2"/>
                <rect x="48" y="28" width="54" height="36" rx="6" fill="#0f766e"/>
                <rect x="102" y="38" width="6" height="16" rx="2" fill="#0f766e"/>
                <text x="75" y="50" text-anchor="middle" font-size="10" font-weight="700" fill="#fde047">Ni+ EV</text>
                <text x="75" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="#1f2937">Nikel</text>
                <text x="75" y="116" text-anchor="middle" font-size="10" fill="#4b5563">Bahan baku baterai</text>
                <text x="75" y="132" text-anchor="middle" font-size="10" fill="#4b5563">listrik &amp; manufaktur</text>
              </g>

              <!-- Biodiesel Sawit -->
              <g transform="translate(202, 56)">
                <rect x="0" y="0" width="150" height="162" rx="14" fill="#ffffff" stroke="#fcd34d" stroke-width="2"/>
                <g class="anim-float-slow-1">
                  <path d="M75 24 C60 44 54 56 54 66 a21 21 0 0 0 42 0 c0-10-6-22-21-42Z" fill="#f59e0b"/>
                </g>
                <text x="75" y="102" text-anchor="middle" font-size="12" font-weight="700" fill="#1f2937">Biodiesel Sawit</text>
                <text x="75" y="120" text-anchor="middle" font-size="10" fill="#4b5563">Bioenergi nabati</text>
                <text x="75" y="136" text-anchor="middle" font-size="10" fill="#4b5563">pengganti solar fosil</text>
              </g>

              <!-- Geotermal -->
              <g transform="translate(370, 56)">
                <rect x="0" y="0" width="150" height="162" rx="14" fill="#ffffff" stroke="#fda4af" stroke-width="2"/>
                <polygon points="36,78 75,26 114,78" fill="#64748b"/>
                <path class="anim-float-up-1" d="M68 24 q6 -8 0 -14 M82 24 q6 -8 0 -14" stroke="#e11d48" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <text x="75" y="102" text-anchor="middle" font-size="12" font-weight="700" fill="#1f2937">Geotermal</text>
                <text x="75" y="120" text-anchor="middle" font-size="10" fill="#4b5563">Panas bumi alami</text>
                <text x="75" y="136" text-anchor="middle" font-size="10" fill="#4b5563">bebas emisi fosil</text>
              </g>

              <!-- PLTS Tenaga Surya & Angin/Air -->
              <g transform="translate(538, 56)">
                <rect x="0" y="0" width="150" height="162" rx="14" fill="#ffffff" stroke="#93c5fd" stroke-width="2"/>
                <circle cx="105" cy="34" r="13" fill="#fbbf24" class="anim-pulse-soft"/>
                <polygon points="35,76 52,48 98,48 81,76" fill="#0284c7" stroke="#bae6fd" stroke-width="1.5"/>
                <text x="75" y="102" text-anchor="middle" font-size="12" font-weight="700" fill="#1f2937">Surya (PLTS)</text>
                <text x="75" y="120" text-anchor="middle" font-size="10" fill="#4b5563">Serta tenaga air &amp;</text>
                <text x="75" y="136" text-anchor="middle" font-size="10" fill="#4b5563">angin ramah alam</text>
              </g>

              <text x="360" y="242" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f766e">Transisi Energi Bersih Mengurangi Ketergantungan Batu Bara, Minyak Bumi &amp; Solar Fosil</text>
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
        <div class="motion-mode-group" role="group" aria-label="Ganti tampilan visual materi">
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

  window.Ips7Motion = {
    renderMotionStage: renderMotionStage,
    observeReadingReveals: observeReadingReveals
  };
})();
