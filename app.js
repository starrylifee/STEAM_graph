const readableSheet = (page) => `source_images_review_alt/20260611075405_page_${page}.png`;
const originalSheet = (page) => `source_images/20260611075405_page_${page}.png`;

const gamesData = [
  {
    id: "spider",
    title: "막대선생의 거미잡기",
    student: "백민호, 송서진, 조승재",
    concept: "자료를 직접 수집해 막대그래프로 나타내고 해석하기",
    summary: "거미를 직접 사냥해 모은 기록을 시간 안에 막대그래프로 그리고, 그래프를 읽어 막대선생을 구출합니다.",
    sheets: [1, 2, 3, 4].map(readableSheet),
    originalSheets: [1, 2, 3, 4].map(originalSheet),
    preview: readableSheet(1),
    color: "#257a5c",
    soft: "#dff4e9",
    ink: "#1f6b50",
    tags: ["거미 사냥", "자료 수집", "그래프 그리기", "시간 도전"]
  },
  {
    id: "delivery",
    title: "도와줘 인형 배송",
    student: "미니언즈 4중사",
    concept: "막대그래프를 읽고 눈금을 해석해 수량 맞추기",
    summary: "컨베이어로 밀려오는 인형을 주문서 그래프와 똑같아지게 배송합니다. 떨어뜨리면 부서지고, 너무 보내면 손님이 화나요!",
    sheets: [5, 6, 7].map(readableSheet),
    originalSheets: [5, 6, 7].map(originalSheet),
    preview: readableSheet(7),
    color: "#d95f4f",
    soft: "#ffe7df",
    ink: "#b7473b",
    tags: ["그래프 읽기", "눈금 해석", "컨베이어", "실시간 분류"]
  },
  {
    id: "catch",
    title: "벌레와 생쥐를 잡아라",
    student: "바 선생",
    concept: "자료를 분류해 세고 일치하는 막대그래프 판별하기",
    summary: "깜깜한 방을 손전등으로 비춰 도망 다니는 녀석들을 잡고, 뒤죽박죽 포획 주머니를 세어 똑같은 그래프를 찾아냅니다.",
    sheets: [8, 9, 10].map(readableSheet),
    originalSheets: [8, 9, 10].map(originalSheet),
    preview: readableSheet(10),
    color: "#e2a72c",
    soft: "#fff1c8",
    ink: "#8a620d",
    tags: ["손전등 수색", "분류해 세기", "그래프 판별", "야간 작전"]
  },
  {
    id: "stairs",
    title: "막대그래프 계단을 쌓아라",
    student: "우당탕즈",
    concept: "여러 표현의 자료 값을 비교해 작은 수부터 배열하기",
    summary: "호랑이가 쫓아와요! 떡 인기 투표를 읽고 표가 적은 떡 상자부터 계단을 쌓아 하늘 동아줄로 탈출합니다.",
    sheets: [11, 12, 13, 14, 15].map(readableSheet),
    originalSheets: [11, 12, 13, 14, 15].map(originalSheet),
    preview: readableSheet(15),
    color: "#7057b8",
    soft: "#eee8ff",
    ink: "#5b4698",
    tags: ["크기 비교", "순서 배열", "호랑이 추격", "그림그래프"]
  },
  {
    id: "rocket",
    title: "막대그래프 로켓",
    student: "고가고구",
    concept: "자료 사이의 관계를 추리해 막대그래프 완성하기",
    summary: "단서 카드를 추리해 연료 탱크의 높이를 알아내고, 카운트다운이 끝나기 전에 그래프를 완성해 로켓을 우주로 보냅니다.",
    sheets: [16, 17, 18, 19].map(readableSheet),
    originalSheets: [16, 17, 18, 19].map(originalSheet),
    preview: readableSheet(19),
    color: "#3f75c9",
    soft: "#e4eeff",
    ink: "#315da0",
    tags: ["단서 추리", "카운트다운", "그래프 그리기", "발사"]
  }
];

const elements = {
  dashboardView: document.getElementById("dashboard-view"),
  gameView: document.getElementById("game-view"),
  gameGrid: document.getElementById("game-grid"),
  backButton: document.getElementById("back-button"),
  soundButton: document.getElementById("sound-button"),
  title: document.getElementById("app-title"),
  gameTitle: document.getElementById("game-title"),
  gameStudent: document.getElementById("game-student"),
  gameConcept: document.getElementById("game-concept"),
  levelLabel: document.getElementById("level-label"),
  scoreLabel: document.getElementById("score-label"),
  attemptLabel: document.getElementById("attempt-label"),
  scene: document.getElementById("scene"),
  controls: document.getElementById("controls"),
  designButton: document.getElementById("design-button"),
  overlay: document.getElementById("result-overlay"),
  overlayKicker: document.getElementById("overlay-kicker"),
  overlayTitle: document.getElementById("overlay-title"),
  overlayMessage: document.getElementById("overlay-message"),
  overlayButton: document.getElementById("overlay-button"),
  designModal: document.getElementById("design-modal"),
  designTitle: document.getElementById("design-title"),
  // PDF 열기 / 원본 보기 비활성화: 읽기용 이미지만 사용
  // pdfLink: document.getElementById("pdf-link"),
  // sheetReadable: document.getElementById("sheet-readable"),
  // sheetOriginal: document.getElementById("sheet-original"),
  closeDesignButton: document.getElementById("close-design-button"),
  sheetPrev: document.getElementById("sheet-prev"),
  sheetNext: document.getElementById("sheet-next"),
  sheetImage: document.getElementById("sheet-image"),
  sheetCaption: document.getElementById("sheet-caption")
};

class SoundSynth {
  constructor() {
    this.enabled = true;
    this.context = null;
  }

  ensure() {
    if (!this.enabled) return null;
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      this.context = new AudioContext();
    }
    if (this.context.state === "suspended") this.context.resume();
    return this.context;
  }

  tone(frequency, duration = 0.12, type = "sine", volume = 0.05) {
    const ctx = this.ensure();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.stop(ctx.currentTime + duration);
  }

  playSelect() {
    this.tone(420, 0.08, "triangle", 0.04);
  }

  playMove() {
    this.tone(260, 0.07, "square", 0.025);
  }

  playSuccess() {
    this.tone(520, 0.12, "triangle", 0.05);
    setTimeout(() => this.tone(720, 0.14, "triangle", 0.05), 95);
  }

  playFailure() {
    this.tone(170, 0.16, "sawtooth", 0.035);
  }

  playWin() {
    [520, 640, 780, 960].forEach((note, index) => {
      setTimeout(() => this.tone(note, 0.12, "triangle", 0.05), index * 82);
    });
  }
}

const sound = new SoundSynth();
let currentGame = null;
let activeGameInfo = null;
let activeSheets = [];
let activeSheetIndex = 0;
let activeSheetMode = "readable";

function renderDashboard() {
  elements.gameGrid.innerHTML = "";
  gamesData.forEach((game, index) => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.style.setProperty("--card-color", game.color);
    card.style.setProperty("--card-soft", game.soft);
    card.style.setProperty("--card-ink", game.ink);
    card.innerHTML = `
      <img src="${game.preview}" alt="${game.title} 설계 미리보기">
      <div class="game-card-body">
        <p class="eyebrow">게임 ${index + 1}</p>
        <h3>${game.title}</h3>
        <p><strong>기획:</strong> ${game.student}</p>
        <p>${game.summary}</p>
        <div class="tag-row">${game.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <button class="primary-button" type="button">플레이</button>
      </div>
    `;
    card.querySelector("button").onclick = () => enterGame(game.id);
    elements.gameGrid.append(card);
  });
}

function showView(name) {
  const isGame = name === "game";
  elements.dashboardView.classList.toggle("hidden", isGame);
  elements.gameView.classList.toggle("hidden", !isGame);
  elements.backButton.classList.toggle("hidden", !isGame);
}

function enterGame(id) {
  sound.playSelect();
  currentGame?.cleanup?.();
  activeGameInfo = gamesData.find((game) => game.id === id);
  elements.title.textContent = activeGameInfo.title;
  elements.gameTitle.textContent = activeGameInfo.title;
  elements.gameStudent.textContent = `기획: ${activeGameInfo.student}`;
  elements.gameConcept.textContent = activeGameInfo.concept;
  showView("game");
  currentGame = new gameClasses[id](activeGameInfo);
  currentGame.start();
}

function backToDashboard() {
  currentGame?.cleanup?.();
  currentGame = null;
  activeGameInfo = null;
  elements.title.textContent = "막대그래프 게임 연구소";
  showView("dashboard");
}

function showOverlay(success, title, message, onContinue, buttonText = "계속") {
  elements.overlayKicker.textContent = success ? "성공" : "점검";
  elements.overlayTitle.textContent = title;
  elements.overlayMessage.textContent = message;
  elements.overlayButton.textContent = buttonText;
  elements.overlayButton.onclick = () => {
    elements.overlay.classList.add("hidden");
    onContinue?.();
  };
  elements.overlay.classList.remove("hidden");
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function makeTable(categories, values, label = "수") {
  return `
    <table class="data-table">
      <thead><tr>${categories.map((item) => `<th>${item}</th>`).join("")}</tr></thead>
      <tbody><tr>${values.map((value) => `<td>${value}${label}</td>`).join("")}</tr></tbody>
    </table>
  `;
}

function chartHtml(categories, values, max, options = {}) {
  const colors = options.colors || ["#3f75c9", "#257a5c", "#d95f4f", "#e2a72c", "#7057b8"];
  const axis = [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0];
  return `
    <div class="chart-wrap">
      <div class="axis-labels">${axis.map((value) => `<span>${value}</span>`).join("")}</div>
      <div class="bar-chart" style="--bar-count:${categories.length}">
        ${categories.map((category, index) => {
          const percent = max === 0 ? 0 : (values[index] / max) * 100;
          const selectedClass = options.selectedIndex === index ? " selected-bar" : "";
          return `
            <div class="bar-item${selectedClass}">
              <span class="bar-value">${values[index]}</span>
              <div class="bar" style="height:${Math.max(4, percent)}%; --bar-color:${colors[index % colors.length]}"></div>
              <span class="bar-name">${category}</span>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function addSliders(parent, categories, values, max, onChange) {
  const list = document.createElement("div");
  list.className = "slider-list";
  categories.forEach((category, index) => {
    const row = document.createElement("label");
    row.className = "slider-row";
    row.innerHTML = `
      <span>${category}</span>
      <input type="range" min="0" max="${max}" step="1" value="${values[index]}">
      <span class="slider-value">${values[index]}</span>
    `;
    const input = row.querySelector("input");
    const output = row.querySelector(".slider-value");
    input.oninput = () => {
      values[index] = Number(input.value);
      output.textContent = values[index];
      onChange();
    };
    list.append(row);
  });
  parent.append(list);
}

class BaseGame {
  constructor(info) {
    this.info = info;
    this.scene = elements.scene;
    this.controls = elements.controls;
    this.score = 0;
    this.levelIndex = 0;
    this.attempts = 3;
    this.maxAttempts = 3;
    this.keyHandler = null;
    this.timer = null;
    this.timeouts = [];
    this.intervals = [];
  }

  start() {
    this.score = 0;
    this.levelIndex = 0;
    this.attempts = this.maxAttempts;
    this.initLevel();
  }

  delay(fn, ms) {
    const id = setTimeout(fn, ms);
    this.timeouts.push(id);
    return id;
  }

  every(fn, ms) {
    const id = setInterval(fn, ms);
    this.intervals.push(id);
    return id;
  }

  clearTimers() {
    this.timeouts.forEach(clearTimeout);
    this.intervals.forEach(clearInterval);
    this.timeouts = [];
    this.intervals = [];
  }

  cleanup() {
    this.clearTimers();
    if (this.keyHandler) {
      window.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.scene.innerHTML = "";
    this.controls.innerHTML = "";
  }

  updateMetrics() {
    elements.levelLabel.textContent = `${this.levelIndex + 1}/${this.levels.length}`;
    elements.scoreLabel.textContent = this.score;
    elements.attemptLabel.textContent = this.attempts;
  }

  addScore(points) {
    this.score += points;
    this.updateMetrics();
  }

  nextLevel(message) {
    const isLast = this.levelIndex >= this.levels.length - 1;
    if (isLast) {
      sound.playWin();
      showOverlay(true, "전체 성공", message, backToDashboard, "대시보드");
      return;
    }
    sound.playSuccess();
    showOverlay(true, "단계 성공", message, () => {
      this.levelIndex += 1;
      this.attempts = this.maxAttempts;
      this.initLevel();
    }, "다음 단계");
  }

  fail(message) {
    this.attempts -= 1;
    this.updateMetrics();
    sound.playFailure();
    if (this.attempts <= 0) {
      showOverlay(false, "처음부터 다시", message, () => {
        this.attempts = this.maxAttempts;
        this.score = Math.max(0, this.score - 10);
        this.initLevel();
      }, "다시 도전");
      return;
    }
    showOverlay(false, "조금만 고치면 돼요", message, () => this.initLevel(), "다시 맞추기");
  }
}

class SpiderGraphGame extends BaseGame {
  constructor(info) {
    super(info);
    this.levels = [
      {
        title: "1층 수색",
        rooms: ["화장실", "거실", "방"],
        spawns: 10,
        decoys: 0,
        visibleMs: 1700,
        spawnGapMs: 1500,
        huntSec: 18,
        graphSec: 50,
        max: 6
      },
      {
        title: "온 집 안 수색",
        rooms: ["화장실", "거실", "방", "베란다"],
        spawns: 14,
        decoys: 0,
        visibleMs: 1400,
        spawnGapMs: 1250,
        huntSec: 20,
        graphSec: 55,
        max: 7
      },
      {
        title: "막대선생 구출 작전",
        rooms: ["부엌", "창문", "소파", "욕조"],
        spawns: 16,
        decoys: 5,
        visibleMs: 1100,
        spawnGapMs: 850,
        huntSec: 20,
        graphSec: 60,
        max: 8
      }
    ];
  }

  initLevel() {
    this.clearTimers();
    this.phase = "brief";
    this.level = this.levels[this.levelIndex];
    this.updateMetrics();
    this.renderBriefing();
  }

  renderBriefing() {
    const { rooms, spawns, decoys, huntSec, graphSec } = this.level;
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title}</h3>
          <span class="scene-badge">막대선생 구조 작전</span>
        </div>
        <div class="hunt-brief">
          <p class="panel-copy"><strong>1. 사냥 (${huntSec}초):</strong> ${rooms.join(", ")}에 거미 🕷️ ${spawns}마리가 잠깐씩 나타나요. 사라지기 전에 눌러서 잡으세요. <strong>도망간 거미는 막대선생을 감는 거미줄을 한 겹씩 늘립니다!</strong></p>
          <p class="panel-copy"><strong>2. 그래프 (${graphSec}초):</strong> 어느 방에서 몇 마리 잡았는지 기억해서 막대그래프로 그리세요. 정확한 막대 하나마다 거미줄이 한 겹 끊어져요.</p>
          <p class="panel-copy"><strong>3. 구출:</strong> 그래도 남은 거미줄은 내가 만든 그래프를 읽고 질문에 답해서 끊어요. 시간이 다 되면 실패!</p>
          ${decoys ? `<p class="panel-copy decoy-warning">⚠️ 이번엔 행운의 무당벌레 🐞도 나타나요. 무당벌레를 잡으면 거미줄이 오히려 늘어납니다!</p>` : ""}
        </div>
      </div>
    `;
    this.controls.innerHTML = `
      <h3 class="panel-title">작전 준비</h3>
      <p class="panel-copy">잡으면서 방마다 몇 마리인지 세어 두면 그래프 그리기가 훨씬 쉬워져요.</p>
    `;
    const start = document.createElement("button");
    start.className = "primary-button";
    start.type = "button";
    start.textContent = "사냥 시작!";
    start.onclick = () => this.startHunt();
    this.controls.append(start);
  }

  makeSpawnPlan() {
    const { rooms, spawns, decoys, max } = this.level;
    const planned = rooms.map(() => 1);
    let left = spawns - rooms.length;
    while (left > 0) {
      const i = Math.floor(Math.random() * rooms.length);
      if (planned[i] < max) {
        planned[i] += 1;
        left -= 1;
      }
    }
    const plan = [];
    planned.forEach((count, room) => {
      for (let k = 0; k < count; k += 1) plan.push({ room, decoy: false });
    });
    for (let k = 0; k < decoys; k += 1) {
      plan.push({ room: Math.floor(Math.random() * rooms.length), decoy: true });
    }
    for (let i = plan.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [plan[i], plan[j]] = [plan[j], plan[i]];
    }
    return plan;
  }

  startHunt() {
    this.phase = "hunt";
    this.counts = this.level.rooms.map(() => 0);
    this.escaped = 0;
    this.decoyHits = 0;
    this.activePops = 0;
    this.plan = this.makeSpawnPlan();
    this.huntLeft = this.level.huntSec;
    this.renderHuntScene();
    this.every(() => {
      this.huntLeft -= 1;
      this.updateHuntHud();
      if (this.huntLeft <= 0) this.endHunt();
    }, 1000);
    this.every(() => {
      if (this.plan.length) this.spawnPop(this.plan.shift());
    }, this.level.spawnGapMs);
    this.spawnPop(this.plan.shift());
  }

  renderHuntScene() {
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title} · 거미 사냥</h3>
          <span class="scene-badge timer-badge">⏱ <b id="hunt-timer">${this.huntLeft}</b>초</span>
        </div>
        <div class="hunt-grid">
          ${this.level.rooms.map((name, index) => `
            <div class="room-panel">
              <div class="room-head"><span>${name}</span><span class="room-tally" id="tally-${index}"></span></div>
              <div class="room-body" id="room-${index}"></div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    this.controls.innerHTML = `
      <h3 class="panel-title">사냥 현황</h3>
      <p class="panel-copy">나타난 거미를 사라지기 전에 누르세요! 방마다 몇 마리 잡았는지 기억해 두세요.</p>
      <div class="hunt-stats">
        <p>잡았다 <b id="hunt-caught">0</b></p>
        <p>도망 <b id="hunt-escaped">0</b></p>
        ${this.level.decoys ? '<p>🐞 실수 <b id="hunt-decoy">0</b></p>' : ""}
      </div>
    `;
  }

  updateHuntHud() {
    const timer = document.getElementById("hunt-timer");
    if (timer) {
      timer.textContent = Math.max(0, this.huntLeft);
      timer.closest(".timer-badge").classList.toggle("low", this.huntLeft <= 5);
    }
    const caught = document.getElementById("hunt-caught");
    if (caught) caught.textContent = this.counts.reduce((a, b) => a + b, 0);
    const escaped = document.getElementById("hunt-escaped");
    if (escaped) escaped.textContent = this.escaped;
    const decoy = document.getElementById("hunt-decoy");
    if (decoy) decoy.textContent = this.decoyHits;
  }

  spawnPop(entry) {
    if (!entry || this.phase !== "hunt") return;
    const body = document.getElementById(`room-${entry.room}`);
    if (!body) return;
    const pop = document.createElement("button");
    pop.type = "button";
    pop.className = `spider-pop${entry.decoy ? " decoy" : ""}`;
    pop.textContent = entry.decoy ? "🐞" : "🕷️";
    pop.style.left = `${8 + Math.random() * 60}%`;
    pop.style.top = `${10 + Math.random() * 50}%`;
    this.activePops += 1;
    let resolved = false;
    const finish = () => {
      this.activePops -= 1;
      this.maybeEndEarly();
    };
    pop.onclick = () => {
      if (resolved) return;
      resolved = true;
      pop.classList.add("smashed");
      if (entry.decoy) {
        this.decoyHits += 1;
        this.addScore(-Math.min(5, this.score));
        sound.playFailure();
      } else {
        this.counts[entry.room] += 1;
        this.addScore(5);
        sound.playSelect();
        const tally = document.getElementById(`tally-${entry.room}`);
        if (tally) tally.textContent += "🕷";
      }
      this.updateHuntHud();
      this.delay(() => {
        pop.remove();
        finish();
      }, 240);
    };
    this.delay(() => {
      if (resolved) return;
      resolved = true;
      if (!entry.decoy) this.escaped += 1;
      pop.classList.add("fled");
      this.updateHuntHud();
      this.delay(() => {
        pop.remove();
        finish();
      }, 380);
    }, this.level.visibleMs);
    body.append(pop);
  }

  maybeEndEarly() {
    if (this.phase === "hunt" && this.plan.length === 0 && this.activePops === 0) {
      this.delay(() => this.endHunt(), 500);
    }
  }

  endHunt() {
    if (this.phase !== "hunt") return;
    this.phase = "graph";
    this.clearTimers();
    this.strands = this.level.rooms.length + Math.min(this.escaped + this.decoyHits, 6);
    this.startGraphPhase();
  }

  startGraphPhase() {
    this.values = this.level.rooms.map(() => 0);
    this.locked = this.level.rooms.map(() => false);
    this.graphLeft = this.level.graphSec;
    this.peeking = false;
    this.lastQuestionType = null;
    this.renderGraphScene();
    this.renderGraphControls();
    this.every(() => {
      this.graphLeft -= 1;
      this.updateGraphTimer();
      if (this.graphLeft <= 0) this.timeUp();
    }, 1000);
  }

  renderGraphScene() {
    const { rooms, max } = this.level;
    const colors = ["#257a5c", "#3f75c9", "#d95f4f", "#e2a72c"];
    const extra = this.escaped + this.decoyHits;
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title} · 그래프로 구출</h3>
          <span class="scene-badge timer-badge">⏱ <b id="graph-timer">${this.graphLeft}</b>초</span>
        </div>
        <p class="panel-copy">${extra > 0
          ? `거미 ${this.escaped}마리가 도망갔어요${this.decoyHits ? ` (무당벌레 실수 ${this.decoyHits}번)` : ""}. 거미줄이 더 두꺼워졌습니다!`
          : "한 마리도 놓치지 않았어요! 거미줄이 가장 얇은 상태입니다."}</p>
        <div class="rescue-row">
          <div class="web-cage">
            <div class="cage-teacher">🧑‍🏫<span>막대선생</span></div>
            <div class="strand-list" id="strand-list"></div>
            <p class="cage-note">남은 거미줄 <b id="strand-count">${this.strands}</b>겹</p>
          </div>
          <div class="gchart-wrap">
            <div class="gchart" style="--cols:${rooms.length}">
              <div class="gcol axis">
                <span class="gval">&nbsp;</span>
                <div class="gcells">
                  ${Array.from({ length: max }, (_, i) => `<span class="gaxis-num">${i + 1}</span>`).join("")}
                </div>
                <span class="gname">(마리)</span>
              </div>
              ${rooms.map((name, index) => `
                <div class="gcol" id="gcol-${index}" style="--bar-color:${colors[index % colors.length]}">
                  <span class="gval" id="gval-${index}">0</span>
                  <div class="gcells">
                    ${Array.from({ length: max }, (_, cell) => `<button type="button" class="gcell" data-col="${index}" data-cell="${cell}"></button>`).join("")}
                  </div>
                  <span class="gname">${name}</span>
                </div>
              `).join("")}
            </div>
            <div class="peek-cover hidden" id="peek-cover">
              <h4>📖 사냥 기록장</h4>
              ${rooms.map((name, index) => `<p class="peek-row"><strong>${name}</strong><span>${"🕷".repeat(this.counts[index]) || "없음"}</span></p>`).join("")}
              <p class="panel-copy">기록장을 덮어야 그래프를 만질 수 있어요.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    this.renderStrands();
    this.scene.querySelectorAll(".gcell").forEach((cell) => {
      cell.onclick = () => this.setBar(Number(cell.dataset.col), Number(cell.dataset.cell));
    });
  }

  renderGraphControls() {
    this.controls.innerHTML = `
      <h3 class="panel-title">구조 도구</h3>
      <p class="panel-copy">방마다 잡은 수만큼 칸을 눌러 막대를 그리세요. 정확한 막대 하나마다 거미줄이 한 겹 끊어지고, 틀린 막대는 거미줄을 한 겹 늘려요.</p>
      <button class="tool-button" type="button" id="peek-button">📖 사냥 기록장 펴기</button>
      <button class="primary-button" type="button" id="cut-button">✂️ 거미줄 끊기</button>
      <p class="feedback-note" id="graph-feedback"></p>
    `;
    document.getElementById("peek-button").onclick = () => this.togglePeek();
    document.getElementById("cut-button").onclick = () => this.submitGraph();
  }

  togglePeek() {
    this.peeking = !this.peeking;
    const cover = document.getElementById("peek-cover");
    const peekButton = document.getElementById("peek-button");
    const cutButton = document.getElementById("cut-button");
    if (cover) cover.classList.toggle("hidden", !this.peeking);
    if (peekButton) peekButton.textContent = this.peeking ? "✏️ 기록장 덮고 그래프 그리기" : "📖 사냥 기록장 펴기";
    if (cutButton) cutButton.disabled = this.peeking;
    sound.playSelect();
  }

  setBar(col, cellIndex) {
    if (this.phase !== "graph" || this.locked[col] || this.peeking) return;
    const target = cellIndex + 1;
    this.values[col] = this.values[col] === target ? cellIndex : target;
    sound.playMove();
    this.paintCol(col);
  }

  paintCol(col) {
    const colEl = document.getElementById(`gcol-${col}`);
    if (!colEl) return;
    colEl.querySelectorAll(".gcell").forEach((cell) => {
      cell.classList.toggle("filled", Number(cell.dataset.cell) < this.values[col]);
    });
    const val = document.getElementById(`gval-${col}`);
    if (val) val.textContent = this.values[col];
  }

  renderStrands() {
    const list = document.getElementById("strand-list");
    if (!list) return;
    list.innerHTML = Array.from({ length: this.strands }, () => '<span class="strand"></span>').join("");
    const count = document.getElementById("strand-count");
    if (count) count.textContent = this.strands;
  }

  cutStrands(n) {
    this.strands = Math.max(0, this.strands - n);
    const remaining = [...document.querySelectorAll("#strand-list .strand:not(.cut)")];
    remaining.slice(-n).forEach((el) => el.classList.add("cut"));
    const count = document.getElementById("strand-count");
    if (count) count.textContent = this.strands;
  }

  addStrands(n) {
    this.strands = Math.min(this.strands + n, this.level.rooms.length + 10);
    this.renderStrands();
  }

  setFeedback(text, kind) {
    const note = document.getElementById("graph-feedback");
    if (!note) return;
    note.textContent = text;
    note.classList.remove("good", "bad");
    if (kind) note.classList.add(kind);
  }

  submitGraph() {
    if (this.phase !== "graph" || this.peeking) return;
    let cut = 0;
    const wrongCols = [];
    this.level.rooms.forEach((_, index) => {
      if (this.locked[index]) return;
      if (this.values[index] === this.counts[index]) {
        this.locked[index] = true;
        cut += 1;
        const colEl = document.getElementById(`gcol-${index}`);
        if (colEl) colEl.classList.add("locked");
      } else {
        wrongCols.push(index);
      }
    });
    if (cut > 0) {
      this.addScore(cut * 10);
      this.cutStrands(cut);
      sound.playSuccess();
    }
    if (wrongCols.length > 0) {
      this.addStrands(wrongCols.length);
      sound.playFailure();
      wrongCols.forEach((index) => {
        const colEl = document.getElementById(`gcol-${index}`);
        if (!colEl) return;
        colEl.classList.remove("wrong");
        void colEl.offsetWidth;
        colEl.classList.add("wrong");
      });
      this.setFeedback(`막대 ${cut}개 잠금! 흔들리는 막대 ${wrongCols.length}개는 틀렸어요. 거미줄 +${wrongCols.length}겹!`, "bad");
    } else if (cut > 0) {
      this.setFeedback(`막대 ${cut}개가 정확해요! 거미줄 ${cut}겹을 끊었습니다.`, "good");
    }
    if (this.locked.every(Boolean)) {
      if (this.strands <= 0) {
        this.winLevel();
        return;
      }
      this.enterQuestions();
    }
  }

  enterQuestions() {
    this.phase = "question";
    this.renderQuestion("그래프 완성! 이제 남은 거미줄은 그래프를 읽어서 끊어요.", "good");
  }

  numberOptions(answer) {
    const set = new Set([answer]);
    while (set.size < 3) {
      const candidate = answer + Math.floor(Math.random() * 5) - 2;
      if (candidate >= 0 && candidate !== answer) set.add(candidate);
    }
    return [...set].map(String).sort(() => Math.random() - 0.5);
  }

  buildQuestion() {
    const rooms = this.level.rooms;
    const counts = this.counts;
    const total = counts.reduce((a, b) => a + b, 0);
    const maxV = Math.max(...counts);
    const minV = Math.min(...counts);
    const types = [];
    if (total > 0 && counts.filter((v) => v === maxV).length === 1) types.push("max");
    if (counts.filter((v) => v === minV).length === 1) types.push("min");
    const pairs = [];
    for (let i = 0; i < counts.length; i += 1) {
      for (let j = 0; j < counts.length; j += 1) {
        if (counts[i] > counts[j]) pairs.push([i, j]);
      }
    }
    if (pairs.length) types.push("diff");
    types.push("total");
    let pick = types[Math.floor(Math.random() * types.length)];
    if (types.length > 1 && pick === this.lastQuestionType) {
      pick = types[(types.indexOf(pick) + 1) % types.length];
    }
    this.lastQuestionType = pick;
    if (pick === "max") {
      return { text: "막대가 가장 높은 곳, 즉 거미를 가장 많이 잡은 곳은?", options: [...rooms], answer: rooms[counts.indexOf(maxV)] };
    }
    if (pick === "min") {
      return { text: "거미를 가장 적게 잡은 곳은 어디인가요?", options: [...rooms], answer: rooms[counts.indexOf(minV)] };
    }
    if (pick === "diff") {
      const [i, j] = pairs[Math.floor(Math.random() * pairs.length)];
      const answer = counts[i] - counts[j];
      return { text: `${rooms[i]}에서는 ${rooms[j]}보다 거미를 몇 마리 더 잡았나요?`, options: this.numberOptions(answer), answer: String(answer), numeric: true };
    }
    return { text: "잡은 거미는 모두 몇 마리인가요?", options: this.numberOptions(total), answer: String(total), numeric: true };
  }

  renderQuestion(note, kind) {
    const question = this.buildQuestion();
    this.currentQuestion = question;
    this.controls.innerHTML = `
      <h3 class="panel-title">그래프를 읽고 구출!</h3>
      <p class="panel-copy">남은 거미줄 ${this.strands}겹. 내가 만든 그래프를 보고 답하세요. 틀리면 시간이 6초 줄어요!</p>
      <div class="question-box">
        <p><strong>Q.</strong> ${question.text}</p>
        <div class="option-row">
          ${question.options.map((option) => `<button class="tool-button" type="button" data-opt="${option}">${option}${question.numeric ? "마리" : ""}</button>`).join("")}
        </div>
      </div>
      <p class="feedback-note" id="graph-feedback"></p>
    `;
    this.controls.querySelectorAll("[data-opt]").forEach((button) => {
      button.onclick = () => this.answerQuestion(button.dataset.opt);
    });
    if (note) this.setFeedback(note, kind);
  }

  answerQuestion(option) {
    if (this.phase !== "question") return;
    if (option === this.currentQuestion.answer) {
      this.addScore(15);
      this.cutStrands(1);
      sound.playSuccess();
      if (this.strands <= 0) {
        this.winLevel();
        return;
      }
      this.renderQuestion("정답! 거미줄이 한 겹 끊어졌어요.", "good");
      return;
    }
    this.graphLeft = Math.max(0, this.graphLeft - 6);
    this.updateGraphTimer();
    sound.playFailure();
    if (this.graphLeft <= 0) {
      this.timeUp();
      return;
    }
    this.renderQuestion("앗, 그래프를 다시 읽어 보세요. 시간 -6초!", "bad");
  }

  updateGraphTimer() {
    const timer = document.getElementById("graph-timer");
    if (!timer) return;
    timer.textContent = Math.max(0, this.graphLeft);
    timer.closest(".timer-badge").classList.toggle("low", this.graphLeft <= 10);
  }

  winLevel() {
    this.phase = "done";
    this.clearTimers();
    const bonus = Math.max(0, this.graphLeft);
    this.addScore(bonus);
    this.nextLevel(`거미줄을 모두 끊고 막대선생을 구출했어요! 남은 시간 ${bonus}초만큼 보너스 점수를 받았습니다.`);
  }

  timeUp() {
    if (this.phase === "done" || this.phase === "fail") return;
    this.phase = "fail";
    this.clearTimers();
    this.fail("시간이 다 되어 거미줄이 막대선생을 다시 감았어요. 사냥부터 다시 도전해요!");
  }
}

class DeliveryGraphGame extends BaseGame {
  constructor(info) {
    super(info);
    const pickBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    this.levels = [
      {
        title: "첫 출근",
        story: "주문서 그래프와 똑같아지도록 인형을 배송하세요. 컨베이어 끝까지 간 인형은 떨어져 부서져요!",
        makeTargets: () => [pickBetween(3, 5), pickBetween(3, 5), pickBetween(3, 5)],
        max: 6,
        unit: 1,
        showTargetValues: true,
        travelMs: 9000,
        gapMs: 2200,
        spares: 3,
        goldens: 0
      },
      {
        title: "눈금을 읽어라",
        story: "이번 주문서에는 숫자가 없어요! 막대 끝이 닿은 눈금을 읽어서 몇 개인지 알아내야 해요.",
        makeTargets: () => [pickBetween(4, 8), pickBetween(4, 8), pickBetween(4, 8)],
        max: 8,
        unit: 1,
        showTargetValues: false,
        travelMs: 7500,
        gapMs: 1900,
        spares: 3,
        goldens: 0
      },
      {
        title: "황금 인형 러시",
        story: "눈금 한 칸이 2개예요! 그리고 황금 인형 ⭐은 한 번에 2개로 배송됩니다. 2개 이상 필요한 곳에만 보낼 수 있어요.",
        makeTargets: () => [0, 0, 0].map(() => [6, 8, 10][Math.floor(Math.random() * 3)]),
        max: 10,
        unit: 2,
        showTargetValues: false,
        travelMs: 6800,
        gapMs: 1500,
        spares: 3,
        goldens: 4
      }
    ];
    this.dests = [
      { name: "가게", icon: "🏪" },
      { name: "집", icon: "🏠" },
      { name: "해외", icon: "✈️" }
    ];
    this.colors = ["#d95f4f", "#3f75c9", "#257a5c"];
  }

  initLevel() {
    this.clearTimers();
    this.phase = "brief";
    this.level = this.levels[this.levelIndex];
    this.targets = this.level.makeTargets();
    this.updateMetrics();
    this.renderBriefing();
  }

  renderBriefing() {
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title}</h3>
          <span class="scene-badge">인형 배송 센터</span>
        </div>
        <div class="hunt-brief">
          <p class="panel-copy"><strong>임무:</strong> ${this.level.story}</p>
          <p class="panel-copy"><strong>규칙 1:</strong> 컨베이어 맨 앞 인형이 배송돼요. 버튼이나 숫자키 1·2·3으로 목적지를 고르세요.</p>
          <p class="panel-copy"><strong>규칙 2:</strong> 주문량보다 많이 보내면 손님 불만 ❗이 쌓여요. 불만이 3번이면 실패!</p>
          <p class="panel-copy"><strong>규칙 3:</strong> 인형을 너무 많이 떨어뜨리면 주문을 채울 수 없게 돼요. 여분은 딱 ${this.level.spares}개!</p>
        </div>
      </div>
    `;
    this.controls.innerHTML = `
      <h3 class="panel-title">출근 준비</h3>
      <p class="panel-copy">주문서 그래프를 읽고, 각 목적지에 몇 개를 보내야 하는지 머릿속으로 정해 두세요.</p>
    `;
    const start = document.createElement("button");
    start.className = "primary-button";
    start.type = "button";
    start.textContent = "배송 시작!";
    start.onclick = () => this.startRun();
    this.controls.append(start);
  }

  startRun() {
    this.phase = "run";
    this.counts = this.dests.map(() => 0);
    this.complaints = 0;
    this.broken = 0;
    this.belt = [];
    const need = this.targets.reduce((a, b) => a + b, 0);
    const plan = [];
    for (let k = 0; k < this.level.goldens; k += 1) plan.push(2);
    const normals = need - this.level.goldens * 2 + this.level.spares;
    for (let k = 0; k < normals; k += 1) plan.push(1);
    for (let i = plan.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [plan[i], plan[j]] = [plan[j], plan[i]];
    }
    this.dollPlan = plan;
    this.renderRunScene();
    this.renderRunControls();
    if (this.keyHandler) window.removeEventListener("keydown", this.keyHandler);
    this.keyHandler = (event) => {
      const index = ["1", "2", "3"].indexOf(event.key);
      if (index === -1) return;
      event.preventDefault();
      this.sendFront(index);
    };
    window.addEventListener("keydown", this.keyHandler);
    this.every(() => this.spawnDoll(), this.level.gapMs);
    this.spawnDoll();
  }

  gridChartHtml(values, { showValues, idPrefix }) {
    const { max, unit } = this.level;
    const rows = max / unit;
    const axis = [];
    for (let v = max; v >= 0; v -= unit) axis.push(v);
    return `
      <div class="dchart">
        <div class="dchart-axis">${axis.map((v) => `<span>${v}</span>`).join("")}</div>
        <div class="dchart-bars" style="--rows:${rows}">
          ${this.dests.map((dest, i) => `
            <div class="dchart-col" id="${idPrefix}-col-${i}">
              <div class="dchart-bar" id="${idPrefix}-bar-${i}" style="height:${(values[i] / max) * 100}%; --bar-color:${this.colors[i]}">
                ${showValues ? `<span class="dchart-val" id="${idPrefix}-val-${i}">${values[i]}</span>` : ""}
              </div>
              <span class="dchart-name">${dest.icon} ${dest.name}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  renderRunScene() {
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title} · 배송 중</h3>
          <span class="scene-badge">남은 인형 <b id="hud-left">${this.dollPlan.length}</b></span>
        </div>
        <div class="belt-lane" id="belt-lane"></div>
        <div class="order-row">
          <div class="order-panel">
            <h4>📋 주문서${this.level.showTargetValues ? "" : " <small>(숫자가 없어요! 눈금을 읽으세요)</small>"}</h4>
            ${this.gridChartHtml(this.targets, { showValues: this.level.showTargetValues, idPrefix: "order" })}
          </div>
          <div class="order-panel">
            <h4>🚚 내 배송 현황</h4>
            ${this.gridChartHtml(this.counts, { showValues: true, idPrefix: "mine" })}
          </div>
        </div>
      </div>
    `;
  }

  renderRunControls() {
    this.controls.innerHTML = `
      <h3 class="panel-title">배송 보내기</h3>
      <p class="panel-copy">노란 테두리가 맨 앞 인형이에요. 주문서와 내 그래프를 비교해서 아직 모자란 곳으로 보내세요!</p>
      <div class="dest-buttons">
        ${this.dests.map((dest, i) => `
          <button class="dest-button" type="button" id="dest-${i}">
            <span class="dest-icon">${dest.icon}</span>
            <span class="dest-name">${dest.name}</span>
            <span class="dest-key">${i + 1}</span>
          </button>
        `).join("")}
      </div>
      <p class="complaint-line">손님 불만 <span id="complaint-meter">○ ○ ○</span></p>
      <p class="panel-copy">부서진 인형 <b id="hud-broken">0</b>개</p>
      <p class="feedback-note" id="delivery-feedback"></p>
    `;
    this.dests.forEach((_, i) => {
      document.getElementById(`dest-${i}`).onclick = () => this.sendFront(i);
    });
  }

  setFeedback(text, kind) {
    const note = document.getElementById("delivery-feedback");
    if (!note) return;
    note.textContent = text;
    note.classList.remove("good", "bad");
    if (kind) note.classList.add(kind);
  }

  spawnDoll() {
    if (this.phase !== "run" || !this.dollPlan.length) return;
    const lane = document.getElementById("belt-lane");
    if (!lane) return;
    const worth = this.dollPlan.shift();
    const el = document.createElement("div");
    el.className = `belt-doll${worth === 2 ? " golden" : ""}`;
    el.innerHTML = worth === 2 ? "🧸<i>⭐2개</i>" : "🧸";
    el.style.transition = `left ${this.level.travelMs}ms linear`;
    lane.append(el);
    void el.offsetWidth;
    el.style.left = "calc(100% - 64px)";
    const doll = { el, worth };
    doll.timeoutId = this.delay(() => this.dropDoll(doll), this.level.travelMs);
    this.belt.push(doll);
    this.updateFront();
    this.updateHud();
  }

  dropDoll(doll) {
    if (this.phase !== "run") return;
    const index = this.belt.indexOf(doll);
    if (index === -1) return;
    this.belt.splice(index, 1);
    doll.el.classList.add("dropped");
    this.delay(() => doll.el.remove(), 600);
    this.broken += 1;
    this.addScore(-Math.min(5, this.score));
    sound.playFailure();
    this.setFeedback("앗! 인형이 끝까지 가서 떨어졌어요. 💔", "bad");
    this.updateFront();
    this.updateHud();
    this.checkState();
  }

  sendFront(destIndex) {
    if (this.phase !== "run") return;
    const doll = this.belt[0];
    if (!doll) {
      this.setFeedback("아직 벨트에 보낼 인형이 없어요!", "bad");
      return;
    }
    const dest = this.dests[destIndex];
    const need = this.targets[destIndex] - this.counts[destIndex];
    if (need <= 0) {
      this.complain(`${dest.name}${dest.name === "집" ? "으" : ""}로는 이미 주문량만큼 보냈어요! 그래프를 다시 비교하세요.`);
      return;
    }
    if (doll.worth === 2 && need < 2) {
      this.complain("황금 인형은 한 번에 2개! 2개 이상 모자란 곳에만 보낼 수 있어요.");
      return;
    }
    clearTimeout(doll.timeoutId);
    this.belt.shift();
    doll.el.classList.add("shipped");
    this.delay(() => doll.el.remove(), 450);
    this.counts[destIndex] += doll.worth;
    this.addScore(6 * doll.worth);
    sound.playMove();
    this.refreshMyChart();
    this.updateFront();
    this.updateHud();
    if (this.counts[destIndex] === this.targets[destIndex]) {
      sound.playSuccess();
      this.setFeedback(`${dest.name} 주문 완료! ✅`, "good");
    } else {
      this.setFeedback(`${dest.name}에 ${doll.worth}개 배송!`, "good");
    }
    this.checkState();
  }

  complain(message) {
    this.complaints += 1;
    sound.playFailure();
    this.updateHud();
    this.setFeedback(message, "bad");
    if (this.complaints >= 3) {
      this.failLevel("손님 불만이 3번 쌓여서 배송 센터가 문을 닫았어요. 그래프를 잘 비교하며 다시 도전!");
    }
  }

  refreshMyChart() {
    this.dests.forEach((_, i) => {
      const bar = document.getElementById(`mine-bar-${i}`);
      if (bar) bar.style.height = `${(this.counts[i] / this.level.max) * 100}%`;
      const val = document.getElementById(`mine-val-${i}`);
      if (val) val.textContent = this.counts[i];
      const col = document.getElementById(`mine-col-${i}`);
      if (col) col.classList.toggle("done", this.counts[i] === this.targets[i]);
      const button = document.getElementById(`dest-${i}`);
      if (button) button.classList.toggle("done", this.counts[i] === this.targets[i]);
    });
  }

  updateFront() {
    this.belt.forEach((doll, index) => doll.el.classList.toggle("front", index === 0));
  }

  updateHud() {
    const left = document.getElementById("hud-left");
    if (left) left.textContent = this.dollPlan.length + this.belt.length;
    const broken = document.getElementById("hud-broken");
    if (broken) broken.textContent = this.broken;
    const meter = document.getElementById("complaint-meter");
    if (meter) meter.textContent = `${"❗ ".repeat(this.complaints)}${"○ ".repeat(Math.max(0, 3 - this.complaints))}`.trim();
  }

  checkState() {
    if (this.phase !== "run") return;
    const needs = this.targets.map((t, i) => t - this.counts[i]);
    const needed = needs.reduce((a, b) => a + b, 0);
    if (needed === 0) {
      this.winLevel();
      return;
    }
    const remaining = [...this.dollPlan, ...this.belt.map((d) => d.worth)];
    const worthLeft = remaining.reduce((a, b) => a + b, 0);
    if (worthLeft < needed) {
      this.failLevel("인형이 너무 많이 부서져서 주문을 다 채울 수 없어요. 다음엔 떨어지기 전에 보내요!");
      return;
    }
    const onlyGoldens = remaining.length > 0 && remaining.every((w) => w === 2);
    if (onlyGoldens && Math.max(...needs) < 2) {
      this.failLevel("남은 건 황금 인형뿐인데 2개가 필요한 곳이 없어요. 황금 인형을 아껴 쓰세요!");
    }
  }

  winLevel() {
    this.phase = "done";
    this.clearTimers();
    const perfect = this.complaints === 0 && this.broken === 0;
    const bonus = perfect ? 25 : 10;
    this.addScore(bonus);
    this.nextLevel(
      perfect
        ? `주문서 그래프와 배송 그래프가 완벽하게 같아요! 불만도 파손도 없는 만점 배송으로 보너스 +${bonus}점!`
        : `모든 주문을 채웠어요! (불만 ${this.complaints}번, 파손 ${this.broken}개) 마무리 보너스 +${bonus}점.`
    );
  }

  failLevel(message) {
    if (this.phase !== "run") return;
    this.phase = "fail";
    this.clearTimers();
    this.fail(message);
  }
}

class CatchGraphGame extends BaseGame {
  constructor(info) {
    super(info);
    const pickBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    this.types = [
      { name: "벌레", emoji: "🐛", color: "#e2a72c" },
      { name: "생쥐", emoji: "🐭", color: "#d95f4f" },
      { name: "메뚜기", emoji: "🦗", color: "#3f75c9" }
    ];
    this.levels = [
      {
        title: "교실 소등",
        story: "불이 꺼진 교실! 손전등 불빛으로 숨은 녀석들을 찾아 클릭으로 잡으세요.",
        makeSpawns: () => this.types.map(() => pickBetween(3, 5)),
        huntSec: 22,
        moveEveryMs: 2600,
        lightR: 130,
        candidates: 3,
        showValues: true,
        bats: 0,
        pickSec: 35
      },
      {
        title: "창고 수색",
        story: "창고는 더 어둡고 녀석들은 더 빨라요. 불빛도 작아졌어요!",
        makeSpawns: () => this.types.map(() => pickBetween(4, 6)),
        huntSec: 22,
        moveEveryMs: 2000,
        lightR: 105,
        candidates: 4,
        showValues: true,
        bats: 0,
        pickSec: 35
      },
      {
        title: "지하실 대소동",
        story: "지하실에는 박쥐 🦇가 살아요. 박쥐를 치면 깜짝 놀라 모두 흩어집니다! 그리고 마지막 그래프 후보에는 숫자가 없어요.",
        makeSpawns: () => this.types.map(() => pickBetween(4, 7)),
        huntSec: 22,
        moveEveryMs: 1500,
        lightR: 90,
        candidates: 4,
        showValues: false,
        bats: 2,
        pickSec: 40
      }
    ];
  }

  initLevel() {
    this.clearTimers();
    this.phase = "brief";
    this.level = this.levels[this.levelIndex];
    this.spawns = this.level.makeSpawns();
    this.updateMetrics();
    this.renderBriefing();
  }

  renderBriefing() {
    const total = this.spawns.reduce((a, b) => a + b, 0);
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title}</h3>
          <span class="scene-badge">야간 포획 작전</span>
        </div>
        <div class="hunt-brief">
          <p class="panel-copy"><strong>임무:</strong> ${this.level.story}</p>
          <p class="panel-copy"><strong>1. 사냥 (${this.level.huntSec}초):</strong> 어둠 속에 ${this.types.map((t) => t.emoji).join(" ")} ${total}마리가 숨어 있고, 계속 자리를 옮겨 다녀요. 마우스로 손전등을 비추며 찾아서 클릭!</p>
          <p class="panel-copy"><strong>2. 정리 (${this.level.pickSec}초):</strong> 포획 주머니에 뒤죽박죽 담긴 녀석들을 종류별로 세고, 똑같은 막대그래프를 고르세요. 못 잡고 도망간 녀석은 세지 않아요!</p>
          <p class="panel-copy"><strong>주의:</strong> 틀린 그래프를 고르면 점수 -10에 시간이 8초 줄어요. 시간이 다 되면 사냥부터 다시!</p>
        </div>
      </div>
    `;
    this.controls.innerHTML = `
      <h3 class="panel-title">작전 준비</h3>
      <p class="panel-copy">잡으면서 종류별로 몇 마리인지 세어 두면 그래프 고르기가 빨라져요.</p>
    `;
    const start = document.createElement("button");
    start.className = "primary-button";
    start.type = "button";
    start.textContent = "손전등 켜기!";
    start.onclick = () => this.startHunt();
    this.controls.append(start);
  }

  randPos() {
    return [5 + Math.random() * 82, 8 + Math.random() * 72];
  }

  startHunt() {
    this.phase = "hunt";
    this.counts = this.types.map(() => 0);
    this.pile = [];
    this.batHits = 0;
    this.huntLeft = this.level.huntSec;
    this.critters = [];
    this.renderHuntScene();
    const zone = document.getElementById("night-zone");
    this.spawns.forEach((count, typeIndex) => {
      for (let k = 0; k < count; k += 1) this.addCritter(zone, typeIndex, false);
    });
    for (let k = 0; k < this.level.bats; k += 1) this.addCritter(zone, -1, true);
    this.every(() => {
      this.huntLeft -= 1;
      this.updateHuntHud();
      if (this.huntLeft <= 0) this.endHunt();
    }, 1000);
    this.every(() => this.scatter(0.55), this.level.moveEveryMs);
  }

  addCritter(zone, typeIndex, isBat) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = `night-critter${isBat ? " bat" : ""}`;
    el.textContent = isBat ? "🦇" : this.types[typeIndex].emoji;
    const [left, top] = this.randPos();
    el.style.left = `${left}%`;
    el.style.top = `${top}%`;
    const critter = { el, typeIndex, isBat, caught: false };
    el.onclick = () => this.tryCatch(critter);
    zone.append(el);
    this.critters.push(critter);
  }

  scatter(probability) {
    if (this.phase !== "hunt") return;
    this.critters.forEach((critter) => {
      if (critter.caught) return;
      if (critter.isBat || Math.random() < probability) {
        const [left, top] = this.randPos();
        critter.el.style.left = `${left}%`;
        critter.el.style.top = `${top}%`;
      }
    });
  }

  inLight(critter) {
    if (!this.lastLight) return false;
    const zone = document.getElementById("night-zone");
    if (!zone) return false;
    const zoneRect = zone.getBoundingClientRect();
    const rect = critter.el.getBoundingClientRect();
    const cx = rect.left - zoneRect.left + rect.width / 2;
    const cy = rect.top - zoneRect.top + rect.height / 2;
    const dx = cx - this.lastLight.x;
    const dy = cy - this.lastLight.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.level.lightR + 14;
  }

  tryCatch(critter) {
    if (this.phase !== "hunt" || critter.caught) return;
    if (!this.inLight(critter)) {
      const [left, top] = this.randPos();
      critter.el.style.left = `${left}%`;
      critter.el.style.top = `${top}%`;
      return;
    }
    if (critter.isBat) {
      this.batHits += 1;
      this.addScore(-Math.min(8, this.score));
      sound.playFailure();
      const zone = document.getElementById("night-zone");
      if (zone) {
        zone.classList.remove("flash");
        void zone.offsetWidth;
        zone.classList.add("flash");
      }
      this.scatter(1);
      this.updateHuntHud();
      return;
    }
    critter.caught = true;
    critter.el.classList.add("zapped");
    this.delay(() => critter.el.remove(), 280);
    this.counts[critter.typeIndex] += 1;
    this.pile.push(critter.typeIndex);
    this.addScore(4);
    sound.playSelect();
    this.updateHuntHud();
    if (this.critters.every((c) => c.caught || c.isBat)) {
      this.delay(() => this.endHunt(), 400);
    }
  }

  renderHuntScene() {
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title} · 야간 사냥</h3>
          <span class="scene-badge timer-badge">⏱ <b id="hunt-timer">${this.huntLeft}</b>초</span>
        </div>
        <div class="night-zone" id="night-zone" style="--light-r:${this.level.lightR}px">
          <div class="night-dark"></div>
        </div>
      </div>
    `;
    const zone = document.getElementById("night-zone");
    this.lastLight = null;
    const moveLight = (clientX, clientY) => {
      const rect = zone.getBoundingClientRect();
      this.lastLight = { x: clientX - rect.left, y: clientY - rect.top };
      zone.style.setProperty("--lx", `${this.lastLight.x}px`);
      zone.style.setProperty("--ly", `${this.lastLight.y}px`);
    };
    zone.addEventListener("mousemove", (event) => moveLight(event.clientX, event.clientY));
    zone.addEventListener("touchmove", (event) => {
      const touch = event.touches[0];
      if (touch) moveLight(touch.clientX, touch.clientY);
    }, { passive: true });
    zone.addEventListener("touchstart", (event) => {
      const touch = event.touches[0];
      if (touch) moveLight(touch.clientX, touch.clientY);
    }, { passive: true });
    this.controls.innerHTML = `
      <h3 class="panel-title">사냥 현황</h3>
      <p class="panel-copy">손전등 불빛 안에서만 보여요. 구석구석 비추면서 찾아 클릭하세요!</p>
      <div class="hunt-stats">
        <p>잡은 수 <b id="hunt-caught">0</b></p>
        ${this.level.bats ? '<p>🦇 박쥐 실수 <b id="hunt-bat">0</b></p>' : ""}
      </div>
      <p class="panel-copy">종류별로 몇 마리 잡았는지 세면서 잡으면 다음 단계가 쉬워져요.</p>
    `;
  }

  updateHuntHud() {
    const timer = document.getElementById("hunt-timer");
    if (timer) {
      timer.textContent = Math.max(0, this.huntLeft);
      timer.closest(".timer-badge").classList.toggle("low", this.huntLeft <= 5);
    }
    const caught = document.getElementById("hunt-caught");
    if (caught) caught.textContent = this.pile.length;
    const bat = document.getElementById("hunt-bat");
    if (bat) bat.textContent = this.batHits;
  }

  endHunt() {
    if (this.phase !== "hunt") return;
    this.phase = "pick";
    this.clearTimers();
    this.escaped = this.critters.filter((c) => !c.caught && !c.isBat).length;
    this.startPickPhase();
  }

  makeCandidates() {
    const truth = [...this.counts];
    const list = [truth];
    const seen = new Set([truth.join(",")]);
    let guard = 0;
    while (list.length < this.level.candidates && guard < 300) {
      guard += 1;
      const variant = [...truth];
      if (Math.random() < 0.5) {
        const i = Math.floor(Math.random() * 3);
        const j = (i + 1 + Math.floor(Math.random() * 2)) % 3;
        [variant[i], variant[j]] = [variant[j], variant[i]];
      } else {
        const i = Math.floor(Math.random() * 3);
        variant[i] = Math.max(0, variant[i] + (Math.random() < 0.5 ? 1 : -1));
      }
      const key = variant.join(",");
      if (!seen.has(key)) {
        seen.add(key);
        list.push(variant);
      }
    }
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  startPickPhase() {
    this.pickLeft = this.level.pickSec;
    this.candidateList = this.makeCandidates();
    const shuffledPile = [...this.pile];
    for (let i = shuffledPile.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPile[i], shuffledPile[j]] = [shuffledPile[j], shuffledPile[i]];
    }
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title} · 포획물 정리</h3>
          <span class="scene-badge timer-badge">⏱ <b id="pick-timer">${this.pickLeft}</b>초</span>
        </div>
        <p class="panel-copy">주머니 속 포획물을 종류별로 세어 보세요.${this.escaped > 0 ? ` 도망간 ${this.escaped}마리는 세지 않아요!` : " 한 마리도 놓치지 않았어요!"}</p>
        <div class="catch-pouch">
          ${shuffledPile.length
            ? shuffledPile.map((typeIndex) => `<span>${this.types[typeIndex].emoji}</span>`).join("")
            : '<span class="rescued-note">주머니가 비었어요... 그래도 0마리 그래프를 찾을 수 있죠?</span>'}
        </div>
        <div class="pouch-legend">
          ${this.types.map((type) => `<span>${type.emoji} ${type.name}</span>`).join("")}
        </div>
      </div>
    `;
    this.renderCandidates();
    this.every(() => {
      this.pickLeft -= 1;
      this.updatePickTimer();
      if (this.pickLeft <= 0) this.timeUp();
    }, 1000);
  }

  renderCandidates() {
    this.controls.innerHTML = `
      <h3 class="panel-title">같은 그래프를 찾아라!</h3>
      <p class="panel-copy">${this.level.showValues
        ? "센 수와 똑같은 막대그래프를 고르세요. 비슷한 가짜가 섞여 있어요!"
        : "이번엔 숫자가 없어요! 눈금 칸을 세어 막대 높이를 읽으세요."}</p>
      <div class="option-grid" id="option-grid">
        ${this.candidateList.map((values, index) => `
          <button class="chart-option" type="button" data-index="${index}">
            <strong>후보 ${index + 1}</strong>
            <div class="mini-bars tall${this.level.showValues ? "" : " ruled"}" style="--bar-count:3">
              ${values.map((value, typeIndex) => `<span style="height:${Math.max(3, value * 11)}px; background:${this.types[typeIndex].color}"></span>`).join("")}
            </div>
            <span>${this.types.map((type, typeIndex) => this.level.showValues ? `${type.name} ${values[typeIndex]}` : type.name).join(" · ")}</span>
          </button>
        `).join("")}
      </div>
      <p class="feedback-note" id="pick-feedback"></p>
    `;
    this.controls.querySelectorAll(".chart-option").forEach((button) => {
      button.onclick = () => this.chooseOption(button);
    });
  }

  chooseOption(button) {
    if (this.phase !== "pick" || button.disabled) return;
    const values = this.candidateList[Number(button.dataset.index)];
    if (arraysEqual(values, this.counts)) {
      this.winLevel();
      return;
    }
    button.disabled = true;
    button.classList.add("wrong-option");
    this.addScore(-Math.min(10, this.score));
    this.pickLeft = Math.max(0, this.pickLeft - 8);
    this.updatePickTimer();
    sound.playFailure();
    const note = document.getElementById("pick-feedback");
    if (note) {
      note.textContent = "그 그래프는 포획 기록과 달라요! 점수 -10, 시간 -8초.";
      note.className = "feedback-note bad";
    }
    if (this.pickLeft <= 0) this.timeUp();
  }

  updatePickTimer() {
    const timer = document.getElementById("pick-timer");
    if (!timer) return;
    timer.textContent = Math.max(0, this.pickLeft);
    timer.closest(".timer-badge").classList.toggle("low", this.pickLeft <= 10);
  }

  winLevel() {
    this.phase = "done";
    this.clearTimers();
    const bonus = Math.max(0, this.pickLeft);
    this.addScore(30 + bonus);
    sound.playSuccess();
    this.nextLevel(`정확하게 세고 똑같은 그래프를 찾았어요! 기본 +30점에 남은 시간 보너스 +${bonus}점.`);
  }

  timeUp() {
    if (this.phase !== "pick") return;
    this.phase = "fail";
    this.clearTimers();
    this.fail("시간이 다 되어 포획물이 전부 도망갔어요. 사냥부터 다시 도전!");
  }
}

class StairGraphGame extends BaseGame {
  constructor(info) {
    super(info);
    this.foods = ["꿀떡", "송편", "인절미", "절편", "백설기", "가래떡"];
    this.colors = ["#7057b8", "#d95f4f", "#257a5c", "#e2a72c", "#3f75c9", "#8a620d"];
    this.levels = [
      {
        title: "언덕길 추격전",
        story: "떡 인기 투표 그래프를 보고, 표를 적게 받은 떡 상자부터 차례로 쌓으세요.",
        count: 4,
        repr: "labeled",
        range: [3, 10],
        tigerSec: 50,
        penalty: 8
      },
      {
        title: "절벽 오르기",
        story: "이번 그래프에는 숫자가 없어요! 눈금을 세어 막대 높이를 비교해야 합니다.",
        count: 5,
        repr: "bars",
        range: [3, 10],
        tigerSec: 55,
        penalty: 8
      },
      {
        title: "하늘 동아줄",
        story: "마지막은 그림 기록이에요. 떡 🍡 개수를 직접 세어 어느 떡이 적은지 알아내세요!",
        count: 6,
        repr: "picto",
        range: [3, 12],
        tigerSec: 60,
        penalty: 10
      }
    ];
  }

  initLevel() {
    this.clearTimers();
    this.phase = "brief";
    this.level = this.levels[this.levelIndex];
    const pool = [];
    for (let v = this.level.range[0]; v <= this.level.range[1]; v += 1) pool.push(v);
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this.values = pool.slice(0, this.level.count);
    const foods = [...this.foods];
    for (let i = foods.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [foods[i], foods[j]] = [foods[j], foods[i]];
    }
    this.cats = foods.slice(0, this.level.count);
    this.updateMetrics();
    this.renderBriefing();
  }

  renderBriefing() {
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title}</h3>
          <span class="scene-badge">호랑이 추격전</span>
        </div>
        <div class="hunt-brief">
          <p class="panel-copy"><strong>이야기:</strong> "떡 하나 주면 안 잡아먹지!" 호랑이 🐯가 쫓아와요! 떡 상자를 계단처럼 쌓아 하늘 동아줄 🪢까지 올라가야 해요.</p>
          <p class="panel-copy"><strong>임무:</strong> ${this.level.story}</p>
          <p class="panel-copy"><strong>규칙:</strong> 계단은 <strong>표를 적게 받은 떡부터</strong> 쌓아야 해요. 너무 높은 상자를 먼저 놓으면 다리가 닿지 않아 무너지고, 호랑이가 ${this.level.penalty}초만큼 가까워져요!</p>
          <p class="panel-copy"><strong>실패:</strong> 호랑이가 계단 아래까지 오면 잡혀요. 상자를 다 쌓으면 동아줄을 타고 탈출!</p>
        </div>
      </div>
    `;
    this.controls.innerHTML = `
      <h3 class="panel-title">탈출 준비</h3>
      <p class="panel-copy">투표 기록을 먼저 읽고, 어떤 순서로 쌓을지 머릿속으로 정한 뒤 시작하세요.</p>
    `;
    const start = document.createElement("button");
    start.className = "primary-button";
    start.type = "button";
    start.textContent = "도망 시작!";
    start.onclick = () => this.startClimb();
    this.controls.append(start);
  }

  startClimb() {
    this.phase = "climb";
    this.placed = [];
    this.tigerLeft = this.level.tigerSec;
    this.renderClimbScene();
    this.renderClimbControls();
    this.every(() => {
      this.tigerLeft -= 1;
      this.updateTiger();
      if (this.tigerLeft <= 0) this.caught();
    }, 1000);
  }

  votePanelHtml() {
    const { repr } = this.level;
    if (repr === "picto") {
      return `
        <h4>🗳️ 떡 인기 투표 (그림 기록)</h4>
        ${this.cats.map((cat, i) => {
          const chunks = [];
          for (let k = 0; k < this.values[i]; k += 5) {
            chunks.push("🍡".repeat(Math.min(5, this.values[i] - k)));
          }
          return `<p class="picto-row"><strong>${cat}</strong><span>${chunks.join(" ")}</span></p>`;
        }).join("")}
      `;
    }
    const maxV = Math.max(...this.values);
    const showValues = repr === "labeled";
    return `
      <h4>🗳️ 떡 인기 투표${showValues ? "" : " <small>(눈금을 세어 보세요!)</small>"}</h4>
      <div class="sgraph" style="--rows:${maxV}">
        ${this.cats.map((cat, i) => `
          <div class="sg-col">
            <div class="sg-bar" style="height:${this.values[i] * 12}px; background:${this.colors[i % this.colors.length]}">
              ${showValues ? `<span class="sg-val">${this.values[i]}</span>` : ""}
            </div>
            <span class="sg-name">${cat}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  renderClimbScene() {
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title} · 계단 쌓기</h3>
          <span class="scene-badge timer-badge">🐯 도착까지 <b id="tiger-dist">${this.tigerLeft}</b>초</span>
        </div>
        <div class="escape-row">
          <div class="escape-yard">
            <div class="sky-rope">☁️<br>🪢</div>
            <div class="stair-stack2" id="stair-stack"></div>
            <span class="climber" id="climber">🧒</span>
          </div>
          <div class="vote-panel">${this.votePanelHtml()}</div>
        </div>
        <div class="tiger-track">
          <span class="tiger" id="tiger">🐯</span>
          <span class="track-goal">🧺</span>
        </div>
      </div>
    `;
    this.repaintStack();
    this.updateTiger();
  }

  renderClimbControls() {
    this.controls.innerHTML = `
      <h3 class="panel-title">떡 상자 고르기</h3>
      <p class="panel-copy">남은 상자 중 <strong>표가 가장 적은 떡</strong>을 골라 다음 계단으로 놓으세요.</p>
      <div class="pick-row" id="pick-row">
        ${this.cats.map((cat, i) => `
          <button class="tool-button" type="button" id="box-${i}">📦 ${cat}</button>
        `).join("")}
      </div>
      <p class="feedback-note" id="stair-feedback"></p>
    `;
    this.cats.forEach((_, i) => {
      document.getElementById(`box-${i}`).onclick = () => this.pick(i);
    });
  }

  repaintStack() {
    const stack = document.getElementById("stair-stack");
    if (!stack) return;
    stack.innerHTML = this.placed.map((catIndex) => `
      <div class="sblock" style="height:${this.values[catIndex] * 14 + 24}px; background:${this.colors[catIndex % this.colors.length]}">
        ${this.cats[catIndex]}<br>${this.values[catIndex]}표
      </div>
    `).join("");
    const climber = document.getElementById("climber");
    if (!climber) return;
    const blocks = stack.querySelectorAll(".sblock");
    if (!blocks.length) {
      climber.style.left = "12px";
      climber.style.bottom = "10px";
      return;
    }
    const last = blocks[blocks.length - 1];
    const yardRect = stack.parentElement.getBoundingClientRect();
    const rect = last.getBoundingClientRect();
    climber.style.left = `${rect.left - yardRect.left + rect.width / 2 - 14}px`;
    climber.style.bottom = `${rect.height + 6}px`;
  }

  setFeedback(text, kind) {
    const note = document.getElementById("stair-feedback");
    if (!note) return;
    note.textContent = text;
    note.className = `feedback-note${kind ? ` ${kind}` : ""}`;
  }

  pick(catIndex) {
    if (this.phase !== "climb" || this.placed.includes(catIndex)) return;
    const remaining = this.cats.map((_, i) => i).filter((i) => !this.placed.includes(i));
    const minIndex = remaining.reduce((a, b) => (this.values[a] <= this.values[b] ? a : b));
    const button = document.getElementById(`box-${catIndex}`);
    if (catIndex !== minIndex) {
      this.tigerLeft = Math.max(0, this.tigerLeft - this.level.penalty);
      this.addScore(-Math.min(5, this.score));
      sound.playFailure();
      this.updateTiger();
      if (button) {
        button.classList.remove("shake-button");
        void button.offsetWidth;
        button.classList.add("shake-button");
      }
      this.setFeedback(`${this.cats[catIndex]} 상자는 지금 놓기엔 너무 높아요! 무너지는 바람에 호랑이가 ${this.level.penalty}초 가까워졌어요. 🐯`, "bad");
      if (this.tigerLeft <= 0) this.caught();
      return;
    }
    this.placed.push(catIndex);
    this.addScore(10);
    sound.playMove();
    if (button) {
      button.disabled = true;
      button.textContent = `✅ ${this.cats[catIndex]}`;
    }
    this.repaintStack();
    if (this.placed.length === this.cats.length) {
      this.escape();
      return;
    }
    this.setFeedback(`좋아요! ${this.cats[catIndex]} ${this.values[catIndex]}표 상자를 쌓고 한 칸 올라갔어요.`, "good");
  }

  escape() {
    this.phase = "done";
    this.clearTimers();
    sound.playSuccess();
    this.setFeedback("계단 완성! 동아줄로 점프!", "good");
    const climber = document.getElementById("climber");
    if (climber) climber.classList.add("escaped");
    const bonus = Math.max(0, this.tigerLeft);
    this.delay(() => {
      this.addScore(bonus);
      this.nextLevel(`떡 상자 계단을 정확한 순서로 쌓고 동아줄로 탈출했어요! 남은 ${bonus}초만큼 보너스 점수!`);
    }, 900);
  }

  updateTiger() {
    const dist = document.getElementById("tiger-dist");
    if (dist) {
      dist.textContent = Math.max(0, this.tigerLeft);
      dist.closest(".timer-badge").classList.toggle("low", this.tigerLeft <= 15);
    }
    const tiger = document.getElementById("tiger");
    if (tiger) {
      const percent = (1 - this.tigerLeft / this.level.tigerSec) * 88;
      tiger.style.left = `${percent}%`;
    }
  }

  caught() {
    if (this.phase !== "climb") return;
    this.phase = "fail";
    this.clearTimers();
    this.fail("호랑이가 계단 아래까지 와서 잡히고 말았어요! 투표 수를 빠르게 비교해서 다시 도전해요.");
  }
}

class RocketGraphGame extends BaseGame {
  constructor(info) {
    super(info);
    this.fuelNames = ["오렌지", "딸기", "수박", "복숭아"];
    this.colors = ["#e2a72c", "#d95f4f", "#257a5c", "#7057b8"];
    this.levels = [
      {
        title: "관제 훈련",
        story: "단서 카드가 알려주는 순서대로 계산하면 돼요.",
        catCount: 3,
        max: 10,
        relations: ["plus", "minus", "equal"],
        countSec: 60,
        shuffleClues: false,
        showSum: false
      },
      {
        title: "야간 발사",
        story: "단서 카드가 뒤섞여 있어요! '정확히 몇 칸'이라고 알려주는 카드부터 찾아 시작하세요. 2배·절반 단서도 나옵니다.",
        catCount: 4,
        max: 12,
        relations: ["plus", "minus", "equal", "double", "half"],
        countSec: 60,
        shuffleClues: true,
        showSum: true
      },
      {
        title: "화성 임무",
        story: "연료가 더 많이 필요해요. '두 탱크를 더한 만큼' 같은 어려운 단서도 나오니 침착하게 추리하세요!",
        catCount: 4,
        max: 16,
        relations: ["plus", "minus", "equal", "double", "half", "sum"],
        countSec: 55,
        shuffleClues: true,
        showSum: true
      }
    ];
  }

  makePuzzle() {
    const { catCount, max, relations } = this.level;
    this.cats = this.fuelNames.slice(0, catCount);
    this.target = this.cats.map(() => 2 + Math.floor(Math.random() * (max - 3)));
    const order = this.cats.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const defined = [order[0]];
    const clues = [{ cat: order[0], text: `${this.cats[order[0]]} 탱크: 정확히 ${this.target[order[0]]}칸` }];
    for (let k = 1; k < order.length; k += 1) {
      const i = order[k];
      const value = this.target[i];
      const specials = [];
      defined.forEach((ref) => {
        if (relations.includes("double") && value === this.target[ref] * 2) {
          specials.push(`${this.cats[i]} 탱크: ${this.cats[ref]} 탱크의 2배`);
        }
        if (relations.includes("half") && value * 2 === this.target[ref]) {
          specials.push(`${this.cats[i]} 탱크: ${this.cats[ref]} 탱크의 절반`);
        }
      });
      if (relations.includes("sum") && defined.length >= 2) {
        for (let a = 0; a < defined.length; a += 1) {
          for (let b = a + 1; b < defined.length; b += 1) {
            if (this.target[defined[a]] + this.target[defined[b]] === value) {
              const first = this.cats[defined[a]];
              const hasJong = (first.charCodeAt(first.length - 1) - 44032) % 28 > 0;
              specials.push(`${this.cats[i]} 탱크: ${first}${hasJong ? "과" : "와"} ${this.cats[defined[b]]} 탱크를 더한 만큼`);
            }
          }
        }
      }
      let text;
      if (specials.length) {
        text = specials[Math.floor(Math.random() * specials.length)];
      } else {
        const ref = defined[Math.floor(Math.random() * defined.length)];
        const diff = value - this.target[ref];
        if (diff === 0) text = `${this.cats[i]} 탱크: ${this.cats[ref]} 탱크와 같은 높이`;
        else if (diff > 0) text = `${this.cats[i]} 탱크: ${this.cats[ref]} 탱크보다 ${diff}칸 더 높게`;
        else text = `${this.cats[i]} 탱크: ${this.cats[ref]} 탱크보다 ${-diff}칸 더 낮게`;
      }
      clues.push({ cat: i, text });
      defined.push(i);
    }
    if (this.level.shuffleClues) {
      for (let i = clues.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [clues[i], clues[j]] = [clues[j], clues[i]];
      }
    }
    this.clues = clues;
  }

  initLevel() {
    this.clearTimers();
    if (this.keyHandler) {
      window.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
    }
    this.phase = "brief";
    this.level = this.levels[this.levelIndex];
    this.makePuzzle();
    this.updateMetrics();
    this.renderBriefing();
  }

  renderBriefing() {
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title}</h3>
          <span class="scene-badge">로켓 발사 관제센터</span>
        </div>
        <div class="hunt-brief">
          <p class="panel-copy"><strong>임무:</strong> 연료 탱크 ${this.cats.length}개의 높이를 맞춰야 로켓이 우주까지 날아가요. 그런데 필요한 양은 표가 아니라 <strong>단서 카드</strong>에 숨어 있어요!</p>
          <p class="panel-copy"><strong>힌트:</strong> ${this.level.story}</p>
          <p class="panel-copy"><strong>카운트다운 ${this.level.countSec}초:</strong> T-0이 되면 로켓은 무조건 발사돼요! 틀린 탱크의 엔진은 점화되지 않아 높이 못 올라갑니다. 전부 맞고 일찍 발사할수록 보너스!</p>
          <p class="panel-copy"><strong>조작:</strong> 그래프 칸 클릭 또는 방향키(←→ 탱크 선택, ↑↓ 높이), Enter = 발사.</p>
        </div>
      </div>
    `;
    this.controls.innerHTML = `
      <h3 class="panel-title">발사 준비</h3>
      <p class="panel-copy">단서 카드는 한 번 푼 것을 눌러 표시해 두면 헷갈리지 않아요.</p>
    `;
    const start = document.createElement("button");
    start.className = "primary-button";
    start.type = "button";
    start.textContent = "카운트다운 시작!";
    start.onclick = () => this.startControl();
    this.controls.append(start);
  }

  startControl() {
    this.phase = "control";
    this.values = this.cats.map(() => 0);
    this.selectedIndex = 0;
    this.countLeft = this.level.countSec;
    this.renderControlScene();
    this.renderControlPanel();
    if (this.keyHandler) window.removeEventListener("keydown", this.keyHandler);
    this.keyHandler = (event) => {
      if (this.phase !== "control") return;
      const actions = {
        ArrowLeft: () => this.selectTank(-1),
        ArrowRight: () => this.selectTank(1),
        ArrowUp: () => this.adjustTank(1),
        ArrowDown: () => this.adjustTank(-1),
        Enter: () => this.launch(false)
      };
      const action = actions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    };
    window.addEventListener("keydown", this.keyHandler);
    this.every(() => {
      this.countLeft -= 1;
      this.updateCountdown();
      if (this.countLeft <= 3 && this.countLeft > 0) sound.playSelect();
      if (this.countLeft <= 0) this.launch(true);
    }, 1000);
  }

  renderControlScene() {
    const { max } = this.level;
    const compact = max >= 12;
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title} · 연료 주입</h3>
          <span class="scene-badge timer-badge">🚀 T-<b id="rocket-count">${this.countLeft}</b></span>
        </div>
        <div class="launch-yard">
          <span class="alt-band" style="bottom:88%">🌌 우주</span>
          <span class="alt-band" style="bottom:64%">🌙 하늘 끝</span>
          <span class="alt-band" style="bottom:40%">☁️ 구름</span>
          <span class="alt-band" style="bottom:18%">🏠 지붕 위</span>
          <span class="rocket2" id="rocket2">🚀</span>
        </div>
        <div class="gchart${compact ? " compact" : ""}" style="--cols:${this.cats.length}">
          <div class="gcol axis">
            <span class="gval">&nbsp;</span>
            <div class="gcells">
              ${Array.from({ length: max }, (_, i) => `<span class="gaxis-num">${i + 1}</span>`).join("")}
            </div>
            <span class="gname">(칸)</span>
          </div>
          ${this.cats.map((name, index) => `
            <div class="gcol${index === this.selectedIndex ? " sel" : ""}" id="rcol-${index}" style="--bar-color:${this.colors[index % this.colors.length]}">
              <span class="gval" id="rval-${index}">0</span>
              <div class="gcells">
                ${Array.from({ length: max }, (_, cell) => `<button type="button" class="gcell" data-col="${index}" data-cell="${cell}"></button>`).join("")}
              </div>
              <span class="gname">${name}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    this.scene.querySelectorAll(".gcell").forEach((cell) => {
      cell.onclick = () => {
        const col = Number(cell.dataset.col);
        this.selectedIndex = col;
        this.paintSelection();
        const targetVal = Number(cell.dataset.cell) + 1;
        this.values[col] = this.values[col] === targetVal ? targetVal - 1 : targetVal;
        sound.playMove();
        this.paintCol(col);
      };
    });
  }

  renderControlPanel() {
    this.controls.innerHTML = `
      <h3 class="panel-title">🛰 연료 단서 카드</h3>
      <div class="clue-list">
        ${this.clues.map((clue, index) => `
          <button class="clue-card" type="button" id="clue-${index}">${clue.text}</button>
        `).join("")}
      </div>
      ${this.level.showSum
        ? `<p class="panel-copy sum-hint">🧮 관제 팁: 탱크를 모두 더하면 ${this.target.reduce((a, b) => a + b, 0)}칸이 되어야 해요.</p>`
        : ""}
      <button class="primary-button" type="button" id="launch-button">🚀 지금 발사!</button>
      <p class="feedback-note" id="rocket-feedback"></p>
    `;
    this.clues.forEach((_, index) => {
      const card = document.getElementById(`clue-${index}`);
      card.onclick = () => card.classList.toggle("done");
    });
    document.getElementById("launch-button").onclick = () => this.launch(false);
  }

  selectTank(direction) {
    this.selectedIndex = (this.selectedIndex + direction + this.cats.length) % this.cats.length;
    sound.playSelect();
    this.paintSelection();
  }

  adjustTank(direction) {
    this.values[this.selectedIndex] = clamp(this.values[this.selectedIndex] + direction, 0, this.level.max);
    sound.playMove();
    this.paintCol(this.selectedIndex);
  }

  paintSelection() {
    this.cats.forEach((_, index) => {
      const col = document.getElementById(`rcol-${index}`);
      if (col) col.classList.toggle("sel", index === this.selectedIndex);
    });
  }

  paintCol(col) {
    const colEl = document.getElementById(`rcol-${col}`);
    if (!colEl) return;
    colEl.querySelectorAll(".gcell").forEach((cell) => {
      cell.classList.toggle("filled", Number(cell.dataset.cell) < this.values[col]);
    });
    const val = document.getElementById(`rval-${col}`);
    if (val) val.textContent = this.values[col];
  }

  updateCountdown() {
    const count = document.getElementById("rocket-count");
    if (!count) return;
    count.textContent = Math.max(0, this.countLeft);
    count.closest(".timer-badge").classList.toggle("low", this.countLeft <= 10);
  }

  launch(auto) {
    if (this.phase !== "control") return;
    this.phase = "launch";
    this.clearTimers();
    const correctCount = this.cats.filter((_, i) => this.values[i] === this.target[i]).length;
    const total = this.cats.length;
    this.cats.forEach((_, i) => {
      const col = document.getElementById(`rcol-${i}`);
      if (col) col.classList.add(this.values[i] === this.target[i] ? "eng-ok" : "eng-fail");
    });
    const ratio = correctCount / total;
    const rocket = document.getElementById("rocket2");
    if (rocket) {
      rocket.classList.add("flying");
      rocket.style.bottom = `${8 + ratio * 84}%`;
    }
    if (correctCount === total) {
      const bonus = auto ? 0 : Math.max(0, this.countLeft);
      this.addScore(total * 12 + bonus);
      sound.playWin();
      this.delay(() => {
        this.nextLevel(`모든 엔진 점화! 로켓이 우주 🌌까지 날아갔어요!${bonus > 0 ? ` 빠른 발사 보너스 +${bonus}점!` : ""}`);
      }, 1400);
      return;
    }
    const altitude = ratio >= 0.75 ? "하늘 끝 🌙" : ratio >= 0.5 ? "구름 ☁️" : ratio > 0 ? "지붕 위 🏠" : "발사대";
    this.addScore(correctCount * 6);
    sound.playFailure();
    this.delay(() => {
      this.fail(`엔진이 ${correctCount}/${total}개만 점화되어 ${altitude}까지밖에 못 갔어요. 단서 카드를 다시 추리해서 재발사!`);
    }, 1400);
  }
}

const gameClasses = {
  spider: SpiderGraphGame,
  delivery: DeliveryGraphGame,
  catch: CatchGraphGame,
  stairs: StairGraphGame,
  rocket: RocketGraphGame
};

function openDesignModal() {
  if (!activeGameInfo) return;
  activeSheetMode = "readable";
  activeSheets = activeGameInfo.sheets;
  activeSheetIndex = 0;
  elements.designTitle.textContent = activeGameInfo.title;
  // PDF 열기 / 원본 보기 비활성화: 읽기용 이미지만 사용
  // elements.pdfLink.href = "source/20260611075405.pdf";
  // updateSheetModeButtons();
  updateSheetImage();
  elements.designModal.classList.remove("hidden");
}

function updateSheetImage() {
  activeSheets = activeSheetMode === "original" ? activeGameInfo.originalSheets : activeGameInfo.sheets;
  const source = activeSheets[activeSheetIndex];
  elements.sheetImage.src = source;
  const modeLabel = activeSheetMode === "original" ? "원본 스캔" : "읽기용 회전본";
  elements.sheetImage.alt = `${activeGameInfo.title} ${modeLabel} ${activeSheetIndex + 1}쪽`;
  elements.sheetCaption.textContent = `${modeLabel} ${activeSheetIndex + 1} / ${activeSheets.length}`;
  elements.sheetPrev.disabled = activeSheetIndex === 0;
  elements.sheetNext.disabled = activeSheetIndex === activeSheets.length - 1;
}

// PDF 열기 / 원본 보기 비활성화: 읽기용 이미지만 사용
// function updateSheetModeButtons() {
//   elements.sheetReadable.classList.toggle("active", activeSheetMode === "readable");
//   elements.sheetOriginal.classList.toggle("active", activeSheetMode === "original");
//   elements.sheetReadable.setAttribute("aria-pressed", String(activeSheetMode === "readable"));
//   elements.sheetOriginal.setAttribute("aria-pressed", String(activeSheetMode === "original"));
// }

elements.backButton.onclick = backToDashboard;
elements.designButton.onclick = openDesignModal;
elements.closeDesignButton.onclick = () => elements.designModal.classList.add("hidden");
// elements.sheetReadable.onclick = () => {
//   activeSheetMode = "readable";
//   updateSheetModeButtons();
//   updateSheetImage();
// };
// elements.sheetOriginal.onclick = () => {
//   activeSheetMode = "original";
//   updateSheetModeButtons();
//   updateSheetImage();
// };
elements.sheetPrev.onclick = () => {
  activeSheetIndex = Math.max(0, activeSheetIndex - 1);
  updateSheetImage();
};
elements.sheetNext.onclick = () => {
  activeSheetIndex = Math.min(activeSheets.length - 1, activeSheetIndex + 1);
  updateSheetImage();
};
elements.soundButton.onclick = () => {
  sound.enabled = !sound.enabled;
  elements.soundButton.textContent = sound.enabled ? "소리 켬" : "소리 끔";
  elements.soundButton.setAttribute("aria-pressed", String(sound.enabled));
  if (sound.enabled) sound.playSelect();
};

renderDashboard();
