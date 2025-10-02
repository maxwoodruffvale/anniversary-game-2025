const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let mapData = null;
let tilesetImg = new Image();
let interactables = [];

async function loadMap() {
    // Load JSON
    const response = await fetch("room.json");
    mapData = await response.json();

    // Set canvas size to map size
    canvas.width = mapData.width * mapData.tilewidth;
    canvas.height = mapData.height * mapData.tileheight;

    // Load tileset image
    tilesetImg.src = "tileset.png";
    tilesetImg.onload = () => {
    drawMap();
    extractInteractables();
    };
}

function drawMap() {
    const map = mapData;
    const tileset = map.tilesets[0];
    const tileWidth = map.tilewidth;
    const tileHeight = map.tileheight;
    const columns = Math.floor(tilesetImg.width / tileWidth);

    // Loop over each layer
    map.layers.forEach(layer => {
        if (!layer.visible) return;

        if (layer.type === "tilelayer") {
            // your existing tile drawing code
            for (let row = 0; row < layer.height; row++) {
                for (let col = 0; col < layer.width; col++) {
                    const tileIndex = row * layer.width + col;
                    const tileId = layer.data[tileIndex];
                    if (tileId === 0) continue;

                    const tileX = (tileId - 1) % columns;
                    const tileY = Math.floor((tileId - 1) / columns);

                    ctx.drawImage(
                        tilesetImg,
                        tileX * tileWidth, tileY * tileHeight,
                        tileWidth, tileHeight,
                        col * tileWidth, row * tileHeight,
                        tileWidth, tileHeight
                    );
                }
            }
        } 
        else if (layer.type === "objectgroup") {
            // Draw objects (as rectangles for now)
            layer.objects.forEach(obj => {
                if (!obj.gid) return; // skip objects without a tile

                const tileId = obj.gid;
                const tileX = (tileId - 1) % columns;
                const tileY = Math.floor((tileId - 1) / columns);

                ctx.drawImage(
                    tilesetImg,
                    tileX * tileWidth, tileY * tileHeight,
                    tileWidth, tileHeight,
                    obj.x, obj.y - tileHeight, // Tiled y is bottom-left for tile objects
                    tileWidth, tileHeight
                );
            });
        }
    });
}



function extractInteractables() {
    const objectLayer = mapData.layers.find(l => l.name === "Interactables");
    if (!objectLayer) return;

    interactables = objectLayer.objects.map(obj => ({
    name: obj.name,
    x: obj.x,
    y: obj.y,
    width: obj.width,
    height: obj.height
    }));

    console.log("Interactables:", interactables);
}

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

console.log("Click at:", x, y);

    for (let obj of interactables) {
    if (
        x >= obj.x &&
        x <= obj.x + obj.width &&
        y >= obj.y &&
        y <= obj.y + obj.height
    ) {
        console.log("Clicked:", obj.name);
        loadMinigame(obj.name);
    }
    }
});


function loadMinigame(interactableName) {
    console.log("Loading minigame for:", interactableName);
    switch (interactableName) {
    case "ComputerDesk":
        handleEmojiMinigame();
        break;
    default:
        alert("No minigame assigned for " + interactableName);
    }
}

const emojiQuizData = [
    { emojis: "🍦🌙🔵👅", answer: "After’s" },
    { emojis: "🎬🏈😱", answer: "Him" },
    { emojis: "🎬🐺🙋‍♂️🪓", answer: "Creep" },
    { emojis: "📺🐦🦝", answer: "Regular show" },
    { emojis: "👧🧒👦🏼🏫📆", answer: "Children" },
    { emojis: "🧊🟤🍯🥣🥛☕️", answer: "Iced brown sugar oat milk shaken espresso" },
    { emojis: "🎮🧸🎥👻", answer: "FNAF" },
    { emojis: "🏡🧀🥣", answer: "Cottage cheese" },
    { emojis: "🐕🟤🟡", answer: "Mocha and Teddy" },
    { emojis: "🤣👉💪", answer: "Wenis" },
    { emojis: "🐀🧀🙋‍♂️", answer: "Rat" },
    { emojis: "🎬👩‍❤️‍👨🦴", answer: "Together" },
];

let currentQuizIndex = 0;

function handleEmojiMinigame() {
// Prevent multiple overlays
    if (document.getElementById("emojiQuizOverlay")) return;

    // Overlay container
    const overlay = document.createElement("div");
    overlay.id = "emojiQuizOverlay";
    Object.assign(overlay.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.8) url('tv.png') center 60% / 80% no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        color: "#fff",
        textAlign: "center",
        padding: "20px",
    });

    // Question display
    const questionEl = document.createElement("div");
    questionEl.id = "emojiQuestion";
    questionEl.style.fontSize = "2rem";
    questionEl.style.marginBottom = "20px";
    overlay.appendChild(questionEl);

    // Input field
    const inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.placeholder = "Type your answer here";
    inputEl.style.fontSize = "1rem";
    inputEl.style.padding = "10px";
    inputEl.style.width = "300px";
    overlay.appendChild(inputEl);

    // Submit button
    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Submit";
    submitBtn.style.marginTop = "10px";
    submitBtn.onclick = () => checkAnswer(inputEl.value.trim());
    overlay.appendChild(submitBtn);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close Quiz";
    closeBtn.style.marginTop = "10px";
    closeBtn.onclick = () => document.body.removeChild(overlay );
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);

    // Start quiz
    currentQuizIndex = 0;
    showQuestion();
}

function showQuestion() {
    const questionEl = document.getElementById("emojiQuestion");
    questionEl.innerText = emojiQuizData[currentQuizIndex].emojis;
    document.querySelector("#emojiQuizOverlay input").value = "";
    document.querySelector("#emojiQuizOverlay input").focus();
}

// Check user's answer
function checkAnswer(userAnswer) {
    const correctAnswer = normalizeAnswer(emojiQuizData[currentQuizIndex].answer);
    userAnswer = normalizeAnswer(userAnswer);
    console.log("User answer:", userAnswer, "Correct answer:", correctAnswer);
    console.log("Correct ? ", userAnswer === correctAnswer);
    if (userAnswer === correctAnswer) {
        currentQuizIndex++;
        if (currentQuizIndex >= emojiQuizData.length) {
            alert("🎉 You win! All answers correct!");
            document.getElementById("emojiQuizOverlay").remove();
        } else {
            showQuestion();
        }
    } else {
        alert("Incorrect! Try again.");
    }
}

function normalizeAnswer(str) {
    return str
        .toLowerCase()
        .replace(/[’‘]/g, "'")          // normalize curly quotes
        .replace(/[“”]/g, '"')          // normalize curly double quotes
        .replace(/[^a-z0-9\s]/gi, "")   // remove punctuation (keep letters/numbers/spaces)
        .replace(/\s+/g, " ")           // collapse multiple spaces
        .trim();
}


loadMap();