// After Effects expression for cycling through words in a text layer, with minimum display time for short words-------------V7

var wordsToShow = 1; // Number of words to display at a time (adjust as needed)
var startTime = 0; // Start time in seconds
var endTime = 29; // End time in seconds
var pauseAfterPeriod = 1.5; // Pause time in seconds after each '.'
var pauseAfterComma = 0.75; // Pause time in seconds after each ','
var minDisplayTimeForShortWords = 0.1; // Minimum display time in seconds for words up to 4 characters

// Access the source text value
var fullText = thisLayer.text.sourceText;
if (typeof fullText !== "string") {
    fullText = fullText.value;
}

// Split the text into words
var wordsArray = fullText.split(/\s+/); // Split by any whitespace

// Function to calculate additional pause based on punctuation
function calculatePause(word) {
    var pause = 0;
    if (word.endsWith('.')) {
        pause += pauseAfterPeriod;
    }
    if (word.endsWith(',')) {
        pause += pauseAfterComma;
    }
    return pause;
}

// Function to calculate minimum display time for short words
function calculateMinTime(word) {
    return word.length <= 4 ? minDisplayTimeForShortWords : 0;
}

// Calculate the total additional time (pauses and minimum display times)
var totalAdditionalTime = wordsArray.reduce((sum, word) => sum + calculatePause(word) + calculateMinTime(word), 0);

// Calculate the total duration for character display (excluding additional times)
var totalDuration = endTime - startTime - totalAdditionalTime;

// Calculate the proportional duration for each character
var totalChars = wordsArray.join("").length; // Total characters without spaces
var timePerChar = totalDuration / totalChars;

// Initialize variables for the loop
var currentTime = startTime;
var currentWordIndex = 0;

// Loop through the words to find the current set of words
for (var i = 0; i < wordsArray.length; i++) {
    var wordSetTime = 0;
    for (var j = 0; j < wordsToShow && (i + j) < wordsArray.length; j++) {
        var word = wordsArray[i + j];
        wordSetTime += word.length * timePerChar + calculatePause(word) + calculateMinTime(word);
    }

    if (time >= currentTime && time < currentTime + wordSetTime) {
        currentWordIndex = i;
        break;
    }
    currentTime += wordSetTime;
}

// Display the current set of words or nothing if time exceeds endTime
if (time <= endTime) {
    var endIndex = Math.min(currentWordIndex + wordsToShow, wordsArray.length);
    wordsArray.slice(currentWordIndex, endIndex).join(" ");
} else {
    ""; // Display nothing beyond the end time
}
