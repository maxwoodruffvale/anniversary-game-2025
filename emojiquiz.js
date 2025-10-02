export const emojiQuizData = [
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

export function handleEmojiMinigame() {
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
            alert("🎉 You win! All answers correct! Your number is: 3");
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