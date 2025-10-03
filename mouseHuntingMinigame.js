// mouseHuntMinigame.js
let score = 0;
let totalMice = 20;
let miceSpawned = 0;
let spawnInterval = null;

export function handleMouseHuntMinigame() {
  if (document.getElementById("mouseHuntOverlay")) return;

  score = 0;
  miceSpawned = 0;

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "mouseHuntOverlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    cursor: "url('cheese.png') 16 16, auto", // custom cheese cursor
  });

  // Game container with background
  const gameArea = document.createElement("div");
  Object.assign(gameArea.style, {
    position: "relative",
    width: "800px",
    height: "500px",
    backgroundImage: "url('farm-bg.jpg')",
    backgroundSize: "cover",
    overflow: "hidden",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  });
  overlay.appendChild(gameArea);

  // Score display
  const scoreEl = document.createElement("div");
  scoreEl.innerText = "Score: 0";
  Object.assign(scoreEl.style, {
    position: "absolute",
    top: "10px",
    left: "10px",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    textShadow: "1px 1px 3px black",
  });
  gameArea.appendChild(scoreEl);

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Close";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "6px 12px",
    cursor: "pointer",
    zIndex: 10000,
  });
  closeBtn.onclick = () => {
    clearInterval(spawnInterval);
    document.body.removeChild(overlay);
  };
  gameArea.appendChild(closeBtn);

  document.body.appendChild(overlay);

  // Start spawning mice
  spawnInterval = setInterval(() => spawnMouse(gameArea, scoreEl), 2000); // new mouse every 2s
}

function spawnMouse(gameArea, scoreEl) {
  if (miceSpawned >= totalMice) {
    clearInterval(spawnInterval);
    setTimeout(() => endGame(), 1000);
    return;
  }
  miceSpawned++;

  const mouse = document.createElement("img");
  mouse.src = "mouse.png";
  Object.assign(mouse.style, {
    position: "absolute",
    width: "50px",
    height: "50px",
    cursor: "url('cheese.png') 0 0, auto"
  });

  // random position inside container
  const maxX = gameArea.clientWidth - 50;
  const maxY = gameArea.clientHeight - 50;
  mouse.style.left = Math.floor(Math.random() * maxX) + "px";
  mouse.style.top = Math.floor(Math.random() * maxY) + "px";

  // click to score
  mouse.onclick = () => {
    score++;
    scoreEl.innerText = `Score: ${score}`;
    mouse.remove();
  };

  gameArea.appendChild(mouse);

  // remove after 3s if not clicked
  setTimeout(() => {
    if (mouse.parentElement) mouse.remove();
  }, 3000);
}

function endGame() {
  const overlay = document.getElementById("mouseHuntOverlay");
  if (!overlay) return;

  if (score >= 18) {
    alert(`🎉 You win! Final score: ${score}/${20}. Your clue is 0`);
    overlay.remove();
  } else {
    if (confirm(`😢 You lose! Final score: ${score}/${20}. Play again?`)) {
      overlay.remove();
      handleMouseHuntMinigame();
    } else {
      overlay.remove();
    }
  }
}
