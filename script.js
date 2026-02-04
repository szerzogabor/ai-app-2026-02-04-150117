// DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapList = document.getElementById('lapList');

// Stopwatch variables
let startTime = 0;          // Time when the stopwatch was started or last resumed
let elapsedTime = 0;        // Total elapsed time (in milliseconds)
let timerInterval;          // Interval ID for updating the display
let isRunning = false;      // Flag to check if the stopwatch is running
let lapCounter = 0;         // Counter for lap numbers

/**
 * Formats a number to always have two digits (e.g., 5 -> "05").
 * @param {number} unit - The number to format.
 * @returns {string} The formatted string.
 */
function formatTime(unit) {
    return unit < 10 ? '0' + unit : unit;
}

/**
 * Updates the stopwatch display with the current elapsed time.
 */
function updateDisplay() {
    // Calculate current elapsed time based on when the timer started and now
    elapsedTime = Date.now() - startTime;

    let mills = Math.floor((elapsedTime % 1000) / 10); // Get centiseconds (10ms intervals)
    let secs = Math.floor((elapsedTime / 1000) % 60);
    let mins = Math.floor((elapsedTime / (1000 * 60)) % 60);

    millisecondsDisplay.textContent = formatTime(mills);
    secondsDisplay.textContent = formatTime(secs);
    minutesDisplay.textContent = formatTime(mins);
}

/**
 * Starts or resumes the stopwatch.
 */
function startTimer() {
    if (!isRunning) {
        // Set startTime to now minus any previously elapsed time
        // This allows resuming from where it left off
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 10); // Update every 10ms for centiseconds
        isRunning = true;

        // Update button states
        startBtn.disabled = true;
        stopBtn.disabled = false;
        lapBtn.disabled = false;
        resetBtn.disabled = false;
    }
}

/**
 * Stops the stopwatch.
 */
function stopTimer() {
    if (isRunning) {
        clearInterval(timerInterval); // Stop the interval updates
        elapsedTime = Date.now() - startTime; // Save the total elapsed time
        isRunning = false;

        // Update button states
        startBtn.disabled = false;
        stopBtn.disabled = true;
        lapBtn.disabled = true; // Cannot lap when stopped
        resetBtn.disabled = false;
    }
}

/**
 * Resets the stopwatch to zero.
 */
function resetTimer() {
    clearInterval(timerInterval); // Ensure any running interval is cleared
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    lapCounter = 0;

    // Reset display to 00:00.00
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    millisecondsDisplay.textContent = '00';

    // Clear lap list
    lapList.innerHTML = '';

    // Update button states
    startBtn.disabled = false;
    stopBtn.disabled = true;
    lapBtn.disabled = true;
    resetBtn.disabled = true;
}

/**
 * Records a lap time.
 */
function lapTimer() {
    if (isRunning) {
        lapCounter++;
        // Capture the current elapsed time for the lap
        const currentLapTime = elapsedTime; 

        const lapMills = Math.floor((currentLapTime % 1000) / 10);
        const lapSecs = Math.floor((currentLapTime / 1000) % 60);
        const lapMins = Math.floor((currentLapTime / (1000 * 60)) % 60);

        const lapTimeString = `${formatTime(lapMins)}:${formatTime(lapSecs)}.${formatTime(lapMills)}`;

        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>Lap ${lapCounter}</span><span>${lapTimeString}</span>`;
        lapList.prepend(listItem); // Add new laps to the top of the list
    }
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', lapTimer);

// Initialize button states when the script loads
// startBtn is enabled by default in HTML, others are disabled
resetBtn.disabled = true; // Ensure reset is disabled until timer is run/stopped
