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
var scoreAmount = 10; // by default: easy - 10, medium - 15, hard - 25

// for loading screen/timeout
var secondsTimeout = 10;
var isLoading = true
const loadingCharacters = ["|", "/", "-", "\\"]; // to be iterated thru

// html elements
let numberElement = document.getElementById("numberdisplay");
let title = document.getElementById("Title");
let scoreLabels = document.getElementsByClassName("points");
let clickButton = document.getElementById("clickbutton");
let confirmButton = document.getElementById("confirmbutton");

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

// onclick funcs to change difficulty (this could be way more efficient but whatever)
easyButton.onclick = function () {
    if (!isLoading) { return; }
    changeDifficulty(500, 50, 10, "rgb(200, 255, 200)", "Easy");
}

mediumButton.onclick = function () {
    if (!isLoading) { return; }
    changeDifficulty(250, 100, 15, "rgb(255, 255, 200)", "Medium");
}

hardButton.onclick = function () {
    if (!isLoading) { return; }
    changeDifficulty(50, 250, 25, "rgb(255, 200, 200)", "Hard");
}

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
        title.textContent = title.textContent.replace("(n)", numOfClicks.toString());
        title.textContent = title.textContent.replace("(s)", seconds_S_Value);
    } else {
        title.textContent = incorrectText.replace("(x)", numOfClicks.toString()).replace("(y)", numOfClicksRequired.toString());
        title.textContent = title.textContent.replace("(s)", seconds_S_Value);
    }
}

// self-exp.
function startProcess() {
    numOfClicksRequired = randomNumber(1, maxNumber);
    numberElement.textContent = numOfClicksRequired.toString();

    clickButton.onclick = function () {
        if (isLoading) { return; }
        numOfClicks++;
    }

    confirmButton.onclick = function () {
        if (isLoading) { return; }

        displayCorrectOrIncorrect()
        setTimeout(changeScore, 500)
        setTimeout(function () {
            title.textContent = "Resetting..."
        }, 2500) // 500 + 500

        setTimeout(function () {
            secondsTimeout = 10;
            numOfClicks = 0;
            numOfClicksRequired = 0;
            isLoading = true;

            startLoadingTitle();
            startLoadingCharacters();
        }, 5000) // 2000 + 500 for changeScore + 2500 for Resetting... function
    }

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
            highScoreLabel.textContent = defaultHighScoreText.replace("(x)", highScore.toString())
        }
    } else {
        currentScore = 0;
        currentScoreLabel.textContent = defaultCurrentScoreText.replace("(x)", "0");
    }
}

function startLoadingTitle() {
    var titleInterval;
    titleInterval = setInterval(function () {
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
    // while it should be 0 the 300ms delay will cause "|" to be in loading mode for 600ms at the beginning
    // so we just set index to the next value to even things out ;)
    var index = 1;
    var Interval;

    Interval = setInterval(function () {
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
