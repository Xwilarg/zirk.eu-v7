let hashTarget = null;

window.onload = function () {
    const urlParam = window.location.hash;

    displayTab('globalTab', urlParam.toLowerCase().substring(1));

    for (elem of document.getElementsByClassName("see-more")) {
        const target = elem;
        elem.addEventListener("click", () => {
            displayTab("globalTab", target.dataset.target);
        });
    }

    for (elem of document.getElementsByClassName("gamejam")) {
        const img = elem.querySelector("img");
        const imgName = img.src;
        elem.addEventListener("mouseover", _ => {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
            img.style.backgroundImage = `url(${imgName.substring(0, imgName.length - 4)}.gif)`;
        });
        elem.addEventListener("mouseout", _ => {
            img.src = imgName;
            img.style.backgroundImage = "";
        });
    }

    for (elem of document.getElementsByClassName("youtube-show")) {
        elem.addEventListener("click", e => {
            const player = document.getElementById("about-yt-player");
            player.hidden = false;
            player.src = `https://www.youtube-nocookie.com/embed/${e.target.dataset.id}?controls=0`;
        });
    }

    for (let e of document.getElementsByClassName("question")) {
        let children = e.children;
        children[0].addEventListener("click", () => {
            children[1].hidden = !children[1].hidden;
        });
    }

    for (let p of document.getElementsByClassName("project-image-preview")) {
        p.addEventListener("mouseover", _ => {
            document.getElementById("project-normal-preview-title").innerHTML = p.dataset.name;
            document.getElementById("project-normal-preview-image").src = p.dataset.img;
            document.getElementById("project-normal-preview").hidden = false;
        });
        p.addEventListener("mouseleave", _ => {
            document.getElementById("project-normal-preview").hidden = true;
        });
    }
};