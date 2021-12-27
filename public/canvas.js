let canvasBoard = document.querySelector("canvas");
let body = document.querySelector("body");
let rectangle = document.querySelector(".rectangle");
let pen = document.querySelector(".pen");
let sline = document.querySelector(".line");//straight line
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let download = document.querySelector(".download");
let boardTop = canvasBoard.getBoundingClientRect().top;// distance of canvas from top -> we need to subtract it from x
let boardleft = canvasBoard.getBoundingClientRect().left;
let colorContainer = document.querySelector(".pen-color-cont");
let optionContainer = document.querySelector(".options-container");
let iconPallet = document.querySelector(".icon-pallet");
let penTools = document.querySelector(".pen-tools");
let penSize = document.querySelector(".pen-size-cont .size");
let eraserSize = document.querySelector(".eraser-size");
let eraserTools = document.querySelector(".eraser-tool");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

//API
let tool = canvasBoard.getContext("2d");
let cTool = "pen";
let penToolsFlag = false;
let eraserToolFlag = false;
let eraserWidth = eraserSize.value * 4;
let penWidth = penSize.value;
let drawingMode = false;
let color = "black";
let undoRedoTracker = [];
let trackerPos = 0;
let iX, iY, fX, fY;

// default height and width is smaller
// canvasBoard.height = 550;
// canvasBoard.width = 700;
canvasBoard.height = window.innerHeight;
canvasBoard.width = window.innerWidth;
// canvasBoard.height = window.screen.height;
// canvasBoard.width = window.screen.width;
tool.fillStyle = "white";
tool.fillRect(0, 0, canvasBoard.width, canvasBoard.height);

sline.addEventListener("click", function(e){
    cTool = "sline";
    tool.lineWidth = penSize.value;
    twoWayColorBinding(color);
})

rectangle.addEventListener("click", function(e){
    cTool = "rectangle";
    tool.lineWidth = penSize.value;
    twoWayColorBinding(color);
})

pen.addEventListener("click", function(e){
    cTool = "pen";
    tool.lineWidth = penSize.value;
    twoWayColorBinding(color);
})

eraser.addEventListener("click", function(e){
    cTool = "eraser";
    tool.lineWidth = eraserSize.value;
    twoWayColorBinding(color);
})

canvasBoard.addEventListener("mousedown", function(e){
    // console.log(e);
    iX = e.clientX - boardleft;
    iY = e.clientY - boardTop;
})
canvasBoard.addEventListener("mouseup", function(e){
    // console.log(e);
    fX = e.clientX - boardleft;  
    fY = e.clientY - boardTop;
    // console.log(fX, fY);
    if(cTool == "sline"){
        // console.log("line");
        color == "white" ? color = "black" : color = color;
        // tool.strokeStyle = color;
        // tool.beginPath();
        // tool.moveTo(iX, iY);//mouseDown -> moveto
        // tool.lineTo(fX, fY);//mouseUp -> lineTo
        // tool.stroke();//visible -> UI
        // //for undo-redo operations
        let data = {
            ix : iX,
            iy : iY,
            fx : fX,
            fy : fY,
            color : color,
            width : penWidth
        }
        socket.emit("drawLine", data);//sending data to socket
        undoRedoAdder();
        // drawLine(data);
    }else if(cTool == "rectangle"){
        color == "white" ? color = "black" : color = color;
        // tool.strokeStyle = color;
        // let width = fX - iX;
        // let height = fY - iY;
        // tool.strokeRect(iX, iY, width, height);
        //for undo-redo operations
        let data = {
            xi : iX,
            yi : iY,
            rectWd : fX - iX,
            rectHt : fY - iY,
            color : color,
            width : penWidth
        }

        // drawRect(data);
        socket.emit("drawRect", data);
        undoRedoAdder();
    }
    
})

//--------------------------------------------------PENCIL DRAWING LOGIC------------------------------------------- 
canvasBoard.addEventListener("mousedown", function(e){
    if(cTool == "pen" || cTool == "eraser"){
        
        drawingMode = true;
        iX = e.clientX - boardleft;
        iY = e.clientY - boardTop;
        // tool.beginPath();
        // tool.moveTo(iX, iY);

        let data = {
            x : iX,
            y : iY
        }; 

        // startPath(data);    
        socket.emit("startPath", data);//sending data to socket
        
    }
})
canvasBoard.addEventListener("mousemove", function(e){
    if(cTool == "pen" && drawingMode == true){
        tool.strokeStyle = color;
        iX = e.clientX - boardleft;
        iY = e.clientY - boardTop;
        // tool.lineTo(iX, iY);
        // tool.stroke();
        let data  = {
            x : iX,
            y : iY,
            color : color,
            width : penWidth
        }
        // drawStroke(data);
        socket.emit("drawStroke", data);//sending data to socket
    }
    else if(cTool == "eraser" && drawingMode == true){
        tool.strokeStyle = "white";
        iX = e.clientX - boardleft;
        iY = e.clientY - boardTop;
        // tool.lineTo(iX, iY);
        // tool.stroke();    
        let data  = {
            x : iX,
            y : iY,
            color : "white",
            width : eraserWidth
        }
        // drawStroke(data);
        socket.emit("drawStroke", data);//sending data to socket
    }
})
canvasBoard.addEventListener("mouseup", function(e){
    drawingMode = false;
    //for undo-redo operations
    undoRedoAdder();
})

// changing of color
colorContainer.addEventListener("click", function(e){
    if(e.target != e.currentTarget){
        if(e.target.classList.contains("red")){
            color = "red";
            tool.strokeStyle = "red";
            twoWayColorBinding(color);
        }else if(e.target.classList.contains("lightgreen")){
            color = "lightgreen";
            tool.strokeStyle = "lightgreen";
            twoWayColorBinding(color);
        }else if(e.target.classList.contains("lightblue")){
            color = "lightblue";
            tool.strokeStyle = "lightblue";
            twoWayColorBinding(color);
        }else{
            color = "black";
            tool.strokeStyle = "black";
            twoWayColorBinding(color);
        }
    }
    
})
undo.addEventListener("click", function(e){
    // console.log(trackerPos);
    // console.log(undoRedoTracker.length);
    if(trackerPos > 0){
        trackerPos--;
    }

    let Cdata = {
        trackValue : trackerPos,
        undoRedoTracker
    }
    // createImage(Cdata);
    socket.emit("createImage", Cdata);
})
redo.addEventListener("click", function(e){
    // console.log(trackerPos);
    // console.log(undoRedoTracker.length);
    if(trackerPos < undoRedoTracker.length - 1){
        trackerPos++;
    }
    let Cdata = {
        trackValue : trackerPos,
        undoRedoTracker
    }
    // createImage(Cdata);
    socket.emit("createImage", Cdata);
})

function twoWayColorBinding(color){
    let colors = document.querySelectorAll(".color");
    for(let i = 0; i < colors.length; i++){
        colors[i].classList.remove("active");
    }
    for(let i = 0; i < colors.length; i++){
        if(colors[i].classList.contains(color)){
            colors[i].classList.add("active");
        }
    }
}
function undoRedoAdder(){
    trackerPos++;
    if (trackerPos < undoRedoTracker.length) { undoRedoTracker.length = trackerPos; }
    let url = canvasBoard.toDataURL();
    undoRedoTracker.push(url);
}

function createImage(dataObj){
    trackerPos = dataObj.trackValue;
    undoRedoTracker = dataObj.undoRedoTracker;
    let url = undoRedoTracker[trackerPos];

    let img = new Image();
    img.src = url;
    img.onload = function(e){
        tool.drawImage(img, 0, 0, canvasBoard.width, canvasBoard.height);
    }
}
// functions for realtime work
function startPath(data){
    tool.beginPath();
    tool.moveTo(data.x, data.y);
}
function drawStroke(data){
    tool.strokeStyle = data.color;
    tool.lineWidth = data.width;
    tool.lineTo(data.x, data.y);
    tool.stroke();
}
function drawLine(dataObj){
    tool.strokeStyle = dataObj.color;
    tool.lineWidth = dataObj.width;
    tool.beginPath();
    tool.moveTo(dataObj.ix, dataObj.iy);//mouseDown -> moveto
    tool.lineTo(dataObj.fx, dataObj.fy);//mouseUp -> lineTo
    tool.stroke();//visible -> UI
}
function drawRect(dataObj){
    tool.strokeStyle = dataObj.color;
    tool.lineWidth = dataObj.width;
    tool.strokeRect(dataObj.xi, dataObj.yi, dataObj.rectWd, dataObj.rectHt);
}
//receiver
socket.on("startPath", (data) => {
    //data -> data from server
    startPath(data);
})
socket.on("drawRect", (data) => {
    //data -> data from server
    drawRect(data);
})
socket.on("drawStroke", (data) => {
    drawStroke(data);
})
socket.on("createImage", (data) => {
    createImage(data);
})
socket.on("drawLine", (data) => {
    drawLine(data);
})