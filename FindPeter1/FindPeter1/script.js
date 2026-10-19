// --------------------------------------------------
// GAME VARIABLES
// --------------------------------------------------

let currentScene = "house";
let health = 100;
let inventory = [];
let clues = [];
let neededHelp = false;
let couchSearches = 0;

// --------------------------------------------------
// SCENES
// --------------------------------------------------

const scenes = {
    house: {
        title: "Location 1 - The House",
        character: "You",
        image: "house-minecraft.png",
        caption: "Peter's bed is empty.",
        text: "You come home from school and call, 'Peter! I'm home!' The house is quiet. His bed is empty, his toy is on the floor, and his water bowl is half full. Dirt is beside the back door. Peter's leash is hanging nearby.",
        choices: [
            {
                text: "Search under the couch (-10 energy)",
                action: searchCouch
            },
            {
                text: "Inspect the dirt",
                action: function () {
                    collectClue("Dirt beside the back door");
                }
            },
            {
                text: "Pick up Peter's leash",
                action: function () {
                    pickUpItem("Peter's leash");
                }
            },
            {
                text: "Check the backyard",
                nextScene: "backyard"
            },
            {
                text: "Talk to your parent",
                nextScene: "parent"
            },
            {
                text: "Rest (+10 energy)",
                action: rest
            }
        ]
    },

    backyard: {
        title: "Location 2 - The Backyard",
        character: "You",
        image: "backyard-minecraft.png",
        caption: "The gate is open.",
        text: "You step outside. The backyard gate is open. Small paw prints lead toward the street. There is a gap under the gate, and some leaves have been pushed aside. Peter may have squeezed through here.",
        choices: [
            {
                text: "Inspect the gate",
                action: function () {
                    collectClue("The open gate and gap underneath");
                }
            },
            {
                text: "Inspect the paw prints",
                action: function () {
                    collectClue("Paw prints leading toward the street");
                }
            },
            {
                text: "Follow the trail to the street",
                nextScene: "street"
            },
            {
                text: "Return to the house",
                nextScene: "house"
            }
        ]
    },

    parent: {
        title: "Location 3 - Your Parent",
        character: "Parent",
        image: "parent-minecraft.png",
        caption: "Your parent offers to help.",
        text: "'Have you seen Peter?' you ask. Your parent looks surprised. 'I thought he was in the backyard.' You explain that the gate is open. 'I must not have closed it all the way. Take his leash and ask the neighbors.'",
        choices: [
            {
                text: "Take Peter's leash",
                action: function () {
                    pickUpItem("Peter's leash");
                }
            },
            {
                text: "Go to the backyard",
                nextScene: "backyard"
            },
            {
                text: "Return to the living room",
                nextScene: "house"
            },
            {
                text: "Ask your parent to help search",
                action: askForHelp
            }
        ]
    },

    street: {
        title: "Location 4 - The Street",
        character: "You",
        image: "street-minecraft.png",
        caption: "The trail continues along the sidewalk.",
        text: "Muddy paw prints continue down the sidewalk. You notice some brown fur caught on a bush. Your neighbor is standing outside. Farther down the street, you can see the small park.",
        choices: [
            {
                text: "Inspect the brown fur",
                action: function () {
                    collectClue("Brown fur caught on a bush");
                }
            },
            {
                text: "Talk to the neighbor",
                nextScene: "neighbor"
            },
            {
                text: "Go directly to the park",
                nextScene: "park"
            },
            {
                text: "Return to the backyard",
                nextScene: "backyard"
            }
        ]
    },

    neighbor: {
        title: "Location 5 - The Neighbor",
        character: "Neighbor",
        image: "neighbor-minecraft.png",
        caption: "Your neighbor points toward the park.",
        text: "'Have you seen my brown dog?' you ask. Your neighbor nods. 'Yes, about ten minutes ago. He was chasing a squirrel toward the park.' You thank your neighbor. Now you have a better idea of where Peter went.",
        choices: [
            {
                text: "Record the neighbor's information",
                action: function () {
                    collectClue(
                        "The neighbor saw Peter chase a squirrel toward the park"
                    );
                }
            },
            {
                text: "Go to the park",
                nextScene: "park"
            },
            {
                text: "Return to the street",
                nextScene: "street"
            }
        ]
    },

    park: {
        title: "Location 6 - The Small Park",
        character: "You and Peter",
        image: "park-minecraft.png",
        caption: "Peter is waiting under a tree.",
        text: "'Peter!' you call. A brown dog comes out from behind a bush. It is Peter! His tail starts wagging. A squirrel sits high in a nearby tree. Peter chased it here and stayed nearby instead of returning home.",
        choices: [
            {
                text: "Observe the squirrel",
                action: function () {
                    collectClue("A squirrel in the park tree");
                }
            },
            {
                text: "Bring Peter home",
                action: bringPeterHome
            },
            {
                text: "Call your parent for a leash",
                action: callParent
            }
        ]
    },

    home: {
        title: "Location 7 - Back Home",
        character: "Parent and Peter",
        image: "peter-minecraft.png",
        caption: "Peter is safe at home.",
        text: "'You found him!' your parent says. You explain what happened. Together, you close the backyard gate and block the gap. Peter drinks some water and lies down. 'You caused a lot of trouble today,' you tell him. He wags his tail.",
        choices: [
            {
                text: "Finish the story",
                action: finishStory
            }
        ]
    },

    goodEnding: {
        title: "Good Ending - Peter Comes Home",
        character: "THE END",
        image: "peter-minecraft.png",
        caption: "Careful observation helped you find Peter.",
        text: "You followed the clues carefully and solved the mystery. Peter chased a squirrel through the open gate and followed it to the park. Now he is safe, and the gate is secure.",
        choices: [
            {
                text: "Play again",
                action: restartGame
            }
        ]
    },

    luckyEnding: {
        title: "Lucky Search Ending",
        character: "THE END",
        image: "peter-minecraft.png",
        caption: "You found Peter with only a few clues.",
        text: "You found Peter without collecting many clues. Luckily, he was waiting at the park. After returning home, you noticed the gap in the gate and understood how he escaped.",
        choices: [
            {
                text: "Play again",
                action: restartGame
            }
        ]
    },

    helpEnding: {
        title: "Help Along the Way Ending",
        character: "THE END",
        image: "peter-minecraft.png",
        caption: "You and your parent brought Peter home.",
        text: "Your parent helped you find Peter or bring him home safely. You learned that asking for help can be useful when solving a problem. Peter is home, and the backyard gate is secure.",
        choices: [
            {
                text: "Play again",
                action: restartGame
            }
        ]
    }
};

// --------------------------------------------------
// HTML ELEMENTS
// --------------------------------------------------

const sceneTitle = document.getElementById("scene-title");
const sceneText = document.getElementById("scene-text");
const characterName = document.getElementById("character-name");
const sceneImage = document.getElementById("scene-image");
const sceneCaption = document.getElementById("scene-caption");
const choicesContainer = document.getElementById("choices-container");
const healthDisplay = document.getElementById("health-display");
const inventoryDisplay = document.getElementById("inventory-display");
const cluesDisplay = document.getElementById("clues-display");
const messageDisplay = document.getElementById("message-display");

// --------------------------------------------------
// UPDATE SCENES
// --------------------------------------------------

function updateScene(sceneName) {
    currentScene = sceneName;

    const scene = scenes[sceneName];

    sceneTitle.textContent = scene.title;
    sceneText.textContent = scene.text;
    characterName.textContent = scene.character;
    sceneImage.src = "images/" + scene.image;
    sceneImage.alt = scene.caption;
    sceneCaption.textContent = scene.caption;

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
// ENERGY
// --------------------------------------------------

function updateHealth(amount) {
    health += amount;

    if (health < 0) {
        health = 0;
    }

    if (health > 100) {
        health = 100;
    }

    healthDisplay.textContent = health;
}

function searchCouch() {
    if (health < 10) {
        messageDisplay.textContent =
            "You are tired. Rest before searching again.";
        return;
    }

    updateHealth(-10);
    couchSearches += 1;

    messageDisplay.textContent =
        "Peter is not under the couch. Try checking the back door.";

    if (couchSearches >= 3) {
        messageDisplay.textContent +=
            " You have checked here several times. Your parent may be able to help.";
    }
}

function rest() {
    updateHealth(10);

    messageDisplay.textContent =
        "You pause and catch your breath.";
}

// --------------------------------------------------
// INVENTORY
// --------------------------------------------------

function pickUpItem(itemName) {
    if (inventory.includes(itemName)) {
        messageDisplay.textContent =
            "You already have " + itemName + ".";
        return;
    }

    inventory.push(itemName);
    inventoryDisplay.textContent = inventory.join(", ");

    messageDisplay.textContent =
        "You picked up " + itemName + ".";
}

// --------------------------------------------------
// CLUES
// --------------------------------------------------

function collectClue(clue) {
    if (clues.includes(clue)) {
        messageDisplay.textContent =
            "You already recorded this clue.";
        return;
    }

    clues.push(clue);

    const listItem = document.createElement("li");
    listItem.textContent = clue;
    cluesDisplay.appendChild(listItem);

    messageDisplay.textContent = "Clue found: " + clue;
}

// --------------------------------------------------
// HELP
// --------------------------------------------------

function askForHelp() {
    neededHelp = true;

    if (!inventory.includes("Peter's leash")) {
        inventory.push("Peter's leash");
        inventoryDisplay.textContent = inventory.join(", ");
    }

    updateScene("street");

    messageDisplay.textContent =
        "Your parent joins you outside and suggests asking the neighbor.";
}

function callParent() {
    if (inventory.includes("Peter's leash")) {
        messageDisplay.textContent =
            "You already have the leash. You can bring Peter home.";
        return;
    }

    neededHelp = true;
    pickUpItem("Peter's leash");

    messageDisplay.textContent =
        "You stay with Peter while your parent brings his leash.";
}

// --------------------------------------------------
// CONDITIONAL AND ENDINGS
// --------------------------------------------------

function bringPeterHome() {
    if (inventory.includes("Peter's leash")) {
        updateScene("home");
    } else {
        messageDisplay.textContent =
            "You need a leash. Stay with Peter and call your parent to bring one.";
    }
}

function finishStory() {
    if (neededHelp) {
        updateScene("helpEnding");
    } else if (clues.length >= 3) {
        updateScene("goodEnding");
    } else {
        updateScene("luckyEnding");
    }
}

function restartGame() {
    health = 100;
    inventory = [];
    clues = [];
    neededHelp = false;
    couchSearches = 0;

    inventoryDisplay.textContent = "Empty";
    cluesDisplay.innerHTML = "";

    updateHealth(0);
    updateScene("house");
}

// --------------------------------------------------
// START GAME
// --------------------------------------------------

updateHealth(0);
updateScene(currentScene);