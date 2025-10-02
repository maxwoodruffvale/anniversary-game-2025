// wordSearchMinigame.js
const GRID = [
  ["C","A","V","E","D","I","V","I","N","G","W","Q"],
  ["M","T","E","V","E","R","E","S","T","O","X","B"],
  ["W","E","N","I","S","C","H","V","A","R","M","Z"],
  ["M","H","N","I","L","G","C","A","R","T","S","G"],
  ["Y","G","M","O","C","H","A","R","X","V","L","T"],
  ["U","B","R","C","O","C","A","I","N","E","B","V"],
  ["G","R","I","C","H","E","R","O","I","N","G","W"],
  ["W","L","A","T","T","E","D","D","Y","O","A","M"],
];

const WORDS = [
  "CAVE DIVING",
  "MT EVEREST",
  "WENIS",
  "ARM",
  "MOCHA",
  "COCAINE",
  "HEROIN",
  "TEDDY",
  "CARTS"
];

let selected = [];
let foundWords = new Set();

export function handleJWordSearchMinigame() {
  if (document.getElementById("wordSearchOverlay")) return;

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "wordSearchOverlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)", // transparent gray
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  });

  // Container
  const container = document.createElement("div");
  Object.assign(container.style, {
    display: "flex",
    gap: "40px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  });

  overlay.appendChild(container);

  // Grid
  const gridEl = document.createElement("div");
  Object.assign(gridEl.style, {
    display: "grid",
    gridTemplateColumns: `repeat(${GRID[0].length}, 40px)`,
    gridTemplateRows: `repeat(${GRID.length}, 40px)`,
    gap: "2px",
  });

  GRID.forEach((row, r) => {
    row.forEach((letter, c) => {
      const cell = document.createElement("div");
      cell.innerText = letter;
      Object.assign(cell.style, {
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #aaa",
        cursor: "pointer",
        fontSize: "20px",
        userSelect: "none",
      });
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener("click", () => handleCellClick(cell));
      gridEl.appendChild(cell);
    });
  });

  container.appendChild(gridEl);

  // Word list
  const wordListEl = document.createElement("ul");
  WORDS.forEach(w => {
    const li = document.createElement("li");
    li.innerText = w;
    li.dataset.word = w;
    Object.assign(li.style, {
      fontSize: "18px",
      marginBottom: "8px",
    });
    wordListEl.appendChild(li);
  });
  container.appendChild(wordListEl);

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Close Puzzle";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "8px 12px",
    fontSize: "1rem",
    cursor: "pointer",
  });
  closeBtn.onclick = () => document.body.removeChild(overlay);
  overlay.appendChild(closeBtn);

  document.body.appendChild(overlay);
}

function handleCellClick(cell) {
  cell.style.background = "#d0f0d0"; // temporary highlight
  selected.push(cell);

  const currentWord = selected.map(c => c.innerText).join("");

  // check if matches any WORDS
  for (const word of WORDS) {
    const plain = word.replace(/\s+/g, ""); // strip spaces
    if (currentWord === plain) {
      markWordFound(word, selected);
      selected = [];
      return;
    }
  }

  // If current selection longer than max word length, reset
  const maxLen = Math.max(...WORDS.map(w => w.replace(/\s+/g, "").length));
  if (currentWord.length > maxLen) {
    resetSelection();
  }
}

function resetSelection() {
  selected.forEach(c => (c.style.background = ""));
  selected = [];
}

function markWordFound(word, cells) {
  // Highlight permanently
  cells.forEach(c => (c.style.background = "#90ee90"));
  // Cross off list
  const li = document.querySelector(`li[data-word="${word}"]`);
  if (li) li.style.textDecoration = "line-through";

  foundWords.add(word);

  if (foundWords.size === WORDS.length) {
    setTimeout(() => {
      alert("🎉 You win! All words found! Your clue is: 20");
      const overlay = document.getElementById("wordSearchOverlay");
      if (overlay) overlay.remove();
    }, 200);
  }
}
