let isSketchLoaded = false;
let sketchInstance;

function explanation_show_sketch(id)
{
    console.log(document.querySelectorAll("#unity-explanations > div"));
    document.querySelectorAll("#unity-explanations > div").forEach(e => e.hidden = true);
    document.getElementById(`${id}-expl`).hidden = false;
}

function setup_sketch()
{
    document.getElementById("sketch-home").addEventListener("click", _ => {
        sketchInstance.SendMessage('LevelLoader', 'LoadScene', 'Main');
        explanation_show_sketch("sketch-home");
    });
    document.getElementById("sketch-map-gen").addEventListener("click", _ => {
        sketchInstance.SendMessage('LevelLoader', 'LoadScene', 'MapGeneration');
        explanation_show_sketch("sketch-map-gen");
    });
    document.getElementById("sketch-fishing").addEventListener("click", _ => {
        sketchInstance.SendMessage('LevelLoader', 'LoadScene', 'Fishing');
        explanation_show_sketch("sketch-fishing");
    });
    document.getElementById("sketch-visual-novel").addEventListener("click", _ => {
        sketchInstance.SendMessage('LevelLoader', 'LoadScene', 'VN');
        explanation_show_sketch("sketch-visual-novel");
    });
    document.getElementById("sketch-trpg").addEventListener("click", _ => {
        sketchInstance.SendMessage('LevelLoader', 'LoadScene', 'TRPG');
        explanation_show_sketch("sketch-trpg");
    });
    document.getElementById("sketch-credits").addEventListener("click", _ => {
        sketchInstance.SendMessage('LevelLoader', 'LoadScene', 'Credits');
        explanation_show_sketch("sketch-credits");
    });
    document.getElementById("sketch-achievements").addEventListener("click", _ => {
        sketchInstance.SendMessage('LevelLoader', 'LoadScene', 'Achievements');
        explanation_show_sketch("sketch-achievements");
    });
}

function load_sketch() {
    // Don't load things twice
    if (isSketchLoaded) return;
    isSketchLoaded = true;

    const canvas = document.querySelector("#unity-canvas");
    const warningBanner = document.querySelector("#unity-warning");

    function unityShowBanner(msg, type) {
        function updateBannerVisibility() {
            warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        var div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.style = 'background: red; padding: 10px;';
        else {
            if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
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
        createUnityInstance(canvas, config, (_) => {
        }).then((unityInstance) => {
            sketchInstance = unityInstance;
            document.getElementById("unity-loading").hidden = true;
        }).catch((message) => {
            alert(message);
        });
    };
    
    document.body.appendChild(script);
}