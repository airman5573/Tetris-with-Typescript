import { shake, tryMove, mergeBlock } from '../utils';
import { delays, speeds } from '../const';

const blockControl = {
  rotate: () => { // 위키를 누르면 블럭이 회전한다
    const { states, components: { $matrix } } = window.tetris;
    if (states.currentBlock === null) return;
    const nextBlock = states.currentBlock.rotate();
    if (tryMove(states.matrix, nextBlock)) {
      const nextMatrix = mergeBlock(states.matrix, nextBlock);
      $matrix.render(nextMatrix);
      states.currentBlock = nextBlock;
    }
  },
  down: (stopDownTrigger: () => void) => {
    const { tetris } = window;
    const { states: { currentBlock, matrix }, stateManager, components: { $matrix } } = tetris;
    if (currentBlock === null) return;
    const nextBlock = currentBlock.fall();
    // 갈수있으면 가고,
    if (tryMove(matrix, nextBlock)) {
      // 한번 띡 가고
      $matrix.moveBlock(matrix, nextBlock);
      // 왜 autoDown에게 일을 또 맡기는걸까? 이 down함수는 계속 실행될텐데,,,
      $matrix.autoDown();
    } else {
      stateManager.nextAround(stopDownTrigger);
    }
  },
  right: () => {
    const { states: { currentBlock, matrix, speedStep }, components: { $matrix } } = window.tetris;
    if (currentBlock === null) return;
    const nextBlock = currentBlock.right();
    // 갈수있으면 가고, 못가면 어쩔 수 없고
    const delay = delays[speedStep - 1];
    let timestamp;
    if (tryMove(matrix, nextBlock)) {
      nextBlock.timestamp += delay;
      timestamp = nextBlock.timestamp;
      $matrix.moveBlock(matrix, nextBlock);
    } else {
      currentBlock.timestamp += Math.floor(delay / 1.5);
      timestamp = currentBlock.timestamp;
      $matrix.moveBlock(matrix, currentBlock);
    }
    const remain = speeds[speedStep - 1] - (Date.now() - timestamp);
    $matrix.autoDown(remain);
  },
  left: () => {
    const { states: { currentBlock, matrix, speedStep }, components: { $matrix } } = window.tetris;
    if (currentBlock === null) return;
    const nextBlock = currentBlock.left();
    // 갈수있으면 가고, 못가면 어쩔 수 없고
    const delay = delays[speedStep - 1];
    let timestamp;
    if (tryMove(matrix, nextBlock)) {
      nextBlock.timestamp += delay;
      $matrix.moveBlock(matrix, nextBlock);
      timestamp = nextBlock.timestamp;
    } else {
      currentBlock.timestamp += Math.floor(delay / 1.5);
      $matrix.moveBlock(matrix, currentBlock);
      timestamp = currentBlock.timestamp;
    }
    const remain = speeds[speedStep - 1] - (Date.now() - timestamp);
    $matrix.autoDown(remain);
  },
  drop: () => {
    const { tetris } = window;
    const { states, states: { currentBlock, matrix }, stateManager } = tetris;
    if (currentBlock === null) return;
    let bottom = currentBlock;
    for (let n = 1; n < 20; n += 1) {
      bottom = currentBlock.fall(n);
      if (tryMove(matrix, bottom) === false) {
        bottom = currentBlock.fall(n - 1);
        break;
      }
    }
    states.currentBlock = bottom;
    shake();
    stateManager.nextAround();
  },
};

const speedControl = {
  up: () => {
    const { states, components: { $speed } } = window.tetris;
    states.speedStep = states.speedStep < speeds.length ? states.speedStep + 1 : speeds.length;
    $speed.render(speeds[states.speedStep - 1]);
  },
  down: () => {
    const { states, components: { $speed } } = window.tetris;
    states.speedStep = states.speedStep > 1 ? states.speedStep - 1 : 1;
    $speed.render(speeds[states.speedStep - 1]);
  },
};

const startLineControl = {
  up: () => {
    const { components: { $startLines } } = window.tetris;
    $startLines.up();
  },
  down: () => {
    const { components: { $startLines } } = window.tetris;
    $startLines.down();
  },
};

const gameControl = {
  start: () => { window.tetris.stateManager.run(); },
  pause: () => { window.tetris.stateManager.pause(); },
  unpause: () => { window.tetris.stateManager.unpause(); },
  reset: () => { window.tetris.stateManager.reset(); },
};

export {
  blockControl, speedControl, startLineControl, gameControl,
};
