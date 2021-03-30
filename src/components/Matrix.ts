import PQueue from 'p-queue';
import Block from './common/Block';
import { blockColors, speeds } from '../const';
import { Tetris } from '../types';
import { deepcopy, tryMove, mergeBlock } from '../utils';

class Matrix implements Tetris.IMatrix {
  matrixNode: HTMLDivElement;

  timer: NodeJS.Timeout;

  queue: PQueue;

  width = 10;

  animateColor: Tetris.BlockColor = 1;

  constructor() {
    this.matrixNode = document.querySelector('.game-screen > .matrix');
    this.queue = new PQueue({ concurrency: 1 });
    /**
     * HTML로 다 쓰기가 귀찮아서 element를 만들어서 붙임
     */
    for (let i = 0; i < 20; i += 1) {
      const $p = document.createElement('p');
      for (let j = 0; j < 10; j += 1) {
        $p.appendChild(document.createElement('b'));
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

  /**
   * timer를 돌려서 speed초마다 currentBlock을 한칸씩 내린다
   * @param startDelay
   * 맨 처음에 블럭을 내리는데 딜레이를 주고싶을때 사용한다
   */
  autoDown = (startDelay?: number) => {
    if (startDelay !== undefined && startDelay < 0) startDelay = 0;
    const speed = speeds[window.tetris.states.speedStep - 1];
    const fall = () => {
      const { states: { lock, currentBlock, matrix }, stateManager } = window.tetris;
      if (lock === true) { return; }
      if (currentBlock === null) { return; }
      const nextBlock = currentBlock.fall();
      /**
       * 내려 갈수 있으면 한칸 내려가고(global matrix인 states.matrix에 이 내려간 currentBlock이 반영되는건 아니다)
       * 다시 타이머를 돌린다
       * 매 autoDown마다 clearTimeout을 호출하기 때문에 setTimeout이 중첩되서 블럭이 막 빠르게 툭툭툭툭 계속 떨어질일은 없다
       */
      if (tryMove(matrix, nextBlock)) {
        this.moveBlock(matrix, nextBlock);
        this.timer = setTimeout(fall, speed);
      } else {
        stateManager.nextAround();
      }
    };
    /**
     * 어떤 특정 조건이 발생해서 this.timer를 제거하는게 아니라 그냥 autoDown이 호출될 때마다
     * 계속 timer를 제거하고 또 timer를 새로 만드는 이유는
     * 혹여라도 autoDown이 중복 호출되서 timer가 중첩되는일을 방지하기 위함이다
     * 그래서 autoDown은 언제나 하나의 타이머만 돌린다
     */
    clearTimeout(this.timer);
    this.timer = setTimeout(fall, (startDelay === undefined || startDelay < 0) ? speed : startDelay);
  }

  moveBlock = (matrix: Tetris.MatrixState, block: Block) => {
    this.render(mergeBlock(matrix, block));
    /**
     * 한칸 내렸으니까 states.currentBlock도 그 내려간 block으로 업데이트 해준다
     */
    window.tetris.stateManager.updateCurrentBlock(block);
  }

  /**
   * 꽉찬 라인을 지운다
   * async await문법을 사용하는게 더 읽기 좋은 코드가 되기때문에 Promise를 return했다
   * @param matrix
   * 꽉찬 라인이 반영되어 있는 matrix
   * @param lines
   * 몇번째 라인을 지워야 하는지 담겨있다
   */
  clearLines = async (matrix: Tetris.MatrixState, lines: number[]) => {
    const newMatrix = deepcopy(matrix);
    await this.blinkLines(newMatrix, lines);
    lines.forEach((n) => {
      newMatrix.splice(n, 1);
      newMatrix.unshift(Array(10).fill(blockColors.GRAY));
    });
    return newMatrix;
  }

  /**
   * 라인에 반짝반짝 애니메이션을 넣어주는 역할을한다
   * 이것도 callback hall에 빠지는게 싫어서 async await문법을 위해 Promise를 return했다
   * @param matrix
   * 꽉찬 라인이 있는 matrix
   *
   * @param lines
   * 지울 lines이 담겨있다.
   */
  blinkLines = (matrix: Tetris.MatrixState, lines: number[]) => new Promise<void>((resolve) => {
    this.queue.add(this.changeLineColor.bind(this, matrix, lines, blockColors.RED, 0));
    this.queue.add(this.changeLineColor.bind(this, matrix, lines, blockColors.GRAY, 200));
    this.queue.add(this.changeLineColor.bind(this, matrix, lines, blockColors.RED, 200));
    this.queue.add(this.changeLineColor.bind(this, matrix, lines, blockColors.GRAY, 200));
    this.queue.start();
    this.queue.on('idle', () => {
      resolve();
    });
  });

  changeLineColor = (
    matrix: Tetris.MatrixState,
    lines: number[],
    color: Tetris.BlockColor,
    sec: number,
  ) => new Promise<void>((resolve) => {
    setTimeout(() => {
      this.render(this.setLine(matrix, lines, color));
      resolve();
    }, sec);
  });

  setLine = (matrix: Tetris.MatrixState, lines: number[], color: Tetris.BlockColor) => {
    matrix = deepcopy(matrix);
    lines.forEach((i) => {
      matrix[i] = Array(this.width).fill(color);
    });
    return matrix;
  }

  /**
   * isOver에 걸리거나, reset을 누를때 matrix는 reset된다
   * 좌라라락 라인이 올라갔다가 좌라라락 내려오는 애니메이션을 수행한다
   * @param callback
   */
  reset = () => new Promise<void>((resolve1) => {
    const { tetris } = window;
    const { states } = tetris;
    const animateLine = (index: number) => {
      if (index < 20) {
        const i = 20 - (index + 1);
        states.matrix[i] = Array(this.width).fill(1);
        this.render();
      } else if (index < 40) {
        const i = index - 20;
        states.matrix[i] = Array(this.width).fill(0);
        this.render();
      }
    };
    const queue = new PQueue({ concurrency: 1 });
    for (let i = 0; i < 40; i += 1) {
      queue.add(() => new Promise<void>((resolve2) => {
        setTimeout(() => {
          animateLine(i);
          resolve2();
        }, 50);
      }));
    }
    queue.start();
    queue.on('idle', () => {
      resolve1();
    });
  });

  render = (matrix = window.tetris.states.matrix) => {
    for (let i = 0; i < matrix.length; i += 1) {
      const line = this.matrixNode.childNodes[i];
      for (let j = 0; j < matrix[i].length; j += 1) {
        const block = line.childNodes[j] as HTMLElement;
        block.className = '';
        if (matrix[i][j] === 1) block.className = 'b black';
        else if (matrix[i][j] === 2) block.className = 'b red';
      }
    }
  }
}

export default Matrix;
