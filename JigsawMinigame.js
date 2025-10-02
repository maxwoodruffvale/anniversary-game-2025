// jigsawMinigame.js
const GRID_SIZE = 4; // 4x4 = 16 tiles
const TILE_SIZE = 100; // pixels (scales with image size)
let draggedTile = null;
let correctPositions = new Map();

export function handleJigsawMinigame() {
  if (document.getElementById("jigsawOverlay")) return;

  // Overlay
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

  // Puzzle container
  const puzzleContainer = document.createElement("div");
  Object.assign(puzzleContainer.style, {
    position: "relative",
    width: `${GRID_SIZE * TILE_SIZE}px`,
    height: `${GRID_SIZE * TILE_SIZE}px`,
    background: "#222",
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
    gap: "2px",
  });

  overlay.appendChild(puzzleContainer);

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Close Puzzle";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "10px 15px",
    fontSize: "1rem",
    cursor: "pointer",
  });
  closeBtn.onclick = () => document.body.removeChild(overlay);
  overlay.appendChild(closeBtn);

  document.body.appendChild(overlay);

  // Setup puzzle tiles
  setupPuzzle(puzzleContainer);
}

function setupPuzzle(container) {
  const positions = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      positions.push({ row, col });
    }
  }

  // Shuffle positions
  positions.sort(() => Math.random() - 0.5);

  positions.forEach((pos, index) => {
    const correctRow = Math.floor(index / GRID_SIZE);
    const correctCol = index % GRID_SIZE;

    const tile = document.createElement("div");
    Object.assign(tile.style, {
      width: `${TILE_SIZE}px`,
      height: `${TILE_SIZE}px`,
      backgroundImage: "url('jigsaw.png')",
      backgroundSize: `${GRID_SIZE * TILE_SIZE}px ${GRID_SIZE * TILE_SIZE}px`,
      backgroundPosition: `-${pos.col * TILE_SIZE}px -${pos.row * TILE_SIZE}px`,
      border: "1px solid #444",
      cursor: "grab",
    });

    tile.draggable = true;
    tile.dataset.correct = `${correctRow}-${correctCol}`;

    // Store correct position map
    correctPositions.set(tile, `${correctRow}-${correctCol}`);

    // Drag handlers
    tile.addEventListener("dragstart", () => {
      draggedTile = tile;
      setTimeout(() => (tile.style.visibility = "hidden"), 0);
    });
    tile.addEventListener("dragend", () => {
      draggedTile.style.visibility = "visible";
      draggedTile = null;
    });

    // Drop zone
    tile.addEventListener("dragover", (e) => e.preventDefault());
    tile.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!draggedTile || draggedTile === tile) return;

      // Swap tiles
      const temp = document.createElement("div");
      container.replaceChild(temp, tile);
      container.replaceChild(tile, draggedTile);
      container.replaceChild(draggedTile, temp);

      checkWin(container);
    });

    container.appendChild(tile);
  });
}

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

  if (correctCount === GRID_SIZE * GRID_SIZE) {
    setTimeout(() => {
      alert("🎉 You win!");
      document.getElementById("jigsawOverlay").remove();
    }, 200);
  }
}
