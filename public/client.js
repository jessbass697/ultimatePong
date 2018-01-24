//Main Paddle function to declare the variable types of paddle
function Paddle(width, height, xPos, yPos, speed) {
    this.width = width;
    this.height = height;
    this.xPos = xPos;
    this.yPos = yPos;
    this.speed = speed;
}
//Main ball function to declare the variable types of the ball
function Ball(xPos, yPos, radius, vx, vy) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
}
//preload function to preload assets such as music and images
function preload() {
    soundFormats('mp3');
    backgroundMusic = loadSound('./assets/background.mp3');
    bg = loadImage("./assets/pongBG.jpg");
    gameover = loadSound('./assets/gameover.mp3');
    
}

//variables for preloading the assets
let backgroundMusic; 
let gameover; 
let bg; 

//variables for creating new paddles based on the main Paddle function
let rPaddle = new Paddle(20, 100, 960, 150, 12); 
let lPaddle = new Paddle(20, 150, 20, 150, 12); 

// new ball created based on the main ball function
let ball = new Ball(300, 400, 25, 10, 7); 

//variables for tracking the score and the timer
let score = 0; 
let counter = 0; 
let timeLeft = 60; 

//function to covert the number of seconds in the timer to minutes and seconds. 
function convertTimer(s) {
    const min = floor(s/60);
    const sec = s % 60;
    return nf(min,2) + ':' + nf(sec,2);
    
}
function setup() {
    //draw canvas
    createCanvas(1000, 400); 
    //set the default background to 0 to stop objects leaving trails and a bg to give it an image background
    background(0, bg); 
    //begin playing the background music when the game loads
    backgroundMusic.play(); 
    
    //Start button to begin the timer
    const button = createButton("Start!");
        button.mousePressed(startGame);
        button.position(900, 60);
}
    
//startGame function to start the timer of the game
function startGame() {
    
    //selects timer from the html page by its ID 
    let timer = select('#timer');
    //takes timer and coverts it to minutes and seconds before taking timeLeft and minusing it by counter
    timer.html(convertTimer(timeLeft - counter)); 
    
    //timeIt function begins the countdown of the timer
    let timeIt = function() {
        counter++;
        timer.html(convertTimer(timeLeft - counter));
        //when the timer reaches zero, the ball will stop moving, the background music will stop
        //the gameover sound will play and it will log the player's score to the database.
        if(counter === timeLeft) {
            clearInterval(interval);
             stopBall();
            backgroundMusic.stop();
            gameover.play();
            logScore(score);
            getScore(score);
            
        }
    }
    //set the interval to count down by 1 second
    let interval = setInterval(timeIt, 1000);
}


//draw function takes in the functions created to play the game, the paddles, ball, collisions etc. 
function draw() {
    background(bg);
    
    drawBall();
    drawLPaddle();
    drawRPaddle();
    ballCollision();
    rPaddleCollision();
    lPaddleCollision();
    drawScore();
    resetBallPosition();
    
}

//drawBall() creates a new ball using the main Ball function
function drawBall() {
    //gives it a colour
    fill(198, 237, 44);
    //creates the ball
    ellipse(ball.xPos, ball.yPos, ball.radius);
    
    //gets the ball moves on both the X and Y axis
    ball.xPos = ball.xPos + ball.vx;
    ball.yPos = ball.yPos + ball.vy;
}

//creates a new left paddle using the main Paddle() function
function drawLPaddle() {
    //gives it a colour
    fill(198, 237, 44);
    //draws the paddle
    rect( lPaddle.xPos, lPaddle.yPos, lPaddle.width, lPaddle.height,);
    
    //CPU paddle, moves by itself by tracking the position of the ball
    //if the paddle's Y position is less than the balls position it will move down
    if(lPaddle.yPos < ball.yPos && lPaddle.yPos < ball.xPos) {
        lPaddle.yPos = lPaddle.yPos + lPaddle.speed;
    }
    //if the paddle's Y position is more than the ball's position, it will move up
    else if(lPaddle.yPos > ball.yPos && lPaddle.yPos > ball.xPos) {
        lPaddle.yPos = lPaddle.yPos - lPaddle.speed;
    }
    
    
}

//creates a right paddle using the main Paddle() function
function drawRPaddle() {
    //gives it a colour
    fill(198, 237, 44);
    rect(rPaddle.xPos, rPaddle.yPos, rPaddle.width, rPaddle.height);
    
    //using the p5 'keyIsDown' function, it moves the paddle down with the down arrow key
    if(keyIsDown(DOWN_ARROW)) {
        if(rPaddle.yPos + rPaddle.height - 5) {
            rPaddle.yPos = rPaddle.yPos + rPaddle.speed;
        }
    }
    
    //using the p5 'keyIsDown' function, it moves the paddle up with the up arrow key
    if(keyIsDown(UP_ARROW)) {
        if(rPaddle.yPos > 5) {
            rPaddle.yPos = rPaddle.yPos - rPaddle.speed;
        }
        
    }
    
}

//ballCollision() sets out arguments for the ball colliding with the top and bottom of the canvas
function ballCollision() {
    if(ball.yPos > height - ball.radius) {
        ball.yPos = height - ball.radius;
        ball.vy *= -1;
    }
    else if(ball.yPos < ball.radius/2) {
        ball.yPos = ball.radius/2;
        ball.vy *= -1;
    }
}

//rPaddleCollision() sets out arguments for the ball colliding with the right paddle
function rPaddleCollision() {
    if(ball.xPos + ball.radius/2 > rPaddle.xPos && ball.yPos + ball.radius/2 > rPaddle.yPos && ball.yPos + ball.radius/2 < rPaddle.yPos + rPaddle.height && ball.xPos > 0 && ball.xPos < width && ball.yPos > 0 && ball.yPos < height) {
        ball.vx = ball.vx * -1;
        ball.xPos = ball.xPos + ball.vx;
        //updates the score when the ball collides with the right paddle
        score++;
    }
    else if(ball.yPos + ball.radius/2 > rPaddle.yPos && ball.yPos < rPaddle.yPos + rPaddle.height && ball.xPos + ball.radius/2 > rPaddle.xPos && ball.xPos < rPaddle.xPos + rPaddle.xPos && ball.xPos > 0 && ball.xPos < width && ball.yPos > 0 && ball.yPos <height) {
        ball.vx = ball.vx * -1;
        ball.xPos = ball.xPos + ball.vx;
    }
    
}

//lPaddleCollision() sets out arguments for the ball colliding with the left paddle
function lPaddleCollision() {
    if(ball.xPos - ball.radius/2 < lPaddle.xPos + lPaddle.width && ball.yPos + ball.radius/2 > lPaddle.yPos && ball.yPos + ball.radius/2 < lPaddle.yPos + lPaddle.height && ball.xPos > 0 && ball.xPos < width && ball.yPos > 0 && ball.yPos < height) {
        ball.vx = ball.vx * -1;
        ball.xPos = ball.xPos + ball.vx;
    }
    else if(ball.yPos + ball.radius/2 > rPaddle.yPos && ball.yPos < rPaddle.yPos + rPaddle.height && ball.xPos + ball.radius/2 > rPaddle.xPos && ball.xPos < rPaddle.xPos + rPaddle.xPos && ball.xPos > 0 && ball.xPos < width && ball.yPos > 0 && ball.yPos <height) {
        ball.vx = ball.vx * -1;
        ball.xPos = ball.xPos + ball.vx;
    }
}

//drawScore() uses the p5.dom to create text inside the canvas, this is used to display the player's score
function drawScore() {
    fill('white');
    textSize(20);
    textFont('Helvetica', 'Font Style Bold');
    text("Score: " + score, 12, 60);
}

//resetBallPosition() if the ball leaves the area on the right and left of the canvas the ball will be put back to the centre
function resetBallPosition() {
    if(ball.xPos > 0 && ball.xPos > width && ball.yPos > 0) {
        ball.xPos = width/2;
        ball.yPos = height/2;
    }
    if(ball.xPos < 0 ) {
        ball.xPos = width/2;
        ball.yPos = height/2;
    }
}

//stopBall() is called when the timer reaches zero to stop the ball
function stopBall() {
    if(counter === timeLeft) {
        ball.vx = 0;
        ball.vy = 0;
    }
}

//logScore() is called when the timer reaches zero to log the current score to the database
function logScore(score) {
   fetch('/gamescore', {
       method: 'POST',
        body:JSON.stringify( {
            "score": score
        }),
       headers: new Headers({
           'Content-Type': 'application/json',
       })
   })
    .then(response => {
            if(response.ok) return;
            throw new Error('Request Failed');
        })
    .catch(error => {
            console.log(error)
        });
}

//getScore() is invoked when the timer reaches zero, this function retrieves the highest score from the database
function getScore(score) {
    fetch('/gamescore', {method: 'GET'})
    .then((response) => {
        if(response.ok) return response.json();
        throw new Error('Request Failed');
    })
    .then((data) => {
        //displays the highest score from the database (could not get it to display )
        document.getElementById('leaderboard').innerHTML = `GAME OVER! <br> <br> The Score to Beat is: ${data[0].score}`;
        console.log(data);
    })
    .catch((error) => {
        console.log(error)
    });
}
          
















