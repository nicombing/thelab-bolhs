(function () {
  "use strict";

  const STORAGE_KEY = "ips8_pas_prep_v1";
  const DATA = window.IPS8_DATA;
  const UNLOCK_AT_MS = new Date("2026-11-25T15:25:00+07:00").getTime();
  const ADMIN_PASSWORD = "qw3rty";
  const SUPABASE_URL = "https://dcoqoonpdxtfhslyjirb.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_2KMKUCuf1tCSOZ5CfLIkcw_HM81Xq9h";
  const SUPABASE_TABLE = "thelab_ips8_submissions";

  let isAdminUnlocked = false;
  let adminRows = [];
  let expandedStudents = new Set();
  let syncTimer = null;

  function isQuizLocked() {
    return Date.now() < UNLOCK_AT_MS;
  }

  const DEFAULT_STATE = {
    studentName: "",
    activeView: "reading",
    activeTopicId: "all",
    quizMode: "practice", // 'practice' | 'exam'
    pgFilter: "all",      // 'all' | 'Topik 1' | 'Topik 3'
    examSubmitted: false,
    pgAnswers: {},        // { [questionId]: optionIndex } (Mode Latihan)
    examAnswers: {},      // { [questionId]: optionIndex } (Mode Ujian PAS)
    examOrder: [],        // shuffled question IDs for Mode Ujian PAS
    essayAnswers: {},     // { [questionId]: string }
    essayScores: {},      // { [questionId]: number }
    revealedRubrics: {}   // { [questionId]: boolean }
  };

  function shuffleIds(ids) {
    const arr = [...ids];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function isPracticeComplete() {
    return DATA.mcQuestions.every((q) => typeof state.pgAnswers[q.id] === "number");
  }

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      return { ...structuredClone(DEFAULT_STATE), ...JSON.parse(raw) };
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
    scheduleCloudSync();
  }

  async function supabaseRequest(path, opts = {}) {
    const headers = Object.assign(
      {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json"
      },
      opts.headers || {}
    );
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, Object.assign({}, opts, { headers }));
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Supabase ${res.status}: ${txt}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  function scoreAnswersMap(answersMap) {
    let correct = 0;
    DATA.mcQuestions.forEach((q) => {
      if (answersMap[q.id] === q.correctIndex) correct += 1;
    });
    return correct * 2;
  }

  function scheduleCloudSync() {
    const name = (state.studentName || "").trim();
    if (!name) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      try {
        const practiceScore = scoreAnswersMap(state.pgAnswers);
        const examScore = scoreAnswersMap(state.examAnswers);
        const essay = calculateEssayMetrics();
        const bestPgScore = state.examSubmitted ? examScore : practiceScore;
        const payload = {
          student_name: name,
          practice_answers: state.pgAnswers,
          exam_answers: state.examAnswers,
          exam_submitted: Boolean(state.examSubmitted),
          essay_answers: state.essayAnswers,
          essay_scores: state.essayScores,
          practice_score: practiceScore,
          exam_score: examScore,
          essay_weighted_score: essay.score,
          total_score: bestPgScore + essay.score,
          updated_at: new Date().toISOString()
        };
        await supabaseRequest(`${SUPABASE_TABLE}?on_conflict=student_name`, {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify(payload)
        });
      } catch {
        // Silent background sync retry on next change
      }
    }, 800);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatWithGlossary(text) {
    const escaped = escapeHtml(text);
    return escaped.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      const normalized = key.trim().toLowerCase();
      const entry = DATA.glossary[normalized];
      if (!entry) return escapeHtml(key);
      return `<button type="button" class="glossary-trigger" data-glossary-key="${escapeHtml(normalized)}">${escapeHtml(key)}</button>`;
    });
  }

  // Score Calculations
  function calculatePgMetrics() {
    const answersMap = state.quizMode === "exam" ? state.examAnswers : state.pgAnswers;
    let answered = 0;
    let correct = 0;
    DATA.mcQuestions.forEach((q) => {
      const sel = answersMap[q.id];
      if (typeof sel === "number") {
        answered += 1;
        if (sel === q.correctIndex) correct += 1;
      }
    });
    const showScore = state.quizMode === "practice" || state.examSubmitted;
    const score = showScore ? correct * 2 : 0;
    return { answered, correct, score, showScore };
  }

  function calculateEssayMetrics() {
    let filled = 0;
    let rawScore = 0;
    let rawMax = 0;
    DATA.essayQuestions.forEach((q) => {
      const ans = (state.essayAnswers[q.id] || "").trim();
      if (ans.length > 0) filled += 1;
      const val = Number(state.essayScores[q.id] || 0);
      rawScore += Math.max(0, Math.min(q.maxScore, Number.isFinite(val) ? val : 0));
      rawMax += q.maxScore;
    });
    const score = rawMax > 0 ? Math.round((rawScore / rawMax) * 50 * 10) / 10 : 0;
    return { filled, rawScore, rawMax, score };
  }

  function updateTopbarScore() {
    const pg = calculatePgMetrics();
    const essay = calculateEssayMetrics();
    const total = pg.score + essay.score;
    document.getElementById("topbar-score-text").textContent = `Nilai: ${total} / 100`;
  }

  // View Switching
  function setActiveView(viewName) {
    const validViews = ["reading", "quiz-pg", "quiz-essay", "admin"];
    let nextView = validViews.includes(viewName) ? viewName : "reading";
    if (nextView === "admin" && !isAdminUnlocked) {
      nextView = "reading";
    }
    if (isQuizLocked() && (nextView === "quiz-pg" || nextView === "quiz-essay")) {
      nextView = "reading";
    }
    state.activeView = nextView === "admin" ? "reading" : nextView;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}

    document.querySelectorAll(".view-panel").forEach((el) => {
      el.classList.toggle("hidden", el.id !== `view-${nextView}`);
    });

    document.querySelectorAll(".nav-tab").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.view === nextView);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Render Reading View
  function renderGlossarySidebar(activeKey) {
    const chipList = document.getElementById("glossary-chip-list");
    const keys = Object.keys(DATA.glossary);

    chipList.innerHTML = keys
      .map((k) => {
        const item = DATA.glossary[k];
        const isActive = activeKey === k ? "is-active" : "";
        return `<button type="button" class="glossary-chip ${isActive}" data-glossary-key="${escapeHtml(k)}">${escapeHtml(item.term)}</button>`;
      })
      .join("");

    if (activeKey && DATA.glossary[activeKey]) {
      const entry = DATA.glossary[activeKey];
      document.getElementById("glossary-term-title").textContent = entry.term;
      document.getElementById("glossary-term-cat").textContent = entry.category;
      document.getElementById("glossary-term-def").textContent = entry.def;
    }
  }

  function renderTopic(topicId) {
    const nextTopic = topicId || "all";
    state.activeTopicId = nextTopic;
    saveState();

    document.querySelectorAll(".topic-pill").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.topic === nextTopic);
    });

    const topicsToRender =
      nextTopic === "all"
        ? DATA.topics
        : DATA.topics.filter((t) => t.id === nextTopic);

    const container = document.getElementById("topic-content-container");
    container.innerHTML = topicsToRender
      .map((topic) => {
        const sectionsHtml = topic.sections
          .map((sec) => {
            let bodyHtml = "";

            if (sec.paragraphs) {
              bodyHtml += sec.paragraphs
                .map((p) => `<p>${formatWithGlossary(p)}</p>`)
                .join("");
            }

            if (sec.cards) {
              bodyHtml += `<div class="concept-cards-grid">${sec.cards
                .map(
                  (c) => `
                  <div class="concept-card tone-${escapeHtml(c.tone)}">
                    <span class="concept-tag">${escapeHtml(c.tag)}</span>
                    <h4>${escapeHtml(c.title)}</h4>
                    <p>${escapeHtml(c.desc)}</p>
                    <div class="concept-example">${escapeHtml(c.example)}</div>
                  </div>`
                )
                .join("")}</div>`;
            }

            if (sec.bullets) {
              bodyHtml += `<ul class="channel-list">${sec.bullets
                .map(
                  (b) => `
                  <li class="channel-item">
                    <strong>${escapeHtml(b.title)}</strong>
                    <span>${formatWithGlossary(b.text)}</span>
                  </li>`
                )
                .join("")}</ul>`;
            }

            if (sec.bullets && sec.twoCol) {
              bodyHtml += `<div style="height: 14px"></div>`;
            }

            if (sec.twoCol) {
              bodyHtml += `
                <div class="two-col-grid">
                  <div class="factor-box tone-${escapeHtml(sec.twoCol.leftTone)}">
                    <h4>${escapeHtml(sec.twoCol.leftTitle)}</h4>
                    <ul>${sec.twoCol.leftItems.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
                  </div>
                  <div class="factor-box tone-${escapeHtml(sec.twoCol.rightTone)}">
                    <h4>${escapeHtml(sec.twoCol.rightTitle)}</h4>
                    <ul>${sec.twoCol.rightItems.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
                  </div>
                </div>`;
            }

            if (sec.table) {
              bodyHtml += `
                <div class="table-wrap">
                  <table class="compare-table">
                    <thead>
                      <tr>${sec.table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
                    </thead>
                    <tbody>
                      ${sec.table.rows
                        .map(
                          (row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>`;
            }

            if (sec.timeline) {
              bodyHtml += `<div class="timeline-list">${sec.timeline
                .map(
                  (item) => `
                  <div class="timeline-item">
                    <span class="timeline-date">${escapeHtml(item.date)}</span>
                    <h4>${escapeHtml(item.title)}</h4>
                    <p>${formatWithGlossary(item.text)}</p>
                  </div>`
                )
                .join("")}</div>`;
            }

            return `
              <section class="topic-section">
                <h3>${escapeHtml(sec.heading)}</h3>
                ${bodyHtml}
              </section>`;
          })
          .join("");

        const heroImgHtml = topic.heroImage
          ? `
          <figure class="topic-figure">
            <img src="${escapeHtml(topic.heroImage.src)}" alt="${escapeHtml(topic.heroImage.alt)}" loading="lazy">
            <figcaption>${escapeHtml(topic.heroImage.caption)}</figcaption>
          </figure>`
          : "";

        return `
          <article class="topic-article" id="topic-${escapeHtml(topic.id)}">
            <header class="topic-header">
              <div class="topic-meta-row">
                <span class="topic-badge">${escapeHtml(topic.badge)}</span>
                <span class="topic-read-time">${escapeHtml(topic.readTime)}</span>
              </div>
              <h2>${escapeHtml(topic.title)}</h2>
              <p class="topic-summary">${escapeHtml(topic.summary)}</p>
            </header>
            ${heroImgHtml}
            ${sectionsHtml}
          </article>`;
      })
      .join("");
  }

  // Render PG Quiz View
  function getOrderedMcQuestions() {
    if (state.quizMode === "exam") {
      if (!Array.isArray(state.examOrder) || state.examOrder.length !== DATA.mcQuestions.length) {
        state.examOrder = shuffleIds(DATA.mcQuestions.map((q) => q.id));
        saveState();
      }
      const byId = new Map(DATA.mcQuestions.map((q) => [q.id, q]));
      return state.examOrder.map((id) => byId.get(id)).filter(Boolean);
    }
    return DATA.mcQuestions;
  }

  function renderPgQuiz() {
    const practiceDone = isPracticeComplete();
    if (state.quizMode === "exam" && !practiceDone) {
      state.quizMode = "practice";
      saveState();
    }

    const pg = calculatePgMetrics();
    const canReveal = state.quizMode === "practice" || state.examSubmitted;
    const answersMap = state.quizMode === "exam" ? state.examAnswers : state.pgAnswers;
    const orderedQuestions = getOrderedMcQuestions();

    document.getElementById("pg-answered-count").textContent = `Terjawab: ${pg.answered} / ${DATA.mcQuestions.length}`;
    document.getElementById("pg-score-badge").textContent = canReveal
      ? `Skor PG: ${pg.score} / 50 (${pg.correct} benar)`
      : `Skor PG: Menunggu selesai ujian`;

    const submitExamBtn = document.getElementById("submit-exam-btn");
    submitExamBtn.classList.toggle("hidden", state.quizMode !== "exam" || state.examSubmitted);

    document.querySelectorAll("[data-quiz-mode]").forEach((btn) => {
      const mode = btn.dataset.quizMode;
      btn.classList.toggle("is-active", mode === state.quizMode);
      if (mode === "exam") {
        btn.disabled = !practiceDone;
        btn.classList.toggle("is-locked", !practiceDone);
        btn.title = practiceDone
          ? "Mulai Mode Ujian PAS (soal diacak)"
          : "Jawab semua 25 soal di Mode Latihan terlebih dahulu";
        btn.textContent = practiceDone
          ? "Mode Ujian PAS (Acak)"
          : `Mode Ujian PAS (${Object.keys(state.pgAnswers).length}/25 Latihan)`;
      }
    });

    document.querySelectorAll("[data-pg-filter]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.pgFilter === state.pgFilter);
    });

    // Navigator Grid
    const navGrid = document.getElementById("pg-nav-grid");
    navGrid.innerHTML = orderedQuestions
      .map((q, idx) => {
        const displayNum = state.quizMode === "exam" ? idx + 1 : q.id;
        const sel = answersMap[q.id];
        let cls = "";
        if (typeof sel === "number") {
          if (canReveal) {
            cls = sel === q.correctIndex ? "is-correct" : "is-wrong";
          } else {
            cls = "is-answered";
          }
        }
        return `<button type="button" class="pg-num-btn ${cls}" data-scroll-q="${q.id}">${displayNum}</button>`;
      })
      .join("");

    // Filtered Questions
    const filtered = orderedQuestions
      .map((q, idx) => ({ q, displayNum: state.quizMode === "exam" ? idx + 1 : q.id }))
      .filter(({ q }) => (state.pgFilter === "all" ? true : q.topic === state.pgFilter));

    const letters = ["A", "B", "C", "D"];
    const qContainer = document.getElementById("pg-questions-container");
    qContainer.innerHTML = filtered
      .map(({ q, displayNum }) => {
        const sel = answersMap[q.id];
        const hasAnswered = typeof sel === "number";
        const isCorrect = hasAnswered && sel === q.correctIndex;

        const optionsHtml = q.options
          .map((opt, idx) => {
            let optClass = "";
            if (canReveal && hasAnswered) {
              if (idx === q.correctIndex) optClass = "is-correct";
              else if (idx === sel) optClass = "is-wrong";
            } else if (sel === idx) {
              optClass = "is-selected";
            }
            return `
              <button type="button" class="option-btn ${optClass}" data-q-id="${q.id}" data-opt-idx="${idx}">
                <span class="option-letter">${letters[idx]}.</span>
                <span>${escapeHtml(opt)}</span>
              </button>`;
          })
          .join("");

        let explanationHtml = "";
        if (canReveal && hasAnswered) {
          const statusLabel = isCorrect
            ? "Jawaban Tepat! (+2 poin)"
            : `Belum tepat. Jawaban benar: ${letters[q.correctIndex]}.`;
          explanationHtml = `
            <div class="q-explanation ${isCorrect ? "" : "is-wrong"}">
              <strong>${statusLabel}</strong> ${escapeHtml(q.explanation)}
            </div>`;
        }

        return `
          <article class="question-card" id="pg-q-${q.id}">
            <div class="question-head">
              <span class="q-num-badge">Soal ${displayNum}</span>
              <span class="q-topic-tag">${escapeHtml(q.topic)}</span>
            </div>
            <p class="question-text">${escapeHtml(q.question)}</p>
            <div class="options-list">${optionsHtml}</div>
            ${explanationHtml}
          </article>`;
      })
      .join("");

    updateTopbarScore();
  }

  // Render Essay View
  function renderEssayView() {
    const essay = calculateEssayMetrics();
    document.getElementById("essay-filled-count").textContent = `Terisi: ${essay.filled} / ${DATA.essayQuestions.length}`;
    document.getElementById("essay-score-badge").textContent = `Skor Uraian: ${essay.score} / 50 (Mentah: ${essay.rawScore}/${essay.rawMax})`;

    const container = document.getElementById("essay-questions-container");
    container.innerHTML = DATA.essayQuestions
      .map((q) => {
        const answer = state.essayAnswers[q.id] || "";
        const score = state.essayScores[q.id] ?? 0;
        const isRevealed = Boolean(state.revealedRubrics[q.id]);

        return `
          <article class="essay-card">
            <div class="question-head">
              <span class="q-num-badge">Uraian ${q.id} • Skor Maks: ${q.maxScore}</span>
              <span class="q-topic-tag">${escapeHtml(q.topic)}</span>
            </div>
            <p class="question-text">${escapeHtml(q.question)}</p>
            <textarea
              class="essay-textarea"
              data-essay-input="${q.id}"
              placeholder="Tuliskan jawaban analisismu di sini..."
            >${escapeHtml(answer)}</textarea>
            <div class="essay-actions-row">
              <button type="button" class="btn btn-secondary btn-sm" data-toggle-rubric="${q.id}">
                ${isRevealed ? "Sembunyikan Pedoman Jawaban" : "Lihat Pedoman Jawaban & Rubrik"}
              </button>
              <label class="self-score-box">
                <span>Skor Mandiri (0–${q.maxScore}):</span>
                <input
                  type="number"
                  class="self-score-input"
                  min="0"
                  max="${q.maxScore}"
                  value="${escapeHtml(score)}"
                  data-essay-score="${q.id}"
                >
              </label>
            </div>
            <div class="essay-rubric-box ${isRevealed ? "" : "hidden"}">
              <strong>Pedoman Jawaban (Bobot Maks ${q.maxScore} Poin):</strong>
              <p>${escapeHtml(q.rubric)}</p>
            </div>
          </article>`;
      })
      .join("");

    updateTopbarScore();
  }

  // Event Listeners
  function bindEvents() {
    const nameInput = document.getElementById("student-name-input");
    nameInput.value = state.studentName;
    nameInput.addEventListener("input", (e) => {
      state.studentName = e.target.value;
      saveState();
    });

    document.getElementById("brand-home-btn").addEventListener("click", () => setActiveView("reading"));
    document.getElementById("hero-start-pg-btn").addEventListener("click", () => setActiveView("quiz-pg"));

    document.querySelectorAll(".nav-tab").forEach((btn) => {
      btn.addEventListener("click", () => setActiveView(btn.dataset.view));
    });

    document.querySelectorAll("[data-jump-topic]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.jumpTopic;
        renderTopic(targetId);
        const el = document.getElementById(`topic-${targetId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    document.querySelectorAll(".topic-pill").forEach((btn) => {
      btn.addEventListener("click", () => renderTopic(btn.dataset.topic));
    });

    // Glossary click delegation
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-glossary-key]");
      if (trigger) {
        renderGlossarySidebar(trigger.dataset.glossaryKey);
      }
    });

    // PG Quiz interactions
    document.querySelectorAll("[data-quiz-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetMode = btn.dataset.quizMode;
        if (targetMode === "exam") {
          if (!isPracticeComplete()) return;
          if (!Array.isArray(state.examOrder) || state.examOrder.length !== DATA.mcQuestions.length) {
            state.examOrder = shuffleIds(DATA.mcQuestions.map((q) => q.id));
          }
        }
        state.quizMode = targetMode;
        saveState();
        renderPgQuiz();
      });
    });

    document.querySelectorAll("[data-pg-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.pgFilter = btn.dataset.pgFilter;
        saveState();
        renderPgQuiz();
      });
    });

    document.getElementById("reset-pg-btn").addEventListener("click", () => {
      if (state.quizMode === "exam") {
        state.examAnswers = {};
        state.examSubmitted = false;
        state.examOrder = shuffleIds(DATA.mcQuestions.map((q) => q.id));
      } else {
        state.pgAnswers = {};
      }
      saveState();
      renderPgQuiz();
    });

    document.getElementById("submit-exam-btn").addEventListener("click", () => {
      state.examSubmitted = true;
      saveState();
      renderPgQuiz();
    });

    document.getElementById("pg-nav-grid").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-scroll-q]");
      if (!btn) return;
      if (state.pgFilter !== "all") {
        state.pgFilter = "all";
        saveState();
        renderPgQuiz();
      }
      const target = document.getElementById(`pg-q-${btn.dataset.scrollQ}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    document.getElementById("pg-questions-container").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-q-id]");
      if (!btn) return;
      if (state.quizMode === "exam" && state.examSubmitted) return;
      const qId = Number(btn.dataset.qId);
      const optIdx = Number(btn.dataset.optIdx);
      if (state.quizMode === "exam") {
        state.examAnswers[qId] = optIdx;
      } else {
        state.pgAnswers[qId] = optIdx;
      }
      saveState();
      renderPgQuiz();
    });

    // Essay interactions
    const essayContainer = document.getElementById("essay-questions-container");
    essayContainer.addEventListener("input", (e) => {
      if (e.target.matches("[data-essay-input]")) {
        const qId = Number(e.target.dataset.essayInput);
        state.essayAnswers[qId] = e.target.value;
        saveState();
        const essay = calculateEssayMetrics();
        document.getElementById("essay-filled-count").textContent = `Terisi: ${essay.filled} / ${DATA.essayQuestions.length}`;
      } else if (e.target.matches("[data-essay-score]")) {
        const qId = Number(e.target.dataset.essayScore);
        const q = DATA.essayQuestions.find((item) => item.id === qId);
        const max = q ? q.maxScore : 15;
        let val = Number(e.target.value || 0);
        if (val < 0) val = 0;
        if (val > max) val = max;
        state.essayScores[qId] = val;
        saveState();
        const essay = calculateEssayMetrics();
        document.getElementById("essay-score-badge").textContent = `Skor Uraian: ${essay.score} / 50 (Mentah: ${essay.rawScore}/${essay.rawMax})`;
        updateTopbarScore();
      }
    });

    essayContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-toggle-rubric]");
      if (!btn) return;
      const qId = Number(btn.dataset.toggleRubric);
      state.revealedRubrics[qId] = !state.revealedRubrics[qId];
      saveState();
      renderEssayView();
    });

    // Admin Modal & Dashboard
    const adminModal = document.getElementById("admin-login-modal");
    const adminPasswordInput = document.getElementById("admin-password-input");
    const adminLoginError = document.getElementById("admin-login-error");

    document.getElementById("topbar-admin-btn").addEventListener("click", () => {
      if (isAdminUnlocked) {
        setActiveView("admin");
        loadAdminRows();
      } else {
        adminPasswordInput.value = "";
        adminLoginError.classList.add("hidden");
        adminModal.classList.remove("hidden");
        adminPasswordInput.focus();
      }
    });

    document.getElementById("admin-modal-cancel-btn").addEventListener("click", () => {
      adminModal.classList.add("hidden");
    });

    document.getElementById("admin-login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (adminPasswordInput.value === ADMIN_PASSWORD) {
        isAdminUnlocked = true;
        adminModal.classList.add("hidden");
        setActiveView("admin");
        loadAdminRows();
      } else {
        adminLoginError.classList.remove("hidden");
      }
    });

    document.getElementById("admin-close-btn").addEventListener("click", () => setActiveView("reading"));
    document.getElementById("admin-refresh-btn").addEventListener("click", () => loadAdminRows());
    document.getElementById("admin-search-input").addEventListener("input", () => renderAdminDashboard());

    document.getElementById("admin-students-list").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-toggle-student]");
      if (!btn) return;
      const name = btn.dataset.toggleStudent;
      if (expandedStudents.has(name)) expandedStudents.delete(name);
      else expandedStudents.add(name);
      renderAdminDashboard();
    });
  }

  async function loadAdminRows() {
    const statusEl = document.getElementById("admin-sync-status");
    statusEl.textContent = "Memuat data...";
    try {
      const rows = await supabaseRequest(`${SUPABASE_TABLE}?select=*&order=updated_at.desc`, { method: "GET" });
      adminRows = Array.isArray(rows) ? rows : [];
      statusEl.textContent = `Tersinkron (${adminRows.length} siswa)`;
      renderAdminDashboard();
    } catch (err) {
      statusEl.textContent = "Gagal memuat (cek tabel Supabase)";
      document.getElementById("admin-students-list").innerHTML = `<div class="info-banner"><p><strong>Gagal mengambil data:</strong> ${escapeHtml(err.message)}. Pastikan tabel <code>thelab_ips8_submissions</code> sudah dibuat di Supabase SQL Editor.</p></div>`;
    }
  }

  function renderAdminDashboard() {
    const query = (document.getElementById("admin-search-input").value || "").trim().toLowerCase();
    const filtered = adminRows.filter((r) => (r.student_name || "").toLowerCase().includes(query));

    const totalStudents = adminRows.length;
    const examDoneCount = adminRows.filter((r) => r.exam_submitted).length;
    const avgScore = totalStudents
      ? Math.round((adminRows.reduce((s, r) => s + Number(r.total_score || 0), 0) / totalStudents) * 10) / 10
      : 0;

    document.getElementById("admin-kpi-grid").innerHTML = `
      <div class="kpi-box"><span>Total Siswa Terdata</span><strong>${totalStudents}</strong></div>
      <div class="kpi-box"><span>Selesai Ujian PAS</span><strong>${examDoneCount}</strong></div>
      <div class="kpi-box kpi-total"><span>Rata-rata Nilai PAS</span><strong>${avgScore} / 100</strong></div>
    `;

    const letters = ["A", "B", "C", "D"];
    const listEl = document.getElementById("admin-students-list");
    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="info-banner"><p>Belum ada data jawaban siswa yang cocok.</p></div>`;
      return;
    }

    listEl.innerHTML = filtered
      .map((r) => {
        const isExpanded = expandedStudents.has(r.student_name);
        const practiceAns = r.practice_answers || {};
        const examAns = r.exam_answers || {};
        const essayAns = r.essay_answers || {};
        const essayScores = r.essay_scores || {};
        const updatedStr = r.updated_at ? new Date(r.updated_at).toLocaleString("id-ID") : "-";

        let detailsHtml = "";
        if (isExpanded) {
          const activePgMap = Object.keys(examAns).length > 0 ? examAns : practiceAns;
          const pgLabel = Object.keys(examAns).length > 0 ? "Jawaban Ujian PAS" : "Jawaban Mode Latihan";
          const pgCells = DATA.mcQuestions
            .map((q) => {
              const sel = activePgMap[q.id];
              if (typeof sel !== "number") {
                return `<div class="admin-pg-cell">${q.id}. -</div>`;
              }
              const ok = sel === q.correctIndex;
              return `<div class="admin-pg-cell ${ok ? "is-correct" : "is-wrong"}">${q.id}. ${letters[sel]} ${ok ? "✓" : "✗"}</div>`;
            })
            .join("");

          const essayItems = DATA.essayQuestions
            .map((q) => {
              const ansText = (essayAns[q.id] || "").trim() || "(Belum dijawab)";
              const sc = essayScores[q.id] ?? 0;
              return `
                <div class="admin-essay-item">
                  <strong>Uraian ${q.id} (Skor Mandiri: ${sc}/${q.maxScore})</strong>
                  <p>${escapeHtml(ansText)}</p>
                </div>`;
            })
            .join("");

          detailsHtml = `
            <div class="admin-student-details">
              <div>
                <strong>${pgLabel} (25 Soal)</strong>
                <div class="admin-pg-grid" style="margin-top:8px">${pgCells}</div>
              </div>
              <div>
                <strong>Jawaban Uraian Analitis (8 Soal)</strong>
                <div style="display:grid;gap:8px;margin-top:8px">${essayItems}</div>
              </div>
            </div>`;
        }

        return `
          <article class="admin-student-card">
            <div class="admin-student-head">
              <div>
                <strong>${escapeHtml(r.student_name)}</strong>
                <div style="font-size:0.8rem;color:var(--text-muted)">Update: ${escapeHtml(updatedStr)}</div>
              </div>
              <div class="admin-student-metrics">
                <span class="admin-metric-chip">Latihan: ${r.practice_score ?? 0}/50</span>
                <span class="admin-metric-chip">Ujian PAS: ${r.exam_score ?? 0}/50 ${r.exam_submitted ? "(Selesai)" : ""}</span>
                <span class="admin-metric-chip">Uraian: ${r.essay_weighted_score ?? 0}/50</span>
                <span class="admin-metric-chip is-teal">Total: ${r.total_score ?? 0}/100</span>
                <button type="button" class="btn btn-secondary btn-sm" data-toggle-student="${escapeHtml(r.student_name)}">
                  ${isExpanded ? "Tutup Jawaban" : "Lihat Jawaban"}
                </button>
              </div>
            </div>
            ${detailsHtml}
          </article>`;
      })
      .join("");
  }

  function updateLockState() {
    const locked = isQuizLocked();
    document.querySelectorAll('.nav-tab[data-view="quiz-pg"], .nav-tab[data-view="quiz-essay"]').forEach((btn) => {
      btn.classList.toggle("is-locked", locked);
      btn.disabled = locked;
      btn.title = locked ? "Dibuka pukul 15.25 WIB" : "";
      const badge = btn.querySelector(".nav-tab-badge");
      if (badge) {
        if (locked) {
          if (!badge.dataset.originalText) badge.dataset.originalText = badge.textContent;
          badge.textContent = "15.25 WIB";
        } else if (badge.dataset.originalText) {
          badge.textContent = badge.dataset.originalText;
        }
      }
    });

    const heroPgBtn = document.getElementById("hero-start-pg-btn");
    if (heroPgBtn) {
      heroPgBtn.classList.toggle("is-locked", locked);
      heroPgBtn.disabled = locked;
      heroPgBtn.textContent = locked ? "Kuis 25 PG (Dibuka 15.25 WIB)" : "Mulai Kuis 25 PG →";
    }

    if (locked && (state.activeView === "quiz-pg" || state.activeView === "quiz-essay")) {
      setActiveView("reading");
    }
  }

  // Init
  function init() {
    document.getElementById("meta-guide-text").textContent = DATA.meta.guide;
    renderGlossarySidebar("mobilitas sosial");
    renderTopic(state.activeTopicId);
    renderPgQuiz();
    renderEssayView();
    bindEvents();
    updateLockState();
    setActiveView(state.activeView);

    if (isQuizLocked()) {
      const lockTimer = setInterval(() => {
        if (!isQuizLocked()) {
          updateLockState();
          clearInterval(lockTimer);
        }
      }, 5000);
    }
  }

  init();
})();
