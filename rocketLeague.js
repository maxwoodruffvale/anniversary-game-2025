// soccerGame.js
export function handleSoccerMinigame() {
  const overlay = document.createElement("div");
  overlay.id = "soccerOverlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  });

  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = "800px";
  container.style.height = "600px";
  container.style.backgroundImage = "url('tv.png')";
  container.style.backgroundSize = "contain";
  container.style.backgroundRepeat = "no-repeat";
  container.style.backgroundPosition = "center";

  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  canvas.style.position = "absolute";
  canvas.style.top = "100px";  // adjust to fit TV screen
  canvas.style.left = "100px"; // adjust to fit TV screen
  container.appendChild(canvas);

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "5px 10px",
    fontSize: "16px",
    cursor: "pointer",
    zIndex: 2000,
  });
  closeBtn.onclick = () => overlay.remove();
  container.appendChild(closeBtn);

  // Scoreboard
  const scoreDiv = document.createElement("div");
  scoreDiv.textContent = "Score: 0 / 10";
  Object.assign(scoreDiv.style, {
    position: "absolute",
    top: "10px",
    left: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
    background: "rgba(0,0,0,0.5)",
    padding: "4px 8px",
    borderRadius: "4px",
  });
  container.appendChild(scoreDiv);

  overlay.appendChild(container);
  document.body.appendChild(overlay);

  const ctx = canvas.getContext("2d");

  // Load assets
  const field = new Image();
  field.src = "field.jpg";
  const goal = new Image();
  goal.src = "goal.png";
  const car = new Image();
  car.src = "car.png";
  const ballImg = new Image();
  ballImg.src = "ball.png";

  let carX = 0;
  let carY = 225;
  let carSpeed = 2;
  let carDirection = 1; // 1 = right, -1 = left
  let carFlipped = false;
  let carSize = 1;

  let ball = null;
  let score = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Field background
    ctx.drawImage(field, 0, 0, canvas.width, canvas.height);

    // Goal centered
    const goalWidth = 120;
    const goalHeight = 100;
    const goalX = (canvas.width - goalWidth) / 2;
    ctx.drawImage(goal, goalX, 150, goalWidth, goalHeight);

    // Car movement
    if (carX <= 0) {
        carFlipped = true;
        carDirection = 1;
        carX = 0;
    } else if (carX + 200 >= canvas.width) {
        carFlipped = false;
        carDirection = -1;
        carX = canvas.width - 200;
    }

    carX += carSpeed * carDirection;

    ctx.save();
    if (carFlipped) {
      ctx.scale(-1, 1);
      ctx.drawImage(car, -carX - (100 * carSize), carY, 100 * carSize, 60 * carSize);
    } else {
      ctx.drawImage(car, carX, carY, 100 * carSize, 60 * carSize);
    }
    ctx.restore();

    // Ball
    if (ball) {
      ball.y -= ball.speed;
      ball.size *= 0.98;
      if (ball.size < 20) {
        // Check collision with car
        const carRect = { x: carX, y: 200, w: 200, h: 60 };
        if (
          ball.x > carRect.x &&
          ball.x < carRect.x + carRect.w &&
          ball.y > carRect.y &&
          ball.y < carRect.y + carRect.h
        ) {
          ball = null;
        } else {
          score++;
          scoreDiv.textContent = `Score: ${score} / 10`;
          if (score >= 10) {
            alert("⚽ You win! Scored 10 goals!");
            overlay.remove();
            return;
          }
          ball = null;
        }
      } else {
        ctx.drawImage(
          ballImg,
          ball.x - ball.size / 2,
          ball.y - ball.size / 2,
          ball.size,
          ball.size
        );
      }
    }

    requestAnimationFrame(draw);
  }

  function shootBall() {
    if (!ball) {
      ball = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        size: 40,
        speed: 5,
      };
    }
  }

  function handleKey(e) {
    if (e.code === "Space") {
      shootBall();
    }
  }

  window.addEventListener("keydown", handleKey);

  draw();
}
