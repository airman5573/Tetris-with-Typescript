import { shake, tryMove } from '../utils';
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
    const tetris = window.tetris;
    const {states, states: {lock, currentBlock, matrix}, stateManager, components: {$matrix}} = tetris;
    if (lock === true) {return}
    if (currentBlock == null) {return}
    let bottom = currentBlock;
    for(var n = 1; n < 20; n++) {
      bottom = currentBlock.fall(n);
      if (tryMove(matrix, bottom) == false) {
        bottom = currentBlock.fall(n-1);
        break
      }
    }
    bottom.blink(matrix, $matrix, () => {
      states.matrix = $matrix.addBlock(matrix, bottom);
      $matrix.render(states.matrix);
      shake();
      stateManager.nextAround();
    });
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