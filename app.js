(function () {
  "use strict";

  const STORAGE_KEY = "elfin5_explorer_journal_v1";
  const MIN_WORDS = 100;
  const ADMIN_PASSWORD = "qw3rty";
  const MISSIONS = window.MISSIONS_DATA || [];
  const CLASS_STUDENTS = [
    "Ariella",
    "Mclayreen",
    "Oscar",
    "Kenzi",
    "Josephine",
    "Andryan",
    "Gabriel",
    "Galvan",
    "Yael",
    "Angelica",
    "Sophie",
    "Nehemiah",
    "Ansell",
    "Chloe",
    "Brienna"
  ];

  let state = loadState();
  let currentMissionId = null;
  let activeGlossaryTerm = null;
  let speechRate = 1.0;
  let isSpeaking = false;
  let speechQueueToken = 0;
  let isAdminUnlocked = false;

  // DOM References
  const welcomeView = document.getElementById("welcome-view");
  const hubView = document.getElementById("hub-view");
  const missionView = document.getElementById("mission-view");
  const reportView = document.getElementById("report-view");
  const adminView = document.getElementById("admin-view");

  const brandHomeBtn = document.getElementById("brand-home-btn");
  const topbarStatus = document.getElementById("topbar-status");
  const activeStudentBadge = document.getElementById("active-student-badge");
  const switchStudentBtn = document.getElementById("switch-student-btn");
  const overallProgressText = document.getElementById("overall-progress-text");
  const openReportBtn = document.getElementById("open-report-btn");

  const welcomeStudentSelect = document.getElementById("welcome-student-select");
  const welcomeStudentPreview = document.getElementById("welcome-student-preview");
  const startSeriesBtn = document.getElementById("start-series-btn");

  const hubGreetingTitle = document.getElementById("hub-greeting-title");
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

  const topbarAdminBtn = document.getElementById("topbar-admin-btn");
  const welcomeAdminBtn = document.getElementById("welcome-admin-btn");
  const adminLoginModal = document.getElementById("admin-login-modal");
  const adminLoginForm = document.getElementById("admin-login-form");
  const adminPasswordInput = document.getElementById("admin-password-input");
  const adminLoginError = document.getElementById("admin-login-error");
  const adminModalCancelBtn = document.getElementById("admin-modal-cancel-btn");

  const adminKpiGrid = document.getElementById("admin-kpi-grid");
  const adminStudentFilter = document.getElementById("admin-student-filter");
  const adminMissionFilter = document.getElementById("admin-mission-filter");
  const adminStatusFilter = document.getElementById("admin-status-filter");
  const adminRosterTbody = document.getElementById("admin-roster-tbody");
  const adminSubmissionsList = document.getElementById("admin-submissions-list");
  const adminExportCsvBtn = document.getElementById("admin-export-csv-btn");
  const adminExportJsonBtn = document.getElementById("admin-export-json-btn");
  const adminImportJsonInput = document.getElementById("admin-import-json-input");
  const adminPrintBtn = document.getElementById("admin-print-btn");
  const adminLogoutBtn = document.getElementById("admin-logout-btn");

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

  function createEmptyMissionsMap() {
    const map = {};
    MISSIONS.forEach((m) => {
      map[m.id] = defaultMissionState();
    });
    return map;
  }

  function normalizeMissionsMap(rawMissions) {
    const map = createEmptyMissionsMap();
    if (rawMissions && typeof rawMissions === "object") {
      MISSIONS.forEach((m) => {
        if (rawMissions[m.id] && typeof rawMissions[m.id] === "object") {
          map[m.id] = Object.assign(defaultMissionState(), rawMissions[m.id]);
        }
      });
    }
    return map;
  }

  function loadState() {
    const base = {
      studentName: "",
      studentClass: "Grade 5",
      activeFilter: "all",
      missions: createEmptyMissionsMap(),
      profiles: {}
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          base.studentName = typeof parsed.studentName === "string" ? parsed.studentName : "";
          base.studentClass = typeof parsed.studentClass === "string" && parsed.studentClass ? parsed.studentClass : "Grade 5";
          base.activeFilter = ["all", "pending", "done"].includes(parsed.activeFilter) ? parsed.activeFilter : "all";
          if (parsed.profiles && typeof parsed.profiles === "object") {
            Object.keys(parsed.profiles).forEach((name) => {
              base.profiles[name] = normalizeMissionsMap(parsed.profiles[name]);
            });
          }
          if (base.studentName && base.profiles[base.studentName]) {
            base.missions = normalizeMissionsMap(base.profiles[base.studentName]);
          } else if (parsed.missions && typeof parsed.missions === "object") {
            base.missions = normalizeMissionsMap(parsed.missions);
            if (base.studentName) {
              base.profiles[base.studentName] = base.missions;
            }
          }
        }
      }
    } catch (_) {
      // Ignore storage read errors (e.g. private mode restrictions)
    }
    return base;
  }

  function saveState() {
    try {
      if (state.studentName) {
        state.profiles[state.studentName] = state.missions;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      // Ignore storage quota errors
    }
  }

  function selectStudentProfile(name) {
    if (state.studentName) {
      state.profiles[state.studentName] = state.missions;
    }
    state.studentName = name;
    state.studentClass = "Grade 5";
    if (!state.profiles[name]) {
      state.profiles[name] = createEmptyMissionsMap();
    }
    state.missions = normalizeMissionsMap(state.profiles[name]);
    saveState();
  }

  function getStatsForStudent(name) {
    const missionsMap =
      state.studentName === name
        ? state.missions
        : (state.profiles && state.profiles[name]) || createEmptyMissionsMap();
    let completed = 0;
    let drafts = 0;
    let totalWords = 0;
    let totalStars = 0;
    MISSIONS.forEach((m) => {
      const ms = missionsMap[m.id] || defaultMissionState();
      const text = (ms.submittedText || ms.draft || "").trim();
      const words = countWords(text);
      totalWords += words;
      if (ms.submittedText && countWords(ms.submittedText) >= MIN_WORDS) {
        completed += 1;
      } else if (words > 0) {
        drafts += 1;
      }
      m.warmup.forEach((q, idx) => {
        if (ms.warmupAnswers && ms.warmupAnswers[idx] === q.correctIndex) {
          totalStars += 1;
        }
      });
    });
    return { completed, drafts, totalWords, totalStars, missionsMap };
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
    else if (completed >= 1 || totalWords >= MIN_WORDS) rank = "Brave Idea Writer";

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
    if (welcomeView) welcomeView.classList.toggle("hidden", viewName !== "welcome");
    if (topbarStatus) topbarStatus.classList.toggle("hidden", viewName === "welcome" || viewName === "admin");
    hubView.classList.toggle("hidden", viewName !== "hub");
    missionView.classList.toggle("hidden", viewName !== "mission");
    reportView.classList.toggle("hidden", viewName !== "report");
    if (adminView) adminView.classList.toggle("hidden", viewName !== "admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderWelcome() {
    if (!welcomeStudentSelect) return;
    welcomeStudentSelect.innerHTML =
      `<option value="">-- Select Your Name --</option>` +
      CLASS_STUDENTS.map((name, i) => {
        const selected = state.studentName === name ? "selected" : "";
        return `<option value="${escapeHtml(name)}" ${selected}>${i + 1}. ${escapeHtml(name)}</option>`;
      }).join("");

    updateWelcomePreview();
  }

  function updateWelcomePreview() {
    const picked = welcomeStudentSelect ? welcomeStudentSelect.value : "";
    if (!picked) {
      startSeriesBtn.disabled = true;
      startSeriesBtn.querySelector("span").textContent = "Pick Your Name to Start the Series";
      welcomeStudentPreview.classList.add("hidden");
      welcomeStudentPreview.innerHTML = "";
      return;
    }

    const st = getStatsForStudent(picked);
    startSeriesBtn.disabled = false;
    startSeriesBtn.querySelector("span").textContent =
      st.completed > 0 || st.totalWords > 0
        ? `Continue Series as ${picked}`
        : `Start the Series as ${picked}`;

    welcomeStudentPreview.classList.remove("hidden");
    welcomeStudentPreview.innerHTML = `
      <strong>Explorer: ${escapeHtml(picked)} (Grade 5)</strong>
      <span>Saved progress on this device: <strong>${st.completed} / ${MISSIONS.length} missions completed</strong> • <strong>${st.totalWords} words written</strong></span>
    `;
  }

  // ---------- Render Hub ----------

  function renderGlobalStats() {
    const stats = getSummaryStats();
    if (activeStudentBadge) {
      activeStudentBadge.textContent = state.studentName || "Not Selected";
    }
    if (hubGreetingTitle) {
      hubGreetingTitle.textContent = state.studentName
        ? `Welcome, ${state.studentName}! Share Your Big Ideas!`
        : "Read the Clues, Then Share Your Big Ideas!";
    }
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

  // ---------- Admin Dashboard ----------

  function openAdminModal() {
    if (isAdminUnlocked) {
      openAdminDashboard();
      return;
    }
    adminPasswordInput.value = "";
    adminLoginError.classList.add("hidden");
    adminLoginModal.classList.remove("hidden");
    setTimeout(() => adminPasswordInput.focus(), 40);
  }

  function closeAdminModal() {
    adminLoginModal.classList.add("hidden");
    adminPasswordInput.value = "";
    adminLoginError.classList.add("hidden");
  }

  function populateAdminFilterDropdowns() {
    if (adminStudentFilter && adminStudentFilter.options.length <= 1) {
      adminStudentFilter.innerHTML =
        `<option value="all">All 15 Students</option>` +
        CLASS_STUDENTS.map((name, idx) => `<option value="${escapeHtml(name)}">${idx + 1}. ${escapeHtml(name)}</option>`).join("");
    }
    if (adminMissionFilter && adminMissionFilter.options.length <= 1) {
      adminMissionFilter.innerHTML =
        `<option value="all">All 6 Missions</option>` +
        MISSIONS.map((m) => `<option value="${escapeHtml(m.id)}">Mission ${m.number}: ${escapeHtml(m.title)}</option>`).join("");
    }
  }

  function openAdminDashboard() {
    saveState();
    populateAdminFilterDropdowns();
    renderAdminDashboard();
    showView("admin");
  }

  function renderAdminDashboard() {
    if (!adminView) return;

    let activeStudentsCount = 0;
    let classCompletedMissions = 0;
    let classTotalWords = 0;
    let classTotalStars = 0;
    const maxStarsPerStudent = MISSIONS.reduce((acc, m) => acc + m.warmup.length, 0);

    const studentRowsData = CLASS_STUDENTS.map((name, idx) => {
      const st = getStatsForStudent(name);
      if (st.completed > 0 || st.drafts > 0 || st.totalStars > 0) {
        activeStudentsCount += 1;
      }
      classCompletedMissions += st.completed;
      classTotalWords += st.totalWords;
      classTotalStars += st.totalStars;
      return {
        index: idx + 1,
        name,
        ...st
      };
    });

    adminKpiGrid.innerHTML = `
      <div class="stat-box">
        <span class="stat-label">Active Students</span>
        <strong class="stat-value">${activeStudentsCount} / ${CLASS_STUDENTS.length}</strong>
      </div>
      <div class="stat-box">
        <span class="stat-label">Missions Completed</span>
        <strong class="stat-value">${classCompletedMissions} / ${CLASS_STUDENTS.length * MISSIONS.length}</strong>
      </div>
      <div class="stat-box">
        <span class="stat-label">Class Words Written</span>
        <strong class="stat-value">${classTotalWords.toLocaleString()}</strong>
      </div>
      <div class="stat-box">
        <span class="stat-label">Class Clue Stars</span>
        <strong class="stat-value">${classTotalStars} / ${CLASS_STUDENTS.length * maxStarsPerStudent}</strong>
      </div>
    `;

    // Roster Table
    adminRosterTbody.innerHTML = studentRowsData
      .map((row) => {
        const badgeClass =
          row.completed === MISSIONS.length
            ? "status-done"
            : row.completed > 0 || row.drafts > 0
              ? "status-draft"
              : "status-new";
        return `
          <tr>
            <td class="mono-cell">${row.index}</td>
            <td><strong>${escapeHtml(row.name)}</strong></td>
            <td><span class="status-badge ${badgeClass}">${row.completed} / ${MISSIONS.length}</span></td>
            <td class="mono-cell">${row.drafts}</td>
            <td class="mono-cell">${row.totalWords.toLocaleString()} words</td>
            <td class="mono-cell">${row.totalStars} / ${maxStarsPerStudent}</td>
            <td class="no-print">
              <button type="button" class="btn btn-secondary btn-sm admin-focus-student-btn" data-student="${escapeHtml(row.name)}">
                View Answers
              </button>
            </td>
          </tr>
        `;
      })
      .join("");

    adminRosterTbody.querySelectorAll(".admin-focus-student-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        adminStudentFilter.value = btn.dataset.student;
        renderAdminDashboard();
        adminSubmissionsList.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Detailed Submissions Filtered
    const selectedStudent = adminStudentFilter ? adminStudentFilter.value : "all";
    const selectedMission = adminMissionFilter ? adminMissionFilter.value : "all";
    const selectedStatus = adminStatusFilter ? adminStatusFilter.value : "all";

    const filteredStudents = studentRowsData.filter((row) => {
      if (selectedStudent !== "all" && row.name !== selectedStudent) return false;
      if (selectedStatus === "active" && row.completed === 0 && row.drafts === 0 && row.totalStars === 0) return false;
      if (selectedStatus === "completed" && row.completed === 0) return false;
      return true;
    });

    if (filteredStudents.length === 0) {
      adminSubmissionsList.innerHTML = `
        <div class="mission-card" style="text-align: center; padding: 32px;">
          <h3>No student records match the current filter</h3>
          <p class="mission-card-desc">Switch the filters above back to "All 15 Students" to view everyone.</p>
        </div>
      `;
      return;
    }

    const missionsToShow = MISSIONS.filter((m) => selectedMission === "all" || m.id === selectedMission);

    adminSubmissionsList.innerHTML = filteredStudents
      .map((row) => {
        const missionCardsHtml = missionsToShow
          .map((m) => {
            const ms = row.missionsMap[m.id] || defaultMissionState();
            const text = (ms.submittedText || ms.draft || "").trim();
            const words = countWords(text);
            const done = Boolean(ms.submittedText && words >= MIN_WORDS);
            const usedPower = getUsedPowerWords(text, m.powerWords);
            let stars = 0;
            m.warmup.forEach((q, qIdx) => {
              if (ms.warmupAnswers && ms.warmupAnswers[qIdx] === q.correctIndex) stars += 1;
            });

            const statusBadge = done
              ? `<span class="status-badge status-done">Completed (${words} words)</span>`
              : words > 0
                ? `<span class="status-badge status-draft">Draft (${words} / ${MIN_WORDS} words)</span>`
                : `<span class="status-badge status-new">Not Started</span>`;

            const timeNote = ms.submittedAt
              ? `Submitted: ${new Date(ms.submittedAt).toLocaleString()}`
              : words > 0
                ? "Draft saved (not yet submitted)"
                : "No writing saved yet";

            return `
              <div class="admin-mission-answer-box">
                <div class="admin-mission-head">
                  <div>
                    <span class="mission-unit-tag">Mission ${m.number} • ${escapeHtml(m.unitsLabel)}</span>
                    <h4>${escapeHtml(m.title)}</h4>
                  </div>
                  ${statusBadge}
                </div>
                <div class="admin-mission-meta">
                  <span>${escapeHtml(timeNote)}</span>
                  <span>•</span>
                  <span>Clue Stars: ${stars}/${m.warmup.length}</span>
                  <span>•</span>
                  <span>Power Words: ${usedPower.length}/${m.powerWords.length}</span>
                </div>
                ${
                  text
                    ? `<div class="admin-answer-body">${escapeHtml(text)}</div>`
                    : `<p class="report-empty-note">No answer written yet.</p>`
                }
              </div>
            `;
          })
          .join("");

        return `
          <article class="admin-student-card">
            <div class="admin-student-card-head">
              <div>
                <span class="mission-unit-tag">Student #${row.index} • Grade 5</span>
                <h3>${escapeHtml(row.name)}</h3>
              </div>
              <div class="progress-pill">
                <span class="pill-dot" aria-hidden="true"></span>
                <span>${row.completed} / ${MISSIONS.length} Completed • ${row.totalWords} Words</span>
              </div>
            </div>
            <div class="admin-student-missions-grid">
              ${missionCardsHtml}
            </div>
          </article>
        `;
      })
      .join("");
  }

  function exportClassCsv() {
    saveState();
    const headers = [
      "Student Number",
      "Student Name",
      "Mission Number",
      "Mission Title",
      "Status",
      "Word Count",
      "Clue Stars",
      "Power Words Used",
      "Submitted At",
      "Answer Text"
    ];

    const escapeCsv = (val) => {
      const s = String(val ?? "").replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = [headers.map(escapeCsv).join(",")];
    CLASS_STUDENTS.forEach((name, idx) => {
      const st = getStatsForStudent(name);
      MISSIONS.forEach((m) => {
        const ms = st.missionsMap[m.id] || defaultMissionState();
        const text = (ms.submittedText || ms.draft || "").trim();
        const words = countWords(text);
        const done = Boolean(ms.submittedText && words >= MIN_WORDS);
        const status = done ? "Completed" : words > 0 ? "Draft" : "Not Started";
        const usedPower = getUsedPowerWords(text, m.powerWords);
        let stars = 0;
        m.warmup.forEach((q, qIdx) => {
          if (ms.warmupAnswers && ms.warmupAnswers[qIdx] === q.correctIndex) stars += 1;
        });

        rows.push(
          [
            idx + 1,
            name,
            m.number,
            m.title,
            status,
            words,
            `${stars}/${m.warmup.length}`,
            usedPower.join("; "),
            ms.submittedAt || "",
            text
          ]
            .map(escapeCsv)
            .join(",")
        );
      });
    });

    const blob = new Blob([rows.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "thelab-bolhs-grade5-answers.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportClassJson() {
    saveState();
    const payload = {
      exportedAt: new Date().toISOString(),
      project: "thelab-bolhs",
      profiles: state.profiles
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "thelab-bolhs-grade5-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ---------- Event Wiring ----------

  function init() {
    if (welcomeStudentSelect) {
      welcomeStudentSelect.addEventListener("change", updateWelcomePreview);
    }

    if (startSeriesBtn) {
      startSeriesBtn.addEventListener("click", () => {
        const picked = welcomeStudentSelect ? welcomeStudentSelect.value : "";
        if (!picked) return;
        selectStudentProfile(picked);
        currentMissionId = null;
        showView("hub");
        renderHub();
      });
    }

    if (switchStudentBtn) {
      switchStudentBtn.addEventListener("click", () => {
        currentMissionId = null;
        renderWelcome();
        showView("welcome");
      });
    }

    brandHomeBtn.addEventListener("click", () => {
      currentMissionId = null;
      if (state.studentName && CLASS_STUDENTS.includes(state.studentName)) {
        showView("hub");
        renderHub();
      } else {
        renderWelcome();
        showView("welcome");
      }
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

    // Admin Modal & Dashboard Events
    if (topbarAdminBtn) {
      topbarAdminBtn.addEventListener("click", openAdminModal);
    }
    if (welcomeAdminBtn) {
      welcomeAdminBtn.addEventListener("click", openAdminModal);
    }
    if (adminModalCancelBtn) {
      adminModalCancelBtn.addEventListener("click", closeAdminModal);
    }
    if (adminLoginModal) {
      adminLoginModal.addEventListener("click", (e) => {
        if (e.target === adminLoginModal) closeAdminModal();
      });
    }
    if (adminLoginForm) {
      adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (adminPasswordInput.value === ADMIN_PASSWORD) {
          isAdminUnlocked = true;
          closeAdminModal();
          openAdminDashboard();
        } else {
          adminLoginError.classList.remove("hidden");
          adminPasswordInput.select();
        }
      });
    }
    if (adminStudentFilter) {
      adminStudentFilter.addEventListener("change", renderAdminDashboard);
    }
    if (adminMissionFilter) {
      adminMissionFilter.addEventListener("change", renderAdminDashboard);
    }
    if (adminStatusFilter) {
      adminStatusFilter.addEventListener("change", renderAdminDashboard);
    }
    if (adminExportCsvBtn) {
      adminExportCsvBtn.addEventListener("click", exportClassCsv);
    }
    if (adminExportJsonBtn) {
      adminExportJsonBtn.addEventListener("click", exportClassJson);
    }
    if (adminImportJsonInput) {
      adminImportJsonInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result || "{}"));
            const incomingProfiles = parsed.profiles || parsed;
            if (incomingProfiles && typeof incomingProfiles === "object") {
              Object.keys(incomingProfiles).forEach((name) => {
                if (CLASS_STUDENTS.includes(name)) {
                  state.profiles[name] = normalizeMissionsMap(incomingProfiles[name]);
                }
              });
              if (state.studentName && state.profiles[state.studentName]) {
                state.missions = normalizeMissionsMap(state.profiles[state.studentName]);
              }
              saveState();
              renderAdminDashboard();
            }
          } catch (_) {
            // Ignore malformed JSON file
          }
          adminImportJsonInput.value = "";
        };
        reader.readAsText(file);
      });
    }
    if (adminPrintBtn) {
      adminPrintBtn.addEventListener("click", () => {
        window.print();
      });
    }
    if (adminLogoutBtn) {
      adminLogoutBtn.addEventListener("click", () => {
        isAdminUnlocked = false;
        if (state.studentName && CLASS_STUDENTS.includes(state.studentName)) {
          showView("hub");
          renderHub();
        } else {
          renderWelcome();
          showView("welcome");
        }
      });
    }

    window.addEventListener("beforeunload", stopSpeech);

    renderWelcome();
    showView("welcome");
  }

  init();
})();
