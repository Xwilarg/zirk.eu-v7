let rpgDiv;
let rpgInput;

let mentalHp = 20;

let current = "nowhere";

let actions = {
    "HELP": {
        "argCount": 0
    },
    "ITEMS": {
        "argCount": 0
    },
    "TOUCH": {
        "argCount": 1
    },
    "WAIT": {
        "argCount": 0
    },
    "WALK": {
        "argCount": 0
    }
};

let locations = {
    "nowhere": {
        "ITEMS": (_) => {
            rpg_write_narration("You feel your pockets but they are empty");
            decrease_hp();
            return true;
        },
        "TOUCH": (args) => {
            return true;
        },
        "WAIT": (_) => {
            rpg_write_narration("You gaze into nothingness and count the seconds");
            decrease_hp();
            return true;
        },
        "WALK": (_) => {
            rpg_write_narration("You take a random direction and walk for a bit, you don't feel like anything changed around you");
            decrease_hp();
            return true;
        }
    }
};

function rpg_init() {
    document.getElementById("rpg-enter").addEventListener("click", rpg_on_input);
    rpgInput = document.getElementById("rpg-input-field");
    rpgDiv = document.getElementById("rpg-output");

    rpg_write_narration("You open your eyes, everything around you is pitch black that you can't even see your hands.<br/>You try to look into your memories but can't remember anything.<br/>What do you do?");
}

function rpg_write_narration(text) {
    rpgDiv.innerHTML += `${text}<br/><br/>`;
}

function decrease_hp() {
    mentalHp--;
    if (mentalHp % 5 === 0) {
        rpg_write_narration("You feel darkness consuming your soul a bit more");
    }
    if (mentalHp === 0) {
        rpg_write_narration("You lie down, curl up and close your eyes, trying to feel the last of hope you still have inside you");
    }
}

function clear_input() {
    rpgInput.value = "";
    rpgDiv.scrollTop = rpgDiv.scrollHeight;
    rpgInput.focus();
}

function to_sentence_case(text) {
    return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
}

function rpg_on_input() {
    const text = rpgInput.value.toUpperCase().split(' ');
    const input = text[0];
    const args = text.slice(1);

    if (input === "")
    {
        return; // Empty input, we just ignore it
    }

    rpgDiv.innerHTML += `<b>> ${input}</b><br/>`;
    if (mentalHp === 0)
    {
        rpg_write_narration("There is no hope");
    }
    else if (!input in actions)
    {
        rpg_write_narration("Unknown action, enter \"Help\" for the list of actions");
    }
    else if (actions[input].argCount !== args.length)
    {
        rpg_write_narration(`${to_sentence_case(input)} takes ${actions[input].argCount} argument${(actions[input].argCount > 1 ? "s" : "")}`);
        return;
    }
    else
    {
        let choices = locations[current];
        if (!input in choices || !choices[input](args)) {
            switch (input)
            {
                case "ITEMS":
                    rpg_write_narration("You don't have anything");
                    break;

                case "HELP":
                    rpg_write_narration(`Possible actions:<br/>${Object.keys(actions).map(x => to_sentence_case(x)).join("<br/>")}`);
                    break;

                default:
                    rpg_write_narration("You can't do that here");
                    break;
            }
        }
    }

    clear_input();
}

