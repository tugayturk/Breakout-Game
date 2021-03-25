(function () {
  var score = 0;
  var scoreAdd = 10;
  var lives = 3;
  var livesDecrease = 1;
  
   
  //------ stackover flow
   var paused = /*(lasturl == null || lasturl.length === 0 || currpage !== lasturl ) ? */false // : true;  // sayfa yneileniyo mu yoksa baştan mı açıyoruz
 // var currpage = window.location.href;
 // var lasturl = sessionStorage.getItem("last_url");
  //----
  drawTable();

  var level = [
    "**************",
    "**************",
    "**************",
    "**************",
  ];

  var gameLoop;  //(lasturl == null || lasturl.length === 0 || currpage !== lasturl ) ? undefined :  window.localStorage.getItem("gameLoop");//----
  var gameSpeed = 20;
  var ballMovementSpeed = 3;
  var paddleSensivity = 12; //

  var bricks = [];
  var bricksMargin = 1;
  var bricksWidth = 0;
  var bricksHeight = 18;

  var ball = {
    width: 6,
    height: 6,
    left: 0,
    top: 0,
    speedLeft: 0,
    speedTop: 0,
  };

  var paddle = {
    width: 100,
    height: 6,
    left: document.getElementById("breakout").offsetWidth / 2 - 30,
    top: document.getElementById("breakout").offsetHeight - 40,
  };
  buildLevel();
  createBricks();
  updateObjects();

  function startGame() {
    if (gameLoop) {
      clearInterval(gameLoop);
      startGameLoop();
    }
    score = 0;
    lives = 3;
    resetBall();
    buildLevel();
    createBricks();
    updateObjects();
    paused = false;
  }
  function drawTable() {
    document.body.style.background = "#0E5CAD";
    document.body.style.font = "18px Orbitron";
    document.body.style.color = "#FFF";
    document.body.className = "body";

    var breakout = document.createElement("div");
    var paddle = document.createElement("div");
    var ball = document.createElement("div");

    breakout.id = "breakout";
    breakout.style.width = "800px";
    breakout.style.height = "600px";
    breakout.style.position = "fixed";
    breakout.style.left = "50%";
    breakout.style.top = "50%";
    breakout.style.transform = "translate(-50%, -50%)";
    breakout.style.background = "#000000";

    paddle.id = "paddle";
    paddle.style.background = "#E80505";
    paddle.style.position = "absolute";
    paddle.style.boxShadow = "0 15px 6px -2px rgba(0,0,0,.6)";

    ball.className = "ball";
    ball.style.position = "absolute";
    ball.style.background = "#FFF";
    ball.style.boxShadow = "0 15px 6px -1px rgba(0,0,0,.6)";
    ball.style.borderRadius = "50%";
    ball.style.zIndex = "9";
    ball.classList.add("ball-Effect");

    breakout.appendChild(paddle);
    breakout.appendChild(ball);

    document.body.appendChild(breakout);

    var body = document.querySelector(".body");
    body.style.margin = "0px";

    var header = document.createElement("div");
    var scoreBoard = document.createElement("div");
    var button = document.createElement("button");
    var livesBar = document.createElement("div");

    header.style.width = "100%";
    header.style.background = "darkblue";
    header.style.height = "40px";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";

    scoreBoard.id = "scoreBoard";
    scoreBoard.style.fontSize = "25px";
    scoreBoard.style.background = "darkblue";
    scoreBoard.style.width = "100%";
    scoreBoard.style.height = "30px";
    scoreBoard.style.color = "red";
    scoreBoard.innerHTML = `Score: ${score}`;

    button.className = "button";
    button.style.width = "300px";
    button.style.height = "40px";
    button.innerHTML = "Start Game";
    button.style.color = "white";
    button.style.fontSize = "15px";
    button.style.backgroundColor = "#696969";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.marginRight = "40%";

    livesBar.id = "livesBar";
    livesBar.style.height = "100%";
    livesBar.style.width = "200px";
    livesBar.style.fontSize = "25px";
    livesBar.style.color = "red";
    livesBar.innerHTML = `Lives : ${lives}`;

    body.appendChild(scoreBoard);
    body.appendChild(header);
    body.appendChild(livesBar);
    header.appendChild(scoreBoard);
    header.appendChild(button);
    header.appendChild(livesBar);

    // highest score table
    var highest = document.createElement("div");
    var highestList = document.createElement("ol");
    var highestList1 = document.createElement("li");
    var highestList2 = document.createElement("li");
    var highestList3 = document.createElement("li");
    highest.className = "highestScore";
    highest.style.backgroundColor = "aqua";
    highest.style.width = "250px";
    highest.style.height = "25%";
    highest.innerHTML = "Leaders Table";
    highestList.style.display = "flex";
    highestList.style.flexDirection = "column";
    highest.style.color = "darkblue";
    highest.style.textAlign = "center"
    highestList.style.margin = "30px 40px"
    highest.style.fontSize = "1.3rem"
    

    body.appendChild(highest);
    highest.appendChild(highestList);
    highestList.appendChild(highestList1);
    highestList.appendChild(highestList2);
    highestList.appendChild(highestList3);

    function highestTable() {
      var getLocalScore = window.localStorage.getItem("score");
      // console.log(getLocalScore)
      //console.log(JSON.parse(getLocalScore))
      //console.log(JSON.parse(getLocalScore)[0])
      //console.log(JSON.stringify(getLocalScore))
      if (getLocalScore) {
        highestList1.innerHTML = JSON.parse(getLocalScore)[0];
        highestList2.innerHTML = JSON.parse(getLocalScore)[1];
        highestList3.innerHTML = JSON.parse(getLocalScore)[2];
      }
    }

    highestTable();

    button.addEventListener("click", function () {      
      if (confirm("NEW GAME?")) {
        clearInterval(gameLoop)
        startGame();
      }
    });
  }

  function removeElement(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  function buildLevel() {
    var arena = document.getElementById("breakout");
  //when page reload check if new page or refreshed page
  // if(lasturl == null || lasturl.length === 0 || currpage !== lasturl ){
  //     sessionStorage.setItem("last_url", currpage);
    bricks = [];

    for (var row = 0; row < level.length; row++) {
      for (var column = 0; column <= level[row].length; column++) {
        if (!level[row][column] || level[row][column] === " ") {
          continue;
        }

        bricksWidth =
          (arena.offsetWidth - bricksMargin * 2) / level[row].length;

        bricks.push({
          left: bricksMargin * 2 + bricksWidth * column,
          top: bricksHeight * row + 60,
          width: bricksWidth - bricksMargin * 2,
          height: bricksHeight - bricksMargin * 2,
        });
      }
    }
  }
  // else{
  //   var remain = window.localStorage.getItem("kalan");
  //   ball.top = JSON.parse(window.localStorage.getItem("ballpositionTop"));
  //   ball.left = JSON.parse(window.localStorage.getItem("ballPositionLeft"));
  //   paddle.left = JSON.parse(window.localStorage.getItem("paddlePosition"));
  //   score = JSON.parse(window.localStorage.getItem("currentScore"));
  //   lives = JSON.parse(window.localStorage.getItem("currentLives"));    
  //   if (remain) {
  //     bricks = JSON.parse(remain);
  //   }
  // }
  // }

  function removeBricks() {
    document.querySelectorAll(".brick").forEach(function (brick) {
      removeElement(brick);
    });
  }

  function createBricks() {
    removeBricks();

    var arena = document.getElementById("breakout");
    //console.log(bricks) //56 tane divi getiriyor
    let store = [];
    bricks.forEach(function (brick, index) {
      if (!brick.removed) {
        var element = document.createElement("div");
        element.id = "brick-" + index;
        element.className = "brick";
        element.style.left = brick.left + "px";
        element.style.top = brick.top + "px";
        element.style.width = brick.width + "px";
        element.style.height = brick.height + "px";
        element.style.background = "#FFFFFF";
        element.style.position = "absolute";
        element.style.boxShadow = "0 15px 20px 0px rgba(0,0,0,.4)";

        arena.appendChild(element);

        store.push(element.id);

        if (index > 41 && index < 56) {
          element.style.background = "#FFFFFF";
          element.innerHTML = 1;
          element.style.color = "black";
          element.style.fontSize = "0";
        }
        if (index > 27 && index < 42) {
          element.style.background = "red";
          element.innerHTML = 2;
          element.style.color = "black";
          element.style.fontSize = "0";
        }
        if (index > 13 && index < 28) {
          element.style.background = "green";
          element.innerHTML = 3;
          element.style.color = "black";
          element.style.fontSize = "0";
        }
        if (index >= 0 && index < 14) {
          element.style.background = "blue";
          element.innerHTML = 4;
          element.style.color = "black";
          element.style.fontSize = "0";
        }
      }
    });
  }

  function updateObjects() {
    document.getElementById("paddle").style.width = paddle.width + "px";
    document.getElementById("paddle").style.height = paddle.height + "px";
    document.getElementById("paddle").style.left = paddle.left + "px";
    document.getElementById("paddle").style.top = paddle.top + "px";

    document.querySelector(".ball").style.width = ball.width + "px";
    document.querySelector(".ball").style.height = ball.height + "px";
    document.querySelector(".ball").style.left = ball.left + "px";
    document.querySelector(".ball").style.top = ball.top + "px";

    document.getElementById("livesBar").innerHTML = `Lives: ${lives}`;
    document.getElementById("scoreBoard").innerHTML = `score: ${score} `;
  }

  function resetBall() {
    var arena = document.getElementById("breakout");

    ball.left = arena.offsetWidth / 2 - ball.width / 2;
    ball.top = arena.offsetHeight / 1.6 - ball.height / 2;
    ball.speedLeft = 1;
    ball.speedTop = ballMovementSpeed;

    if (Math.round(Math.random() * 1)) {
      ball.speedLeft = -ballMovementSpeed;
    }

    document.querySelector(".ball").style.left = ball.left + "px";
    document.querySelector(".ball").style.top = ball.top + "px";
  }

  function movePaddle(clientX) {
    var arena = document.getElementById("breakout");
    var arenaRect = arena.getBoundingClientRect();
    var arenaWidth = arena.offsetWidth;
    var mouseX = clientX - arenaRect.x;
    var halfOfPaddle = document.getElementById("paddle").offsetWidth / 2;

    if (mouseX <= halfOfPaddle) {
      mouseX = halfOfPaddle;
    }

    if (mouseX >= arenaWidth - halfOfPaddle) {
      mouseX = arenaWidth - halfOfPaddle;
    }
    
    paddle.left = mouseX - halfOfPaddle;
  }
  function cpuPlayer(){
    paddle.left = ball.left - 50 ;
     var arena = document.getElementById("breakout");
     var arenaWidth = arena.offsetWidth;
      if (paddle.left < 0) {
      paddle.left = arenaWidth - 800; 
     } else if (paddle.left> 700) {
     
      paddle.left = 800-paddle.width;
           
    }

        }
  
  
  function movePaddleKeyboardEvent(e) {
    var arena = document.getElementById("breakout");
    var arenaWidth = arena.offsetWidth;
    var paddleRight = paddle.left + document.getElementById("paddle").offsetWidth ;

    if (e.key == "ArrowLeft" && paddle.left > 0) {
       paddle.left = paddle.left - paddleSensivity; 
     } else if ((e.key = "ArrowRight" && paddleRight < arenaWidth)) {
       paddle.left = paddle.left + paddleSensivity;
    }

    if (e.key == "Backspace") {
      clearInterval(gameLoop);
      paused = true;
    }
    if (e.key == "Enter") {
       paused = false;
      startGameLoop();
    }
    if (e.key == "y") {
      /// yenileme
      window.localStorage.setItem("ballpositionTop", JSON.stringify(ball.top));
      window.localStorage.setItem("ballPositionLeft",JSON.stringify(ball.left));
      window.localStorage.setItem("paddlePosition",JSON.stringify(paddle.left));
      window.localStorage.setItem("currentScore", JSON.stringify(score));
      window.localStorage.setItem("currentLives", JSON.stringify(lives));
      window.localStorage.setItem("gameLoop", JSON.stringify(gameLoop));
      clearInterval(gameLoop)
      location.reload();
    }
    if( e.key == "0"){
      setInterval(function () {
        cpuPlayer()
       }, 1); 
    }
    }

  function moveBall() {
    detectCollision();

    var arena = document.getElementById("breakout");

    ball.top += ball.speedTop;
    ball.left += ball.speedLeft ;

    if (ball.left <= 0 || ball.left + ball.width >= arena.offsetWidth) {
      ball.speedLeft = -ball.speedLeft;
    }

    if (ball.top <= 0 || ball.top + ball.height >= arena.offsetHeight) {
      ball.speedTop = -ball.speedTop;
    }

    if (ball.top + ball.height >= arena.offsetHeight) {
      lives -= livesDecrease;
      //------------
      if (lives > 0) {
        resetBall();
      } else {
        setTimeout(function () {
          alert("You Lost the Game");
        }, 500);

        var localscore = JSON.parse(window.localStorage.getItem("score")) || [0,0,0];
        for (let i = 0; i < localscore.length; i++) {
          if (localscore[i] < score) {
            localscore.push(score);
            break;
          }
        }
        localscore.sort((a, b) => b - a).splice(3, 1);
        window.localStorage.setItem("score", JSON.stringify(localscore));
        startGame();
        //------------
      }
    }
  }

  function detectCollision() {
    if (
      ball.top + ball.height >= paddle.top &&
      ball.top + ball.height <= paddle.top + paddle.height &&
      ball.left >= paddle.left &&
      ball.left <= paddle.left + paddle.width
    ) {
      ball.speedTop = -ball.speedTop;
    }

    for (var i = 0; i < bricks.length; i++) {
      var brick = bricks[i];

      if (
        ball.top + ball.height >= brick.top &&
        ball.top <= brick.top + brick.height &&
        ball.left + ball.width >= brick.left &&
        ball.left <= brick.left + brick.width &&
        !brick.removed
      ) {
        ball.speedTop = -ball.speedTop * 1.05; /// top çarptıkça hızını arttırdım
        ball.speedLeft = ball.speedLeft * 1.1; /// top çarptıkça sola doğru hızı arttırdım
        //------------------------------------
        var brickElement = document.getElementById("brick-" + i);
        brickElement.innerHTML -= 1;
        if (brickElement.innerHTML == 0) {
          brick.removed = true;
          score += scoreAdd;
          removeElement(brickElement);
          window.localStorage.setItem("kalan", JSON.stringify(bricks));
        }
        //--------------------------------------

        if (score == 560) {
          setTimeout(function () {
            alert("CONGRATS HIGHEST SCORE !!!! ");
          }, 400); 
        }
        break;
      }
    }
  }

  function setEvents() {
    document.addEventListener("mousemove", function (event) {
      movePaddle(event.clientX);
    });
    document.addEventListener("keydown", movePaddleKeyboardEvent);
  }

  function startGameLoop() {
    if (!paused) {
       gameLoop = setInterval(function () {
        moveBall();
        updateObjects();
      }, gameSpeed);
    }
  }

  setEvents();
  startGameLoop();
})();
