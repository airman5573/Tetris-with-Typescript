import { shake, tryMove, mergeBlock } from '../utils';
import { Tetris } from '../types';

const blockControl = {
  rotate: () => { // 위키를 누르면 블럭이 회전한다
    const {states, components: {$matrix}} = window.tetris;
    if (states.lock === true) {return}
    if (states.currentBlock == null) {return}
    const nextBlock = states.currentBlock.rotate();
    if (tryMove(states.matrix, nextBlock)) {
      const nextMatrix = mergeBlock(states.matrix, nextBlock);
      $matrix.render(nextMatrix);
      states.currentBlock = nextBlock;
    }
  },
  down: (stopDownTrigger: () => void) => {
    const tetris = window.tetris;
    const {states: {currentBlock, matrix}, stateManager, components: {$matrix}} = tetris;
    if (currentBlock == null) { return }
    const nextBlock = currentBlock.fall();
    // 갈수있으면 가고,
    if (tryMove(matrix, nextBlock)) {
      // 한번 띡 가고
      $matrix.moveBlock(matrix, nextBlock);
      // 왜 autoDown에게 일을 또 맡기는걸까? 이 down함수는 계속 실행될텐데,,,
      $matrix.autoDown();
    } else {
      // 못가면? 다음 블럭으로 넘어가야지
      const newMatrix = mergeBlock(matrix, currentBlock);
      stateManager.nextAround(newMatrix, stopDownTrigger);
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