const screenWidth = 320;
const screenHeight = 180;
const aspectRatio = screenWidth / screenHeight;

const gameElement = document.getElementById("game");
const baseElement = document.getElementById("base");
const layerIconsElement = document.getElementById("layer-icons");

let scale = 1;

let loadedLayerIcons = 0;

const layers = [];

const layerIconImagesLoaded = () => loadedLayerIcons === layers.length;

const imagesLoaded = () => layerIconImagesLoaded();

const getPX = (px) => `${px * scale}px`;
const getElmWidth = (elm) => Number(elm.getAttribute("width"));
const getElmWidthPX = (elm) => getPX(getElmWidth(elm));
const getElmHeight = (elm) => Number(elm.getAttribute("height"));
const getElmHeightPX = (elm) => getPX(getElmHeight(elm));
const getSumOfNumbers = (numbers) => numbers.reduce((a, b) => a + b, 0);

const setImageDimensions = () => {
    for (const elm of document.getElementsByTagName("img")) {
        elm.width = elm.width;
        elm.height = elm.height;
    }
};

const sizeGame = () => {
    scale = innerWidth / innerHeight > aspectRatio ? innerHeight / screenHeight : innerWidth / screenWidth;
    gameElement.style.width = getPX(screenWidth);
    gameElement.style.height = getPX(screenHeight);
    for (const elm of document.getElementsByTagName("img")) {
        elm.style.width = getElmWidthPX(elm);
        elm.style.height = getElmHeightPX(elm);
    }
    const offset = Math.floor((screenHeight - getElmHeight(baseElement)) / 2);
    baseElement.style.left = getPX(offset);
    baseElement.style.top = getPX(offset);
    const iconsWidth = getSumOfNumbers(layers.map((layer) => getElmWidth(layer.iconElement))) + (layers.length - 1) * .025 * screenWidth;
    const iconsRegionXStart = offset * 2 + getElmWidth(baseElement);
    const iconsRegionXEnd = screenWidth - offset;
    const iconsRegionWidth = iconsRegionXEnd - iconsRegionXStart;
    const iconsXStart = iconsRegionXStart + Math.floor((iconsRegionWidth - iconsWidth) / 2);
    layers.forEach((layer, key) => {
        layer.iconElement.style.left = getPX(iconsXStart + key * (getElmWidth(layer.iconElement) + Math.floor(.025 * screenWidth)));
        layer.iconElement.style.top = getPX(offset);
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
        this.iconElement = document.createElement("img");
        this.iconElement.classList.add("layer-icon");
        this.iconElement.setAttribute("data-layer", slug);
        this.iconElement.addEventListener("click", this.onIconElementClick);
        this.iconElement.addEventListener("load", this.onIconElementLoad);
        this.iconElement.src = `./layer-icons/${slug}.png`;
        layerIconsElement.appendChild(this.iconElement);
    }
    onIconElementClick = () => {
        this.select()
    }
    onIconElementLoad = () => {
        loadedLayerIcons++;
        if (imagesLoaded()) {
            init();
        }
    }
    select = () => {
        layers.forEach((layer) => {
            if (layer.slug === this.slug) {
                layer.iconElement.classList.add("selected");
            }
            else {
                layer.iconElement.classList.remove("selected");
            }
        });
    }
}

layers.push(new Layer("layer1", 1));
layers.push(new Layer("layer2", 1));
layers.push(new Layer("layer3", 1));
layers.push(new Layer("layer4", 1));
layers.push(new Layer("layer5", 1));
layers.push(new Layer("layer6", 1));
layers[0].select();