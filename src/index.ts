import { displayTab } from "./tab"
import { setupSketch, loadSketch } from "./sketch"
import { setupGamejams } from "./sections/gamejam"

function setupButtons(): void {
    let linkReverse: { [id: string]: HTMLElement; } = {};

    // Link each link to where it should head
    for (let elem of document.getElementsByClassName("main-link")) {
        linkReverse[(elem as HTMLElement).dataset.target!.toLowerCase()] = elem as HTMLElement;
    }
    for (let elem of document.getElementsByClassName("main-link")) {
        const target = elem as HTMLElement;
        elem.addEventListener("click", () => {
            displayTab(target.dataset.category!, target.dataset.target!);
        });
    }

    // Lead to right place depending of hash
    const urlParam = window.location.hash.toLowerCase().substring(1);

    document.getElementById("sketch-data")!.addEventListener("click", _ => {
        loadSketch();
    });
    if (urlParam == "sketch") {
        loadSketch();
    }

    if (urlParam in linkReverse) {
        let target = linkReverse[urlParam];
        if (target.dataset.dependency !== undefined) { // If a link is dependent of something else, we open it first
            var dep = linkReverse[target.dataset.dependency];
            displayTab(dep.dataset.category!, dep.dataset.target!);
        }
        displayTab(target.dataset.category!, urlParam);
    }
}

function setupAbout(): void {
    // Link buttons that should show a YouTube embed
    for (let elem of document.getElementsByClassName("youtube-show")) {
        const target = elem as HTMLElement;
        elem.addEventListener("click", _ => {
            const player = document.getElementById(`${target.dataset.target}-yt-player`) as HTMLImageElement;
            player.hidden = false;
            player.src = `https://www.youtube-nocookie.com/embed/${target.dataset.id}`;
        });
    }
}

function setupProject(): void {
    // Link project preview in the big list
    for (let p of document.getElementsByClassName("project-image-preview")) {
        (p as HTMLElement).addEventListener("click", (e: MouseEvent) => { // Show a project preview
            if ((p as HTMLElement).dataset.img === "" || document.getElementById("project-normal-preview-title")!.innerHTML === (p as HTMLElement).dataset.name) {
                document.getElementById("project-normal-preview")!.hidden = true;
            } else {
                (document.getElementById("project-normal-preview-image") as HTMLImageElement).src = "";
                document.getElementById("project-normal-preview-title")!.innerHTML = (p as HTMLElement).dataset.name!;
                (document.getElementById("project-normal-preview-image") as HTMLImageElement).src = (p as HTMLElement).dataset.img!;
                document.getElementById("project-normal-preview")!.hidden = false;
            }
            e.preventDefault();
        });
    }
    document.addEventListener("scroll", _ => {
        document.getElementById("project-normal-preview")!.hidden = true;
    });
}

function setupFaq(): void {
    document.getElementById("new-cookie")!.addEventListener("click", _ => {
        let data;
        switch (Math.floor(Math.random() * 10)) {
            case 0:
                data = Intl.DateTimeFormat().resolvedOptions().timeZone; // User timezone
                break;

            case 1:
                data = `${window.innerWidth}x${window.innerHeight}`; // Window dimentions
                break;

            case 2:
                data = `${navigator.maxTouchPoints}`; // Number of fingers you can put at the same time
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

        document.cookie = `ZIRK_${Math.floor(Math.random() * 100000)}=${data}; max-age=3600; path=/; SameSite=Strict`;
        document.getElementById("faq-banner")!.innerHTML = `${new Date().toLocaleString()} - Cookie updated`;
    });
}

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        setupSketch();
        setupButtons();
    }
    else if (document.readyState == "complete") {
        setupGamejams();
        setupAbout();
        setupProject();
        setupFaq();
    }
};