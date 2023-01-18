let hashTarget = null;

window.onload = function () {
    let linkReverse = {};

    // Link each link to where it should head
    for (let elem of document.getElementsByClassName("main-link")) {
        linkReverse[elem.dataset.target] = elem;
    }
    for (let elem of document.getElementsByClassName("main-link")) {
        const target = elem;
        elem.addEventListener("click", () => {
            displayTab(target.dataset.category, target.dataset.target);
        });
    }
    
    // Lead to right place depending of hash
    const urlParam = window.location.hash.toLowerCase().substring(1);

    if (urlParam in linkReverse)
    {
        let target = linkReverse[urlParam];
        if (target.dataset.dependency !== undefined) { // If a link is dependent of something else, we open it first
            var dep = linkReverse[target.dataset.dependency];
            displayTab(dep.dataset.category, dep.dataset.target);
        }
        displayTab(target.dataset.category, urlParam);
    }

    // Hover a gamejam image
    for (let elem of document.getElementsByClassName("gamejam")) {
        const img = elem.querySelector("img");
        elem.addEventListener("mouseover", e => { // Display the underlying GIF
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="; // Display an empty image so we don't have the "missing image" thing
            img.style.backgroundImage = `url(${img.dataset.src.substring(0, img.dataset.src.length - 4)}.gif)`;
        });
        elem.addEventListener("mouseout", _ => { // Display the image
            img.src = img.dataset.src;
            img.style.backgroundImage = "";
        });
    }

    // Link buttons that should show a YouTube embed
    for (let elem of document.getElementsByClassName("youtube-show")) {
        const target = elem;
        elem.addEventListener("click", _ => {
            const player = document.getElementById(`${target.dataset.target}-yt-player`);
            player.hidden = false;
            player.src = `https://www.youtube-nocookie.com/embed/${target.dataset.id}`;
        });
    }

    // Link project preview in the big list
    for (let p of document.getElementsByClassName("project-image-preview")) {
        p.addEventListener("mousedown", e => { // Show a project preview
            if (p.dataset.img === "" || document.getElementById("project-normal-preview-title").innerHTML === p.dataset.name) {
                document.getElementById("project-normal-preview").hidden = true;
            } else {
                document.getElementById("project-normal-preview-image").src = "";
                document.getElementById("project-normal-preview-title").innerHTML = p.dataset.name;
                document.getElementById("project-normal-preview-image").src = p.dataset.img;
                document.getElementById("project-normal-preview").hidden = false;
            }
            e.Handled = true;
        });
    }
    document.addEventListener("scroll", _ => {
        document.getElementById("project-normal-preview").hidden = true;
    });

    document.getElementById("new-cookie").addEventListener("click", _ => {
        let data;
        switch (Math.floor(Math.random() * 10))
        {
            case 0:
                data = Intl.DateTimeFormat().resolvedOptions().timeZone; // User timezone
                break;

            case 1:
                data = `${window.innerWidth}x${window.innerHeight}`; // Window dimentions
                break;

            case 2:
                data = `${navigator.oscpu}`; // Current OS
                break;

            case 3:
                data = `${navigator.userAgent}`; // Current user agent
                break;

            case 4:
                data = `${navigator.language}`; // Current language
                break;

            case 5:
                data = `${new Date()}`; // Current date
                break;

            case 6:
                data = `true`; // Is cheese tasty
                break;

            default:
                data = Math.floor(Math.random() * 100000); // We just store a random number because whatever
                break;
        }

        document.cookie = `ZIRK_${Math.floor(Math.random() * 100000)}=${data}; max-age=3600; path=/; SameSite=Strict`
    });

    rpg_init();
};