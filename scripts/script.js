const wordList = ["seven", "smoke", "crane", "moule", "homme", "speak", "bored", "revel", "recur", "blame"];

const maxGuesses = 10;
let currentWord, correctLetters, wrongGuesses;

function resetGame() {
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    correctLetters = [];
    wrongGuesses = 0;
    alert(`A new game has started! The word has ${currentWord.length} letters.`);
    playGame();
}

function displayWord() {
    return currentWord
        .split("")
        .map((letter) => (correctLetters.includes(letter) ? letter : "_"))
        .join(" ");
}

function playGame() {
    while (wrongGuesses < maxGuesses) {
        const currentDisplay = displayWord();
        if (!currentDisplay.includes("_")) {
            alert(`Congratulations! You guessed the word: ${currentWord}`);
            return askToPlayAgain();
        }

        const guess = prompt(`Word: ${currentDisplay}\nWrong guesses: ${wrongGuesses}/${maxGuesses}\nEnter a letter:`);

        if (!guess || guess.length !== 1 || !/[a-zA-Z]/.test(guess)) {
            alert("Please enter a valid single letter.");
            continue;
        }

        if (currentWord.includes(guess)) {
            correctLetters.push(guess);
        } else {
            wrongGuesses++;
        }
    }

    alert(`Game over! The correct word was: ${currentWord}`);
    askToPlayAgain();
}


function askToPlayAgain() {
    const playAgain = confirm("Do you want to play again?");
    if (playAgain) {
        resetGame();
    } else {
        alert("Thanks for playing! Goodbye!");
    }
}

resetGame();