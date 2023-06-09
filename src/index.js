import "./style.css";
import "./fontawesome/all.css";
import "./fontawesome/fontawesome.css";
import Board from "./board";
import {
  singleBlockSize, wellColumns, wellRows,
  frameCount, setFrameCount, incFrameCount,
  isGameWon, setDownFC, setIsGameWon, downFC,
  isGameOver, setIsGameOver, setWell,
  setTotalLinesCleared, gameSpeed, setGameSpeed,
  setCurrentPiece, setNextPiece, setTetrisCount,
  currentLevel, setCurrentLevel, levelIncreased,
  setLevelIncreased, setGeneratedBlocksCount,
} from "./piece";

const canvas = document.getElementById("myCanvas");
/** @type {CanvasRenderingContext2D}  */
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("nextCanvas");
/** @type {CanvasRenderingContext2D}  */
const nextCtx = nextCanvas.getContext("2d");
const result_container = document.getElementsByClassName("result-container");

// ################################################################################# Globals
var bp, p;
var animationId;
let board;
var playButton = document.querySelector("#controls__play");
var score = document.querySelector("#score__text");
var levelElement = document.querySelector("#level__text");
var mobile__contorls_element = document.querySelector("#mobile__contorls");
var next__block_element = document.querySelector("#next-block");
// ################################################################################# Globals

ctx.canvas.width = singleBlockSize * wellColumns;
ctx.canvas.height = singleBlockSize * wellRows;

result_container[0].style.width = "145px";
result_container[0].style.height = `${singleBlockSize * wellRows}px`;

// ################################################################################# main
const moves = {
  down: (bp) => ({ ...bp, y: bp.y + 1 }),
  left: (bp) => ({ ...bp, x: bp.x - 1 }),
  right: (bp) => ({ ...bp, x: bp.x + 1 }),
  up: (bp) => Board.rotate(bp),
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function keyDownHandler(event) {
  bp = board.piece;
  if (event.key == "ArrowDown") {
    p = moves.down(bp);

    if (board.piece.reachedBottom(p)) {
      board.piece.freeze(p);
      board.getNewPiece();
    } else {
      board.piece.move(p);
    }
    board.draw();
  } else if (event.key == "ArrowLeft") {
    p = moves.left(bp);
    if (board.piece.move(p)) {
      if (board.piece.reachedBottom(p)) {
        board.piece.freeze(p);
        board.getNewPiece();
      }
    }
    board.draw();
  } else if (event.key == "ArrowRight") {
    p = moves.right(bp);
    if (board.piece.move(p)) {
      if (board.piece.reachedBottom(p)) {
        board.piece.freeze(p);
        board.getNewPiece();
      }
    }
    board.draw();
  } else if (event.key == "ArrowUp") {
    bp = moves.up(bp);
    if (board.piece.reachedBottom(bp) == 0) {
      board.piece.move(bp);
      board.draw();
    }
  }
}

function mediaEventHandler() {
  event.preventDefault();
  const tId = event.target.parentElement.id;
  const Id = event.target.id;
  bp = board.piece;

  if (tId == "rotate" || Id == "rotate") {
    bp = moves.up(bp);
    if (board.piece.reachedBottom(bp) == 0) {
      board.piece.move(bp);
      board.draw();
    }
  }
  if (tId == "left__div" || Id == "left__div") {
    p = moves.left(bp);
    if (board.piece.move(p)) {
      if (board.piece.reachedBottom(p)) {
        board.piece.freeze(p);
        board.getNewPiece();
      }
    }
    board.draw();
  }
  if (tId == "right__div" || Id == "right__div") {
    p = moves.right(bp);
    if (board.piece.move(p)) {
      if (board.piece.reachedBottom(p)) {
        board.piece.freeze(p);
        board.getNewPiece();
      }
    }
    board.draw();
  }
  if (tId == "down" || Id == "down") {
    p = moves.down(bp);

    if (board.piece.reachedBottom(p)) {
      board.piece.freeze(p);
      board.getNewPiece();
    } else {
      board.piece.move(p);
    }
    board.draw();
  }
}

async function gameOver(text) {
  cancelAnimationFrame(animationId);
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.font = "30px Chelsea Market";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  playButton.textContent = "Play";
  document.removeEventListener("keydown", keyDownHandler);
  mobile__contorls.removeEventListener("click", mediaEventHandler);
}

function moveDown() {
  if (frameCount - downFC > gameSpeed && !isGameOver && !isGameWon) {
    // downFC = frameCount;
    setDownFC(frameCount);
    bp = board.piece;
    p = moves.down(bp);
    if (board.piece.reachedBottom(p)) {
      board.piece.freeze(p);
      board.getNewPiece();
    } else {
      board.piece.move(p);
    }
    board.draw();
  }
}

async function drawLevels(level) {
  document.removeEventListener("keydown", keyDownHandler);
  mobile__contorls.removeEventListener("click", mediaEventHandler);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "30px Chelsea Market";
  ctx.fillText(`Level ${level}`, canvas.width / 2, canvas.height / 2);
  ctx.font = "normal normal 20px Caveat";
  ctx.fillText(`Target: ${level} Tetris`, canvas.width / 2, canvas.height / 2 + 40);
  ctx.font = "normal normal 12px Verdana";
  ctx.fillText("(Tetris: 4 Lines)", canvas.width / 2, canvas.height / 2 + 70);
  await sleep(2000);

  document.addEventListener("keydown", keyDownHandler);
  mobile__contorls.addEventListener("click", mediaEventHandler);
}

async function animate() {
  // frameCount++;
  incFrameCount();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveDown();
  board.draw();
  if (isGameOver) {
    // audio_gameover.play()
    gameOver("Game Over");
  }
  if (isGameWon) {
    gameOver("You Won");
  }
  if (levelIncreased) {
    // levelIncreased = false;
    setLevelIncreased(false);
    await drawLevels(currentLevel);
  }
  if (!isGameOver) {
    animationId = requestAnimationFrame(animate);
  }
}

// ################################################################################# main
function resetGame() {
  // console.log('frameCount', frameCount);
  // frameCount = 0;
  setFrameCount(0);
  // isGameWon = false;
  setIsGameWon(false);
  // downFC = 0;
  setDownFC(0);
  // frameCount = 0;
  // isGameOver = false;
  setIsGameOver(false);
  score.textContent = 0;
  levelElement.textContent = 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // well = null;
  setWell(null);
  board = null;
  // totalLinesCleared = 0;
  setTotalLinesCleared(0);
  // gameSpeed = 55;
  setGameSpeed(55);
  // currentPiece = null;
  setCurrentPiece(null);
  // nextPiece = null;
  setNextPiece(null);
  cancelAnimationFrame(animationId);
  // tetrisCount = 0;
  setTetrisCount(0);
  // currentLevel = 1;
  setCurrentLevel(1);
  // levelIncreased = true;
  setLevelIncreased(true);
  // generatedBlocksCount = 0;
  setGeneratedBlocksCount(0);
}

function pauseGame() {
  playButton.textContent = "Resume";
  cancelAnimationFrame(animationId);
  document.removeEventListener("keydown", keyDownHandler);
  mobile__contorls.removeEventListener("click", mediaEventHandler);
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.font = "30px Chelsea Market";
  ctx.textAlign = "center";
  ctx.fillText("Paused", canvas.width / 2, canvas.height / 2);
}

function resumeGame() {
  playButton.textContent = "Pause";
  animate();
  document.addEventListener("keydown", keyDownHandler);
  mobile__contorls.addEventListener("click", mediaEventHandler);
}

function playButtonHandler() {
  if (playButton.textContent == "Play") {
    resetGame();
    playButton.textContent = "Pause";
    board = new Board(ctx, nextCtx, score, levelElement);
    // well = board.getEmptyBoard();
    setWell(board.getEmptyBoard());
    document.addEventListener("keydown", keyDownHandler);
    mobile__contorls.addEventListener("click", mediaEventHandler);
    animate();
  } else
  if (playButton.textContent == "Pause") {
    pauseGame();
  } else
  if (playButton.textContent == "Resume") {
    resumeGame();
  }
}

playButton.addEventListener("click", playButtonHandler);

// ########################################################################### media queries
function mediaFunction(media) {
  if (media.matches) { // If media query matches
    mobile__contorls_element.style.display = "Flex";
    // next__block_element.style.display='none';
    next__block_element.style.height = "25%";
    var mobile__contorls = document.querySelector("#mobile__contorls");
  }
}

const media = window.matchMedia("(max-width: 600px)");
mediaFunction(media); // Call listener function at run time
media.addListener(mediaFunction);

// ########################################################## next canvas
nextCtx.canvas.height = singleBlockSize * 4;
nextCtx.canvas.width = "150";

function drawRules() {
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "25px Chelsea Market";
  ctx.fillText("Enjoy the Game", canvas.width / 2, 40);
}

window.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", drawRules);
  document.getElementsByClassName("hidethis")[0].style.display = "none";
  document.getElementsByClassName("hidethis")[1].style.display = "none";
});
