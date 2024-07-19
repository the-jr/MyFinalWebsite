// preset random number generator with range

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// difficulty/functionality-related stuff

var numOfClicksRequired = 0;
var numOfClicks = 0;
var currentScore = 0;
var highScore = 0;
var maxNumber = 50 // by default: easy - 50, medium - 100, hard - 250
var targetMilliseconds = 500; // by default: easy - 500, medium - 250, hard - 50
var scoreAmount = 10; // by default: easy - 10, medium - 15, hard - 30

// for loading screen/timeout
var secondsTimeout = 10;
var isLoading = true
var paused = false
var userIsBad = false
const loadingCharacters = ["|", "/", "-", "\\"]; // to be iterated thru

// html elements
let numberElement = document.getElementById("numberdisplay");
let title = document.getElementById("Title");
let scoreLabels = document.getElementsByClassName("points");
let clickButton = document.getElementById("clickbutton");
let subButton = document.getElementById("subbutton");
let confirmButton = document.getElementById("confirmbutton");
let pauseButton = document.getElementById("pausebutton");
let displayButton = document.getElementById("displaybutton");

// difficulty buttons
let easyButton = document.getElementById("easy");
let mediumButton = document.getElementById("medium");
let hardButton = document.getElementById("hard");

let difficultyLabel = document.getElementById("difficulty")

// text for html label elements
var titleText = "A number will briefly appear on your screen in (x) second(s). When it does, your job is to click the button below this text the amount of times that is shown by the number.";

var correctText = "You clicked (x) time(s) and that was the correct amount! Great job! You earn (n) points!";
var incorrectText = "You clicked (x) time(s) but the actual amount was (y). Sorry!";

var defaultCurrentScoreText = "Score: (x)"
var defaultHighScoreText = "High Score (does not save): (x)"

// self-explanatory
function changeDifficulty(newInt, newMax, newScoreAmount, newColor, text) {
    targetMilliseconds = newInt;
    maxNumber = newMax;
    scoreAmount = newScoreAmount;
    difficultyLabel.style.color = newColor;
    difficultyLabel.textContent = ("Difficulty: ").concat(text);
}

// pause while in intermission
pauseButton.onclick = function () {
    if (!isLoading) { return; }
    paused = !paused;

    if (paused) {
        pauseButton.textContent = "Resume";
        pauseButton.style.backgroundColor = "rgb(200, 255, 200)"
    } else {
        pauseButton.textContent = "Pause";
        pauseButton.style.backgroundColor = "rgb(255, 200, 200)"
    }
}
pauseButton.ontouchend = pauseButton.onclick;

// display clicks for bad people
displayButton.onclick = function () {
    if (!isLoading || scoreAmount >= 30) { return; }
    userIsBad = (!userIsBad);

    if (userIsBad) { displayButton.textContent = "Undisplay Clicks"; } else { displayButton.textContent = "Display Clicks"; }
}
displayButton.ontouchend = displayButton.onclick;

// onclick funcs to change difficulty (this could be way more efficient but whatever)
easyButton.onclick = function () {
    if (!isLoading) { return; }
    changeDifficulty(500, 50, 10, "rgb(200, 255, 200)", "Easy");
}
easyButton.ontouchend = easyButton.onclick;

mediumButton.onclick = function () {
    if (!isLoading) { return; }
    changeDifficulty(250, 100, 15, "rgb(255, 255, 200)", "Medium");
}
mediumButton.ontouchend = mediumButton.onclick;

hardButton.onclick = function () {
    if (!isLoading) { return; }

    if (userIsBad) {
        userIsBad = false;
        displayButton.textContent = "Display Clicks";
    }

    changeDifficulty(50, 250, 30, "rgb(255, 200, 200)", "Hard");
}
hardButton.ontouchend = hardButton.onclick;

// self-exp.
function changeTitle() {
    var seconds_S_Value;

    if (secondsTimeout == 1) { seconds_S_Value = "" } else { seconds_S_Value = "s" };
    title.textContent = titleText.replace("(x)", secondsTimeout.toString()).replace("(s)", seconds_S_Value)
}

// self-exp.
function displayCorrectOrIncorrect() {
    var seconds_S_Value;

    if (numOfClicks == 1) { seconds_S_Value = "" } else { seconds_S_Value = "s" };

    if (numOfClicks === numOfClicksRequired) {
        title.textContent = correctText.replace("(x)", numOfClicks.toString());
        title.textContent = title.textContent.replace("(n)", scoreAmount.toString());
        title.textContent = title.textContent.replace("(s)", seconds_S_Value);
    } else {
        title.textContent = incorrectText.replace("(x)", numOfClicks.toString()).replace("(y)", numOfClicksRequired.toString());
        title.textContent = title.textContent.replace("(s)", seconds_S_Value);
    }
}

// self-exp.
var alreadyConfirmed = false;

function startProcess() {
    numOfClicksRequired = randomNumber(1, maxNumber);
    var isBigNumber = 0;

    if (numOfClicksRequired > 100 && scoreAmount == 30) { // if it's hard mode and clicks required is huge 3 digit number
        scoreAmount += 10; // 40
        isBigNumber++;

        if (numOfClicksRequired > 175) {
            scoreAmount += 10; // 50
            isBigNumber++;
        }
    }

    numberElement.textContent = numOfClicksRequired.toString();

    clickButton.onclick = function () {
        if (isLoading || alreadyConfirmed) { return; }
        numOfClicks++;

        if (userIsBad && scoreAmount < 30) {
            numberElement.textContent = "Number of clicks: " + numOfClicks.toString();
        }
    }
    clickButton.ontouchend = clickButton.onclick;

    subButton.onclick = function () {
        if (isLoading || alreadyConfirmed || numOfClicks <= 0) { return; }
        numOfClicks--;

        if (userIsBad && scoreAmount < 30) {
            numberElement.textContent = "Number of clicks: " + numOfClicks.toString();
        }
    }
    subButton.ontouchend = subButton.onclick;

    confirmButton.onclick = function () {
        if (isLoading || alreadyConfirmed) { return; }
        alreadyConfirmed = true;

        if (userIsBad) {
            scoreAmount -= 5;
        }

        displayCorrectOrIncorrect()

        setTimeout(changeScore, 500)
        if (userIsBad) {
            setTimeout(function () {
                scoreAmount += 5;
            }, 750)
        }
        setTimeout(function () {
            title.textContent = "Resetting..."
        }, 2500) // 500 + 500

        setTimeout(function () {
            secondsTimeout = 10;
            numOfClicks = 0;
            numOfClicksRequired = 0;
            isLoading = true;
            alreadyConfirmed = false;

            scoreAmount -= (isBigNumber * 10) // reset to default

            startLoadingTitle();
            startLoadingCharacters();
        }, 5000) // 2000 + 500 for changeScore + 2500 for Resetting... function
    }
    confirmButton.ontouchend = confirmButton.onclick;

    // make num of times to click nothing after x milliseconds (this is the memory part !!!!)
    setTimeout(function () {
        numberElement.textContent = "\0";
    }, targetMilliseconds)
}

function changeScore() {
    let currentScoreLabel = scoreLabels[0];
    let highScoreLabel = scoreLabels[1];

    var increaseScore = (numOfClicks === numOfClicksRequired);

    if (increaseScore) {
        currentScore += scoreAmount;

        currentScoreLabel.textContent = defaultCurrentScoreText.replace("(x)", currentScore.toString());
        if (currentScore > highScore) {
            highScore = currentScore;
        }
    } else {
        currentScore = 0;
        currentScoreLabel.textContent = defaultCurrentScoreText.replace("(x)", "0");
    }

    // in case someone inspect elemented the high score label
    highScoreLabel.textContent = defaultHighScoreText.replace("(x)", highScore.toString())
}

function startLoadingTitle() {
    var titleInterval;

    // default
    changeTitle();

    titleInterval = setInterval(function () {
        if (paused) { return; }

        secondsTimeout -= 1;
        changeTitle();

        if (secondsTimeout === 0) {
            clearInterval(titleInterval);
            isLoading = false
            setTimeout(startProcess, 1000)
        }
    }, 1000);
}

function startLoadingCharacters() {
    var index = 0;
    var Interval;

    // default
    numberElement.textContent = "\\";

    Interval = setInterval(function () {
        if (paused) { return; }
        if (!isLoading) {
            clearInterval(Interval);
            numberElement.textContent = "..."
            return;
        }

        numberElement.textContent = loadingCharacters[index];
        index++;

        if (index == 4) {
            index = 0;
        }
    }, 300)
}

// this better not be false
if (numberElement) { startLoadingCharacters() }

startLoadingTitle();
