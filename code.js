var canvas;
var ctx;

var boardState = [];
var activePieces = [];
var fallingPieces = [];

var turn = "p1"

function load(){
    for(var a = 0;a<7;a++){
        boardState.push([]);
        for(var b = 0; b<7;b++){
            boardState[a].push([]);
            boardState[a][b] = "empty"
        }
    }
    canvas = document.getElementById("GameView");
    ctx = canvas.getContext("2d");
    
    canvas.addEventListener("click",draw);
    window.requestAnimationFrame(update);
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


function winCheck(coord){
    alert("hjhkhk")
}





function dropPieces(){
    var ind_to_remove = [];
    for(var x = 0; x < fallingPieces.length; x++){
        var fallCheck = fallingPieces[x][0].coordinate.y + 1;
        if(fallCheck > 6){
            ind_to_remove.push(x);
        }
        else if(boardState[fallingPieces[x][0].coordinate.x][fallCheck] != "empty"){
            ind_to_remove.push(x);
        }
        else{
            boardState[fallingPieces[x][0].coordinate.x][fallingPieces[x][0].coordinate.y] = "empty";
            boardState[fallingPieces[x][0].coordinate.x][fallCheck] = "filled";
            activePieces[fallingPieces[x][1]].coordinate.y++;
        }
    }

    for(var i = fallingPieces.length-1; i >=0;i-- ){
        for(var j = 0; j < ind_to_remove.length;j++){
            if(ind_to_remove[j] == i){
                fallingPieces.splice(i,1);
            }
        }
    }

    

    

}


function update(){
    

    ctx.clearRect(0, 0, 720, 800);

    

    for(var x = 0; x < 7; x++){
        for(var y = 0; y < 7; y++){
            ctx.strokeRect(20+x*100,90+y*100,80,80);
        }
    }


    for(var a = 0;a < activePieces.length;a++){
        if(activePieces[a].player == "p1"){
            ctx.fillStyle = "rgb(0,200,0)";
        }
        else{
            ctx.fillStyle = "rgb(200,0,0)";
        }
        ctx.fillRect(20+activePieces[a].coordinate.x*100,90+activePieces[a].coordinate.y*100,80,80);
    }

    if(fallingPieces.length > 0){
        dropPieces()
        window.requestAnimationFrame(update);
    }
    

}

function switchPlayer(){
    if(turn == "p1"){
        turn = "p2"
    }
    else{
        turn = "p1"
    }

}


function draw(e){
    var coord = gridLookup(e);
    if(boardState[coord.x][coord.y] != "filled"){
        boardState[coord.x][coord.y] = "filled";
        activePieces.push({player:turn,coordinate:coord});
        fallingPieces.push([{player:turn,coordinate:coord},activePieces.length-1]);
        switchPlayer();
        window.requestAnimationFrame(update);
    }
    
}