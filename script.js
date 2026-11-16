const scenes = {
  entrance: {
    loop1: {
      text: "You push through the casino doors. Slot machines chime. The guard at the cashier cage glances at his watch, sighs, and mutters, \"Midnight can't come soon enough.\"",
      notesUpdate: "Guard keeps checking his watch.",
      choices: [
        { text: "1. Take the side entrance", next: "caught" },
        { text: "2. Fake an emergency", next: "caught" }
      ]
    },
    loop2: {
      text: "You've been here before. The slot machines chime the same tune, and the guard checks his watch right on cue. This time, you know what he's waiting for.",
      notesUpdate: null,
      choices: [
        { text: "1. Take the side entrance", next: "caught" },
        { text: "2. Wait until midnight", next: "victory" }
      ]
    }
  },
  caught: {
    loop1: {
      text: "A second guard, one you never saw, steps out from behind a pillar. \"Nice try.\" The lights flash red, and everything rewinds.",
      notesUpdate: "Guard keeps checking his watch. He leaves his post at midnight.",
      choices: [
        { text: "Try Again", next: "entrance" }
      ]
    },
    loop2: {
      text: "The second guard is waiting by the side door, as if he expected you. \"Again?\" he says. The lights flash red.",
      notesUpdate: null,
      choices: [
        { text: "Try Again", next: "entrance" }
      ]
    }
  },
  victory: {
    loop2: {
      text: "You lean against a slot machine until the clock strikes twelve. The guard checks his watch one last time and walks off to the break room. The cage is unattended. You slip in, grab the bag, and stroll out the front door.",
      notesUpdate: "Guard leaves at midnight. Plan worked.",
      choices: [
        { text: "Play Again", next: "entrance" }
      ]
    }
  }
};

let currentLoop = 1;
let currentScene = "entrance";
let notes = "";

function typewriterEffect(element, text, speed = 50) {
  element.textContent = "";
  let index = 0;

  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  type();
}

function updateNotes(newNote) {
  if (newNote) {
    notes = newNote;
  }
  document.getElementById("notes-text").textContent = notes || "(empty)";
}

function displayScene() {
  const scene = scenes[currentScene][`loop${currentLoop}`];
  const storyText = document.getElementById("story-text");
  const choicesDiv = document.getElementById("choices");

  // Remove win banner if it exists
  const existingBanner = document.getElementById("win-banner");
  if (existingBanner) {
    existingBanner.remove();
  }

  // Show win banner for victory scene
  if (currentScene === "victory") {
    const banner = document.createElement("div");
    banner.id = "win-banner";
    banner.textContent = "🎉 YOU ESCAPED! 🎉";
    document.getElementById("game-container").insertBefore(banner, storyText);
  }

  typewriterEffect(storyText, scene.text, 30);
  
  if (scene.notesUpdate) {
    updateNotes(scene.notesUpdate);
  }

  choicesDiv.innerHTML = "";
  choicesDiv.style.opacity = "0";

  setTimeout(() => {
    scene.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.textContent = choice.text;
      button.onclick = () => makeChoice(choice.next);
      choicesDiv.appendChild(button);
    });
    choicesDiv.style.opacity = "1";
  }, scene.text.length * 30 + 500);

  updateLoopCounter();
}

function makeChoice(nextScene) {
  if (nextScene === "entrance") {
    currentLoop++;
  }
  currentScene = nextScene;
  displayScene();
}

function updateLoopCounter() {
  document.getElementById("loop-counter").textContent = `Loop: ${currentLoop}`;
}

displayScene();