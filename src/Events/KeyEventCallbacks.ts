import { tryMove } from '../utils';
import { Tetris } from '../types';

const tetris = window.tetris;
const [states, components, stateManager] = [tetris.states, tetris.components, tetris.stateManager];
const {$matrix, $speed, $startLines} = components;

const blockControl = {
  rotate: () => { // 위키를 누르면 블럭이 회전한다
    if (states.lock === true) {return}
    if (states.currentBlock == null) {return}
    const nextBlock = states.currentBlock.rotate();
    if (tryMove(states.matrix, nextBlock)) {
      const nextMatrix = $matrix.addBlock(states.matrix, nextBlock);
      $matrix.render(nextMatrix);
      states.currentBlock = nextBlock;
    }
  },
  down: () => {
    if (states.currentBlock == null) { return }
    const nextBlock = states.currentBlock.fall();
    // 갈수있으면 가고, 못가면 어쩔 수 없고
    if (tryMove(states.matrix, nextBlock)) {
      const nextMatrix = $matrix.addBlock(states.matrix, nextBlock);
      $matrix.render(nextMatrix);
      states.currentBlock = nextBlock;
    }
  },
  right: () => {
    if (states.lock === true) {return}
    if (states.currentBlock == null) {return}
    const nextBlock = states.currentBlock.right();
    // 갈수있으면 가고, 못가면 어쩔 수 없고
    if (tryMove(states.matrix, nextBlock)) {
      const nextMatrix = $matrix.addBlock(states.matrix, nextBlock);
      $matrix.render(nextMatrix);
      states.currentBlock = nextBlock;
    }
  },
  left: () => {
    if (states.lock === true) {return}
    if (states.currentBlock == null) {return}
    const nextBlock = states.currentBlock.left();
    // 갈수있으면 가고, 못가면 어쩔 수 없고
    if (tryMove(states.matrix, nextBlock)) {
      const nextMatrix = $matrix.addBlock(states.matrix, nextBlock);
      $matrix.render(nextMatrix);
      states.currentBlock = nextBlock;
    }
  },
  drop: () => {
    if (states.lock === true) {return}
    if (states.currentBlock == null) {return}
    let bottom = states.currentBlock;
    for(var n = 1; n < 20; n++) {
      bottom = states.currentBlock.fall(n);
      if (tryMove(states.matrix, bottom) == false) {
        bottom = states.currentBlock.fall(n-1);
        break
      }
    }
    states.currentBlock = bottom;
    states.matrix = $matrix.addBlock(states.matrix, states.currentBlock);
    $matrix.render(states.matrix);
    stateManager.nextAround();
  }
};

const speedControl = {
  up: () => { $speed.updateSpeed(-100); },
  down: () => { $speed.updateSpeed(100); }
};

const startLineControl = {
  up: () => { $startLines.updateStartLines(-1); },
  down: () => { $startLines.updateStartLines(1); }
};

const gameControl = {
  start: () => { stateManager.start(); }
}

export {blockControl, speedControl, startLineControl, gameControl}