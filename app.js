(function () {
  "use strict";

  const STORAGE_KEY = "elfin5_explorer_journal_v1";
  const MIN_WORDS = 200;
  const MISSIONS = window.MISSIONS_DATA || [];

  let state = loadState();
  let currentMissionId = null;
  let activeGlossaryTerm = null;
  let speechRate = 1.0;
  let isSpeaking = false;
  let speechQueueToken = 0;

  // DOM References
  const hubView = document.getElementById("hub-view");
  const missionView = document.getElementById("mission-view");
  const reportView = document.getElementById("report-view");

  const brandHomeBtn = document.getElementById("brand-home-btn");
  const studentNameInput = document.getElementById("student-name-input");
  const studentClassInput = document.getElementById("student-class-input");
  const overallProgressText = document.getElementById("overall-progress-text");
  const openReportBtn = document.getElementById("open-report-btn");

  const hubCompletedCount = document.getElementById("hub-completed-count");
  const hubTotalWords = document.getElementById("hub-total-words");
  const hubStarsCount = document.getElementById("hub-stars-count");
  const hubRankLabel = document.getElementById("hub-rank-label");
  const missionsGrid = document.getElementById("missions-grid");
  const filterPills = document.querySelectorAll(".filter-pill");

  const backToHubBtn = document.getElementById("back-to-hub-btn");
  const missionStepper = document.getElementById("mission-stepper");
  const missionBanner = document.getElementById("mission-banner");
  const readingTimePill = document.getElementById("reading-time-pill");
  const readingMotionStage = document.getElementById("reading-motion-stage");
  const readingSectionsEl = document.getElementById("reading-sections");
  const glossaryActiveBox = document.getElementById("glossary-active-box");
  const glossaryChipsEl = document.getElementById("glossary-chips");
  const grammarCardEl = document.getElementById("grammar-card");

  const audioControlsEl = document.getElementById("audio-controls");
  const ttsToggleBtn = document.getElementById("tts-toggle-btn");
  const ttsBtnLabel = document.getElementById("tts-btn-label");
  const ttsSpeedBtn = document.getElementById("tts-speed-btn");

  const warmupScorePill = document.getElementById("warmup-score-pill");
  const warmupQuestionsList = document.getElementById("warmup-questions-list");

  const promptCallout = document.getElementById("prompt-callout");
  const outlineChecklist = document.getElementById("outline-checklist");
  const starterChipsEl = document.getElementById("starter-chips");
  const powerWordsGrid = document.getElementById("power-words-grid");
  const essayTextarea = document.getElementById("essay-textarea");
  const draftSaveStatus = document.getElementById("draft-save-status");
  const wordMeterBox = document.getElementById("word-meter-box");
  const liveWordCount = document.getElementById("live-word-count");
  const liveSentenceCount = document.getElementById("live-sentence-count");
  const livePowerCount = document.getElementById("live-power-count");
  const wordProgressTrack = document.getElementById("word-progress-track");
  const wordProgressFill = document.getElementById("word-progress-fill");
  const wordMeterMessage = document.getElementById("word-meter-message");
  const clearDraftBtn = document.getElementById("clear-draft-btn");
  const submitAnswerBtn = document.getElementById("submit-answer-btn");
  const submissionFeedback = document.getElementById("submission-feedback");

  const prevMissionBtn = document.getElementById("prev-mission-btn");
  const nextMissionBtn = document.getElementById("next-mission-btn");

  const reportBackBtn = document.getElementById("report-back-btn");
  const copyReportBtn = document.getElementById("copy-report-btn");
  const downloadReportBtn = document.getElementById("download-report-btn");
  const printReportBtn = document.getElementById("print-report-btn");
  const reportSheet = document.getElementById("report-sheet");

  const confirmModal = document.getElementById("confirm-modal");
  const confirmCancelBtn = document.getElementById("confirm-cancel-btn");
  const confirmProceedBtn = document.getElementById("confirm-proceed-btn");

  // ---------- Utilities ----------

  function defaultMissionState() {
    return {
      draft: "",
      submittedText: "",
      submittedAt: null,
      warmupAnswers: {},
      checkedOutline: []
    };
  }

  function loadState() {
    const base = {
      studentName: "",
      studentClass: "",
      activeFilter: "all",
      missions: {}
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          base.studentName = typeof parsed.studentName === "string" ? parsed.studentName : "";
          base.studentClass = typeof parsed.studentClass === "string" ? parsed.studentClass : "";
          base.activeFilter = ["all", "pending", "done"].includes(parsed.activeFilter) ? parsed.activeFilter : "all";
          if (parsed.missions && typeof parsed.missions === "object") {
            base.missions = parsed.missions;
          }
        }
      }
    } catch (_) {
      // Ignore storage read errors (e.g. private mode restrictions)
    }
    MISSIONS.forEach((m) => {
      if (!base.missions[m.id]) {
        base.missions[m.id] = defaultMissionState();
      } else {
        base.missions[m.id] = Object.assign(defaultMissionState(), base.missions[m.id]);
      }
    });
    return base;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
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

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function countWords(text) {
    const trimmed = String(text || "").trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  function countSentences(text) {
    const trimmed = String(text || "").trim();
    if (!trimmed) return 0;
    const matches = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    return matches.length;
  }

  function getUsedPowerWords(text, powerWords) {
    const lower = String(text || "");
    if (!lower.trim()) return [];
    return powerWords.filter((pw) => {
      const rx = new RegExp("\\b" + escapeRegExp(pw) + "\\b", "i");
      return rx.test(lower);
    });
  }

  function isMissionSubmitted(missionId) {
    const ms = state.missions[missionId];
    return Boolean(ms && ms.submittedText && countWords(ms.submittedText) >= MIN_WORDS);
  }

  function getWarmupStars(mission) {
    const ms = state.missions[mission.id];
    let stars = 0;
    mission.warmup.forEach((q, idx) => {
      if (ms.warmupAnswers[idx] === q.correctIndex) {
        stars += 1;
      }
    });
    return stars;
  }

  function getSummaryStats() {
    let completed = 0;
    let totalWords = 0;
    let totalStars = 0;
    const maxStars = MISSIONS.reduce((acc, m) => acc + m.warmup.length, 0);

    MISSIONS.forEach((m) => {
      const ms = state.missions[m.id];
      const text = ms.submittedText || ms.draft || "";
      totalWords += countWords(text);
      if (isMissionSubmitted(m.id)) {
        completed += 1;
      }
      totalStars += getWarmupStars(m);
    });

    let rank = "Curiosity Scout";
    if (completed >= 6) rank = "Grand Semester Champion";
    else if (completed >= 4) rank = "Master Story Explorer";
    else if (completed >= 2) rank = "Knowledge Builder";
    else if (completed >= 1 || totalWords >= 200) rank = "Brave Idea Writer";

    return { completed, totalWords, totalStars, maxStars, rank };
  }

  function stripVocabTokens(text) {
    return String(text || "").replace(/\{\{([^}]+)\}\}/g, "$1");
  }

  // ---------- Speech Synthesis (Read Aloud) ----------

  function stopSpeech() {
    speechQueueToken += 1;
    isSpeaking = false;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    document.querySelectorAll(".reading-section-block.is-speaking").forEach((el) => {
      el.classList.remove("is-speaking");
    });
    if (ttsBtnLabel) {
      ttsBtnLabel.textContent = "Read Aloud";
    }
  }

  function startSpeechForMission(mission) {
    if (!("speechSynthesis" in window)) return;
    stopSpeech();

    const token = ++speechQueueToken;
    isSpeaking = true;
    ttsBtnLabel.textContent = "Stop Reading";

    const sectionNodes = Array.from(readingSectionsEl.querySelectorAll(".reading-section-block"));
    let idx = 0;

    function speakNext() {
      if (token !== speechQueueToken || idx >= mission.sections.length) {
        if (token === speechQueueToken) {
          stopSpeech();
        }
        return;
      }

      sectionNodes.forEach((n, i) => n.classList.toggle("is-speaking", i === idx));
      const sec = mission.sections[idx];
      const spokenParts = [sec.heading, ...sec.paragraphs.map(stripVocabTokens)];
      if (sec.factBox) {
        spokenParts.push(sec.factBox.title + ". " + sec.factBox.text);
      }

      const utter = new SpeechSynthesisUtterance(spokenParts.join(". "));
      utter.lang = "en-US";
      utter.rate = speechRate;
      utter.onend = () => {
        idx += 1;
        speakNext();
      };
      utter.onerror = () => {
        if (token === speechQueueToken) {
          stopSpeech();
        }
      };

      window.speechSynthesis.speak(utter);
    }

    speakNext();
  }

  // ---------- View Switching ----------

  function showView(viewName) {
    stopSpeech();
    hubView.classList.toggle("hidden", viewName !== "hub");
    missionView.classList.toggle("hidden", viewName !== "mission");
    reportView.classList.toggle("hidden", viewName !== "report");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- Render Hub ----------

  function renderGlobalStats() {
    const stats = getSummaryStats();
    overallProgressText.textContent = `${stats.completed} / ${MISSIONS.length} Completed`;
    hubCompletedCount.textContent = `${stats.completed} / ${MISSIONS.length}`;
    hubTotalWords.textContent = stats.totalWords.toLocaleString();
    hubStarsCount.textContent = `${stats.totalStars} / ${stats.maxStars}`;
    hubRankLabel.textContent = stats.rank;
  }

  function renderHub() {
    renderGlobalStats();

    filterPills.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.filter === state.activeFilter);
    });

    const filtered = MISSIONS.filter((m) => {
      const done = isMissionSubmitted(m.id);
      if (state.activeFilter === "done") return done;
      if (state.activeFilter === "pending") return !done;
      return true;
    });

    if (filtered.length === 0) {
      missionsGrid.innerHTML = `
        <div class="mission-card" style="grid-column: 1 / -1; text-align: center; padding: 36px;">
          <h3>No missions match this filter yet</h3>
          <p class="mission-card-desc">Switch back to "All Missions" to view all 6 Grade 5 review challenges.</p>
        </div>
      `;
      return;
    }

    missionsGrid.innerHTML = filtered
      .map((m) => {
        const ms = state.missions[m.id];
        const done = isMissionSubmitted(m.id);
        const draftWords = countWords(ms.draft);
        const submittedWords = countWords(ms.submittedText);
        const stars = getWarmupStars(m);

        let badgeClass = "status-new";
        let badgeText = "Not Started";
        let btnText = "Start Mission";

        if (done) {
          badgeClass = "status-done";
          badgeText = `Completed (${submittedWords} words)`;
          btnText = "Review or Edit";
        } else if (draftWords > 0) {
          badgeClass = "status-draft";
          badgeText = `Draft (${draftWords} / ${MIN_WORDS} words)`;
          btnText = "Continue Writing";
        }

        return `
          <article class="mission-card ${done ? "is-done" : ""}">
            <div class="mission-card-top">
              <div class="mission-card-icon-wrap">
                <div class="mission-svg-badge">${m.iconSvg}</div>
                <div>
                  <span class="mission-unit-tag">Mission ${m.number} • ${escapeHtml(m.unitsLabel)}</span>
                  <h3>${escapeHtml(m.title)}</h3>
                </div>
              </div>
              <span class="status-badge ${badgeClass}">${escapeHtml(badgeText)}</span>
            </div>
            <p class="mission-card-desc">${escapeHtml(m.teaser)}</p>
            <div class="mission-card-meta">
              <span class="mission-mini-progress">
                ${escapeHtml(m.readTime)} • Clue Stars: ${stars}/${m.warmup.length}
              </span>
              <button type="button" class="btn ${done ? "btn-secondary" : "btn-primary"} btn-sm open-mission-btn" data-mission-id="${escapeHtml(m.id)}">
                ${escapeHtml(btnText)}
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    missionsGrid.querySelectorAll(".open-mission-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openMission(btn.dataset.missionId);
      });
    });
  }

  // ---------- Render Active Mission ----------

  function renderParagraphWithVocab(text) {
    const parts = String(text).split(/(\{\{[^}]+\}\})/g);
    return parts
      .map((part) => {
        if (part.startsWith("{{") && part.endsWith("}}")) {
          const termKey = part.slice(2, -2);
          return `<button type="button" class="vocab-term" data-term="${escapeHtml(termKey)}">${escapeHtml(termKey)}</button>`;
        }
        return escapeHtml(part);
      })
      .join("");
  }

  function selectGlossaryTerm(mission, termKey) {
    const entry = mission.glossary[termKey];
    if (!entry) return;
    activeGlossaryTerm = termKey;

    glossaryActiveBox.innerHTML = `
      <div class="glossary-word-title">
        ${escapeHtml(termKey)}
        <span class="glossary-word-pos">(${escapeHtml(entry.pos)})</span>
      </div>
      <p class="glossary-word-def">${escapeHtml(entry.def)}</p>
      <p class="glossary-word-ex">Example: "${escapeHtml(entry.ex)}"</p>
    `;

    document.querySelectorAll(".vocab-term").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.term === termKey);
    });
    document.querySelectorAll(".glossary-chip").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.term === termKey);
    });
  }

  function renderWarmup(mission) {
    const ms = state.missions[mission.id];
    const stars = getWarmupStars(mission);
    warmupScorePill.textContent = `${stars} / ${mission.warmup.length} Stars`;

    warmupQuestionsList.innerHTML = mission.warmup
      .map((q, qIdx) => {
        const chosen = ms.warmupAnswers[qIdx];
        const hasAnswered = typeof chosen === "number";
        const isCorrect = chosen === q.correctIndex;

        const optionsHtml = q.options
          .map((opt, oIdx) => {
            let cls = "warmup-opt-btn";
            if (hasAnswered) {
              if (oIdx === q.correctIndex) cls += " is-correct";
              else if (oIdx === chosen) cls += " is-wrong";
            }
            return `
              <button type="button" class="${cls}" data-q-idx="${qIdx}" data-o-idx="${oIdx}">
                ${escapeHtml(opt)}
              </button>
            `;
          })
          .join("");

        const feedbackHtml = hasAnswered
          ? `<div class="warmup-feedback ${isCorrect ? "is-good" : ""}">
               ${isCorrect ? escapeHtml(q.explanation) : "Not quite — look at the green answer above and check the reading clues!"}
             </div>`
          : "";

        return `
          <div class="warmup-item">
            <div class="warmup-q-title">${qIdx + 1}. ${escapeHtml(q.question)}</div>
            <div class="warmup-options">${optionsHtml}</div>
            ${feedbackHtml}
          </div>
        `;
      })
      .join("");

    warmupQuestionsList.querySelectorAll(".warmup-opt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qIdx = Number(btn.dataset.qIdx);
        const oIdx = Number(btn.dataset.oIdx);
        state.missions[mission.id].warmupAnswers[qIdx] = oIdx;
        saveState();
        renderWarmup(mission);
        renderGlobalStats();
      });
    });
  }

  function updateWritingMetrics(mission) {
    const text = essayTextarea.value;
    const words = countWords(text);
    const sentences = countSentences(text);
    const usedPower = getUsedPowerWords(text, mission.powerWords);

    liveWordCount.textContent = String(words);
    liveSentenceCount.textContent = `${sentences} ${sentences === 1 ? "sentence" : "sentences"}`;
    livePowerCount.textContent = `${usedPower.length} / ${mission.powerWords.length} power words used`;

    const pct = Math.min(100, Math.round((words / MIN_WORDS) * 100));
    wordProgressFill.style.width = `${pct}%`;
    wordProgressTrack.setAttribute("aria-valuenow", String(Math.min(words, MIN_WORDS)));

    const goalMet = words >= MIN_WORDS;
    wordMeterBox.classList.toggle("goal-met", goalMet);

    // Highlight power word pills live
    const usedSet = new Set(usedPower);
    powerWordsGrid.querySelectorAll(".power-word-pill").forEach((pill) => {
      pill.classList.toggle("is-used", usedSet.has(pill.dataset.word));
    });

    const ms = state.missions[mission.id];
    const alreadySubmitted = isMissionSubmitted(mission.id);

    if (goalMet) {
      wordMeterMessage.textContent = `Awesome work! You reached ${words} words (past the ${MIN_WORDS}-word goal).`;
      submitAnswerBtn.disabled = false;
      submitAnswerBtn.textContent = alreadySubmitted && ms.submittedText === text
        ? "Answer Submitted (Click to Re-save)"
        : alreadySubmitted
          ? "Update Submitted Answer"
          : "Submit My Answer";
    } else {
      const remaining = MIN_WORDS - words;
      wordMeterMessage.textContent = `Keep going! Write ${remaining} more ${remaining === 1 ? "word" : "words"} using the checklist and reading clues.`;
      submitAnswerBtn.disabled = true;
      submitAnswerBtn.textContent = `Write ${remaining} more ${remaining === 1 ? "word" : "words"} to submit`;
    }
  }

  function renderSubmissionFeedback(mission) {
    const ms = state.missions[mission.id];
    if (!isMissionSubmitted(mission.id)) {
      submissionFeedback.classList.add("hidden");
      submissionFeedback.innerHTML = "";
      return;
    }

    const words = countWords(ms.submittedText);
    const usedPower = getUsedPowerWords(ms.submittedText, mission.powerWords);
    const stars = getWarmupStars(mission);

    submissionFeedback.classList.remove("hidden");
    submissionFeedback.innerHTML = `
      <h4>Mission ${mission.number} Saved as Completed!</h4>
      <p>
        You wrote <strong>${words} words</strong>, used <strong>${usedPower.length} key Elfin 5 power words</strong>, and earned <strong>${stars}/${mission.warmup.length} Clue Stars</strong>. You can keep editing anytime or open <strong>My Report</strong> at the top to print or download your work.
      </p>
    `;
  }

  function insertTextAtCursor(snippet) {
    const el = essayTextarea;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);

    const needsLeadingSpace = before.length > 0 && !/[\s\n]$/.test(before);
    const needsTrailingSpace = after.length > 0 && !/^[\s\n.,!?]/.test(after);
    const inserted = (needsLeadingSpace ? " " : "") + snippet + (needsTrailingSpace ? " " : "");

    el.value = before + inserted + after;
    const newPos = before.length + inserted.length;
    el.focus();
    el.setSelectionRange(newPos, newPos);

    el.dispatchEvent(new Event("input"));
  }

  function openMission(missionId) {
    const missionIdx = MISSIONS.findIndex((m) => m.id === missionId);
    if (missionIdx === -1) return;

    const mission = MISSIONS[missionIdx];
    currentMissionId = mission.id;
    activeGlossaryTerm = null;
    showView("mission");

    // Stepper
    missionStepper.innerHTML = MISSIONS.map((m) => {
      const current = m.id === mission.id;
      const done = isMissionSubmitted(m.id);
      return `<button type="button" class="stepper-btn ${current ? "is-current" : ""} ${done ? "is-done" : ""}" data-mission-id="${escapeHtml(m.id)}" title="Mission ${m.number}: ${escapeHtml(m.title)}">${m.number}</button>`;
    }).join("");

    missionStepper.querySelectorAll(".stepper-btn").forEach((btn) => {
      btn.addEventListener("click", () => openMission(btn.dataset.missionId));
    });

    // Banner
    missionBanner.innerHTML = `
      <div class="banner-copy">
        <span class="mission-unit-tag">Mission ${mission.number} of ${MISSIONS.length} • ${escapeHtml(mission.unitsLabel)}</span>
        <h1>${escapeHtml(mission.title)}</h1>
        <p>${escapeHtml(mission.teaser)}</p>
      </div>
      <div class="banner-illustration">${mission.iconSvg}</div>
    `;

    readingTimePill.textContent = mission.readTime;

    if (window.ElfinMotion && typeof window.ElfinMotion.renderMotionStage === "function") {
      window.ElfinMotion.renderMotionStage(mission.id, readingMotionStage);
    }

    // Reading Sections
    readingSectionsEl.innerHTML = mission.sections
      .map((sec) => {
        const pHtml = sec.paragraphs.map((p) => `<p>${renderParagraphWithVocab(p)}</p>`).join("");
        const factHtml = sec.factBox
          ? `<div class="fact-box"><strong>${escapeHtml(sec.factBox.title)}</strong><span>${escapeHtml(sec.factBox.text)}</span></div>`
          : "";
        return `
          <section class="reading-section-block">
            <h3>${escapeHtml(sec.heading)}</h3>
            ${pHtml}
            ${factHtml}
          </section>
        `;
      })
      .join("");

    readingSectionsEl.querySelectorAll(".vocab-term").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectGlossaryTerm(mission, btn.dataset.term);
      });
    });

    if (window.ElfinMotion && typeof window.ElfinMotion.observeReadingReveals === "function") {
      window.ElfinMotion.observeReadingReveals(readingSectionsEl);
    }

    // Glossary Sidebar
    glossaryActiveBox.innerHTML = `<p class="glossary-placeholder">Click any highlighted word in the reading passage to see its definition and example sentence.</p>`;
    const glossaryKeys = Object.keys(mission.glossary);
    glossaryChipsEl.innerHTML = glossaryKeys
      .map((k) => `<button type="button" class="glossary-chip" data-term="${escapeHtml(k)}">${escapeHtml(k)}</button>`)
      .join("");

    glossaryChipsEl.querySelectorAll(".glossary-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectGlossaryTerm(mission, btn.dataset.term);
      });
    });

    // Grammar Card
    grammarCardEl.innerHTML = `
      <div class="sidebar-card-head">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"/>
        </svg>
        <h3>${escapeHtml(mission.grammarBox.title)}</h3>
      </div>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${escapeHtml(mission.grammarBox.tip)}</p>
      <div class="grammar-example">${escapeHtml(mission.grammarBox.example)}</div>
    `;

    // Warmup
    renderWarmup(mission);

    // Challenge Prompt
    promptCallout.innerHTML = `
      <div class="prompt-callout-label">Your Writing Challenge (Minimum ${MIN_WORDS} Words)</div>
      <blockquote>${escapeHtml(mission.prompt)}</blockquote>
    `;

    // Outline Checklist
    const ms = state.missions[mission.id];
    outlineChecklist.innerHTML = mission.outline
      .map((item, idx) => {
        const checked = ms.checkedOutline.includes(idx);
        return `
          <label class="checklist-item ${checked ? "is-checked" : ""}">
            <input type="checkbox" data-outline-idx="${idx}" ${checked ? "checked" : ""}>
            <span>${escapeHtml(item)}</span>
          </label>
        `;
      })
      .join("");

    outlineChecklist.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        const idx = Number(cb.dataset.outlineIdx);
        const list = state.missions[mission.id].checkedOutline;
        if (cb.checked && !list.includes(idx)) {
          list.push(idx);
        } else if (!cb.checked) {
          state.missions[mission.id].checkedOutline = list.filter((i) => i !== idx);
        }
        cb.closest(".checklist-item").classList.toggle("is-checked", cb.checked);
        saveState();
      });
    });

    // Starters
    starterChipsEl.innerHTML = mission.starters
      .map((s) => `<button type="button" class="starter-chip-btn">${escapeHtml(s)}</button>`)
      .join("");

    starterChipsEl.querySelectorAll(".starter-chip-btn").forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        insertTextAtCursor(mission.starters[idx]);
      });
    });

    // Power Words
    powerWordsGrid.innerHTML = mission.powerWords
      .map((pw) => `<button type="button" class="power-word-pill" data-word="${escapeHtml(pw)}" title="Click to insert word">${escapeHtml(pw)}</button>`)
      .join("");

    powerWordsGrid.querySelectorAll(".power-word-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        insertTextAtCursor(btn.dataset.word);
      });
    });

    // Editor value
    essayTextarea.value = ms.draft || ms.submittedText || "";
    draftSaveStatus.textContent = ms.draft || ms.submittedText ? "Saved draft loaded" : "Ready to write";
    updateWritingMetrics(mission);
    renderSubmissionFeedback(mission);

    // Footer Prev / Next
    prevMissionBtn.disabled = missionIdx === 0;
    nextMissionBtn.disabled = missionIdx === MISSIONS.length - 1;
    prevMissionBtn.onclick = () => {
      if (missionIdx > 0) openMission(MISSIONS[missionIdx - 1].id);
    };
    nextMissionBtn.onclick = () => {
      if (missionIdx < MISSIONS.length - 1) openMission(MISSIONS[missionIdx + 1].id);
    };
  }

  // ---------- Render Report View ----------

  function buildPlainTextReport() {
    const stats = getSummaryStats();
    const name = state.studentName.trim() || "Grade 5 Student";
    const cls = state.studentClass.trim() || "-";
    const lines = [
      "ELFIN 5 EXPLORER JOURNAL — SEMESTER REVIEW REPORT",
      `Student: ${name} | Class: ${cls}`,
      `Completed Missions: ${stats.completed} / ${MISSIONS.length} | Total Words: ${stats.totalWords} | Clue Stars: ${stats.totalStars} / ${stats.maxStars}`,
      "=".repeat(64),
      ""
    ];

    MISSIONS.forEach((m) => {
      const ms = state.missions[m.id];
      const text = (ms.submittedText || ms.draft || "").trim();
      const words = countWords(text);
      const status = isMissionSubmitted(m.id) ? "COMPLETED" : words > 0 ? "DRAFT" : "NOT STARTED";

      lines.push(`MISSION ${m.number}: ${m.title} (${m.unitsLabel})`);
      lines.push(`Status: ${status} | Words: ${words}`);
      lines.push(`Question: ${m.prompt}`);
      lines.push("Answer:");
      lines.push(text || "[No response written yet]");
      lines.push("-".repeat(64));
      lines.push("");
    });

    return lines.join("\n");
  }

  function renderReport() {
    showView("report");
    const stats = getSummaryStats();
    const name = state.studentName.trim() || "Grade 5 Student";
    const cls = state.studentClass.trim() || "Not set";
    const dateLabel = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const blocksHtml = MISSIONS.map((m) => {
      const ms = state.missions[m.id];
      const text = (ms.submittedText || ms.draft || "").trim();
      const words = countWords(text);
      const done = isMissionSubmitted(m.id);

      const badgeHtml = done
        ? `<span class="status-badge status-done">Completed (${words} words)</span>`
        : words > 0
          ? `<span class="status-badge status-draft">Draft (${words} / ${MIN_WORDS} words)</span>`
          : `<span class="status-badge status-new">Not Started</span>`;

      return `
        <article class="report-mission-block">
          <div class="report-mission-head">
            <div>
              <span class="mission-unit-tag">Mission ${m.number} • ${escapeHtml(m.unitsLabel)}</span>
              <h3>${escapeHtml(m.title)}</h3>
            </div>
            ${badgeHtml}
          </div>
          <div class="report-prompt-text">${escapeHtml(m.prompt)}</div>
          ${
            text
              ? `<p class="report-answer-text">${escapeHtml(text)}</p>`
              : `<p class="report-empty-note">No answer written yet for this mission.</p>`
          }
        </article>
      `;
    }).join("");

    reportSheet.innerHTML = `
      <div class="report-header">
        <div>
          <h1>Elfin 5 Semester Review Report</h1>
          <p class="report-meta-line">
            <strong>Student:</strong> ${escapeHtml(name)} &nbsp;•&nbsp;
            <strong>Class:</strong> ${escapeHtml(cls)} &nbsp;•&nbsp;
            <strong>Date:</strong> ${escapeHtml(dateLabel)}
          </p>
        </div>
        <div class="progress-pill">
          <span class="pill-dot" aria-hidden="true"></span>
          <span>${stats.completed} / ${MISSIONS.length} Missions • ${stats.totalWords} Words</span>
        </div>
      </div>
      ${blocksHtml}
    `;
  }

  // ---------- Event Wiring ----------

  function init() {
    studentNameInput.value = state.studentName;
    studentClassInput.value = state.studentClass;

    studentNameInput.addEventListener("input", () => {
      state.studentName = studentNameInput.value;
      saveState();
    });

    studentClassInput.addEventListener("input", () => {
      state.studentClass = studentClassInput.value;
      saveState();
    });

    brandHomeBtn.addEventListener("click", () => {
      currentMissionId = null;
      showView("hub");
      renderHub();
    });

    backToHubBtn.addEventListener("click", () => {
      currentMissionId = null;
      showView("hub");
      renderHub();
    });

    openReportBtn.addEventListener("click", renderReport);

    reportBackBtn.addEventListener("click", () => {
      if (currentMissionId) {
        openMission(currentMissionId);
      } else {
        showView("hub");
        renderHub();
      }
    });

    filterPills.forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeFilter = btn.dataset.filter;
        saveState();
        renderHub();
      });
    });

    // Audio Controls
    if (!("speechSynthesis" in window)) {
      audioControlsEl.classList.add("hidden");
    } else {
      ttsToggleBtn.addEventListener("click", () => {
        const mission = MISSIONS.find((m) => m.id === currentMissionId);
        if (!mission) return;
        if (isSpeaking) {
          stopSpeech();
        } else {
          startSpeechForMission(mission);
        }
      });

      ttsSpeedBtn.addEventListener("click", () => {
        speechRate = speechRate === 1.0 ? 0.85 : 1.0;
        ttsSpeedBtn.textContent = speechRate === 1.0 ? "1.0x" : "0.85x";
        if (isSpeaking) {
          const mission = MISSIONS.find((m) => m.id === currentMissionId);
          if (mission) startSpeechForMission(mission);
        }
      });
    }

    // Writing Editor
    essayTextarea.addEventListener("input", () => {
      if (!currentMissionId) return;
      const mission = MISSIONS.find((m) => m.id === currentMissionId);
      if (!mission) return;
      state.missions[mission.id].draft = essayTextarea.value;
      saveState();
      draftSaveStatus.textContent = "Draft saved";
      updateWritingMetrics(mission);
      renderGlobalStats();
    });

    submitAnswerBtn.addEventListener("click", () => {
      if (!currentMissionId) return;
      const mission = MISSIONS.find((m) => m.id === currentMissionId);
      if (!mission) return;

      const text = essayTextarea.value.trim();
      if (countWords(text) < MIN_WORDS) return;

      state.missions[mission.id].draft = essayTextarea.value;
      state.missions[mission.id].submittedText = text;
      state.missions[mission.id].submittedAt = new Date().toISOString();
      saveState();

      draftSaveStatus.textContent = "Submitted & saved";
      updateWritingMetrics(mission);
      renderSubmissionFeedback(mission);
      renderGlobalStats();

      // Update stepper completion dot
      missionStepper.querySelectorAll(".stepper-btn").forEach((btn) => {
        btn.classList.toggle("is-done", isMissionSubmitted(btn.dataset.missionId));
      });
    });

    // Clear Draft Modal
    clearDraftBtn.addEventListener("click", () => {
      confirmModal.classList.remove("hidden");
    });

    confirmCancelBtn.addEventListener("click", () => {
      confirmModal.classList.add("hidden");
    });

    confirmModal.addEventListener("click", (e) => {
      if (e.target === confirmModal) confirmModal.classList.add("hidden");
    });

    confirmProceedBtn.addEventListener("click", () => {
      confirmModal.classList.add("hidden");
      if (!currentMissionId) return;
      const mission = MISSIONS.find((m) => m.id === currentMissionId);
      if (!mission) return;

      state.missions[mission.id].draft = "";
      state.missions[mission.id].submittedText = "";
      state.missions[mission.id].submittedAt = null;
      saveState();

      essayTextarea.value = "";
      draftSaveStatus.textContent = "Draft cleared";
      updateWritingMetrics(mission);
      renderSubmissionFeedback(mission);
      renderGlobalStats();
      missionStepper.querySelectorAll(".stepper-btn").forEach((btn) => {
        btn.classList.toggle("is-done", isMissionSubmitted(btn.dataset.missionId));
      });
    });

    // Report Exports
    copyReportBtn.addEventListener("click", async () => {
      const txt = buildPlainTextReport();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(txt);
        } else {
          throw new Error("Fallback copy");
        }
      } catch (_) {
        const ta = document.createElement("textarea");
        ta.value = txt;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      const orig = copyReportBtn.textContent;
      copyReportBtn.textContent = "Copied!";
      setTimeout(() => {
        copyReportBtn.textContent = orig;
      }, 1800);
    });

    downloadReportBtn.addEventListener("click", () => {
      const txt = buildPlainTextReport();
      const safeName = (state.studentName.trim() || "grade5-student")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `elfin5-review-${safeName || "student"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    printReportBtn.addEventListener("click", () => {
      window.print();
    });

    window.addEventListener("beforeunload", stopSpeech);

    renderHub();
  }

  init();
})();
