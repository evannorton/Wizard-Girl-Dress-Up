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