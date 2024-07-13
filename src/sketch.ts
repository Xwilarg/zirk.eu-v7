let isSketchLoaded = false;
let sketchInstance;

function explanation_show_sketch(id: string): void {
    document.querySelectorAll("#unity-explanations div").forEach(e => (e as HTMLElement).hidden = true);
    document.getElementById(`${id}-expl`)!.hidden = false;
}

function setupSketchButton(data: HTMLElement): void {
    document.getElementById(data.id)!.addEventListener("click", _ => {
        sketchInstance.SendMessage('LevelLoader', 'LoadScene', data.dataset.scene);
        explanation_show_sketch(data.id);
    });
}

export function setupSketch(): void {
    for (let b of document.querySelectorAll("#unity-buttons > button")) {
        setupSketchButton(b as HTMLElement);
    }
}

export function loadSketch(): void {
    // Don't load things twice
    if (isSketchLoaded) return;
    isSketchLoaded = true;

    const canvas = document.querySelector("#unity-canvas");
    const warningBanner = document.querySelector("#unity-warning") as HTMLElement;

    function unityShowBanner(msg: string, type: string) {
        function updateBannerVisibility() {
            warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        var div = document.createElement('div') as HTMLElement;
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.setAttribute("style", "background: red; padding: 10px;");
        else {
            if (type == 'warning') div.setAttribute("style", "background: yellow; padding: 10px;");
            setTimeout(function () {
                warningBanner.removeChild(div);
                updateBannerVisibility();
            }, 5000);
        }
        updateBannerVisibility();
    }

    var buildUrl = "sketch";
    var loaderUrl = buildUrl + "/Sketch.loader.js";
    var config = {
        dataUrl: buildUrl + "/Sketch.data.unityweb",
        frameworkUrl: buildUrl + "/Sketch.framework.js.unityweb",
        codeUrl: buildUrl + "/Sketch.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "DefaultCompany",
        productName: "Sketch",
        productVersion: "1.0",
        showBanner: unityShowBanner,
    };

    const script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
        // @ts-ignore
        createUnityInstance(canvas, config, (_) => {
        }).then((unityInstance) => {
            sketchInstance = unityInstance;
            document.getElementById("unity-loading")!.hidden = true;
        }).catch((message) => {
            alert(message);
        });
    };

    document.body.appendChild(script);
}