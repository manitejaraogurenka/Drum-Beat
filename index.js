let playTime = 0;
let lastClickTime = null;
let steps = [];
let recording = false;
let index = 3;

const progressBar = document.querySelector(".barStatus");

function millisecondsToMinutesAndSeconds(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return { minutes, seconds };
}

const phrases = [
  "......Recording beats",
  ".....Recording beats.",
  "....Recording beats..",
  "...Recording beats...",
  "..Recording beats....",
  ".Recording beats.....",
  "Recording beats......",
  ".Recording beats.....",
  "..Recording beats....",
  "...Recording beats...",
  "....Recording beats..",
  ".....Recording beats.",
];

function animateText() {
  const textElement = document.querySelector(".text");
  if (recording) {
    textElement.textContent = phrases[index];
    index = (index + 1) % phrases.length;
  } else {
    textElement.textContent = "...Recording beats...";
    index = 3;
  }
}

setInterval(animateText, 750);
var numberofdrums = document.querySelectorAll(".drum").length;
for (var i = 0; i < numberofdrums; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function () {
    let drum = this.innerHTML.toLowerCase();
    makeSound(drum);
    if (recording) {
      stepsRecord(drum);
    }

    buttonAnimation(drum);
  });
}

document.querySelector(".btn").addEventListener("click", () => {
  const textElement = document.querySelector(".text");
  const barElement = document.querySelector(".musicBar");
  if (recording) {
    recording = false;
    if (steps.length > 0) {
      document.querySelector(".btn").textContent = "▶ Play now";
      barElement.classList.remove("hidden");
    } else {
      document.querySelector(".btn").textContent = "Record beats";
      setTimeout(() => {
        barElement.classList.add("hidden");
      }, 500);
    }
    textElement.classList.remove("show");
    textElement.classList.add("hide");
  } else if (steps.length > 0) {
    playRecorded(steps);
    steps = [];
    playTime = 0;
    document.querySelector(".btn").textContent = "Record beats";
    textElement.classList.remove("show");
    textElement.classList.add("hide");
  } else {
    recording = true;
    document.querySelector(".btn").textContent = "Stop recording";
    textElement.classList.remove("hide");
    textElement.classList.add("show");
  }
});

function playRecorded(steps) {
  let index = 0;
  const progressBar = document.querySelector(".barStatus");
  progressBar.style.setProperty("--bar-width", `${0}%`);
  progressBar.style.transition = "width 0.3s linear";

  // Disable all buttons during playback
  document.querySelectorAll(".drum").forEach((button) => {
    button.classList.add("disabled");
  });
  document.querySelector(".btn").classList.add("disabled");

  function playNextStep() {
    if (index < steps.length) {
      const element = steps[index];
      makeSound(element.key);
      buttonAnimation(element.key);
      index++;

      // Calculate progress and update progress bar width
      const progress = (index / steps.length) * 100;
      progressBar.style.setProperty("--bar-width", `${progress}%`);
      // Wait for the step duration before playing the next step
      setTimeout(playNextStep, element.secs);
    } else {
      // Enable all buttons after all steps are played
      document.querySelectorAll(".drum").forEach((button) => {
        button.classList.remove("disabled");
      });
      document.querySelector(".btn").classList.remove("disabled");

      // Don't reset progress bar width after all steps are played
      document.querySelector(".btn").textContent = "Record beats";
      progressBar.style.setProperty("--bar-width", `${0}%`);
      document.querySelector(".musicBar").classList.add("hidden");
    }
  }

  // Start updating the progress bar more frequently
  const updateInterval = 20; // Update interval in milliseconds

  let elapsedTime = 0;
  const updateProgressBar = () => {
    elapsedTime += updateInterval;
    const progress = (elapsedTime / playTime) * 100;
    progressBar.style.setProperty("--bar-width", `${progress}%`);

    if (elapsedTime < playTime) {
      setTimeout(updateProgressBar, updateInterval);
    }
  };

  // Start playing the steps and updating the progress bar
  playNextStep();
  updateProgressBar();

  //update time
  let duration = playTime;
  let timerInterval = null;

  function updateTime() {
    let { minutes, seconds } = millisecondsToMinutesAndSeconds(duration);
    document.querySelector(".time").textContent = `${pad(minutes)}:${pad(
      seconds
    )}`;

    duration -= 1000; // Subtract one second (1000 milliseconds)

    if (duration < 0) {
      clearInterval(timerInterval); // Stop the timer when it reaches 0
    }
  }

  // Start the timer
  timerInterval = setInterval(updateTime, 1000);
  updateTime();
}

function pad(number) {
  return (number < 10 ? "0" : "") + number;
}

//function to record steps
function stepsRecord(key) {
  if (
    (recording && key === "w") ||
    key === "a" ||
    key === "s" ||
    key === "d" ||
    key === "j" ||
    key === "k" ||
    key === "l"
  ) {
    const currentTime = new Date().getTime();
    if (steps.length === 0) {
      steps.push({ key, secs: 0 });
      lastClickTime = currentTime;
    } else {
      const gap = currentTime - lastClickTime;
      steps.push({ key, secs: gap });
      lastClickTime = currentTime;
      playTime += gap;
      const { minutes, seconds } = millisecondsToMinutesAndSeconds(playTime);
      console.log(`${minutes}min:${seconds}secs`);
    }
  }
}

//detects keyboard press
document.addEventListener("keydown", function (event) {
  let key = event.key.toLowerCase();
  if (recording) {
    stepsRecord(key);
  }
  makeSound(key);
  buttonAnimation(key);
});

function makeSound(key) {
  switch (key) {
    case "w":
      let tom1 = new Audio("sounds/tom-1.mp3").play();
      break;
    case "a":
      let tom2 = new Audio("sounds/tom-2.mp3").play();
      break;
    case "s":
      let tom3 = new Audio("sounds/tom-3.mp3").play();
      break;
    case "d":
      let tom4 = new Audio("sounds/tom-4.mp3").play();
      break;
    case "j":
      let snare = new Audio("sounds/snare.mp3").play();
      break;
    case "k":
      let crash = new Audio("sounds/crash.mp3").play();
      break;
    case "l":
      let kickbass = new Audio("sounds/kick-bass.mp3").play();
      break;
    default:
      break;
  }
}

function buttonAnimation(CurrentKey) {
  if (
    CurrentKey === "w" ||
    CurrentKey === "a" ||
    CurrentKey === "s" ||
    CurrentKey === "d" ||
    CurrentKey === "j" ||
    CurrentKey === "k" ||
    CurrentKey === "l"
  ) {
    let activeButton = document.querySelector("." + CurrentKey);

    activeButton.classList.add("pressed");

    setTimeout(() => {
      activeButton.classList.remove("pressed");
    }, 100);
  }
}
