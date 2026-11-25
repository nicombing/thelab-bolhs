/* Lightweight Touch & Mouse Drawing Pad for Grade 2 Projects & Tasks */

(function () {
  "use strict";

  const PALETTE = [
    { name: "Ink Black", hex: "#1f2937" },
    { name: "Teal", hex: "#0f766e" },
    { name: "Leaf Green", hex: "#16a34a" },
    { name: "Sky Blue", hex: "#0284c7" },
    { name: "Sun Yellow", hex: "#eab308" },
    { name: "Orange", hex: "#f97316" },
    { name: "Berry Red", hex: "#e11d48" },
    { name: "Purple", hex: "#9333ea" }
  ];

  const SIZES = [
    { label: "Thin", width: 4 },
    { label: "Medium", width: 8 },
    { label: "Thick", width: 15 }
  ];

  function mount(container, options) {
    if (!container) return null;
    const opts = options || {};
    let currentColor = PALETTE[0].hex;
    let currentSize = SIZES[1].width;
    let isEraser = false;
    let isDrawing = false;
    const history = [];

    container.innerHTML = `
      <div class="draw-pad-wrap">
        <div class="draw-toolbar">
          <div class="draw-colors" role="group" aria-label="Pick a crayon color">
            ${PALETTE.map(
              (c, idx) =>
                `<button type="button" class="color-swatch ${idx === 0 ? "is-active" : ""}" data-color="${c.hex}" title="${c.name}" aria-label="${c.name}" style="background:${c.hex};"></button>`
            ).join("")}
          </div>
          <div class="draw-tools">
            ${SIZES.map(
              (s, idx) =>
                `<button type="button" class="draw-tool-btn ${idx === 1 ? "is-active" : ""}" data-size="${s.width}">${s.label}</button>`
            ).join("")}
            <button type="button" class="draw-tool-btn" data-tool="eraser">Eraser</button>
            <button type="button" class="draw-tool-btn" data-tool="undo">Undo</button>
            <button type="button" class="draw-tool-btn" data-tool="clear">Clear</button>
          </div>
        </div>
        <canvas class="draw-canvas-el" width="900" height="420" aria-label="Drawing pad"></canvas>
      </div>
    `;

    const canvas = container.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    function fillWhite() {
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    function pushSnapshot() {
      try {
        history.push(canvas.toDataURL("image/png"));
        if (history.length > 20) history.shift();
      } catch (_) {}
    }

    function notifyChange() {
      if (typeof opts.onChange === "function") {
        try {
          opts.onChange(canvas.toDataURL("image/png"));
        } catch (_) {}
      }
    }

    fillWhite();
    if (opts.initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        fillWhite();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        pushSnapshot();
      };
      img.src = opts.initialDataUrl;
    } else {
      pushSnapshot();
    }

    function getCanvasPoint(evt) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / (rect.width || 1);
      const scaleY = canvas.height / (rect.height || 1);
      return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
      };
    }

    function startStroke(evt) {
      evt.preventDefault();
      isDrawing = true;
      if (canvas.setPointerCapture) {
        try {
          canvas.setPointerCapture(evt.pointerId);
        } catch (_) {}
      }
      const pt = getCanvasPoint(evt);
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = isEraser ? "#ffffff" : currentColor;
      ctx.lineWidth = isEraser ? currentSize * 2.2 : currentSize;
      // Draw a dot for single taps
      ctx.lineTo(pt.x + 0.1, pt.y + 0.1);
      ctx.stroke();
    }

    function moveStroke(evt) {
      if (!isDrawing) return;
      evt.preventDefault();
      const pt = getCanvasPoint(evt);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }

    function endStroke() {
      if (!isDrawing) return;
      isDrawing = false;
      ctx.closePath();
      pushSnapshot();
      notifyChange();
    }

    canvas.addEventListener("pointerdown", startStroke);
    canvas.addEventListener("pointermove", moveStroke);
    canvas.addEventListener("pointerup", endStroke);
    canvas.addEventListener("pointercancel", endStroke);

    // Toolbar interactions
    const swatches = container.querySelectorAll(".color-swatch");
    const sizeBtns = container.querySelectorAll("[data-size]");
    const eraserBtn = container.querySelector('[data-tool="eraser"]');
    const undoBtn = container.querySelector('[data-tool="undo"]');
    const clearBtn = container.querySelector('[data-tool="clear"]');

    swatches.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentColor = btn.dataset.color;
        isEraser = false;
        eraserBtn.classList.remove("is-active");
        swatches.forEach((s) => s.classList.toggle("is-active", s === btn));
      });
    });

    sizeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentSize = Number(btn.dataset.size) || 8;
        sizeBtns.forEach((s) => s.classList.toggle("is-active", s === btn));
      });
    });

    eraserBtn.addEventListener("click", () => {
      isEraser = !isEraser;
      eraserBtn.classList.toggle("is-active", isEraser);
    });

    undoBtn.addEventListener("click", () => {
      if (history.length <= 1) return;
      history.pop();
      const prev = history[history.length - 1];
      const img = new Image();
      img.onload = () => {
        fillWhite();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        notifyChange();
      };
      img.src = prev;
    });

    clearBtn.addEventListener("click", () => {
      fillWhite();
      pushSnapshot();
      if (typeof opts.onChange === "function") {
        opts.onChange("");
      }
    });

    return {
      getDataUrl: () => canvas.toDataURL("image/png")
    };
  }

  window.G2_CANVAS = { mount };
})();
