const width = 320;
const height = 180;
const aspect = width / height;

const gameElement = document.getElementById("game");
const baseElement = document.getElementById("base");
const layerIconsElement = document.getElementById("layer-icons");

let loadedLayerIcons = 0;

const layers = [];

const layerIconImagesLoaded = () => loadedLayerIcons === layers.length;

const imagesLoaded = () => layerIconImagesLoaded();

const setImageDimensions = () => {
    for (const elm of document.getElementsByTagName("img")) {
        elm.width = elm.width;
        elm.height = elm.height;
    }
};

const sizeGame = () => {
    const scale = innerWidth / innerHeight > aspect ? innerHeight / height : innerWidth / width;
    gameElement.style.width = `${width * scale}px`;
    gameElement.style.height = `${height * scale}px`;
    for (const elm of document.getElementsByTagName("img")) {
        elm.style.width = `${Number(elm.getAttribute("width")) * scale}px`;
        elm.style.height = `${Number(elm.getAttribute("height")) * scale}px`;
    }
    const offset = Math.floor((height - Number(baseElement.getAttribute("height"))) / 2) * scale;
    baseElement.style.left = `${offset}px`;
    baseElement.style.top = `${offset}px`;
    [...layers].reverse().forEach((layer, key) => {
        const iconElement = document.querySelector(`.layer-icon[data-layer="${layer.slug}"]`);
        iconElement.style.top = `${offset}px`;
        const iconWidth = Number(iconElement.getAttribute("width"));
        console.log(iconWidth);
        iconElement.style.right = `${offset + key * (iconWidth + Math.floor(.025 * width)) * scale}px`;
    });
};

const onWindowResize = () => {
    sizeGame();
};

const init = () => {
    gameElement.classList.add("loaded");
    setImageDimensions();
    sizeGame();
    addEventListener("resize", onWindowResize);
};

class Layer {
    constructor(slug, zIndex) {
        this.slug = slug;
        this.zIndex = zIndex;
        const iconElement = document.createElement("img");
        iconElement.classList.add("layer-icon");
        iconElement.setAttribute("data-layer", slug);
        iconElement.onload = () => {
            loadedLayerIcons++;
            if (imagesLoaded()) {
                init();
            }
        };
        iconElement.src = `./layer-icons/${slug}.png`;
        layerIconsElement.appendChild(iconElement);
    }
}

layers.push(new Layer("layer1", 1));
layers.push(new Layer("layer2", 1));
layers.push(new Layer("layer3", 1));
layers.push(new Layer("layer4", 1));
layers.push(new Layer("layer5", 1));
layers.push(new Layer("layer6", 1));