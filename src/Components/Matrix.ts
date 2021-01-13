import Block from './block';
import { blankLine } from '../const';
import { Tetris } from '../types';
import { deepCopy, tryMove } from '../utils';

class Matrix {
  matrixNode: HTMLDivElement;
  count: number = 0;
  timer: NodeJS.Timeout;
  constructor() {
    this.matrixNode = document.querySelector(".game-screen > .matrix > .inner");
  }
  removeChildren = (parentNode: HTMLDivElement) => {
    parentNode.childNodes.forEach((line) => {
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
        this.render(this.addBlock(gs.matrix, nextBlock)); // 핵심은 여기서 update 된 matrix를 gameState.matrixState 에 넣지 않는다는거~
        gs.currentBlock = nextBlock;
        this.timer = setTimeout(fall, gs.speed);
      } else {
        // 다음 블럭이 못가면, 현재 블럭을 matrixState에 고정(?) 시킨다
        gs.matrixState = this.addBlock(gs.matrixState, currentBlock);
        stateManager.nextAround();
      }
    }
  }
  render = (matrix?: Tetris.MatrixState) => {
    if (matrix == undefined) { matrix = window.tetris.states.matrix; }
    this.removeChildren(this.matrixNode); // 비우고 시작하자
    matrix.forEach((line: Tetris.Line) => {
      const lineNode = document.createElement("div");
      lineNode.className = 'line';
      line.forEach(blockState => {
        const blockNode = document.createElement("div");
        blockNode.className = 'b';
        if (blockState === 1) { blockNode.classList.add("active"); }
        else if (blockState === 2) { blockNode.classList.add("blink"); }
        lineNode.appendChild(blockNode);
      });
      this.matrixNode.appendChild(lineNode);
    });
  }
}

export default Matrix;