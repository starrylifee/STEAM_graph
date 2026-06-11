const readableSheet = (page) => `source_images_review_alt/20260611075405_page_${page}.png`;
const originalSheet = (page) => `source_images/20260611075405_page_${page}.png`;

const gamesData = [
  {
    id: "spider",
    title: "막대선생의 거미잡기",
    student: "백민호, 송서진, 조승재",
    concept: "장소별 자료를 읽고 막대그래프로 나타내기",
    summary: "집에 나타난 거미와 거미줄을 막대그래프로 정리해 막대선생을 구합니다.",
    sheets: [1, 2, 3, 4].map(readableSheet),
    originalSheets: [1, 2, 3, 4].map(originalSheet),
    preview: readableSheet(1),
    color: "#257a5c",
    soft: "#dff4e9",
    ink: "#1f6b50",
    tags: ["자료 읽기", "막대 높이", "비교"]
  },
  {
    id: "delivery",
    title: "도와줘 인형 배송",
    student: "미니언즈 4중사",
    concept: "목적지별 수량을 세어 막대그래프로 비교하기",
    summary: "인형을 가게, 집, 해외로 정확히 배송하고 배송 수를 그래프로 확인합니다.",
    sheets: [5, 6, 7].map(readableSheet),
    originalSheets: [5, 6, 7].map(originalSheet),
    preview: readableSheet(7),
    color: "#d95f4f",
    soft: "#ffe7df",
    ink: "#b7473b",
    tags: ["분류", "수 세기", "배송"]
  },
  {
    id: "catch",
    title: "벌레와 생쥐를 잡아라",
    student: "바 선생",
    concept: "잡은 대상의 수를 세고 맞는 막대그래프 고르기",
    summary: "손전등과 슬리퍼로 숨어 있는 대상들을 잡은 뒤, 알맞은 그래프를 선택합니다.",
    sheets: [8, 9, 10].map(readableSheet),
    originalSheets: [8, 9, 10].map(originalSheet),
    preview: readableSheet(10),
    color: "#e2a72c",
    soft: "#fff1c8",
    ink: "#8a620d",
    tags: ["포획", "빈도", "그래프 선택"]
  },
  {
    id: "stairs",
    title: "막대그래프 계단을 쌓아라",
    student: "우당탕즈",
    concept: "막대그래프의 크기를 비교해 순서대로 배열하기",
    summary: "좋아하는 음식 표를 보고 막대를 계단처럼 쌓아 캐릭터가 올라가게 합니다.",
    sheets: [11, 12, 13, 14, 15].map(readableSheet),
    originalSheets: [11, 12, 13, 14, 15].map(originalSheet),
    preview: readableSheet(15),
    color: "#7057b8",
    soft: "#eee8ff",
    ink: "#5b4698",
    tags: ["크기 비교", "순서", "계단"]
  },
  {
    id: "rocket",
    title: "막대그래프 로켓",
    student: "고가고구",
    concept: "표의 수를 막대그래프로 정확히 옮기기",
    summary: "방향키와 버튼으로 그래프 높이를 맞추고 로켓을 발사합니다.",
    sheets: [16, 17, 18, 19].map(readableSheet),
    originalSheets: [16, 17, 18, 19].map(originalSheet),
    preview: readableSheet(19),
    color: "#3f75c9",
    soft: "#e4eeff",
    ink: "#315da0",
    tags: ["표", "정확한 값", "로켓"]
  }
];

const elements = {
  dashboardView: document.getElementById("dashboard-view"),
  gameView: document.getElementById("game-view"),
  gameGrid: document.getElementById("game-grid"),
  backButton: document.getElementById("back-button"),
  letterButton: document.getElementById("letter-button"),
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
  pdfLink: document.getElementById("pdf-link"),
  sheetReadable: document.getElementById("sheet-readable"),
  sheetOriginal: document.getElementById("sheet-original"),
  closeDesignButton: document.getElementById("close-design-button"),
  sheetPrev: document.getElementById("sheet-prev"),
  sheetNext: document.getElementById("sheet-next"),
  sheetImage: document.getElementById("sheet-image"),
  sheetCaption: document.getElementById("sheet-caption"),
  studentLetterModal: document.getElementById("student-letter-modal"),
  closeLetterButton: document.getElementById("close-letter-button"),
  startDebugButton: document.getElementById("start-debug-button")
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
  }

  start() {
    this.score = 0;
    this.levelIndex = 0;
    this.attempts = this.maxAttempts;
    this.initLevel();
  }

  cleanup() {
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
        title: "화장실과 거실의 흔적",
        story: "거미들이 집 안 여기저기에 숨어 있습니다. 장소별로 센 수를 막대 높이로 맞추세요.",
        categories: ["화장실", "거실", "방", "베란다"],
        target: [14, 8, 11, 5],
        max: 16
      },
      {
        title: "거미줄이 많은 곳",
        story: "거미줄이 많이 생긴 곳일수록 막대가 더 높아져야 합니다.",
        categories: ["소파", "문", "창문", "욕조"],
        target: [7, 12, 15, 9],
        max: 16
      },
      {
        title: "막대선생 구출",
        story: "마지막 자료를 정확히 옮기면 거미줄이 약해집니다.",
        categories: ["거미줄", "거미", "먹이", "끈끈이"],
        target: [18, 12, 6, 10],
        max: 20
      }
    ];
  }

  initLevel() {
    this.level = this.levels[this.levelIndex];
    this.values = Array(this.level.categories.length).fill(0);
    this.updateMetrics();
    this.renderScene();
    this.setupControls();
  }

  renderScene() {
    const webLines = Array.from({ length: 8 }, (_, index) => {
      const rotate = index * 22;
      return `<span class="web-line" style="left:64%; top:46%; transform:rotate(${rotate}deg)"></span>`;
    }).join("");
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title}</h3>
          <span class="scene-badge">막대선생 구조 작전</span>
        </div>
        <p class="panel-copy">${this.level.story}</p>
        <div class="spider-room">
          ${webLines}
          <div class="spider">거미줄<br>감옥</div>
        </div>
        ${chartHtml(this.level.categories, this.values, this.level.max)}
      </div>
    `;
  }

  setupControls() {
    this.controls.innerHTML = `
      <h3 class="panel-title">자료표</h3>
      ${makeTable(this.level.categories, this.level.target, "개")}
      <p class="panel-copy">표의 수와 막대 높이가 모두 같아지면 구조 버튼을 누르세요.</p>
    `;
    addSliders(this.controls, this.level.categories, this.values, this.level.max, () => {
      sound.playMove();
      this.renderScene();
    });
    const button = document.createElement("button");
    button.className = "primary-button";
    button.type = "button";
    button.textContent = "거미줄 끊기";
    button.onclick = () => this.check();
    this.controls.append(button);
  }

  check() {
    if (arraysEqual(this.values, this.level.target)) {
      this.addScore(30);
      this.nextLevel("자료를 정확히 막대그래프로 옮겼어요. 막대선생이 한 걸음 더 자유로워졌습니다.");
      return;
    }
    this.fail("표와 막대그래프의 수가 다른 곳이 있어요. 막대 위 숫자를 다시 비교해 보세요.");
  }
}

class DeliveryGraphGame extends BaseGame {
  constructor(info) {
    super(info);
    this.levels = [
      {
        title: "첫 배송",
        categories: ["가게", "집", "해외"],
        target: [4, 5, 7],
        max: 8
      },
      {
        title: "많아진 주문",
        categories: ["가게", "집", "해외"],
        target: [7, 6, 9],
        max: 10
      },
      {
        title: "마지막 분류",
        categories: ["가게", "집", "해외"],
        target: [8, 11, 6],
        max: 12
      }
    ];
  }

  initLevel() {
    this.level = this.levels[this.levelIndex];
    this.counts = Array(this.level.categories.length).fill(0);
    this.remaining = this.level.target.reduce((sum, value) => sum + value, 0);
    this.updateMetrics();
    this.renderScene();
    this.setupControls();
  }

  renderScene() {
    const dolls = Array.from({ length: Math.min(this.remaining, 24) }, (_, index) => (
      `<span class="doll">${index + 1}</span>`
    )).join("");
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title}</h3>
          <span class="scene-badge">남은 인형 ${this.remaining}</span>
        </div>
        <p class="panel-copy">각 목적지로 인형을 보내면 아래 막대그래프가 배송 수만큼 자랍니다.</p>
        <div class="destination-grid">
          ${this.level.categories.map((category, index) => `
            <div class="destination">
              <strong>${category}</strong>
              <span class="delivery-count">${this.counts[index]}</span>
            </div>
          `).join("")}
        </div>
        <div class="doll-tray">${dolls || "<span class=\"rescued-note\">모든 인형을 보냈어요</span>"}</div>
        ${chartHtml(this.level.categories, this.counts, this.level.max, { colors: ["#d95f4f", "#3f75c9", "#257a5c"] })}
      </div>
    `;
  }

  setupControls() {
    this.controls.innerHTML = `
      <h3 class="panel-title">배송 목표</h3>
      ${makeTable(this.level.categories, this.level.target, "개")}
      <p class="panel-copy">목표 수와 같게 인형을 보내고 배송 완료를 누르세요.</p>
      <div class="button-list"></div>
    `;
    const list = this.controls.querySelector(".button-list");
    this.level.categories.forEach((category, index) => {
      const button = document.createElement("button");
      button.className = "tool-button";
      button.type = "button";
      button.textContent = `${category}로 보내기`;
      button.onclick = () => this.deliver(index);
      list.append(button);
    });
    const reset = document.createElement("button");
    reset.className = "tool-button ghost";
    reset.type = "button";
    reset.textContent = "배송 다시 담기";
    reset.onclick = () => this.initLevel();
    this.controls.append(reset);

    const check = document.createElement("button");
    check.className = "primary-button";
    check.type = "button";
    check.textContent = "배송 완료";
    check.onclick = () => this.check();
    this.controls.append(check);
  }

  deliver(index) {
    if (this.remaining <= 0) return;
    this.counts[index] += 1;
    this.remaining -= 1;
    sound.playMove();
    this.renderScene();
  }

  check() {
    if (this.remaining === 0 && arraysEqual(this.counts, this.level.target)) {
      this.addScore(28);
      this.nextLevel("목적지별 배송 수가 표와 같아요. 막대그래프도 정확하게 완성됐습니다.");
      return;
    }
    this.fail("목표보다 많이 보내거나 적게 보낸 곳이 있어요. 목적지별 수를 다시 맞춰 보세요.");
  }
}

class CatchGraphGame extends BaseGame {
  constructor(info) {
    super(info);
    this.levels = [
      {
        title: "교실 구석 수색",
        categories: ["벌레", "생쥐", "메뚜기"],
        target: [4, 3, 5],
        max: 6
      },
      {
        title: "창고 수색",
        categories: ["벌레", "생쥐", "메뚜기"],
        target: [5, 6, 2],
        max: 6
      },
      {
        title: "마지막 포획",
        categories: ["벌레", "생쥐", "메뚜기"],
        target: [3, 5, 6],
        max: 6
      }
    ];
    this.positions = [
      [8, 12], [30, 16], [54, 10], [74, 18], [16, 42], [42, 44],
      [66, 42], [82, 56], [9, 72], [34, 76], [58, 74], [78, 80],
      [21, 27], [49, 62], [70, 30], [6, 52], [88, 36]
    ];
  }

  initLevel() {
    this.level = this.levels[this.levelIndex];
    this.items = this.level.categories.flatMap((category, index) => (
      Array.from({ length: this.level.target[index] }, () => category)
    ));
    this.caught = Array(this.items.length).fill(false);
    this.counts = Array(this.level.categories.length).fill(0);
    this.updateMetrics();
    this.renderScene();
    this.setupControls();
  }

  renderScene() {
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title}</h3>
          <span class="scene-badge">잡은 수 ${this.counts.reduce((a, b) => a + b, 0)}/${this.items.length}</span>
        </div>
        <p class="panel-copy">숨어 있는 대상을 모두 누른 뒤, 잡은 수와 같은 막대그래프를 고르세요.</p>
        <div class="critters">
          ${this.items.map((name, index) => {
            const [left, top] = this.positions[index % this.positions.length];
            const caughtClass = this.caught[index] ? " caught" : "";
            return `<button class="critter${caughtClass}" data-index="${index}" style="left:${left}%; top:${top}%">${name}</button>`;
          }).join("")}
        </div>
        ${chartHtml(this.level.categories, this.counts, this.level.max, { colors: ["#e2a72c", "#d95f4f", "#3f75c9"] })}
      </div>
    `;
    this.scene.querySelectorAll(".critter").forEach((button) => {
      button.onclick = () => this.catchItem(Number(button.dataset.index));
    });
  }

  setupControls() {
    this.controls.innerHTML = `
      <h3 class="panel-title">포획 기록</h3>
      ${makeTable(this.level.categories, this.counts, "마리")}
      <p class="panel-copy">모두 잡으면 그래프 후보가 나타납니다.</p>
    `;
    if (this.caught.every(Boolean)) this.showOptions();
  }

  catchItem(index) {
    if (this.caught[index]) return;
    this.caught[index] = true;
    const categoryIndex = this.level.categories.indexOf(this.items[index]);
    this.counts[categoryIndex] += 1;
    sound.playSelect();
    this.renderScene();
    this.setupControls();
  }

  showOptions() {
    const rawVariants = [
      this.level.target,
      [this.level.target[1], this.level.target[0], this.level.target[2]],
      this.level.target.map((value, index) => clamp(value + (index === 1 ? -1 : 1), 0, this.level.max))
    ];
    const offset = this.levelIndex % rawVariants.length;
    const variants = rawVariants.map((_, index) => rawVariants[(index + offset) % rawVariants.length]);
    const optionGrid = document.createElement("div");
    optionGrid.className = "option-grid";
    variants.forEach((values, index) => {
      const button = document.createElement("button");
      button.className = "chart-option";
      button.type = "button";
      button.innerHTML = `
        <strong>후보 ${index + 1}</strong>
        <div class="mini-bars" style="--bar-count:${values.length}">
          ${values.map((value) => `<span style="height:${Math.max(6, value * 7)}px"></span>`).join("")}
        </div>
        <span>${values.map((value, valueIndex) => `${this.level.categories[valueIndex]} ${value}`).join(" · ")}</span>
      `;
      button.onclick = () => this.chooseOption(values);
      optionGrid.append(button);
    });
    this.controls.append(optionGrid);
  }

  chooseOption(values) {
    if (arraysEqual(values, this.level.target)) {
      this.addScore(32);
      this.nextLevel("잡은 수를 정확히 세고 같은 막대그래프를 골랐어요.");
      return;
    }
    this.fail("잡은 수와 후보 그래프의 막대 높이가 달라요. 표를 다시 세어 보세요.");
  }
}

class StairGraphGame extends BaseGame {
  constructor(info) {
    super(info);
    this.levels = [
      {
        title: "음식 인기 계단",
        categories: ["초밥", "오렌지", "딸기", "수박"],
        target: [10, 5, 8, 7],
        max: 10
      },
      {
        title: "좋아하는 간식",
        categories: ["젤리", "과자", "케이크", "우유"],
        target: [6, 14, 9, 4],
        max: 14
      },
      {
        title: "마지막 계단",
        categories: ["복숭아", "오렌지", "딸기", "수박"],
        target: [15, 11, 8, 18],
        max: 18
      }
    ];
  }

  initLevel() {
    this.level = this.levels[this.levelIndex];
    this.order = this.level.target
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value)
      .map((item) => item.index);
    this.selected = [];
    this.updateMetrics();
    this.renderScene();
    this.setupControls();
  }

  renderScene() {
    const blocks = this.selected.map((index) => {
      const height = 46 + (this.level.target[index] / this.level.max) * 170;
      return `
        <div class="step-block" style="height:${height}px">
          ${this.level.categories[index]}<br>${this.level.target[index]}
        </div>
      `;
    }).join("");
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title}</h3>
          <span class="scene-badge">낮은 막대부터</span>
        </div>
        ${makeTable(this.level.categories, this.level.target, "표")}
        <div class="stair-yard">
          <div class="stair-stack">${blocks || "<span class=\"rescued-note\">첫 계단을 고르세요</span>"}</div>
        </div>
        ${chartHtml(this.level.categories, this.level.target, this.level.max, { colors: ["#257a5c", "#e2a72c", "#d95f4f", "#3f75c9"] })}
      </div>
    `;
  }

  setupControls() {
    this.controls.innerHTML = `
      <h3 class="panel-title">계단 재료</h3>
      <p class="panel-copy">막대그래프에서 가장 낮은 값부터 차례로 고르세요.</p>
      <div class="pick-row"></div>
    `;
    const row = this.controls.querySelector(".pick-row");
    this.level.categories.forEach((category, index) => {
      if (this.selected.includes(index)) return;
      const button = document.createElement("button");
      button.className = "tool-button";
      button.type = "button";
      button.textContent = `${category} ${this.level.target[index]}`;
      button.onclick = () => this.pick(index);
      row.append(button);
    });
  }

  pick(index) {
    const expected = this.order[this.selected.length];
    if (index !== expected) {
      this.fail("계단은 낮은 막대부터 쌓아야 캐릭터가 올라갈 수 있어요.");
      return;
    }
    this.selected.push(index);
    this.addScore(8);
    sound.playMove();
    if (this.selected.length === this.order.length) {
      this.addScore(22);
      this.nextLevel("막대의 크기를 잘 비교해서 튼튼한 계단을 만들었어요.");
      return;
    }
    this.renderScene();
    this.setupControls();
  }
}

class RocketGraphGame extends BaseGame {
  constructor(info) {
    super(info);
    this.levels = [
      {
        title: "표 맞추기 훈련",
        categories: ["오렌지", "딸기", "복숭아", "수박"],
        target: [4, 8, 10, 6],
        max: 12
      },
      {
        title: "연료 그래프",
        categories: ["초밥", "오렌지", "딸기", "수박"],
        target: [10, 5, 8, 7],
        max: 10
      },
      {
        title: "발사 직전",
        categories: ["복숭아", "오렌지", "딸기", "수박"],
        target: [7, 12, 9, 16],
        max: 16
      }
    ];
  }

  initLevel() {
    if (this.keyHandler) {
      window.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
    }
    this.level = this.levels[this.levelIndex];
    this.values = Array(this.level.categories.length).fill(0);
    this.selectedIndex = 0;
    this.updateMetrics();
    this.renderScene();
    this.setupControls();
  }

  renderScene() {
    this.scene.innerHTML = `
      <div class="storybook">
        <div class="scene-title">
          <h3>${this.level.title}</h3>
          <span class="scene-badge">선택: ${this.level.categories[this.selectedIndex]}</span>
        </div>
        ${makeTable(this.level.categories, this.level.target, "")}
        <div class="rocket-yard">
          <div id="rocket" class="rocket">로켓<div class="flame"></div></div>
        </div>
        ${chartHtml(this.level.categories, this.values, this.level.max, {
          colors: ["#3f75c9", "#257a5c", "#d95f4f", "#e2a72c"],
          selectedIndex: this.selectedIndex
        })}
      </div>
    `;
  }

  setupControls() {
    this.controls.innerHTML = `
      <h3 class="panel-title">로켓 조종</h3>
      <p class="panel-copy">막대를 골라 높이를 바꾸고 표와 같아지면 발사하세요.</p>
      <div class="button-list">
        <button class="tool-button" type="button" data-action="prev">이전 막대</button>
        <button class="tool-button" type="button" data-action="up">높이 +1</button>
        <button class="tool-button" type="button" data-action="down">높이 -1</button>
        <button class="tool-button" type="button" data-action="next">다음 막대</button>
      </div>
      <button class="primary-button" type="button" data-action="launch">로켓 발사</button>
    `;
    this.controls.querySelectorAll("[data-action]").forEach((button) => {
      button.onclick = () => this.handleAction(button.dataset.action);
    });
    if (this.keyHandler) window.removeEventListener("keydown", this.keyHandler);
    this.keyHandler = (event) => {
      const actionByKey = {
        ArrowLeft: "prev",
        ArrowRight: "next",
        ArrowUp: "up",
        ArrowDown: "down"
      };
      const action = actionByKey[event.key];
      if (!action) return;
      event.preventDefault();
      this.handleAction(action);
    };
    window.addEventListener("keydown", this.keyHandler);
  }

  handleAction(action) {
    if (action === "prev") {
      this.selectedIndex = (this.selectedIndex - 1 + this.level.categories.length) % this.level.categories.length;
      sound.playSelect();
    }
    if (action === "next") {
      this.selectedIndex = (this.selectedIndex + 1) % this.level.categories.length;
      sound.playSelect();
    }
    if (action === "up") {
      this.values[this.selectedIndex] = clamp(this.values[this.selectedIndex] + 1, 0, this.level.max);
      sound.playMove();
    }
    if (action === "down") {
      this.values[this.selectedIndex] = clamp(this.values[this.selectedIndex] - 1, 0, this.level.max);
      sound.playMove();
    }
    if (action === "launch") {
      this.launch();
      return;
    }
    this.renderScene();
  }

  launch() {
    if (!arraysEqual(this.values, this.level.target)) {
      this.fail("표의 숫자와 막대 높이가 아직 맞지 않아요. 선택된 막대를 조정해 보세요.");
      return;
    }
    const rocket = document.getElementById("rocket");
    rocket?.classList.add("launched");
    this.addScore(34);
    sound.playSuccess();
    this.timer = setTimeout(() => {
      this.nextLevel("표와 막대그래프가 정확히 맞아 로켓이 출발했어요.");
    }, 620);
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
  elements.pdfLink.href = "source/20260611075405.pdf";
  updateSheetModeButtons();
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

function updateSheetModeButtons() {
  elements.sheetReadable.classList.toggle("active", activeSheetMode === "readable");
  elements.sheetOriginal.classList.toggle("active", activeSheetMode === "original");
  elements.sheetReadable.setAttribute("aria-pressed", String(activeSheetMode === "readable"));
  elements.sheetOriginal.setAttribute("aria-pressed", String(activeSheetMode === "original"));
}

function openStudentLetter() {
  elements.studentLetterModal.classList.remove("hidden");
}

function closeStudentLetter() {
  elements.studentLetterModal.classList.add("hidden");
}

elements.backButton.onclick = backToDashboard;
elements.letterButton.onclick = openStudentLetter;
elements.designButton.onclick = openDesignModal;
elements.closeDesignButton.onclick = () => elements.designModal.classList.add("hidden");
elements.closeLetterButton.onclick = closeStudentLetter;
elements.startDebugButton.onclick = closeStudentLetter;
elements.sheetReadable.onclick = () => {
  activeSheetMode = "readable";
  updateSheetModeButtons();
  updateSheetImage();
};
elements.sheetOriginal.onclick = () => {
  activeSheetMode = "original";
  updateSheetModeButtons();
  updateSheetImage();
};
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
setTimeout(openStudentLetter, 250);
