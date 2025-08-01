// --- DOM Element Selection ---
const buttons = document.querySelectorAll('.button');
const scoreDisplay = document.querySelector('.score-board p:first-child');
const highestScoreDisplay = document.querySelector('.score-board p:last-child');
const brandName = document.querySelector('.brand-name');
const centerHub = document.querySelector('.center-hub');
const quitButton = document.querySelector('.quit');

// --- Game State Variables ---
const colorSequence = ['red', 'green', 'blue', 'yellow'];
let gameSequence = [];
let playerSequence = [];
let score = 0;
let highestScore = 6;
let isPlayerTurn = false;
let gameInProgress = false;

// --- Utility function for delays ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Game Logic Functions ---

/**
 * Lights up a button and then fades it back.
 * @param {string} color - The color of the button to flash.
 */
async function flashButton(color) {
    const buttonToFlash = document.querySelector(`.button.${color}`);
    if (buttonToFlash) {
        buttonToFlash.classList.add('lit');
        await sleep(400); // How long the button stays lit
        buttonToFlash.classList.remove('lit');
        await sleep(150); // Pause between flashes
    }
}

/**
 * Plays the current game sequence to the player.
 */
async function playSequence() {
    isPlayerTurn = false;
    brandName.textContent = "Simon";
    await sleep(800);

    for (const color of gameSequence) {
        await flashButton(color);
    }

    isPlayerTurn = true;
    brandName.textContent = "Your Turn";
}

/**
 * Starts the next turn.
 */
function nextTurn() {
    if (!gameInProgress) return;

    playerSequence = [];
    score++;
    scoreDisplay.textContent = `score: ${score}`;

    const randomColor = colorSequence[Math.floor(Math.random() * colorSequence.length)];
    gameSequence.push(randomColor);

    playSequence();
}

/**
 * Handles the logic when a player clicks a colored button.
 * @param {Event} event - The click event from the button.
 */
function handlePlayerClick(event) {
    // Ignore clicks if it's not the player's turn.
    if (!isPlayerTurn) return;

    const clickedColor = event.target.dataset.color;
    playerSequence.push(clickedColor);
    flashButton(clickedColor);

    const lastPlayerMoveIndex = playerSequence.length - 1;
    if (playerSequence[lastPlayerMoveIndex] !== gameSequence[lastPlayerMoveIndex]) {
        endGame("Game Over!");
        return;
    }

    if (playerSequence.length === gameSequence.length) {
        isPlayerTurn = false;
        setTimeout(nextTurn, 1000);
    }
}

/**
 * Resets the game.
 * @param {string} message - The message to display.
 */
function endGame(message) {
    if (!gameInProgress) return;

    isPlayerTurn = false;
    gameInProgress = false;
    brandName.textContent = message;

    if (score > highestScore) {
        highestScore = score;
        highestScoreDisplay.textContent = `highest: ${highestScore}`;
    }
    
    gameSequence = [];
    score = 0;
}

/**
 * Initializes a new game.
 */
function startGame() {
    if (gameInProgress) return;

    gameInProgress = true;
    score = -1;
    scoreDisplay.textContent = `score: 0`;
    
    nextTurn();
}

// --- Event Listeners ---

// Click the center hub to start the game.
centerHub.addEventListener('click', startGame);

// **FIX:** Add a separate click listener to each colored button.
buttons.forEach(button => {
    button.addEventListener('click', handlePlayerClick);
});

// Handle the quit button.
quitButton.addEventListener('click', () => {
    endGame("Simon");
    scoreDisplay.textContent = `score: 0`;
});