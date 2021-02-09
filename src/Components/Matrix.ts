import Block from './block';
import { blankLine, blockColors } from '../const';
import { Tetris } from '../types';
import { deepcopy, getClearLines, tryMove, mergeBlock } from '../utils';

class Matrix {
  matrixNode: HTMLDivElement;
  timer: NodeJS.Timeout;
  width: number = 10;
  animateColor: number = 1;
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
  autoDown = (initDelay: number = 0) => {
    const fall = () => {
      const {states: {lock, currentBlock, matrix, speed}, stateManager} = window.tetris;
      if (lock == true) { return }
      if (currentBlock === null) { return }
      const nextBlock = currentBlock.fall();
      if (tryMove(matrix, nextBlock)) {
        this.moveBlock(matrix, nextBlock);
        this.timer = setTimeout(fall, speed);
      } else {
        const newMatrix = mergeBlock(matrix, currentBlock); 
        stateManager.nextAround(newMatrix);
      }
    }
    clearTimeout(this.timer);
    setTimeout(() => { fall(); }, (initDelay));
  }
  moveBlock = (matrix: Tetris.MatrixState, block: Block) => {
    this.render(mergeBlock(matrix, block));
    window.tetris.stateManager.updateCurrentBlock(block);
  }
  clearLines = (matrix: Tetris.MatrixState, lines: number[]) => {
    let newMatrix = deepcopy(matrix);
    return new Promise<Tetris.MatrixState>(async (resolve, reject) => {
      await this.animateLines(newMatrix, lines);
      lines.forEach(n => {
        newMatrix.splice(n, 1);
        newMatrix.unshift(Array(10).fill(blockColors.GRAY));
      });
      resolve(newMatrix);
    });
  }
  animateLines = (matrix: Tetris.MatrixState, lines: number[]) => {
    return new Promise<void>(async (resolve) => {
      await this.changeLineColor(matrix, lines, 2, 0);
      await this.changeLineColor(matrix, lines, 0, 200);
      await this.changeLineColor(matrix, lines, 2, 200);
      await this.changeLineColor(matrix, lines, 0, 200);
      resolve();
    });
  }
  changeLineColor = (matrix: Tetris.MatrixState, lines: number[], color: number, sec: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.render(this.setLine(matrix, lines, color));
        resolve();
      }, sec);
    });
  }
  setLine = (matrix: Tetris.MatrixState, lines: number[], blockState: number) => {
    matrix = deepcopy(matrix);
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