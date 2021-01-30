import Block from './block';
import { blankLine } from '../const';
import { Tetris } from '../types';
import { deepCopy, tryMove } from '../utils';

class Matrix {
  matrixNode: HTMLDivElement;
  count: number = 0;
  timer: NodeJS.Timeout;
  width: 10;
  constructor() {
    this.matrixNode = document.querySelector(".game-screen > .matrix");
    for (let i = 0; i < 20; i++) {
      const $p = document.createElement("p");
      for (let j = 0; j < 10; j++) {
        $p.appendChild(document.createElement("b"));
      }
      this.matrixNode.appendChild($p);
    }
  }
  init = () => {
    this.matrixNode.childNodes.forEach((line) => {
      line.childNodes.forEach((block: HTMLDivElement) => {
        block.className = 'b';
      });
    });
  }
  autoDown = () => {
    const states = window.tetris.states;
    const stateManager = window.tetris.stateManager;
    const fall = () => {
      if (states.lock == true) { return }
      let currentBlock = states.currentBlock;
      const nextBlock = currentBlock.fall();
      if (tryMove(states.matrix, nextBlock)) {
        this.render(this.addBlock(states.matrix, nextBlock)); // 핵심은 여기서 update 된 matrix를 gameState.matrixState 에 넣지 않는다는거~
        states.currentBlock = nextBlock;
        this.timer = setTimeout(fall, states.speed);
      } else {
        // 다음 블럭이 못가면, 현재 블럭을 matrixState에 고정(?) 시킨다
        states.matrix = this.addBlock(states.matrix, currentBlock);
        stateManager.nextAround();
      }
    }
  }
  addBlock = (matrix: Tetris.MatrixState, $block: Block): Tetris.MatrixState => {
    const {yx, shape} = $block;
    const newMatrixState = deepCopy(matrix);
    shape.forEach((line, i) => {
      line.forEach((blockState, j) => {
        const y = yx[0]+i;
        const x = yx[1]+j;
        if (y < 0 || y >= 20 || x < 0 || x >= 10) { return }
        if (blockState == 1) {
          if (newMatrixState[y][x] == 0) { newMatrixState[y][x] = 1; }
        }
      });
    });
    return newMatrixState;
  }
  clearLines = (lines: number[], callback: (point: number)=>void): void => {
    const stateManager = window.tetris.stateManager;
    stateManager.lock(); // 잠그고
    this.animateLines(lines, () => {
      let newMatrix = deepCopy(window.tetris.states.matrix);
      lines.forEach(n => {
        newMatrix.splice(n, 1);
        newMatrix.unshift(blankLine);
      });
      window.tetris.states.matrix = newMatrix;
      this.render();
      callback(lines.length * 50);
      stateManager.unlock(); // 풀어준다
      stateManager.nextAround();
    });
  }
  animateLines = (lines: number[], callback: () => void) => {
    this.render(this.setLine(lines, 2));
    setTimeout(() => {
      this.render(this.setLine(lines, 0));
      setTimeout(() => {
        this.render(this.setLine(lines, 2));
        setTimeout(() => {
          this.render(this.setLine(lines, 0));
          callback();
        }, 150);
      }, 150);
    }, 150);
  }
  setLine = (lines: number[], blockState: number) => {
    const states = window.tetris.states;
    const matrix = deepCopy(states.matrix);
    lines.forEach(i => {
      matrix[i] = Array(this.width).fill(blockState);
    });
    return matrix;
  }
  reset = (callback?: () => void) => {
    const tetris = window.tetris;
    const states = tetris.states;
    const animateLine = (index: number) => {
      if (index < 20) {
        const i = 20 - (index + 1)
        states.matrix[i] = Array(this.width).fill(1);
        this.render();
      } else if (index < 40) {
        const i = index - 20;
        states.matrix[i] = Array(this.width).fill(0);
        this.render();
      }
      // 마지막에 index가 40이라면, 즉 다 끝났다면!
      else {
        if (callback) { callback(); }
      }
    }
    for (let i = 0; i <= 40; i++) {
      setTimeout(animateLine.bind(null, i), 40 * (i+1));
    }
  }
  render = (matrix = window.tetris.states.matrix) => {
    this.init(); // 초기상태로 만들고 시작하자
    
  } 
}

export default Matrix;