

// SELECT CANVAS ELEMENT
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

    //Resize canvas element from page
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
// ADD BORDER TO CANVAS
cvs.style.border = "1px solid #0ff";

// MAKE LINE THIK WHEN DRAWING TO CANVAS
ctx.lineWidth = cvs.width/50-cvs.width/60;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = cvs.width/8;
const PADDLE_MARGIN_BOTTOM = cvs.height/10;
const PADDLE_HEIGHT = cvs.height/30;
const BALL_RADIUS = cvs.height/50;
let LIFE = 3; // PLAYER HAS 3 LIVES
//var score keeper
var scorekeep = document.getElementById('inputscore');
var scoreNumber = 0;

///game score
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
//make game stage
let startstage = 0;
//const MAX_LEVEL = 3;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;
let GAME_START = false;
//ball speed
let SPEED = 10;
// CREATE THE PADDLE
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx : 16
}

// DRAW PADDLE
function drawPaddle(){
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROL THE PADDLE WITH KEYBOARD
document.addEventListener("keydown", function(event){
   if(event.keyCode == 37){
       leftArrow = true;
   }else if(event.keyCode == 39){
       rightArrow = true;
   }
});
document.addEventListener("keyup", function(event){
   if(event.keyCode == 37){
       leftArrow = false;
   }else if(event.keyCode == 39){
       rightArrow = false;
   }
});

// CONTROL THE PADDLE WITH MOUSE
document.addEventListener("mousemove", mouseMoveHandler, false);

// CONTROL THE PADDLE WITH TOUCH
// touchmove handler
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler, false);

  


// MOVE PADDLE
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx + 5;  
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx + 5;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - cvs.offsetLeft;
    if(relativeX > 0 && relativeX < cvs.width) {
      paddle.x = relativeX - width/2;
    }
  }

  function handleMove(e) {
    var relativeX = e.clientX - cvs.offsetLeft;
    if(relativeX > 0 && relativeX < cvs.width) {
      paddle.x = relativeX - width/2;
    }
  }
//MOVE WITH TOUCH
function touchHandler(e) {
    var relativeX = e.clientX - cvs.offsetLeft;
    if(e.touches) {
        paddle.x = e.touches[0].pageX -  cvs.offsetLeft - width/2;
    }
}


// CREATE THE BALL
const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    dx : SPEED * (Math.random() * 2 - 1),
    dy : -SPEED
}

// DRAW THE BALL
function drawBall(){
    ctx.beginPath();
    
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();
    
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    
    ctx.closePath();
}

// MOVE THE BALL
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}


// BALL AND WALL COLLISION DETECTION
function ballWallCollision(){
    if(ball.x + ball.radius > cvs.width){
        ball.x = ball.x-10;
        ball.dx = - ball.dx;
        WALL_HIT.play();
        if(LEVEL > 7){
            SPEED = SPEED+0.25; 
        }
    }
    if(ball.x - ball.radius < 0){
        ball.x = ball.x+10;
        ball.dx = - ball.dx;
        WALL_HIT.play();
        if(LEVEL > 7){
            SPEED = SPEED+0.25; 
        }
    }
    
    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
        WALL_HIT.play();
        if(LEVEL > 7){
            SPEED = SPEED+0.25; 
        }
    }
    
    if(ball.y + ball.radius > cvs.height){
        LIFE--; // LOSE LIFE
        LIFE_LOST.play();
        resetBall();
    }
}

// RESET THE BALL
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = SPEED * (Math.random() * 2 - 1);
    ball.dy = -SPEED ;
}

// BALL AND PADDLE COLLISION
function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
        
        // PLAY SOUND
        PADDLE_HIT.play();
        
        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        
        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width/2);
        
        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI/3;
          
            
        ball.dx = SPEED  * Math.sin(angle);
        ball.dy = -SPEED  * Math.cos(angle);
        if(SPEED <= 14 && LEVEL < 3){
            SPEED = SPEED+0.25; 
        }
        else if(LEVEL > 3){
            SPEED = SPEED+0.25;
        }
    }
}

// CREATE THE BRICKS
const brick = {
    row : 1,
    column : 5,
    width : cvs.width/10,
    height : cvs.height/30,
    offSetLeft : cvs.width/12,
    offSetTop : cvs.height/10,
    marginTop : cvs.height/10,
    fillColor : "#2e3548",
    strokeColor : "#FFF"
}

let bricks = [];

function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

// draw the bricks
function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// ball brick collision
function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false; // the brick is broken
                    SCORE += SCORE_UNIT;
                    scoreNumber += SCORE_UNIT
                }
            }
        }
    }
}



// show game stats
function showGameStats(text, textX, textY, img, imgX, imgY){
    // draw text
    ctx.fillStyle = "#FFF";
    ctx.font = "45px Germania One";
    ctx.fillText(text, textX, textY);
    
    // draw image
    ctx.drawImage(img, imgX, imgY, width = cvs.width/20, cvs.height/20);
}

// show game speed
function showGameSpeed(text, textX, textY, img, imgX, imgY){
    // draw text
    ctx.fillStyle = "#FFF";
    ctx.font = "45px Germania One";
    ctx.fillText(text, textX, textY);
    
    // draw image
    ctx.drawImage(img, imgX, imgY, width = cvs.width/10, cvs.height/10);
}


// DRAW FUNCTION
function draw(){
    drawPaddle();
    
    drawBall();
    
    drawBricks();
    
    // SHOW SCORE
    showGameStats(SCORE, cvs.width/15, cvs.height/20, SCORE_IMG, 5, cvs.height/100);
    // SHOW LIVES
    showGameStats(LIFE, cvs.width-cvs.width/10, cvs.height/20, LIFE_IMG, cvs.width/2+cvs.width/3, cvs.height/100); 
    // SHOW LEVEL
    showGameStats(LEVEL, cvs.width/2+cvs.width/20, cvs.height/20 , LEVEL_IMG, cvs.width/2-cvs.width/30, cvs.height/100);
    // SHOW SPEED
    showGameSpeed(SPEED, cvs.width-cvs.width/8, cvs.height/2+cvs.height/6 , SPEED_IMG, cvs.width/2+cvs.width/3, cvs.height/2+cvs.height/15);
}
// game start
function gameStart(){
    scoreNumber = 0;
    scorekeep.innerHTML = 'Score: ' + 0;
    if(startstage == 0){
        showstartgame();
    }
}
// game over
function gameOver(){
    if(LIFE <= 0){
        showYouLose();
        GAME_OVER = true;
        storeScore();
    }
}

// level up
function levelUp(){
    let isLevelDone = true;
    
    // check if all the bricks are broken
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    
    if(isLevelDone && LEVEL < 3){
        WIN.play();
        
        //if(LEVEL >= MAX_LEVEL){
           // showYouWin();
            //GAME_OVER = true;
           // return;
       // }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        LEVEL++;
    }
    else if(isLevelDone && LEVEL >= 3 ){
        WIN.play();
        createBricks();
        paddle.width = paddle.width+cvs.width/30;
        LEVEL++;
    }
}

// UPDATE GAME FUNCTION
function update(){
    movePaddle();
    
    moveBall();
    
    ballWallCollision();
    
    ballPaddleCollision();
    
    ballBrickCollision();
    
    gameStart();

    gameOver();
    
    levelUp();

}


// GAME LOOP
function loop(){
    // CLEAR THE CANVAS
    ctx.drawImage(BG_IMG,0,0);
    draw();
    if(GAME_START == true){
        update();
    }
    
    if(! GAME_OVER){
        requestAnimationFrame(loop);
    }
}
loop();


// SELECT SOUND ELEMENT
const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    // CHANGE IMAGE SOUND_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == rootContext +"img/SOUND_ON.png" ? rootContext +"img/SOUND_OFF.png" : rootContext +"img/SOUND_ON.png";
    
    soundElement.setAttribute("src", SOUND_IMG);
    
    // MUTE AND UNMUTE SOUNDS
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");
const gamestart = document.getElementById("gamestart");
const gamescore = document.getElementById("gamescore");
const start = document.getElementById("start");
const score = document.getElementById("score");
const back = document.getElementById("back");
// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

//start button
function Start(){
    gamestart.style.display = "none";
    score.style.display = "none";
    startstage = startstage+1;
    GAME_START = true;
}
// CLICK ON PLAY TO START THE GAME
start.addEventListener("click", function(){
    gamestart.style.display = "none";
    score.style.display = "none";
    startstage = startstage+1;
    GAME_START = true;
})

// CLICK ON score TO show scoreboard
score.addEventListener("click", function(){
    start.style.display = "none";
    score.style.display = "none";
    back.style.display = "block";
    showScoreboard();
})

// CLICK back to menu
back.addEventListener("click", function(){
    back.style.display = "none";
    start.style.display = "block";
    score.style.display = "block";
    scoreboard.style.display = 'none';
})
// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
    restart.style.display = "block";
}

// SHOW START GAME MENU
function showstartgame(){
    gamestart.style.display = "block";
    start.style.display = "block";
   
}

function hideback(){
    back.style.display = "none";
    scoreboard.style.display = 'none';
}

function showScoreboard(){
    scoreboard.style.display = 'block';
    updateScoreboard();
}

function scoreIt(){
    scoreNumber += 10;
    scorekeep.innerHTML = 'Score: ' + scoreNumber;
}



function degToRad(degrees) {
  var result = Math.PI / 180 * degrees;
  return result;
}

// setup of the canvas


var x = 50;
var y = 50;


// pointer lock object forking for cross browser

cvs.requestPointerLock = cvs.requestPointerLock ||
cvs.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

                           gamestart.onclick = function() {
                            cvs.requestPointerLock();
};

// pointer lock event listeners

// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === cvs ||
      document.mozPointerLockElement === cvs) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    console.log('The pointer lock status is now unlocked');  
    document.removeEventListener("mousemove", updatePosition, false);
  }
}

var tracker = document.getElementById('tracker');

var animation;
function updatePosition(e) {
  x += e.movementX;
  if (x ) {
    paddle.x = x - width/2;
  }
  if (paddle.x > cvs.width + PADDLE_WIDTH) {
    x = -x;
  }
}






