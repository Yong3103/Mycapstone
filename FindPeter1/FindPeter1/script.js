let currentScene = "house";

const scenes = {
  house: {
    title: "Location 1 The House",
    character: "You",
    text: "You come home from school and call, ‘Peter! I’m home!’ The house is quiet. His bed is empty, his toy is on the floor, and his water bowl is half full. Dirt is beside the back door. Peter’s leash is hanging nearby. Nobody seems to have taken him for a walk.",
    choices: [
      {text: "Search under the couch (-10 energy)", action: searchCouch},
      {text: "Inspect the dirt by the back door", nextScene: "dirt"},
      {
        text: "Pick up Peter's leash",
        action: function () { pickUpItem("Peter's leash"); }
      },
      {text: "Get ready to check the backyard", action: checkLeash},
      {text: "Rest (+10 energy)", action: rest}
    ]
  },
  dirt: {
    title: "Location 1 The House - Back Door",
    character: "You",
    text: "You kneel beside the back door. Small muddy paw prints lead outside. Through the window, you see that the backyard gate is open. Peter probably left through this door. You should take his leash before searching outside.",
    choices: [
      {
        text: "Take the leash beside the door",
        action: function () { pickUpItem("Peter's leash"); }
      },
      {text: "Get ready to check the backyard", action: checkLeash},
      {text: "Return to the living room", nextScene: "house"}
    ]
  }
};

// --------------------------------------------------
// HTML ELEMENTS
// These ids must match the elements in game.html.
// --------------------------------------------------
const sceneTitle = document.getElementById("scene-title");
const sceneText = document.getElementById("scene-text");
const choicesContainer = document.getElementById("choices-container");
const characterName = document.getElementById("character-name");
const healthDisplay = document.getElementById("health-display");
const inventoryDisplay = document.getElementById("inventory-display");
const messageDisplay = document.getElementById("message-display");

let health = 100;
let inventory = [];

// --------------------------------------------------
// UPDATE SCENES
// --------------------------------------------------
function updateScene(sceneName) {
  currentScene = sceneName;
  const scene = scenes[sceneName];
  sceneTitle.textContent = scene.title;
  sceneText.textContent = scene.text;
  characterName.textContent = scene.character;
  messageDisplay.textContent = "";
  choicesContainer.innerHTML = "";

  scene.choices.forEach(function (choice) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice.text;
    button.addEventListener("click", function () {
      messageDisplay.textContent = "";
      if (choice.action) {
        choice.action();
      }
      if (choice.nextScene) {
        updateScene(choice.nextScene);
      }
    });
    choicesContainer.appendChild(button);
    choicesContainer.appendChild(document.createElement("br"));
  });
}

// --------------------------------------------------
function updateHealth(amount) {
  health += amount;
  if (health < 0) { health = 0; }
  if (health > 100) { health = 100; }
  healthDisplay.textContent = health;
}

function searchCouch() {
  if (health < 10) {
    messageDisplay.textContent = "You are tired. Rest before searching again.";
  } else {
    updateHealth(-10);
    messageDisplay.textContent = "You look under the couch. Peter is not there. His toy is still on the floor. Try checking the dirt near the back door.";
  }
}

function rest() {
  updateHealth(10);
  messageDisplay.textContent = "You pause and catch your breath.";
}

// --------------------------------------------------
// INVENTORY
// --------------------------------------------------
function pickUpItem(itemName) {
  if (inventory.includes(itemName)) {
    messageDisplay.textContent = "You already have " + itemName + ".";
  } else {
    inventory.push(itemName);
    inventoryDisplay.textContent = inventory.join(", ");
    messageDisplay.textContent = "You picked up " + itemName + ".";
  }
}

// --------------------------------------------------
// CONDITIONAL - checks for the leash instead of a brass key.
// --------------------------------------------------
function checkLeash() {
  if (inventory.includes("Peter's leash")) {
    messageDisplay.textContent = "You have Peter's leash and are ready to search outside.";
  } else {
    messageDisplay.textContent = "Take Peter's leash from beside the back door first.";
  }
}

updateHealth(0);
updateScene(currentScene);
