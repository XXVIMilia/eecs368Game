var canvas;
var ctx;

function load(){
    canvas = document.getElementById("GameView");
    ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "rgb(200,0,0)";

    for(var x = 0; x < 7; x++){
        for(var y = 0; y < 7; y++){
            ctx.fillRect(20+x*100,90+y*100,80,80);
        }
    }

    canvas.addEventListener("click",draw);
}

function getMousePos(e){
    var canvasRect = canvas.getBoundingClientRect();
    return{
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top
    }
}

function gridLookup(e){
    var pos = getMousePos(e);
    var xCoord = Math.trunc((pos.x-20)/100);
    var yCoord = Math.trunc((pos.y -90)/100);
    if(xCoord > 6){
        xCoord = 6;
    }
    else if(xCoord < 0){
        xCoord = 0;
    }

    if(yCoord > 6){
        yCoord = 6;
    }
    else if(yCoord < 0){
        yCoord = 0;
    }
    
    return({x:xCoord,y:yCoord})
}


function draw(e){
    var coord = gridLookup(e);
    alert(String(coord.x) + " " + String(coord.y));
}