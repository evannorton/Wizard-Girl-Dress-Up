const screenWidth = 384;
const screenHeight = 216;
const aspectRatio = screenWidth / screenHeight;

const gameElement = document.getElementById("game");
const baseElement = document.getElementById("base");
const layersIconsElement = document.getElementById("layers-icons");
const layersComponentsElement = document.getElementById("layers-components");

const layers = [];
const components = [];

let scale = 1;

let loadedBaseImage = false;
let loadedLayerIconImages = 0;
let loadedComponentImages = 0;

const baseImageLoaded = () => baseImageLoaded;
const layerIconImagesLoaded = () => loadedLayerIconImages === layers.length;
const componentImagesLoaded = () => loadedComponentImages === components.length;

const imagesLoaded = () => baseImageLoaded() && layerIconImagesLoaded() && componentImagesLoaded();

const getPX = (px) => `${px * scale}px`;
const getElmWidth = (elm) => Number(elm.getAttribute("width"));
const getElmWidthPX = (elm) => getPX(getElmWidth(elm));
const getElmHeight = (elm) => Number(elm.getAttribute("height"));
const getElmHeightPX = (elm) => getPX(getElmHeight(elm));
const getSumOfNumbers = (numbers) => numbers.reduce((a, b) => a + b, 0);

const render = () => {
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
    const betweenIcons = Math.floor(.025 * screenWidth);
    const iconsWidth = getSumOfNumbers(layers.map((layer) => getElmWidth(layer.iconElement))) + (layers.length - 1) * betweenIcons;
    const iconsRegionXStart = offset * 2 + getElmWidth(baseElement);
    const iconsRegionXEnd = screenWidth - offset;
    const iconsRegionWidth = iconsRegionXEnd - iconsRegionXStart;
    const iconsXStart = iconsRegionXStart + Math.floor((iconsRegionWidth - iconsWidth) / 2);
    layers.forEach((layer, key) => {
        layer.iconElement.style.left = getPX(iconsXStart + key * (getElmWidth(layer.iconElement) + betweenIcons));
        layer.iconElement.style.top = getPX(offset);
    });
    const componentsXStart = iconsXStart;
    const componentsYStart = Math.floor(offset + betweenIcons * 2.5);
    components.forEach((component) => {
        component.element.style.top = getPX(componentsYStart + component.y);
        component.element.style.left = getPX(componentsXStart + component.x);
    });
};

const onWindowResize = () => {
    render();
};

const init = () => {
    gameElement.classList.add("loaded");
    for (const elm of document.getElementsByTagName("img")) {
        elm.width = elm.width;
        elm.height = elm.height;
        elm.ondragstart = () => false;
    }
    render();
    addEventListener("resize", onWindowResize);
};

const initIfImagesLoaded = () => {
    if (imagesLoaded()) {
        init();
    }
};

class Layer {
    constructor(slug) {
        this.slug = slug;

        this.iconElement = document.createElement("img");
        layersIconsElement.appendChild(this.iconElement);
        this.iconElement.classList.add("layer-icon");
        this.iconElement.setAttribute("data-layer", slug);
        this.iconElement.addEventListener("click", this.onIconElementClick);
        this.iconElement.addEventListener("load", this.onIconElementLoad);
        this.iconElement.src = `./layers-icons/${slug}.png`;

        this.componentsElement = document.createElement("div");
        this.componentsElement.classList.add("layer-components");
        layersComponentsElement.appendChild(this.componentsElement);
    }
    onIconElementClick = () => {
        this.select()
    }
    onIconElementLoad = () => {
        loadedLayerIconImages++;
        initIfImagesLoaded();
    }
    select = () => {
        layers.forEach((layer) => {
            if (layer.slug === this.slug) {
                layer.iconElement.classList.add("selected");
                layer.componentsElement.classList.add("selected");
            }
            else {
                layer.iconElement.classList.remove("selected");
                layer.componentsElement.classList.remove("selected");
            }
        });
    }
}

class Component {
    constructor(slug, layer, x, y) {
        this.slug = slug;
        this.layer = layer;
        this.x = x;
        this.y = y;

        this.element = document.createElement("img");
        this.element.classList.add("component");
        this.element.addEventListener("load", this.onElementLoad);
        this.element.src = `./components/${slug}.png`;
        this.layer.componentsElement.appendChild(this.element);
    }
    onElementLoad = () => {
        loadedComponentImages++;
        initIfImagesLoaded();
    }
}

const onWindowContextmenu = (e) => {
    e.preventDefault();
};
addEventListener("contextmenu", onWindowContextmenu);

const onBaseElementLoad = () => {
    loadedBaseImage = true;
    initIfImagesLoaded();
};
baseElement.addEventListener("load", onBaseElementLoad);
baseElement.src = process.env.CENSORED ? "./base-censored.png" : "./base.png";

layers.push(new Layer("layer1"));
layers.push(new Layer("layer2"));
layers.push(new Layer("layer3"));
layers.push(new Layer("layer4"));
layers.push(new Layer("layer5"));
layers.push(new Layer("layer6"));

components.push(new Component("bra", layers[0], 0, 0));
components.push(new Component("underwear", layers[0], 0, 48));
components.push(new Component("dress", layers[1], 0, 0));
components.push(new Component("hair", layers[2], 0, 0));

layers[0].select();