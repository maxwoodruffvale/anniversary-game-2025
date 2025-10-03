import { handleEmojiMinigame } from './emojiquiz.js';
import { handleJigsawMinigame } from "./JigsawMinigame.js";
import { handleJWordSearchMinigame } from "./WordSearchGame.js";
import { handleCaesarCipherMinigame } from "./CaesarCipher.js";
import { handleMouseHuntMinigame } from './mouseHuntingMinigame.js';
import { handleSoccerMinigame } from './rocketLeague.js';
import { handlePasswordMinigame } from './escapeDoor.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let mapData = null;
let tilesetImg = new Image();
let interactables = [];
let scale = 1; // <-- NEW
let scale_multiplier = 3.0; // Adjust this value to change zoom level
let offsetY = 600; // NEW: vertical offset

async function loadMap() {
    const response = await fetch("room.json");
    mapData = await response.json();

    // Compute scale so height fits window
    const mapPixelHeight = mapData.height * mapData.tileheight;
    scale = scale_multiplier * window.innerHeight / mapPixelHeight;
    const scaledMapHeight = mapPixelHeight * scale;

    // Set scaled canvas size
    canvas.width = mapData.width * mapData.tilewidth * scale;
    canvas.height = window.innerHeight;

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

    map.layers.forEach(layer => {
        if (!layer.visible) return;

        if (layer.type === "tilelayer") {
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
                        col * tileWidth * scale, 
                        row * tileHeight * scale - offsetY, // change
                        tileWidth * scale, tileHeight * scale
                    );
                }
            }
        } else if (layer.type === "objectgroup") {
            layer.objects.forEach(obj => {
                if (!obj.gid) return;

                const tileId = obj.gid;
                const tileX = (tileId - 1) % columns;
                const tileY = Math.floor((tileId - 1) / columns);

                ctx.drawImage(
                    tilesetImg,
                    tileX * tileWidth, tileY * tileHeight,
                    tileWidth, tileHeight,
                    obj.x * scale, 
                    (obj.y - tileHeight) * scale - offsetY, // change
                    tileWidth * scale, tileHeight * scale
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
        x: obj.x * scale,
        y: obj.y * scale - offsetY, // change
        width: obj.width * scale,
        height: obj.height * scale
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
        case "DeskLeft":
            handleCaesarCipherMinigame();
            break;
        case "DoorLeft":
            handleMouseHuntMinigame();
            break;
        case "TV":
            handleSoccerMinigame();
            break;
        case "DoorRight":
            handlePasswordMinigame();
            break;
        default:
            console.log("No minigame assigned for:", interactableName);
            break;
    }
}

loadMap();
