var canvas;
var ctx;

var boardState = [];
var activePieces = [];
var fallingPieces = [];

var turn = "p1"
var mousePos = {x:0,y:0};


function reset(){
    boardState = [];
    activePieces = [];
    fallingPieces = [];
    turn = "p1"
    load();
}

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
    var t = document.getElementById("Turn").firstChild;
    t.nodeValue = "Current Turn: P1";
    
    canvas.addEventListener("click",draw);
    canvas.addEventListener("mousemove",mouseRec);
    window.requestAnimationFrame(update);
}

function mouseRec(e){
    var mousePosCheck = gridLookup(e);
    if(boardState[mousePosCheck.x][mousePosCheck.y] == "empty"){
        mousePos.x = mousePosCheck.x;
        mousePos.y = mousePosCheck.y;
        var text = String(mousePos.x) + String(mousePos.y)
        //alert(text)
        requestAnimationFrame(update)
    }
    else{
        mousePos.x = -1;
    }
    
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
    var xCoord = Math.trunc((pos.x-10)/100);
    var yCoord = Math.trunc((pos.y -10)/100);
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

function lineCheck(check,dir,count){
    var nextX = check.x;
    var nextY = check.y;
    if(!(check.x<0 || check.x>6 || check.y<0 || check.y>6)){
        var boardVal = boardState[nextX][nextY];
        if(boardVal == "empty"){
            return count;
        }
        else if(boardVal == turn){
            if(count == 3){
                count++;
                return count;
            }
            else{
                count++;
                check.x += dir.x;
                check.y += dir.y;
                return(lineCheck(check,dir,count))
            }
        }
        else{
            return count;
        }
    }
    else{
        return count;
    }



    

}


function winCheck(coord){
    var lineVals = {"11":0,"-1-1":0,"-11":0,"1-1":0,"10":0,"-10":0,"01":0}
    for(var a = -1;a < 2; a++){
        for(var b = -1; b < 2; b++){
            var check = {x:coord.x + a,y:coord.y + b};
            if(!(check.x<0 || check.x>6 || check.y<0 || check.y>6)){
                if(!(a==0 &&  b== 0) && !(a==0 && b == -1)){
                    // alert(String(check.x) + " " + String(check.y));
                    dir = {x:a,y:b};
                    //alert(String(dir.x) + " " + String(dir.y));
                    var win = lineCheck(check,dir,0);
                    var key = String(a) + String(b);
                    lineVals[key] = win;
                    //alert(win)
                    //alert(key)
                    
                }
            }
        }
    }

    var crossNeg = lineVals["11"] + lineVals["-1-1"]+1;
    var crossPos = lineVals["1-1"] + lineVals["-11"]+1;
    var horizontal = lineVals["-10"] + lineVals["10"]+1;
    var vertical = lineVals["01"]+1;

    var text = String(crossPos) + " " + String(crossNeg) + " " + String(horizontal) + " " + String(vertical)

    //alert(text)
    if(crossPos >= 4 || crossNeg >= 4 || horizontal >= 4 || vertical >= 4){
        if(turn == "p1"){
            alert("Game won: P2");
        }
        else{
            alert("Game won: P1");
        }
        var t = document.getElementById("Turn").firstChild;
        t.nodeValue = "Click Reset to play again!";
        
        canvas.removeEventListener("click",draw);
    }

}





function dropPieces(){
    var ind_to_remove = [];
    for(var x = 0; x < fallingPieces.length; x++){
        var fallCheck = fallingPieces[x][0].coordinate.y + 1;
        if(fallCheck > 6){
            ind_to_remove.push(x);
            winCheck(fallingPieces[x][0].coordinate)
        }
        else if(boardState[fallingPieces[x][0].coordinate.x][fallCheck] != "empty"){
            ind_to_remove.push(x);
            winCheck(fallingPieces[x][0].coordinate)
        }
        else{
            boardState[fallingPieces[x][0].coordinate.x][fallingPieces[x][0].coordinate.y] = "empty";
            boardState[fallingPieces[x][0].coordinate.x][fallCheck] = turn;
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
            ctx.strokeRect(20+x*100,20+y*100,80,80);
        }
    }


    for(var a = 0;a < activePieces.length;a++){
        if(activePieces[a].player == "p1"){
            ctx.fillStyle = "rgb(0,200,0)";
        }
        else{
            ctx.fillStyle = "rgb(200,0,0)";
        }
        ctx.fillRect(20+activePieces[a].coordinate.x*100,20+activePieces[a].coordinate.y*100,80,80);
    }

    if(mousePos.x != -1){
        ctx.fillStyle = "rgb(0,0,200)";
        ctx.fillRect(20+mousePos.x*100,20+mousePos.y*100,80,80);
    }

    if(fallingPieces.length > 0){
        dropPieces()
        window.requestAnimationFrame(update);
    }
    

}

function switchPlayer(){
    var t = document.getElementById("Turn").firstChild;
    if(turn == "p1"){
        turn = "p2"
        t.nodeValue = "Current Turn: P2";
    }
    else{
        turn = "p1"
        t.nodeValue = "Current Turn: P1";
    }

}


function draw(e){
    var coord = gridLookup(e);
    if(boardState[coord.x][coord.y] == "empty"){
        boardState[coord.x][coord.y] = turn;
        activePieces.push({player:turn,coordinate:coord});
        fallingPieces.push([{player:turn,coordinate:coord},activePieces.length-1]);
        switchPlayer();
        window.requestAnimationFrame(update);
    }
    
}