import {
  shake, tryMove, mergeBlock, isInGame,
} from '../utils';
import { delays, speeds } from '../const';
import { Tetris } from '../types';

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
    const {
      states: { currentBlock, matrix }, stateManager, components: { $matrix }, music,
    } = tetris;
    console.log(music);
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

const soundControl = {
  on: () => {
    const { $sound } = window.tetris.components;
    $sound.on();
  },
  off: () => {
    const { $sound } = window.tetris.components;
    $sound.off();
  },
};

const gameControl = {
  start: () => { window.tetris.stateManager.start(); },
  pause: () => { window.tetris.stateManager.pause(); },
  unpause: () => { window.tetris.stateManager.unpause(); },
  reset: () => { window.tetris.stateManager.reset(); },
};

const callbacks: {[k in Tetris.KeyType] : Tetris.IKeyControl} = {
  arrowUp: {
    keyType: 'arrowUp',
    down() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.down({
        keyType: this.keyType,
        callback: (isInGame()) ? blockControl.rotate : speedControl.up,
        once: true,
      });
    },
    up() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.up({
        keyType: this.keyType,
      });
    },
  },
  arrowRight: {
    keyType: 'arrowRight',
    down() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.down({
        keyType: this.keyType,
        callback: (isInGame()) ? blockControl.right : startLineControl.up,
        once: !isInGame(),
      });
    },
    up() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.up({
        keyType: this.keyType,
      });
    },
  },
  arrowDown: {
    keyType: 'arrowDown',
    down() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.down({
        begin: 60,
        interval: 80,
        keyType: this.keyType,
        callback: (stopDownTrigger?: () => void) => {
          // currentBlock이 있으면 블럭을 아래로 내리라는거고
          if (isInGame()) {
            // 여기로 넘어간 stopDownTrigger는 down에서 호출되는게 아니라
            // down에서 currentBlock이 더이상 내려갈 곳이 없을때 nextRound에서 호출되는겨
            blockControl.down(stopDownTrigger);
          } else {
            // block이 없으면 (게임시작전에) speed를 컨트롤 하는거지
            speedControl.down();
          }
        },
        once: !isInGame(),
      });
    },
    up() {
      const { states, keyEventProcessor } = window.tetris;
      if (states.lock === true) return;
      keyEventProcessor.up({
        keyType: this.keyType,
      });
    },
  },
  arrowLeft: {
    keyType: 'arrowUp',
    down() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.down({
        keyType: this.keyType,
        callback: (isInGame()) ? blockControl.left : startLineControl.down,
        once: !isInGame(),
      });
    },
    up() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.up({
        keyType: this.keyType,
      });
    },
  },
  p: {
    keyType: 'p',
    down() {
      const { states: { pause }, keyEventProcessor } = window.tetris;
      let callback;
      if (isInGame()) {
        if (pause) callback = gameControl.unpause;
        else callback = gameControl.pause;
      }
      keyEventProcessor.down({
        keyType: this.keyType,
        callback,
        once: true,
      });
    },
    up() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.up({
        keyType: this.keyType,
      });
    },
  },
  r: {
    keyType: 'r',
    down() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.down({
        keyType: this.keyType,
        callback: gameControl.reset,
        once: true,
      });
    },
    up() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.up({
        keyType: this.keyType,
        callback: null,
      });
    },
  },
  space: {
    keyType: 'space',
    down() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.down({
        keyType: this.keyType,
        callback: (isInGame()) ? blockControl.drop : gameControl.start,
        once: true,
      });
    },
    up() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.up({
        keyType: this.keyType,
      });
    },
  },
  s: {
    keyType: 's',
    down() {
      const { keyEventProcessor, states } = window.tetris;
      keyEventProcessor.down({
        keyType: this.keyType,
        callback: states.sound === false ? soundControl.on : soundControl.off,
        once: true,
      });
    },
    up() {
      const { keyEventProcessor } = window.tetris;
      keyEventProcessor.up({
        keyType: this.keyType,
      });
    },
  },
};

export default callbacks;
