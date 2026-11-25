(function () {
  "use strict";

  const STORAGE_KEY = "ips8_pas_prep_v1";
  const DATA = window.IPS8_DATA;

  const DEFAULT_STATE = {
    studentName: "",
    activeView: "reading",
    activeTopicId: "all",
    quizMode: "practice", // 'practice' | 'exam'
    pgFilter: "all",      // 'all' | 'Topik 1' | 'Topik 3'
    examSubmitted: false,
    pgAnswers: {},        // { [questionId]: optionIndex }
    essayAnswers: {},     // { [questionId]: string }
    essayScores: {},      // { [questionId]: number }
    revealedRubrics: {}   // { [questionId]: boolean }
  };

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
    let answered = 0;
    let correct = 0;
    DATA.mcQuestions.forEach((q) => {
      const sel = state.pgAnswers[q.id];
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
    const validViews = ["reading", "quiz-pg", "quiz-essay"];
    const nextView = validViews.includes(viewName) ? viewName : "reading";
    state.activeView = nextView;
    saveState();

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
            ${sectionsHtml}
          </article>`;
      })
      .join("");
  }

  // Render PG Quiz View
  function renderPgQuiz() {
    const pg = calculatePgMetrics();
    const canReveal = state.quizMode === "practice" || state.examSubmitted;

    document.getElementById("pg-answered-count").textContent = `Terjawab: ${pg.answered} / ${DATA.mcQuestions.length}`;
    document.getElementById("pg-score-badge").textContent = canReveal
      ? `Skor PG: ${pg.score} / 50 (${pg.correct} benar)`
      : `Skor PG: Menunggu selesai ujian`;

    const submitExamBtn = document.getElementById("submit-exam-btn");
    submitExamBtn.classList.toggle("hidden", state.quizMode !== "exam" || state.examSubmitted);

    document.querySelectorAll("[data-quiz-mode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.quizMode === state.quizMode);
    });

    document.querySelectorAll("[data-pg-filter]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.pgFilter === state.pgFilter);
    });

    // Navigator Grid
    const navGrid = document.getElementById("pg-nav-grid");
    navGrid.innerHTML = DATA.mcQuestions
      .map((q) => {
        const sel = state.pgAnswers[q.id];
        let cls = "";
        if (typeof sel === "number") {
          if (canReveal) {
            cls = sel === q.correctIndex ? "is-correct" : "is-wrong";
          } else {
            cls = "is-answered";
          }
        }
        return `<button type="button" class="pg-num-btn ${cls}" data-scroll-q="${q.id}">${q.id}</button>`;
      })
      .join("");

    // Filtered Questions
    const filtered = DATA.mcQuestions.filter((q) =>
      state.pgFilter === "all" ? true : q.topic === state.pgFilter
    );

    const letters = ["A", "B", "C", "D"];
    const qContainer = document.getElementById("pg-questions-container");
    qContainer.innerHTML = filtered
      .map((q) => {
        const sel = state.pgAnswers[q.id];
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
              <span class="q-num-badge">Soal ${q.id}</span>
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
        state.quizMode = btn.dataset.quizMode;
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
      state.pgAnswers = {};
      state.examSubmitted = false;
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
      state.pgAnswers[qId] = optIdx;
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
  }

  // Init
  function init() {
    document.getElementById("meta-guide-text").textContent = DATA.meta.guide;
    renderGlossarySidebar("mobilitas sosial");
    renderTopic(state.activeTopicId);
    renderPgQuiz();
    renderEssayView();
    bindEvents();
    setActiveView(state.activeView);
  }

  init();
})();
