

optionContainer.addEventListener("click", function(e){
    let iconElem = optionContainer.children[0];
    //closing
    if(iconElem.classList.contains("fa-bars")){
        iconElem.classList.remove("fa-bars");
        iconElem.classList.add("fa-times");
        openTools();
    }
    //opening
    else if(iconElem.classList.contains("fa-times")){
        iconElem.classList.remove("fa-times");
        iconElem.classList.add("fa-bars")
        closeTools();
    }
})
pen.addEventListener("click", function(){
    penToolsFlag = !penToolsFlag;
    if(penToolsFlag == true){
        penTools.style.display = "block";
    }else{
        penTools.style.display = "none";
    }
})
eraser.addEventListener("click", function(){
    eraserToolFlag = !eraserToolFlag;
    if(eraserToolFlag == true){
        eraserTools.style.display = "block";
    }else{
        eraserTools.style.display = "none";
    }

})
penSize.addEventListener("change", function(e){
    let val = penSize.value;
    tool.lineWidth = val;
    penWidth = val;
})
eraserSize.addEventListener("change", function(e){
    let val = eraserSize.value * 4;
    tool.lineWidth = val;
    eraserWidth = val;
})
upload.addEventListener("click", function(e){
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    input.addEventListener("change", function(event){
        let file = input.files[0];
        let fileUrl = URL.createObjectURL(file);
        let stickyTemplateHTML = 
        `<div class="header">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-container true">
            <img src = "${fileUrl}"/>
        </div>`;

        createSticky(stickyTemplateHTML);
    })
})


sticky.addEventListener("click", function(e){
    // let stickyCont = document.createElement("div");
    // stickyCont.setAttribute("class", "sticky-container");
    
    let stickyTemplateHTML=
    `<div class="header">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-container true">
        <textarea></textarea>
    </div>`;
    createSticky(stickyTemplateHTML);

})
function createSticky(stickyTemplateHTML){
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-container");
    stickyCont.innerHTML=stickyTemplateHTML;
    body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(stickyCont, minimize, remove);

    stickyCont.onmousedown = function(e){
        cTool = "";
        dragAndDrop(stickyCont, e);
    }
    stickyCont.ondragstart = function() {
        return false;
    };
}
function noteActions(Stickyelement, minimize, remove){
    remove.addEventListener("click", function(e){
        Stickyelement.remove();
    })

    minimize.addEventListener("click", function(e){
        let notecont = Stickyelement.querySelector(".note-container");
        let display = getComputedStyle(notecont).getPropertyValue("display");
        if(display == "none"){
            notecont.style.display = "block";
        }else{
            notecont.style.display = "none";
        }
        /////2nd way

        // if(notecont.classList[1] == "true"){
        //     notecont.classList.remove("true");
        //     notecont.classList.add("false");
        //     notecont.style.display = "none";
        // }else if(notecont.classList[1] == "false"){
        //     notecont.classList.remove("false");
        //     notecont.classList.add("true");
        //     // notecont.classList[1] = "true"
        //     notecont.style.display = "block";
        // }

    })

}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + (16*3) + 'px';
        element.style.top = pageY - shiftY + (16*3) + 'px';
    }

    function onMouseMove(event) {
        // tool.strokeStyle = "white";
        drawingMode = false;
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        drawingMode = true;
        if(color != "white"){
            tool.strokeStyle = color;
        }else{
            tool.strokeStyle = "black";
        }
        tool.strokeStyle = color;
        element.onmouseup = null;
    };
}

download.addEventListener("click", function(){
    // console.log(canvasBoard.toDataURL());
    let data = canvasBoard.toDataURL();
    let a = document.createElement("a");
    a.download = "sketch.jpg";
    a.href = data;
    a.click();
    a.remove();

})
function openTools(){
    // iconPallet.style.display = "block";
    iconPallet.style.display = "flex";
}
function closeTools(){
    iconPallet.style.display = "none";
    eraserTools.style.display = "none";
    penTools.style.display = "none";

}
