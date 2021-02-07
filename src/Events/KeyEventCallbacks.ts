import { shake, tryMove } from '../utils';
import { Tetris } from '../types';

const blockControl = {
  rotate: () => { // 위키를 누르면 블럭이 회전한다
    const {states, components: {$matrix}} = window.tetris;
    if (states.lock === true) {return}
    if (states.currentBlock == null) {return}
    const nextBlock = states.currentBlock.rotate();
    if (tryMove(states.matrix, nextBlock)) {
      const nextMatrix = $matrix.mergeBlock(states.matrix, nextBlock);
      $matrix.render(nextMatrix);
      states.currentBlock = nextBlock;
    }
  },
  down: (callback: () => void) => {
    const tetris = window.tetris;
    const {states: {currentBlock, matrix}, stateManager, components: {$matrix}} = tetris;
    if (currentBlock == null) { return }
    const nextBlock = currentBlock.fall();
    // 갈수있으면 가고,
    if (tryMove(matrix, nextBlock)) {
      $matrix.moveBlock(matrix, nextBlock);
      callback();
    } else {
      // 못가면 반짝 하고 고정시켜야지!
      // stateManager.nextAround()
    }
  },
  right: () => {
    const {states: {lock, currentBlock, matrix}, components: {$matrix}} = window.tetris;
    if (lock === true) {return}
    if (currentBlock == null) {return}
    const nextBlock = currentBlock.right();
    // 갈수있으면 가고, 못가면 어쩔 수 없고
    if (tryMove(matrix, nextBlock)) {
      $matrix.moveBlock(matrix, nextBlock);
    }
  },
  left: () => {
    const {states: {lock, currentBlock, matrix}, components: {$matrix}} = window.tetris;
    if (lock === true) {return}
    if (currentBlock == null) {return}
    const nextBlock = currentBlock.left();
    // 갈수있으면 가고, 못가면 어쩔 수 없고
    if (tryMove(matrix, nextBlock)) {
      $matrix.moveBlock(matrix, nextBlock);
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
    // 떨궜으니까 반짝 반짝 안하노?
    
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