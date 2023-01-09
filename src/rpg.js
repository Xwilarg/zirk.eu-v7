let rpgDiv;
let rpgInput;

let mentalHp = 20;

function rpg_init() {
    document.getElementById("rpg-enter").addEventListener("click", rpg_on_input);
    rpgInput = document.getElementById("rpg-input-field");
    rpgDiv = document.getElementById("rpg-output");

    rpg_write_narration("You open your eyes, everything around you is pitch black so you can't even see your hands.<br/>You try to look into your memories but can't remember anything.<br/>What do you do?");
}

function rpg_write_narration(text) {
    rpgDiv.innerHTML += `${text}<br/><br/>`;
    console.log(`${text}<br/><br/>`);
}

function decrease_hp() {
    mentalHp--;
    if (mentalHp % 5 === 0) {
        rpg_write_narration("You feel darkness consuming your soul a bit more");
    }
    if (mentalHp === 0) {
        rpg_write_narration("You lie down and curl up, trying to feel the last of hope you still have");
    }
}

function clear_input() {
    rpgInput.value = "";
    rpgDiv.scrollTop = rpgDiv.scrollHeight;
}

function rpg_on_input() {
    const text = rpgInput.value.toUpperCase();

    if (text === "")
    {
        return; // Empty input, we just ignore it
    }

    if (mentalHp === 0)
    {
        rpg_write_narration("There is no hope");
        clear_input();
        return;
    }

    rpgDiv.innerHTML += `<b>> ${text}</b><br/>`;

    switch (text)
    {
        case "WAIT":
            rpg_write_narration("You gaze into nothingness and count the seconds");
            decrease_hp();
            break;
        
        case "WALK":
            rpg_write_narration("You take a random direction and walk for a bit, you don't feel like anything changed around you");
            decrease_hp();
            break;

        case "HELP":
            rpg_write_narration("Possible actions:<br/>Help<br/>Wait<br/>Walk");
            break;

        default:
            rpg_write_narration("Unknown action, enter \"Help\" for the list of actions");
            break;
    }

    clear_input();
}

