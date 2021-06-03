const screenWidth = 384;
const screenHeight = 216;
const aspectRatio = screenWidth / screenHeight;

const gameElement = document.getElementById("game");
const backgroundsElement = document.getElementById("backgrounds");
const roomElement = document.getElementById("room");
const baseElement = document.getElementById("base");
const componentsBGElement = document.getElementById("components-bg");
const layersIconsElement = document.getElementById("layers-icons");
const layersComponentsElement = document.getElementById("layers-components");

const layers = [];
const components = [];
const componentPieces = [];
const backgrounds = [];

const heldKeys = [];

let loadedRoomImage = false;
let loadedBaseImage = false;
let loadedLayerIconImages = 0;
let loadedComponentImages = 0;
let loadedBackgroundSkyImages = 0;
let loadedBackgroundTreeImages = 0;

const roomImageLoaded = () => loadedRoomImage;
const baseImageLoaded = () => loadedBaseImage;
const layerIconImagesLoaded = () => loadedLayerIconImages === layers.length;
const componentImagesLoaded = () => loadedComponentImages === componentPieces.length;
const backgroundSkyImages = () => loadedBackgroundSkyImages === backgrounds.length;
const backgroundTreeImages = () => loadedBackgroundTreeImages === backgrounds.length;

const imagesLoaded = () => roomImageLoaded() && baseImageLoaded() && layerIconImagesLoaded() && componentImagesLoaded() && backgroundSkyImages() && backgroundTreeImages();

const getScale = () => innerWidth / innerHeight > aspectRatio ? innerHeight / screenHeight : innerWidth / screenWidth;
const getPX = (px) => `${px * getScale()}px`;
const getPXAmount = (px) => Number(px.replace("px", ""));
const getElmWidth = (elm) => Number(elm.getAttribute("width"));
const getElmWidthPX = (elm) => getPX(getElmWidth(elm));
const getElmHeight = (elm) => Number(elm.getAttribute("height"));
const getElmHeightPX = (elm) => getPX(getElmHeight(elm));
const getSumOfNumbers = (numbers) => numbers.reduce((a, b) => a + b, 0);
const getOffset = () => Math.floor((screenHeight - getElmHeight(baseElement)) / 2);
const getComponentsBGPadding = () => Math.floor(screenWidth / 48);
const getIconsRegionXStart = () => getOffset() * 2 + getElmWidth(baseElement);
const getIconsRegionXEnd = () => screenWidth - getOffset();
const getIconsRegionWidth = () => getIconsRegionXEnd() - getIconsRegionXStart();
const getBetweenIcons = () => Math.floor(.035 * screenWidth);
const getIconsWidth = () => getSumOfNumbers(layers.map((layer) => getElmWidth(layer.iconElement))) + (layers.length - 1) * getBetweenIcons();
const getIconsXStart = () => getIconsRegionXStart() + Math.floor((getIconsRegionWidth() - getIconsWidth()) / 2);
const getComponentsXStart = () => getIconsXStart();
const getComponentsYStart = () => Math.floor(getOffset() + getBetweenIcons() * 2.5);

const selectRelativeBackground = (position) => {
    const selectedIndex = backgrounds.findIndex((background) => background.containerElement.classList.contains("selected"));
    const sum = selectedIndex + position;
    const newIndex = sum < 0
        ? sum + backgrounds.length
        : sum >= backgrounds.length
            ? sum - backgrounds.length
            : sum;
    backgrounds[newIndex].select();
};

const render = () => {
    gameElement.style.width = getPX(screenWidth);
    gameElement.style.height = getPX(screenHeight);
    for (const elm of document.getElementsByTagName("img")) {
        elm.style.width = getElmWidthPX(elm);
        elm.style.height = getElmHeightPX(elm);
    }
    baseElement.style.left = getPX(getOffset() + 3);
    baseElement.style.top = getPX(getOffset() + 15);
    componentsBGElement.style.left = getPX(getIconsRegionXStart() - getComponentsBGPadding());
    componentsBGElement.style.top = getPX(getOffset() - getComponentsBGPadding());
    componentsBGElement.style.height = getPX(screenHeight - getOffset() * 2 + getComponentsBGPadding() * 2);
    componentsBGElement.style.width = getPX(getIconsRegionWidth() + getComponentsBGPadding() * 2);
    layers.forEach((layer, key) => {
        layer.iconElement.style.left = getPX(getIconsXStart() + key * (getElmWidth(layer.iconElement) + getBetweenIcons()));
        layer.iconElement.style.top = getPX(getOffset());
    });
    componentPieces.forEach((componentPiece) => {
        componentPiece.element.style.top = getPX(0);
        componentPiece.element.style.left = getPX(0);
        componentPiece.component.element.style.top = getPX(getComponentsYStart() + componentPiece.component.y);
        componentPiece.component.element.style.left = getPX(getComponentsXStart() + componentPiece.component.x);
        componentPiece.component.element.style.width = componentPiece.element.style.width;
        componentPiece.component.element.style.height = componentPiece.element.style.height;
    });
    backgrounds.forEach((background) => {
        background.cloudsElement.style.backgroundPosition = getPX(background.cloudsPosition);
    });
};

const onWindowResize = () => {
    render();
};

const onWindowKeydown = (e) => {
    if (heldKeys.includes(e.key) === false) {
        switch (e.key) {
            case "ArrowLeft":
                selectRelativeBackground(-1);
                break;
            case "ArrowRight":
                selectRelativeBackground(1);
                break;
        }
        heldKeys.push(e.key);
    }
};

const onWindowKeyup = (e) => {
    if (heldKeys.includes(e.key)) {
        heldKeys.splice(heldKeys.indexOf(e.key), 1);
    }
};

const init = () => {
    gameElement.classList.add("loaded");
    for (const elm of document.getElementsByTagName("img")) {
        elm.width = elm.width;
        elm.height = elm.height;
        elm.ondragstart = () => false;
    }
    render();
    components[0].snap();
    components[1].snap();
    components[2].snap();
    components[3].snap();
    addEventListener("resize", onWindowResize);
    addEventListener("keydown", onWindowKeydown);
    addEventListener("keyup", onWindowKeyup);
    setInterval(() => {
        backgrounds.forEach((background) => {
            background.moveClouds();
        });
        render();
    }, 500);
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
    constructor(slug, layer, startX, startY, snapX, snapY) {
        this.slug = slug;
        this.layer = layer;
        this.startX = startX;
        this.startY = startY;
        this.snapX = snapX;
        this.snapY = snapY;

        this.x = this.startX;
        this.y = this.startY;

        this.mousedownX = null;
        this.mousedownY = null;

        this.element = document.createElement("div");
        this.element.classList.add("component");
        this.element.addEventListener("mousedown", this.onElementMousedown);
        addEventListener("mouseup", this.onWindowMouseup);
        this.layer.componentsElement.appendChild(this.element);
    }
    onElementMousedown = (e) => {
        gameElement.classList.add("dragging");
        this.element.classList.add("selected");
        const gameX = e.clientX - gameElement.offsetLeft;
        const gameY = e.clientY - gameElement.offsetTop;
        this.x = Math.round(gameX / getScale()) - getComponentsXStart() - Math.round(this.getWidth() * (this.mousedownX / 100));
        this.y = Math.round(gameY / getScale()) - getComponentsYStart() - Math.round(this.getHeight() * (this.mousedownY / 100));
        this.mousedownX = e.offsetX / getPXAmount(this.element.style.width) * 100;
        this.mousedownY = e.offsetY / getPXAmount(this.element.style.height) * 100;
        this.layer.select();
        game.addEventListener("mousemove", this.onGameMousemove);
    };
    onGameMousemove = (e) => {
        const gameX = e.clientX - gameElement.offsetLeft;
        const gameY = e.clientY - gameElement.offsetTop;
        const newX = Math.round(gameX / getScale()) - getComponentsXStart() - Math.round(this.getWidth() * (this.mousedownX / 100));
        const newY = Math.round(gameY / getScale()) - getComponentsYStart() - Math.round(this.getHeight() * (this.mousedownY / 100));
        if (newX + getComponentsXStart() >= 0 && newY + getComponentsYStart() >= 0 && newX + getComponentsXStart() + this.getWidth() <= screenWidth && newY + getComponentsYStart() + this.getHeight() <= screenHeight) {
            this.x = newX;
            this.y = newY;
            render();
        }
    }
    getWidth = () => Math.round(getPXAmount(this.element.style.width) / getScale());
    getHeight = () => Math.round(getPXAmount(this.element.style.height) / getScale());
    getSnapTopDiff = () => Math.round((getPXAmount(this.element.style.top) - getPXAmount(baseElement.style.top)) / getScale()) - this.snapY;
    getSnapBottomDiff = () => Math.round((getPXAmount(this.element.style.left) - getPXAmount(baseElement.style.left)) / getScale()) - this.snapX;
    onWindowMouseup = () => {
        const topDiff = this.getSnapTopDiff();
        const leftDiff = this.getSnapBottomDiff();
        if (Math.abs(topDiff) < 32 && Math.abs(leftDiff) < 32) {
            this.snap();
        }
        else {
            this.unsnap();
        }
        gameElement.classList.remove("dragging");
        this.element.classList.remove("selected");
        game.removeEventListener("mousemove", this.onGameMousemove);
    }
    snap = () => {
        const topDiff = this.getSnapTopDiff();
        const leftDiff = this.getSnapBottomDiff();
        this.element.classList.add("snapped");
        this.x -= leftDiff;
        this.y -= topDiff;
        render();
    }
    unsnap = () => {
        this.element.classList.remove("snapped");
        if (this.layer.componentsElement.classList.contains("selected") === false) {
            this.x = this.startX;
            this.y = this.startY;
        }
        render();
    }
}

class ComponentPiece {
    constructor(slug, component, zIndex) {
        this.slug = slug;
        this.component = component;

        this.element = document.createElement("img");
        this.element.classList.add("component-piece");
        this.element.style.zIndex = zIndex;
        this.element.addEventListener("load", this.onElementLoad);
        this.element.src = `./component-images/${slug}.png`;
        this.component.element.appendChild(this.element);
    }
    onElementLoad = () => {
        loadedComponentImages++;
        initIfImagesLoaded();
    }
}

class Background {
    constructor(slug) {
        this.slug = slug;

        this.cloudsPosition = 0;

        this.containerElement = document.createElement("div");
        this.containerElement.classList.add("background");
        backgroundsElement.appendChild(this.containerElement);

        this.skyElement = document.createElement("img");
        this.containerElement.appendChild(this.skyElement);
        this.skyElement.addEventListener("load", this.onSkyElementLoad);
        this.skyElement.src = `./skies/${slug}.png`;

        this.cloudsElement = document.createElement("div");
        this.cloudsElement.classList.add("clouds");
        this.containerElement.appendChild(this.cloudsElement);
        this.cloudsElement.style.backgroundImage = `url(./clouds/${slug}.png)`;

        this.treesElement = document.createElement("img");
        this.containerElement.appendChild(this.treesElement);
        this.treesElement.addEventListener("load", this.onTreesElementLoad);
        this.treesElement.src = `./trees/${slug}.png`;
    }
    onSkyElementLoad = () => {
        loadedBackgroundSkyImages++;
        initIfImagesLoaded();
    }
    onTreesElementLoad = () => {
        loadedBackgroundTreeImages++;
        initIfImagesLoaded();
    }
    select = () => {
        backgrounds.forEach((background) => {
            if (background.slug === this.slug) {
                background.containerElement.classList.add("selected");
            }
            else {
                background.containerElement.classList.remove("selected");
            }
        });
    }
    moveClouds = () => {
        if (this.cloudsPosition === 0) {
            this.cloudsPosition = screenWidth - 1;
        }
        else {
            this.cloudsPosition--;
        }
    }
}

if (process.env.DEBUG === false) {
    const onWindowContextmenu = (e) => {
        e.preventDefault();
    };
    addEventListener("contextmenu", onWindowContextmenu);
}

const onRoomElementLoad = () => {
    loadedRoomImage = true;
    initIfImagesLoaded();
};
roomElement.addEventListener("load", onRoomElementLoad);
roomElement.src = "./room.png";

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

components.push(new Component("bra", layers[0], 0, 0, 27, 48));
components.push(new Component("underwear", layers[0], 0, 48, 36, 97));
components.push(new Component("dress", layers[1], 0, 0, 15, 46));
components.push(new Component("hair", layers[2], 0, 0, 30, 0));

componentPieces.push(new ComponentPiece("bra", components[0], 2));
componentPieces.push(new ComponentPiece("underwear", components[1], 2));
componentPieces.push(new ComponentPiece("dress", components[2], 2));
componentPieces.push(new ComponentPiece("hair-front", components[3], 3));
componentPieces.push(new ComponentPiece("hair-back", components[3], 1));

backgrounds.push(new Background("day"));
backgrounds.push(new Background("night"));
backgrounds.push(new Background("blompton"));

layers[0].select();
backgrounds[0].select();