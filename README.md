# thelab-bolhs

Interactive learning & writing review hub with two tracks:
1. **Grade 5 English (`index.html` / `/`)**: Elfin 5 Explorer Journal with 6 cross-unit missions.
2. **Grade 7 Social Studies (`ips-7.html` / `/ips-7`)**: Jurnal Eksplorasi IPS Kelas 7 covering Pertemuan 10, 11, 14, and 18 in Bahasa Indonesia.

## Features
- **Interactive Motion Graphics** (`motion.js` & `ips7-motion.js`) with toggleable scenes for every reading passage.
- **Word Explorer / Kamus Konsep & Read Aloud** support (`app.js` & `ips7-app.js`).
- **100-Word Minimum Challenge** with guided outline checklists, sentence starters, power-word tracking, local auto-save, Supabase cloud sync (`thelab_bolhs_submissions` & `thelab_ips7_submissions`), and Teacher Admin Dashboard.

## Vercel Deployment
Import `nicombing/thelab-bolhs` in Vercel (defaults to `thelab-bolhs.vercel.app`) with static serving and `cleanUrls: true` configured in `vercel.json` (`/ips-7` routes to `ips-7.html`).
