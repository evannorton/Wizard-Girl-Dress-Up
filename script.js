const width = 320;
const height = 180;
const aspect = width / height;

const gameElement = document.getElementById("game");

const sizeGame = () => {
    const scale = innerWidth / innerHeight > aspect ? innerHeight / height : innerWidth / width;
    gameElement.style.width = `${width * scale}px`;
    gameElement.style.height = `${height * scale}px`;
};

const onWindowResize = () => {
    sizeGame();
};

addEventListener("resize", onWindowResize);

sizeGame();