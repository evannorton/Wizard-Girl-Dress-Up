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

const music = new Audio("./music.mp3");
music.loop = true;

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
const getBetweenIcons = () => Math.floor(.0525 * screenWidth);
const getIconsWidth = () => getSumOfNumbers(layers.map((layer) => getElmWidth(layer.iconElement))) + (layers.length - 1) * getBetweenIcons();
const getIconsXStart = () => getIconsRegionXStart() + Math.floor((getIconsRegionWidth() - getIconsWidth()) / 2);
const getComponentsXStart = () => getIconsXStart() - screenWidth / 24;
const getComponentsYStart = () => Math.floor(getOffset() + Math.floor(getBetweenIcons()));

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

const onWindowClick = () => {
    if (music.paused) {
        music.play();
    }
};

const onWindowKeydown = (e) => {
    if (music.paused) {
        music.play();
    }
    if (heldKeys.includes(e.key) === false) {
        switch (e.key) {
            case "ArrowLeft":
                selectRelativeBackground(-1);
                break;
            case "ArrowRight":
                selectRelativeBackground(1);
                break;
            case "M":
            case "m":
                music.muted = music.muted === false;
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
    layers[0].select();
    backgrounds[0].select();
    components[8].snap();
    components[9].snap();
    components[19].snap();
    components[28].snap();
    components[39].snap();
    addEventListener("resize", onWindowResize);
    addEventListener("click", onWindowClick);
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
        this.element.style.zIndex = null;
        render();
    }
    unsnap = () => {
        this.element.classList.remove("snapped");
        if (this.layer.componentsElement.classList.contains("selected") === false) {
            this.x = this.startX;
            this.y = this.startY;
        }
        const indices = [];
        componentPieces.forEach((componentPiece) => {
            if (componentPiece.component.slug === this.slug) {
                indices.push(componentPiece.zIndex);
            }
        });
        this.element.style.zIndex = Math.max(...indices);
        render();
    }
}

class ComponentPiece {
    constructor(slug, component, zIndex) {
        this.slug = slug;
        this.component = component;
        this.zIndex = zIndex;

        this.element = document.createElement("img");
        this.element.classList.add("component-piece");
        this.element.style.zIndex = zIndex;
        this.element.addEventListener("mousedown", this.component.onElementMousedown);
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

components.push(new Component("spats", layers[0], 108, 90, 22, 94));
components.push(new Component("sports-bra", layers[0], 36, 90, 27, 47));
components.push(new Component("corset", layers[0], 152, 20, 27, 61));
components.push(new Component("swimsuit", layers[0], 112, 8, 27, 47));
components.push(new Component("bikini-bottom", layers[0], 84, 56, 35, 100));
components.push(new Component("bikini-top", layers[0], 76, 8, 27, 47));
components.push(new Component("white-underwear", layers[0], 41, 56, 34, 97));
components.push(new Component("white-bra", layers[0], 35, 8, 27, 47));
components.push(new Component("black-underwear", layers[0], 0, 56, 34, 97));
components.push(new Component("black-bra", layers[0], -7, 8, 27, 47));
components.push(new Component("mask", layers[1], 164, 116, 38, 32));
components.push(new Component("eyepatch", layers[1], 112, 116, 35, 21));
components.push(new Component("glove", layers[1], 64, 100, 28, 112));
components.push(new Component("sunglasses", layers[1], 8, 116, 34, 25));
components.push(new Component("rugby-socks", layers[1], 96, 64, 0, 116));
components.push(new Component("stockings", layers[1], -4, 48, 0, 92));
components.push(new Component("school-socks", layers[1], 96, 40, 0, 120));
components.push(new Component("garter", layers[1], -4, 32, 0, 110));
components.push(new Component("short-socks", layers[1], 96, 16, 0, 120));
components.push(new Component("wizard-socks", layers[1], -4, 8, 0, 115));
components.push(new Component("flipflops", layers[2], 92, 108, -1, 118));
components.push(new Component("rollerskates", layers[2], -4, 88, 0, 116));
components.push(new Component("converses", layers[2], 94, 68, 0, 118));
components.push(new Component("boots", layers[2], -4, 48, 0, 116));
components.push(new Component("heels", layers[2], 96, 28, 0, 118));
components.push(new Component("school-shoes", layers[2], -4, 8, 0, 116));
components.push(new Component("yellow-shirt", layers[3], 142, 0, 27, 47));
components.push(new Component("overalls", layers[3], 122, 0, 7, 47));
components.push(new Component("wizard-dress", layers[3], 84, 4, 15, 46));
components.push(new Component("maid-outfit", layers[3], 42, 0, 14, 40));
components.push(new Component("gf-dress", layers[3], -4, 4, 15, 46));
components.push(new Component("sleeved-dress", layers[3], 126, 52, 15, 47));
components.push(new Component("belts-dress", layers[3], 90, 44, 14, 40));
components.push(new Component("kimono", layers[3], 44, 48, 14, 47));
components.push(new Component("long-skirt", layers[3], -6, 76, 7, 93));
components.push(new Component("uniform-shirt", layers[3], 15, 30, 27, 47));
components.push(new Component("peebs-hair", layers[4], 154, 0, 32, -7));
components.push(new Component("long-hair", layers[4], 112, 8, 30, 0));
components.push(new Component("belt-hat", layers[4], 40, 0, 7, -21));
components.push(new Component("wizard-hat", layers[4], -6, 0, 7, -33));
components.push(new Component("short-hair", layers[4], 148, 68, 30, 0));
components.push(new Component("gf-hair", layers[4], 96, 82, 26, 0));
components.push(new Component("ponytail", layers[4], 50, 86, 30, 0));
components.push(new Component("cowboy-hat", layers[4], -8, 60, 20, 0));

componentPieces.push(new ComponentPiece("spats-back", components[0], 1));
componentPieces.push(new ComponentPiece("spats-front", components[0], 5));
componentPieces.push(new ComponentPiece("sports-bra-back", components[1], 1));
componentPieces.push(new ComponentPiece("sports-bra-front", components[1], 5));
componentPieces.push(new ComponentPiece("corset-back", components[2], 1));
componentPieces.push(new ComponentPiece("corset-front", components[2], 5));
componentPieces.push(new ComponentPiece("swimsuit-back", components[3], 1));
componentPieces.push(new ComponentPiece("swimsuit-front", components[3], 5));
componentPieces.push(new ComponentPiece("bikini-bottom-back", components[4], 1));
componentPieces.push(new ComponentPiece("bikini-bottom-front", components[4], 5));
componentPieces.push(new ComponentPiece("bikini-top", components[5], 5));
componentPieces.push(new ComponentPiece("white-underwear-back", components[6], 1));
componentPieces.push(new ComponentPiece("white-underwear-front", components[6], 5));
componentPieces.push(new ComponentPiece("white-bra-back", components[7], 1));
componentPieces.push(new ComponentPiece("white-bra-front", components[7], 5));
componentPieces.push(new ComponentPiece("black-underwear-back", components[8], 1));
componentPieces.push(new ComponentPiece("black-underwear-front", components[8], 5));
componentPieces.push(new ComponentPiece("black-bra-back", components[9], 1));
componentPieces.push(new ComponentPiece("black-bra-front", components[9], 5));
componentPieces.push(new ComponentPiece("mask", components[10], 3));
componentPieces.push(new ComponentPiece("eyepatch", components[11], 3));
componentPieces.push(new ComponentPiece("glove", components[12], 3));
componentPieces.push(new ComponentPiece("sunglasses", components[13], 3));
componentPieces.push(new ComponentPiece("rugby-socks", components[14], 6));
componentPieces.push(new ComponentPiece("stockings-back", components[15], 1));
componentPieces.push(new ComponentPiece("stockings-front", components[15], 6));
componentPieces.push(new ComponentPiece("school-socks", components[16], 6));
componentPieces.push(new ComponentPiece("garter", components[17], 6));
componentPieces.push(new ComponentPiece("short-socks", components[18], 6));
componentPieces.push(new ComponentPiece("wizard-socks", components[19], 6));
componentPieces.push(new ComponentPiece("flipflops", components[20], 7));
componentPieces.push(new ComponentPiece("rollerskates", components[21], 7));
componentPieces.push(new ComponentPiece("converses", components[22], 7));
componentPieces.push(new ComponentPiece("boots", components[23], 7));
componentPieces.push(new ComponentPiece("heels", components[24], 7));
componentPieces.push(new ComponentPiece("school-shoes", components[25], 7));
componentPieces.push(new ComponentPiece("yellow-shirt-back", components[26], 1));
componentPieces.push(new ComponentPiece("yellow-shirt-front", components[26], 8));
componentPieces.push(new ComponentPiece("overalls-back", components[27], 1));
componentPieces.push(new ComponentPiece("overalls-front", components[27], 8));
componentPieces.push(new ComponentPiece("wizard-dress-back", components[28], 1));
componentPieces.push(new ComponentPiece("wizard-dress-front", components[28], 8));
componentPieces.push(new ComponentPiece("maid-outfit-back", components[29], 1));
componentPieces.push(new ComponentPiece("maid-outfit-front", components[29], 8));
componentPieces.push(new ComponentPiece("gf-dress-back", components[30], 1));
componentPieces.push(new ComponentPiece("gf-dress-front", components[30], 8));
componentPieces.push(new ComponentPiece("sleeved-dress-back", components[31], 1));
componentPieces.push(new ComponentPiece("sleeved-dress-front", components[31], 8));
componentPieces.push(new ComponentPiece("belts-dress-back", components[32], 1));
componentPieces.push(new ComponentPiece("belts-dress-front", components[32], 8));
componentPieces.push(new ComponentPiece("kimono-back", components[33], 1));
componentPieces.push(new ComponentPiece("kimono-front", components[33], 8));
componentPieces.push(new ComponentPiece("long-skirt-back", components[34], 1));
componentPieces.push(new ComponentPiece("long-skirt-front", components[34], 8));
componentPieces.push(new ComponentPiece("uniform-shirt-back", components[35], 1));
componentPieces.push(new ComponentPiece("uniform-shirt-front", components[35], 8));
componentPieces.push(new ComponentPiece("peebs-hair", components[36], 4));
componentPieces.push(new ComponentPiece("long-hair-back", components[37], 4));
componentPieces.push(new ComponentPiece("long-hair-front", components[37], 9));
componentPieces.push(new ComponentPiece("belt-hat-back", components[38], 4));
componentPieces.push(new ComponentPiece("belt-hat-front", components[38], 9));
componentPieces.push(new ComponentPiece("wizard-hat-back", components[39], 4));
componentPieces.push(new ComponentPiece("wizard-hat-front", components[39], 9));
componentPieces.push(new ComponentPiece("short-hair-back", components[40], 4));
componentPieces.push(new ComponentPiece("short-hair-front", components[40], 9));
componentPieces.push(new ComponentPiece("gf-hair-back", components[41], 4));
componentPieces.push(new ComponentPiece("gf-hair-front", components[41], 9));
componentPieces.push(new ComponentPiece("ponytail-back", components[42], 4));
componentPieces.push(new ComponentPiece("ponytail-front", components[42], 9));
componentPieces.push(new ComponentPiece("cowboy-hat", components[43], 9));

backgrounds.push(new Background("day"));
backgrounds.push(new Background("night"));
backgrounds.push(new Background("blompton"));