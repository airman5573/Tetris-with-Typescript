import { tryMove } from '../utils';
import { Tetris } from '../types';

const blockControl = {
  rotate: () => { // 위키를 누르면 블럭이 회전한다
    const {states, components: {$matrix}} = window.tetris;
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
    const {states, components: {$matrix}} = window.tetris;
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
    const {states, components: {$matrix}} = window.tetris;
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
    const {states, components: {$matrix}} = window.tetris;
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
    const {states, stateManager, components: {$matrix}} = window.tetris;
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
  up: () => {
    const {components: {$speed}} = window.tetris; 
    $speed.updateSpeed(-100);
  },
  down: () => {
    const {components: {$speed}} = window.tetris; 
    $speed.updateSpeed(100);
  }
};

const startLineControl = {
  up: () => {
    const {components: {$startLines}} = window.tetris; 
    $startLines.updateStartLines(-1);
  },
  down: () => {
    const {components: {$startLines}} = window.tetris; 
    $startLines.updateStartLines(1);
  }
};

const gameControl = {
  start: () => {
    const {stateManager} = window.tetris; 
    stateManager.run();
  }
}

export {blockControl, speedControl, startLineControl, gameControl}