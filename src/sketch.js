let isSketchLoaded = false;
let sketchInstance;

function setup_sketch()
{
    document.getElementById("sketch-map-gen").addEventListener("click", _ => {
        sketchInstance.SendMessage('LevelLoader', 'LoadScene', 'MapGeneration');
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
    var loaderUrl = buildUrl + "/WebGLBuild.loader.js";
    var config = {
        dataUrl: buildUrl + "/WebGLBuild.data.unityweb",
        frameworkUrl: buildUrl + "/WebGLBuild.framework.js.unityweb",
        codeUrl: buildUrl + "/WebGLBuild.wasm.unityweb",
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
        }).catch((message) => {
            alert(message);
        });
    };
    
    document.body.appendChild(script);
}