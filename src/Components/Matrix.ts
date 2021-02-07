import Block from './block';
import { blankLine } from '../const';
import { Tetris } from '../types';
import { deepCopy, tryMove } from '../utils';

class Matrix {
  matrixNode: HTMLDivElement;
  timer: NodeJS.Timeout;
  width: number = 10;
  constructor() {
    this.matrixNode = document.querySelector(".game-screen > .matrix");
    for (let i = 0; i < 20; i++) {
      const $p = document.createElement("p");
      for (let j = 0; j < 10; j++) {
        $p.appendChild(document.createElement("b"));
      }
      this.matrixNode.appendChild($p);
    }
    this.init();
  }
  init = () => {
    this.matrixNode.childNodes.forEach((line) => {
      line.childNodes.forEach((block: HTMLDivElement) => {
        block.className = '';
      });
    });
  }
  autoDown = () => {
    const fall = () => {
      const {states: {lock, currentBlock, matrix, speed}, stateManager} = window.tetris;
      if (lock == true) { return }
      if (currentBlock === null) { return }
      const nextBlock = currentBlock.fall();
      if (tryMove(matrix, nextBlock)) {
        this.moveBlock(matrix, nextBlock);
        this.timer = setTimeout(fall, speed);
      } else {
        let newMatrix = [];
        const {shape, yx} = currentBlock;
        
        stateManager.nextAround();
      }
    }
    fall();
  }
  moveBlock = (matrix: Tetris.MatrixState, nextBlock: Block) => {
    this.render(this.addBlock(matrix, nextBlock));
    window.tetris.stateManager.updateCurrentBlock(nextBlock);
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
  clearLines = (lines: number[], updatePoint: (point: number)=>void) => {
    const {stateManager, states: {matrix}} = window.tetris;
    stateManager.lock(); // 잠그고
    this.animateLines(lines, () => {
      lines.forEach(n => {
        matrix.splice(n, 1);
        matrix.unshift(blankLine);
      });
      this.render();
      updatePoint(lines.length * 50);
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
    const matrix = deepCopy(window.tetris.states.matrix);
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
    for(let i = 0; i < matrix.length; i++) {
      const line = this.matrixNode.childNodes[i];
      for(let j = 0; j < matrix[i].length; j++) {
        const block = line.childNodes[j] as HTMLElement;
        block.className = matrix[i][j] == 1 ? 'b black' : (matrix[i][j] == 2 ? 'b red' : '');
      }
    }
  }
}

export default Matrix;