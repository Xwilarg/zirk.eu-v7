let rpgDiv;
let rpgInput;

function rpg_init() {
    document.getElementById("rpg-enter").addEventListener("click", rpg_on_input);
    rpgInput = document.getElementById("rpg-input-field");
    rpgDiv = document.getElementById("rpg-output");

    rpg_write_narration("You wake up in a dark room, you can't see nor remember anything. What do you do?");
}

function rpg_write_narration(text) {
    rpgDiv.innerHTML += `${text}<br/><br/>`;
    console.log(`${text}<br/><br/>`);
}

function rpg_on_input() {
    const text = rpgInput.value.toUpperCase();

    if (text === "")
    {
        return; // Empty input, we just ignore it
    }

    rpgDiv.innerHTML += `<b>> ${text}</b><br/>`;

    switch (text)
    {
        case "WAIT":
            rpg_write_narration("Nothing happens...");
            break;

        case "HELP":
            rpg_write_narration("Possible actions: Help, Wait");
            break;

        default:
            rpg_write_narration("Unknown action, enter \"Help\" for the list of actions");
            break;
    }

    rpgInput.value = "";
    rpgDiv.scrollTop = rpgDiv.scrollHeight;
}

