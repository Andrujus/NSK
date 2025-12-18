const board = document.getElementById("board");
const difficultySelect = document.getElementById("difficulty");
const newGameBtn = document.getElementById("newGameBtn");
const resetScoresBtn = document.getElementById("resetScoresBtn");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const pairsLeftEl = document.getElementById("pairsLeft");
const messageEl = document.getElementById("message");
const scoresEl = document.getElementById("scores");
const playerInput = document.getElementById("playerName");

let firstCard = null;
let secondCard = null;
let lock = false;

let moves = 0;
let pairsLeft = 0;

let timer = 0;
let interval = null;

const symbols = [
  "🍎",
  "🍌",
  "🍇",
  "🍓",
  "🍍",
  "🥝",
  "🍉",
  "🍒",
  "🥑",
  "🍋",
  "🥕",
  "🌽",
  "🥔",
  "🍆",
  "🥦",
];

function setMessage(text) {
  messageEl.textContent = text;
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    timeEl.textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
}

function buildCard(symbol) {
  // <button class="mem-card"><div class="mem-inner"><div class="face back">?</div><div class="face front">🍎</div></div></button>
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mem-card";
  btn.dataset.symbol = symbol;
  btn.setAttribute("aria-label", "Kortelė");
  btn.setAttribute("aria-disabled", "false");

  const inner = document.createElement("div");
  inner.className = "mem-inner";

  const back = document.createElement("div");
  back.className = "face back";
  back.textContent = "?";

  const front = document.createElement("div");
  front.className = "face front";
  front.textContent = symbol;

  inner.appendChild(back);
  inner.appendChild(front);
  btn.appendChild(inner);

  btn.addEventListener("click", () => flipCard(btn));
  return btn;
}

function setupGrid(pairs) {
  // 10 porų => 20 kortelių: gražu 5x4
  // 15 porų => 30 kortelių: gražu 6x5
  const cols = pairs === 10 ? 5 : 6;
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

function startGame() {
  stopTimer();
  board.innerHTML = "";

  firstCard = null;
  secondCard = null;
  lock = false;

  moves = 0;
  timer = 0;

  movesEl.textContent = "0";
  timeEl.textContent = "0";

  const pairs = difficultySelect.value === "easy" ? 10 : 15;
  pairsLeft = pairs;
  pairsLeftEl.textContent = String(pairsLeft);

  setMessage("Žaidimas prasidėjo! Atversk dvi korteles.");
  setupGrid(pairs);

  const chosen = symbols.slice(0, pairs);
  const deck = [...chosen, ...chosen].sort(() => Math.random() - 0.5);

  deck.forEach((sym) => board.appendChild(buildCard(sym)));

  startTimer();
}

function flipVisual(card, on) {
  card.classList.toggle("is-flipped", on);
}

function canFlip(card) {
  if (lock) return false;
  if (card.classList.contains("matched")) return false;
  if (card === firstCard) return false;
  return true;
}

function flipCard(card) {
  if (!canFlip(card)) return;

  flipVisual(card, true);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesEl.textContent = String(moves);
  lock = true;

  const a = firstCard.dataset.symbol;
  const b = secondCard.dataset.symbol;

  if (a === b) {
    setTimeout(() => {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      pairsLeft--;
      pairsLeftEl.textContent = String(pairsLeft);

      resetTurn();

      if (pairsLeft === 0) {
        endGame();
      }
    }, 450);
  } else {
    setTimeout(() => {
      flipVisual(firstCard, false);
      flipVisual(secondCard, false);
      resetTurn();
    }, 850);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

function endGame() {
  stopTimer();
  setMessage("🎉 Sveikiname! Suradai visas poras.");
  saveScore();
  renderScores();
}

function saveScore() {
  const name = (playerInput.value || "Anonimas").trim() || "Anonimas";
  const scores = JSON.parse(sessionStorage.getItem("scores") || "[]");
  scores.push({ name, moves, time: timer, when: Date.now() });

  // Rikiuojam: pirmiausia mažiau bandymų, tada mažiau laiko
  scores.sort(
    (x, y) => x.moves - y.moves || x.time - y.time || x.when - y.when
  );

  // Paliekam top 10
  sessionStorage.setItem("scores", JSON.stringify(scores.slice(0, 10)));
}

function renderScores() {
  scoresEl.innerHTML = "";
  const scores = JSON.parse(sessionStorage.getItem("scores") || "[]");

  if (scores.length === 0) {
    const empty = document.createElement("div");
    empty.textContent = "Kol kas nėra rezultatų.";
    scoresEl.appendChild(empty);
    return;
  }

  scores.forEach((s, i) => {
    const div = document.createElement("div");
    div.textContent = `${i + 1}. ${s.name} — ${s.moves} band., ${s.time}s`;
    scoresEl.appendChild(div);
  });
}

function resetScores() {
  sessionStorage.removeItem("scores");
  renderScores();
  setMessage("Rekordai išvalyti (tik šiai sesijai).");
}

newGameBtn.addEventListener("click", startGame);
resetScoresBtn.addEventListener("click", resetScores);

renderScores();
