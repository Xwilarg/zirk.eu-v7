let hashTarget = null;

window.onload = function () {
    const urlParam = window.location.hash;

    displayTab('globalTab', urlParam.toLowerCase().substring(1));

    // Link each link to where it should head
    for (elem of document.getElementsByClassName("main-link")) {
        const target = elem;
        elem.addEventListener("click", () => {
            displayTab("globalTab", target.dataset.target);
        });
    }

    // Hover a gamejam image
    for (elem of document.getElementsByClassName("gamejam")) {
        const img = elem.querySelector("img");
        const imgName = img.src;
        elem.addEventListener("mouseover", _ => { // Display the underlying GIF
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="; // Display an empty image so we don't have the "missing image" thing
            img.style.backgroundImage = `url(${imgName.substring(0, imgName.length - 4)}.gif)`;
        });
        elem.addEventListener("mouseout", _ => { // Display the image
            img.src = imgName;
            img.style.backgroundImage = "";
        });
    }

    // Link buttons that should show a YouTube embed
    for (elem of document.getElementsByClassName("youtube-show")) {
        const target = elem;
        elem.addEventListener("click", _ => {
            const player = document.getElementById(`${target.dataset.target}-yt-player`);
            player.hidden = false;
            player.src = `https://www.youtube-nocookie.com/embed/${target.dataset.id}`;
        });
    }

    // Link button of the FAQ to show/hide the content related
    for (let e of document.getElementsByClassName("question")) {
        let children = e.children;
        children[0].addEventListener("click", () => {
            children[1].hidden = !children[1].hidden;
        });
    }

    // Link project preview in the big list
    for (let p of document.getElementsByClassName("project-image-preview")) {
        p.addEventListener("mouseover", _ => { // Show a project preview
            document.getElementById("project-normal-preview-title").innerHTML = p.dataset.name;
            document.getElementById("project-normal-preview-image").src = p.dataset.img;
            document.getElementById("project-normal-preview").hidden = false;
        });
        p.addEventListener("mousedown", _ => { // Hide a project preview
            document.getElementById("project-normal-preview").hidden = true;
        });
        p.addEventListener("mouseleave", _ => { // Alternative way to hide a project preview since mousedown isn't called on mobile
            document.getElementById("project-normal-preview").hidden = true;
        });
    }

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

        document.cookie = `ZIRK_${Math.floor(Math.random() * 100000)}=${data}; max-age=3600; path=/`
    });
};