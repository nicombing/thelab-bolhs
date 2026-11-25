(function () {
  "use strict";

  const DATA = window.G2_DATA || {};
  const MOTION = window.G2_MOTION || {};
  const CANVAS = window.G2_CANVAS || {};

  const STORAGE_KEY = "thelab_g2_worksheet_v1";
  const ROUTINES_VERSION = 2;
  const PARENT_PASSCODES = ["2026", "qw3rty"];
  const MIN_WORDS_GOAL = 15;
  const MIN_SENTENCES_GOAL = 2;
  const CLOUD_RECORD_ID = "grade2_primary_student";
  const SUPABASE_URL = "https://dcoqoonpdxtfhslyjirb.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_2KMKUCuf1tCSOZ5CfLIkcw_HM81Xq9h";
  const SUPABASE_TABLE = "thelab_g2_worksheet_state";

  const TASKS = DATA.tasks || [];
  const PROJECTS = DATA.projects || [];
  const ROUTINE_GROUPS = DATA.routineGroups || [];

  let state = loadState();
  let selectedDateKey = getTodayKey();
  let currentTaskId = null;
  let currentProjectId = null;
  let activeTaskFilter = "all";
  let activeReportMode = "all";
  let selectedFillWord = null;
  let speechRate = 0.85;
  let isSpeaking = false;
  let speechQueueToken = 0;
  let isParentUnlocked = false;
  let pendingConfirmAction = null;
  let cloudSyncTimer = null;

  // ---------- Date & Text Utilities ----------

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function toDateKey(dateObj) {
    return `${dateObj.getFullYear()}-${pad2(dateObj.getMonth() + 1)}-${pad2(dateObj.getDate())}`;
  }

  function getTodayKey() {
    return toDateKey(new Date());
  }

  function parseDateKey(key) {
    const parts = String(key || "").split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return new Date();
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatFriendlyDate(key) {
    const d = parseDateKey(key);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });
  }

  function getCurrentWeekDates() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset);
    const days = [];
    for (let i = 0; i < 7; i += 1) {
      const dt = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      days.push({
        key: toDateKey(dt),
        shortDay: dt.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: dt.getDate()
      });
    }
    return days;
  }

  function escapeHtml(str) {
    return String(str || "")
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
    return trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  }

  function stripVocabTokens(text) {
    return String(text || "").replace(/\{\{([^}]+)\}\}/g, "$1");
  }

  // ---------- State Management ----------

  function defaultTaskState() {
    return {
      warmupAnswers: {},
      activityAnswers: {},
      checkedOutline: [],
      writingText: "",
      sketchDataUrl: "",
      completedAt: null
    };
  }

  function defaultProjectState() {
    return {
      completedSteps: [false, false, false, false],
      checkedMaterials: [],
      planText: "",
      discoverNotes: {},
      sketchDataUrl: "",
      captionText: "",
      showcaseText: "",
      completedAt: null
    };
  }

  function defaultRoutineDayLog() {
    return {
      checkedIds: [],
      readingBook: "",
      mood: "",
      note: ""
    };
  }

  function createBaseState() {
    const tasksMap = {};
    TASKS.forEach((t) => {
      tasksMap[t.id] = defaultTaskState();
    });
    const projectsMap = {};
    PROJECTS.forEach((p) => {
      projectsMap[p.id] = defaultProjectState();
    });

    return {
      profile: Object.assign({}, DATA.defaultProfile),
      routinesVersion: ROUTINES_VERSION,
      routines: (DATA.defaultRoutines || []).map((r) => Object.assign({}, r)),
      routineLogs: {},
      tasks: tasksMap,
      projects: projectsMap,
      feedback: {},
      updatedAt: null
    };
  }

  function normalizeState(raw) {
    const base = createBaseState();
    if (!raw || typeof raw !== "object") return base;

    if (raw.profile && typeof raw.profile === "object") {
      base.profile = Object.assign(base.profile, raw.profile);
      if (!base.profile.studentName || base.profile.studentName === "Little Explorer") {
        base.profile.studentName = "Hize";
      }
    }
    if (Array.isArray(raw.routines) && raw.routines.length > 0) {
      const normalizedRoutines = raw.routines.map((r) => ({
        id: String(r.id || "r-" + Math.random().toString(36).slice(2, 8)),
        group: ["morning", "learning", "evening"].includes(r.group) ? r.group : "morning",
        title: String(r.title || "Daily Habit"),
        active: r.active !== false,
        custom: Boolean(r.custom)
      }));
      if ((Number(raw.routinesVersion) || 0) < ROUTINES_VERSION) {
        const customOnly = normalizedRoutines.filter((r) => r.custom);
        base.routines = [
          ...(DATA.defaultRoutines || []).map((r) => Object.assign({}, r)),
          ...customOnly
        ];
      } else {
        base.routines = normalizedRoutines;
      }
    }
    base.routinesVersion = ROUTINES_VERSION;
    if (raw.routineLogs && typeof raw.routineLogs === "object") {
      Object.keys(raw.routineLogs).forEach((dateKey) => {
        const entry = raw.routineLogs[dateKey];
        if (entry && typeof entry === "object") {
          base.routineLogs[dateKey] = Object.assign(defaultRoutineDayLog(), entry);
        }
      });
    }
    if (raw.tasks && typeof raw.tasks === "object") {
      TASKS.forEach((t) => {
        if (raw.tasks[t.id] && typeof raw.tasks[t.id] === "object") {
          base.tasks[t.id] = Object.assign(defaultTaskState(), raw.tasks[t.id]);
        }
      });
    }
    if (raw.projects && typeof raw.projects === "object") {
      PROJECTS.forEach((p) => {
        if (raw.projects[p.id] && typeof raw.projects[p.id] === "object") {
          const merged = Object.assign(defaultProjectState(), raw.projects[p.id]);
          if (!Array.isArray(merged.completedSteps) || merged.completedSteps.length !== 4) {
            merged.completedSteps = [false, false, false, false];
          }
          base.projects[p.id] = merged;
        }
      });
    }
    if (raw.feedback && typeof raw.feedback === "object") {
      base.feedback = Object.assign({}, raw.feedback);
    }
    base.updatedAt = raw.updatedAt || null;
    return base;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return normalizeState(JSON.parse(raw));
    } catch (_) {}
    return createBaseState();
  }

  function saveState(scheduleCloud) {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
    if (scheduleCloud !== false) {
      scheduleCloudSync();
    }
  }

  function getDayLog(dateKey) {
    if (!state.routineLogs[dateKey]) {
      state.routineLogs[dateKey] = defaultRoutineDayLog();
    }
    return state.routineLogs[dateKey];
  }

  function getActiveRoutines() {
    return state.routines.filter((r) => r.active !== false);
  }

  // ---------- Optional Cloud Sync (Supabase) ----------

  const cloudStatus = { ok: null, message: "Local Save Active" };

  async function supabaseRequest(path, options) {
    const opts = options || {};
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
      throw new Error(txt || `HTTP ${res.status}`);
    }
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  async function pushStateToCloud() {
    try {
      await supabaseRequest(`${SUPABASE_TABLE}?on_conflict=record_id`, {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          record_id: CLOUD_RECORD_ID,
          student_name: state.profile.studentName || "Hize",
          payload: state,
          updated_at: state.updatedAt || new Date().toISOString()
        })
      });
      cloudStatus.ok = true;
      cloudStatus.message = "Cloud Synced";
    } catch (_) {
      cloudStatus.ok = false;
      cloudStatus.message = "Local Save Active";
    }
    updateSyncStatusUI();
  }

  async function pullStateFromCloud() {
    try {
      const rows = await supabaseRequest(
        `${SUPABASE_TABLE}?record_id=eq.${encodeURIComponent(CLOUD_RECORD_ID)}&select=*`,
        { method: "GET" }
      );
      if (Array.isArray(rows) && rows.length > 0 && rows[0].payload) {
        const remote = normalizeState(rows[0].payload);
        const localTime = state.updatedAt ? Date.parse(state.updatedAt) : 0;
        const remoteTime = remote.updatedAt ? Date.parse(remote.updatedAt) : 0;
        if (remoteTime > localTime) {
          state = remote;
          saveState(false);
          refreshAllVisible();
        }
      }
      cloudStatus.ok = true;
      cloudStatus.message = "Cloud Synced";
    } catch (_) {
      cloudStatus.ok = false;
      cloudStatus.message = "Local Save Active";
    }
    updateSyncStatusUI();
  }

  function scheduleCloudSync() {
    if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
    cloudSyncTimer = setTimeout(() => {
      pushStateToCloud();
    }, 1800);
  }

  function updateSyncStatusUI() {
    const el = document.getElementById("parent-sync-status");
    if (!el) return;
    const labelSpan = el.querySelector("span:last-child");
    if (labelSpan) labelSpan.textContent = cloudStatus.message;
  }

  // ---------- Progress & Stars Calculation ----------

  function isTaskWritingReady(text) {
    return countWords(text) >= MIN_WORDS_GOAL || countSentences(text) >= MIN_SENTENCES_GOAL;
  }

  function isTaskDone(taskId) {
    const ts = state.tasks[taskId];
    return Boolean(ts && ts.completedAt && isTaskWritingReady(ts.writingText));
  }

  function getTaskWarmupStars(task) {
    const ts = state.tasks[task.id] || defaultTaskState();
    let stars = 0;
    task.warmup.forEach((q, idx) => {
      if (ts.warmupAnswers[idx] === q.correctIndex) stars += 1;
    });
    return stars;
  }

  function isTaskActivityComplete(task) {
    const ts = state.tasks[task.id] || defaultTaskState();
    if (!task.activity) return false;
    return task.activity.items.every((item, idx) => {
      const val = ts.activityAnswers[idx];
      return String(val || "").toLowerCase() === String(item.answer).toLowerCase();
    });
  }

  function getRoutineStreak() {
    let streak = 0;
    const today = new Date();
    for (let offset = 0; offset < 365; offset += 1) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
      const key = toDateKey(d);
      const log = state.routineLogs[key];
      if (log && Array.isArray(log.checkedIds) && log.checkedIds.length > 0) {
        streak += 1;
      } else if (offset === 0) {
        // Today not checked yet doesn't break yesterday's streak
        continue;
      } else {
        break;
      }
    }
    return streak;
  }

  function getOverallStats() {
    const activeRoutines = getActiveRoutines();
    const todayLog = getDayLog(getTodayKey());
    const activeIds = new Set(activeRoutines.map((r) => r.id));
    const todayChecked = todayLog.checkedIds.filter((id) => activeIds.has(id)).length;
    const totalRoutines = activeRoutines.length;

    let tasksDone = 0;
    let totalStars = 0;

    // Routine stars across all logged days
    Object.values(state.routineLogs).forEach((log) => {
      if (log && Array.isArray(log.checkedIds)) {
        totalStars += log.checkedIds.length;
      }
    });

    // Task stars
    TASKS.forEach((t) => {
      totalStars += getTaskWarmupStars(t);
      if (isTaskActivityComplete(t)) totalStars += 2;
      if (isTaskDone(t.id)) {
        tasksDone += 1;
        totalStars += 3;
      }
    });

    // Project steps & stars
    let totalProjectSteps = 0;
    let doneProjectSteps = 0;
    PROJECTS.forEach((p) => {
      const ps = state.projects[p.id] || defaultProjectState();
      totalProjectSteps += 4;
      const doneCount = ps.completedSteps.filter(Boolean).length;
      doneProjectSteps += doneCount;
      totalStars += doneCount * 2;
    });

    // Parent stamps bonus
    Object.values(state.feedback || {}).forEach((fb) => {
      if (fb && fb.stamp) totalStars += 2;
    });

    let rank = "Curious Sprout";
    if (totalStars >= 60) rank = "Grade 2 Champion";
    else if (totalStars >= 40) rank = "Super Explorer";
    else if (totalStars >= 22) rank = "Star Collector";
    else if (totalStars >= 10) rank = "Sunny Learner";

    return {
      todayChecked,
      totalRoutines,
      tasksDone,
      totalTasks: TASKS.length,
      doneProjectSteps,
      totalProjectSteps,
      totalStars,
      rank,
      streak: getRoutineStreak()
    };
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
    const label = document.getElementById("tts-btn-label");
    if (label) label.textContent = "Read Aloud";
  }

  function speakText(text) {
    if (!("speechSynthesis" in window) || !text) return;
    stopSpeech();
    const utter = new SpeechSynthesisUtterance(String(text));
    utter.lang = "en-US";
    utter.rate = speechRate;
    window.speechSynthesis.speak(utter);
  }

  function startSpeechForTask(task) {
    if (!("speechSynthesis" in window) || !task) return;
    stopSpeech();
    const token = ++speechQueueToken;
    isSpeaking = true;
    const label = document.getElementById("tts-btn-label");
    if (label) label.textContent = "Stop Reading";

    const readingSectionsEl = document.getElementById("task-reading-sections");
    const sectionNodes = Array.from(readingSectionsEl.querySelectorAll(".reading-section-block"));
    let idx = 0;

    function speakNext() {
      if (token !== speechQueueToken || idx >= task.sections.length) {
        if (token === speechQueueToken) stopSpeech();
        return;
      }
      sectionNodes.forEach((n, i) => n.classList.toggle("is-speaking", i === idx));
      const sec = task.sections[idx];
      const parts = [sec.heading, ...sec.paragraphs.map(stripVocabTokens)];
      if (sec.factBox) parts.push(`${sec.factBox.title}. ${sec.factBox.text}`);
      const utter = new SpeechSynthesisUtterance(parts.join(". "));
      utter.lang = "en-US";
      utter.rate = speechRate;
      utter.onend = () => {
        idx += 1;
        speakNext();
      };
      utter.onerror = () => {
        if (token === speechQueueToken) stopSpeech();
      };
      window.speechSynthesis.speak(utter);
    }
    speakNext();
  }

  // ---------- View Navigation ----------

  const VIEWS = [
    "home",
    "routines",
    "tasks",
    "task-detail",
    "projects",
    "project-detail",
    "report",
    "parent"
  ];
  let activeView = "home";

  function showView(viewName) {
    stopSpeech();
    activeView = viewName;
    VIEWS.forEach((v) => {
      const el = document.getElementById(`${v}-view`);
      if (el) el.classList.toggle("hidden", v !== viewName);
    });

    const navKey =
      viewName === "task-detail"
        ? "tasks"
        : viewName === "project-detail"
        ? "projects"
        : viewName;
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.nav === navKey);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderTopbar() {
    const stats = getOverallStats();
    const name = state.profile.studentName || "Hize";
    const mascot = (DATA.mascots && DATA.mascots[state.profile.mascot]) || DATA.mascots.owl;

    document.title = `${name}'s Worksheet — Routines, Tasks & Projects`;
    document.getElementById("brand-student-title").textContent = `${name}'s Worksheet`;
    document.getElementById("star-bank-count").textContent = `${stats.totalStars} Stars`;
    if (mascot && mascot.svg) {
      document.getElementById("brand-mascot-mark").innerHTML = mascot.svg;
    }
  }

  // ---------- VIEW 1: HOME ----------

  function renderHome() {
    renderTopbar();
    const stats = getOverallStats();
    const name = state.profile.studentName || "Hize";
    const mascot = (DATA.mascots && DATA.mascots[state.profile.mascot]) || DATA.mascots.owl;

    document.getElementById("home-date-label").textContent = formatFriendlyDate(getTodayKey());
    document.getElementById("home-greeting-title").textContent = `Hi, ${name}! Ready for Today?`;
    document.getElementById("home-greeting-desc").textContent =
      state.profile.greetingNote || DATA.defaultProfile.greetingNote;

    document.getElementById("home-routine-stat").textContent = `${stats.todayChecked} / ${stats.totalRoutines}`;
    document.getElementById("home-tasks-stat").textContent = `${stats.tasksDone} / ${stats.totalTasks}`;
    document.getElementById("home-projects-stat").textContent = `${stats.doneProjectSteps} / ${stats.totalProjectSteps}`;
    document.getElementById("home-rank-label").textContent = stats.rank;

    document.getElementById("home-mascot-svg").innerHTML = mascot.svg;
    document.getElementById("home-mascot-name").textContent = mascot.name;
    document.getElementById("home-mascot-tip").textContent = mascot.tip;

    // Pillar progress bars
    const rPct = stats.totalRoutines ? Math.round((stats.todayChecked / stats.totalRoutines) * 100) : 0;
    const tPct = stats.totalTasks ? Math.round((stats.tasksDone / stats.totalTasks) * 100) : 0;
    const pPct = stats.totalProjectSteps ? Math.round((stats.doneProjectSteps / stats.totalProjectSteps) * 100) : 0;

    document.getElementById("pillar-routines-label").textContent = `${stats.todayChecked} of ${stats.totalRoutines} done today`;
    document.getElementById("pillar-routines-pct").textContent = `${rPct}%`;
    document.getElementById("pillar-routines-bar").style.width = `${rPct}%`;

    document.getElementById("pillar-tasks-label").textContent = `${stats.tasksDone} of ${stats.totalTasks} tasks finished`;
    document.getElementById("pillar-tasks-pct").textContent = `${tPct}%`;
    document.getElementById("pillar-tasks-bar").style.width = `${tPct}%`;

    document.getElementById("pillar-projects-label").textContent = `${stats.doneProjectSteps} of ${stats.totalProjectSteps} steps done`;
    document.getElementById("pillar-projects-pct").textContent = `${pPct}%`;
    document.getElementById("pillar-projects-bar").style.width = `${pPct}%`;

    // Encouragement Stamps Shelf
    const stampsSection = document.getElementById("home-stamps-section");
    const stampsGrid = document.getElementById("home-stamps-grid");
    const awarded = Object.entries(state.feedback || {}).filter(([, fb]) => fb && (fb.stamp || fb.note));
    if (awarded.length === 0) {
      stampsSection.classList.add("hidden");
    } else {
      stampsSection.classList.remove("hidden");
      stampsGrid.innerHTML = awarded
        .map(([itemId, fb]) => {
          const itemObj =
            TASKS.find((t) => t.id === itemId) || PROJECTS.find((p) => p.id === itemId);
          const itemTitle = itemObj ? itemObj.title : itemId;
          return `
            <article class="stamp-card">
              ${fb.stamp ? `<div class="stamp-badge-pill">${escapeHtml(fb.stamp)}</div>` : ""}
              <div class="stamp-item-title">${escapeHtml(itemTitle)}</div>
              <p class="stamp-note-text">${escapeHtml(fb.note || "Great work keeping up with your worksheet!")}</p>
            </article>
          `;
        })
        .join("");
    }
  }

  // ---------- VIEW 2: ROUTINES ----------

  function renderRoutines() {
    renderTopbar();
    const activeRoutines = getActiveRoutines();
    const activeIds = new Set(activeRoutines.map((r) => r.id));
    const log = getDayLog(selectedDateKey);
    const todayKey = getTodayKey();

    document.getElementById("routine-streak-pill").textContent = `${getRoutineStreak()}-Day Streak`;
    document.getElementById("routine-selected-date-label").textContent =
      selectedDateKey === todayKey
        ? `Today — ${formatFriendlyDate(selectedDateKey)}`
        : formatFriendlyDate(selectedDateKey);

    // Week ribbon
    const weekDays = getCurrentWeekDates();
    const weekRibbon = document.getElementById("routine-week-ribbon");
    weekRibbon.innerHTML = weekDays
      .map((d) => {
        const dLog = state.routineLogs[d.key];
        const doneCount = dLog ? dLog.checkedIds.filter((id) => activeIds.has(id)).length : 0;
        const cls = [
          "day-pill-btn",
          d.key === selectedDateKey ? "is-selected" : "",
          d.key === todayKey ? "is-today" : ""
        ]
          .filter(Boolean)
          .join(" ");
        return `
          <button type="button" class="${cls}" data-day-key="${d.key}" role="tab" aria-selected="${d.key === selectedDateKey}">
            <span class="day-name">${d.shortDay}</span>
            <span class="day-num">${d.dayNum}</span>
            <span class="day-count">${doneCount}/${activeRoutines.length}</span>
          </button>
        `;
      })
      .join("");

    weekRibbon.querySelectorAll(".day-pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedDateKey = btn.dataset.dayKey;
        renderRoutines();
      });
    });

    // Living Garden SVG
    const checkedCount = log.checkedIds.filter((id) => activeIds.has(id)).length;
    const pct = activeRoutines.length ? Math.round((checkedCount / activeRoutines.length) * 100) : 0;
    if (MOTION.renderGarden) {
      MOTION.renderGarden(
        document.getElementById("routine-garden-stage"),
        pct,
        checkedCount,
        activeRoutines.length
      );
    }

    // Routine Groups
    const groupsContainer = document.getElementById("routine-groups-container");
    groupsContainer.innerHTML = ROUTINE_GROUPS.map((grp) => {
      const items = activeRoutines.filter((r) => r.group === grp.id);
      const grpDone = items.filter((r) => log.checkedIds.includes(r.id)).length;
      const itemsHtml = items
        .map((r) => {
          const isChecked = log.checkedIds.includes(r.id);
          return `
            <button type="button" class="routine-item-btn ${isChecked ? "is-checked" : ""}" data-routine-id="${escapeHtml(r.id)}" aria-pressed="${isChecked}">
              <span class="routine-checkbox-box" aria-hidden="true">${isChecked ? "✓" : ""}</span>
              <span class="routine-item-label">${escapeHtml(r.title)}</span>
              <span class="routine-star-mini" aria-hidden="true">★</span>
            </button>
          `;
        })
        .join("");

      return `
        <article class="routine-group-card routine-group-${escapeHtml(grp.id)}">
          <div class="routine-group-head">
            <div>
              <span class="section-tag tag-amber">${escapeHtml(grp.badge)}</span>
              <h3 style="margin-top: 6px;">${escapeHtml(grp.title)}</h3>
            </div>
            <span class="routine-group-count">${grpDone} / ${items.length}</span>
          </div>
          <div class="routine-items-list">${itemsHtml || "<p class='card-sub'>No habits in this group yet.</p>"}</div>
        </article>
      `;
    }).join("");

    groupsContainer.querySelectorAll(".routine-item-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.routineId;
        const idx = log.checkedIds.indexOf(id);
        if (idx >= 0) log.checkedIds.splice(idx, 1);
        else log.checkedIds.push(id);
        saveState();
        renderRoutines();
      });
    });

    // Daily Reading & Mood Check-In
    document.getElementById("routine-book-input").value = log.readingBook || "";
    document.getElementById("routine-note-input").value = log.note || "";

    const moodRow = document.getElementById("routine-mood-row");
    moodRow.innerHTML = (DATA.moods || [])
      .map((m) => {
        const sel = log.mood === m.id;
        return `<button type="button" class="mood-btn ${sel ? "is-selected" : ""}" data-mood-id="${m.id}">${escapeHtml(m.label)}</button>`;
      })
      .join("");

    moodRow.querySelectorAll(".mood-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        log.mood = btn.dataset.moodId;
        saveState();
        renderRoutines();
      });
    });
  }

  // ---------- VIEW 3: TASKS HUB ----------

  function renderTasksHub() {
    renderTopbar();
    document.querySelectorAll("[data-task-filter]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.taskFilter === activeTaskFilter);
    });

    const filtered = TASKS.filter((t) => {
      const done = isTaskDone(t.id);
      if (activeTaskFilter === "done") return done;
      if (activeTaskFilter === "pending") return !done;
      return true;
    });

    const grid = document.getElementById("tasks-grid");
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="mission-card" style="grid-column: 1 / -1; text-align: center; padding: 36px;">
          <h3>No tasks in this filter yet!</h3>
          <p class="mission-card-desc">Tap "All Tasks" above to see every Grade 2 worksheet.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map((t) => {
        const ts = state.tasks[t.id] || defaultTaskState();
        const done = isTaskDone(t.id);
        const stars = getTaskWarmupStars(t);
        const words = countWords(ts.writingText);
        const fb = state.feedback[t.id];

        let badgeClass = "status-new";
        let badgeText = "Ready to Start";
        let btnText = "Start Task";
        if (done) {
          badgeClass = "status-done";
          badgeText = "Star Earned!";
          btnText = "Review Task";
        } else if (words > 0 || stars > 0) {
          badgeClass = "status-draft";
          badgeText = "In Progress";
          btnText = "Keep Going";
        }

        return `
          <article class="mission-card ${done ? "is-done" : ""}">
            <div class="mission-card-top">
              <div class="mission-card-icon-wrap">
                <div class="mission-svg-badge">${t.iconSvg}</div>
                <div>
                  <span class="mission-unit-tag">Task ${t.number} • ${escapeHtml(t.subject)}</span>
                  <h3>${escapeHtml(t.title)}</h3>
                </div>
              </div>
              <span class="status-badge ${badgeClass}">${escapeHtml(badgeText)}</span>
            </div>
            <p class="mission-card-desc">${escapeHtml(t.teaser)}</p>
            ${fb && fb.stamp ? `<div class="stamp-badge-pill">Sticker: ${escapeHtml(fb.stamp)}</div>` : ""}
            <div class="mission-card-meta">
              <span class="mission-mini-progress">${escapeHtml(t.readTime)} • Clue Stars: ${stars}/${t.warmup.length}</span>
              <button type="button" class="btn ${done ? "btn-secondary" : "btn-primary"} btn-sm open-task-btn" data-task-id="${t.id}">
                ${escapeHtml(btnText)}
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    grid.querySelectorAll(".open-task-btn").forEach((btn) => {
      btn.addEventListener("click", () => openTask(btn.dataset.taskId));
    });
  }

  // ---------- VIEW 4: ACTIVE TASK WORKSHEET ----------

  function renderParagraphWithVocab(text) {
    return String(text)
      .split(/(\{\{[^}]+\}\})/g)
      .map((part) => {
        if (part.startsWith("{{") && part.endsWith("}}")) {
          const term = part.slice(2, -2);
          return `<button type="button" class="vocab-term" data-term="${escapeHtml(term)}">${escapeHtml(term)}</button>`;
        }
        return escapeHtml(part);
      })
      .join("");
  }

  function selectGlossaryTerm(task, termKey) {
    const entry = task.glossary[termKey];
    if (!entry) return;
    const box = document.getElementById("glossary-active-box");
    box.innerHTML = `
      <div class="glossary-word-head">
        <div>
          <span class="glossary-word-title">${escapeHtml(termKey)}</span>
          <span class="glossary-word-pos">(${escapeHtml(entry.pos)})</span>
        </div>
        <button type="button" id="hear-vocab-btn" class="speak-mini-btn">Hear Word</button>
      </div>
      <p class="glossary-word-def">${escapeHtml(entry.def)}</p>
      <p class="glossary-word-ex">"${escapeHtml(entry.ex)}"</p>
    `;
    document.getElementById("hear-vocab-btn").addEventListener("click", () => {
      speakText(`${termKey}. ${entry.def}`);
    });
    document.querySelectorAll(".vocab-term, .glossary-chip").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.term === termKey);
    });
  }

  function renderTaskWarmup(task) {
    const ts = state.tasks[task.id];
    const stars = getTaskWarmupStars(task);
    document.getElementById("task-warmup-pill").textContent = `${stars} / ${task.warmup.length} Stars`;

    const listEl = document.getElementById("task-warmup-list");
    listEl.innerHTML = task.warmup
      .map((q, qIdx) => {
        const chosen = ts.warmupAnswers[qIdx];
        const hasAnswered = typeof chosen === "number";
        const isCorrect = chosen === q.correctIndex;

        const optsHtml = q.options
          .map((opt, oIdx) => {
            let cls = "warmup-opt-btn";
            if (hasAnswered) {
              if (oIdx === q.correctIndex && isCorrect) cls += " is-correct";
              else if (oIdx === chosen && !isCorrect) cls += " is-wrong";
            }
            return `<button type="button" class="${cls}" data-q-idx="${qIdx}" data-o-idx="${oIdx}">${escapeHtml(opt)}</button>`;
          })
          .join("");

        const fbHtml = hasAnswered
          ? `<div class="warmup-feedback ${isCorrect ? "is-good" : ""}">
               ${isCorrect ? escapeHtml(q.explanation) : "Good try! Check the story clues above and tap another answer!"}
             </div>`
          : "";

        return `
          <div class="warmup-item">
            <div class="warmup-q-row">
              <div class="warmup-q-title">${qIdx + 1}. ${escapeHtml(q.question)}</div>
              <button type="button" class="speak-mini-btn speak-q-btn" data-q-idx="${qIdx}">Read Question</button>
            </div>
            <div class="warmup-options">${optsHtml}</div>
            ${fbHtml}
          </div>
        `;
      })
      .join("");

    listEl.querySelectorAll(".warmup-opt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qIdx = Number(btn.dataset.qIdx);
        const oIdx = Number(btn.dataset.oIdx);
        ts.warmupAnswers[qIdx] = oIdx;
        saveState();
        renderTaskWarmup(task);
        renderTopbar();
      });
    });

    listEl.querySelectorAll(".speak-q-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = task.warmup[Number(btn.dataset.qIdx)];
        if (q) speakText(q.question);
      });
    });
  }

  function renderTaskActivity(task) {
    const container = document.getElementById("task-activity-container");
    const act = task.activity;
    if (!act) {
      container.innerHTML = "";
      return;
    }
    const ts = state.tasks[task.id];
    const allRight = isTaskActivityComplete(task);

    if (act.type === "fill") {
      const usedWords = Object.values(ts.activityAnswers || {});
      container.innerHTML = `
        <div class="hands-on-head">
          <div>
            <h3>${escapeHtml(act.title)}</h3>
            <p class="card-sub" style="margin: 2px 0 0;">${escapeHtml(act.instruction)}</p>
          </div>
          ${allRight ? '<span class="status-badge status-done">All Matched! (+2 Stars)</span>' : ""}
        </div>
        <div class="word-bank-row">
          ${act.bank
            .map((word) => {
              const isSel = selectedFillWord === word;
              const isUsed = usedWords.includes(word);
              return `<button type="button" class="bank-tile ${isSel ? "is-selected" : ""} ${isUsed ? "is-used" : ""}" data-bank-word="${escapeHtml(word)}">${escapeHtml(word)}</button>`;
            })
            .join("")}
        </div>
        <div class="fill-sentences-list">
          ${act.items
            .map((item, idx) => {
              const placed = ts.activityAnswers[idx] || "";
              let slotCls = "blank-slot-btn";
              if (placed) {
                slotCls += placed.toLowerCase() === item.answer.toLowerCase() ? " is-correct" : " is-wrong";
              }
              return `
                <div class="fill-sentence-row">
                  ${escapeHtml(item.before)}
                  <button type="button" class="${slotCls}" data-blank-idx="${idx}">${placed ? escapeHtml(placed) : "tap word"}</button>
                  ${escapeHtml(item.after)}
                </div>
              `;
            })
            .join("")}
        </div>
      `;

      container.querySelectorAll(".bank-tile").forEach((btn) => {
        btn.addEventListener("click", () => {
          selectedFillWord = btn.dataset.bankWord;
          renderTaskActivity(task);
        });
      });

      container.querySelectorAll(".blank-slot-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.blankIdx);
          if (selectedFillWord) {
            ts.activityAnswers[idx] = selectedFillWord;
            selectedFillWord = null;
          } else {
            delete ts.activityAnswers[idx];
          }
          saveState();
          renderTaskActivity(task);
          renderTopbar();
        });
      });
      return;
    }

    if (act.type === "sort") {
      container.innerHTML = `
        <div class="hands-on-head">
          <div>
            <h3>${escapeHtml(act.title)}</h3>
            <p class="card-sub" style="margin: 2px 0 0;">${escapeHtml(act.instruction)}</p>
          </div>
          ${allRight ? '<span class="status-badge status-done">Super Sorter! (+2 Stars)</span>' : ""}
        </div>
        <div class="sort-items-list">
          ${act.items
            .map((item, idx) => {
              const picked = ts.activityAnswers[idx] || "";
              let rowCls = "sort-item-row";
              if (picked) {
                rowCls += picked === item.answer ? " is-correct" : " is-wrong";
              }
              return `
                <div class="${rowCls}">
                  <span class="sort-item-label">${escapeHtml(item.label)}</span>
                  <div class="sort-choice-btns">
                    ${act.groups
                      .map(
                        (grp) =>
                          `<button type="button" class="sort-choice-btn ${picked === grp ? "is-picked" : ""}" data-sort-idx="${idx}" data-sort-val="${escapeHtml(grp)}">${escapeHtml(grp)}</button>`
                      )
                      .join("")}
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;

      container.querySelectorAll(".sort-choice-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          ts.activityAnswers[Number(btn.dataset.sortIdx)] = btn.dataset.sortVal;
          saveState();
          renderTaskActivity(task);
          renderTopbar();
        });
      });
    }
  }

  function updateTaskWritingMetrics(task) {
    const ts = state.tasks[task.id];
    const text = ts.writingText || "";
    const words = countWords(text);
    const sentences = countSentences(text);
    const usedPowers = task.powerWords.filter((pw) =>
      new RegExp("\\b" + escapeRegExp(pw) + "\\b", "i").test(text)
    );

    document.getElementById("task-word-count").textContent = String(words);
    document.getElementById("task-sentence-count").textContent = `${sentences} ${sentences === 1 ? "sentence" : "sentences"}`;
    document.getElementById("task-power-count").textContent = `${usedPowers.length} helper words`;

    const pct = Math.min(100, Math.round(Math.max((words / 20) * 100, (sentences / 2) * 100)));
    document.getElementById("task-progress-fill").style.width = `${pct}%`;
    document.getElementById("task-progress-track").setAttribute("aria-valuenow", String(pct));

    document.querySelectorAll("#task-power-words .power-word-pill").forEach((pill) => {
      pill.classList.toggle("is-used", usedPowers.includes(pill.dataset.pw));
    });

    const ready = isTaskWritingReady(text);
    const submitBtn = document.getElementById("task-submit-btn");
    const msgEl = document.getElementById("task-meter-message");

    submitBtn.disabled = !ready;
    if (ready) {
      submitBtn.textContent = ts.completedAt ? "Update My Finished Task" : "Finish Task & Collect 3 Stars!";
      msgEl.textContent = "Awesome writing! Tap the green button below to save and collect your stars!";
    } else {
      submitBtn.textContent = "Write 2 sentences (or 15 words) to finish";
      msgEl.textContent = "Keep going! Tap a Sentence Starter on the left if you want a fun head start.";
    }
  }

  function openTask(taskId) {
    const task = TASKS.find((t) => t.id === taskId) || TASKS[0];
    if (!task) return;
    currentTaskId = task.id;
    selectedFillWord = null;
    const ts = state.tasks[task.id];

    // Stepper
    const stepper = document.getElementById("task-stepper");
    stepper.innerHTML = TASKS.map((t) => {
      const cls = [
        "stepper-dot",
        t.id === task.id ? "is-current" : "",
        isTaskDone(t.id) ? "is-done" : ""
      ]
        .filter(Boolean)
        .join(" ");
      return `<button type="button" class="${cls}" data-step-task="${t.id}">Task ${t.number}</button>`;
    }).join("");
    stepper.querySelectorAll(".stepper-dot").forEach((btn) => {
      btn.addEventListener("click", () => openTask(btn.dataset.stepTask));
    });

    // Banner
    document.getElementById("task-banner").innerHTML = `
      <div class="mission-svg-badge" style="width:68px;height:68px;">${task.iconSvg}</div>
      <div>
        <span class="section-tag tag-teal">Task ${task.number} • ${escapeHtml(task.subject)}</span>
        <h1>${escapeHtml(task.title)}</h1>
        <p>${escapeHtml(task.teaser)}</p>
      </div>
    `;

    // Parent/Teacher Stamp Banner
    const fbBanner = document.getElementById("task-feedback-banner");
    const fb = state.feedback[task.id];
    if (fb && (fb.stamp || fb.note)) {
      fbBanner.classList.remove("hidden");
      fbBanner.innerHTML = `
        <div>
          <span class="stamp-badge-pill" style="margin-bottom:0;">${escapeHtml(fb.stamp || "Teacher Note")}</span>
          <strong style="margin-left: 10px;">${escapeHtml(fb.note || "Great work!")}</strong>
        </div>
        <span class="meta-pill">From Parent / Teacher</span>
      `;
    } else {
      fbBanner.classList.add("hidden");
    }

    document.getElementById("task-time-pill").textContent = task.readTime;
    if (MOTION.renderScene) {
      MOTION.renderScene(document.getElementById("task-motion-stage"), task.id);
    }

    // Reading Sections
    const sectionsEl = document.getElementById("task-reading-sections");
    sectionsEl.innerHTML = task.sections
      .map(
        (sec) => `
        <div class="reading-section-block">
          <h3>${escapeHtml(sec.heading)}</h3>
          ${sec.paragraphs.map((p) => `<p>${renderParagraphWithVocab(p)}</p>`).join("")}
          ${
            sec.factBox
              ? `<div class="fact-box"><strong>${escapeHtml(sec.factBox.title)}</strong><span>${escapeHtml(sec.factBox.text)}</span></div>`
              : ""
          }
        </div>
      `
      )
      .join("");

    sectionsEl.querySelectorAll(".vocab-term").forEach((btn) => {
      btn.addEventListener("click", () => selectGlossaryTerm(task, btn.dataset.term));
    });

    // Glossary Chips
    const keys = Object.keys(task.glossary);
    const chipsEl = document.getElementById("glossary-chips");
    chipsEl.innerHTML = keys
      .map((k) => `<button type="button" class="glossary-chip" data-term="${escapeHtml(k)}">${escapeHtml(k)}</button>`)
      .join("");
    chipsEl.querySelectorAll(".glossary-chip").forEach((btn) => {
      btn.addEventListener("click", () => selectGlossaryTerm(task, btn.dataset.term));
    });
    if (keys.length > 0) selectGlossaryTerm(task, keys[0]);

    // Tip Card
    document.getElementById("task-tip-card").innerHTML = `
      <h3>${escapeHtml(task.tipBox.title)}</h3>
      <p>${escapeHtml(task.tipBox.tip)}</p>
      <div class="grammar-example">${escapeHtml(task.tipBox.example)}</div>
    `;

    // Part 2: Warmup + Hands-on Game
    renderTaskWarmup(task);
    renderTaskActivity(task);

    // Part 3: Guided Writing
    document.getElementById("task-prompt-callout").textContent = task.prompt;

    const outlineEl = document.getElementById("task-outline-checklist");
    outlineEl.innerHTML = task.outline
      .map((item, idx) => {
        const checked = ts.checkedOutline.includes(idx);
        return `
          <label class="outline-item">
            <input type="checkbox" data-outline-idx="${idx}" ${checked ? "checked" : ""}>
            <span>${escapeHtml(item)}</span>
          </label>
        `;
      })
      .join("");
    outlineEl.querySelectorAll("input").forEach((cb) => {
      cb.addEventListener("change", () => {
        const idx = Number(cb.dataset.outlineIdx);
        if (cb.checked && !ts.checkedOutline.includes(idx)) ts.checkedOutline.push(idx);
        if (!cb.checked) ts.checkedOutline = ts.checkedOutline.filter((i) => i !== idx);
        saveState();
      });
    });

    const startersEl = document.getElementById("task-starter-chips");
    startersEl.innerHTML = task.starters
      .map((s) => `<button type="button" class="starter-chip" data-starter="${escapeHtml(s)}">${escapeHtml(s)}</button>`)
      .join("");
    startersEl.querySelectorAll(".starter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ta = document.getElementById("task-writing-textarea");
        const prefix = ta.value.trim() ? ta.value.trimEnd() + " " : "";
        ta.value = prefix + btn.dataset.starter + " ";
        ts.writingText = ta.value;
        saveState();
        updateTaskWritingMetrics(task);
        ta.focus();
      });
    });

    document.getElementById("task-power-words").innerHTML = task.powerWords
      .map((pw) => `<span class="power-word-pill" data-pw="${escapeHtml(pw)}">${escapeHtml(pw)}</span>`)
      .join("");

    const textarea = document.getElementById("task-writing-textarea");
    textarea.value = ts.writingText || "";
    updateTaskWritingMetrics(task);

    const feedbackBox = document.getElementById("task-submit-feedback");
    if (isTaskDone(task.id)) {
      feedbackBox.classList.remove("hidden");
      feedbackBox.textContent = "Woohoo! Task completed and saved! You earned 3 bright stars!";
    } else {
      feedbackBox.classList.add("hidden");
    }

    // Optional Task Quick Drawing Pad
    const sketchDetails = document.getElementById("task-sketch-details");
    const canvasHost = document.getElementById("task-canvas-host");
    sketchDetails.open = Boolean(ts.sketchDataUrl);
    if (CANVAS.mount) {
      CANVAS.mount(canvasHost, {
        initialDataUrl: ts.sketchDataUrl || "",
        onChange: (dataUrl) => {
          ts.sketchDataUrl = dataUrl;
          saveState();
        }
      });
    }

    // Prev / Next buttons
    const idx = TASKS.findIndex((t) => t.id === task.id);
    document.getElementById("prev-task-btn").disabled = idx <= 0;
    document.getElementById("next-task-btn").disabled = idx >= TASKS.length - 1;

    showView("task-detail");
  }

  // ---------- VIEW 5 & 6: PROJECTS ----------

  function renderProjectsHub() {
    renderTopbar();
    const grid = document.getElementById("projects-grid");
    grid.innerHTML = PROJECTS.map((p) => {
      const ps = state.projects[p.id] || defaultProjectState();
      const doneSteps = ps.completedSteps.filter(Boolean).length;
      const isComplete = doneSteps === 4;
      const fb = state.feedback[p.id];

      return `
        <article class="mission-card ${isComplete ? "is-done" : ""}">
          <div class="mission-card-top">
            <div class="mission-card-icon-wrap">
              <div class="mission-svg-badge" style="background:var(--accent-emerald-soft);color:var(--accent-emerald);border-color:var(--accent-emerald-border);">${p.iconSvg}</div>
              <div>
                <span class="mission-unit-tag" style="color:var(--accent-emerald);">Project ${p.number} • ${escapeHtml(p.badge)}</span>
                <h3>${escapeHtml(p.title)}</h3>
              </div>
            </div>
            <span class="status-badge ${isComplete ? "status-done" : doneSteps > 0 ? "status-draft" : "status-new"}">
              ${doneSteps} / 4 Steps
            </span>
          </div>
          <p class="mission-card-desc">${escapeHtml(p.teaser)}</p>
          ${fb && fb.stamp ? `<div class="stamp-badge-pill">Sticker: ${escapeHtml(fb.stamp)}</div>` : ""}
          <div class="mission-card-meta">
            <span class="mission-mini-progress">${escapeHtml(p.duration)}</span>
            <button type="button" class="btn btn-primary btn-sm open-project-btn" data-project-id="${p.id}">
              ${doneSteps > 0 ? "Continue Project" : "Start Project"}
            </button>
          </div>
        </article>
      `;
    }).join("");

    grid.querySelectorAll(".open-project-btn").forEach((btn) => {
      btn.addEventListener("click", () => openProject(btn.dataset.projectId));
    });
  }

  function renderProjectMilestones(project) {
    const ps = state.projects[project.id];
    const doneSteps = ps.completedSteps.filter(Boolean).length;
    document.getElementById("project-steps-badge").textContent = `${doneSteps} / 4 Steps Done`;

    const labels = ["1. Plan", "2. Discover", "3. Draw", "4. Show & Tell"];
    document.getElementById("project-milestones-bar").innerHTML = labels
      .map(
        (lbl, idx) =>
          `<a href="#project-step-${idx + 1}" class="milestone-pill ${ps.completedSteps[idx] ? "is-done" : ""}">
             <span>${ps.completedSteps[idx] ? "✓" : "○"}</span>
             <span>${lbl}</span>
           </a>`
      )
      .join("");

    document.querySelectorAll(".project-step-checkbox").forEach((cb) => {
      cb.checked = Boolean(ps.completedSteps[Number(cb.dataset.step)]);
    });
  }

  function openProject(projectId) {
    const project = PROJECTS.find((p) => p.id === projectId) || PROJECTS[0];
    if (!project) return;
    currentProjectId = project.id;
    const ps = state.projects[project.id];

    // Stepper
    const stepper = document.getElementById("project-stepper");
    stepper.innerHTML = PROJECTS.map((p) => {
      const doneAll = (state.projects[p.id]?.completedSteps || []).filter(Boolean).length === 4;
      const cls = ["stepper-dot", p.id === project.id ? "is-current" : "", doneAll ? "is-done" : ""]
        .filter(Boolean)
        .join(" ");
      return `<button type="button" class="${cls}" data-step-project="${p.id}">Project ${p.number}</button>`;
    }).join("");
    stepper.querySelectorAll(".stepper-dot").forEach((btn) => {
      btn.addEventListener("click", () => openProject(btn.dataset.stepProject));
    });

    // Banner
    document.getElementById("project-banner").innerHTML = `
      <div class="mission-svg-badge" style="width:68px;height:68px;background:var(--accent-emerald-soft);color:var(--accent-emerald);border-color:var(--accent-emerald-border);">${project.iconSvg}</div>
      <div>
        <span class="section-tag tag-emerald">Project ${project.number} • ${escapeHtml(project.badge)}</span>
        <h1>${escapeHtml(project.title)}</h1>
        <p>${escapeHtml(project.teaser)}</p>
      </div>
    `;

    // Teacher Stamp Banner
    const fbBanner = document.getElementById("project-feedback-banner");
    const fb = state.feedback[project.id];
    if (fb && (fb.stamp || fb.note)) {
      fbBanner.classList.remove("hidden");
      fbBanner.innerHTML = `
        <div>
          <span class="stamp-badge-pill" style="margin-bottom:0;">${escapeHtml(fb.stamp || "Teacher Note")}</span>
          <strong style="margin-left: 10px;">${escapeHtml(fb.note || "Awesome project!")}</strong>
        </div>
        <span class="meta-pill">From Parent / Teacher</span>
      `;
    } else {
      fbBanner.classList.add("hidden");
    }

    if (MOTION.renderScene) {
      MOTION.renderScene(document.getElementById("project-motion-stage"), project.id);
    }

    renderProjectMilestones(project);

    // Step 1
    document.getElementById("p-step1-title").textContent = project.step1.title;
    document.getElementById("p-plan-label").textContent = project.step1.planLabel;
    const planInput = document.getElementById("project-plan-input");
    planInput.placeholder = project.step1.planPlaceholder;
    planInput.value = ps.planText || "";

    const matList = document.getElementById("project-materials-list");
    matList.innerHTML = project.step1.materials
      .map((m, idx) => {
        const checked = ps.checkedMaterials.includes(idx);
        return `
          <label class="outline-item">
            <input type="checkbox" data-mat-idx="${idx}" ${checked ? "checked" : ""}>
            <span>${escapeHtml(m)}</span>
          </label>
        `;
      })
      .join("");
    matList.querySelectorAll("input").forEach((cb) => {
      cb.addEventListener("change", () => {
        const idx = Number(cb.dataset.matIdx);
        if (cb.checked && !ps.checkedMaterials.includes(idx)) ps.checkedMaterials.push(idx);
        if (!cb.checked) ps.checkedMaterials = ps.checkedMaterials.filter((i) => i !== idx);
        saveState();
      });
    });

    // Step 2
    document.getElementById("p-step2-title").textContent = project.step2.title;
    document.getElementById("p-step2-desc").textContent = project.step2.desc;
    const discoverList = document.getElementById("project-discover-list");
    discoverList.innerHTML = project.step2.prompts
      .map(
        (pr) => `
        <div class="discover-card">
          <label for="disc-${pr.id}">${escapeHtml(pr.label)}</label>
          <textarea id="disc-${pr.id}" class="mini-textarea discover-input" data-disc-id="${pr.id}" rows="3" placeholder="${escapeHtml(pr.placeholder)}">${escapeHtml(ps.discoverNotes[pr.id] || "")}</textarea>
        </div>
      `
      )
      .join("");
    discoverList.querySelectorAll(".discover-input").forEach((ta) => {
      ta.addEventListener("input", () => {
        ps.discoverNotes[ta.dataset.discId] = ta.value;
        saveState();
      });
    });

    // Step 3: Drawing Pad
    document.getElementById("p-step3-title").textContent = project.step3.title;
    document.getElementById("p-step3-desc").textContent = project.step3.desc;
    document.getElementById("project-caption-input").value = ps.captionText || "";
    if (CANVAS.mount) {
      CANVAS.mount(document.getElementById("project-canvas-host"), {
        initialDataUrl: ps.sketchDataUrl || "",
        onChange: (dataUrl) => {
          ps.sketchDataUrl = dataUrl;
          saveState();
        }
      });
    }

    // Step 4: Show & Tell
    document.getElementById("p-step4-title").textContent = project.step4.title;
    document.getElementById("p-step4-desc").textContent = project.step4.desc;
    const pStarters = document.getElementById("project-starter-chips");
    pStarters.innerHTML = project.step4.starters
      .map((s) => `<button type="button" class="starter-chip" data-p-starter="${escapeHtml(s)}">${escapeHtml(s)}</button>`)
      .join("");
    pStarters.querySelectorAll(".starter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ta = document.getElementById("project-showcase-input");
        const prefix = ta.value.trim() ? ta.value.trimEnd() + " " : "";
        ta.value = prefix + btn.dataset.pStarter + " ";
        ps.showcaseText = ta.value;
        saveState();
        ta.focus();
      });
    });

    document.getElementById("project-showcase-input").value = ps.showcaseText || "";
    const pFeedback = document.getElementById("project-submit-feedback");
    if (ps.completedAt) {
      pFeedback.classList.remove("hidden");
      pFeedback.textContent = "Hooray! Your Project Poster is saved and ready to print in My Book!";
    } else {
      pFeedback.classList.add("hidden");
    }

    showView("project-detail");
  }

  // ---------- VIEW 7: PRINTABLE WORKSHEET BOOK & REPORT ----------

  function buildPlainTextReport() {
    const stats = getOverallStats();
    const lines = [
      `GRADE 2 PERSONAL WORKSHEET REPORT`,
      `Student: ${state.profile.studentName}`,
      `Date: ${formatFriendlyDate(getTodayKey())}`,
      `Total Stars: ${stats.totalStars} | Level: ${stats.rank} | Streak: ${stats.streak} ${stats.streak === 1 ? "day" : "days"}`,
      ``,
      `=== DAILY ROUTINES (THIS WEEK) ===`
    ];
    getCurrentWeekDates().forEach((d) => {
      const log = state.routineLogs[d.key];
      const count = log ? log.checkedIds.length : 0;
      lines.push(
        `${d.key} (${d.shortDay}): ${count}/${getActiveRoutines().length} habits | Book: ${log?.readingBook || "-"} | Note: ${log?.note || "-"}`
      );
    });
    lines.push(``, `=== TASKS ===`);
    TASKS.forEach((t) => {
      const ts = state.tasks[t.id];
      lines.push(`Task ${t.number}: ${t.title} — ${isTaskDone(t.id) ? "Completed" : "In Progress"}`);
      lines.push(`Answer: ${ts.writingText || "(Not written yet)"}`);
      lines.push(``);
    });
    lines.push(`=== PROJECTS ===`);
    PROJECTS.forEach((p) => {
      const ps = state.projects[p.id];
      lines.push(`Project ${p.number}: ${p.title} (${ps.completedSteps.filter(Boolean).length}/4 steps)`);
      lines.push(`Plan: ${ps.planText || "-"}`);
      lines.push(`Show & Tell: ${ps.showcaseText || "-"}`);
      lines.push(``);
    });
    return lines.join("\n");
  }

  function renderReport() {
    renderTopbar();
    document.querySelectorAll("[data-report-mode]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.reportMode === activeReportMode);
    });

    const stats = getOverallStats();
    const showRoutines = activeReportMode === "all" || activeReportMode === "routines";
    const showTasks = activeReportMode === "all" || activeReportMode === "tasks";
    const showProjects = activeReportMode === "all" || activeReportMode === "projects";

    const weekRows = getCurrentWeekDates()
      .map((d) => {
        const log = state.routineLogs[d.key] || defaultRoutineDayLog();
        const moodObj = (DATA.moods || []).find((m) => m.id === log.mood);
        return `
          <tr>
            <td><strong>${d.shortDay}, ${d.dayNum}</strong></td>
            <td>${log.checkedIds.length} / ${getActiveRoutines().length}</td>
            <td>${escapeHtml(log.readingBook || "—")}</td>
            <td>${escapeHtml(moodObj ? moodObj.label : "—")}</td>
            <td>${escapeHtml(log.note || "—")}</td>
          </tr>
        `;
      })
      .join("");

    const tasksHtml = TASKS.map((t) => {
      const ts = state.tasks[t.id];
      const fb = state.feedback[t.id];
      return `
        <div class="report-item-box">
          <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px;">
            <strong>Task ${t.number}: ${escapeHtml(t.title)} (${escapeHtml(t.subject)})</strong>
            <span>Clue Stars: ${getTaskWarmupStars(t)}/${t.warmup.length} • ${isTaskDone(t.id) ? "Completed" : "In Progress"}</span>
          </div>
          <p style="margin-bottom:6px;"><strong>My Writing:</strong> ${escapeHtml(ts.writingText || "(No answer written yet)")}</p>
          ${ts.sketchDataUrl ? `<img class="report-sketch-img" src="${ts.sketchDataUrl}" alt="Drawing for ${escapeHtml(t.title)}">` : ""}
          ${fb && (fb.stamp || fb.note) ? `<p style="margin-top:8px;color:#92400e;"><strong>Sticker (${escapeHtml(fb.stamp || "Note")}):</strong> ${escapeHtml(fb.note)}</p>` : ""}
        </div>
      `;
    }).join("");

    const projectsHtml = PROJECTS.map((p) => {
      const ps = state.projects[p.id];
      const fb = state.feedback[p.id];
      const discoverHtml = p.step2.prompts
        .map((pr) => `<li><strong>${escapeHtml(pr.label)}</strong> ${escapeHtml(ps.discoverNotes[pr.id] || "—")}</li>`)
        .join("");

      return `
        <div class="report-item-box">
          <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
            <strong style="font-size:1.1rem;">Project ${p.number}: ${escapeHtml(p.title)}</strong>
            <span>${ps.completedSteps.filter(Boolean).length} / 4 Milestones Done</span>
          </div>
          <p style="margin-bottom:6px;"><strong>My Plan:</strong> ${escapeHtml(ps.planText || "—")}</p>
          <ul style="margin:6px 0 10px 20px;padding:0;">${discoverHtml}</ul>
          ${ps.sketchDataUrl ? `<div><strong>${escapeHtml(ps.captionText || "My Project Drawing")}:</strong><img class="report-sketch-img" src="${ps.sketchDataUrl}" alt="Project sketch"></div>` : ""}
          <p style="margin-top:10px;"><strong>Show &amp; Tell:</strong> ${escapeHtml(ps.showcaseText || "—")}</p>
          ${fb && (fb.stamp || fb.note) ? `<p style="margin-top:8px;color:#92400e;"><strong>Sticker (${escapeHtml(fb.stamp || "Note")}):</strong> ${escapeHtml(fb.note)}</p>` : ""}
        </div>
      `;
    }).join("");

    document.getElementById("report-sheet").innerHTML = `
      <div class="report-header">
        <div>
          <span class="section-tag tag-teal">Grade 2 Personal Worksheet Book</span>
          <h1 style="margin-top:6px;">${escapeHtml(state.profile.studentName)}'s Progress &amp; Posters</h1>
          <p style="color:var(--text-muted);">Printed ${escapeHtml(formatFriendlyDate(getTodayKey()))}</p>
        </div>
        <div style="text-align:right;">
          <strong>${stats.totalStars} Total Stars</strong><br>
          <span>Level: ${escapeHtml(stats.rank)} • Streak: ${stats.streak} ${stats.streak === 1 ? "day" : "days"}</span>
        </div>
      </div>

      ${
        showRoutines
          ? `<div class="report-section">
               <h2>1. Weekly Daily Routines Log</h2>
               <div class="admin-table-wrap">
                 <table class="admin-roster-table">
                   <thead><tr><th>Day</th><th>Habits</th><th>Book Read</th><th>Feeling</th><th>Reflection</th></tr></thead>
                   <tbody>${weekRows}</tbody>
                 </table>
               </div>
             </div>`
          : ""
      }
      ${showTasks ? `<div class="report-section"><h2>2. Learning Tasks</h2>${tasksHtml}</div>` : ""}
      ${showProjects ? `<div class="report-section"><h2>3. Project Posters</h2>${projectsHtml}</div>` : ""}
    `;
  }

  // ---------- VIEW 8: PARENT / TEACHER CONTROL PANEL ----------

  function renderParentPanel() {
    renderTopbar();
    updateSyncStatusUI();
    const stats = getOverallStats();

    document.getElementById("parent-kpi-grid").innerHTML = `
      <div class="stat-box"><span class="stat-label">Student</span><strong class="stat-value">${escapeHtml(state.profile.studentName)}</strong></div>
      <div class="stat-box"><span class="stat-label">Today's Routines</span><strong class="stat-value">${stats.todayChecked} / ${stats.totalRoutines}</strong></div>
      <div class="stat-box"><span class="stat-label">Tasks Finished</span><strong class="stat-value">${stats.tasksDone} / ${stats.totalTasks}</strong></div>
      <div class="stat-box"><span class="stat-label">Total Stars</span><strong class="stat-value">${stats.totalStars} ★</strong></div>
    `;

    // Profile form values
    document.getElementById("parent-student-name-input").value = state.profile.studentName || "";
    document.getElementById("parent-mascot-select").value = state.profile.mascot || "owl";
    document.getElementById("parent-subtitle-input").value = state.profile.greetingNote || "";

    // Routines Manager
    const rList = document.getElementById("parent-routines-list");
    rList.innerHTML = state.routines
      .map((r) => {
        const grp = ROUTINE_GROUPS.find((g) => g.id === r.group);
        return `
          <div class="parent-routine-row">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;flex:1;">
              <input type="checkbox" class="toggle-routine-active" data-r-id="${escapeHtml(r.id)}" ${r.active !== false ? "checked" : ""}>
              <span><strong>[${escapeHtml(grp ? grp.title : r.group)}]</strong> ${escapeHtml(r.title)}</span>
            </label>
            ${r.custom ? `<button type="button" class="btn btn-ghost btn-sm delete-routine-btn" data-r-id="${escapeHtml(r.id)}">Remove</button>` : ""}
          </div>
        `;
      })
      .join("");

    rList.querySelectorAll(".toggle-routine-active").forEach((cb) => {
      cb.addEventListener("change", () => {
        const found = state.routines.find((r) => r.id === cb.dataset.rId);
        if (found) {
          found.active = cb.checked;
          saveState();
          renderParentPanel();
        }
      });
    });

    rList.querySelectorAll(".delete-routine-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.routines = state.routines.filter((r) => r.id !== btn.dataset.rId);
        saveState();
        renderParentPanel();
      });
    });

    // 7-Day Routine History
    const histBody = document.getElementById("parent-routine-history-tbody");
    const last7 = [];
    const today = new Date();
    for (let i = 0; i < 7; i += 1) {
      const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      last7.push(toDateKey(dt));
    }
    histBody.innerHTML = last7
      .map((key) => {
        const log = state.routineLogs[key] || defaultRoutineDayLog();
        const moodObj = (DATA.moods || []).find((m) => m.id === log.mood);
        return `
          <tr>
            <td><strong>${escapeHtml(formatFriendlyDate(key))}</strong></td>
            <td>${log.checkedIds.length} / ${getActiveRoutines().length}</td>
            <td>${escapeHtml(log.readingBook || "—")}</td>
            <td>${escapeHtml(moodObj ? moodObj.label : "—")}</td>
            <td>${escapeHtml(log.note || "—")}</td>
          </tr>
        `;
      })
      .join("");

    // Review Tasks & Projects + Award Stamps
    const reviewItems = [
      ...TASKS.map((t) => ({
        id: t.id,
        kind: "Task",
        title: `Task ${t.number}: ${t.title}`,
        status: isTaskDone(t.id) ? "Completed" : "In Progress",
        answer: state.tasks[t.id].writingText || "(No writing yet)",
        sketch: state.tasks[t.id].sketchDataUrl || ""
      })),
      ...PROJECTS.map((p) => ({
        id: p.id,
        kind: "Project",
        title: `Project ${p.number}: ${p.title}`,
        status: `${state.projects[p.id].completedSteps.filter(Boolean).length} / 4 Steps`,
        answer: `Plan: ${state.projects[p.id].planText || "—"} | Show & Tell: ${state.projects[p.id].showcaseText || "—"}`,
        sketch: state.projects[p.id].sketchDataUrl || ""
      }))
    ];

    const reviewList = document.getElementById("parent-review-list");
    reviewList.innerHTML = reviewItems
      .map((item) => {
        const fb = state.feedback[item.id] || { stamp: "", note: "" };
        return `
          <article class="review-card">
            <div class="review-card-head">
              <div>
                <span class="section-tag ${item.kind === "Project" ? "tag-emerald" : "tag-teal"}">${item.kind}</span>
                <h3 style="margin-top:6px;">${escapeHtml(item.title)}</h3>
              </div>
              <span class="status-badge ${item.status === "Completed" || item.status === "4 / 4 Steps" ? "status-done" : "status-draft"}">${escapeHtml(item.status)}</span>
            </div>
            <div class="review-student-answer">
              <p>${escapeHtml(item.answer)}</p>
              ${item.sketch ? `<img class="report-sketch-img" style="max-height:170px;" src="${item.sketch}" alt="Student drawing">` : ""}
            </div>
            <div class="stamp-editor-row">
              <select class="admin-select stamp-select" data-item-id="${item.id}" aria-label="Choose sticker stamp">
                <option value="">-- Choose Sticker --</option>
                ${(DATA.stamps || [])
                  .map((st) => `<option value="${escapeHtml(st)}" ${fb.stamp === st ? "selected" : ""}>${escapeHtml(st)}</option>`)
                  .join("")}
              </select>
              <input type="text" class="text-input stamp-note-input" data-item-id="${item.id}" value="${escapeHtml(fb.note || "")}" placeholder="Write a warm note for your student...">
              <button type="button" class="btn btn-primary btn-sm save-stamp-btn" data-item-id="${item.id}">Save Sticker</button>
            </div>
          </article>
        `;
      })
      .join("");

    reviewList.querySelectorAll(".save-stamp-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.itemId;
        const stamp = reviewList.querySelector(`.stamp-select[data-item-id="${id}"]`).value;
        const note = reviewList.querySelector(`.stamp-note-input[data-item-id="${id}"]`).value.trim();
        if (!stamp && !note) {
          delete state.feedback[id];
        } else {
          state.feedback[id] = { stamp, note, updatedAt: new Date().toISOString() };
        }
        saveState();
        btn.textContent = "Saved!";
        setTimeout(() => {
          btn.textContent = "Save Sticker";
        }, 1200);
        renderTopbar();
      });
    });
  }

  function refreshAllVisible() {
    renderTopbar();
    if (activeView === "home") renderHome();
    else if (activeView === "routines") renderRoutines();
    else if (activeView === "tasks") renderTasksHub();
    else if (activeView === "projects") renderProjectsHub();
    else if (activeView === "report") renderReport();
    else if (activeView === "parent") renderParentPanel();
  }

  // ---------- Event Wiring ----------

  function openConfirm(title, desc, onConfirm) {
    document.getElementById("confirm-modal-title").textContent = title;
    document.getElementById("confirm-modal-desc").textContent = desc;
    pendingConfirmAction = onConfirm;
    document.getElementById("confirm-modal").classList.remove("hidden");
  }

  function initEvents() {
    // Topbar & Home Navigation
    document.getElementById("brand-home-btn").addEventListener("click", () => {
      renderHome();
      showView("home");
    });

    document.querySelectorAll(".nav-tab, [data-open-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dest = btn.dataset.nav || btn.dataset.openView;
        if (dest === "home") {
          renderHome();
          showView("home");
        } else if (dest === "routines") {
          renderRoutines();
          showView("routines");
        } else if (dest === "tasks") {
          renderTasksHub();
          showView("tasks");
        } else if (dest === "projects") {
          renderProjectsHub();
          showView("projects");
        }
      });
    });

    document.getElementById("home-tts-welcome-btn").addEventListener("click", () => {
      const name = state.profile.studentName || "Hize";
      speakText(`Hi ${name}! ${state.profile.greetingNote || DATA.defaultProfile.greetingNote}`);
    });

    // Routines events
    document.getElementById("routine-read-aloud-btn").addEventListener("click", () => {
      const list = getActiveRoutines()
        .map((r) => r.title)
        .join(". ");
      speakText(`Here are your daily routines: ${list}`);
    });

    document.getElementById("routine-book-input").addEventListener("input", (e) => {
      getDayLog(selectedDateKey).readingBook = e.target.value;
      saveState();
    });

    document.getElementById("routine-note-input").addEventListener("input", (e) => {
      getDayLog(selectedDateKey).note = e.target.value;
      saveState();
    });

    // Tasks Hub filters & Task Detail buttons
    document.querySelectorAll("[data-task-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTaskFilter = btn.dataset.taskFilter;
        renderTasksHub();
      });
    });

    document.getElementById("back-to-tasks-btn").addEventListener("click", () => {
      renderTasksHub();
      showView("tasks");
    });

    document.getElementById("tts-toggle-btn").addEventListener("click", () => {
      if (isSpeaking) {
        stopSpeech();
      } else {
        const task = TASKS.find((t) => t.id === currentTaskId);
        if (task) startSpeechForTask(task);
      }
    });

    document.getElementById("tts-speed-btn").addEventListener("click", (e) => {
      const rates = [0.75, 0.85, 1.0];
      const nextIdx = (rates.indexOf(speechRate) + 1) % rates.length;
      speechRate = rates[nextIdx];
      e.target.textContent = `${speechRate}x`;
    });

    document.getElementById("task-writing-textarea").addEventListener("input", (e) => {
      const task = TASKS.find((t) => t.id === currentTaskId);
      if (!task) return;
      state.tasks[task.id].writingText = e.target.value;
      document.getElementById("task-save-status").textContent = "Saved!";
      saveState();
      updateTaskWritingMetrics(task);
    });

    document.getElementById("task-clear-btn").addEventListener("click", () => {
      const task = TASKS.find((t) => t.id === currentTaskId);
      if (!task) return;
      openConfirm("Clear your writing?", "This will erase your sentences for this task so you can write a new answer.", () => {
        state.tasks[task.id].writingText = "";
        state.tasks[task.id].completedAt = null;
        document.getElementById("task-writing-textarea").value = "";
        document.getElementById("task-submit-feedback").classList.add("hidden");
        saveState();
        updateTaskWritingMetrics(task);
        renderTopbar();
      });
    });

    document.getElementById("task-submit-btn").addEventListener("click", () => {
      const task = TASKS.find((t) => t.id === currentTaskId);
      if (!task) return;
      const ts = state.tasks[task.id];
      if (!isTaskWritingReady(ts.writingText)) return;
      ts.completedAt = new Date().toISOString();
      saveState();
      const fb = document.getElementById("task-submit-feedback");
      fb.classList.remove("hidden");
      fb.textContent = `Awesome job, ${state.profile.studentName}! You finished "${task.title}" and earned 3 bright stars!`;
      updateTaskWritingMetrics(task);
      renderTopbar();
    });

    document.getElementById("prev-task-btn").addEventListener("click", () => {
      const idx = TASKS.findIndex((t) => t.id === currentTaskId);
      if (idx > 0) openTask(TASKS[idx - 1].id);
    });

    document.getElementById("next-task-btn").addEventListener("click", () => {
      const idx = TASKS.findIndex((t) => t.id === currentTaskId);
      if (idx >= 0 && idx < TASKS.length - 1) openTask(TASKS[idx + 1].id);
    });

    // Projects events
    document.getElementById("back-to-projects-btn").addEventListener("click", () => {
      renderProjectsHub();
      showView("projects");
    });

    document.getElementById("project-preview-poster-btn").addEventListener("click", () => {
      activeReportMode = "projects";
      renderReport();
      showView("report");
    });

    document.querySelectorAll(".project-step-checkbox").forEach((cb) => {
      cb.addEventListener("change", () => {
        const project = PROJECTS.find((p) => p.id === currentProjectId);
        if (!project) return;
        state.projects[project.id].completedSteps[Number(cb.dataset.step)] = cb.checked;
        saveState();
        renderProjectMilestones(project);
        renderTopbar();
      });
    });

    document.getElementById("project-plan-input").addEventListener("input", (e) => {
      if (!currentProjectId) return;
      state.projects[currentProjectId].planText = e.target.value;
      saveState();
    });

    document.getElementById("project-caption-input").addEventListener("input", (e) => {
      if (!currentProjectId) return;
      state.projects[currentProjectId].captionText = e.target.value;
      saveState();
    });

    document.getElementById("project-showcase-input").addEventListener("input", (e) => {
      if (!currentProjectId) return;
      state.projects[currentProjectId].showcaseText = e.target.value;
      saveState();
    });

    document.getElementById("project-complete-btn").addEventListener("click", () => {
      const project = PROJECTS.find((p) => p.id === currentProjectId);
      if (!project) return;
      const ps = state.projects[project.id];
      ps.completedSteps[3] = true;
      ps.completedAt = new Date().toISOString();
      saveState();
      renderProjectMilestones(project);
      renderTopbar();
      const fb = document.getElementById("project-submit-feedback");
      fb.classList.remove("hidden");
      fb.textContent = `Hooray, ${state.profile.studentName}! Your project "${project.title}" is saved! Click "Print Poster" anytime to print it.`;
    });

    // Report / My Book events
    document.getElementById("open-report-btn").addEventListener("click", () => {
      renderReport();
      showView("report");
    });

    document.getElementById("report-back-btn").addEventListener("click", () => {
      renderHome();
      showView("home");
    });

    document.querySelectorAll("[data-report-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeReportMode = btn.dataset.reportMode;
        renderReport();
      });
    });

    document.getElementById("copy-report-btn").addEventListener("click", (e) => {
      const txt = buildPlainTextReport();
      navigator.clipboard?.writeText(txt).then(() => {
        e.target.textContent = "Copied!";
        setTimeout(() => (e.target.textContent = "Copy Text"), 1400);
      });
    });

    document.getElementById("download-report-btn").addEventListener("click", () => {
      const blob = new Blob([buildPlainTextReport()], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grade2-worksheet-${getTodayKey()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById("print-report-btn").addEventListener("click", () => window.print());

    // Confirm Modal
    document.getElementById("confirm-cancel-btn").addEventListener("click", () => {
      document.getElementById("confirm-modal").classList.add("hidden");
      pendingConfirmAction = null;
    });
    document.getElementById("confirm-proceed-btn").addEventListener("click", () => {
      document.getElementById("confirm-modal").classList.add("hidden");
      if (typeof pendingConfirmAction === "function") pendingConfirmAction();
      pendingConfirmAction = null;
    });

    // Parent / Teacher Panel Auth & Actions
    const loginModal = document.getElementById("parent-login-modal");
    const passInput = document.getElementById("parent-password-input");
    const passErr = document.getElementById("parent-login-error");

    document.getElementById("open-parent-btn").addEventListener("click", () => {
      if (isParentUnlocked) {
        renderParentPanel();
        showView("parent");
        return;
      }
      passInput.value = "";
      passErr.classList.add("hidden");
      loginModal.classList.remove("hidden");
      passInput.focus();
    });

    document.getElementById("parent-modal-cancel-btn").addEventListener("click", () => {
      loginModal.classList.add("hidden");
    });

    document.getElementById("parent-login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (PARENT_PASSCODES.includes(passInput.value.trim())) {
        isParentUnlocked = true;
        loginModal.classList.add("hidden");
        renderParentPanel();
        showView("parent");
      } else {
        passErr.classList.remove("hidden");
      }
    });

    document.getElementById("parent-logout-btn").addEventListener("click", () => {
      isParentUnlocked = false;
      renderHome();
      showView("home");
    });

    document.getElementById("parent-save-profile-btn").addEventListener("click", () => {
      const nameVal = document.getElementById("parent-student-name-input").value.trim() || "Little Explorer";
      state.profile.studentName = nameVal;
      state.profile.mascot = document.getElementById("parent-mascot-select").value;
      state.profile.greetingNote =
        document.getElementById("parent-subtitle-input").value.trim() || DATA.defaultProfile.greetingNote;
      saveState();
      renderParentPanel();
      const msg = document.getElementById("parent-profile-msg");
      msg.textContent = "Profile updated!";
      setTimeout(() => (msg.textContent = ""), 1600);
    });

    document.getElementById("parent-add-routine-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const titleInput = document.getElementById("new-routine-title");
      const title = titleInput.value.trim();
      if (!title) return;
      state.routines.push({
        id: "r-custom-" + Date.now(),
        group: document.getElementById("new-routine-group").value,
        title,
        active: true,
        custom: true
      });
      titleInput.value = "";
      saveState();
      renderParentPanel();
    });

    document.getElementById("parent-sync-btn").addEventListener("click", async () => {
      await pushStateToCloud();
      await pullStateFromCloud();
      renderParentPanel();
    });

    document.getElementById("parent-export-json-btn").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grade2-backup-${getTodayKey()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById("parent-import-json-input").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          state = normalizeState(JSON.parse(String(reader.result || "{}")));
          saveState();
          renderParentPanel();
        } catch (_) {}
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    document.getElementById("parent-export-csv-btn").addEventListener("click", () => {
      const rows = [["Date", "Habits Done", "Total Habits", "Book Read", "Mood", "Note"]];
      Object.keys(state.routineLogs)
        .sort()
        .forEach((key) => {
          const log = state.routineLogs[key];
          rows.push([
            key,
            log.checkedIds.length,
            getActiveRoutines().length,
            log.readingBook || "",
            log.mood || "",
            log.note || ""
          ]);
        });
      const csv = rows
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grade2-routines-${getTodayKey()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ---------- Boot ----------
  initEvents();
  renderHome();
  showView("home");
  pullStateFromCloud();
})();
