const width = 320;
const height = 180;
const aspect = width / height;

const gameElement = document.getElementById("game");

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
        elm.style.width = `${elm.getAttribute("width") * scale}px`;
        elm.style.height = `${elm.getAttribute("height") * scale}px`;
    }
    document.getElementById("base").style.left = `${16 * scale}px`;
};

const onWindowResize = () => {
    sizeGame();
};

addEventListener("resize", onWindowResize);

setImageDimensions();
sizeGame();