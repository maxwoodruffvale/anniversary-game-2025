// jigsawMinigame.js
// 4x4 jigsaw with snapping (tiles swap on drop). Overlay is transparent gray.
const GRID_SIZE = 4; // 4x4 = 16 tiles
const TILE_SIZE = 100; // px (you can change or compute from image if you want)
let draggedTile = null;

export function handleJigsawMinigame() {
  if (document.getElementById("jigsawOverlay")) return;

  // Overlay (transparent gray)
  const overlay = document.createElement("div");
  overlay.id = "jigsawOverlay";
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

  // Container for puzzle
  const puzzleContainer = document.createElement("div");
  Object.assign(puzzleContainer.style, {
    position: "relative",
    width: `${GRID_SIZE * TILE_SIZE}px`,
    height: `${GRID_SIZE * TILE_SIZE}px`,
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
    gap: "0px",
    boxSizing: "border-box",
    background: "#222",
  });

  overlay.appendChild(puzzleContainer);

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
    zIndex: 10000,
  });
  closeBtn.onclick = () => document.body.removeChild(overlay);
  overlay.appendChild(closeBtn);

  document.body.appendChild(overlay);

  // Build tiles
  setupPuzzle(puzzleContainer);
}

function setupPuzzle(container) {
  // produce array of original coordinates
  const positions = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      positions.push({ row, col });
    }
  }

  // shuffle positions (so pieces start in random slots)
  positions.sort(() => Math.random() - 0.5);

  positions.forEach((pos, index) => {
    // pos is the original piece coordinates (which piece this tile *is*)
    // index is the current slot in the grid (shuffled)
    const tile = document.createElement("div");
    Object.assign(tile.style, {
      width: `${TILE_SIZE}px`,
      height: `${TILE_SIZE}px`,
      backgroundImage: "url('jigsaw.png')",
      // backgroundSize is the whole image as if it were GRID_SIZE * TILE_SIZE
      backgroundSize: `${GRID_SIZE * TILE_SIZE}px ${GRID_SIZE * TILE_SIZE}px`,
      // show the correct sub-rectangle of the image
      backgroundPosition: `-${pos.col * TILE_SIZE}px -${pos.row * TILE_SIZE}px`,
      border: "1px solid #444",
      boxSizing: "border-box",
      cursor: "grab",
      userSelect: "none",
    });

    tile.draggable = true;

    // IMPORTANT: this must record the piece's ORIGINAL (correct) position,
    // i.e. where this piece belongs on a solved board.
    tile.dataset.correct = `${pos.row}-${pos.col}`;

    // Drag handlers
    tile.addEventListener("dragstart", () => {
      draggedTile = tile;
      // slight delay so the drag ghost appears; hide original visually
      setTimeout(() => (tile.style.visibility = "hidden"), 0);
    });

    tile.addEventListener("dragend", () => {
      if (draggedTile) draggedTile.style.visibility = "visible";
      draggedTile = null;
    });

    // Allow drop onto other tiles
    tile.addEventListener("dragover", (e) => e.preventDefault());
    tile.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!draggedTile || draggedTile === tile) return;

      // swap the two tiles in the DOM using a temporary placeholder
      const temp = document.createElement("div");
      // temp must have same display characteristics to avoid layout issues,
      // but we immediately replace it so simple div is fine.
      container.replaceChild(temp, tile);
      container.replaceChild(tile, draggedTile);
      container.replaceChild(draggedTile, temp);

      // After swap, check win condition
      checkWin(container);
    });

    container.appendChild(tile);
  });
}

// Check whether every tile is in its correct grid slot
function checkWin(container) {
  console.log("Checking win condition...");
  const tiles = Array.from(container.children);
  let correctCount = 0;

  tiles.forEach((tile, index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const correctKey = `${row}-${col}`;
    if (tile.dataset.correct === correctKey) {
      correctCount++;
    }
  });
  console.log(`Correct tiles: ${correctCount}/${GRID_SIZE * GRID_SIZE}`);

  // if all tiles are in correct position -> win
  if (correctCount === GRID_SIZE * GRID_SIZE) {
    setTimeout(() => {
      alert("🎉 You win! Your clue is 23");
      const overlay = document.getElementById("jigsawOverlay");
      if (overlay) overlay.remove();
    }, 150);
  }
}