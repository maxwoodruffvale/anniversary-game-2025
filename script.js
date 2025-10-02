import { handleEmojiMinigame } from './emojiquiz.js';
import { handleJigsawMinigame } from "./JigsawMinigame.js";
import { handleJWordSearchMinigame } from "./WordSearchGame.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let mapData = null;
let tilesetImg = new Image();
let interactables = [];

async function loadMap() {
    // Load JSON
    const response = await fetch("room.json");
    mapData = await response.json();

    // Set canvas size to map size
    canvas.width = mapData.width * mapData.tilewidth;
    canvas.height = mapData.height * mapData.tileheight;

    // Load tileset image
    tilesetImg.src = "tileset.png";
    tilesetImg.onload = () => {
    drawMap();
    extractInteractables();
    };
}

function drawMap() {
    const map = mapData;
    const tileset = map.tilesets[0];
    const tileWidth = map.tilewidth;
    const tileHeight = map.tileheight;
    const columns = Math.floor(tilesetImg.width / tileWidth);

    // Loop over each layer
    map.layers.forEach(layer => {
        if (!layer.visible) return;

        if (layer.type === "tilelayer") {
            // your existing tile drawing code
            for (let row = 0; row < layer.height; row++) {
                for (let col = 0; col < layer.width; col++) {
                    const tileIndex = row * layer.width + col;
                    const tileId = layer.data[tileIndex];
                    if (tileId === 0) continue;

                    const tileX = (tileId - 1) % columns;
                    const tileY = Math.floor((tileId - 1) / columns);

                    ctx.drawImage(
                        tilesetImg,
                        tileX * tileWidth, tileY * tileHeight,
                        tileWidth, tileHeight,
                        col * tileWidth, row * tileHeight,
                        tileWidth, tileHeight
                    );
                }
            }
        } 
        else if (layer.type === "objectgroup") {
            // Draw objects (as rectangles for now)
            layer.objects.forEach(obj => {
                if (!obj.gid) return; // skip objects without a tile

                const tileId = obj.gid;
                const tileX = (tileId - 1) % columns;
                const tileY = Math.floor((tileId - 1) / columns);

                ctx.drawImage(
                    tilesetImg,
                    tileX * tileWidth, tileY * tileHeight,
                    tileWidth, tileHeight,
                    obj.x, obj.y - tileHeight, // Tiled y is bottom-left for tile objects
                    tileWidth, tileHeight
                );
            });
        }
    });
}



function extractInteractables() {
    const objectLayer = mapData.layers.find(l => l.name === "Interactables");
    if (!objectLayer) return;

    interactables = objectLayer.objects.map(obj => ({
    name: obj.name,
    x: obj.x,
    y: obj.y,
    width: obj.width,
    height: obj.height
    }));

    console.log("Interactables:", interactables);
}

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

console.log("Click at:", x, y);

    for (let obj of interactables) {
    if (
        x >= obj.x &&
        x <= obj.x + obj.width &&
        y >= obj.y &&
        y <= obj.y + obj.height
    ) {
        console.log("Clicked:", obj.name);
        loadMinigame(obj.name);
    }
    }
});


function loadMinigame(interactableName) {
    console.log("Loading minigame for:", interactableName);
    switch (interactableName) {
    case "ComputerDesk":
        handleEmojiMinigame();
        break;
    case "WallPicture":
        handleJigsawMinigame();
        break;
    case "WallPosters":
        handleJWordSearchMinigame();
        break;
    default:
        alert("No minigame assigned for " + interactableName);
    }
}

loadMap();