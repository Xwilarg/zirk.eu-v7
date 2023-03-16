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
        p.addEventListener("click", e => { // Show a project preview
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

    function filter() {
        for (let game of document.querySelectorAll(".full-list .gamejam")) {
            let l = document.getElementById("filter-location");
            if (l.value !== "" && l.value !== game.dataset.location) {
                game.hidden = true;
                continue;
            }
            let d = document.getElementById("filter-duration");
            if (d.value !== "") {
                const s = d.value.split('-');
                const duration = parseInt(game.dataset.duration);
                if (duration < parseInt(s[0]) || duration > parseInt(s[1])) {
                    game.hidden = true;
                    continue;
                }
            }
            let en = document.getElementById("filter-entries");
            if (en.value !== "") {
                if (en.value === "-1") {
                    if (game.dataset.entries !== "-1") {
                        game.hidden = true;
                        continue;
                    }
                }
                const s = en.value.split('-');
                const entries = parseInt(game.dataset.entries);
                if (entries < parseInt(s[0]) || entries > parseInt(s[1])) {
                    game.hidden = true;
                    continue;
                }
            }
            let y = document.getElementById("filter-year");
            if (y.value !== "" && y.value !== game.dataset.year) {
                game.hidden = true;
                continue;
            }
            let e = document.getElementById("filter-engine");
            if (e.value !== "" && e.value !== game.dataset.engine) {
                game.hidden = true;
                continue;
            }
            let e2 = document.getElementById("filter-event");
            if (e2.value !== "" && e2.value !== game.dataset.event) {
                game.hidden = true;
                continue;
            }
            let lang = document.getElementById("filter-language");
            if (lang.value !== "" && !game.dataset.language.split(';').includes(lang.value)) {
                game.hidden = true;
                continue;
            }
            let pe = document.getElementById("filter-people");
            console.log(pe);
            if (pe.value !== "" && !game.dataset.team.split(';').includes(pe.value)) {
                game.hidden = true;
                continue;
            }
            game.hidden = false;
        }
    }

    document.getElementById("filter-location").addEventListener("change", _ => {
        filter();
    });

    document.getElementById("filter-duration").addEventListener("change", _ => {
        filter();
    });

    document.getElementById("filter-year").addEventListener("change", _ => {
        filter();
    });

    document.getElementById("filter-engine").addEventListener("change", _ => {
        filter();
    });

    document.getElementById("filter-event").addEventListener("change", _ => {
        filter();
    });

    document.getElementById("filter-entries").addEventListener("change", _ => {
        filter();
    });

    document.getElementById("filter-language").addEventListener("change", _ => {
        filter();
    });

    document.getElementById("filter-people").addEventListener("change", _ => {
        filter();
    });
};