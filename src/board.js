import {
  singleBlockSize,
  blockActualParam,
  wellColumns,
  wellRows,
  well,
  setIsGameOver,
  setGameSpeed,
  setIsGameWon,
  incTotalLinesCleared,
  currentPiece,
  setCurrentPiece,
  nextPiece,
  setNextPiece,
  tetrisCount,
  incTetrisCount,
  currentLevel,
  incCurrentLevel,
  setLevelIncreased,
  fixedScores,
  levels,
  levelTargets,
  colors,
  Piece,
} from "./piece";

export default class Board {
  // ctx;
  // nextCtx;
  // well;
  // piece;
  // score;
  // levelElement;

  constructor(ctx, nextCtx, score, levelElement) {
    this.ctx = ctx;
    this.nextCtx = nextCtx;
    this.score = score;
    this.levelElement = levelElement;
    this.getNewPiece();
  }

  draw() {
    this.drawGridLines();
    this.piece.draw();
    this.piece.drawInNext(nextPiece);
    this.drawBoard();
  }

  drawGridLines() {
    for (let x = 0; x < wellColumns; x += 1) {
      for (let y = 0; y < wellRows; y += 1) {
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(
          x * (singleBlockSize),
          y * (singleBlockSize),
          blockActualParam,
          blockActualParam,
        );
      }
    }
  }

  drawBoard() {
    for (let x = 0; x < wellColumns; x += 1) {
      for (let y = 0; y < wellRows; y += 1) {
        if (well[y][x] > 0) {
          this.ctx.fillStyle = colors[well[y][x]];
          this.ctx.fillRect(
            x * (singleBlockSize),
            y * (singleBlockSize),
            blockActualParam,
            blockActualParam,
          );
        }
      }
    }
    this.isLineComplete();
    this.isGameFinished();
  }

  getNewPiece() {
    if (!nextPiece) {
      // currentPiece = new Piece(this.ctx);
      setCurrentPiece(new Piece(this.ctx, this.nextCtx));
      // nextPiece = new Piece(this.ctx);
      setNextPiece(new Piece(this.ctx, this.nextCtx));
      this.piece = currentPiece;
    } else {
      // currentPiece = nextPiece
      setCurrentPiece(nextPiece);
      this.piece = currentPiece;
      // nextPiece = new Piece(this.ctx);;
      setNextPiece(new Piece(this.ctx, this.nextCtx));
    }
  }

  getEmptyBoard() {
    return Array.from({ length: wellRows }, () => Array(wellColumns).fill(0));
  }

  isLineComplete() {
    const lines = [];
    for (let x = 0; x < wellRows; x += 1) {
      let isComp = true;
      for (let y = 0; y < wellColumns; y += 1) {
        if (well[x][y] == 0) {
          isComp = false;
          // console.log(`${x}: false`);
        }
      }
      if (isComp) lines.push(x);
    }

    // will only enter inside if a line is cleared
    if (lines.length > 0) {
      // totalLinesCleared++;
      incTotalLinesCleared();
      for (let k = 0; k < lines.length; k += 1) {
        well.splice(lines[k], 1);
        well.unshift(Array(wellColumns).fill(0));
      }

      // audio
      // if(lines.length==4){
      //     audio_fourlines.currentTime=0
      //     audio_fourlines.play()
      // }else{
      //     //play oneline one
      //     audio_oneline.currentTime=0
      //     audio_oneline.play()
      // }

      // when a tetris is made
      if (lines.length == 4) {
        this.score.textContent = parseInt(this.score.textContent, 10) + fixedScores[4];
        // tetrisCount++;
        incTetrisCount();
        if (tetrisCount == levelTargets.level1.tcount && currentLevel == 1) {
          // gameSpeed = levels[1];
          setGameSpeed(levels[1]);
          this.levelElement.textContent = parseInt(this.levelElement.textContent, 10) + 1;
          // currentLevel++;
          incCurrentLevel();
          // levelIncreased = true;
          setLevelIncreased(true);
        }
        if (tetrisCount == levelTargets.level2.tcount && currentLevel == 2) {
          // gameSpeed = levels[2];
          setGameSpeed(levels[2]);
          this.levelElement.textContent = parseInt(this.levelElement.textContent, 10) + 1;
          // currentLevel++;
          incCurrentLevel();
          // levelIncreased = true;
          setLevelIncreased(true);
        }
        if (tetrisCount == levelTargets.level3.tcount && currentLevel == 3) {
          // gameSpeed = levels[3];
          setGameSpeed(levels[3]);
          this.levelElement.textContent = parseInt(this.levelElement.textContent, 10) + 1;
          // currentLevel++;
          incCurrentLevel();
          // levelIncreased = true;
          setLevelIncreased(true);
        }
      } else { // increase score
        this.score.textContent = parseInt(this.score.textContent, 10) + fixedScores[lines.length];
      }

      // changing level based on score
      const intScore = parseInt(this.score.textContent, 10);
      if (intScore >= levelTargets.level1.score && currentLevel == 1) {
        // gameSpeed = levels[1];
        setGameSpeed(levels[1]);
        this.levelElement.textContent = parseInt(this.levelElement.textContent, 10) + 1;
        // currentLevel++;
        incCurrentLevel();
        // levelIncreased = true;
        setLevelIncreased(true);
      }
      if (intScore >= levelTargets.level2.score && currentLevel == 2) {
        // gameSpeed = levels[2];
        setGameSpeed(levels[2]);
        this.levelElement.textContent = parseInt(this.levelElement.textContent, 10) + 1;
        // currentLevel++;
        incCurrentLevel();
        // levelIncreased = true;
        setLevelIncreased(true);
      }
      if (intScore >= levelTargets.level3.score && currentLevel == 3) {
        // gameSpeed = levels[3];
        setGameSpeed(levels[3]);
        this.levelElement.textContent = parseInt(this.levelElement.textContent, 10) + 1;
        // currentLevel++;
        incCurrentLevel();
        // levelIncreased = true;
        setLevelIncreased(true);
      }

      // game won
      if (
        (
          tetrisCount >= levelTargets.level4.tcount
            || parseInt(this.score.textContent, 10) >= levelTargets.level4.score
        ) && currentLevel == 4) {
        // isGameWon = true;
        setIsGameWon(true);
      }
    }
    return 1;
  }

  static rotate(piece) {
    // Clone with JSON for immutability.
    const p = JSON.parse(JSON.stringify(piece));

    // Transpose matrix
    for (let y = 0; y < p.shape.length; y += 1) {
      for (let x = 0; x < y; x += 1) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }

    // Reverse the order of the columns.
    p.shape.forEach((row) => row.reverse());
    return p;
  }

  isGameFinished() {
    const sum = well[1].reduce((a, b) => a + b, 0);
    if (sum > 0) {
      // isGameOver = true;
      setIsGameOver(true);
    }
  }
}
