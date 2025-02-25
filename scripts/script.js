const wordList = ["seven", "smoke", "crane", "moule", "homme", "speak", "bored", "revel", "recur", "blame"];
const MAX_ROUNDS = 3, MAX_GUESSES = 10;

let currentWord, correctLetters, wrongLetters, incorrectGuesses;
let currentPlayer = 1, scores = { 1: 0, 2: 0 };
let isTwoPlayer = false, currentRound = 0, previousMode = false;

$(document).ready(() => {
    loadScores();
    if (loadGameState()) {
        $("#player-modal").hide();
        $("#game-container").fadeIn();
        updateUI();
    } else {
        showModeSelection();
    }
    setupEventHandlers();
});

function setupEventHandlers() {
    $("#start-one-player").click(() => startGame(false));
    $("#start-two-player").click(() => startGame(true));
    $("#guess-button").click(handleGuess);
    $("#reset-button").click(resetGame);
    $("#next-round-button").click(nextRound);
    $("#reset-scores").click(resetScores);
    $("#quit-button, #quit-results").click(quitGame);
    $("#play-again").click(() => {
        $("#results").hide();
        $("#final-scores, #message").text("");
        startGame(previousMode);
    });
    $(document).keydown(event => {
        let letterInput = $("#letter-input");
        if (!letterInput.prop("disabled") && /^[a-zA-Z]$/.test(event.key)) {
            letterInput.val(event.key);
        }
        if (event.key === "Enter" && !letterInput.prop("disabled")) {
            handleGuess();
        }
    });
}

function saveGameState() {
    localStorage.setItem("gameState", JSON.stringify({ isTwoPlayer, currentPlayer, currentRound, scores, currentWord, correctLetters, wrongLetters, incorrectGuesses }));
}

function loadGameState() {
    const gameState = JSON.parse(localStorage.getItem("gameState"));
    if (gameState) {
        ({ isTwoPlayer, currentPlayer, currentRound, scores, currentWord, correctLetters, wrongLetters, incorrectGuesses } = gameState);
        return true;
    }
    return false;
}

function loadScores() {
    const storedScores = JSON.parse(localStorage.getItem("scores"));
    if (storedScores) {
        scores = storedScores;
        updateScoreboard();
    }
}

function startGame(twoPlayerMode, resetScores = false) {
    isTwoPlayer = previousMode = twoPlayerMode;
    if (resetScores) scores = { 1: 0, 2: 0 }, localStorage.setItem("scores", JSON.stringify(scores));

    currentPlayer = 1;
    currentRound = 1;
    $("#player-modal").hide();
    $("#game-container").fadeIn();
    resetGame();
}

function resetGame() {
    if (currentRound > MAX_ROUNDS) return endMatch();
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    correctLetters = [], wrongLetters = [], incorrectGuesses = 0;
    saveGameState();
    updateUI();
}

function updateUI() {
    $("#current-player").text(isTwoPlayer ? `Player ${currentPlayer}'s Turn` : "");
    $("#message").text("").show();
    $("#letter-input").val("").prop("disabled", false);
    $("#guess-button").prop("disabled", false);
    $("#next-round-button, #reset-button").hide();
    updateDisplay();
}

function updateDisplay() {
    $("#word-display").text(currentWord.split("").map(l => correctLetters.includes(l) ? l : "_").join(" "));
    $("#guesses-left").text(`Guesses Left: ${MAX_GUESSES - incorrectGuesses}`);
    $("#round-counter").text(`Round: ${currentRound}/${MAX_ROUNDS}`);
    $("#wrong-letters").text(`Wrong Letters: ${wrongLetters.join(" ")}`);
}

function handleGuess() {
    let guess = $("#letter-input").val().toLowerCase();
    if (!guess || guess.length !== 1 || !/[a-z]/.test(guess) || correctLetters.includes(guess) || wrongLetters.includes(guess)) {
        $("#message").text("Invalid or repeated guess.");
        return;
    }

    currentWord.includes(guess) ? correctLetters.push(guess) : (wrongLetters.push(guess.toUpperCase()), incorrectGuesses++);
    updateDisplay();

    if (currentWord.split("").every(letter => correctLetters.includes(letter))) endRound(true);
    else if (incorrectGuesses >= MAX_GUESSES) endRound(false);
}

function endRound(isWin) {
    $("#letter-input, #guess-button").prop("disabled", true);
    let roundPoints = isWin ? MAX_GUESSES - incorrectGuesses : 0;
    if (isWin) scores[currentPlayer] += roundPoints;
    
    $("#message").text(isWin ? `Player ${currentPlayer} wins +${roundPoints} points!` : `Out of guesses! The word was "${currentWord}"`);
    $("#word-display").text(currentWord.split("").join(" "));
    updateScoreboard();

    if (currentRound < MAX_ROUNDS || (isTwoPlayer && currentPlayer === 1)) $("#next-round-button").fadeIn();
    else endMatch();
}

function nextRound() {
    if (isTwoPlayer) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        if (currentPlayer === 1) currentRound++;
    } else {
        currentRound++;
    }

    if (currentRound <= MAX_ROUNDS) resetGame();
    else endMatch();
}

function updateScoreboard() {
    localStorage.setItem("scores", JSON.stringify(scores));
    $("#scoreboard").text(isTwoPlayer ? `Player 1: ${scores[1]} | Player 2: ${scores[2]}` : `Your points: ${scores[1]}`);
}

function endMatch() {
    localStorage.removeItem("gameState");
    $("#message").text("Game Over!");
    $("#results").fadeIn();
    let p1 = scores[1], p2 = scores[2];
    $("#final-scores").text(isTwoPlayer ? (p1 > p2 ? `Player 1 Wins! ${p1} - ${p2}` : p2 > p1 ? `Player 2 Wins! ${p2} - ${p1}` : `It's a tie! ${p1} - ${p2}`) : `Your final score: ${p1}`);
}

function resetScores() {
    scores = { 1: 0, 2: 0 };
    localStorage.removeItem("scores");
    updateScoreboard();
    $("#message").text("Scores reset.");
}

function quitGame() {
    localStorage.removeItem("gameState");
    showModeSelection();
    resetScores();
}

function showModeSelection() {
    $("#player-modal").fadeIn();
    $("#game-container, #results").hide();
}
