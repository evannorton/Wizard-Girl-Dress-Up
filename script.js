const screenWidth = 384;
const screenHeight = 216;
const aspectRatio = screenWidth / screenHeight;

const retrommoFirst = Math.random() >= .5;

const gameElement = document.getElementById("game");
const topIconsElement = document.getElementById("top-icons");
const buttonsElement = document.getElementById("buttons");
const logoElement = document.getElementById("logo");
const creditsElement = document.getElementById("credits");
const retrommoLinkElement = document.getElementById("retrommo-link");
const thlurpLinkElement = document.getElementById("thlurp-link");
const settingsHeadingElement = document.getElementById("settings-heading");
const settingsVolumeElement = document.getElementById("settings-volume");
const settingsCensoredElement = document.getElementById("settings-censored");
const settingsBackgroundElement = document.getElementById("settings-background");
const settingsBackgroundsElement = document.getElementById("settings-backgrounds");
const backgroundsElement = document.getElementById("backgrounds");
const roomElement = document.getElementById("room");
const roomCodeElement = document.getElementById("room-code");
const roomCodeClickboxElement = document.getElementById("room-code-clickbox");
const baseElement = document.getElementById("base");
const componentsBGElement = document.getElementById("components-bg");
const layersIconsElement = document.getElementById("layers-icons");
const layersComponentsElement = document.getElementById("layers-components");

const music = new Audio("./music.mp3");
music.loop = true;

const topIcons = [];
const buttons = [];
const layers = [];
const components = [];
const componentPieces = [];
const backgrounds = [];

const heldKeys = [];

let loadedLogoImage = false;
let loadedCreditsImage = false;
let loadedRoomImage = false;
let loadedRoomCodeImage = false;
let loadedBaseImage = false;
let loadedSettingsHeadingImage = false;
let loadedSettingsVolumeImage = false;
let loadedSettingsCensoredImage = false;
let loadedSettingsBackgroundImage = false;
let loadedBackgroundIconImages = 0;
let loadedTopIconImages = 0;
let loadedButtonImages = 0;
let loadedLayerIconImages = 0;
let loadedLayerSelectedIconImages = 0;
let loadedComponentImages = 0;
let loadedBackgroundSkyImages = 0;
let loadedBackgroundTreeImages = 0;

let enteredSettingsFrom = "title";

const buttonImagesLoaded = () => loadedButtonImages === buttons.length * 2;
const logoImageLoaded = () => loadedLogoImage;
const creditsImageLoaded = () => loadedCreditsImage;
const roomImageLoaded = () => loadedRoomImage;
const roomCodeImageLoaded = () => loadedRoomCodeImage;
const baseImageLoaded = () => loadedBaseImage;
const settingsHeadingImageLoaded = () => loadedSettingsHeadingImage;
const settingsVolumeImageLoaded = () => loadedSettingsVolumeImage;
const settingsCensoredImageLoaded = () => loadedSettingsCensoredImage;
const settingsBackgroundImageLoaded = () => loadedSettingsBackgroundImage;
const backgroundIconImagesLoaded = () => loadedBackgroundIconImages === backgrounds.length;
const layerIconImagesLoaded = () => loadedLayerIconImages === layers.length;
const layerSelectedIconImagesLoaded = () => loadedLayerSelectedIconImages === layers.length;
const componentImagesLoaded = () => loadedComponentImages === componentPieces.length;
const backgroundSkyImagesLoaded = () => loadedBackgroundSkyImages === backgrounds.length;
const backgroundTreeImagesLoaded = () => loadedBackgroundTreeImages === backgrounds.length;
const topIconImagesLoaded = () => loadedTopIconImages === topIcons.length;

const imagesLoaded = () => buttonImagesLoaded() && logoImageLoaded() && creditsImageLoaded() && roomImageLoaded() && roomCodeImageLoaded() && baseImageLoaded() && settingsHeadingImageLoaded() && settingsVolumeImageLoaded() && settingsCensoredImageLoaded() && settingsBackgroundImageLoaded() && backgroundIconImagesLoaded() && layerIconImagesLoaded() && layerSelectedIconImagesLoaded() && componentImagesLoaded() && backgroundSkyImagesLoaded() && backgroundTreeImagesLoaded() && topIconImagesLoaded();

const getScale = () => Math.floor(innerWidth / innerHeight > aspectRatio ? innerHeight / screenHeight : innerWidth / screenWidth);
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
    logoElement.style.left = getPX(192);
    logoElement.style.top = getPX(26);
    creditsElement.style.left = getPX(175);
    creditsElement.style.top = getPX(130);
    const firstLinkElement = retrommoFirst ? retrommoLinkElement : thlurpLinkElement;
    const secondLinkElement = retrommoFirst ? thlurpLinkElement : retrommoLinkElement;
    const firstLinkWidth = retrommoFirst ? 47 : 29;
    const secondLinkWidth = retrommoFirst ? 29 : 47;
    firstLinkElement.style.top = getPX(130);
    firstLinkElement.style.left = getPX(235);
    firstLinkElement.style.width = getPX(firstLinkWidth);
    firstLinkElement.style.height = getPX(12);
    secondLinkElement.style.top = getPX(130);
    secondLinkElement.style.left = retrommoFirst ? getPX(308) : getPX(290);
    secondLinkElement.style.width = getPX(secondLinkWidth);
    secondLinkElement.style.height = getPX(12);
    settingsHeadingElement.style.top = getPX(32);
    settingsHeadingElement.style.left = getPX(168);
    settingsVolumeElement.style.top = getPX(72);
    settingsVolumeElement.style.left = getPX(168);
    settingsCensoredElement.style.top = getPX(112);
    settingsCensoredElement.style.left = getPX(168);
    settingsBackgroundElement.style.top = getPX(152);
    settingsBackgroundElement.style.left = getPX(168);
    const filteredTopIcons = topIcons.filter((icon) => icon.condition());
    topIcons.forEach((topIcon) => {
        topIcon.element.style.display = topIcon.condition() ? "block" : "none";
    });
    filteredTopIcons.forEach((topIcon, key) => {
        topIcon.element.style.top = getPX(12 - Math.floor(getElmHeight(topIcon.element) / 2));
        topIcon.element.style.left = getPX(4 + key * 4 + getSumOfNumbers(filteredTopIcons.slice(0, key).map((innerTopIcon) => getElmWidth(innerTopIcon.element))));
    });
    buttons.forEach((button) => {
        button.element.style.display = button.condition() ? "block" : "none";
        button.unpressedElement.style.top = getPX(0);
        button.unpressedElement.style.left = getPX(0);
        button.pressedElement.style.top = getPX(0);
        button.pressedElement.style.left = getPX(0);
        button.element.style.top = getPX(button.y);
        button.element.style.left = getPX(button.x);
        button.element.style.width = button.unpressedElement.style.width;
        button.element.style.height = button.pressedElement.style.height;
    });
    backgrounds.forEach((background) => {
        background.iconElement.style.display = background.containerElement.classList.contains("selected") ? "none" : "block";
    });
    backgrounds.filter((background) => background.containerElement.classList.contains("selected") === false).forEach((background, key) => {
        background.iconElement.style.top = getPX(166);
        background.iconElement.style.left = getPX(168 + key * 28);
    });
    roomCodeClickboxElement.style.left = getPX(362);
    roomCodeClickboxElement.style.top = getPX(173);
    roomCodeClickboxElement.style.width = getPX(18);
    roomCodeClickboxElement.style.height = getPX(15);
    baseElement.style.left = getPX(getOffset() + 3);
    baseElement.style.top = getPX(getOffset() + 15);
    componentsBGElement.style.left = getPX(getIconsRegionXStart() - getComponentsBGPadding());
    componentsBGElement.style.top = getPX(getOffset() - getComponentsBGPadding());
    componentsBGElement.style.height = getPX(screenHeight - getOffset() * 2 + getComponentsBGPadding() * 2);
    componentsBGElement.style.width = getPX(getIconsRegionWidth() + getComponentsBGPadding() * 2);
    layers.forEach((layer, key) => {
        layer.iconElement.style.left = getPX(getIconsXStart() + key * (getElmWidth(layer.iconElement) + getBetweenIcons()));
        layer.iconElement.style.top = getPX(getOffset());
        layer.selectedIconElement.style.left = getPX(getIconsXStart() + key * (getElmWidth(layer.selectedIconElement) + getBetweenIcons()));
        layer.selectedIconElement.style.top = getPX(getOffset());
    });
    componentPieces.forEach((componentPiece) => {
        componentPiece.element.style.top = getPX(0);
        componentPiece.element.style.left = getPX(0);
        componentPiece.component.element.style.top = getPX(getComponentsYStart() + componentPiece.component.y);
        componentPiece.component.element.style.left = getPX(getComponentsXStart() + componentPiece.component.x);
        componentPiece.component.element.style.width = componentPiece.element.style.width;
        componentPiece.component.element.style.height = componentPiece.element.style.height;
        componentPiece.component.innerElement.style.top = getPX(componentPiece.component.clickTop);
        componentPiece.component.innerElement.style.left = getPX(componentPiece.component.clickLeft);
        componentPiece.component.innerElement.style.width = getPX(getElmWidth(componentPiece.element) - componentPiece.component.clickLeft - componentPiece.component.clickRight);
        componentPiece.component.innerElement.style.height = getPX(getElmHeight(componentPiece.element) - componentPiece.component.clickTop - componentPiece.component.clickBottom);
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

const getDefaultComponents = () => [
    components[3],
    components[16],
    components[17],
    components[20],
    components[43]
];

const snapDefaultComponents = () => {
    getDefaultComponents().forEach((component) => {
        component.snap();
    });
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
    snapDefaultComponents();
    addEventListener("resize", onWindowResize);
    addEventListener("click", onWindowClick);
    addEventListener("keydown", onWindowKeydown);
    addEventListener("keyup", onWindowKeyup);
    const onRoomCodeClickboxElementClick = () => {
        roomCodeElement.classList.add("revealed");
        roomCodeClickboxElement.remove();
    };
    roomCodeClickboxElement.addEventListener("click", onRoomCodeClickboxElementClick);
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

class Button {
    constructor(slug, x, y, condition, onPress) {
        this.slug = slug;
        this.x = x;
        this.y = y;
        this.condition = condition;
        this.onPress = onPress;

        this.element = document.createElement("div");
        this.element.classList.add("button");

        this.unpressedElement = document.createElement("img");
        this.unpressedElement.classList.add("unpressed-button");
        this.unpressedElement.addEventListener("load", this.onImageElementLoad);
        this.unpressedElement.src = `./buttons/${slug}.png`;

        this.pressedElement = document.createElement("img");
        this.pressedElement.classList.add("pressed-button");
        this.pressedElement.addEventListener("load", this.onImageElementLoad);
        this.pressedElement.src = `./buttons/${slug}-pressed.png`;

        this.element.appendChild(this.unpressedElement);
        this.element.appendChild(this.pressedElement);
        buttonsElement.appendChild(this.element);

        this.element.addEventListener("mousedown", this.onElementMousedown)
        addEventListener("mouseup", this.onWindowMouseup)
    }
    onImageElementLoad = () => {
        loadedButtonImages++;
        initIfImagesLoaded();
    }
    onElementMousedown = () => {
        this.element.classList.add("pressed");
    }
    onWindowMouseup = () => {
        if (this.element.classList.contains("pressed") && this.condition()) {
            this.onPress();
            this.element.classList.remove("pressed");
        }
    }
}

class Layer {
    constructor(slug) {
        this.slug = slug;

        this.iconElement = document.createElement("img");
        layersIconsElement.appendChild(this.iconElement);
        this.iconElement.classList.add("layer-icon");
        this.iconElement.addEventListener("click", this.onIconElementClick);
        this.iconElement.addEventListener("load", this.onIconElementLoad);
        this.iconElement.src = `./layers-icons/${slug}.png`;

        this.selectedIconElement = document.createElement("img");
        layersIconsElement.appendChild(this.selectedIconElement);
        this.selectedIconElement.classList.add("layer-selected-icon");
        this.selectedIconElement.addEventListener("click", this.onSelectedIconElementClick);
        this.selectedIconElement.addEventListener("load", this.onSelectedIconElementLoad);
        this.selectedIconElement.src = `./layers-icons/${slug}-selected.png`;

        this.componentsElement = document.createElement("div");
        this.componentsElement.classList.add("layer-components");
        layersComponentsElement.appendChild(this.componentsElement);
    }
    onIconElementClick = () => {
        this.select();
    }
    onIconElementLoad = () => {
        loadedLayerIconImages++;
        initIfImagesLoaded();
    }
    onSelectedIconElementClick = () => {
        this.select();
    }
    onSelectedIconElementLoad = () => {
        loadedLayerSelectedIconImages++;
        initIfImagesLoaded();
    }
    select = () => {
        layers.forEach((layer) => {
            if (layer.slug === this.slug) {
                layer.iconElement.classList.add("selected");
                layer.selectedIconElement.classList.add("selected");
                layer.componentsElement.classList.add("selected");
            }
            else {
                layer.iconElement.classList.remove("selected");
                layer.selectedIconElement.classList.remove("selected");
                layer.componentsElement.classList.remove("selected");
            }
        });
    }
}

class Component {
    constructor(slug, layer, startX, startY, snapX, snapY, clickLeft, clickTop, clickRight, clickBottom) {
        this.slug = slug;
        this.layer = layer;
        this.startX = startX;
        this.startY = startY;
        this.snapX = snapX;
        this.snapY = snapY;
        this.clickLeft = clickLeft;
        this.clickTop = clickTop;
        this.clickRight = clickRight;
        this.clickBottom = clickBottom;

        this.x = this.startX;
        this.y = this.startY;

        this.mousedownX = null;
        this.mousedownY = null;

        this.element = document.createElement("div");
        this.element.classList.add("component");

        this.innerElement = document.createElement("div");
        this.innerElement.classList.add("component-inner");
        this.innerElement.addEventListener("mousedown", this.onInnerElementMousedown);

        this.element.appendChild(this.innerElement);
        this.layer.componentsElement.appendChild(this.element);

        addEventListener("mouseup", this.onWindowMouseup);
    }
    onInnerElementMousedown = (e) => {
        gameElement.classList.add("dragging");
        this.element.classList.add("selected");
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
        if (newX + getComponentsXStart() >= this.clickLeft && newY + getComponentsYStart() >= this.clickTop && newX + getComponentsXStart() + this.getWidth() - this.clickLeft <= screenWidth && newY + getComponentsYStart() + this.getHeight() - this.clickTop <= screenHeight) {
            this.x = newX - this.clickLeft;
            this.y = newY - this.clickTop;
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
        if (Number(this.innerElement.style.zIndex) - 100 > 0) {
            this.innerElement.style.zIndex = Number(this.innerElement.style.zIndex) - 100;
        }
        componentPieces.forEach((componentPiece) => {
            if (componentPiece.component.slug === this.slug) {
                componentPiece.element.style.zIndex = componentPiece.zIndex;
            }
        });
        render();
    }
    updateZIndices = () => {
        const indices = [];
        componentPieces.forEach((componentPiece) => {
            if (componentPiece.component.slug === this.slug) {
                indices.push(componentPiece.zIndex);
            }
        });
        this.element.style.zIndex = Math.max(...indices) + 100;
        this.innerElement.style.zIndex = Math.max(...indices) + 100;
    }
    unsnap = () => {
        this.element.classList.remove("snapped");
        if (this.layer.componentsElement.classList.contains("selected") === false) {
            this.x = this.startX;
            this.y = this.startY;
        }
        this.updateZIndices();
        componentPieces.forEach((componentPiece) => {
            if (componentPiece.component.slug === this.slug) {
                componentPiece.element.zIndex = componentPiece.zIndex + 100;
            }
        });
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
        this.element.style.zIndex = zIndex + 100;
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

        this.iconElement = document.createElement("img");
        this.iconElement.classList.add("background-icon")
        settingsBackgroundsElement.appendChild(this.iconElement);
        this.iconElement.addEventListener("load", this.onIconElementLoad);
        this.iconElement.src = `./background-icons/${slug}.png`;
        this.iconElement.addEventListener("click", this.onIconElementClick);
    }
    onIconElementLoad = () => {
        loadedBackgroundIconImages++;
        initIfImagesLoaded();
    }
    onSkyElementLoad = () => {
        loadedBackgroundSkyImages++;
        initIfImagesLoaded();
    }
    onTreesElementLoad = () => {
        loadedBackgroundTreeImages++;
        initIfImagesLoaded();
    }
    onIconElementClick = () => {
        this.select();
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

class TopIcon {
    constructor(slug, condition, onClick) {
        this.slug = slug;

        this.condition = condition;

        this.element = document.createElement("img");
        this.element.classList.add("top-icon");
        topIconsElement.appendChild(this.element);
        this.element.addEventListener("load", this.onElementLoad);
        this.element.src = `./top-icons/${slug}.png`;
        this.element.addEventListener("click", onClick);
    }

    onElementLoad = () => {
        loadedTopIconImages++;
        initIfImagesLoaded();
    }
}

if (process.env.DEBUG === false) {
    const onWindowContextmenu = (e) => {
        e.preventDefault();
    };
    addEventListener("contextmenu", onWindowContextmenu);
}

const onLogoElementLoad = () => {
    loadedLogoImage = true;
    initIfImagesLoaded();
};
logoElement.addEventListener("load", onLogoElementLoad);
logoElement.src = "./logo.png";

const onCreditsElementLoad = () => {
    loadedCreditsImage = true;
    initIfImagesLoaded();
};
creditsElement.addEventListener("load", onCreditsElementLoad);
creditsElement.src = retrommoFirst ? "./credits1.png" : "./credits2.png";

const onSettingsHeadingElementLoad = () => {
    loadedSettingsHeadingImage = true;
    initIfImagesLoaded();
}
settingsHeadingElement.addEventListener("load", onSettingsHeadingElementLoad);
settingsHeadingElement.src = "./settings-heading.png";
const onSettingsVolumeElementLoad = () => {
    loadedSettingsVolumeImage = true;
    initIfImagesLoaded();
}
settingsVolumeElement.addEventListener("load", onSettingsVolumeElementLoad);
settingsVolumeElement.src = "./settings-volume.png";
const onSettingsCensoredElementLoad = () => {
    loadedSettingsCensoredImage = true;
    initIfImagesLoaded();
}
settingsCensoredElement.addEventListener("load", onSettingsCensoredElementLoad);
settingsCensoredElement.src = "./settings-censored.png";
const onSettingsBackgroundElementLoad = () => {
    loadedSettingsBackgroundImage = true;
    initIfImagesLoaded();
}
settingsBackgroundElement.addEventListener("load", onSettingsBackgroundElementLoad);
settingsBackgroundElement.src = "./settings-background.png";


const onRoomElementLoad = () => {
    loadedRoomImage = true;
    initIfImagesLoaded();
};
roomElement.addEventListener("load", onRoomElementLoad);
roomElement.src = "./room.png";

const onRoomCodeElementLoad = () => {
    loadedRoomCodeImage = true;
    initIfImagesLoaded();
};
roomCodeElement.addEventListener("load", onRoomCodeElementLoad);
roomCodeElement.src = "./room-code.png";

const onBaseElementLoad = () => {
    loadedBaseImage = true;
    initIfImagesLoaded();
};
baseElement.addEventListener("load", onBaseElementLoad);
baseElement.src = process.env.CENSORED ? "./base-censored.png" : "./base.png";

buttons.push(new Button("play", 192, 147, () => gameElement.classList.contains("title"), () => {
    gameElement.classList.remove("title");
    gameElement.classList.add("dress-up");
}));
const openSettings = () => {
    enteredSettingsFrom = gameElement.classList.contains("dress-up") ? "dress-up" : "title";
    gameElement.classList.remove("title");
    gameElement.classList.remove("dress-up");
    gameElement.classList.add("settings");
};
const reset = () => {
    layers[0].select();
    components.forEach((component) => {
        component.unsnap();
        if (getDefaultComponents().every((innerComponent) => innerComponent.slug !== component.slug)) {
            component.x = component.startX;
            component.y = component.startY;
        }
    });
    snapDefaultComponents();
};
buttons.push(new Button("settings", 268, 147, () => gameElement.classList.contains("title"), openSettings));
buttons.push(new Button("reset", 167, 46, () => gameElement.classList.contains("settings"), reset));

layers.push(new Layer("hair"));
layers.push(new Layer("underwear"));
layers.push(new Layer("clothes"));
layers.push(new Layer("shoes"));
layers.push(new Layer("socks"));

components.push(new Component("peebs-hair", layers[0], 154, 0, 32, -7, 0, 0, 0, 40));
components.push(new Component("long-hair", layers[0], 112, 8, 30, 0, 0, 0, 0, 28));
components.push(new Component("belt-hat", layers[0], 40, 0, 7, -21, 0, 0, 0, 64));
components.push(new Component("wizard-hat", layers[0], -6, 0, 7, -33, 0, 0, 0, 40));
components.push(new Component("short-hair", layers[0], 148, 68, 30, 0, 0, 0, 0, 0));
components.push(new Component("gf-hair", layers[0], 96, 82, 26, 0, 0, 0, 0, 0));
components.push(new Component("ponytail", layers[0], 50, 86, 30, 0, 0, 0, 0, 0));
components.push(new Component("cowboy-hat", layers[0], -8, 60, 20, 0, 0, 0, 0, 0));
components.push(new Component("spats", layers[1], 108, 90, 22, 94, 0, 0, 0, 0));
components.push(new Component("sports-bra", layers[1], 36, 90, 27, 47, 0, 0, 0, 0));
components.push(new Component("corset", layers[1], 152, 20, 27, 61, 0, 0, 0, 0));
components.push(new Component("swimsuit", layers[1], 112, 8, 27, 47, 0, 0, 0, 0));
components.push(new Component("bikini-bottom", layers[1], 84, 56, 35, 100, 0, 0, 0, 0));
components.push(new Component("bikini-top", layers[1], 76, 8, 27, 47, 0, 0, 0, 0));
components.push(new Component("white-underwear", layers[1], 41, 56, 34, 97, 0, 0, 0, 0));
components.push(new Component("white-bra", layers[1], 35, 8, 27, 47, 0, 0, 0, 0));
components.push(new Component("black-underwear", layers[1], 0, 56, 34, 97, 0, 0, 0, 0));
components.push(new Component("black-bra", layers[1], -7, 8, 27, 47, 0, 0, 0, 0));
components.push(new Component("yellow-shirt", layers[2], 142, 0, 27, 47, 0, 0, 0, 0));
components.push(new Component("overalls", layers[2], 122, 0, 7, 47, 0, 0, 0, 0));
components.push(new Component("wizard-dress", layers[2], 84, 4, 15, 46, 0, 0, 0, 0));
components.push(new Component("maid-outfit", layers[2], 42, 0, 14, 40, 0, 0, 0, 0));
components.push(new Component("gf-dress", layers[2], -4, 4, 15, 46, 0, 0, 0, 0));
components.push(new Component("sleeved-dress", layers[2], 126, 52, 15, 47, 0, 0, 0, 0));
components.push(new Component("belts-dress", layers[2], 90, 44, 14, 40, 0, 0, 0, 0));
components.push(new Component("kimono", layers[2], 44, 48, 14, 47, 0, 0, 0, 0));
components.push(new Component("long-skirt", layers[2], -6, 76, 7, 93, 0, 0, 0, 0));
components.push(new Component("uniform-shirt", layers[2], 15, 30, 27, 47, 0, 0, 0, 0));
components.push(new Component("flipflops", layers[3], 92, 108, -1, 118, 0, 0, 0, 0));
components.push(new Component("rollerskates", layers[3], -4, 88, 0, 116, 0, 0, 0, 0));
components.push(new Component("converses", layers[3], 94, 68, 0, 118, 0, 0, 0, 0));
components.push(new Component("boots", layers[3], -4, 48, 0, 116, 0, 0, 0, 0));
components.push(new Component("heels", layers[3], 96, 28, 0, 118, 0, 0, 0, 0));
components.push(new Component("school-shoes", layers[3], -4, 8, 0, 116, 0, 0, 0, 0));
components.push(new Component("mask", layers[4], 164, 116, 38, 32, 0, 0, 0, 0));
components.push(new Component("eyepatch", layers[4], 112, 116, 35, 21, 0, 0, 0, 0));
components.push(new Component("glove", layers[4], 64, 100, 28, 112, 0, 0, 0, 0));
components.push(new Component("sunglasses", layers[4], 8, 116, 34, 25, 0, 0, 0, 0));
components.push(new Component("rugby-socks", layers[4], 96, 64, 0, 116, 0, 0, 0, 0));
components.push(new Component("stockings", layers[4], -4, 48, 0, 92, 0, 0, 0, 0));
components.push(new Component("school-socks", layers[4], 96, 40, 0, 120, 0, 0, 0, 0));
components.push(new Component("garter", layers[4], -4, 32, 0, 110, 0, 0, 0, 0));
components.push(new Component("short-socks", layers[4], 96, 16, 0, 120, 0, 0, 0, 0));
components.push(new Component("wizard-socks", layers[4], -4, 8, 0, 115, 0, 0, 0, 0));

componentPieces.push(new ComponentPiece("peebs-hair", components[0], 4));
componentPieces.push(new ComponentPiece("long-hair-back", components[1], 4));
componentPieces.push(new ComponentPiece("long-hair-front", components[1], 9));
componentPieces.push(new ComponentPiece("belt-hat-back", components[2], 4));
componentPieces.push(new ComponentPiece("belt-hat-front", components[2], 9));
componentPieces.push(new ComponentPiece("wizard-hat-back", components[3], 4));
componentPieces.push(new ComponentPiece("wizard-hat-front", components[3], 9));
componentPieces.push(new ComponentPiece("short-hair-back", components[4], 4));
componentPieces.push(new ComponentPiece("short-hair-front", components[4], 9));
componentPieces.push(new ComponentPiece("gf-hair-back", components[5], 4));
componentPieces.push(new ComponentPiece("gf-hair-front", components[5], 9));
componentPieces.push(new ComponentPiece("ponytail-back", components[6], 4));
componentPieces.push(new ComponentPiece("ponytail-front", components[6], 9));
componentPieces.push(new ComponentPiece("cowboy-hat", components[7], 9));
componentPieces.push(new ComponentPiece("spats-back", components[8], 1));
componentPieces.push(new ComponentPiece("spats-front", components[8], 5));
componentPieces.push(new ComponentPiece("sports-bra-back", components[9], 1));
componentPieces.push(new ComponentPiece("sports-bra-front", components[9], 5));
componentPieces.push(new ComponentPiece("corset-back", components[10], 1));
componentPieces.push(new ComponentPiece("corset-front", components[10], 5));
componentPieces.push(new ComponentPiece("swimsuit-back", components[11], 1));
componentPieces.push(new ComponentPiece("swimsuit-front", components[11], 5));
componentPieces.push(new ComponentPiece("bikini-bottom-back", components[12], 1));
componentPieces.push(new ComponentPiece("bikini-bottom-front", components[12], 5));
componentPieces.push(new ComponentPiece("bikini-top", components[13], 5));
componentPieces.push(new ComponentPiece("white-underwear-back", components[14], 1));
componentPieces.push(new ComponentPiece("white-underwear-front", components[14], 5));
componentPieces.push(new ComponentPiece("white-bra-back", components[15], 1));
componentPieces.push(new ComponentPiece("white-bra-front", components[15], 5));
componentPieces.push(new ComponentPiece("black-underwear-back", components[16], 1));
componentPieces.push(new ComponentPiece("black-underwear-front", components[16], 5));
componentPieces.push(new ComponentPiece("black-bra-back", components[17], 1));
componentPieces.push(new ComponentPiece("black-bra-front", components[17], 5));
componentPieces.push(new ComponentPiece("yellow-shirt-back", components[18], 1));
componentPieces.push(new ComponentPiece("yellow-shirt-front", components[18], 8));
componentPieces.push(new ComponentPiece("overalls-back", components[19], 1));
componentPieces.push(new ComponentPiece("overalls-front", components[19], 8));
componentPieces.push(new ComponentPiece("wizard-dress-back", components[20], 1));
componentPieces.push(new ComponentPiece("wizard-dress-front", components[20], 8));
componentPieces.push(new ComponentPiece("maid-outfit-back", components[21], 1));
componentPieces.push(new ComponentPiece("maid-outfit-front", components[21], 8));
componentPieces.push(new ComponentPiece("gf-dress-back", components[22], 1));
componentPieces.push(new ComponentPiece("gf-dress-front", components[22], 8));
componentPieces.push(new ComponentPiece("sleeved-dress-back", components[23], 1));
componentPieces.push(new ComponentPiece("sleeved-dress-front", components[23], 8));
componentPieces.push(new ComponentPiece("belts-dress-back", components[24], 1));
componentPieces.push(new ComponentPiece("belts-dress-front", components[24], 8));
componentPieces.push(new ComponentPiece("kimono-back", components[25], 1));
componentPieces.push(new ComponentPiece("kimono-front", components[25], 8));
componentPieces.push(new ComponentPiece("long-skirt-back", components[26], 1));
componentPieces.push(new ComponentPiece("long-skirt-front", components[26], 8));
componentPieces.push(new ComponentPiece("uniform-shirt-back", components[27], 1));
componentPieces.push(new ComponentPiece("uniform-shirt-front", components[27], 8));
componentPieces.push(new ComponentPiece("flipflops", components[28], 7));
componentPieces.push(new ComponentPiece("rollerskates", components[29], 7));
componentPieces.push(new ComponentPiece("converses", components[30], 7));
componentPieces.push(new ComponentPiece("boots", components[31], 7));
componentPieces.push(new ComponentPiece("heels", components[32], 7));
componentPieces.push(new ComponentPiece("school-shoes", components[33], 7));
componentPieces.push(new ComponentPiece("mask", components[34], 3));
componentPieces.push(new ComponentPiece("eyepatch", components[35], 3));
componentPieces.push(new ComponentPiece("glove", components[36], 10));
componentPieces.push(new ComponentPiece("sunglasses", components[37], 3));
componentPieces.push(new ComponentPiece("rugby-socks", components[38], 6));
componentPieces.push(new ComponentPiece("stockings-back", components[39], 1));
componentPieces.push(new ComponentPiece("stockings-front", components[39], 6));
componentPieces.push(new ComponentPiece("school-socks", components[40], 6));
componentPieces.push(new ComponentPiece("garter", components[41], 6));
componentPieces.push(new ComponentPiece("short-socks", components[42], 6));
componentPieces.push(new ComponentPiece("wizard-socks", components[43], 6));

backgrounds.push(new Background("day"));
backgrounds.push(new Background("night"));
backgrounds.push(new Background("blompton"));

topIcons.push(new TopIcon("home", () => gameElement.classList.contains("title") === false, () => {
    gameElement.classList.remove("dress-up");
    gameElement.classList.remove("settings");
    gameElement.classList.add("title");
    reset();
}));
topIcons.push(new TopIcon("settings", () => gameElement.classList.contains("settings") === false, openSettings));
topIcons.push(new TopIcon("muted", () => music.muted, () => { music.muted = false; }));
topIcons.push(new TopIcon("unmuted", () => music.muted === false, () => { music.muted = true; }));

components.forEach((component) => { component.updateZIndices(); });