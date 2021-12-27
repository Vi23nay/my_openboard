// this line gives you the tool to draw on the
    // rectangle build
    // by default -> color = black
    // tool.fillStyle = "green";
    // tool.fillRect(10, 30, 200, 200);
    
    // boundaries draw
    // tool.strokeStyle = "red";
    // tool.strokeRect(50, 50, 200, 200);
    // tool.fillStyle = "blue";
    // tool.fillRect(40, 30, 100, 100);


//drag and drop now working
stickyCont.addEventListener("mousedown", function(e){
        stickyiX = e.clientX - boardleft;
        stickyiY = e.clientY - boardTop;
        draggingMode = true;
    })
    stickyCont.addEventListener("mousemove", function(e){
        if(draggingMode == true){
            stickyfX = e.clientX;
            stickyfY = e.clientY;
            console.log(stickyfX,stickyfY);
            stickyCont.style.position = "absolute";
            stickyCont.style.left = stickyfX + "px";
            stickyCont.style.top = stickyfY + "px";
        }
    })
    stickyCont.addEventListener("mousemouseup", function(e){
        draggingMode = false;
    })