const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const toolType = document.getElementById("toolType");
const shapeType = document.getElementById("shapeType");
const borderColorPicker = document.getElementById("borderColorPicker");
const bgColorPicker = document.getElementById("bgColorPicker");
const canvasContainer = document.getElementById("canvasContainer");

let drawing = false;
let startX, startY;
let history = [];
let redoStack = [];

canvas.addEventListener("mousedown", (event) => {
    drawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
    ctx.beginPath();
    saveState();
});

canvas.addEventListener("mouseup", (event) => {
    drawing = false;
    if (shapeType.value !== "free") {
        drawShape(event.offsetX, event.offsetY);
    }
});

canvas.addEventListener("mousemove", (event) => {
    if (!drawing || shapeType.value !== "free") return;

    ctx.lineWidth = getBrushSize();
    ctx.lineCap = "round";
    ctx.strokeStyle = colorPicker.value;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
});

function getBrushSize() {
    switch (toolType.value) {
        case "pencil": return brushSize.value;
        case "brush": return brushSize.value * 2;
        case "marker": return brushSize.value * 4;
        default: return brushSize.value;
    }
}

function drawShape(endX, endY) {
    ctx.lineWidth = getBrushSize();
    ctx.strokeStyle = colorPicker.value;
    ctx.beginPath();
    if (shapeType.value === "rectangle") {
        ctx.rect(startX, startY, endX - startX, endY - startY);
    } else if (shapeType.value === "circle") {
        let radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    } else if (shapeType.value === "line") {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
    }
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history = [];
    redoStack = [];
}

function saveState() {
    history.push(canvas.toDataURL());
    redoStack = [];
}

function undo() {
    if (history.length > 0) {
        redoStack.push(history.pop());
        let imgData = new Image();
        imgData.src = history.length > 0 ? history[history.length - 1] : "";
        imgData.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgData, 0, 0);
        };
    }
}

function redo() {
    if (redoStack.length > 0) {
        history.push(redoStack.pop());
        let imgData = new Image();
        imgData.src = history[history.length - 1];
        imgData.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgData, 0, 0);
        };
    }
}

borderColorPicker.addEventListener("input", function () {
    canvasContainer.style.borderColor = borderColorPicker.value;
});

bgColorPicker.addEventListener("input", function () {
    canvas.style.backgroundColor = bgColorPicker.value;
});
