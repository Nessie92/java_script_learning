const squares = document.querySelectorAll('.square');
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');
const playButton = document.querySelector('#Play-button');

let countDownMoleTimer;
let result = 0;
let hitPosition;
let bombHit;
let delayTime = 1000;
let currentTime = 60;
let moleTimer = null;
let speedIncreaseInterval = 15000;
let speedChangeStep = 150;
let increaseSpeedtimer;

resetGame();
playButton.addEventListener('click', playGame);

function resetGame() {
    clearInterval(countDownMoleTimer);
    clearInterval(moleTimer);
    clearInterval(increaseSpeedtimer);
    result = 0;
    currentTime = 60;
    delayTime = 1000;
    timeLeft.textContent = currentTime;
    score.textContent = result;

    // Clear the board by removing all moles and bombs
    squares.forEach((square) => {
        square.classList.remove('mole', 'bomb');
    });
}

function moveSquare() {
    squares.forEach((square) => {
        square.classList.remove('mole', 'bomb');
    });

    let randomNumber = Math.floor(Math.random() * 10);

    if (randomNumber === 9) {
        let randomBomb = squares[Math.floor(Math.random() * 9)];
        randomBomb.classList.add('bomb');
        bombHit = true;
        hitPosition = randomBomb.id;
    } else {
        let randomMole = squares[Math.floor(Math.random() * 9)];
        randomMole.classList.add('mole');
        bombHit = false;
        hitPosition = randomMole.id;
    }
}

function moveMoleTimerSetup() {
    bombHit = false;
    moleTimer = setInterval(moveSquare, delayTime);
}

function increaseSpeed() {
    delayTime -= speedChangeStep;
    clearInterval(moleTimer);
    moveMoleTimerSetup();
}

function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime;

    if (currentTime <= 0) {
        clearInterval(moleTimer);
        clearInterval(countDownMoleTimer);
        alert("GAME OVER! Your final score is " + result);
        resetGame();
        playButton.disabled = false;
    }
}

function squareClickHandler(event) {
    const square = event.target;
    if (square.id == hitPosition) {
        if (bombHit) {
            result -= 10;
            delayTime -= 100;
            clearInterval(moleTimer);
            moveMoleTimerSetup();
        } else {
            result++;
        }
        score.innerHTML = result;
        hitPosition = null;
        bombHit = false;
    }
}

function playGame() {
    resetGame();
    playButton.disabled = true;
    countDownMoleTimer = setInterval(countDown, 1000);
    squares.forEach((square) => {
        square.addEventListener('mousedown', squareClickHandler);
    });
    moveMoleTimerSetup();
    increaseSpeedtimer = setInterval(increaseSpeed, speedIncreaseInterval);
}
